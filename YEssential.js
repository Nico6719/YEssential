/*--------------------------------

    ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  
    ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  
    ╚ ████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     
     ╚ ██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     
       ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗
       ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝
    
                          Produced by Nico6719 and PHEyeji
                 This plugin is distributed under the AGPLv3 License

该插件由Nico6719,PHEyeji联合创作
未经允许禁止擅自修改或者发售
该插件仅在[github,MineBBS,KLPBBS]发布
禁止二次发布插件
语言文件路径（defaultLangContent 及 AsyncLanguageManager 已迁移至 modules/I18n.js）
调用示例： pl.tell(info + lang.get("x.x"))
i18n 默认内容已完整迁移至 modules/I18n.js
----------------------------------*/
// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Admin/dts/helperlib/src/index.d.ts"/> 
const YEST_LangDir = "./plugins/YEssential/lang/";
const pluginpath = "./plugins/YEssential/";
const datapath = "./plugins/YEssential/data/";
const NAME = `YEssential`;
const PluginInfo =`基岩版多功能基础插件 `;
const version = "2.10.12";
const regversion =[2,10,12];
const info = "§l§6[-YEST-] §r";
const offlineMoneyPath = datapath+"/Money/offlineMoney.json";
const offlineNotifyPath = datapath+"/Money/offlineNotify.json";
const langFilePath = YEST_LangDir + "zh_cn.json";

// ── Reload Guard ──────────────────────────────────────────────
// LLSE reload 时不会清除旧的 mc.listen，重复注册会导致事件累积、栈溢出崩溃
// 用全局变量保证所有 mc.listen 只注册一次
const __YEST_FIRST_LOAD__ = !globalThis.__YEST_listeners_registered__;


ll.registerPlugin(NAME, PluginInfo,regversion, {
    Author: "Nico6719",
    License: "AGPL-3.0",
    QQ : "1584573887",
});

// 全局MOTD定时器管理
let motdTimerId = null;

// lang 在此处以空文件初始化（JsonConfigFile 若文件已存在则从磁盘读取）

// modules/I18n.js 加载后会用完整 defaultLangContent 重新赋值并同步到 globalThis.lang

let lang = new JsonConfigFile(langFilePath, JSON.stringify({}));

let conf = new JsonConfigFile(pluginpath +"/Config/config.json",JSON.stringify({}));

// ── Economy 统一读取层（兼容旧config和新Economy块）─────────
// v2.10.5: 改为缓存模式，避免每次 getter 都重读配置文件
// 调用 economyCfg.refresh() 可在 reload 后刷新缓存
const economyCfg = (() => {
    let _cache = null;
    function _load() {
        const e = conf.get("Economy");
        return {
            mode:       e ? (e.mode || "scoreboard") : (conf.get("LLMoney") == 1 ? "llmoney" : "scoreboard"),
            scoreboard: (e ? e.Scoreboard : conf.get("Scoreboard")) || "money",
            coinName:   (e ? e.CoinName   : conf.get("CoinName"))   || lang.get("CoinName") || "金币",
        };
    }
    return {
        refresh()        { _cache = _load(); },
        get mode()       { return (_cache || (_cache = _load())).mode; },
        get isLLMoney()  { return this.mode === "llmoney"; },
        get scoreboard() { return (_cache || (_cache = _load())).scoreboard; },
        get coinName()   { return (_cache || (_cache = _load())).coinName; },
    };
})();

let modulelist = new JsonConfigFile(pluginpath +"/modules/modulelist.json",JSON.stringify({
  "modules": [
    {
      "path": "ConfigManager.js",
      "name": "ConfigManager"
    },
    {
      "path": "AsyncUpdateChecker.js",
      "name": "AsyncUpdateChecker"
    }
  ]
}));

let homedata = new JsonConfigFile(datapath +"homedata.json",JSON.stringify({}));
  
let rtpdata = new JsonConfigFile(datapath +"/RTPData/Rtpdata.json",JSON.stringify({}));

let warpdata = new JsonConfigFile(datapath +"warpdata.json",JSON.stringify({}));
  
let noticeconf = new JsonConfigFile(datapath + "/NoticeSettingsData/playersettingdata.json",JSON.stringify({}));

let pvpConfig = new JsonConfigFile(datapath +"/PVPSettingsData/pvp_data.json",JSON.stringify({}));

let MdataPath = datapath +"/Money/Moneyranking.json";

let offlineMoney = new JsonConfigFile(offlineMoneyPath, "{}");

let MoneyHistory = new JsonConfigFile(datapath +"/Money/MoneyHistory.json",JSON.stringify({}));

let moneyranking = new JsonConfigFile(MdataPath, "{}");

const defaultServerConfig = JSON.stringify({
    servers: [
      { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
    ]
});

let servertp = new JsonConfigFile(datapath +"/TrSeverData/server.json", defaultServerConfig);

let tpacfg = new JsonConfigFile(datapath +"/TpaSettingsData/tpaAutoRejectConfig.json",JSON.stringify({}));

// isSending 防重复锁已移至 modules/Redpacket.js

// 红包数据及红包系统逻辑已迁移至 modules/Redpacket.js
    
// 文件操作工具类
// v2.10.5: 移除了在 QuickJS 单线程环境下无实际异步效果的 Promise 包装，改为直接同步调用
class AsyncFileManager {
    static readFile(path, defaultContent = '{}') {
        try {
            if (!file.exists(path)) {
                file.writeTo(path, defaultContent);
                return JSON.parse(defaultContent);
            }
            const content = file.readFrom(path);
            return JSON.parse(content || defaultContent);
        } catch (e) {
            logger.error(`读取文件失败: ${path}`, e);
            return JSON.parse(defaultContent);
        }
    }

    static writeFile(path, data) {
        try {
            const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            file.writeTo(path, content);
            return true;
        } catch (e) {
            logger.error(`写入文件失败: ${path}`, e);
            return false;
        }
    }
}
// ── 全局随机颜色对（Logo、Tip、logInfo 共用）────────────────
function randomVividColor() {
    // 排除绿色(90°~150°)和深紫色(260°~300°)
    // 可用色相段：[0,90) [150,260) [300,360) 共 260°
    const rand = Math.random() * 260;
    let h;
    if      (rand < 90)  h = rand;           // 红/橙/黄
    else if (rand < 200) h = rand + 60;      // 青/蓝  (150~260)
    else                 h = rand + 100;     // 粉/洋红 (300~360)

    const s = 0.90 + Math.random() * 0.10;  // 90%~100% 高饱和
    const l = 0.65 + Math.random() * 0.15;  // 65%~80%  高亮度
    const a = s * Math.min(l, 1 - l);
    function f(n) {
        const k = (n + h / 30) % 12;
        return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    }
    return [f(0), f(8), f(4)];
}

function generateColorPair() {
    const c1 = randomVividColor();
    let c2, attempts = 0;
    do {
        c2 = randomVividColor();
        const diff = Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]) + Math.abs(c1[2]-c2[2]);
        if (diff > 150 || attempts++ > 20) break;
    } while (true);
    return [c1, c2];
}

// 全局唯一颜色对，本次启动所有渐变共用
const [GLOBAL_C1, GLOBAL_C2] = generateColorPair();

function globalLerpColor(t) {
    return [
        Math.round(GLOBAL_C1[0] + (GLOBAL_C2[0] - GLOBAL_C1[0]) * t),
        Math.round(GLOBAL_C1[1] + (GLOBAL_C2[1] - GLOBAL_C1[1]) * t),
        Math.round(GLOBAL_C1[2] + (GLOBAL_C2[2] - GLOBAL_C1[2]) * t)
    ];
}
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
// ─────────────────────────────────────────────────────────
// ── 模块全局依赖注入 ────────────────────────────────────────
// LiteLoader 的 require() 沙箱无法继承主脚本词法作用域的 let/const 变量，
// 通过 globalThis 显式暴露供所有模块访问（包括 PVP、Fcam、Notice 等）
var stats = false; // 维护状态，避免 IIFE 内 "stats is not defined"
Object.assign(globalThis, {
    // 配置 & 数据文件
    conf, lang, info, datapath, pluginpath,
    pvpConfig, noticeconf, homedata, warpdata, rtpdata,
    MoneyHistory, moneyranking, tpacfg, servertp,
    offlineMoney, offlineMoneyPath, MdataPath,
    // 常量
    YEST_LangDir, NAME, version, regversion, PluginInfo,
    langFilePath,
    // Economy 配置对象（Redpacket.js 等模块需要）
    economyCfg,
    // defaultLangContent 由 modules/I18n.js 加载时写入 globalThis
    // 渐变日志工具（function 声明虽然会提升，但 GLOBAL_C1/C2 是 const，
    // 显式挂载确保 require() 沙箱内也能访问）
    globalLerpColor, randomGradientLog,
    // 文件工具（I18n.js 的 mergeLangFiles 需要）
    AsyncFileManager,
    // ── 工具函数（均为 function 声明，JS 引擎会提升，可安全放此处）──
    // Fcam.js 费用检查（根因：此函数未暴露导致 "smartMoneyCheck is not defined"）
    smartMoneyCheck,
    // 其他 GUI/工具函数（function 声明，提升后可用）
    showInsufficientMoneyGui, openPlayerSelectionGui,
    displayMoneyInfo, ranking,
    // 注意：Economy / EconomyManager / OfflineMoneyCache / Logger 均为 const，
    // 不能在定义前引用（TDZ）。若模块需要，在其定义后通过
    // globalThis.Economy = Economy; 单独追加。
});

/**
 * YEssential - 模块初始化管理器
 * 自动加载并初始化 modules 文件夹中的所有模块
 */
