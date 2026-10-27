/**
 * YEssential 附属模块 · Web 配置台
 *
 * 部署位置：
 *   plugins/YEssential/modules/WebConsole.js   ← 本文件
 *   plugins/YEssential/web/                    ← 前端构建产物
 *   配置：plugins/YEssential/Config/config.json 的 WebConsole 块
 *
 * 模块清单：ConfigManager.syncModules() 会扫描 modules/*.js 自动注册，
 * 但它跑在 ConfigManager.init() 里，可能晚于本次模块加载循环 —— 首次部署
 * 建议手动在 modulelist.json 追加一条，之后交给它自己维护。
 *
 * 依赖 LSE ≥ 0.19.1（HttpServer）
 */

/* 模块没有 manifest，版本号只能自己带：发版后看日志就能确认装的是哪一版 */
const VERSION = "0.1.2";
module.exports = { init, version: VERSION };

const BASE = typeof pluginpath !== "undefined" ? pluginpath : "plugins/YEssential";
const WEB_DIR = BASE + "/web";
const TARGETS = {
    main: BASE + "/Config/config.json",
    update: BASE + "/Config/Updateconfig.json",
};
const BACKUP_PATH = BASE + "/Config/ConfigBackup.json";
const PREF_PATH = BASE + "/Config/WebPref.json";

let server = null;
let reloadTimer = null;
let reloadAt = 0;          // 到点才执行，给 HTTP 响应留出返回时间
const assetCache = new Map();

/* YEssential 的彩色日志挂在 globalThis 上，且注入时机早于模块加载；
   运行期再取一次，避免加载顺序问题。warn / error 仍用原色，保持告警可辨识。 */
function glog(text) {
    if (typeof randomGradientLog === "function") return randomGradientLog(text);
    return logger.info(text);
}

const MIME = {
    html: "text/html; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    mjs: "application/javascript; charset=utf-8",
    css: "text/css; charset=utf-8",
    json: "application/json; charset=utf-8",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    ico: "image/x-icon",
    woff2: "font/woff2",
    map: "application/json; charset=utf-8",
};
const mimeOf = p => MIME[String(p).split(".").pop().toLowerCase()] || "application/octet-stream";

function readJson(path) {
    try {
        if (!File.exists(path)) return null;
        return JSON.parse(File.readFrom(path));
    } catch (e) {
        return null;
    }
}

function readAsset(rel) {
    if (assetCache.has(rel)) return assetCache.get(rel);
    const full = WEB_DIR + "/" + rel;
    try {
        if (!File.exists(full)) return null;
        const body = File.readFrom(full);
        assetCache.set(rel, body);
        return body;
    } catch (e) {
        logger.error(`读取 ${rel} 失败: ${e.message}`);
        return null;
    }
}

function sendAsset(res, rel) {
    const body = readAsset(rel);
    if (body == null) {
        res.status = 404;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.body = "404 Not Found: " + rel;
        return;
    }
    res.status = 200;
    res.setHeader("Content-Type", mimeOf(rel));
    res.setHeader("Cache-Control", /-[A-Za-z0-9_-]{8}\./.test(rel) ? "public, max-age=31536000" : "no-cache");
    res.body = body;
}

function json(res, obj, status) {
    res.status = status || 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.body = JSON.stringify(obj);
}

/* 旧内容存进 ConfigBackup.json 的 LatestWebSave 键，不再单独生成 .bak。
   刻意不占 LatestConfigBackup —— 那是 ConfigManager 版本迁移时的快照，
   被网页保存覆盖掉的话，升级出问题就没得回滚了。 */
function backupBeforeWrite(which) {
    const src = TARGETS[which];
    let raw = "";
    try {
        if (!File.exists(src)) return;
        raw = File.readFrom(src);
    } catch (e) {
        return;
    }
    if (!raw) return;

    let old;
    try {
        old = JSON.parse(raw);
    } catch (e) {
        return; // 旧内容都不是合法 JSON，没有备份价值
    }

    let bak = {};
    try {
        if (File.exists(BACKUP_PATH)) bak = JSON.parse(File.readFrom(BACKUP_PATH) || "{}") || {};
    } catch (e) {
        bak = {};
    }

    bak.LatestWebSave = {
        which: which,
        file: src,
        timestamp: new Date().toISOString().replace(/[:.]/g, "-"),
        configs: old,
    };

    File.writeTo(BACKUP_PATH, JSON.stringify(bak, null, 4));
}

function writeConfig(which, data) {
    const text = JSON.stringify(data, null, 2);
    JSON.parse(text);          // 先自证可解析，再落盘
    backupBeforeWrite(which);
    File.writeTo(TARGETS[which], text);
}

