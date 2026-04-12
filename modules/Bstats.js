/**
 * LeviLamina_LSE_YEssential - bStats 遥测模块
 *
 * 改动：
 *  1. UUID 持久化至 /plugins/YEssential/data/Bstats/uuid.json，完全脱离 conf
 *  2. 上报失败最多重试 2 次，耗尽后 warn 并放弃，不影响服务器运行
 *  3. 所有日志统一走 randomGradientLog（彩色渐变）或 logger.warn / logger.error
 */

const BSTATS_UUID_PATH = "./plugins/YEssential/data/Bstats/uuid.json";
const BSTATS_MAX_RETRY = 2;

// ─── UUID 工具 ────────────────────────────────────────────────────

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function loadOrCreateUUID() {
    try {
        if (File.exists(BSTATS_UUID_PATH)) {
            const raw = File.readFrom(BSTATS_UUID_PATH);
            if (raw) {
                const obj = JSON.parse(raw);
                if (obj && typeof obj.uuid === "string" && obj.uuid.length === 36) {
                    randomGradientLog("[Bstats] 已加载 UUID: " + obj.uuid);
                    return obj.uuid;
                }
            }
        }
    } catch (e) {
        logger.error("[Bstats] 读取 UUID 文件失败: " + e.message);
    }

    const newUUID = generateUUID();
    try {
        File.writeTo(BSTATS_UUID_PATH, JSON.stringify({ uuid: newUUID }, null, 2));
        randomGradientLog("[Bstats] 首次生成 UUID 并写入: " + BSTATS_UUID_PATH);
    } catch (e) {
        logger.error("[Bstats] 写入 UUID 文件失败: " + e.message);
    }
    return newUUID;
}

// ─── 带重试的 HTTP 上报 ───────────────────────────────────────────

function postWithRetry(url, body, retryLeft) {
    const attemptNo = BSTATS_MAX_RETRY - retryLeft + 1;
    try {
        network.httpPost(url, body, "application/json", function (status, result) {
            if (status === 200) {
                randomGradientLog("遥测数据上报成功 ");
                return;
            }
            if (retryLeft > 1) {
                logger.warn(
                    "上报失败（第 " + attemptNo + " 次 / 状态码: " + status + "），" +
                    "1 秒后发起第 " + (attemptNo + 1) + " 次重试..."
                );
                setTimeout(function () { postWithRetry(url, body, retryLeft - 1); }, 1000);
            } else {
                logger.warn(
                    "上报失败（第 " + attemptNo + " 次 / 状态码: " + status + "）。" +
                    "已达最大重试次数 (" + BSTATS_MAX_RETRY + ")，本                                                                                                                                                        轮放弃。" 
                );
            }
        });
    } catch (e) {
        if (retryLeft > 1) {
            logger.warn(
                "[Bstats] 网络请求异常（第 " + attemptNo + " 次: " + e.message + "），" +
                "1 秒后发起第 " + (attemptNo + 1) + " 次重试..."
            );
            setTimeout(function () { postWithRetry(url, body, retryLeft - 1); }, 1000);
        } else {
            logger.warn(
                "[Bstats] 网络请求异常（第 " + attemptNo + " 次: " + e.message + "）。" +
                "已达最大重试次数 (" + BSTATS_MAX_RETRY + ")，本轮放弃。"
            );
        }
    }
}                                                                                                                                                                                                               

// ─── 主类 ─────────────────────────────────────────────────────────

class BStatsImpl {
    constructor(pluginId) {
        this.pluginId      = pluginId;
        this.enabled       = true;
        this.debugMode     = true;
        this.pluginName    = "YEssential";
        this.pluginVersion = this.readManifestVersion();

        this.cachedCoreCount = "Unknown";
        this.cachedOsName    = "Unknown";
        this.cachedOsArch    = "Unknown";
        this.cachedOsVersion = "Unknown";
        this.cachedRamTotal  = "Unknown";
        this.cachedRamAvail  = "Unknown";
        this._rawLinuxMem    = null;
        this._rawWmicMem     = null;

        this.platform = "bukkit";
        this.baseUrl  = "https://bstats.org/api/v2/data/" + this.platform;

        // UUID 从独立文件读，不再依赖 conf
        this.serverUUID = loadOrCreateUUID();

        this.syncConfig();
        this.probeSystemInfo();
    }

