/**
 * YEssential - WriteBackStore 写回数据存储
 * 核心逻辑：
 * 1. 读优化：内存 Map 提供极速读取。
 * 2. 写优化：set/delete 仅操作内存，不立即触发磁盘 I/O。
 * 3. 物理落盘：通过 setInterval 定期执行 flush()，显式调用 jcf.save()。
 * 4. 安全性：解决高频 save 导致的服务器卡顿，同时确保数据定期备份。
 */

"use strict";

(function () {

    // 刷盘间隔：30秒。平衡性能与数据安全。
    const FLUSH_INTERVAL = 30000;

    class Store {
        constructor(jcf, name) {
            this._jcf    = jcf;
            this._name   = name;
            this._data   = new Map();
            this._dirty  = false;
            this._loaded  = false;
            this._stats = { reads: 0, writes: 0, flushes: 0 };
            this._timer = null;
            // [fix] 记录本轮 flush 之前被 delete() 掉的 key，
            // 否则 flush() 只会 set 内存里剩下的 key，已删除的 key 永远留在底层文件里
            this._deletedKeys = new Set();
        }

        load() {
            if (this._loaded) return this;
            try {
                // LLSE JsonConfigFile 读取
                const raw = this._jcf.read();
                const obj = raw ? JSON.parse(raw) : {};
                for (const [k, v] of Object.entries(obj)) {
                    this._data.set(k, v);
                }
            } catch (e) {
                logger.warn(`[WriteBackStore:${this._name}] load 失败: ${e.message}`);
            }
            this._loaded = true;
            this._startTimer();
            return this;
        }

        _ensureLoaded() {
            if (!this._loaded) this.load();
        }

        get(key) {
            this._ensureLoaded();
            this._stats.reads++;
            return this._data.get(String(key));
        }

        has(key) {
            this._ensureLoaded();
            return this._data.has(String(key));
        }

        getAll() {
            this._ensureLoaded();
            const obj = {};
            for (const [k, v] of this._data) obj[k] = v;
            return obj;
        }

        set(key, value) {
            this._ensureLoaded();
            const k = String(key);
            this._data.set(k, value);
            this._dirty = true;
            this._stats.writes++;
            return true;
        }

        delete(key) {
            this._ensureLoaded();
            const k = String(key);
            if (!this._data.has(k)) return false;
            this._data.delete(k);
            // [fix] 标记这个 key 需要在下次 flush 时从底层 jcf 里物理删除
            this._deletedKeys.add(k);
            this._dirty = true;
            this._stats.writes++;
            return true;
        }

        /**
         * 物理落盘逻辑
         */
        flush() {
            if (!this._dirty) return false;
            
            try {
                // 1. [fix] 先把本轮被 delete() 的 key 从底层 jcf 物理删除，
                //    再更新剩余 key 的内容。顺序反过来的话，如果同一个 key
                //    先删后又被重新 set，会被错误地删掉。
                for (const k of this._deletedKeys) {
                    if (!this._data.has(k) && this._jcf.delete) {
                        this._jcf.delete(k);
                    }
                }
                this._deletedKeys.clear();

                const obj = this.getAll();
                // 2. 更新底层对象内容
                // 注意：这里使用全量覆盖逻辑，因为 WriteBackStore 管理的是整个文件的数据
                for (const [k, v] of Object.entries(obj)) {
                    this._jcf.set(k, v);
                }

                // 3. 显式物理写盘 (核心步骤)
                if (this._jcf.save) {
                    this._jcf.save();
                }

                this._dirty = false;
                this._stats.flushes++;
                return true;
            } catch (e) {
                logger.error(`[WriteBackStore:${this._name}] flush 失败: ${e.message}`);
                return false;
            }
        }

        _startTimer() {
            if (this._timer) return;
            this._timer = setInterval(() => {
                if (this._dirty) {
                    this.flush();
                }
            }, FLUSH_INTERVAL);
        }

        stats() {
            return {
                name: this._name,
                totalKeys: this._data.size,
                dirty: this._dirty,
                reads: this._stats.reads,
                writes: this._stats.writes,
                flushes: this._stats.flushes
            };
        }
    }

    const WriteBackStore = {
        _stores: new Map(),

        create(jcf, name) {
            const store = new Store(jcf, name);
            store.load();
            this._stores.set(name, store);
            return store;
        },

        get(name) {
            return this._stores.get(name);
        },

        flushAll() {
            let count = 0;
            for (const store of this._stores.values()) {
                if (store.flush()) count++;
            }
            return count;
        }
    };

    globalThis.WriteBackStore = WriteBackStore;
    randomGradientLog("回写系统初始化完成 ");
    module.exports = { WriteBackStore };
})();
