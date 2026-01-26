// Bstats.js - YEssential 统一配置版

class BStatsImpl {
    constructor(pluginId, pluginVersion, pluginName) {
        this.pluginId = pluginId;
        this.pluginVersion = pluginVersion;
        this.pluginName = pluginName;
        
        // 核心：直接从统一配置获取数据
        this.syncConfig();

        this.platform = "bukkit";
        this.baseUrl = `https://bstats.org/api/v2/data/${this.platform}`;
    }

    /**
     * 统一配置同步逻辑
     */
    syncConfig() {
        // 获取主配置中的 Bstats 部分
        let bstatsConf = conf.get("Bstats");
        
        // 如果配置不存在（理论上ConfigManager初始化后不会不存在），做个保险
        if (!bstatsConf) {
            bstatsConf = { EnableModule: true, serverUUID: "", logSentData: false };
        }

        this.enabled = bstatsConf.EnableModule;
        this.debugMode = bstatsConf.logSentData;

        // 处理 UUID：如果没有，则生成一个并写回主配置文件
        if (!bstatsConf.serverUUID || bstatsConf.serverUUID === "") {
            this.serverUUID = this.generateUUID();
            bstatsConf.serverUUID = this.serverUUID;
            conf.set("Bstats", bstatsConf); // 写回统一配置
            logger.info(`[BStats] 已为服务器生成新的唯一标识并保存至主配置，如您不需要/不想要上传统计信息可在配置中禁用`);
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

    getSystemInfo() {
        return {
            osName: "Windows", // 建议实际生产中使用检测逻辑，此处为简化版
            osArch: "amd64",
            osVersion: "10.0",
            coreCount: 4
        };
    }

    collectData() {
        const sysInfo = this.getSystemInfo();
        let playerCount = 0;
        try { playerCount = mc.getOnlinePlayers().length; } catch (e) {}

        return {
            serverUUID: this.serverUUID,
            metricsVersion: "3.0.2",
            playerAmount: playerCount,
            onlineMode: 1,
            bukkitVersion: mc.getBDSVersion(),
            bukkitName: "LeviLamina",
            javaVersion: "17.0.0",
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
                {
                    chartId: "economy_type",
                    type: "simplePie",
                    data: { "value": conf.get("LLMoney") ? "LLMoney" : "Scoreboard" }
                },
                {
                    chartId: "rtp_status",
                    type: "simplePie",
                    data: { "value": conf.get("Warp") ? "Enabled" : "Disabled" }
                }
            ]
        };
    }

    start() {
        // 如果主配置里关掉了，直接退出
        if (!this.enabled) {
            logger.info("[BStats] 模块已在配置中禁用。");
            return;
        }

        setTimeout(() => {
            this.submit();
            setInterval(() => this.submit(), 30 * 60 * 1000);
        }, 5 * 1000); // 启动后15秒提交第一次
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
                        if (this.debugMode) logger.info("提交统计数据成功");
                    } else if (this.debugMode) {
                        logger.warn(`提交统计数据失败 (HTTP ${status})`);
                    }
                }
            );
        } catch (e) {}
    }
}

// 启动逻辑
const metrics = new BStatsImpl(29071, "2.8.0", "YEssential");
metrics.start();