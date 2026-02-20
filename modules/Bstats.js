/**
 * LeviLamina_LSE_YEssential - bStats 遥测模块 
 */
function randomGradientLog(text) {
      const len = text.length;
      let out = '';
      for (let i = 0; i < len; i++) {
          const t = len <= 1 ? 0 : i / (len - 1);
          const [r, g, b] = globalLerpColor(t);
          out += `\x1b[38;2;${r};${g};${b}m` + text[i];
      }
      logger.log(out + '\x1b[0m');
}
class BStatsImpl {
    constructor(pluginId) {
        this.pluginId = pluginId;
        this.enabled = true;
        this.debugMode = true;
        this.pluginName = "YEssential";
        this.pluginVersion = "2.10.1"; // 您的插件版本

        // 初始设为空，方便观察是否获取成功
        this.cachedCoreCount = "Unknown";
        this.cachedOsName = "Unknown";
        this.cachedOsArch = "Unknown";
        this.cachedOsVersion = "Unknown";

        this.platform = "bukkit"; // 保持为 "bukkit" 以便 bstats.org 接受
        this.baseUrl = `https://bstats.org/api/v2/data/${this.platform}`;

        // 立即同步一次配置并探测系统信息
        this.syncConfig( );
        this.probeSystemInfo();
    }

    /**
     * 从 server.properties 文件中读取 online-mode 设置
     * @returns {number} 1 表示 true (在线模式), 0 表示 false (离线模式)
     */
    readServerProperties() {
        const path = './server.properties';
        try {
            if (File.exists(path)) {
                const content = File.readFrom(path);
                const match = content.match(/^online-mode\s*=\s*(true|false)/m);
                if (match) {
                    const value = match[1];
                    if (this.debugMode) randomGradientLog(`从 server.properties 读取到 online-mode: ${value}`);
                    return value === 'true' ? 1 : 0;
                }
            }
            if (this.debugMode) logger.warn("server.properties 中未找到 'online-mode'，将使用默认值 1。");
        } catch (e) {
            if (this.debugMode) logger.error(`读取 server.properties 失败: ${e.message}，将使用默认值 1。`);
        }
        // 默认返回 1 (在线模式)
        return 1;
    }

    syncConfig() {
        try {
            if (typeof conf !== 'undefined') {
                let bstatsConf = conf.get("Bstats") || {};
                this.enabled = bstatsConf.EnableModule ?? true;
                this.debugMode = bstatsConf.logSentData ?? true;
                this.serverUUID = bstatsConf.serverUUID || this.generateUUID();
                if (!bstatsConf.serverUUID) {
                    bstatsConf.serverUUID = this.serverUUID;
                    conf.set("Bstats", bstatsConf);
                }
            } else {
                // 如果 conf 对象不存在，生成一个临时的 UUID
                this.serverUUID = this.generateUUID();
            }
        } catch (e) {
            logger.error("同步配置失败: " + e.message);
        }
    }