(function() {

  var BASE_PATH = "plugins/YEssential/modules/";

  // ── 渐变日志工具 ──────────────────────────────────────────
  function gradientLog(text, r1, g1, b1, r2, g2, b2) {
      const len = text.length;
      let out = '';
      for (let i = 0; i < len; i++) {
          const t = len <= 1 ? 0 : i / (len - 1);
          const r = Math.round(r1 + (r2 - r1) * t);
          const g = Math.round(g1 + (g2 - g1) * t);
          const b = Math.round(b1 + (b2 - b1) * t);
          out += `\x1b[38;2;${r};${g};${b}m` + text[i];
      }
      logger.log(out + '\x1b[0m');
  }
  const logInfo  = text => randomGradientLog(text);
  const logError = text => gradientLog(text, 255,  80,   0, 200,   0,   0);
  const logWarn  = text => gradientLog(text, 255, 240,   0, 255, 140,   0);
  // ─────────────────────────────────────────────────────────

  var modules = [];
  try {
    var fullPath = BASE_PATH + "modulelist.json";
    var moduleListData = file.readFrom(fullPath);

    if (moduleListData == null || moduleListData == undefined) {
        throw new Error("文件存在但读取内容为空！请检查路径是否正确: " + fullPath);
    }

    var moduleList = JSON.parse(moduleListData);
    modules = moduleList.modules.map(function(module) {
      return {
        path: BASE_PATH + module.path,
        name: module.name
      };
    });

  } catch (err) {
    logError("读取模块列表失败: " + err);
    logError("请确保 " + BASE_PATH + "modulelist.json 文件存在且格式正确");
  }

  /**
   * 初始化所有模块
   */
  function initModules() {

    var loadedCount  = 0;
    var failedCount  = 0;
    var currentIndex = 0;

    function loadNextModule() {
      if (currentIndex >= modules.length) {
        let whConfig = conf.get("wh") || { EnableModule: true, status: 0 };
        stats = whConfig.status === 1;

        if (whConfig.EnableModule && whConfig.status === 1) {
            mc.setMotd(conf.get("wh").motd || "服务器维护中，请勿进入！");
        } else {
            Motd();
        }

        try {
            initializePlugin();

            if (failedCount > 0) {
                const _lf = globalThis.lang || lang;
                logWarn((_lf.get("init.fail")) || "部分模块加载失败，请检查日志");
            } else {
                setTimeout(() => {
                if (conf.get("SimpleLogOutPut")== false) {
                const _l = globalThis.lang || lang;
                logInfo((_l.get("init.success")) || "所有模块加载成功！");
                logInfo("-".repeat(50));
                logInfo((_l.get("Tip1")) || "");
                logInfo((_l.get("Tip2")) || "");
                logInfo((_l.get("Tip3")) || "");
                logInfo("-".repeat(50));
                }},100)
            }
        } catch (error) {
            logError("服务器启动初始化失败: " + error.message);
            logError("错误堆栈: " + error.stack);
        }

        return;
      }

      var moduleInfo = modules[currentIndex];
      currentIndex++;

      try {
        if (conf.get("SimpleLogOutPut")== false) {
        logInfo("正在加载模块: " + moduleInfo.name + " (" + moduleInfo.path + ")");
        }
        var module = require(moduleInfo.path);

        if (!module) {
          logWarn("模块 " + moduleInfo.name + " 加载失败: 返回值为空");
          failedCount++;
          setTimeout(loadNextModule, 500);
          return;
        }

        if (typeof module.init === "function") {
          module.init();
          loadedCount++;
        }
        else if (typeof module.initializeConfig === "function") {
          module.initializeConfig();
          loadedCount++;
        }
        else if (module.ConfigManager && typeof module.init === "function") {
          logInfo("执行模块初始化: " + moduleInfo.name + ".init()");
          module.init();
          loadedCount++;
        }
        else {
          loadedCount++;
        }

      } catch (err) {
        logError("✗ 模块 " + moduleInfo.name + " 加载失败: " + err);
        logError("错误堆栈: " + (err.stack || "无堆栈信息"));
        failedCount++;
      }

      setTimeout(loadNextModule, 10);
    }
    setTimeout(() => {
        printGradientLogo();   
        loadNextModule();
    }, 2000);
  }
  setTimeout(function() {
    initModules();
  }, 1);
})();
function printGradientLogo() {
    const logo = [
    " __   _______ ____ ____  _____ _   _ _____ ___    _    _     ",
    " \\ \\ / / ____/ ___/ ___|| ____| \\ | |_   _|_ _|  / \\  | |    ",
    "  \\ V /|  _| \\___ \\___ \\|  _| |  \\| | | |  | |  / _ \\ | |    ",
    "   | | | |___ ___) |__) | |___| |\\  | | |  | | / ___ \\| |___ ",
    "   |_| |_____|____/____/|_____|_| \\_| |_| |___/_/   \\_\\_____|",                                                      
    ];

                                               
    const reset = '\x1b[0m';

    // 单行渐变（版本信息 / Tip）—— 与 Logo 共用同一颜色对
    function gradientLine(text) {
        const len = text.length;
        let out = '';
        for (let i = 0; i < len; i++) {
            const t = len <= 1 ? 0 : i / (len - 1);
            const [r, g, b] = globalLerpColor(t);
            out += `\x1b[38;2;${r};${g};${b}m` + text[i];
        }
        return out + reset;
    }

    logger.log('');

    // Logo 主体：逐字符跨行整体渐变
    const totalChars = logo.length * logo[0].length;
    logo.forEach((line, lineIndex) => {
        let coloredLine = '';
        for (let i = 0; i < line.length; i++) {
            const t = (lineIndex * line.length + i) / totalChars;
            const [r, g, b] = globalLerpColor(t);
            coloredLine += `\x1b[38;2;${r};${g};${b}m` + line[i];
        }
        logger.log(coloredLine + reset);
    });

    logger.log('');
    // Tips 和分割线移至所有模块加载完毕后输出，确保 I18n 已就绪
    logger.log(gradientLine(PluginInfo + "版本:" + version + ", 作者：Nico6719"));
    randomGradientLog("-".repeat(50));
}
function initializePlugin() {
    // 第一步：获取并创建计分板
    const scoreboardName = economyCfg.scoreboard;
    
    // 检查计分板是否存在，不存在则创建
    try {
        const allObjectives = mc.getAllScoreObjectives();
        const objectiveExists = allObjectives.some(obj => obj === scoreboardName);
        
        if (!objectiveExists) {
            mc.runcmdEx(`scoreboard objectives add ${scoreboardName} dummy`);
        }   
    } catch (error) {
        logger.error(`创建计分板失败: ${error.message}`);
        // 尝试强制创建
        mc.runcmdEx(`scoreboard objectives add ${scoreboardName} dummy`);
    }
    
    // 第二步：异步合并语言文件（由 modules/I18n.js 在加载时自动处理）
    
    // 第三步：提示维护功能是否开启
    if (Maintenance.isActive) {
        setTimeout(() => {
            randomGradientLog(lang.get("wh.warn"));
        }, 1000);
    }
    
    // 第四步：启用死亡不掉落
    if (conf.get("KeepInventory")) {
        mc.runcmdEx("gamerule KeepInventory true");
        randomGradientLog(lang.get("gamerule.KeepInventory.true"));
    }
    
    // 第五步（公告更新检测）已移至 Notice.js 模块

    // 第六步：清理残留的灵魂出窍模拟玩家
    const allPlayers = mc.getOnlinePlayers();
    allPlayers.forEach(p => {
        // FCAM 创建的模拟玩家通常以 _sp 结尾
        if (p.isSimulatedPlayer() && p.name.endsWith("_sp")) {
            p.simulateDisconnect();
        }
    });
    
    // 第七步：异步初始化更新检查器并检查更新
    setTimeout(() => {
        (async () => {
            try {
                // 先初始化更新检查器（检查缺失文件）
                await AsyncUpdateChecker.init();
                
                // 获取更新配置
                const updateConfig = conf.get("Update");
                
                // 检查是否启用更新模块
                if (updateConfig && updateConfig.EnableModule) {
                    
                    // 执行更新检查
                    await AsyncUpdateChecker.checkForUpdates(version);
                    
                    // 设置定时检查（如果配置了检查间隔）
                    if (updateConfig.CheckInterval > 0) {
                        setInterval(async () => {
                            try {
                                await AsyncUpdateChecker.checkForUpdates(version);
                            } catch (error) {
                                logger.error(`定时更新检查失败: ${error.message}`);
                            }
                        }, updateConfig.CheckInterval * 60 * 1000);
                    }
                } 
            } catch (error) {
                logger.error(`更新检查失败: ${error.message}`);
            }
        })();
    }, 3000);
}
// AsyncLanguageManager 已迁移至 modules/I18n.js
function ranking(plname) {
    let pl = mc.getPlayer(plname);
    if (!pl) return;

    // 1. 读取硬盘上的基础数据
    let rawFile = moneyranking.read();
    let datas = rawFile ? JSON.parse(rawFile) : {};

    // 2. [关键修复] 合并内存缓存中的其他玩家数据
    for (let name in moneyCache) {
        datas[name] = moneyCache[name];
    }

    // 3. [核心修复] 强制获取“你自己”的当前实时余额
    // 不管文件或缓存里是多少，现在立刻查一次真实的钱
    let myRealMoney;
    if (economyCfg.isLLMoney) {
        myRealMoney = pl.getMoney(); // LLMoney模式
    } else {
        myRealMoney = pl.getScore(economyCfg.scoreboard); // 计分板模式
    }

    // 如果获取到了余额，强制覆盖进列表，保证你自己看到的数据是100%正确的
    if (myRealMoney !== undefined && myRealMoney !== null) {
        datas[pl.realName] = myRealMoney;
        
        // 顺便更新一下缓存，防止下次又变回去
        moneyCache[pl.realName] = myRealMoney;
        moneyDirty = true;
    }

    // 4. 数据转为数组并排序
    let lst = Object.keys(datas).map(name => ({
        name: name,
        money: datas[name]
    }));

    if (lst.length === 0) {
        pl.tell(info + lang.get("no.ranking.data"));
        return;
    }

    // 从大到小排序
    lst.sort((a, b) => b.money - a.money);
    
    // 截取前50名
    const rankingData = lst.slice(0, 50);
    // === 模式 1: 详细 UI ===
    if (conf.get("Economy").RankingModel == "New" ) {
        const total = rankingData.reduce((sum, curr) => sum + curr.money, 0);

        let form = mc.newSimpleForm()
            .setTitle(`§l§6■ 财富排行榜 ■ §r§8[前${rankingData.length}名]`)
            .setContent(
                `§7服务器总财富: §6${formatMoney(total)}\n` +
                `§7统计时间: §f${new Date().toLocaleTimeString()}\n` +
                `§6点击按钮返回菜单 | §a你的余额: ${formatMoney(myRealMoney)}\n` +
                `§8═════════════════════`
            );

        rankingData.forEach((v, index) => {
            const rank = index + 1;
            const percentage = total > 0 ? (v.money / total * 100).toFixed(1) : "0.0";
            
            // 如果这一行是你自己，加粗显示
            let entryName = v.name === pl.realName ? `§e§l[我] ${v.name}§r` : v.name;

            form.addButton(
                `${getRankPrefix(rank)} §l${rank}. §r${entryName}\n` +
                `§l§c├ 持有: ${formatMoney(v.money)}` +
                ` §r§l占比: §a${percentage}%`
            );
        });

        pl.sendForm(form, (pl, id) => {
            if (id !== null) pl.tell(info + lang.get("money.callback.menu"));
            pl.runcmd("moneygui");
        });

        // 格式化数字函数
        function formatMoney(amount) {
            if (amount === undefined || amount === null) return "0";
            if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M";
            if (amount >= 1e3) return (amount / 1e3).toFixed(1) + "K";
            return amount.toLocaleString();
        }

        // 排名图标函数
        function getRankPrefix(rank) {
            return ["§b☆", "§c◆", "§a▣"][Math.min(2, rank - 1)] || "§7";
        }
    } 
    // === 模式 0: 简单文本列表 ===
    else {
        let form = mc.newSimpleForm();
        let str = '';
        rankingData.forEach((v) => {
            str += `${v.name}: ${v.money}\n`;
        });
        form.setTitle(lang.get("ranking.list"));
        form.setContent(str);
        pl.sendForm(form, (pl, id) => {
            if (id == null) pl.runcmd("moneygui");
        });
    }
}
let transdimid = {
    0:"主世界",
    1:"下界",
    2:"末地"
}
/////////////////////////////////////////////////////////////////////////////////////////////
// 金币排行榜更新优化 - 使用内存缓存减少文件I/O
// [fix] moneyCache 改为普通 Object，避免与 for...in / Object.keys 等 API 混用
// 原来声明为 new Map() 但到处用 obj[key] / for...in / Object.keys 访问，
// 导致 ranking() 合并缓存时完全读不到数据（Map 不可被 for...in 枚举）
let moneyCache = {};
let moneyDirty = false;
function updateSinglePlayerCache(pl) {
    if (!pl) return;
    const isLLMoney = economyCfg.isLLMoney;
    const moneyValue = isLLMoney ? pl.getMoney() : pl.getScore(economyCfg.scoreboard);
    if (moneyValue !== null && moneyValue !== undefined) {
        if (moneyCache[pl.realName] !== moneyValue) {
            moneyCache[pl.realName] = moneyValue;
            moneyDirty = true;
        }
    }
}

setInterval(() => {
    mc.getOnlinePlayers().forEach(pl => updateSinglePlayerCache(pl));
}, 30000);

// 每60秒批量写入文件（仅在有变化时）
setInterval(() => {
    if (moneyDirty) {
        Object.keys(moneyCache).forEach(name => {
            moneyranking.set(name, moneyCache[name]);
        });
        moneyDirty = false;
    }
}, 60000);

// 玩家退出时立即保存其数据
if (__YEST_FIRST_LOAD__) {
mc.listen("onLeft", (pl) => {
    if (moneyCache[pl.realName] !== undefined) {
        moneyranking.set(pl.realName, moneyCache[pl.realName]);
        delete moneyCache[pl.realName];
    }
});
}
// YEssential.js - servers 命令
let Sercmd = mc.newCommand("servers", "§l§a跨服传送", PermType.Any);
Sercmd.overload([]);
Sercmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    let config = conf.get("CrossServerTransfer");
    if (!config || !config.EnabledModule) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (!pl || typeof pl.sendText !== "function") {
        logger.error(info+lang.get("player.isnull"));
        return;
    }
    let serverList = [];
    try {
        serverList = config.servers || [];
    } catch (e) {
        logger.error(lang.get("server.config.loaderror"), e);
        pl.tell(info + lang.get("server.load.error"));
        return;
    }

    if (serverList.length === 0) {
        logger.error(lang.get("no.server.cantpto"));
        pl.tell(info + lang.get("no.server.can.tp"));
        return;
    }

    let form = mc.newSimpleForm();
    form.setContent(lang.get("choose.a.server"))
    form.setTitle(lang.get("server.from.title"));
    serverList.forEach((server) => {
        form.addButton(`§l§b${server.server_name}\n§7IP: ${server.server_ip}:${server.server_port}`);
    });

    pl.sendForm(form, (pl, id) => {
        if (id === null) return;

        const targetServer = serverList[id];
        if (!targetServer) {
            pl.tell(info + lang.get("server.no.select"));
            return;
        }

        try {
            pl.transServer(targetServer.server_ip, targetServer.server_port);
            mc.broadcast(info+`§a${pl.realName} 前往了 ${targetServer.server_name}`);
        } catch (e) {
            logger.error(lang.get("tpa.fail"), e);
            pl.tell(info + lang.get("server.tp.fail"));
        }
    });
});
Sercmd.setup();
//Hub
mc.regPlayerCmd('hub', '打开回城菜单', (pl) => {
    if (conf.get("Hub").EnabledModule == 0) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    const Hub = conf.get("Hub")
    const form = mc.newSimpleForm();
    form.setTitle(lang.get("hub.tp.check"));
    form.setContent([
        '§e目标位置：',
        `§bX: §f${Hub.x}`,
        `§bY: §f${Hub.y}`,
        `§bZ: §f${Hub.z}`,
        `§b维度: §f${getDimensionName(Hub.dimid)}`
    ].join('\n'));
    
    form.addButton(lang.get("hub.tp.now"), 'textures/ui/confirm');
    form.addButton(lang.get("hub.tp.notnow"), 'textures/ui/cancel');
    
    pl.sendForm(form, (pl, id) => {
        if (id === 0) teleportPlayer(pl);
    });
});
// 注册 /sethub 指令
mc.regPlayerCmd('sethub', '设置回城点', (pl) => {
    if (!pl || !pl.isOP()) {
        pl.tell(info+lang.get("player.not.op"));
        return;
    }
    ///const pos = pl.pos;
    Hubdata = {
        "x": pl.pos.x.toFixed(1) * 1, // toFixed(1) 转为字符串后通过 *1 转为数字
        "y": pl.pos.y.toFixed(1) * 1,
        "z": pl.pos.z.toFixed(1) * 1,
        "dimid": pl.pos.dimid,       // 直接使用原始值（已是数字）
        isSet: true
    };
    conf.set("Hub",Hubdata)
    pl.tell([
        '§a回城点已设置为：',
        `§eX: §f${pl.pos.x.toFixed(1)}`,
        `§eY: §f${pl.pos.y.toFixed(1)}`,
        `§eZ: §f${pl.pos.z.toFixed(1)}`,
        `§e维度: §f${getDimensionName(pl.pos.dimid)}`
    ].join('\n'));
});