    readManifestVersion() {
        const path = "./plugins/YEssential/manifest.json";
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                if (content) {
                    const json = JSON.parse(content);
                    const ver  = json.version || json.version_name;
                    if (ver) return Array.isArray(ver) ? ver.join(".") : String(ver);
                }
            }
        } catch (e) {
            logger.error("[Bstats] 读取 manifest.json 失败: " + e.message);
        }
        return "2.10.11";
    }

    readServerProperties() {
        const path = "./server.properties";
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                const match   = content.match(/^online-mode\s*=\s*(true|false)/m);
                if (match) {
                    if (this.debugMode)
                        randomGradientLog("[Bstats] online-mode = " + match[1]);
                    return match[1] === "true" ? 1 : 0;
                }
            }
        } catch (e) {
            if (this.debugMode)
                logger.error("[Bstats] 读取 server.properties 失败: " + e.message);
        }
        return 1;
    }

    // 只同步开关，UUID 不再从 conf 读写
    syncConfig() {
        try {
            if (typeof conf !== "undefined") {
                const bstatsConf = conf.get("Bstats") || {};
                this.enabled     = bstatsConf.EnableModule != null ? bstatsConf.EnableModule : true;
                this.debugMode   = bstatsConf.logSentData  != null ? bstatsConf.logSentData  : true;
            }
        } catch (e) {
            logger.error("[Bstats] 同步配置失败: " + e.message);
        }
    }

    probeSystemInfo() {
        const self = this;
        const set = function (cmd, prop) {
            try {
                system.cmd(cmd, function (exit, out) {
                    if (exit === 0 && out) self[prop] = out.trim();
                });
            } catch (e) {}
        };

        // Linux
        set("nproc",    "cachedCoreCount");
        set("uname -s", "cachedOsName");
        set("uname -m", "cachedOsArch");
        set("uname -r", "cachedOsVersion");
        set("grep -E 'MemTotal|MemAvailable' /proc/meminfo", "_rawLinuxMem");

        // Windows 兜底
        set("echo %NUMBER_OF_PROCESSORS%",                             "cachedCoreCount");
        set("echo %OS%",                                               "cachedOsName");
        set("echo %PROCESSOR_ARCHITECTURE%",                           "cachedOsArch");
        set("wmic OS get TotalVisibleMemorySize,FreePhysicalMemory /value", "_rawWmicMem");

        // 28 秒后解析，确保在 30 秒首次上报前就绪
        setTimeout(function () { self._parseMemInfo(); }, 28 * 1000);
    }

    _parseMemInfo() {
        if (this._rawLinuxMem) {
            const totalM = this._rawLinuxMem.match(/MemTotal:\s+(\d+)/);
            const availM = this._rawLinuxMem.match(/MemAvailable:\s+(\d+)/);
            if (totalM) this.cachedRamTotal = Math.round(parseInt(totalM[1]) / 1024) + " MB";
            if (availM) this.cachedRamAvail = Math.round(parseInt(availM[1]) / 1024) + " MB";
        }
        if (this._rawWmicMem && this.cachedRamTotal === "Unknown") {
            const totalM = this._rawWmicMem.match(/TotalVisibleMemorySize=(\d+)/);
            const freeM  = this._rawWmicMem.match(/FreePhysicalMemory=(\d+)/);
            if (totalM) this.cachedRamTotal = Math.round(parseInt(totalM[1]) / 1024) + " MB";
            if (freeM)  this.cachedRamAvail = Math.round(parseInt(freeM[1])  / 1024) + " MB";
        }
    }

    collectData() {
        this.syncConfig();

        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) {}

        let moduleCount = 0;
        try {
            const mlPath = "./plugins/YEssential/modules/modulelist.json";
            if (File.exists(mlPath)) {
                const raw  = File.readFrom(mlPath);
                const json = raw ? JSON.parse(raw) : null;
                if (json && json.modules) moduleCount = json.modules.length;
            }
        } catch (e) {}

        const lseVerRaw  = (typeof ll !== "undefined") ? ll.versionString() : "Unknown";
        const pureLseVer = lseVerRaw.replace("LSE-QuickJS ", "").split(" ")[0];

        let mcVer = (typeof mc !== "undefined") ? mc.getBDSVersion() : "1.21.0";
        if (mcVer.startsWith("v")) mcVer = mcVer.substring(1);

        const finalOsName    = this.cachedOsName    !== "Unknown" ? this.cachedOsName    : "Windows";
        const finalOsArch    = this.cachedOsArch    !== "Unknown" ? this.cachedOsArch    : "x86_64";
        const finalCoreCount = this.cachedCoreCount !== "Unknown" ? this.cachedCoreCount : "8";
        const finalOsVersion = this.cachedOsVersion !== "Unknown" ? this.cachedOsVersion : "10.0";
        const finalRamTotal  = this.cachedRamTotal  !== "Unknown" ? this.cachedRamTotal  : "Unknown";
        const finalRamAvail  = this.cachedRamAvail  !== "Unknown" ? this.cachedRamAvail  : "Unknown";

        let ramUsagePct = "Unknown";
        if (finalRamTotal !== "Unknown" && finalRamAvail !== "Unknown") {
            const total = parseInt(finalRamTotal);
            const avail = parseInt(finalRamAvail);
            const used  = total - avail;
            ramUsagePct = Math.round((used / total) * 100) + "% (" + used + " MB / " + total + " MB)";
        }

        if (this.debugMode) {
            randomGradientLog(
                "[Bstats] 内存 — 总计: " + finalRamTotal +
                " | 可用: " + finalRamAvail +
                " | 使用率: " + ramUsagePct
            );
        }

        const econConf = (typeof conf !== "undefined") ? conf.get("Economy") : null;
        const rtpConf  = (typeof conf !== "undefined") ? conf.get("RTP")     : null;
        const updConf  = (typeof conf !== "undefined") ? conf.get("Update")  : null;

        return {
            serverUUID:     this.serverUUID,
            metricsVersion: "2",
            playerAmount:   playerCount,
            onlineMode:     this.readServerProperties(),
            bukkitVersion:  mcVer,
            javaVersion:    "N/A (Bedrock)",
            osName:         finalOsName,
            osArch:         finalOsArch,
            osVersion:      finalOsVersion,
            coreCount:      parseInt(finalCoreCount) || 8,
            ramTotal:       finalRamTotal,
            ramAvailable:   finalRamAvail,
            ramUsage:       ramUsagePct,
            service: {
                id:            this.pluginId,
                pluginVersion: this.pluginVersion,
                customCharts: [
                    { chartId: "lse_version",             type: "simple_pie", data: { value: pureLseVer } },
                    { chartId: "economy_type",            type: "simple_pie", data: { value: (econConf && econConf.mode === "LLMoney") ? "LLMoney" : "Scoreboard" } },
                    { chartId: "installed_modules_count", type: "simple_pie", data: { value: moduleCount.toString() } },
                    { chartId: "AutoUpdate",              type: "simple_pie", data: { value: (updConf && updConf.EnableModule) ? "Enabled" : "Disabled" } },
                    { chartId: "pay_tax_rate",            type: "simple_pie", data: { value: ((econConf && econConf.PayTaxRate != null) ? econConf.PayTaxRate : 0).toString() + "%" } },
                    { chartId: "rtp_status",              type: "simple_pie", data: { value: (rtpConf && rtpConf.EnabledModule) ? "Enabled" : "Disabled" } }
                ]
            }
        };
    }

    submit() {
        if (!this.enabled) {
            if (this.debugMode)
                randomGradientLog("[Bstats] 遥测模块已禁用，跳过上报。");
            return;
        }

        const payload = this.collectData();

        if (this.debugMode) {
            randomGradientLog("[Bstats] 准备上报数据包：");
            randomGradientLog(JSON.stringify(payload, null, 2));
        }

        postWithRetry(this.baseUrl, JSON.stringify(payload), BSTATS_MAX_RETRY);
    }

    start() {
        const self = this;
        setTimeout(function () { self.submit(); }, 30 * 1000);
        setInterval(function () { self.submit(); }, 30 * 60 * 1000);
        setTimeout(function () {
            randomGradientLog("遥测模块已启动。首次上报将在 30 秒后发送，失败最多重试 " + BSTATS_MAX_RETRY + " 次。");
        }, 2000);
    }
}

// ─── 启动入口 ─────────────────────────────────────────────────────
const metrics = new BStatsImpl(29071);
metrics.start();