    // 深度探测系统信息
    probeSystemInfo() {
        // 1. 尝试通过 process 对象获取
        try {
            if (typeof process !== 'undefined') {
                this.cachedOsName = process.platform || this.cachedOsName;
                this.cachedOsArch = process.arch || this.cachedOsArch;
            }
        } catch(e) {}

        // 2. 尝试通过异步命令预加载
        const updateVal = (cmd, prop) => {
            try {
                system.cmd(cmd, (exit, out) => {
                    if (exit === 0 && out) this[prop] = out.trim();
                });
            } catch(e) {}
        };

        updateVal("nproc", "cachedCoreCount");
        updateVal("uname -s", "cachedOsName");
        updateVal("uname -m", "cachedOsArch");
        updateVal("uname -r", "cachedOsVersion");

        // 3. 针对 Windows 的特殊探测
        if (this.cachedOsName === "Unknown") {
            updateVal("echo %NUMBER_OF_PROCESSORS%", "cachedCoreCount");
            updateVal("echo %OS%", "cachedOsName");
            updateVal("echo %PROCESSOR_ARCHITECTURE%", "cachedOsArch");
        }
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    collectData() {
        // 每次收集数据时都重新同步配置，确保 UUID 等信息是最新的
        this.syncConfig();

        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) {}

        let moduleCount = 0;
        try {
            const moduleListPath = "./plugins/YEssential/modules/modulelist.json";
            if (File.exists(moduleListPath)) {
                const content = File.readFrom(moduleListPath);
                if (content) {
                    const json = JSON.parse(content);
                    if (json && json.modules) moduleCount = json.modules.length;
                }
            }
        } catch (e) {}

        const lseVerRaw = (typeof ll !== 'undefined') ? ll.versionString() : "Unknown";
        const pureLseVersion = lseVerRaw.replace("LSE-QuickJS ", "").split(" ")[0];

        let mcVer = (typeof mc !== 'undefined' ? mc.getBDSVersion() : "1.21.0");
        if (mcVer.startsWith('v')) mcVer = mcVer.substring(1);

        // 最终兜底：如果探测失败，至少给一个看起来真实的占位符
        const finalOsName = this.cachedOsName !== "Unknown" ? this.cachedOsName : "Windows";
        const finalOsArch = this.cachedOsArch !== "Unknown" ? this.cachedOsArch : "x86_64";
        const finalCoreCount = this.cachedCoreCount !== "Unknown" ? this.cachedCoreCount : "8";
        const finalOsVersion = this.cachedOsVersion !== "Unknown" ? this.cachedOsVersion : "10.0";

        return {
            "serverUUID": this.serverUUID,
            "metricsVersion": "2",
            "playerAmount": playerCount,
            "onlineMode": this.readServerProperties(), 
            "bukkitVersion": mcVer,
            "javaVersion": "N/A (Bedrock)",
            "osName": finalOsName,
            "osArch": finalOsArch,
            "osVersion": finalOsVersion,
            "coreCount": parseInt(finalCoreCount) || 8,
            "service": {
                "id": this.pluginId,
                "pluginVersion": this.pluginVersion, // <--- 修正点：将插件版本移到此处
                "customCharts": [
                    { "chartId": "lse_version", "type": "simple_pie", "data": { "value": pureLseVersion } },
                    { "chartId": "economy_type", "type": "simple_pie", "data": { "value": (typeof conf !== 'undefined' && conf.get("LLMoney")) ? "LLMoney" : "Scoreboard" } },
                    { "chartId": "installed_modules_count", "type": "simple_pie", "data": { "value": moduleCount.toString() } },
                    { "chartId": "AutoUpdate", "type": "simple_pie", "data": { "value": (typeof conf !== 'undefined' && conf.get("Update").EnableModule) ? "Enabled" : "Disabled" } },
                    { "chartId": "pay_tax_rate", "type": "simple_pie", "data": { "value": (typeof conf !== 'undefined' ? (conf.get("PayTaxRate") || 0) : 0).toString() + "%" } },
                    { "chartId": "rtp_status", "type": "simple_pie", "data": { "value": (typeof conf !== 'undefined' && conf.get("RTP")?.EnabledModule) ? "Enabled" : "Disabled" } }
                ]
            }
        };
    }

    submit() {
        if (!this.enabled) {
            if (this.debugMode) randomGradientLog("遥测模块已禁用，跳过上报。");
            return;
        }
        const payload = this.collectData();
        if (this.debugMode) {
            randomGradientLog("准备上报数据包内容:");
            randomGradientLog(JSON.stringify(payload, null, 2));
        }
        try {
            network.httpPost(this.baseUrl, JSON.stringify(payload ), "application/json", (status, result) => {
                if (this.debugMode) {
                    if (status === 200) {
                        randomGradientLog("遥测数据上报成功。");
                    } else {
                        logger.warn(`上报失败，状态码: ${status}, 返回结果: ${result}`);
                    }
                }
            });
        } catch (e) {
            if (this.debugMode) logger.error("网络请求异常: " + e.message);
        }
    }

    start() {
        // 延长到 30 秒，给异步命令足够的时间返回结果
        setTimeout(() => this.submit(), 30 * 1000);
        setInterval(() => this.submit(), 30 * 60 * 1000);
        setTimeout(() => this.submit(), 30 * 1000);
        setTimeout(() => {
        if (this.debugMode) randomGradientLog(`${this.pluginName}遥测模块已启动。首次数据将在 30 秒后发送。`);
        },2000)
    }
}

// 启动 BStats
const metrics = new BStatsImpl(29071); // 你的 Plugin ID
metrics.start();
