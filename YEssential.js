/*--------------------------------
    YEssential - Refactored
    Produced by Nico6719 and PHEyeji
    Refactored by Manus
----------------------------------*/

// 根据报错信息，require 是相对于 plugins/ 目录解析的
// 路径应从插件文件夹名开始
const pluginName = "YEssential";
const modulesPath = pluginName + "/modules/";

const ctx = require(modulesPath + "GlobalContext");
const DataManager = require(modulesPath + "DataManager");

// 基础配置路径
const pluginpath = "./plugins/YEssential/";
const YEST_LangDir = pluginpath + "lang/";
const datapath = pluginpath + "data/";

// 插件信息
const NAME = "YEssential";
const version = ctx.version;

// 初始化语言
const langFilePath = YEST_LangDir + "zh_cn.json";
let lang = new JsonConfigFile(langFilePath);
ctx.lang = lang;

// 初始化配置
let conf = new JsonConfigFile(pluginpath + "/Config/config.json", JSON.stringify({}));
ctx.conf = conf;

// 初始化数据管理
DataManager.init();

// 导出全局变量以保持兼容性 (针对旧模块)
globalThis.lang = ctx.lang;
globalThis.conf = ctx.conf;
globalThis.homedata = ctx.homedata;
globalThis.warpdata = ctx.warpdata;
globalThis.info = ctx.info;
globalThis.datapath = ctx.datapath;
globalThis.Economy = require(modulesPath + "EconomyManager");
ctx.Economy = globalThis.Economy;
globalThis.EconomyManager = ctx.Economy;
ctx.EconomyManager = ctx.Economy;

/**
 * 模块初始化
 */
(function() {
    const modulesToLoad = [
        modulesPath + "HomeManager",
        modulesPath + "WarpManager",
        modulesPath + "EconomyManager",
    ];

    function initModules() {
        printLogo();
        
        modulesToLoad.forEach(path => {
            try {
                const module = require(path);
                if (module && typeof module.init === "function") {
                    module.init();
                    logger.info(`模块加载成功: ${path}`);
                }
            } catch (e) {
                logger.error(`模块加载失败: ${path} - ${e.message}`);
            }
        });

        // 加载旧版模块
        loadLegacyModules();
    }

    function loadLegacyModules() {
        const moduleListFile = "./plugins/YEssential/modules/modulelist.json";
        try {
            const data = JSON.parse(file.readFrom(moduleListFile));
            data.modules.forEach(m => {
                // 跳过已经重构的模块
                if (m.name === "ConfigManager" || m.name === "Home" || m.name === "Warp") return; 
                
                try {
                    const mod = require(modulesPath + m.path);
                    if (mod && typeof mod.init === "function") mod.init();
                } catch (e) {
                    logger.warn(`旧版模块加载失败: ${m.name}`);
                }
            });
        } catch (e) {
            logger.error("读取旧版模块列表失败");
        }
    }

    function printLogo() {
        logger.info(`YEssential v${version} 正在启动...`);
    }

    mc.listen("onServerStarted", () => {
        initModules();
        logger.info("YEssential 所有模块已就绪。");
    });
})();
