// 配置版本管理类
class ConfigManager {
    constructor() {
        this.currentVersion = 286;
        this.pluginPath = pluginpath || "./plugins/YEssential";
        this.moduleListPath = `${this.pluginPath}/modules/modulelist.json`;
        
        // 默认配置
        this.configDefaults = {
            "Version": 286,
            "Update": {
                "EnableModule": true,
                "CheckInterval": 120,
                "versionUrl": "https://dl.mcmcc.cc/file/Version.json",
                "baseUrl": "https://dl.mcmcc.cc/file/",
                "files": [
                    { "url": "YEssential.js", "path": "YEssential.js" },
                    { "url": "modules/Cleanmgr.js", "path": "./modules/Cleanmgr.js" },
                    { "url": "modules/ConfigManager.js", "path": "./modules/ConfigManager.js" },
                    { "url": "modules/AsyncUpdateChecker.js", "path": "./modules/AsyncUpdateChecker.js" },
                    { "url": "modules/RadomTeleportSystem.js", "path": "./modules/RadomTeleportSystem.js" },
                    { "url": "modules/Bstats.js", "path": "./modules/Bstats.js" },
                    { "url": "modules/Cd.js", "path": "./modules/Cd.js" }
                ],
                "reloadDelay": 1000,
                "timeout": 30000,
                "checkMissingFilesOnStart": true
            },
            "PVP": {
                // 新增：PVP 模块的高级配置
                "EnabledModule": true,
                "DangerousBlocks": [
                    "minecraft:tnt",
                    "minecraft:respawn_anchor",
                    "minecraft:bed",
                    "minecraft:undyed_shulker_box"
                ]
            },
            "CrossServerTransfer": {
                "EnabledModule": false,
                "servers": [
                    { "server_name": "生存服", "server_ip": "127.0.0.1", "server_port": 19132 }
                ]
            },
            "HubEnabled": 0,
            "NoticeEnabled": 0,
            "CrashModuleEnabled": 0,
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
            "Bstats": {
                "EnableModule": true, // 模块总开关
                "serverUUID": "",      // 服务器唯一标识，留空会自动生成
                "logSentData": false   // 是否在控制台显示发送的数据内容
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
                "status": 0,
                "whmotdmsg": "服务器维护中，请勿进入！",
                "whgamemsg": "服务器正在维护中，请您稍后再来!"
            }
        };

        // 默认模块列表
        this.defaultModules = [
            {
                "path": "cleanmgr.js",
                "name": "CleanMgr"
            },
            {
                "path": "ConfigManager.js",
                "name": "ConfigManager"
            },
            {
                "path": "AsyncUpdateChecker.js",
                "name": "AsyncUpdateChecker"
            },
            {
                "path": "RadomTeleportSystem.js",
                "name": "RadomTeleportSystem"
            },
            {
                "path": "Cd.js",
                "name": "Cd"
            }
        ];

        // 废弃的配置项列表(需要删除的旧配置)
        this.deprecatedConfigs = [
            "OldConfigKey1",
            "ObsoleteFeature",
            "LegacySetting"
        ];

        // 废弃的嵌套配置项(格式:父键.子键)
        this.deprecatedNestedConfigs = {
            "RTP": ["oldProperty", "deprecatedSetting"],
            "Hub": ["unusedField"]
        };

        // 初始化模块列表配置文件
        this.moduleListConfig = null;
    }

    /**
     * 初始化配置系统
     */
    init() {
        // 初始化模块列表
        this.initModuleList();
        
        // 扫描并同步模块
        this.syncModules();
        
        // 原有的配置初始化逻辑
        let savedVersion = conf.get("Version") || 0;
        
        if (savedVersion < this.currentVersion) {
            logger.info(`检测到配置版本更新: ${savedVersion} -> ${this.currentVersion}, 开始迁移配置...`);
            this.migrateConfig(savedVersion);
            conf.set("Version", this.currentVersion);
            logger.info("配置迁移完成!");
        }
        
        // 确保所有配置项都存在
        this.ensureAllConfigs();
        
        // 清理废弃的配置
        this.cleanupDeprecatedConfigs();
    }

    // ========== 模块列表管理 ==========

    /**
     * 初始化模块列表配置文件
     */
    initModuleList() {
        try {
            this.moduleListConfig = new JsonConfigFile(
                this.moduleListPath,
                JSON.stringify({
                    "modules": this.defaultModules
                })
            );
            //logger.info("模块列表配置文件初始化成功");
        } catch (error) {
            logger.error(`模块列表配置文件初始化失败: ${error.message}`);
        }
    }

