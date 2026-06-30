/**
 * YEssential - CachePool 共享缓存池模块
 * ============================================================
 * 解决问题：跨模块直接调用无缓存，等价于 CPU 多核走总线无 L-Cache
 * 每次 conf.get() / lang.get() 都触发磁盘 I/O，高频调用时开销爆炸
 *
 * 方案：在各模块与底层 JsonConfigFile 之间加一层内存缓存
 *   ┌──────────┐   cache hit   ┌───────────┐
 *   │  Module  │ ────────────▶ │ CachePool │
 *   └──────────┘               └─────┬─────┘
 *                               miss │ (只在 TTL 过期才触发)
 *                                    ▼
 *                             ┌─────────────────┐
 *                             │ JsonConfigFile   │  (磁盘 I/O)
 *                             └─────────────────┘
 *
 * 使用：在 YEssential.js 的 globalThis 注入后，模块通过
 *   globalThis.CachePool.conf(key)
 *   globalThis.CachePool.lang(key)
 * 代替直接的 conf.get(key) / lang.get(key)
 */

"use strict";

(function () {

    // ── 通用 TTL 缓存桶 ─────────────────────────────────────────
    class TTLCache {
        /**
         * @param {number} ttlMs   缓存有效期（毫秒），0 = 永不过期
         * @param {number} maxSize LRU 最大容量
         */
        constructor(ttlMs = 5000, maxSize = 512) {
            this._ttl     = ttlMs;
            this._max     = maxSize;
            this._map     = new Map(); // key → { value, ts }
            this._hits    = 0;
            this._misses  = 0;
        }

        get(key) {
            const entry = this._map.get(key);
            if (!entry) { this._misses++; return undefined; }
            if (this._ttl > 0 && Date.now() - entry.ts > this._ttl) {
                this._map.delete(key);
                this._misses++;
                return undefined;
            }
            // LRU: 访问时移到末尾
            this._map.delete(key);
            this._map.set(key, entry);
            this._hits++;
            return entry.value;
        }

        set(key, value) {
            // LRU 淘汰
            if (this._map.size >= this._max) {
                this._map.delete(this._map.keys().next().value);
            }
            this._map.set(key, { value, ts: Date.now() });
        }

        /** 精确删除某个 key */
        invalidate(key) { this._map.delete(key); }

        /** 删除所有匹配前缀的 key（用于批量失效） */
        invalidatePrefix(prefix) {
            for (const k of this._map.keys()) {
                if (k.startsWith(prefix)) this._map.delete(k);
            }
        }

        /** 清空全部 */
        clear() { this._map.clear(); }

        stats() {
            const total = this._hits + this._misses;
            return {
                size    : this._map.size,
                hits    : this._hits,
                misses  : this._misses,
                hitRate : total ? ((this._hits / total) * 100).toFixed(1) + "%" : "N/A",
            };
        }
    }

    // ── CachePool 主体 ──────────────────────────────────────────
    const CachePool = {

        /**
         * conf 配置缓存 (TTL 5s，适合服务器运行期间配置不频繁变动的场景)
         * 若需要立即生效，调用 CachePool.invalidateConf(key)
         */
        _confCache : new TTLCache(5000, 256),

        /**
         * lang 语言缓存 (永不过期，语言文件只在 reload 时才会变化)
         * reload 后调用 CachePool.clearLang()
         */
        _langCache : new TTLCache(0, 1024),

        /**
         * 在线玩家列表缓存 (TTL 1s，避免高频事件重复调用 mc.getOnlinePlayers)
         */
        _playerListCache : new TTLCache(1000, 1),
        _PLAYER_LIST_KEY : "__online__",

        /**
         * Warp 列表缓存 (TTL 3s，warpdata.read() 是全文件读，需要拦截)
         * warp 增删后主动调用 invalidateWarpList()
         */
        _warpListCache   : new TTLCache(3000, 1),
        _WARP_LIST_KEY   : "__warp_list__",

        // ── conf 访问 ──────────────────────────────────────────
        /**
         * 带缓存的 conf.get(key)
         * @param {string}    key       配置键
         * @param {JsonConfigFile} confFile 底层配置文件对象（从 globalThis.conf 获取）
         * @returns {*}
         */
        conf(key, confFile) {
            const src = confFile || globalThis.conf;
            if (!src) return undefined;
            const cacheKey = "conf:" + key;
            let v = this._confCache.get(cacheKey);
            if (v === undefined) {
                v = src.get(key);
                // null 也要缓存（避免反复穿透）
                this._confCache.set(cacheKey, v === undefined ? null : v);
            }
            return v === null ? undefined : v;
        },

        /**
         * 写穿：conf.set 后同步失效对应 key
         */
        setConf(key, value, confFile) {
            const src = confFile || globalThis.conf;
            if (src) src.set(key, value);
            this._confCache.invalidate("conf:" + key);
        },

        /**
         * 写穿：conf.delete 后同步失效对应 key
         * 与 setConf 对称，保证「写穿 + 失效缓存」这一约定在删除场景下也成立，
         * 避免有调用方先 delete 底层文件、又忘记让 CachePool 一起失效，
         * 导致后续 CachePool.conf(key) 仍命中 TTL 内的旧缓存值。
         */
        deleteConf(key, confFile) {
            const src = confFile || globalThis.conf;
            const ok = src ? src.delete(key) : false;
            this._confCache.invalidate("conf:" + key);
            return ok;
        },

        /** 手动失效某个 conf key（比如 reload 后） */
        invalidateConf(key) {
            if (key) this._confCache.invalidate("conf:" + key);
            else     this._confCache.clear();
        },

        // ── lang 访问 ──────────────────────────────────────────
        /**
         * 带缓存的 lang.get(key)
         */
        lang(key, langFile) {
            const src = langFile || globalThis.lang;
            if (!src) return key;
            let v = this._langCache.get(key);
            if (v === undefined) {
                v = src.get(key);
                this._langCache.set(key, v === undefined ? null : v);
            }
            return (v === null || v === undefined) ? key : v;
        },

        /** reload 后清空语言缓存 */
        clearLang() { this._langCache.clear(); },

        // ── 在线玩家列表 ───────────────────────────────────────
        /**
         * 带缓存的 mc.getOnlinePlayers()，1s 内复用结果
         */
        getOnlinePlayers() {
            let v = this._playerListCache.get(this._PLAYER_LIST_KEY);
            if (v === undefined) {
                v = mc.getOnlinePlayers();
                this._playerListCache.set(this._PLAYER_LIST_KEY, v);
            }
            return v;
        },

        /** 玩家加入/离开时主动失效 */
        invalidatePlayerList() {
            this._playerListCache.invalidate(this._PLAYER_LIST_KEY);
        },

        // ── Warp 列表 ──────────────────────────────────────────
        /**
         * 带缓存的 warpStore.getAll()，3s 内复用结果
         * 避免每次打开 Warp GUI 都全量读文件
         * @param {Object} warpStore WriteBackStore 实例（globalThis.warpStore）
         * @returns {Object} { warpName: { x, y, z, dimid }, ... }
         */
        getWarpAll(warpStore) {
            let v = this._warpListCache.get(this._WARP_LIST_KEY);
            if (v === undefined) {
                const src = warpStore || globalThis.warpStore;
                v = src ? src.getAll() : {};
                this._warpListCache.set(this._WARP_LIST_KEY, v);
            }
            return v;
        },

        /** warp 增删后主动失效，下次读取重新拉最新数据 */
        invalidateWarpList() {
            this._warpListCache.invalidate(this._WARP_LIST_KEY);
        },

        // ── 模块专属子缓存工厂 ────────────────────────────────
        /**
         * 为单个模块创建独立 TTL 缓存（避免 Cd.js / Sign.js 每次都走磁盘）
         * @param {number} ttlMs   有效期
         * @param {number} maxSize 最大条目
         * @returns {TTLCache}
         */
        createModuleCache(ttlMs = 3000, maxSize = 64) {
            return new TTLCache(ttlMs, maxSize);
        },

        // ── 诊断 ───────────────────────────────────────────────
        diagnose() {
            return {
                conf   : this._confCache.stats(),
                lang   : this._langCache.stats(),
                players: this._playerListCache.stats(),
            };
        },

        /** 全部清空（用于 reload） */
        clearAll() {
            this._confCache.clear();
            this._langCache.clear();
            this._playerListCache.clear();
        },
    };

    // ── 挂到 globalThis，所有模块都能访问 ──────────────────────
    globalThis.CachePool = CachePool;

    randomGradientLog("缓存池初始化完成 ");

    module.exports = { CachePool };

})();
