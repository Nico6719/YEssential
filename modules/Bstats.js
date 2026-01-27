// Bstats.js - YEssential (LSE 异步适配版)

class BStatsImpl {
    constructor(pluginId, pluginVersion, pluginName) {
        this.pluginId = pluginId;
        this.pluginVersion = pluginVersion;
        this.pluginName = pluginName;
        
        // 初始化默认硬件信息 (防止异步未完成时报错)
        this.cachedCoreCount = 4; 
        this.cachedOsVersion = "Unknown";
        
        // 核心：直接从统一配置获取数据
        this.syncConfig();

        this.platform = "bukkit";
        this.baseUrl = `https://bstats.org/api/v2/data/${this.platform}`;
        
        // 启动时立即触发一次异步获取硬件信息
        this.fetchRealSystemInfo();
    }

    /**
     * 异步获取真实的硬件信息并缓存
     * 这里使用 system.cmd 的回调模式
     */
    fetchRealSystemInfo() {
        try {
            if (typeof OS === 'undefined') return;

            // 1. 获取 OS 名称
            let osName = OS.osName ? OS.osName.toLowerCase() : "unknown";
            
            // 2. 根据系统执行不同的命令
            let cmd = "";
            if (osName.includes("win")) {
                this.cachedOsVersion = "10.0/Server"; // Windows通常难以精确获取版本号，给个通用值
                cmd = "echo %NUMBER_OF_PROCESSORS%";
            } else {
                this.cachedOsVersion = "Linux";
                cmd = "nproc";
            }

            // 3. 执行异步命令 (利用文档提供的 API)
            // timeLimit 设为 1000ms，超时就算了
            system.cmd(cmd, (exitCode, output) => {
                if (exitCode === 0 && output) {
                    // 去除回车换行并转为数字
                    let cores = parseInt(output.trim());
                    if (!isNaN(cores) && cores > 0) {
                        this.cachedCoreCount = cores;
                        if (this.debugMode) logger.info(`[BStats] 硬件检测完成: ${cores} 核 CPU`);
                    }
                }
            }, 1000);

        } catch (e) {
            // 忽略错误，保持默认值
        }
    }

    syncConfig() {
        let bstatsConf = conf.get("Bstats");
        if (!bstatsConf) {
            bstatsConf = { EnableModule: true, serverUUID: "", logSentData: false };
        }

        this.enabled = bstatsConf.EnableModule;
        this.debugMode = bstatsConf.logSentData;

        if (!bstatsConf.serverUUID || bstatsConf.serverUUID === "") {
            this.serverUUID = this.generateUUID();
            bstatsConf.serverUUID = this.serverUUID;
            conf.set("Bstats", bstatsConf); 
            logger.info(`[BStats] 已生成新的 UUID`);
        } else {
            this.serverUUID = bstatsConf.serverUUID;
        }
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * 获取系统信息 (现在是同步读取缓存值)
     */
    getSystemInfo() {
        let osName = "Unknown";
        let osArch = "amd64";

        try {
            if (typeof OS !== 'undefined') {
                if (OS.osName) osName = OS.osName.charAt(0).toUpperCase() + OS.osName.slice(1);
                if (OS.osArch) osArch = OS.osArch;
            }
        } catch (e) {}

        return {
            osName: osName,
            osArch: osArch,
            osVersion: this.cachedOsVersion, // 读取缓存
            coreCount: this.cachedCoreCount  // 读取缓存
        };
    }

    collectData() {
        const sysInfo = this.getSystemInfo();
        
        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) {}

        let moduleCount = 0;
        try {
            const path = "./plugins/YEssential/modules/modulelist.json";
            if (File.exists(path)) {
                const list = JSON.parse(File.readFrom(path));
                if (list && list.modules) moduleCount = list.modules.length;
            }
        } catch (e) {}

        // 安全读取配置
        const economyData = conf.get("LLMoney") ? "LLMoney" : "Scoreboard";
        const rtpStatus = (conf.get("RTP")?.EnabledModule) ? "Enabled" : "Disabled";
        const autoUpdateStatus = conf.get("AutoUpdate") ? "Enabled" : "Disabled";
        const taxRate = String(conf.get("PayTaxRate") || 0) + "%";

        return {
            serverUUID: this.serverUUID,
            metricsVersion: "3.0.2",
            playerAmount: playerCount,
            onlineMode: 1,
            bukkitVersion: mc.getBDSVersion(),
            bukkitName: "LeviLamina",
            javaVersion: "QuickJS",
            osName: sysInfo.osName,
            osArch: sysInfo.osArch,
            osVersion: sysInfo.osVersion,
            coreCount: sysInfo.coreCount,
            service: {
                id: this.pluginId,
                name: this.pluginName,
                pluginVersion: this.pluginVersion,
                libVersion: "3.0.2"
            },
            charts: [
                { chartId: "economy_type", type: "simplePie", data: { "value": economyData } },
                { chartId: "rtp_status", type: "simplePie", data: { "value": rtpStatus } },
                { chartId: "AutoUpdate", type: "simplePie", data: { "value": autoUpdateStatus } },
                { chartId: "installed_modules_count", type: "simplePie", data: { "value": String(moduleCount) } },
                { chartId: "pay_tax_rate", type: "simplePie", data: { "value": taxRate } }           
            ]
        };
    }

    start() {
        if (!this.enabled) {
            logger.info("[BStats] 模块已在配置中禁用。");
            return;
        }

        // 延迟 15 秒启动，给予 fetchRealSystemInfo 充足的时间完成异步回调
        setTimeout(() => {
            this.submit();
            setInterval(() => this.submit(), 30 * 60 * 1000);
        }, 15 * 1000); 
    }

    submit() {
        try {
            const data = this.collectData();
            network.httpPost(
                this.baseUrl,
                JSON.stringify(data),
                "application/json",
                (status) => {
                    if (status >= 200 && status < 300) {
                        if (this.debugMode) logger.info("[BStats] 统计数据提交成功");
                    } else if (this.debugMode) {
                        logger.warn(`[BStats] 提交失败 (HTTP ${status})`);
                    }
                }
            );
        } catch (e) {
            if (this.debugMode) logger.error(`[BStats] 提交过程出错: ${e.message}`);
        }
    }
}

// 启动
const metrics = new BStatsImpl(29071, "2.8.2", "YEssential");
metrics.start();