    /**
     * 扫描模块目录并同步到配置文件
     */
    syncModules() {
        try {
            const modulesDir = `${this.pluginPath}/modules`;
            
            // 获取目录中的所有 .js 文件
            const files = File.getFilesList(modulesDir);
            if (!files || files.length === 0) {
                logger.warn("未找到任何模块文件");
                return;
            }

            // 过滤出 .js 文件
            const jsFiles = files.filter(file => file.endsWith('.js'));
            
            // 获取当前配置的模块列表
            let currentModules = this.moduleListConfig.get("modules") || [];
            let modulesMap = new Map();
            
            // 构建现有模块的映射
            currentModules.forEach(mod => {
                modulesMap.set(mod.path, mod);
            });

            let addedCount = 0;
            let updatedModules = [];

            // 检查文件系统中的模块
            jsFiles.forEach(file => {
                const fileName = file.split(/[/\\]/).pop(); // 兼容不同操作系统路径
                
                if (modulesMap.has(fileName)) {
                    // 模块已存在,保留原有配置
                    updatedModules.push(modulesMap.get(fileName));
                } else {
                    // 发现新模块
                    const moduleName = this.getModuleNameFromFile(fileName);
                    const newModule = {
                        "path": fileName,
                        "name": moduleName
                    };
                    updatedModules.push(newModule);
                    logger.info(`发现新模块: ${fileName} (${moduleName})`);
                    addedCount++;
                }
            });

            // 检查是否有模块被删除
            let removedCount = 0;
            currentModules.forEach(mod => {
                if (!jsFiles.some(file => file.endsWith(mod.path))) {
                    logger.info(`模块已被删除: ${mod.path}`);
                    removedCount++;
                }
            });

            // 更新配置文件
            if (addedCount > 0 || removedCount > 0) {
                this.moduleListConfig.set("modules", updatedModules);
                logger.info(`模块同步完成: 新增 ${addedCount} 个, 删除 ${removedCount} 个`);
            } else {
                //logger.info("模块列表无变化");
            }

        } catch (error) {
            logger.error(`模块同步失败: ${error.message}`);
        }
    }