function init() {
    try {
        // LSE 按模块名分配独立 logger，日志会变成 [YEssential] [模块名] 两层。
        // setTitle 会替换 getEngineOwnData()->logger 的实例，指向主插件同名 logger，
        // 这样输出只保留 [YEssential] 一层，和本体日志格式一致。
        logger.setTitle("YEssential");

        // 配置读 config.json 的 WebConsole 块，不再单独开文件
        let c = null;
        try {
            if (globalThis.CachePool && typeof globalThis.CachePool.conf === "function") {
                c = globalThis.CachePool.conf("WebConsole");
            }
        } catch (e) {
            c = null;
        }
        const cfg = c && typeof c === "object" ? c : {};

        if (cfg.EnableModule === false) {
            glog("已在 config.json 关闭（WebConsole.EnableModule = false），跳过启动");
            return;
        }

        const PORT = Number(cfg.Port) > 0 && Number(cfg.Port) < 65536 ? Number(cfg.Port) : 8787;
        const ADDR = typeof cfg.BindAddress === "string" && cfg.BindAddress ? cfg.BindAddress : "127.0.0.1";
        const ALLOW_WRITE = cfg.AllowWrite !== false;

        // 只有绑非回环地址才要 token：本机零门槛，公网必须带
        const NEED_TOKEN = !/^(127\.|localhost$|::1$)/.test(ADDR);
        let TOKEN = typeof cfg.Token === "string" ? cfg.Token : "";
        let TOKEN_TEMP = false;
        if (NEED_TOKEN && !TOKEN) {
            TOKEN = "";
            for (let i = 0; i < 4; i++) TOKEN += Math.random().toString(36).slice(2, 6);
            TOKEN_TEMP = true;   // 临时 token，不写回 config.json，避免动主配置
        }

        // 不因为 config.json 还不存在就放弃：这个模块可能先于 ConfigManager 初始化
        if (readJson(TARGETS.main) == null) {
            logger.warn(`暂未读到 ${TARGETS.main}，接口会在文件就绪后自动可用`);
        }
        if (readAsset("index.html") == null) {
            logger.warn(`找不到 ${WEB_DIR}/index.html，模块已跳过启动`);
            return;
        }

        const authOk = req => {
            if (!NEED_TOKEN) return true;
            const h = req.headers["x-auth-token"];
            const fromHeader = Array.isArray(h) ? h[0] : h;
            const q = req.query && req.query.token;
            const fromQuery = Array.isArray(q) ? q[0] : q;
            return (fromHeader || fromQuery) === TOKEN;
        };

        server = new HttpServer();

        server.onPreRouting((req, res) => {
            if (!authOk(req)) {
                json(res, { ok: false, error: "unauthorized" }, 401);
                return false;
            }
            // 挡掉跨站页面借用浏览器身份调用写接口
            const origin = req.headers["origin"];
            if (origin) {
                const o = Array.isArray(origin) ? origin[0] : origin;
                const allow = [
                    `http://127.0.0.1:${PORT}`,
                    `http://localhost:${PORT}`,
                    `http://${ADDR}:${PORT}`,
                ];
                if (allow.indexOf(o) < 0) {
                    json(res, { ok: false, error: "bad origin" }, 403);
                    return false;
                }
            }
            return true;
        });

        server.onGet("/", (req, res) => sendAsset(res, "index.html"));
        server.onGet("/index.html", (req, res) => sendAsset(res, "index.html"));
        server.onGet("/favicon.ico", (req, res) => { res.status = 204; });
        server.onGet("/assets/(.+)", (req, res) => sendAsset(res, "assets/" + req.matches[1]));

        server.onGet("/api/state", (req, res) => {
            const main = readJson(TARGETS.main);
            if (main == null) {
                json(res, { ok: false, error: `读不到 ${TARGETS.main}` }, 500);
                return;
            }
            json(res, {
                ok: true,
                main,
                update: readJson(TARGETS.update) || {},
                meta: {
                    module: "WebConsole",
                    version: VERSION,
                    mainPath: TARGETS.main,
                    updatePath: TARGETS.update,
                    allowWrite: ALLOW_WRITE,
                    needToken: NEED_TOKEN,
                },
            });
        });

        // 显示偏好独立存 Config/WebPref.json：跟着服务器走（换浏览器不丢）。
        // 不进 config.json、不触发重载；刻意不受 AllowWrite 限制 —— 那个只管
        // 插件配置，偏好写失败会让人以为「设置不生效」。
        server.onGet("/api/pref", (req, res) => {
            json(res, { ok: true, pref: readJson(PREF_PATH) || {} });
        });

        server.onPost("/api/pref", (req, res) => {
            let payload;
            try {
                payload = JSON.parse(req.body);
            } catch (e) {
                json(res, { ok: false, error: "请求体不是合法 JSON" }, 400);
                return;
            }
            const pref = payload && payload.pref;
            if (!pref || typeof pref !== "object" || Array.isArray(pref)) {
                json(res, { ok: false, error: "pref 必须是对象" }, 400);
                return;
            }
            try {
                const text = JSON.stringify(pref, null, 2);
                JSON.parse(text);
                File.writeTo(PREF_PATH, text);
            } catch (e) {
                json(res, { ok: false, error: "写入失败: " + e.message }, 500);
                return;
            }
            json(res, { ok: true });
        });

        server.onPost("/api/config", (req, res) => {
            if (!ALLOW_WRITE) {
                json(res, { ok: false, error: "写入已关闭（config.json 里 WebConsole.AllowWrite = false）" }, 403);
                return;
            }
            let payload;
            try {
                payload = JSON.parse(req.body);
            } catch (e) {
                json(res, { ok: false, error: "请求体不是合法 JSON" }, 400);
                return;
            }
            const which = payload && payload.which;
            if (which !== "main" && which !== "update") {
                json(res, { ok: false, error: "which 只能是 main 或 update" }, 400);
                return;
            }
            if (!payload.data || typeof payload.data !== "object") {
                json(res, { ok: false, error: "data 必须是对象" }, 400);
                return;
            }
            try {
                writeConfig(which, payload.data);
            } catch (e) {
                json(res, { ok: false, error: "写入失败: " + e.message }, 500);
                return;
            }
            glog(`已写入 ${TARGETS[which]}（旧内容存于 ConfigBackup.json 的 LatestWebSave），稍后自动重载 YEssential`);
            // 延后触发：当前 HTTP 响应必须先发出去，否则 reload 会把它掐断
            reloadAt = Date.now() + 1200;
            json(res, { ok: true, reloading: true });
        });

        // 手动触发 reload（省得跑控制台敲命令）
        server.onPost("/api/reload", (req, res) => {
            reloadAt = Date.now() + 600;
            json(res, { ok: true, reloading: true });
        });

        // 手动备份：把当前两份配置的原内容写进 ConfigBackup.json
        server.onPost("/api/backup", (req, res) => {
            try {
                backupBeforeWrite("main");
                backupBeforeWrite("update");
                json(res, { ok: true });
            } catch (e) {
                json(res, { ok: false, error: e.message }, 500);
            }
        });

        server.onError((req, res) => {
            if (!res.body) {
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.body = JSON.stringify({ ok: false, error: "not found", path: req.path });
            }
        });

        server.listen(ADDR, PORT);

        const url = `http://${ADDR === "0.0.0.0" ? "127.0.0.1" : ADDR}:${PORT}/`;

        // 延后一拍再报：init 是在模块加载循环里跑的，立刻打印会把 "正在加载模块"
        // 的列表从中间截断，压在 "所有模块加载成功" 之前很难看。
        // 常规启动不再打日志（横幅 WebUITip 已提示配置台）；只有绑非回环地址时
        // 必须把带 token 的访问地址报出来，否则登不进去
        if (NEED_TOKEN) {
            setTimeout(() => {
                glog(`已绑非回环地址，访问需带 token: ${url}?token=${TOKEN}`);
                if (TOKEN_TEMP) {
                    glog("当前 token 为本次启动随机生成，重启会变；想固定就填到 config.json 的 WebConsole.Token");
                }
            }, 600);
        }

        // 主线程轮询待重载标记：mc.runcmdEx 只能在游戏线程调用
        reloadTimer = setInterval(() => {
            if (!reloadAt || Date.now() < reloadAt) return;
            reloadAt = 0;
            try {
                const r = mc.runcmdEx("ll reload YEssential");
                if (r && r.success) glog("已重载 YEssential，新配置生效");
                else glog("重载 YEssential 失败，请手动执行 ll reload YEssential");
            } catch (e) {
                logger.error("自动重载失败: " + e.message);
            }
        }, 300);

        // HttpServer 靠 detach 线程撑着，不 stop 会一直占端口到进程退出
        ll.onUnload(() => {
            if (reloadTimer) { clearInterval(reloadTimer); reloadTimer = null; }
            try {
                if (server) server.stop();
                assetCache.clear();
                glog("配置台已停止");
            } catch (e) {
                logger.error("停止失败: " + e.message);
            }
        });
    } catch (e) {
        // 模块初始化失败不能拖垮主插件
        logger.error(`初始化失败: ${e.message}`);
    }
}