// 维度ID转名称
function getDimensionName(id) {
    const dimensions = {
        0: "主世界",
        1: "下界",
        2: "末地"
    };
    return dimensions[id] || `未知维度 (ID: ${id})`;
}
// 传送功能
function teleportPlayer(pl,player) {
    try {
        const Hub =conf.get("Hub")
        pl.teleport(
            parseFloat(Hub.x),
            parseFloat(Hub.y),
            parseFloat(Hub.z),
            parseInt(Hub.dimension), // 维度转为整数
            { checkMatrix: true } // 选项参数
        );
        pl.tell(lang.get("hub.tp.success"));       
    } catch (e) {
        pl.tell(lang.get("hub.tp.fail")`${e.message}`);
        logger.error(e.stack);
    }
}
// 金币信息显示函数
function displayMoneyInfo(pl, target, isSelf = true) {
    if (!pl || !target) return "信息获取失败";
    const prefix = isSelf ? "你的" : `玩家 ${target.realName} 的`;
    
    if (!economyCfg.isLLMoney) {
        const money = target.getScore(economyCfg.scoreboard);
        pl.sendText(info + `${prefix}当前金币为：${money}`);
        return `${prefix}${conf.get("Economy").CoinName}为: ${money}`;
    } else {
        const money = target.getMoney();
        pl.sendText(info + `${prefix}当前LLMoney金币为：${money}`);
        return `${prefix}${conf.get("Economy").CoinName}为: ${money}`;
    }
}

if (__YEST_FIRST_LOAD__) {
mc.listen("onConsoleCmd",(cmd)=>{
    if(cmd.toLowerCase() != "stop" || lang.get("stop.msg") == 0 ) return
    let msg = lang.get("stop.msg")
    mc.getOnlinePlayers().forEach((pl)=>{
        pl.disconnect(msg)
    })
    mc.runcmdEx("stop")  //再次尝试
})
}
//自杀模块

let suicidecmd = mc.newCommand("suicide","自杀",PermType.Any)
suicidecmd.overload([])
suicidecmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!economyCfg.isLLMoney){
            if(!smartMoneyCheck(pl.realName,conf.get("suicide"))) return pl.tell(info + lang.get("money.no.enough"));
    }else{
            if(!smartMoneyCheck(pl.realName,conf.get("suicide"))) return pl.tell(info + lang.get("money.no.enough"));
    }
    pl.tell(info + lang.get("suicide.kill.ok"));
    pl.kill()

})
suicidecmd.setup()

function Motd(){
    // 清理旧的定时器，防止内存泄漏
    if (conf.get("Motd").EnabledModule == 0 ) return;

    if (motdTimerId !== null) {
        clearInterval(motdTimerId);
        motdTimerId = null;
    }
    
    let motds = conf.get("Motd").message;
    if (!motds || motds.length === 0) {
        logger.warn(lang.get("Motd.config.isemp"));
        return;
    }
    
    let index = 0;
    motdTimerId = setInterval(() => {
        mc.setMotd(motds[index]);
        index = (index + 1) % motds.length;
    }, 5000);
}

// 灵魂出窍（FCAM）
//维护模块
// 初始化维护状态变量，从配置读取

const Maintenance = {
    get config() { return conf.get("wh") || { EnableModule: true, status: 0 }; },
    get isActive() { return this.config.status === 1; },
    setStatus: function(status) {
        let c = this.config;
        c.status = status ? 1 : 0;
        conf.set("wh", c);
        return status;
    }
};

let whcmd = mc.newCommand("wh", "维护模式", PermType.GameMasters)
whcmd.overload([])

whcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player;
    if (!Maintenance.config.EnableModule) return out.error(lang.get("module.no.Enabled"));
    const newState = Maintenance.setStatus(!Maintenance.isActive);
    if (!pl) {
    randomGradientLog(`维护模式已${newState ? "开启" : "关闭"}`);
    }else{
    pl.sendText(`维护模式已${newState ? "开启" : "关闭"}`);
    }
    if (newState) {
        // 开启维护模式时：停止MOTD轮播，设置维护信息
        if (motdTimerId !== null) {
            clearInterval(motdTimerId);
            motdTimerId = null;
        }
        const whConfig = conf.get("wh");
        mc.setMotd(whConfig.whmotdmsg);
        mc.getOnlinePlayers().forEach((player) => {
            if (!player.isSimulatedPlayer() && !player.isOP()) {
                player.kick(whConfig.whmotdmsg);
            }
        });
    } else {
        // 关闭维护模式时：恢复MOTD轮播
        Motd();
    }
})
whcmd.setup()

if (__YEST_FIRST_LOAD__) {
mc.listen("onPreJoin", (pl) => {
    // 检查模块是否启用
    let currentConfig = conf.get("wh") || { EnableModule: true, status: 0 , whmotdmsg: "服务器维护中，请勿进入！", whgamemsg: "服务器正在维护中，请您稍后再来!"};
    if (!currentConfig.EnableModule) return;
    if (pl.isSimulatedPlayer()) return;
    if (pl.isOP()) return;
    if (Maintenance.isActive) {
        pl.kick(currentConfig.whgamemsg);            
    }
})
}

function getRandomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

// 优化的唯一时间戳生成器
let operationCounter = 0;
function getUniqueTimestamp() {
    return `${system.getTimeStr()}-${operationCounter++}`;
}

// moneys指令相关
const moneycmd = mc.newCommand("moneys", "金币", PermType.GameMasters);
moneycmd.mandatory("option", ParamType.String);
moneycmd.optional("player", ParamType.String);
moneycmd.optional("amount", ParamType.Int);
moneycmd.overload(["option", "player", "amount"]);
moneycmd.setCallback((cmd, ori, out, res) => {
    if (typeof res.player !== "string" || res.player.trim() === "") {
        return out.error(info + lang.get("moneys.command.error"));
    }

    const targetPl = mc.getPlayer(res.player);
    if (!targetPl) return out.error(info + lang.get("money.tr.noonline"));

    const coinName = economyCfg.coinName;
    const history = MoneyHistory.get(targetPl.realName);
    const timestamp = getUniqueTimestamp();

    const logAndNotify = (actionKey, successKey, economyMethod, amount) => {
        if (amount === undefined || amount === null) {
            return out.error(`§c请指定数量！用法: /moneys ${res.option} <玩家> <数量>`);
        }
        Economy.execute(targetPl, economyMethod, amount);
        
        // --- 修改开始：统一格式并增加操作员信息 ---
        const operatorName = ori.player ? ori.player.realName : "控制台";
        history[timestamp] = `${coinName}${lang.get(actionKey)}${amount} (操作员: ${operatorName})`;
        // --- 修改结束 ---

        MoneyHistory.set(targetPl.realName, history);
        out.success(info + lang.get(successKey)
            .replace("${player}", res.player)
            .replace("${coin}", coinName)
            .replace("${amount}", amount));
    };

    const handlers = {
        set:     () => logAndNotify("money.op.set",    "moneys.set.success", "set",    res.amount),
        add:     () => logAndNotify("money.op.add",    "moneys.add.success", "add",    res.amount),
        del:     () => logAndNotify("money.op.remove", "moneys.del.success", "reduce", res.amount),
        get:     () => {
            out.success(info + lang.get("moneys.get.result")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", Economy.get(targetPl)));
        },

        history: () => {
            // 统一调用
            showUnifiedHistory(ori.player, res.player); 
        }
    };

    const handler = handlers[res.option];
    if (handler) handler();
    else out.error(info + lang.get("moneys.command.error"));
});
moneycmd.setup();
let moneygui = mc.newCommand("moneygui","金币", PermType.Any)
moneygui.overload([])
moneygui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error(lang.get("warp.only.player"))
    if(pl.isOP()){
        OPMoneyGui(pl.realName)
    }else{
        MoneyGui(pl.realName)
    }

})
moneygui.setup()

function MoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    // [fix] 一次读取，后续复用，避免每次 addButton 都重新读配置文件
    const econConf  = conf.get("Economy");
    const coinName  = econConf.CoinName;
    const rpEnabled = conf.get("RedPacket").EnabledModule == 1;

    let fm = mc.newSimpleForm()
    fm.setTitle(coinName)
    fm.addButton((lang.get("money.query") || "查询") + coinName, "textures/ui/MCoin")
    fm.addButton((lang.get("money.transfer") || "转账") + coinName, "textures/ui/trade_icon")
    fm.addButton(lang.get("money.offline.transfer.btn") || "转账给离线玩家", "textures/ui/FriendsDiversity")
    fm.addButton((lang.get("money.view") || "查看") + coinName + (lang.get("money.history") || "历史记录"), "textures/ui/book_addtextpage_default")
    fm.addButton(coinName + (lang.get("money.player.list") || "排行榜"), "textures/ui/icon_book_writable")
    if (rpEnabled){
        fm.addButton(lang.get("rp.menu.1") || "红包", "textures/ui/gift_square")
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        
        let currentId = id;
        if (!rpEnabled && currentId >= 5) {
            currentId += 1;
        }

        switch(currentId){
           case 0:
                let fm = mc.newSimpleForm()
                fm.setTitle(lang.get("money.query") + coinName)
                const content = displayMoneyInfo(pl, pl);
                fm.setContent(content);
                pl.sendForm(fm, (pl, id) => {
                if (id === null) return pl.runcmd("moneygui");
                });
                break;
            case 1:
                MoneyTransferGui(pl.realName)
                break;
            case 2:
                MoneyTransferOfflineGui(pl.realName)
                break;
            case 3:
                showUnifiedHistory(pl, pl.realName);
                break;
            case 4:
                ranking(pl.realName)
                break;
            case 5:
                redpacketgui(pl.realName)
                break
        }
    })
}
function redpacketgui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("rp.menu.1"));
    fm.addButton(lang.get("rp.send.packet"), "textures/ui/trade_icon");
    fm.addButton(lang.get("rp.open.packet"), "textures/ui/MCoin");
    fm.addButton(lang.get("rp.all.help"), "textures/ui/book_addtextpage_default");

    pl.sendForm(fm, (pl, id) => {
        if (id === null) return pl.tell(info + lang.get("gui.exit"));

        switch (id) {
            case 0: // 发红包界面
                const sendFm = mc.newCustomForm().setTitle(lang.get("rp.send.packet"));
                sendFm.addDropdown(lang.get("redpacket.type"), [
                    lang.get("rp.random.packet"), 
                    lang.get("rp.average.packet")
                ]);
                sendFm.addInput(lang.get("rp.send.amount"), "请输入总金额", "1", lang.get("rp.send.amount.tip") || "");
                sendFm.addInput(lang.get("rp.send.count"), "请输入红包个数", "1", lang.get("rp.send.count.tip") || "");

                pl.sendForm(sendFm, (pl, data) => {
                    if (data === null || data === undefined) return pl.runcmd("moneygui");
                    // 这里的索引必须严格对应上面的 add 顺序：
                    // data[0] -> Dropdown (类型)
                    // data[1] -> Input (金额)
                    // data[2] -> Input (个数)
                    const type = data[0];
                    let amountStr = data[1];
                    let countStr = data[2];

                    // 1. 金额验证
                    if (!amountStr) return pl.tell(info + lang.get("money.tr.noinput"));
                    
                    let amount;
                    if (amountStr.toLowerCase() === "all") {
                        amount = Economy.get(pl);
                    } else if (/^\d+$/.test(amountStr)) {
                        amount = parseInt(amountStr);
                    } else {
                        return pl.tell(info + lang.get("key.not.number"));
                    }

                    if (amount <= 0) return pl.tell(info + lang.get("money.must.bigger0"));

                    // 2. 个数验证
                    if (!countStr) return pl.tell(info + lang.get("money.tr.noinput"));
                    if (!/^\d+$/.test(countStr)) return pl.tell(info + lang.get("key.not.number"));
                    
                    const count = parseInt(countStr);
                    if (count <= 0) return pl.tell(info + lang.get("money.must.bigger0"));

                    // 3. 余额校验
                    const myMoney = Economy.get(pl);
                    if (amount > myMoney) {
                        return pl.sendText(info + lang.get("rp.count.bigger.yourmoney") + conf.get("Economy").CoinName);
                    }

                    // 4. 执行命令
                    // 假设红包系统通过指令触发，type 0 为随机红包，1 为普通(平均)红包
                    const cmdSuffix = (type === 0) ? "" : " average";
                    pl.runcmd(`rp send ${amount} ${count}${cmdSuffix}`);
                });
                break;

            case 1: // 领取/列表
                pl.runcmd("rp list");
                break;

            case 2: // 帮助
                showRpHelp(pl);
                break;
        }
    });
}

function OPMoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    // [fix] 一次读取，后续复用
    const coinName  = economyCfg.coinName;
    const rpEnabled = conf.get("RedPacket").EnabledModule == 1;

    let fm = mc.newSimpleForm()
    fm.setTitle("(OP)"+coinName)
    fm.addButton((lang.get("money.op.add") || "增加玩家的") + coinName, "textures/ui/icon_best3")
    fm.addButton((lang.get("money.op.remove") || "减少玩家的") + coinName, "textures/ui/redX1")
    fm.addButton((lang.get("money.op.set") || "设置玩家的") + coinName, "textures/ui/gear")
    fm.addButton(lang.get("money.op.offline.btn") || "对离线玩家进行金币操作", "textures/ui/FriendsDiversity")
    fm.addButton((lang.get("money.op.look") || "查看玩家的") + coinName, "textures/ui/MCoin")
    fm.addButton("查看玩家的" + coinName + "历史记录", "textures/ui/book_addtextpage_default")
    fm.addButton("全服" + coinName + "排行榜", "textures/ui/icon_book_writable")
    if (rpEnabled){
        fm.addButton(lang.get("rp.menu.1") || "红包", "textures/ui/gift_square")
    }
    fm.addButton(lang.get("money.gui.useplayer") || "使用玩家的金钱菜单", "textures/ui/icon_multiplayer")
    
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        
        let currentId = id;
        // 如果红包未开启，且点击的是红包之后的按钮，需要手动修正索引
        if (!rpEnabled && currentId >= 7) {
            currentId += 1;
        }

        switch(currentId){
            case 0:
                MoneyAddGui(pl.realName)
                break
            case 1:
                MoneyReduceGui(pl.realName)
                break
            case 2:
                MoneySetGui(pl.realName)
                break
            case 3:
                OPOfflineMoneyGui(pl.realName)
                break
            case 4:
                MoneyGetGui(pl.realName)
                break
            case 5:
                MoneyHistoryGui(pl.realName)
                break
            case 6:
                ranking(pl.realName)
                break
            case 7:
                redpacketgui(pl.realName)
                break
            case 8:
                MoneyGui(pl.realName)
                break
        }
    })
}

// --- 1. 核心工具类 (封装底层逻辑) ---
// --- 2.7.2 add 离线货币缓存管理 ---
const OfflineMoneyCache = {
    // 读取离线缓存
    load: () => {
        if (!File.exists(offlineMoneyPath)) {
            File.writeTo(offlineMoneyPath, JSON.stringify({}));
        }
        return JSON.parse(File.readFrom(offlineMoneyPath));
    },
    
    // 保存离线缓存
    save: (data) => {
        File.writeTo(offlineMoneyPath, JSON.stringify(data, null, 2));
    },
    
    // 添加离线操作记录
    add: (playerName, type, amount) => {
        const cache = OfflineMoneyCache.load();
        if (!cache[playerName]) {
            cache[playerName] = [];
        }
        cache[playerName].push({
            type: type,
            amount: amount,
            timestamp: system.getTimeStr()
        });
        OfflineMoneyCache.save(cache);
    },
    
    // 获取玩家的离线操作
    get: (playerName) => {
        const cache = OfflineMoneyCache.load();
        return cache[playerName] || [];
    },
    
    // 清除玩家的离线操作
    clear: (playerName) => {
        const cache = OfflineMoneyCache.load();
        delete cache[playerName];
        OfflineMoneyCache.save(cache);
    },
    
    // 应用离线操作到在线玩家
    apply: (player) => {
        const operations = OfflineMoneyCache.get(player.realName);
        if (operations.length === 0) return;
        
        const coinName = economyCfg.coinName;
        let totalChange = 0;
        
        operations.forEach(op => {
            Economy.execute(player, op.type, op.amount);
            
            // 计算总变化（用于通知）
            if (op.type === 'add' || op.type === 'set') {
                totalChange += op.amount;
            } else if (op.type === 'reduce') {
                totalChange -= op.amount;
            }
        });
        
        // 清除已应用的操作
        OfflineMoneyCache.clear(player.realName);
        
        // 通知玩家
        if (totalChange !== 0) {
            const message = totalChange > 0 
                ? `${info}§a离线期间金币变动 +${totalChange} ${coinName}`
                : `${info}§c离线期间金币变动 ${totalChange} ${coinName}`;
            player.tell(message);
        }
        
    }
};

// --- 改进的 Economy 核心 ---
const Economy = {
    isScoreboard: () => !economyCfg.isLLMoney,
    getObjName: () => economyCfg.scoreboard,
    
    // 获取余额
    get: (p) => {
        return Economy.isScoreboard() 
            ? p.getScore(Economy.getObjName()) 
            : p.getMoney();
    },
    
    // 执行变更操作（自动处理在线/离线）
    execute: (playerIdentifier, type, amount) => {
        // 如果是 Player 对象（在线玩家）
        if (typeof playerIdentifier === 'object' && playerIdentifier.getScore) {
            const p = playerIdentifier;
            const isScore = Economy.isScoreboard();
            const obj = Economy.getObjName();
            
            switch (type) {
                case 'set': return isScore ? p.setScore(obj, amount) : p.setMoney(amount);
                case 'add': return isScore ? p.addScore(obj, amount) : p.addMoney(amount);
                case 'reduce': return isScore ? p.reduceScore(obj, amount) : p.reduceMoney(amount);
                default: return false;
            }
        }
        
        // 如果是字符串（玩家名） - 尝试获取在线玩家
        const playerName = typeof playerIdentifier === 'string' ? playerIdentifier : playerIdentifier.realName;
        const onlinePlayer = mc.getPlayer(playerName);
        
        if (onlinePlayer) {
            // 玩家在线，直接操作
            return Economy.execute(onlinePlayer, type, amount);
        } else {
            // 玩家离线，添加到缓存队列
            OfflineMoneyCache.add(playerName, type, amount);
            randomGradientLog(`[Economy] 玩家 ${playerName} 离线，操作已缓存: ${type} ${amount}`);
            return true; // 返回成功，因为已缓存
        }
    }
};

const EconomyManager = {
    getScoreboard: () => economyCfg.scoreboard,
    isLLMoney: () => !!economyCfg.isLLMoney,
    
    checkAndReduce: function(playerName, amount) {
        const player = mc.getPlayer(playerName);
        if (!player) return false;
        
        if (this.isLLMoney()) {
            const balance = player.getMoney();
            if (balance === null || balance === undefined) {
                player.setMoney(0);
                return false;
            }
            if (balance < amount) return false;
            return player.reduceMoney(amount);
        } else {
            const sb = this.getScoreboard();
            const score = player.getScore(sb);
            if (score < amount) return false;
            return player.reduceScore(sb, amount);
        }
    }
};


// ══════════════════════════════════════════════════════════════
// EconomyNotify - 经济操作通知系统
// 作用：对在线玩家直接推送余额变动消息；对离线玩家存入队列，
//       下次上线时在 onJoin 统一投递。
// ══════════════════════════════════════════════════════════════
const EconomyNotify = {

    // ── 磁盘读写 ─────────────────────────────────────────────
    _load: () => {
        if (!File.exists(offlineNotifyPath)) File.writeTo(offlineNotifyPath, "{}");
        try { return JSON.parse(File.readFrom(offlineNotifyPath)) || {}; }
        catch(e) { return {}; }
    },
    _save: (data) => { File.writeTo(offlineNotifyPath, JSON.stringify(data, null, 2)); },

    // ── 将消息存入离线队列 ────────────────────────────────────
    addOffline: (playerName, msg) => {
        const db = EconomyNotify._load();
        if (!db[playerName]) db[playerName] = [];
        db[playerName].push(msg);
        EconomyNotify._save(db);
    },

    // ── 投递消息（在线则直发，离线则入队）───────────────────
    send: (playerOrName, msg) => {
        if (typeof playerOrName === "string") {
            const online = mc.getPlayer(playerOrName);
            if (online) { online.sendText(msg); }
            else        { EconomyNotify.addOffline(playerOrName, msg); }
        } else {
            // 直接是 Player 对象
            playerOrName.sendText(msg);
        }
    },

    // ── 玩家上线时统一投递积压通知 ───────────────────────────
    apply: (player) => {
        const db   = EconomyNotify._load();
        const msgs = db[player.realName];
        if (!msgs || msgs.length === 0) return;

        setTimeout(() => {
            msgs.forEach(msg => player.sendText(msg));
            delete db[player.realName];
            EconomyNotify._save(db);
        }, 1500);   // 稍作延迟，避免和其他上线消息重叠
    },

    // ── 格式化帮助函数（生成统一风格的余额变动提示）────────
    // type: 'add' | 'reduce' | 'set'
    fmt: {
        // 转账 - 发送方
        transferSend: (targetName, amount, tax, received, coinName, note) => {
            return `${info}§e转账成功 §7-> §f${targetName} §7| 转出 §c${amount} §7税 §e${tax} §7到账 §a${received} ${coinName}` +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 转账 - 收款方（在线）
        transferReceive: (senderName, received, tax, coinName, note) => {
            return `${info}§a收到转账 §7来自 §f${senderName} §7| 到账 §a${received} ${coinName}` +
                   (tax > 0 ? ` §7(发方缴税 §e${tax}§7)` : "") +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 离线转账 - 收款方（上线时投递）
        transferReceiveOffline: (senderName, received, tax, coinName, note) => {
            return `${info}§a离线转账到账 §7来自 §f${senderName} §7| 到账 §a${received} ${coinName}` +
                   (tax > 0 ? ` §7(发方缴税 §e${tax}§7)` : "") +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // OP操作通知
        adminOp: (opType, amount, coinName, adminName, note) => {
            const colorMap = { add: "§a", reduce: "§c", set: "§e" };
            const wordMap  = { add: "+", reduce: "-", set: "=" };
            const c = colorMap[opType] || "§f";
            const s = wordMap[opType]  || "";
            return `${info}§7余额变动 ${c}${s}${amount} ${coinName} §7| 管理员 §f${adminName}` +
                   (note ? ` §7| 备注：§f${note}` : "");
        },
        // 系统自动操作
        system: (opType, amount, coinName, reason) => {
            const colorMap = { add: "§a", reduce: "§c" };
            const wordMap  = { add: "+", reduce: "-" };
            const c = colorMap[opType] || "§f";
            const s = wordMap[opType]  || "";
            return `${info}§7系统余额变动 ${c}${s}${amount} ${coinName} §7| ${reason}`;
        }
    }
};
globalThis.EconomyNotify = EconomyNotify;

// --- 玩家加入事件监听（v2.10.5：三处分散注册合并为一处）---
if (__YEST_FIRST_LOAD__) {
mc.listen("onJoin", (pl) => {
    try {
        // ── 1. 排行榜货币缓存 ──
        updateSinglePlayerCache(pl);

        // ── 2. 初始化玩家数据 ──
        homedata.init(pl.realName, {});
        rtpdata.init(pl.realName, {});
        MoneyHistory.init(pl.realName, {});

        // 初始化金币
        if (economyCfg.isLLMoney) {
            const currentMoney = pl.getMoney();
            if (currentMoney === null || currentMoney === undefined) pl.setMoney(0);
        } else {
            const score = pl.getScore(economyCfg.scoreboard);
            if (!score) pl.setScore(economyCfg.scoreboard, 0);
        }

        if (!pl.isOP()) {
            const xuid = pl.realName;
            if (pvpConfig.get(xuid) === undefined) pvpConfig.set(xuid, false);
            const plname = pl.realName;
            pl.setGameMode(0);
            setTimeout(() => { mc.runcmdEx(`tp ${plname} ${plname + "_sp"}`); }, 1000);
        }

        // ── 3. 离线货币 & 经济通知投递 ──
        OfflineMoneyCache.apply(pl);
        EconomyNotify.apply(pl);

    } catch (error) {
        logger.error(`玩家 ${pl.realName} 加入事件处理失败: ${error.message}`);
    }
});
}
const Logger = {
    // 记录历史
    // targetName: 谁的钱变了
    // message: 变动记录内容
    add: (targetName, message) => {
        let history = MoneyHistory.get(targetName) || {};
        // 使用时间戳+随机字符防止Key冲突
        let key = `${system.getTimeStr()}§${getRandomLetter()}`;
        history[key] = message;
        MoneyHistory.set(targetName, history);
    }
};

// ── 将 const 对象追加到 globalThis（必须在定义之后，不能提前引用）──
// 这样 Fcam / PVP 等模块在初始化时若需要这些接口，也能访问到
globalThis.Economy          = Economy;
globalThis.EconomyManager   = EconomyManager;
globalThis.OfflineMoneyCache = OfflineMoneyCache;
globalThis.Logger           = Logger;

// --- 2. UI 辅助工具 (消除重复的选人代码) ---

/**
 * 快速构建一个"选择在线玩家"的表单
 * @param {Player} pl 操作者
 * @param {string} title 表单标题
 * @param {Function} callback 回调函数 (targetPlayer) => {}
 */
function openPlayerSelectionGui(pl, title, callback) {
    const onlinePlayers = mc.getOnlinePlayers();
    const playerNames = onlinePlayers.map(p => p.realName);
    
    const fm = mc.newCustomForm();
    fm.setTitle(title);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerNames);
    
    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");
        
        const target = mc.getPlayer(playerNames[data[0]]);
        if (!target) {
            return player.tell(info + lang.get("money.tr.noonline"));
        }
        
        // 找到玩家后，执行回调逻辑
        callback(target);
    });
}
/**
 * 统一金币历史记录查询 GUI (清爽版)
 * @param {Player} viewer 发起查看请求的玩家
 * @param {string} targetName 被查询的目标玩家名
 */
