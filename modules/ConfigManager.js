// 配置版本管理类
class ConfigManager {
    constructor() {
        this.currentVersion = 267;
        
        // 默认配置
        this.configDefaults = {
            "Version": 267,
            "AutoUpdate": 1,
            "PVPEnabled": 1,
            "HubEnabled": 0,
            "NoticeEnabled": 0,
            "CrashModuleEnabled": 0,
            "TRServersEnabled": false,
            "RankingModel": 1,
            "LLMoney": 0,
            "Scoreboard": "money",
            "PayTaxRate": 0,
            "suicide": 0,
            "Back": 0,
            "Warp": 0,
            "BackTipAfterDeath": false,
            "KeepInventory": false,
            "OptimizeXporb": 0,
            "join_notice": 0,
            "lastServerShutdown": 0,
            "Motd": ["Bedrock_Server", "Geyser"],
            "Fcam": {
                "EnableModule": false,
                "CostMoney": 0,
                "TimeOut": 0
            },
            "RedPacket": {
                "EnabledModule": false,
                "expireTime": 300,
                "maxAmount": 10000,
                "maxCount": 50,
                "minAmount": 1
            },
            "RTP": {
                "EnabledModule": false,
                "minRadius": 100,
                "maxRadius": 5000,
                "cooldown": 300,
                "cost": 50,
                "allowDimensions": [0, 1, 2],
                "safeCheck": true,
                "maxAttempts": 50,
                "Animation": 0,
                "enableParticle": true,
                "enableSound": true,
                "logToFile": true
            },
            "Hub": {
                "EnabledModule": false,
                "x": 0,
                "y": 100,
                "z": 0,
                "dimid": 0,
                "isSet": false
            },
            "tpa": {
                "EnabledModule": false,
                "isDelayEnabled": true,
                "cost": 1,
                "maxDelay": 20,
                "requestTimeout": 60,
                "promptType": "form"
            },
            "Home": {
                "add": 0,
                "del": 0,
                "tp": 0,
                "MaxHome": 10
            },
            "wh": {
                "EnableModule": true,
                "status": 0
            }
        };

        // 废弃的配置项列表（需要删除的旧配置）
        this.deprecatedConfigs = [
            "OldConfigKey1",
            "ObsoleteFeature",
            "LegacySetting"
            // 在这里添加需要删除的旧配置项名称
        ];

        // 废弃的嵌套配置项（格式：父键.子键）
        this.deprecatedNestedConfigs = {
            "RTP": ["oldProperty", "deprecatedSetting"],
            "Hub": ["unusedField"]
            // 格式：对象名: [要删除的子属性数组]
        };
    }

    /**
     * 初始化配置系统
     */
    init() {
        let savedVersion = conf.get("Version") || 0;
        
        if (savedVersion < this.currentVersion) {
            logger.info(`检测到配置版本更新: ${savedVersion} -> ${this.currentVersion}, 开始迁移配置...`);
            this.migrateConfig(savedVersion);
            conf.set("Version", this.currentVersion);
            logger.info("配置迁移完成！");
        }
        
        // 确保所有配置项都存在
        this.ensureAllConfigs();
        
        // 清理废弃的配置
        this.cleanupDeprecatedConfigs();
    }

    /**
     * 迁移配置到最新版本
     * @param {number} oldVersion 旧版本号
     */
    migrateConfig(oldVersion) {
        // 备份当前配置
        this.backupConfig(oldVersion);
        
        // 版本特定的迁移逻辑
        if (oldVersion < 261) {
            this.migrateTo261();
        }
        if (oldVersion < 262) {
            this.migrateTo262();
        }
        if (oldVersion < 263) {
            this.migrateTo263();
        }
        if (oldVersion < 264) {
            this.migrateTo264();
        }
        if (oldVersion < 265) {
            this.migrateTo265();
        }
    }

    /**
     * 备份配置
     */
    backupConfig(version) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `ConfigBackup_v${version}_${timestamp}`;
        