    /**
     * 从文件名推断模块名称
     * @param {string} fileName 文件名
     * @returns {string} 模块名称
     */
    getModuleNameFromFile(fileName) {
        // 移除 .js 后缀
        let name = fileName.replace(/\.js$/i, '');
        
        // 将常见的命名格式转换为标准格式
        // 例如: random-teleport-system.js -> RandomTeleportSystem
        //      async_update_checker.js -> AsyncUpdateChecker
        
        // 处理横线和下划线分隔
        if (name.includes('-') || name.includes('_')) {
            name = name.split(/[-_]/)
                       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                       .join('');
        } else {
            // 首字母大写
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        
        return name;
    }

    /**
     * 获取所有已注册的模块
     * @returns {Array} 模块列表
     */
    getModules() {
        return this.moduleListConfig.get("modules") || [];
    }

    /**
     * 添加新模块到列表
     * @param {string} path 模块路径
     * @param {string} name 模块名称
     */
    addModule(path, name) {
        let modules = this.getModules();
        
        // 检查模块是否已存在
        if (modules.some(mod => mod.path === path)) {
            logger.warn(`模块已存在: ${path}`);
            return false;
        }

        modules.push({ path, name });
        this.moduleListConfig.set("modules", modules);
        logger.info(`添加模块: ${path} (${name})`);
        return true;
    }

    /**
     * 从列表中移除模块
     * @param {string} path 模块路径
     */
    removeModule(path) {
        let modules = this.getModules();
        let filtered = modules.filter(mod => mod.path !== path);
        
        if (filtered.length === modules.length) {
            logger.warn(`模块不存在: ${path}`);
            return false;
        }

        this.moduleListConfig.set("modules", filtered);
        logger.info(`移除模块: ${path}`);
        return true;
    }

    /**
     * 手动触发模块扫描
     */
    scanModules() {
        logger.info("开始扫描模块目录...");
        this.syncModules();
    }

    // ========== 原有的配置管理方法 ==========

    /**
     * 迁移配置到最新版本
     * @param {number} oldVersion 旧版本号
     */
    migrateConfig(oldVersion) {
        // 备份当前配置
        this.backupConfig(oldVersion);
        
        const migrations = [
            { version: 286, handler: () => this.migrateTo286() }
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

    /**
     * 备份配置
     */
    backupConfig(version) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `ConfigBackup_v${version}_${timestamp}`;
        
        let allConfigs = {};
        for (let key in this.configDefaults) {
            let value = conf.get(key);
            if (value !== undefined) {
                allConfigs[key] = value;
            }
        }

        conf.set(backupKey, {
            version: version,
            timestamp: timestamp,
            configs: allConfigs
        });
    }

    // ========== 版本特定迁移方法 ==========

   migrateTo286() {
    logger.info("迁移到版本2.8.6...");
    
    // 迁移 TRServersEnabled 到 CrossServerTransfer
    let oldEnabled = conf.get("TRServersEnabled");
    let config = conf.get("CrossServerTransfer");
    
    if (!this.isValidObject(config)) {
        config = JSON.parse(JSON.stringify(this.configDefaults.CrossServerTransfer));
    }
    
    if (oldEnabled !== undefined) {
        config.EnabledModule = !!oldEnabled;
        logger.info(`迁移TRServersEnabled值: ${oldEnabled} -> CrossServerTransfer.EnabledModule`);
    }
    
    // 自动迁移 server.json 内容
    try {
        const serverJsonPath = "./plugins/YEssential/data/TrSeverData/server.json";
        if (file.exists(serverJsonPath)) {
            const serverJsonContent = file.readFrom(serverJsonPath);
            if (serverJsonContent) {
                const serverData = JSON.parse(serverJsonContent);
                if (serverData.servers && Array.isArray(serverData.servers)) {
                    config.servers = serverData.servers;
                    logger.info(`成功迁移 server.json 中的 ${serverData.servers.length} 个服务器配置`);
                }
            }
        }
    } catch (e) {
        logger.warn(`迁移 server.json 失败: ${e.message}，将使用默认服务器配置`);
    }
    
    conf.set("CrossServerTransfer", config);
    conf.delete("TRServersEnabled");
    logger.info("TRServersEnabled已迁移到CrossServerTransfer配置对象");
    }

    
    // ========== 配置管理核心方法 ==========

    setIfMissing(key, defaultValue) {
        if (conf.get(key) === undefined) {
            conf.set(key, defaultValue);
            logger.info(`添加缺失配置: ${key} = ${JSON.stringify(defaultValue)}`);
        }
    }

    ensureObjectConfig(key, defaultConfig) {
        let currentConfig = conf.get(key);
        
        if (!this.isValidObject(currentConfig)) {
            conf.set(key, defaultConfig);
            logger.info(`创建对象配置: ${key}`);
            return;
        }

        let merged = this.mergeConfigs(defaultConfig, currentConfig);
        conf.set(key, merged);
        
        let addedProps = this.getAddedProperties(defaultConfig, currentConfig);
        if (addedProps.length > 0) {
            logger.info(`配置 ${key} 新增属性: ${addedProps.join(", ")}`);
        }
    }

    isValidObject(value) {
        return value !== undefined && 
               value !== null && 
               typeof value === 'object' && 
               !Array.isArray(value);
    }

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

    getAddedProperties(defaultConfig, currentConfig) {
        let added = [];
        for (let key in defaultConfig) {
            if (currentConfig[key] === undefined) {
                added.push(key);
            }
        }
        return added;
    }

    ensureAllConfigs() {
        for (let key in this.configDefaults) {
            if (this.isValidObject(this.configDefaults[key])) {
                this.ensureObjectConfig(key, this.configDefaults[key]);
            } else {
                this.setIfMissing(key, this.configDefaults[key]);
            }
        }
    }

    // ========== 清理废弃配置 ==========

    cleanupDeprecatedConfigs() {
        let removedCount = 0;

        this.deprecatedConfigs.forEach(key => {
            if (conf.get(key) !== undefined) {
                conf.delete(key);
                logger.info(`删除废弃配置: ${key}`);
                removedCount++;
            }
        });

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

        removedCount += this.cleanupOldBackups();

        if (removedCount > 0) {
            logger.info(`清理完成,共删除 ${removedCount} 个废弃配置`);
        }
    }

    cleanupOldBackups(keepCount = 5) {
        let allKeys = this.getAllConfigKeys();
        let backupKeys = allKeys.filter(key => key.startsWith("ConfigBackup_"));

        if (backupKeys.length <= keepCount) {
            return 0;
        }

        backupKeys.sort((a, b) => {
            let timeA = a.split('_').pop();
            let timeB = b.split('_').pop();
            return timeB.localeCompare(timeA);
        });

        let toDelete = backupKeys.slice(keepCount);
        toDelete.forEach(key => {
            conf.delete(key);
        });

        return toDelete.length;
    }

    getAllConfigKeys() {
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

// 初始化配置(在插件加载时自动执行)
function initializeConfig() {
    configManager.init();
}

// 如果作为模块使用,延迟初始化
// 如果直接在主文件中使用,立即初始化
if (typeof ll !== 'undefined' && ll.registerPlugin) {
    // 在插件环境中,立即初始化
    initializeConfig();
} else if (typeof module !== 'undefined' && module.exports) {
    // 作为模块导出时,提供初始化方法
    module.exports = {
        ConfigManager: ConfigManager,
        configManager: configManager,
        init: initializeConfig
    };
}