function showUnifiedHistory(viewer, targetName) {
    if (!viewer) return;
    
    const coinName = economyCfg.coinName;
    const historyData = MoneyHistory.get(targetName) || {};
    const entries = Object.entries(historyData);
    const isOP = viewer.isOP();

    // 1. 获取最近的 50 条记录
    const recentEntries = entries.slice(-50).reverse();

    // 2. 动态获取“显示年份”
    // 如果有记录，从第一条（即最新的）记录的 key 中截取年份 (前 4 位)
    // 如果没记录，则使用当前系统年份
    let displayYear = new Date().getFullYear();
    if (recentEntries.length > 0) {
        // rawTime 格式通常为 "2024-05-20 12:00:00-0"
        displayYear = recentEntries[0][0].substring(0, 4); 
    }

    // 3. 格式化列表内容
    const listContent = recentEntries
        .map(([rawTime, val]) => {
            // 截取 月-日 时:分 (从索引 5 开始：05-20 12:00)
            const displayTime = rawTime.substring(5, 16); 
            return `§7[${displayTime}]§r ${val}`;
        })
        .join('\n') || "§c暂无历史记录";

    const fm = mc.newSimpleForm();
    fm.setTitle(`§l${targetName}§r 的 ${coinName} 历史`);
    
    // 4. 构造正文，使用提取出的真实年份 displayYear
    let mainContent = lang.get("money.history")+`\n${"=".repeat(14)}${displayYear}${"=".repeat(14)}`;
    mainContent += `\n${listContent}`;
    fm.setContent(mainContent);
    
    // ... 后续按钮逻辑不变
    fm.addButton(lang.get("money.callback.lastgui"), "textures/ui/back_button_default");
    fm.addButton(lang.get("rp.list.close"), "textures/ui/close_X_button");
    viewer.sendForm(fm, (p, id) => {
        if (id === 0) {
            if (isOP && p.realName !== targetName) {
                // p.runcmd("moneyadmin");
            } else {
                p.runcmd("moneygui");
            }
        }
    });
}

/**
 * 通用的管理员金币操作逻辑 (设置/增加/减少)
 */
function handleAdminOp(pl, target, opType, actionText, inputLabel) {
    const fm = mc.newCustomForm();
    fm.setTitle(`${actionText} ${target.realName} 的 ${conf.get("Economy").CoinName}`);
    fm.addInput(inputLabel, lang.get("key.not.number"), "0", lang.get("key.not.number.tip") || "");
    
    pl.sendForm(fm, (admin, data) => {
        if (data == null) return;
        
        const inputVal = data[0];
        if (!inputVal || inputVal.trim() === "") {
            return admin.tell(info + lang.get("money.setting.number")); // 使用原本的提示key
        }
        
        const amount = parseInt(inputVal, 10);
        if (isNaN(amount) || amount <= 0) return admin.tell(info + lang.get("key.not.number"));

        const coinName = economyCfg.coinName;
        
        // 执行经济操作
        Economy.execute(target, opType, amount);
        
        // 记录日志 (修复了原代码存错人的Bug)
        const logMsg = `${coinName}${actionText}${amount} (操作员: ${admin.realName})`;
        Logger.add(target.realName, logMsg);
        
        // ── 通知目标玩家（在线直发，离线入队）───────────────
        EconomyNotify.send(
            target,
            EconomyNotify.fmt.adminOp(opType, amount, coinName, admin.realName)
        );

        // 发送反馈给操作员
        admin.sendText(`${info}${lang.get("success")}${lang.get("to")}${lang.get("player")}${target.realName}的${conf.get("Economy").CoinName}${actionText}${amount}`);
        admin.sendText(`${info}玩家当前金币为：${Economy.get(target)}`);
    });
}

// --- 3. 功能入口函数 ---

// [查看历史]
function MoneyHistoryGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, `查看玩家${conf.get("Economy").CoinName}历史`, (target) => {
        pl.sendText(info + `玩家 ${target.realName} 的 ${conf.get("Economy").CoinName} 历史记录`);
        // 统一调用
        showUnifiedHistory(pl, target.realName);
    });
}

/**
 * 玩家转账 GUI
 * 优化点：封装经济接口、增强金额验证、加入备注支持、修复税率逻辑
 */
function MoneyTransferGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const playerNames = mc.getOnlinePlayers().map(p => p.realName);
    const myBalance = Economy.get(pl);
    const taxRate = conf.get("Economy").PayTaxRate;
    const coinName = economyCfg.coinName;
    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.transfer.title") + coinName);
    fm.addLabel(lang.get("money.transfer.balance")
        .replace("${balance}", myBalance)
        .replace("${coin}", coinName) + "\n" + 
        lang.get("money.transfer.tax").replace("${rate}", taxRate));
    fm.addDropdown(lang.get("choose") + lang.get("one") + lang.get("player"), playerNames);
    fm.addInput(lang.get("money.tr.amount"), lang.get("money.transfer.input.amount"), "0", lang.get("money.tr.amount.tip") || "");
    fm.addInput(lang.get("money.tr.beizhu"), lang.get("money.tr.beizhu"), "无", lang.get("money.tr.beizhu.tip") || "");

    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");

        const [, targetIdx, inputAmount, note] = data;
        const target = mc.getPlayer(playerNames[targetIdx]);

        if (!target?.isSimulatedPlayer?.() === false || player.realName === target.realName) {
            return player.tell(info + (player.realName === target.realName 
                ? lang.get("money.tr.error2") 
                : lang.get("money.tr.error1")));
        }

        const amountStr = inputAmount.trim().toLowerCase();
        const finalAmount = amountStr === "all" 
            ? Economy.get(player) 
            : /^\d+$/.test(amountStr) ? parseInt(amountStr) : -1;

        if (finalAmount <= 0) {
            return player.tell(info + (finalAmount === -1 
                ? lang.get("key.not.number") 
                : lang.get("money.must.bigger0")));
        }

        const tax = Math.floor(finalAmount * (taxRate / 100));
        const actualReceived = finalAmount - tax;

        if (actualReceived <= 0 || Economy.get(player) < finalAmount) {
            return player.tell(info + (actualReceived <= 0 
                ? lang.get("money.transfer.tax.notenough") 
                : lang.get("money.no.enough")));
        }

        Economy.execute(player, 'reduce', finalAmount);
        Economy.execute(target, 'add', actualReceived);

        const timeStr = system.getTimeStr();
        const noteMsg = note ? ` ${lang.get("money.tr.beizhu")}: ${note}` : "";
        const coinName = economyCfg.coinName;
        
        Logger.add(player.realName, 
            `${timeStr} ${lang.get("money.transfer.log.send")
                .replace("${target}", target.realName)
                .replace("${amount}", finalAmount)
                .replace("${received}", actualReceived)
                .replace("${tax}", tax)}${noteMsg}`
        );
        Logger.add(target.realName, 
            `${timeStr} ${lang.get("money.transfer.log.receive")
                .replace("${sender}", player.realName)
                .replace("${amount}", finalAmount)
                .replace("${received}", actualReceived)
                .replace("${tax}", tax)}${noteMsg}`
        );

        // ── 通知双方 ─────────────────────────────────────────
        player.sendText(EconomyNotify.fmt.transferSend(
            target.realName, finalAmount, tax, actualReceived, coinName, note
        ));
        target.sendText(EconomyNotify.fmt.transferReceive(
            player.realName, actualReceived, tax, coinName, note
        ));
    });
}
// ══════════════════════════════════════════════════════════════
// MoneyTransferOfflineGui - 玩家版：转账给离线玩家
// ══════════════════════════════════════════════════════════════
function MoneyTransferOfflineGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const coinName  = conf.get("Economy").CoinName;
    const taxRate = conf.get("Economy").PayTaxRate;
    const myBalance = Economy.get(pl);

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.offline.transfer.title"));
    fm.addLabel(
        lang.get("money.offline.transfer.label")
            .replace("${balance}", myBalance)
            .replace("${coin}", coinName)
            .replace("${rate}", taxRate)
    );
    fm.addInput(lang.get("money.offline.transfer.input.target"), lang.get("money.offline.transfer.input.target.hint"), "Steve", lang.get("money.offline.transfer.input.target.tip") || "");
    fm.addInput(lang.get("money.offline.transfer.input.amount"), lang.get("money.offline.transfer.input.amount.hint"), "0", lang.get("money.offline.transfer.input.amount.tip") || "");
    fm.addInput(lang.get("money.offline.transfer.input.note"),   lang.get("money.offline.transfer.input.note.hint"), "无", lang.get("money.offline.transfer.input.note.tip") || "");

    pl.sendForm(fm, (player, data) => {
        if (data == null) return player.runcmd("moneygui");

        const [, rawTarget, rawAmount, note] = data;
        const targetName = (rawTarget || "").trim();

        if (!targetName) return player.tell(info + lang.get("money.offline.transfer.no.target"));
        if (targetName === player.realName) return player.tell(info + lang.get("money.offline.transfer.self"));

        if (mc.getPlayer(targetName)) {
            return player.tell(info + lang.get("money.offline.transfer.target.online"));
        }

        const amountStr = (rawAmount || "").trim().toLowerCase();
        const myBal     = Economy.get(player);
        let   finalAmount;
        if (amountStr === "all") {
            finalAmount = myBal;
        } else if (/^\d+$/.test(amountStr)) {
            finalAmount = parseInt(amountStr, 10);
        } else {
            return player.tell(info + lang.get("key.not.number"));
        }

        if (finalAmount <= 0) return player.tell(info + lang.get("money.must.bigger0"));

        const tax            = Math.floor(finalAmount * (taxRate / 100));
        const actualReceived = finalAmount - tax;

        if (actualReceived <= 0) return player.tell(info + lang.get("money.transfer.tax.notenough"));
        if (myBal < finalAmount)  return player.tell(info + lang.get("money.no.enough"));

        // ── 确认表单 ──────────────────────────────────────────
        const confirmFm = mc.newSimpleForm();
        confirmFm.setTitle(lang.get("money.offline.transfer.confirm.title"));
        confirmFm.setContent(
            lang.get("money.offline.transfer.confirm.content")
                .replace("${target}",   targetName)
                .replace("${amount}",   finalAmount)
                .replace("${coin}",     coinName)
                .replace("${tax}",      tax)
                .replace("${rate}",     taxRate)
                .replace("${received}", actualReceived) +
            (note ? "\n" + lang.get("notify.transfer.note").replace("${note}", note) : "") +
            "\n\n" + lang.get("money.offline.transfer.confirm.warn")
        );
        confirmFm.addButton(lang.get("money.offline.transfer.btn.confirm"), "textures/ui/realms_green_check");
        confirmFm.addButton(lang.get("money.offline.transfer.btn.cancel"),  "textures/ui/cancel");

        player.sendForm(confirmFm, (pl2, btnId) => {
            if (btnId == null || btnId === 1) return pl2.tell(info + lang.get("money.offline.transfer.cancelled"));

            if (Economy.get(pl2) < finalAmount) return pl2.tell(info + lang.get("money.no.enough"));

            Economy.execute(pl2, 'reduce', finalAmount);
            OfflineMoneyCache.add(targetName, 'add', actualReceived);

            const timeStr = system.getTimeStr();
            const noteMsg = note ? lang.get("money.offline.transfer.note.suffix").replace("${note}", note) : "";
            Logger.add(pl2.realName,
                timeStr + " " + lang.get("money.offline.transfer.log")
                    .replace("${target}",   targetName)
                    .replace("${amount}",   finalAmount)
                    .replace("${tax}",      tax)
                    .replace("${received}", actualReceived) + noteMsg
            );

            pl2.sendText(
                EconomyNotify.fmt.transferSend(targetName, finalAmount, tax, actualReceived, coinName, note) +
                "\n§7§o" + lang.get("money.offline.transfer.sender.offline.tip") || ""
            );
            EconomyNotify.send(
                targetName,
                EconomyNotify.fmt.transferReceiveOffline(pl2.realName, actualReceived, tax, coinName, note)
            );
        });
    });
}