        // 获取所有当前配置
        let allConfigs = {};
        for (let key in this.configDefaults) {
            let value = conf.get(key);
            if (value !== undefined) {
                allConfigs[key] = value;
            }
        }

        // 保存备份
        conf.set(backupKey, {
            version: version,
            timestamp: timestamp,
            configs: allConfigs
        });
    }

    /**
     * 迁移配置到最新版本
     * @param {number} oldVersion 旧版本号
     */
    migrateConfig(oldVersion) {
        const migrations = [
            { version: 261, handler: () => this.migrateTo261() },
            { version: 262, handler: () => this.migrateTo262() },
            { version: 263, handler: () => this.migrateTo263() },
            { version: 264, handler: () => this.migrateTo264() },
            { version: 265, handler: () => this.migrateTo265() }
        ];

        migrations.forEach(migration => {
            if (oldVersion < migration.version) {
                try {
                    migration.handler();
                } catch (error) {
                    logger.error(`迁移到v${migration.version}失败: ${error.message}`);
                }
            }
        });
    }

    // ========== 版本特定迁移方法 ==========

    migrateTo261() {
        logger.info("迁移到版本2.6.1...");
        this.setIfMissing("BackTipAfterDeath", false);
    }

    migrateTo262() {
        logger.info("迁移到版本2.6.2...");
        // v2.6.2 特定的迁移逻辑
    }

    migrateTo263() {
        logger.info("迁移到版本2.6.3...");
        this.ensureObjectConfig("tpa", this.configDefaults.tpa);
    }

    migrateTo264() {
        logger.info("迁移到版本2.6.4...");
        this.ensureObjectConfig("Fcam", this.configDefaults.Fcam);
        this.ensureObjectConfig("wh", this.configDefaults.wh);
    }

    migrateTo265() {
        logger.info("迁移到版本2.6.5...");
        // v2.6.5 特定的迁移逻辑
    }

    // ========== 配置管理核心方法 ==========

    /**
     * 设置配置项（如果不存在）
     */
    setIfMissing(key, defaultValue) {
        if (conf.get(key) === undefined) {
            conf.set(key, defaultValue);
            logger.info(`添加缺失配置: ${key} = ${JSON.stringify(defaultValue)}`);
        }
    }

    /**
     * 确保对象配置存在并包含所有必要的属性
     */
    ensureObjectConfig(key, defaultConfig) {
        let currentConfig = conf.get(key);
        
        // 检查当前配置是否为有效对象
        if (!this.isValidObject(currentConfig)) {
            conf.set(key, defaultConfig);
            logger.info(`创建对象配置: ${key}`);
            return;
        }

        // 合并配置
        let merged = this.mergeConfigs(defaultConfig, currentConfig);
        conf.set(key, merged);
        
        // 检查是否有新增的属性
        let addedProps = this.getAddedProperties(defaultConfig, currentConfig);
        if (addedProps.length > 0) {
            logger.info(`配置 ${key} 新增属性: ${addedProps.join(", ")}`);
        }
    }

    /**
     * 检查是否为有效对象
     * @param {*} value 要检查的值
     * @returns {boolean}
     */
    isValidObject(value) {
        return value !== undefined && 
               value !== null && 
               typeof value === 'object' && 
               !Array.isArray(value);
    }

    /**
     * 递归合并配置对象
     * @param {object} defaultConfig 默认配置
     * @param {object} currentConfig 当前配置
     * @returns {object} 合并后的配置
     */
    mergeConfigs(defaultConfig, currentConfig) {
        let merged = JSON.parse(JSON.stringify(currentConfig));
        
        for (let key in defaultConfig) {
            if (merged[key] === undefined) {
                merged[key] = defaultConfig[key];
            } else if (this.isValidObject(defaultConfig[key]) && this.isValidObject(merged[key])) {
                merged[key] = this.mergeConfigs(defaultConfig[key], merged[key]);
            }
        }
        
        return merged;
    }

    /**
     * 获取新增的属性列表
     * @param {object} defaultConfig 默认配置
     * @param {object} currentConfig 当前配置
     * @returns {Array<string>} 新增属性名数组
     */
    getAddedProperties(defaultConfig, currentConfig) {
        let added = [];
        for (let key in defaultConfig) {
            if (currentConfig[key] === undefined) {
                added.push(key);
            }
        }
        return added;
    }

    /**
     * 确保所有配置项都存在
     */
    ensureAllConfigs() {
        //logger.info("检查所有配置项...");
        
        for (let key in this.configDefaults) {
            if (this.isValidObject(this.configDefaults[key])) {
                this.ensureObjectConfig(key, this.configDefaults[key]);
            } else {
                this.setIfMissing(key, this.configDefaults[key]);
            }
        }
    }

    // ========== 清理废弃配置 ==========

    /**
     * 清理所有废弃的配置项
     */
    cleanupDeprecatedConfigs() {
        let removedCount = 0;

        // 清理顶级废弃配置
        this.deprecatedConfigs.forEach(key => {
            if (conf.get(key) !== undefined) {
                conf.delete(key);
                logger.info(`删除废弃配置: ${key}`);
                removedCount++;
            }
        });

        // 清理嵌套对象中的废弃配置
        for (let parentKey in this.deprecatedNestedConfigs) {
            let parentConfig = conf.get(parentKey);
            
            if (!this.isValidObject(parentConfig)) continue;

            let modified = false;
            let deprecatedProps = this.deprecatedNestedConfigs[parentKey];

            deprecatedProps.forEach(prop => {
                if (parentConfig.hasOwnProperty(prop)) {
                    delete parentConfig[prop];
                    logger.info(`删除废弃配置: ${parentKey}.${prop}`);
                    modified = true;
                    removedCount++;
                }
            });

            if (modified) {
                conf.set(parentKey, parentConfig);
            }
        }

        // 清理旧的备份（保留最近5个）
        removedCount += this.cleanupOldBackups();

        if (removedCount > 0) {
            logger.info(`清理完成，共删除 ${removedCount} 个废弃配置`);
        }
    }

    /**
     * 清理旧的配置备份（保留最近N个）
     */
    cleanupOldBackups(keepCount = 5) {
        // 获取所有备份键
        let allKeys = this.getAllConfigKeys();
        let backupKeys = allKeys.filter(key => key.startsWith("ConfigBackup_"));

        if (backupKeys.length <= keepCount) {
            return 0;
        }

        // 按时间戳排序（新到旧）
        backupKeys.sort((a, b) => {
            let timeA = a.split('_').pop();
            let timeB = b.split('_').pop();
            return timeB.localeCompare(timeA);
        });

        // 删除旧备份
        let toDelete = backupKeys.slice(keepCount);
        toDelete.forEach(key => {
            conf.delete(key);
        });

        return toDelete.length;
    }

    /**
     * 获取所有配置键
     */
    getAllConfigKeys() {
        // 根据实际的 conf 对象API调整
        if (typeof conf.keys === 'function') {
            return conf.keys();
        } else if (typeof conf.getKeys === 'function') {
            return conf.getKeys();
        }
        return [];
    }
}

// 创建配置管理器实例并初始化
const configManager = new ConfigManager();

// 初始化配置（在插件加载时自动执行）
function initializeConfig() {
    configManager.init();
}

// 如果作为模块使用，延迟初始化
// 如果直接在主文件中使用，立即初始化
if (typeof ll !== 'undefined' && ll.registerPlugin) {
    // 在插件环境中，立即初始化
    initializeConfig();
} else if (typeof module !== 'undefined' && module.exports) {
    // 作为模块导出时，提供初始化方法
    module.exports = {
        ConfigManager: ConfigManager,
        configManager: configManager,
        init: initializeConfig
    };
}