// ══════════════════════════════════════════════════════════════
// OPOfflineMoneyGui - OP版：对离线玩家执行金币增/减/设置
// ══════════════════════════════════════════════════════════════
function OPOfflineMoneyGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const coinName = economyCfg.coinName;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.op.offline.title"));
    fm.addLabel(lang.get("money.op.offline.label"));
    fm.addInput(lang.get("money.op.offline.input.target"), lang.get("money.op.offline.input.target.hint"), "Steve", lang.get("money.op.offline.input.target.tip") || "");
    fm.addDropdown(lang.get("money.op.offline.dropdown"), [
        lang.get("money.op.offline.type.add"),
        lang.get("money.op.offline.type.reduce"),
        lang.get("money.op.offline.type.set")
    ]);
    fm.addInput(lang.get("money.op.offline.input.amount"), lang.get("money.op.offline.input.amount.hint"), "0", lang.get("money.op.offline.input.amount.tip") || "");
    fm.addInput(lang.get("money.op.offline.input.note"), lang.get("money.offline.transfer.input.note.hint"), "无", lang.get("money.op.offline.input.note.tip") || "");

    pl.sendForm(fm, (admin, data) => {
        if (data == null) return admin.runcmd("moneygui");

        const [, rawTarget, opIdx, rawAmount, note] = data;
        const targetName = (rawTarget || "").trim();

        if (!targetName) return admin.tell(info + lang.get("money.offline.transfer.no.target"));

        const opTypeMap = ['add', 'reduce', 'set'];
        const opWordMap = [
            lang.get("money.op.offline.type.add"),
            lang.get("money.op.offline.type.reduce"),
            lang.get("money.op.offline.type.set")
        ];
        const opType = opTypeMap[opIdx];
        const opWord = opWordMap[opIdx];

        const amountStr = (rawAmount || "").trim();
        if (!/^\d+$/.test(amountStr)) return admin.tell(info + lang.get("key.not.number"));
        const amount = parseInt(amountStr, 10);
        if (opType !== "set" && amount <= 0) return admin.tell(info + lang.get("money.must.bigger0"));
        if (opType === "set" && amount < 0) return admin.tell(info + lang.get("money.must.bigger0"));

        if (mc.getPlayer(targetName)) {
            return admin.tell(info + lang.get("money.op.offline.target.online"));
        }

        // ── 确认表单 ──────────────────────────────────────────
        const confirmFm = mc.newSimpleForm();
        confirmFm.setTitle(lang.get("money.op.offline.confirm.title"));
        confirmFm.setContent(
            lang.get("money.op.offline.confirm.content")
                .replace("${target}", targetName)
                .replace("${opWord}", opWord)
                .replace("${amount}", amount)
                .replace("${coin}",   coinName) +
            (note ? "\n" + lang.get("notify.transfer.note").replace("${note}", note) : "") +
            "\n\n" + lang.get("money.op.offline.confirm.tip") || ""
        );
        confirmFm.addButton(lang.get("money.offline.transfer.btn.confirm"), "textures/ui/realms_green_check");
        confirmFm.addButton(lang.get("money.offline.transfer.btn.cancel"),  "textures/ui/cancel");

        admin.sendForm(confirmFm, (adm, btnId) => {
            if (btnId == null || btnId === 1) return adm.tell(info + lang.get("money.op.offline.cancelled"));

            OfflineMoneyCache.add(targetName, opType, amount);

            const timeStr = system.getTimeStr();
            const noteMsg = note ? lang.get("money.offline.transfer.note.suffix").replace("${note}", note) : "";
            Logger.add(targetName,
                timeStr + " " + lang.get("money.op.offline.log")
                    .replace("${opWord}", opWord)
                    .replace("${amount}", amount)
                    .replace("${coin}",   coinName)
                    .replace("${admin}",  adm.realName) + noteMsg
            );

            EconomyNotify.send(
                targetName,
                EconomyNotify.fmt.adminOp(opType, amount, coinName, adm.realName, note)
            );

            adm.sendText(
                info + lang.get("money.op.offline.success")
                    .replace("${target}", targetName)
                    .replace("${opWord}", opWord)
                    .replace("${amount}", amount)
                    .replace("${coin}",   coinName)
            );
        });
    });
}

// [查询余额]
function MoneyGetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.look") + conf.get("Economy").CoinName, (target) => {
        displayMoneyInfo(pl, target, false); 
    });
}

// [设置余额]
function MoneySetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.set") + conf.get("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'set', 
            "设置", 
            lang.get("money.set.number") + conf.get("Economy").CoinName
        );
    });
}

// [减少余额]
function MoneyReduceGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    // 修复了原代码第一行 const amount = Number(data[1]) 导致的崩溃
    openPlayerSelectionGui(pl, lang.get("money.op.remove") + conf.get("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'reduce', 
            "减少", 
            lang.get("money.decrease.number") + conf.get("Economy").CoinName
        );
    });
}

// [增加余额]
function MoneyAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.add") + conf.get("Economy").CoinName, (target) => {
        handleAdminOp(
            pl, target, 'add', 
            "增加", 
            lang.get("money.add.number") + conf.get("Economy").CoinName
        );
    });
}

const warpgui = mc.newCommand("warp", "公共传送点", PermType.Any);
warpgui.overload([]);
warpgui.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(lang.get("warp.only.player"));
    
    pl.isOP() ? OPWarpGui(pl.realName) : WarpGui(pl.realName);
});
warpgui.setup();

function OPWarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    
    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public.op"));
    fm.addButton(lang.get("warp.add"));
    fm.addButton(lang.get("warp.del"));
    fm.addButton(lang.get("warp.list"));
    
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + lang.get("gui.exit"));
        
        const actions = [
            () => WarpAddGui(pl.realName),
            () => WarpDelGui(pl.realName),
            () => WarpGui(pl.realName)
        ];
        actions[id]?.();
    });
}

function WarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    
    const warpList = Object.keys(JSON.parse(warpdata.read()));
    
    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public"));
    warpList.forEach(name => fm.addButton(name));
    
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + lang.get("gui.exit"));
        
        const warpName = warpList[id];
        const warpInfo = warpdata.get(warpName);
        // [fix] 一次读取，回调内复用
        const cost     = conf.get("Warp");
        const coinName = economyCfg.coinName;
        
        const confirmFm = mc.newCustomForm();
        confirmFm.setTitle(lang.get("warp.go.to"));
        confirmFm.addLabel(lang.get("warp.teleport.name") + warpName);
        confirmFm.addLabel(lang.get("warp.teleport.coord") + `${warpInfo.x},${warpInfo.y},${warpInfo.z} ${transdimid[warpInfo.dimid]}`);
        confirmFm.addLabel(lang.get("warp.teleport.cost") + cost);
        confirmFm.addLabel("您的" + coinName + "为：" + String(Economy.get(pl)));
        
        pl.sendForm(confirmFm, (pl, data) => {
            if (data == null) return pl.tell(info + lang.get("gui.exit"));
            
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "warp");
            setTimeout(() => {
            pl.teleport(
                parseFloat(warpInfo.x),
                parseFloat(warpInfo.y),
                parseFloat(warpInfo.z),
                parseInt(warpInfo.dimid)
            );
            pl.sendText(info +lang.get("warp.teleported").replace("${name}", warpName));
            },200)
            mc.runcmdEx(`camera ${pl.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        });
    });
}

function WarpDelGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    
    const warpList = Object.keys(JSON.parse(warpdata.read()));
    
    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.del.point"));
    warpList.forEach(name => fm.addButton(name));
    
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("warp");
        
        const warpName = warpList[id];
        warpdata.delete(warpName);
        pl.sendText(info +lang.get("warp.del.success").replace("${name}", warpName));
    });
}

function WarpAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    
    const pos = pl.pos;
    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("warp.add.point"));
    fm.addLabel(lang.get("warp.add.point.xyz"));
    fm.addLabel(lang.get("warp.teleport.coord") + `${pos.x.toFixed(1)},${pos.y.toFixed(1)},${pos.z.toFixed(1)} ${transdimid[pos.dimid]}`);
    fm.addInput(lang.get("warp.input.name"), lang.get("warp.name"), "myWarp", lang.get("warp.input.name.tip") || "");
    
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("warp");
        
        const warpName = data[2];
        if (!warpName) return pl.tell(info + lang.get("warp.noinput.name"));
        if (warpdata.get(warpName)) return pl.tell(info + lang.get("warp.name.repetitive"));
        
        warpdata.set(warpName, {
            x: pos.x.toFixed(1),
            y: pos.y.toFixed(1),
            z: pos.z.toFixed(1),
            dimid: pos.dimid
        });
        pl.sendText(info +lang.get("warp.add.success").replace("${name}", warpName));
    });
}


if (__YEST_FIRST_LOAD__) {
mc.listen("onRespawn",(pl)=>{
    if(conf.get("BackTipAfterDeath")) {
         setTimeout(() => {
            BackGUI(pl.realName)
            }, 100);
    }
})
}
// 存储玩家死亡点数据
let deathPoints = {};

// 监听玩家死亡事件记录死亡点
if (__YEST_FIRST_LOAD__) {
mc.listen("onPlayerDie", function(pl, src) {
    let playerName = pl.realName;
    
    // 初始化玩家死亡点数组
    if (!deathPoints[playerName]) {
        deathPoints[playerName] = [];
    }
    
    // 修复：使用玩家当前位置作为死亡位置，而不是lastDeathPos
    let deathPos = pl.pos;
    if (!deathPos) return;
    
    // 创建死亡点记录
    let deathRecord = {
        pos: {
            x: deathPos.x,
            y: deathPos.y,
            z: deathPos.z,
            dimid: deathPos.dimid
        },
        time: new Date().toLocaleString(),
        dimension: transdimid[deathPos.dimid] || "未知维度"
    };
    
    // 添加到数组开头（最新的在前面）
    deathPoints[playerName].unshift(deathRecord);
    
    // 只保留最近3个死亡点
    if (deathPoints[playerName].length > 3) {
        deathPoints[playerName] = deathPoints[playerName].slice(0, 3);
    }
    
    pl.tell(info + lang.get("back.helpinfo"));
});
}

let backcmd = mc.newCommand("back", "返回死亡点", PermType.Any)
backcmd.overload([])
backcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player
    if (!pl) return out.error(lang.get("warp.only.player"))
    BackGUI(pl.realName)
})
backcmd.setup()

function BackGUI(plname) {
    let pl = mc.getPlayer(plname)
    if (!pl) return
    
    let playerDeathPoints = deathPoints[pl.realName];
    if (!playerDeathPoints || playerDeathPoints.length === 0) {
        return pl.tell(info + lang.get("back.list.Empty"));
    }
    
    // [fix] 一次读取 cost 和 coinName，避免回调内重复读配置
    let cost     = conf.get("Back");
    let coinName = economyCfg.coinName;
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("back.to.point"))
    fm.addLabel(lang.get("back.choose"))
    
    // 显示所有死亡点信息
    playerDeathPoints.forEach((point, index) => {
        let pointInfo = `§e死亡点 ${index + 1}：\n`;
        pointInfo += `§7坐标：${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)}\n`;
        pointInfo += `§7维度：${point.dimension}\n`;
        pointInfo += `§7时间：${point.time}`;
        fm.addLabel(pointInfo);
    });
    
    // 添加下拉选择框
    let options = playerDeathPoints.map((point, index) => 
        `死亡点${index + 1} - ${point.dimension} (${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)})`
    );
    fm.addDropdown("选择要传送的死亡点", options, 0);
    
    fm.addLabel(displayMoneyInfo(pl, pl, true))
    fm.addLabel("传送需要花费" + cost + coinName)
    
    pl.sendForm(fm, (pl, data) => {
        // 修复：检查数据是否有效
        if (data === null || data === undefined) {
            return pl.tell(info + lang.get("gui.exit"));
        }
        
        // 重新获取死亡点数据，确保数据最新
        let currentDeathPoints = deathPoints[pl.realName];
        if (!currentDeathPoints || currentDeathPoints.length === 0) {
            return pl.tell(info + "§c死亡点数据已失效！");
        }
        
        // 计算下拉框在表单数据中的索引位置
        let dropdownIndex = 1 + currentDeathPoints.length;
        let selectedIndex = data[dropdownIndex];
        
        // 修复：检查selectedIndex是否有效
        if (selectedIndex === undefined || selectedIndex === null) {
            return pl.tell(info + lang.get("gui.exit"));
        }
        
        // 修复：确保索引在有效范围内
        if (selectedIndex < 0 || selectedIndex >= currentDeathPoints.length) {
            return pl.tell(info + lang.get("back.choose.null"));
        }
        
        let selectedPoint = currentDeathPoints[selectedIndex];
        
        // 修复：检查选择的死亡点数据是否完整
        if (!selectedPoint || !selectedPoint.pos) {
            return pl.tell(info + lang.get("back.deathlog.error"));
        }
        
        // 检查金钱
        if (!economyCfg.isLLMoney) {
            if (!smartMoneyCheck(pl.realName, conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
        } else {
            if (!smartMoneyCheck(pl.realName, conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
        }
        
        // 传送到选择的死亡点
        try {
            // 修复：直接使用坐标数字传参，而不是对象
            pl.teleport(
                selectedPoint.pos.x, 
                selectedPoint.pos.y, 
                selectedPoint.pos.z, 
                selectedPoint.pos.dimid
            );
            
            mc.runcmdEx("effect " + pl.realName + " resistance 15 255 true")
            
            
            pl.tell(info + `§a已传送至死亡点${selectedIndex + 1}！`);
        } catch (e) {
            pl.tell(info + lang.get("back.fail"));
            logger.error("Back System Error: " + e);
        }
    })
}



// 添加一个命令来查看死亡点列表（调试用）
let deathlistcmd = mc.newCommand("deathlog", "查看死亡历史记录", PermType.Any)
deathlistcmd.overload([])
deathlistcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player
    if (!pl) return out.error(lang.get("warp.only.player"))
    
    let playerDeathPoints = deathPoints[pl.realName];
    if (!playerDeathPoints || playerDeathPoints.length === 0) {
        return pl.tell(info + lang.get("back.list.Empty"));
    }
    
    pl.tell("§6=== 您的死亡点列表 ===");
    playerDeathPoints.forEach((point, index) => {
        pl.tell(`§e死亡点 ${index + 1}：`);
        pl.tell(`§7坐标：${point.pos.x}, ${point.pos.y}, ${point.pos.z}`);
        pl.tell(`§7维度：${point.dimension}`);
        pl.tell(`§7时间：${point.time}`);
        pl.tell("§7-------------------");
    });
})
deathlistcmd.setup()

// 添加清理死亡点数据的函数
function clearDeathPoints(playerName) {
    if (deathPoints[playerName]) {
        delete deathPoints[playerName];
    }
}

// 获取玩家死亡点列表的函数
function getPlayerDeathPoints(playerName) {
    return deathPoints[playerName] || [];
}
let homegui = mc.newCommand("home","家园系统",PermType.Any)
homegui.overload([])
homegui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player

    if(!pl) return out.error(lang.get("warp.only.player"))        
    
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("home.tp.system"))
    fm.addButton(lang.get("home.tp"))
    fm.addButton(lang.get("home.add"))
    fm.addButton(lang.get("home.del"))
    

    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        
        switch(id){
            case 0:
                TpHome(pl.realName)
                break
            case 1:
                AddHome(pl.realName)
                break
            case 2:
                DelHome(pl.realName)
                break
    
        }
    })
})
homegui.setup()

function TpHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    // [fix] 一次读取 Home 和 coinName，避免回调内重复读配置
    const homeConf = conf.get("Home");
    const cost     = homeConf.tp;
    const coinName = economyCfg.coinName;
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("home.tp"))
    fm.setContent(lang.get("home.tp.choose"))
    let lst = []
    let pldata = homedata.get(pl.realName)
    for(let i in pldata){
        lst.push(i)
        fm.addButton(i+"\n坐标："+pldata[i].x+","+pldata[i].y+","+pldata[i].z+" "+transdimid[pldata[i].dimid])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        let fm = mc.newCustomForm()
        fm.setTitle(lang.get("home.tp"))
        fm.addLabel("确认传送家 "+lst[id]+"？")
        fm.addLabel("您的" + coinName + "：" + String(Economy.get(pl)))
        fm.addLabel("传送家需要花费"+cost+coinName)
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.runcmd("home")
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            setTimeout(() => {
            pl.teleport(parseFloat(pldata[lst[id]].x),parseFloat(pldata[lst[id]].y),parseFloat(pldata[lst[id]].z),parseInt(pldata[lst[id]].dimid))
            pl.sendText(info+"传送家 "+lst[id]+" 成功！")
            },200)
            mc.runcmdEx(`camera ${pl.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        })
    })
}

function DelHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    // [fix] 一次读取
    const homeConf = conf.get("Home");
    const cost     = homeConf.del;
    const coinName = economyCfg.coinName;
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("home.del"))
    fm.setContent(lang.get("home.del.choose"))
    let lst = []
    let pldata = homedata.get(pl.realName)
    for(let i in pldata){
        lst.push(i)
        fm.addButton(i+"\n坐标："+pldata[i].x+","+pldata[i].y+","+pldata[i].z+" "+transdimid[pldata[i].dimid])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.runcmd("home")
        let fm = mc.newCustomForm()
        fm.setTitle(lang.get("home.del"))
        fm.addLabel("§c§l请问您确认要删除家 "+lst[id]+"？此操作不可撤销！！！")
        fm.addLabel("您的" + coinName + "：" + String(Economy.get(pl)))
        fm.addLabel("删除家需要花费"+cost+coinName)
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.tell(info + lang.get("gui.exit"));
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            delete pldata[lst[id]]
            homedata.set(pl.realName,pldata)
            pl.sendText(info+"删除家 "+lst[id]+" 成功！")
            
    })
    })
}

function AddHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    // [fix] 一次读取
    const homeConf = conf.get("Home");
    const cost      = homeConf.add;
    const HomeCount = homeConf.MaxHome;
    const coinName  = economyCfg.coinName;

    let pldata = homedata.get(pl.realName)
    if(Object.keys(pldata).length >= HomeCount) return pl.sendText(info+"您的家数量已达到上限值:"+HomeCount+"!")
        let fm = mc.newCustomForm()
        fm.setTitle(lang.get("home.add"))
        fm.addLabel("当前坐标："+String(pl.pos))
        fm.addLabel("您的" + coinName + "：" + String(Economy.get(pl)))
        fm.addLabel("添加花费："+String(cost)+coinName)
        fm.addInput((lang.get("home.add.input")), "home1", "home1", lang.get("home.add.input.tip") || "")
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.runcmd("home")
            if(data[3] == "" || !data[3]) return pl.tell(info + lang.get("home.name.noinput"));
            let pldata = homedata.get(pl.realName)
            if(Object.keys(pldata).includes(data[3])) return pl.tell(info + lang.get("home.name.repetitive"));
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            pldata[data[3]] = {
                "x":JSON.parse(pl.pos.x).toFixed(1),
                "y":JSON.parse(pl.pos.y).toFixed(1),
                "z":JSON.parse(pl.pos.z).toFixed(1),
                "dimid":JSON.parse(pl.pos.dimid)
            }
            homedata.set(pl.realName,pldata)
            pl.sendText(info+"添加家："+data[3]+" 成功！")

        })

    }


// ======================
// //拒绝指令
// ======================
mc.regPlayerCmd("tpa","传送系统", (player, args) => {
    showTpaMainMenu(player);
});
const pendingTpaRequests = {};

// TPA 主菜单
function showTpaMainMenu(player) {
    if (!conf.get("tpa").EnabledModule) {
        player.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    const fm = mc.newSimpleForm();
    fm.setTitle("TPA 主菜单");
    fm.setContent("请选择您要进行的操作：");
    fm.addButton("传送到玩家");
    fm.addButton("把玩家传过来");
    fm.addButton("偏好设置");
    player.sendForm(fm, (pl, id) => {
        if (id == null) return;
        if (id === 0) showTpaMenu(pl, "to");
        else if (id === 1) showTpaMenu(pl, "here");
        else if (id === 2) showTpaPrefsGui(pl);
    });
}

function showTpaMenu(player, fixedDirection) {
    let cost = conf.get("tpa").cost;
    let Scoreboard = economyCfg.scoreboard;
    let onlinePlayers = mc.getOnlinePlayers().filter(p => p.name !== player.name);
    if (onlinePlayers.length === 0) {
        player.tell(info + lang.get("tpa.noplayer.online"));
        return;
    }
    let form = mc.newCustomForm();
    form.setTitle(fixedDirection === "to" ? "传送到玩家" : "把玩家传过来");
    let nameList = onlinePlayers.map(p => p.name);
    form.addDropdown(lang.get("tpa.choose.player"), nameList);
    form.addLabel(lang.get("tpa.cost").replace("${cost}", cost).replace("${Scoreboard}", Scoreboard));
    const tpaConfig = conf.get("tpa") || {};
    let isDelayEnabled = tpaConfig.isDelayEnabled !== false;
    let maxD = Number(tpaConfig.maxDelay) || 20;
    
    let hasDelaySlider = false;
    if (isDelayEnabled) {
        form.addSlider(`§e传送延迟(0~${maxD}秒)`, 0, maxD, 1, 0);
        hasDelaySlider = true;
    }
    
    let isOp = player.isOP();
    if (isOp) {
        form.addSwitch(lang.get("tpa.op.msg"), false);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(info + lang.get("tpa.exit"));
            return;
        }
        let idx = 0;
        let targetIndex = data[idx++];
        idx++; // 跳过标签
        
        let delaySec = 0;
        if (hasDelaySlider) delaySec = data[idx++];
        
        let manage = false;
        if (isOp) manage = data[idx++];
        
        if (manage === true) {
            showTpaManageForm(pl);
            return;
        }
        
        let targetName = nameList[targetIndex];
        sendTpaRequest(pl, targetName, fixedDirection, Math.floor(delaySec));
    });
}

// 玩家个人 TPA 偏好设置
function showTpaPrefsGui(player) {
    const prefs = tpacfg.get(player.realName) || {};
    const tpaConfig = conf.get("tpa") || {};
    
    const fm = mc.newCustomForm();
    fm.setTitle("tpa设置");
    fm.addLabel("关闭此开关将立即拒绝任何tpa请求。");
    fm.addSwitch("tpa开关", prefs.acceptTpaRequests !== false);
    fm.addDropdown("接收到tpa请求时", ["弹窗提醒", "文字提醒"],
        (prefs.promptType === "text" ? 1 : 0));
    fm.addInput("tpa请求有效时间/秒", "秒", String(prefs.requestTimeout || tpaConfig.requestTimeout || 60), lang.get("tpa.timeout.tip") || "");
    
    player.sendForm(fm, (pl, data) => {
        if (!data) return;
        const [, acceptSwitch, promptIdx, timeoutStr] = data;
        const timeout = parseInt(timeoutStr);
        const newPrefs = {
            ...prefs,
            acceptTpaRequests: acceptSwitch,
            promptType: promptIdx === 0 ? "form" : "text",
            requestTimeout: isNaN(timeout) || timeout <= 0 ? (tpaConfig.requestTimeout || 60) : timeout
        };
        tpacfg.set(pl.realName, newPrefs);
        pl.tell(info + lang.get("tpa.save.conf.ok"));
    });
}

function showTpaManageForm(player) {
    // 修复：从配置文件获取 tpa 配置节
    const tpaConfig = conf.get("tpa") || {}; // <-- 添加这行
    let form = mc.newCustomForm();
    form.setTitle(lang.get("tpa.op.menu"));
    form.addInput(lang.get("tpa.send.time"),lang.get("number"), "" + tpaConfig.requestTimeout, lang.get("tpa.send.time.tip") || "");
    form.addDropdown(lang.get("tpa.send.way"), [lang.get("tpa.send.form"), lang.get("tpa.send.bossbar")], (tpaConfig.promptType === "bossbar" ? 1 : 0));
    let isDelayOn = (tpaConfig.isDelayEnabled !== false);
    form.addSwitch(lang.get("tpa.Enabled.lag"), isDelayOn);
    form.addInput(lang.get("tpa.max.lagnumber"), lang.get("number"), "" + (tpaConfig.maxDelay || 20), lang.get("tpa.max.lagnumber.tip") || "");
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(lang.get("tpa.exit"));
            return;
        }
        
        let newTimeout = parseInt(data[0]);
        let promptIndex = data[1];
        let enableDelay = data[2];
        let newMaxDelay = parseInt(data[3]);
        
        if (isNaN(newTimeout) || newTimeout <= 0) {
            pl.tell(info +lang.get("tpa.input.must.number"));
            return;
        }
        
        if (isNaN(newMaxDelay) || newMaxDelay < 0) {
            pl.tell(info +lang.get("tpa.must.biggerzero"));
            return;
        }
        
        let newPromptType = (promptIndex === 0 ? "form" : "bossbar");
        const updatedTpaConfig = {
            ...tpaConfig,
            requestTimeout: newTimeout,
            promptType: newPromptType,
            isDelayEnabled: enableDelay,
            maxDelay: newMaxDelay
        };
        conf.set("tpa", updatedTpaConfig); // 这行会自动保存
        
        pl.tell(info +lang.get("tpa.save.conf.ok"));
    });
}

function sendTpaRequest(fromPlayer, toPlayerName, direction, delaySec) {
    // 确保 delaySec 是数字，如果不是则设为默认值 0
    if (isNaN(delaySec) || delaySec === undefined) {
        delaySec = 0;
    }
    
    let toPlayer = mc.getPlayer(toPlayerName);
    if (!toPlayer) {
        fromPlayer.tell(info + lang.get("tpa.send.fail"));
        return;
    }
    // 检查目标玩家是否接受传送请求
    const acceptTpaRequests = tpacfg.get(toPlayerName)?.acceptTpaRequests;
    if (acceptTpaRequests === false) {
        fromPlayer.tell(info + lang.get("tpa.send.noway"));
        return;
    }
    
    let uid = Math.floor(Math.random() * 1e8);
    let req = {
        from: fromPlayer,
        to: toPlayer,
        fromName: fromPlayer.name,
        toName: toPlayerName,
        direction: direction,
        delay: delaySec,
        bossbarId: uid,
        startTime: Date.now()
    };
    pendingTpaRequests[toPlayerName] = req;
    const tpaConfig = conf.get("tpa") || {};
    const toPrefs = tpacfg.get(toPlayerName) || {};
    // 优先用目标玩家的个人偏好，没设置则用全局config
    let pType = toPrefs.promptType || tpaConfig.promptType || "form";
    let timeoutSec = toPrefs.requestTimeout || tpaConfig.requestTimeout || 60;
    toPlayer.tell(`${info}§e收到传送请求(${req.fromName}想${direction === "to" ? lang.get("tpa.to.here"):lang.get("tpa.to.he.she")})\n` +
                 (delaySec > 0 ? `§6并设置了延迟: ${delaySec}秒\n` : "") +
                 `${lang.get("tpa.a.and.d")}\n` +
                 `§c请求最多等待${timeoutSec}秒`);
 //1816   
    fromPlayer.tell(`${info}§a已向 ${toPlayerName} 发送请求(延迟=${delaySec}), 等待对方同意(最多${timeoutSec}s)`);
    
    if (pType === "form") {
        showTpaConfirmForm(req, timeoutSec);
    } else {
        showTpaBossbarPrompt(req, timeoutSec);
    }
}

function showTpaConfirmForm(req, timeoutSec) {
    let toPlayer = req.to;
    let fromName = req.fromName;
    let dirText = (req.direction === "to" ? lang.get("tpa.to.here"): lang.get("tpa.to.here"));
    let delayStr = (req.delay > 0 ? `(延迟${req.delay}秒)\n` : "");
    
    let form = mc.newSimpleForm();
    form.setTitle(lang.get("tpa.request"));
    form.setContent(`${info}§b[${fromName}] 请求${dirText}\n` +
                   `${delayStr}` +
                   `${lang.get("tpa.a.and.d")}n` +
                   `§e剩余时间: ${timeoutSec}s`);
    form.addButton(lang.get("tpa.a"));
    form.addButton(lang.get("tpa.d"));
    
    toPlayer.sendForm(form, (pl, id) => {
        if (id == null) return; 
        if (id === 0) acceptTpaRequest(pl.name);
        else denyTpaRequest(pl.name);
    });
    
    startTpaRequestCountdown(req, timeoutSec, false);
}

function showTpaBossbarPrompt(req, timeoutSec) {
    let toPlayer = req.to;
    let fromName = req.fromName;
    let dirText = (req.direction === "to" ? lang.get("tpa.to.here"): lang.get("tpa.to.he.she"));
    let delayStr = (req.delay > 0 ? `(延迟${req.delay}秒)` : "");
    let barId = req.bossbarId;
    
    toPlayer.setBossBar(barId,
        `§a${fromName}请求${dirText}§f${delayStr}\n§c(/tpayes同意 /tpano拒绝)`,
        100, 3
    );
    
    startTpaRequestCountdown(req, timeoutSec, true);
}

function startTpaRequestCountdown(req, timeoutSec, bossbarMode) {
    let remain = timeoutSec;
    let to = req.to;
    let from = req.from;
    let barId = req.bossbarId;
    
    let timerId = setInterval(() => {
        remain--;
        
        if (!mc.getPlayer(to.name) || !mc.getPlayer(from.name)) {
            clearInterval(timerId);
            cancelTpaRequest(to.name,lang.get("tpa.player.offline") );
            return;
        }
        
        if (bossbarMode) {
            let percent = Math.floor((remain / timeoutSec) * 100);
            let dirText = (req.direction === "to" ? lang.get("tpa.to.here"): lang.get("tpa.to.he.she"));
            let delayStr = (req.delay > 0 ? `(延迟${req.delay}秒)` : "");
            to.setBossBar(barId,
                `§a${from.name}请求${dirText}§f${delayStr}§s(/tpy同意 /tpn拒绝),剩余${remain}s`,
                percent, 3
            );
        }
        if (remain <= 0) {
            clearInterval(timerId);
            cancelTpaRequest(to.name, info+lang.get("tpa.request.timeout"));
        }
    }, 1000);
    
    req.timer = timerId;
}

mc.regPlayerCmd("tpayes", "§a同意传送请求", (pl) => {
    acceptTpaRequest(pl.name);
});

mc.regPlayerCmd("tpano", "§c拒绝传送请求", (pl) => {
    denyTpaRequest(pl.name);
});
// v2.10.5: /crash 命令已迁移至 modules/Crash.js

function acceptTpaRequest(targetName) {
    let cost = conf.get("tpa").cost;
    let req = pendingTpaRequests[targetName];
    if (!req) {
        let p = mc.getPlayer(targetName);
        if (p) p.tell(info +lang.get("tpa.no.request"));
        return;
    }
    
    clearTpaRequest(req);
    
    let from = req.from, to = req.to;
    let delay = req.delay;
    let dir = req.direction;
    
    to.tell(info +lang.get("tpa.accpet.request"));
    from.tell(`${info}§a对方已同意请求，` + (delay > 0 ? `将在${delay}秒后传送...` : "正在传送..."));
        if (cost > 0) {
        if (!EconomyManager.checkAndReduce(from.realName, cost)) {
            showInsufficientMoneyGui(from, cost);
            return false;
        }
        from.sendText(info + `§e传送花费 ${cost}${conf.get("Economy").CoinName}`);
    }
    if (delay > 0) {
        let secondBarId = Math.floor(Math.random() * 1e9);
        let remain = delay;
        
        let secondTid = setInterval(() => {
            remain--;
            
            if (!mc.getPlayer(from.name) || !mc.getPlayer(to.name)) {
                clearInterval(secondTid);
                from.removeBossBar(secondBarId);
                to.removeBossBar(secondBarId);
                from.tell(info +lang.get("tpa.request.cut"));
                return;
            }
            
            let percent = Math.floor((remain / delay) * 100);
            from.setBossBar(secondBarId, `§d传送倒计时: ${remain}s`, percent, 1);
            to.setBossBar(secondBarId, `§d传送倒计时: ${remain}s`, percent, 1);
            
            if (remain <= 0) {
                clearInterval(secondTid);
                from.removeBossBar(secondBarId);
                to.removeBossBar(secondBarId);
                
                if (dir === "to") {
                    let targetPlayer = mc.getPlayer(to.name);
                    if (!targetPlayer) {
                        from.tell(info +lang.get("tpa.tp.fail.noonline"));
                        return;
                    }
                    let footPos = new FloatPos(
                        targetPlayer.pos.x,
                        targetPlayer.pos.y - 1.62, 
                        targetPlayer.pos.z,
                        targetPlayer.pos.dimid
                    );
                    from.teleport(footPos);
                } else {
                    let targetPlayer = mc.getPlayer(from.name);
                    if (!targetPlayer) {
                        to.tell(info +lang.get("tpa.tp.fail.noonline"));
                        return;
                    }
                    let footPos = new FloatPos(
                        targetPlayer.pos.x,
                        targetPlayer.pos.y - 1.62, 
                        targetPlayer.pos.z,
                        targetPlayer.pos.dimid
                    );
                    to.teleport(footPos);
                }
                from.tell(info +lang.get("tpa.tp.okey"));
                to.tell(info +lang.get("tpa.tp.okey"));
            }
        }, 1000);
    } else {
        if (!mc.getPlayer(from.name) || !mc.getPlayer(to.name)) {
            from.tell(info +lang.get("tpa.tp.fail.noonline"));
            return;
        }
        
        if (dir === "to") {
            let targetPlayer = mc.getPlayer(to.name);
            if (!targetPlayer) {
                from.tell(info +lang.get("tpa.player.offline"));
                return;
            }
            let footPos = new FloatPos(
                targetPlayer.pos.x,
                targetPlayer.pos.y - 1.62, 
                targetPlayer.pos.z,
                targetPlayer.pos.dimid
            );
            setTimeout(() => {
            from.teleport(footPos);
            },500)
            mc.runcmdEx(`camera ${from.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        } else {
            let targetPlayer = mc.getPlayer(from.name);
            if (!targetPlayer) {
                to.tell(info +lang.get("tpa.tp.fail.noonline"));
                return;
            }
            let footPos = new FloatPos(
                targetPlayer.pos.x,
                targetPlayer.pos.y - 1.62, 
                targetPlayer.pos.z,
                targetPlayer.pos.dimid
            );
            setTimeout(() => {
            to.teleport(footPos);
            },500)
            mc.runcmdEx(`camera ${to.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        }
        from.tell(info +lang.get("tpa.tp.okey"));
        to.tell(info +lang.get("tpa.tp.okey"));
    }
    
    delete pendingTpaRequests[targetName];
}

function denyTpaRequest(targetName) {
    let req = pendingTpaRequests[targetName];
    if (!req) {
        let p = mc.getPlayer(targetName);
        if (p) p.tell(info +lang.get("tpa.no.request"));
        return;
    }
    
    clearTpaRequest(req);
    req.from.tell(info +lang.get("tpa.d.request"));
    req.to.tell(info +lang.get("tpa.d.request.you"));
    delete pendingTpaRequests[targetName];
}

function cancelTpaRequest(targetName, msg) {
    let req = pendingTpaRequests[targetName];
    if (!req) return;
    
    clearTpaRequest(req);
    req.from.tell(msg);
    delete pendingTpaRequests[targetName];
}

function clearTpaRequest(req) {
    if (req.timer) {
        clearInterval(req.timer);
    }
    
    let to = req.to;
    if (to && mc.getPlayer(to.name)) {
        to.removeBossBar(req.bossbarId);
    }
}

if (__YEST_FIRST_LOAD__) {
mc.listen("onLeft", (pl) => {
    let pname = pl.name;
    
    for (let [key, request] of Object.entries(pendingTpaRequests)) {
        if (!request || !request.from || !request.to) continue;
        
        if (request.toName === pname) {
            clearTpaRequest(request);
            request.from.tell(info +lang.get("tpa.player.offline"));
            delete pendingTpaRequests[key];
        } else if (request.fromName === pname) {
            let rec = request.to;
            if (rec) rec.tell(info +lang.get("tpa.player.offline"));
            clearTpaRequest(request);
            delete pendingTpaRequests[key];
        }
    }
});
}
// ======================
// RTP2252 2.2.9
// ======================
// 冷却倒计时由 RadomTeleportSystem.js 内部管理
////rtp  remake
const rtpResetCmd = mc.newCommand("rtpreset", "重置传送冷却", PermType.GameMasters);
rtpResetCmd.overload([]);
rtpResetCmd.mandatory("player", ParamType.Player);
rtpResetCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    RadomTeleportSystem.cooltime.set(pl.realName, 0);
    out.success(`已重置 ${pl.realName} 的传送冷却`);
});
rtpResetCmd.setup();
const asyncRtpCmd = mc.newCommand("rtp", "异步随机传送", PermType.Any);
asyncRtpCmd.overload([]);
asyncRtpCmd.setCallback(async (cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error(lang.get("warp.only.player"));
    
    if (!conf.get("RTP").EnabledModule) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    
    try {
        await RadomTeleportSystem.performRTPAsync(pl);
    } catch (error) {
        logger.error(`RTP命令执行失败: ${error.message}`);
        pl.tell(info + "§c传送失败，请稍后重试");
    }
});
asyncRtpCmd.setup();
//经济检查模块
function smartMoneyCheck(plname, value) {
    const pl = mc.getPlayer(plname);
    if (!pl) return false;
    const isLLMoney = economyCfg.isLLMoney;
    const scoreboard = economyCfg.scoreboard;
    let balance = isLLMoney ? pl.getMoney() : pl.getScore(scoreboard);
    if (balance === null || balance === undefined) {
        if (isLLMoney) pl.setMoney(0);
        else pl.setScore(scoreboard, 0);
        balance = 0;
    }
    if (balance < value) return false;
    return isLLMoney ? pl.reduceMoney(value) : pl.reduceScore(scoreboard, value);
}
// ======================
// 红包系统已迁移至 modules/Redpacket.js
// ======================
function showInsufficientMoneyGui(pl, cost, returnCmd) {
    let fm = mc.newSimpleForm();
    fm.setTitle(lang.get("gui.insufficient.money.title"));
    fm.setContent(lang.get("gui.insufficient.money.content")
        .replace("${cost}", cost)
        .replace("${coin}", conf.get("Economy").CoinName));
    fm.addButton(lang.get("gui.button.confirm"));
    if (returnCmd) {
        fm.addButton(lang.get("gui.button.back"));
    }
    pl.sendForm(fm, (p, id) => {
        if (id === 1 && returnCmd) {
            p.runcmd(returnCmd);
        }
    });
}
// 标记 listener 已注册
globalThis.__YEST_listeners_registered__ = true;