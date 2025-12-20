/*--------------------------------
    ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  
    ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  
    ╚ ████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     
     ╚ ██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     
       ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗
       ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝
    
                          Produced by Nico6719 and PHEyeji
                 This plugin is distributed under the GPLv3 License

该插件由Nico6719,PHEyeji联合创作
未经允许禁止擅自修改或者发售
该插件仅在[github,MineBBS,KLPBBS]发布
禁止二次发布插件
----------------------------------*/

/// <reference path="c:\Users\Admin/dts/helperlib/src/index.d.ts"/> 

// ============================================================================
// 常量定义
// ============================================================================
const PLUGIN_NAME = "YEssential";
const PLUGIN_INFO = "YEssential多功能基础插件";
const PLUGIN_VERSION = "3.0.0";
const PLUGIN_VERSION_ARR = [3, 0, 0];
const INFO_PREFIX = "§l§6[-YEST-] §r";

// 路径常量
const PATHS = {
    PLUGIN: "./plugins/YEssential/",
    DATA: "./plugins/YEssential/data/",
    LANG: "./plugins/YEssential/lang/",
    CONFIG: "./plugins/YEssential/Config/config.json",
    LANG_FILE: "./plugins/YEssential/lang/zh_cn.json",
    HOME_DATA: "./plugins/YEssential/data/homedata.json",
    WARP_DATA: "./plugins/YEssential/data/warpdata.json",
    RTP_DATA: "./plugins/YEssential/data/RTPData/Rtpdata.json",
    NOTICE_DATA: "./plugins/YEssential/data/NoticeSettingsData/playersettingdata.json",
    NOTICE_FILE: "./plugins/YEssential/data/NoticeSettingsData/notice.txt",
    PVP_DATA: "./plugins/YEssential/data/PVPSettingsData/pvp_data.json",
    MONEY_RANKING: "./plugins/YEssential/data/Money/Moneyranking.json",
    MONEY_HISTORY: "./plugins/YEssential/data/Money/MoneyHistory.json",
    OFFLINE_MONEY: "./plugins/YEssential/data/Money/offlineMoney.json",
    SERVER_DATA: "./plugins/YEssential/data/TrSeverData/server.json",
    TPA_DATA: "./plugins/YEssential/data/TpaSettingsData/tpaAutoRejectConfig.json",
    REDPACKET_DATA: "./plugins/YEssential/data/Redpacketdata/Redpacket.json"
};

// 维度名称映射
const DIMENSION_NAMES = {
    0: "主世界",
    1: "下界",
    2: "末地"
};

// ============================================================================
// 默认语言配置
// ============================================================================
const DEFAULT_LANG = {
    "wh.warn": "服务器启动时维护模式已启用，非OP玩家将无法加入!!!!!",
    "Upd.check": "正在检查新版本中.... 您可在config.json禁用自动更新",
    "Upd.success": "更新成功！稍后将重载插件",
    "Upd.fail": "更新失败",
    "Tip1": "如有Bug请联系作者反馈！！！！",
    "Tip2": "感谢PHEyeji提供技术支持和指导！感谢ender罗小黑提供在线网页支持！",
    "Tip3": "在线config编辑器：https://jzrxh.work/projects/yessential/config.html",
    "Version.Chinese": "版本:",
    "notice.editor": "§l§e公告编辑器",
    "notice.no.change": "§e公告内容未更改！",
    "notice.exit.edit": "已取消编辑",
    "notice.for.server": "§l§e服务器公告",
    "notice.dont.showagain": "以后进服不自动弹出(除非公告更新或停用此开关)",
    "notice.is.changed": "检测到新公告，玩家下次加入将强制显示",
    "player.not.op": "§c权限不足！",
    "gui.exit": "表单已关闭,未收到操作",
    "server.tp.ok": "传送成功！",
    "no.server.can.tp": "暂无可传送服务器!",
    "ranking.list": "排行榜",
    "no.ranking.data": "§c暂无排行榜数据！",
    "server.load.error": "服务器配置加载失败，请联系管理员！",
    "server.no.select": "§c服务器选择无效！",
    "server.from.title": "跨服传送列表",
    "choose.a.server": "请选择一个服务器",
    "server.tp.fail": "§c跨服传送失败，请检查目标服务器状态！",
    "no.server.cantpto": "server.json 内容为空或 servers 键不存在！",
    "save.notice.ok": "保存公告成功！",
    "suicide.kill.ok": "自杀执行成功！",
    "pls.input.number": "请输入增加数量!",
    "key.not.number": "请输入数字！",
    "money.create.score": "计分板项目不存在，以为您自动创建",
    "money.callback.menu": "§a正在返回经济系统主界面...",
    "money.player.list": "排行榜",
    "moneys.help": "您的语法有误！\n/moneys <name> add \n /monneys <name> del \n /moneys <name> set",
    "money.transfer": "转账",
    "moeny.view": "查看",
    "money.query": "查询",
    "money.history": "历史记录",
    "money.success": "成功",
    "money.decrease.number": "请输入要减少的",
    "money.add.number": "请输入要增加的",
    "moeny.set.number": "请输入要设置的",
    "money.no.enough": "您的余额不足！",
    "money.tr.error1": "无效的接收方！",
    "money.tr.error2": "不能给自己转账!",
    "money.tr.noonline": "目标玩家离线",
    "money.tr.noinput": "请输入转账数量!",
    "money.tr.beizhu": "转账的备注（可以留空）",
    "money.tr.amount": "输入转账数量(all为全部)",
    "money.del.number": "请输入减少数量!",
    "moeny.setting.number": "请输入设置数量",
    "money.must.bigger0": "转账数量必须大于0！",
    "money.cannot.smaller0": "§c实际到账金额不能为负数！",
    "money.op.add": "增加玩家的",
    "money.op.remove": "减少玩家的",
    "money.op.set": "设置玩家的",
    "money.op.look": "查看玩家的",
    "rp.menu.1": "红包",
    "rp.send.packet": "发送红包",
    "rp.open.packet": "领取红包",
    "rp.all.help": "红包使用帮助",
    "rp.send.amount": "要发送的红包数量：",
    "rp.send.count": "红包金额：",
    "rp.count.bigger.yourmoney": "红包总额度不能大于你的",
    "redpacket.type": "红包类型：",
    "rp.random.packet": "拼手气红包",
    "rp.average.packet": "普通红包",
    "warp.menu.public": "公共传送点",
    "warp.menu.public.op": "(OP)公共传送点",
    "warp.go.to": "前往传送点",
    "warp.add": "添加传送点",
    "warp.add.point": "添加公共传送点",
    "warp.del": "删除传送点",
    "warp.del.point": "删除公共传送点",
    "warp.input.name": "请输入传送点名称",
    "warp.name": "传送点名称",
    "warp.list": "传送点列表",
    "warp.add.point.xyz": "添加当前坐标为公共传送点",
    "warp.noinput.name": "传送点名称不能为空！",
    "warp.name.repetitive": "传送点名称已存在！",
    "back.to.point": "返回死亡点",
    "back.helpinfo": "§a已记录您的死亡点！使用 /back 查看所有死亡点。",
    "back.to.point.sure": "确认返回死亡点？",
    "back.choose": "§6请选择要传送的死亡点：",
    "back.list.Empty": "您没有死亡历史记录!",
    "back.successful": "返回成功！",
    "back.fail": "§c传送失败！",
    "back.choose.null": "§c选择无效！",
    "back.deathlog.error": "§c死亡点数据错误！",
    "home.tp.system": "§6§l家园传送系统",
    "home.add": "§l§a添加家",
    "home.add.input": "请输入您的家名称",
    "home.del": "§c§l删除家",
    "home.del.choose": "请选择要删除的家",
    "home.tp": "§b§l传送家",
    "home.tp.choose": "请选择要传送的家",
    "home.name.repetitive": "家名称已存在!",
    "home.name.noinput": "请输入家名称!",
    "shop.no.Eabled": "§c商店功能已关闭！",
    "shop.is.nothing": "§c暂无商品可购买！",
    "shop.conf.error": "§c商品配置错误！",
    "shop.choose.errorthings": "§c商品选择无效！",
    "home.input.name": "请输入您的家名称",
    "home.create.new": "添加家",
    "bag.is.full": "§c背包已满，无法给予物品！",
    "rtp.onlycanusein.overworld": "§c只能在主世界使用随机传送！",
    "module.no.Enabled": "所选模块（功能）未开启！",
    "fc.error": "无法对非玩家对象执行此命令",
    "fc.error2": "你都是管理员了用这个功能干什么（）",
    "fc.success.quit": "成功退出灵魂出窍",
    "fc.success.getin": "成功进入灵魂出窍，花费§e${Fcam}金币",
    "tpa.cost": "传送将花费 ${cost} ${Scoreboard} ",
    "tpa.d": "§c拒绝",
    "tpa.d.request": "§c对方拒绝了传送请求。",
    "tpa.d.request.you": "§e你已拒绝传送请求。",
    "tpa.a": "§a同意",
    "tpa.tp.okey": "§a传送成功!",
    "tpa.accpet.request": "§a已同意传送请求。",
    "tpa.request": "§a传送请求",
    "tpa.request.cut": "§c传送中断，对方或你下线。",
    "tpa.tp.fail.noonline": "§c传送失败，目标玩家已离线。",
    "tpa.a.and.d": "§e可在表单点击【同意/拒绝】或输入 /tpayes(同意)/tpano(拒绝)",
    "tpa.name.ls": "§d互传系统",
    "tpa.tp.msg": "§a互传请求",
    "tpa.exit": "§c操作已取消。",
    "tpa.op.msg": "§c管理互传(开启后进入管理页面)",
    "tpa.op.menu": "§c管理互传",
    "tpa.send.time": "§e请求超时时间(秒)",
    "tpa.send.fail": "§c目标玩家离线,无法发送请求",
    "tpa.send.noway": "§c对方拒绝了所有传送请求",
    "tpa.send.way": "§e请求提示方式",
    "tpa.send.form": "form(对方弹窗)",
    "tpa.send.bossbar": "bossbar(血条)",
    "tpa.Enabled.lag": "§b是否启用延迟功能",
    "tpa.max.lagnumber": "§b最大延迟秒数",
    "tpa.player.offline": "§c对方(或你)下线,请求取消",
    "tpa.request.timeout": "§c传送请求已超时",
    "tpa.no.request": "§c你没有待处理的请求。",
    "tpa.input.must.number": "§c请求超时必须是正整数！",
    "tpa.must.biggerzero": "§c最大延迟必须>=0！",
    "tpa.save.conf.ok": "保存配置成功！",
    "tpa.no.callback": "§c对方已有未处理的请求, 稍后再试",
    "tpa.choose.player": "§s选择目标玩家",
    "tpa.allow.tp": "你现在 接受 所有传送请求。",
    "tpa.noallow.tp": "你现在 拒绝 所有传送请求。",
    "tpa.choose.fs": "§a传送方式",
    "tpa.to.he.she": "§a传送到对方",
    "tpa.to.here": "§e传送到我",
    "tpa.noplayer.online": "§c当前没有其他在线玩家",
    "hub.tp.check": "§l§a回城确认",
    "hub.tp.now": "§a✔ 立即传送",
    "hub.tp.notnow": "§c✘ 不是现在",
    "hub.tp.success": "§l§b[YEST] §r §a成功传送到主城！",
    "hub.tp.fail": "§l§b[YEST] §r 回城失败！原因：",
    "crash.player.ok": "成功把玩家崩溃了！",
    "crash.player.client": "§c使玩家客户端崩溃",
    "carsh.function.list": "§c崩溃功能如下",
    "weihu.msg": "服务器正在维护中，请稍后再来",
    "clean.msg": "§l§e[清理系统] §f${sec}秒后清理掉落物！",
    "clean.startto.clean": "§l§6[清理系统] §f开始清理，共发现 §e${total} §f掉落物…",
    "clean.ok": "§l§a[清理系统] §f清理完毕，共移除 §e${total} §f个掉落物",
    "clean.item.warn": "§c[警告] 掉落物达到 ${count} 个，触发紧急清理！",
    "stop.msg": "服务器关闭\n请稍后再来",
    "pls.input.notice": "请输入公告内容，（换行用 \\n）",
    "gamerule.KeepInventory.true": "死亡不掉落已启用",
    "cannot.create.newfile": "无法创建数据存储对象",
    "rtp.search.chunks": "§a正在寻找安全的传送位置，请稍候...",
    "rtp.search.chunks2": "§e未找到理想位置，使用备用传送方案...",
    "rtp.loading.chunks3": "§7正在加载区块...",
    "rtp.loading.chunks2": "§7正在加载区块..",
    "rtp.loading.chunks1": "§7正在加载区块.",
    "rtp.cannotfind.safexyz": "§c无法找到安全的传送位置，请稍后再试",
    "rtp.tp.success": "§a传送成功！",
    "rtp.tp.success2": "§6已传送到安全高度，请自行寻找落脚点",
    "rtp.loadchunks.timeout": "§c目标区块加载超时",
    "rtp.error": "§c传送过程发生错误",
    "pvp.is.on": "§6PVP 已开启。",
    "pvp.is.off": "§6PVP 已关闭。",
    "your.pvp.isoff": "§l§b你关闭了 PVP。",
    "then.pvp.isoff": "§l§b对方关闭了 PVP。",
    "choose": "选择",
    "success": "成功",
    "one": "一个",
    "player": "玩家",
    "number": "数字",
    "CoinName": "金币",
    "to": "将",
    "add": "加"
};

// ============================================================================
// 默认配置
// ============================================================================
const DEFAULT_CONFIG = {
    "Version": 270,
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
    "AutoCleanItemBatch": 200,
    "AutoCleanItemInterval": 60,
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
    },
    "AutoCleanItemWarnTimes": [30, 15, 10, 5, 3, 2, 1],
    "AutoCleanItemTriggerAmount": 2000
};

// ============================================================================
// 插件注册
// ============================================================================
ll.registerPlugin(PLUGIN_NAME, PLUGIN_INFO, PLUGIN_VERSION_ARR, {
    Author: "Nico6719",
    License: "GPL-3.0",
    QQ: "1584573887"
});

// ============================================================================
// 全局数据存储
// ============================================================================
let lang, conf, homedata, rtpdata, warpdata, noticeconf, pvpConfig;
let MoneyHistory, moneyranking, offlineMoney, servertp, tpacfg;
let PAPI;

// 运行时状态
const RuntimeState = {
    maintenanceMode: false,
    isSending: false,
    cleaning: false,
    cooltime: new Map(),
    deathPoints: {},
    pendingTpaRequests: {},
    fcamBossBars: new Map()
};

// ============================================================================
// 工具类
// ============================================================================

/**
 * 异步文件操作工具类
 */
class AsyncFileManager {
    static async readFile(path, defaultContent = '{}') {
        return new Promise((resolve) => {
            try {
                if (!file.exists(path)) {
                    file.writeTo(path, defaultContent);
                    resolve(JSON.parse(defaultContent));
                } else {
                    const content = file.readFrom(path);
                    resolve(JSON.parse(content || defaultContent));
                }
            } catch (e) {
                logger.error(`读取文件失败: ${path}`, e);
                resolve(JSON.parse(defaultContent));
            }
        });
    }

    static async writeFile(path, data) {
        return new Promise((resolve, reject) => {
            try {
                const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
                file.writeTo(path, content);
                resolve(true);
            } catch (e) {
                logger.error(`写入文件失败: ${path}`, e);
                reject(e);
            }
        });
    }
}

/**
 * 异步网络请求管理器
 */
class AsyncNetworkManager {
    static async httpGet(url, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`请求超时: ${url}`));
            }, timeout);

            network.httpGet(url, (status, result) => {
                //clearTimeout(timer);
                if (status === 200) {
                    resolve(result);
                } else {
                    reject(new Error(`请求失败，状态码: ${status}`));
                }
            });
        });
    }
}   

/**
 * 配置管理器
 */
class ConfigManager {
    constructor() {
        this.currentVersion = 270;
    }

    initConfigMigration() {
        const savedVersion = conf.get("Version") || 0;
        
        if (savedVersion < this.currentVersion) {
            logger.info(`检测到配置版本更新: ${savedVersion} -> ${this.currentVersion}, 开始迁移配置...`);
            this.migrateConfig(savedVersion);
            conf.set("Version", this.currentVersion);
            logger.info("配置迁移完成！");
        }
        
        this.ensureAllConfigs();
    }

    migrateConfig(oldVersion) {
        if (oldVersion < 261) this.migrateTo261();
        if (oldVersion < 262) this.migrateTo262();
        if (oldVersion < 263) this.migrateTo263();
        if (oldVersion < 264) this.migrateTo264();
        if (oldVersion < 300) this.migrateTo300();
    }

    migrateTo261() {
        logger.info("迁移到版本2.6.1...");
        this.setIfMissing("BackTipAfterDeath", false);
    }

    migrateTo262() {
        logger.info("迁移到版本2.6.2...");
        this.setIfMissing("AutoCleanItemBatch", 200);
        this.setIfMissing("AutoCleanItemInterval", 60);
        this.setIfMissing("AutoCleanItemTriggerAmount", 2000);
    }

    migrateTo263() {
        logger.info("迁移到版本2.6.3...");
        this.ensureObjectConfig("tpa", DEFAULT_CONFIG.tpa);
    }

    migrateTo264() {
        logger.info("迁移到版本2.6.4...");
        this.ensureObjectConfig("Fcam", DEFAULT_CONFIG.Fcam);
        this.ensureObjectConfig("wh", DEFAULT_CONFIG.wh);
    }

    migrateTo300() {
        logger.info("迁移到版本3.0.0...");
        // 添加新的配置项
    }

    setIfMissing(key, defaultValue) {
        if (conf.get(key) === undefined) {
            conf.set(key, defaultValue);
            logger.info(`添加缺失配置: ${key} = ${JSON.stringify(defaultValue)}`);
        }
    }

    ensureObjectConfig(key, defaultConfig) {
        let currentConfig = conf.get(key);
        
        if (currentConfig === undefined || currentConfig === null || 
            typeof currentConfig !== 'object' || Array.isArray(currentConfig)) {
            conf.set(key, defaultConfig);
            logger.info(`创建对象配置: ${key}`);
            return;
        }

        const merged = this.mergeConfigs(defaultConfig, currentConfig);
        conf.set(key, merged);
    }

    mergeConfigs(defaultConfig, currentConfig) {
        const merged = JSON.parse(JSON.stringify(currentConfig));
        
        for (const key in defaultConfig) {
            if (merged[key] === undefined) {
                merged[key] = defaultConfig[key];
            } else if (typeof defaultConfig[key] === 'object' && 
                       defaultConfig[key] !== null && 
                       !Array.isArray(defaultConfig[key])) {
                merged[key] = this.mergeConfigs(defaultConfig[key], merged[key]);
            }
        }
        
        return merged;
    }

    ensureAllConfigs() {
        logger.info("检查所有配置项...");
        
        for (const key in DEFAULT_CONFIG) {
            if (typeof DEFAULT_CONFIG[key] === 'object' && 
                DEFAULT_CONFIG[key] !== null && 
                !Array.isArray(DEFAULT_CONFIG[key])) {
                this.ensureObjectConfig(key, DEFAULT_CONFIG[key]);
            } else {
                this.setIfMissing(key, DEFAULT_CONFIG[key]);
            }
        }
    }
}

/**
 * 异步更新检查器
 */
class AsyncUpdateChecker {
    static async checkForUpdates(currentVersion) {
        try {
            logger.warn(lang.get("Upd.check"));
            
            const result = await AsyncNetworkManager.httpGet("https://dl.mcmcc.cc/file/Version.json");
            const jsonData = JSON.parse(result);
            const remoteVersion = jsonData.version;
            
            const comparison = Utils.compareVersions(remoteVersion, currentVersion);
            
            if (comparison > 0) {
                logger.warn(`发现新版本! ${currentVersion} → ${remoteVersion}`);
                await this.downloadUpdate(remoteVersion);
            } else if (comparison < 0) {
                colorLog("red", `您的本地版本比远程版本更新！ (${currentVersion} > ${remoteVersion})`);
            } else {
                colorLog("green", `您已是最新版本 (${currentVersion})`);
            }
        } catch (error) {
            logger.error("更新检查失败: " + error.message);
        }
    }

    static async downloadUpdate(version) {
        try {
            logger.warn(`正在更新到 ${version} 中.....`);         
            const pluginData = await AsyncNetworkManager.httpGet('https://dl.mcmcc.cc/file/YEssential.js');
            const processedData = pluginData.replace(/\r/g, '');
            
            await AsyncFileManager.writeFile(PATHS.PLUGIN + "YEssential.js", processedData);
            
            colorLog("green", lang.get("Upd.success"));
            
            setTimeout(() => {
                mc.runcmdEx("ll reload YEssential");
            }, 1000);
        } catch (error) {
            logger.error(lang.get("Upd.fail") + ": " + error.message);
        }
    }
}

/**
 * 异步语言文件管理器
 */
class AsyncLanguageManager {
    static async mergeLangFiles() {
        try {
            if (!file.exists(PATHS.LANG)) {
                file.mkdir(PATHS.LANG);
            }
            
            const currentLangData = await AsyncFileManager.readFile(PATHS.LANG_FILE, JSON.stringify(DEFAULT_LANG));
            const mergedData = { ...currentLangData };
            let addedCount = 0;
            
            for (const key in DEFAULT_LANG) {
                if (!(key in mergedData)) {
                    mergedData[key] = DEFAULT_LANG[key];
                    addedCount++;
                }
            }
            
            if (addedCount > 0) {
                await AsyncFileManager.writeFile(PATHS.LANG_FILE, mergedData);
                colorLog("green", `语言文件已更新，新增 ${addedCount} 个条目`);
                lang = new JsonConfigFile(PATHS.LANG_FILE, JSON.stringify(mergedData));
            }
        } catch (error) {
            logger.error("合并语言文件时出错: " + error.message);
        }
    }
}

/**
 * 通用工具函数
 */
const Utils = {
    // 比较版本号
    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        const maxLength = Math.max(parts1.length, parts2.length);
        
        for (let i = 0; i < maxLength; i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;
            
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    },

    // 获取随机字母
    getRandomLetter() {
        const randomIndex = Math.floor(Math.random() * 26);
        return String.fromCharCode(65 + randomIndex);
    },

    // 格式化金钱显示
    formatMoney(amount) {
        if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M";
        if (amount >= 1e3) return (amount / 1e3).toFixed(1) + "K";
        return amount.toLocaleString();
    },

    // 获取排名前缀
    getRankPrefix(rank) {
        return ["§6★", "§b☆", "§c◆", "§a▣"][Math.min(3, rank - 1)] || "§7";
    },

    // 获取维度名称
    getDimensionName(id) {
        return DIMENSION_NAMES[id] || `未知维度 (ID: ${id})`;
    },

    // 检查是否为有效玩家
    isValidPlayer(player) {
        return player && typeof player.sendText === "function" && !player.isSimulatedPlayer();
    },

    // 安全获取配置
    safeGetConfig(key, defaultValue = null) {
        try {
            const value = conf.get(key);
            return value !== undefined ? value : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
};

/**
 * 经济系统工具
 */
const EconomyUtils = {
    // 获取玩家余额
    getBalance(player) {
        if (!player) return 0;
        
        if (conf.get("LLMoney")) {
            return player.getMoney() || 0;
        } else {
            return player.getScore(conf.get("Scoreboard")) || 0;
        }
    },

    // 设置玩家余额
    setBalance(player, amount) {
        if (!player) return false;
        
        try {
            if (conf.get("LLMoney")) {
                player.setMoney(amount);
            } else {
                player.setScore(conf.get("Scoreboard"), amount);
            }
            return true;
        } catch (e) {
            logger.error("设置余额失败: " + e.message);
            return false;
        }
    },

    // 增加玩家余额
    addBalance(player, amount) {
        if (!player || amount <= 0) return false;
        
        try {
            if (conf.get("LLMoney")) {
                player.addMoney(amount);
            } else {
                player.addScore(conf.get("Scoreboard"), amount);
            }
            return true;
        } catch (e) {
            logger.error("增加余额失败: " + e.message);
            return false;
        }
    },

    // 减少玩家余额
    reduceBalance(player, amount) {
        if (!player || amount <= 0) return false;
        
        const balance = this.getBalance(player);
        if (balance < amount) return false;
        
        try {
            if (conf.get("LLMoney")) {
                player.reduceMoney(amount);
            } else {
                player.reduceScore(conf.get("Scoreboard"), amount);
            }
            return true;
        } catch (e) {
            logger.error("减少余额失败: " + e.message);
            return false;
        }
    },

    // 检查并扣费
    checkAndDeduct(playerName, amount) {
        const player = mc.getPlayer(playerName);
        if (!player) return false;
        
        const balance = this.getBalance(player);
        if (balance < amount) return false;
        
        return this.reduceBalance(player, amount);
    },

    // 显示金钱信息
    displayMoneyInfo(pl, target, isSelf = true) {
        if (!pl || !target) return "信息获取失败";
        
        const prefix = isSelf ? "你的" : `玩家 ${target.realName} 的`;
        const money = this.getBalance(target);
        const coinName = lang.get("CoinName");
        
        pl.sendText(INFO_PREFIX + `${prefix}当前${coinName}为：${money}`);
        return `${prefix}${coinName}为: ${money}`;
    },

    // 添加金钱历史记录
    addMoneyHistory(playerName, recordText) {
        try {
            let historyData = MoneyHistory.get(playerName) || {};
            const key = `${system.getTimeStr()}§${Utils.getRandomLetter()}`;
            historyData[key] = recordText;

            const keys = Object.keys(historyData);
            const maxRecords = 50;

            if (keys.length > maxRecords) {
                const keysToDelete = keys.length - maxRecords;
                for (let i = 0; i < keysToDelete; i++) {
                    delete historyData[keys[i]];
                }
            }
            
            MoneyHistory.set(playerName, historyData);
        } catch (e) {
            logger.error("添加金钱历史失败: " + e.message);
        }
    }
};

// ============================================================================
// 红包数据管理
// ============================================================================
class RedpacketManager {
    constructor() {
        this.data = this.initData();
    }

    initData() {
        const defaultData = { nextId: 1, packets: {} };
        
        try {
            const existingData = file.readFrom(PATHS.REDPACKET_DATA);
            if (existingData) {
                return JSON.parse(existingData);
            }
        } catch (e) {
            logger.error("读取红包数据失败，使用默认数据:", e);
        }
        return defaultData;
    }

    get(key) {
        const keys = key.split('.');
        let value = this.data;
        
        for (const k of keys) {
            if (value === undefined || value === null) return undefined;
            value = value[k];
        }
        return value;
    }

    set(key, value) {
        const keys = key.split('.');
        let obj = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (obj[k] === undefined || typeof obj[k] !== 'object') {
                obj[k] = {};
            }
            obj = obj[k];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.save();
    }

    delete(key) {
        const keys = key.split('.');
        let obj = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (obj[k] === undefined || typeof obj[k] !== 'object') return;
            obj = obj[k];
        }
        
        delete obj[keys[keys.length - 1]];
        this.save();
    }

    save() {
        try {
            file.writeTo(PATHS.REDPACKET_DATA, JSON.stringify(this.data, null, 2));
        } catch (e) {
            logger.error("保存红包数据失败:", e);
        }
    }
}

let redpacketData;

// ============================================================================
// 异步传送系统
// ============================================================================
class AsyncTeleportSystem {
    static generateRandomCoordinate() {
        const config = conf.get("RTP");
        const maxRadius = config.maxRadius || 5000;
        const minRadius = config.minRadius || 100;
        
        const angle = Math.random() * 2 * Math.PI;
        const minRadiusSquared = minRadius * minRadius;
        const maxRadiusSquared = maxRadius * maxRadius;
        const radiusSquared = minRadiusSquared + Math.random() * (maxRadiusSquared - minRadiusSquared);
        const radius = Math.sqrt(radiusSquared);
        
        return {
            x: Math.floor(radius * Math.cos(angle)),
            z: Math.floor(radius * Math.sin(angle))
        };
    }

    static isCoordinateValid(x, z) {
        const config = conf.get("RTP");
        const maxRadius = config.maxRadius || 5000;
        const minRadius = config.minRadius || 100;
        
        const distance = Math.sqrt(x * x + z * z);
        return distance >= minRadius && distance <= maxRadius;
    }

    static getSurfaceHeight(x, z, dimension) {
        const startY = dimension === 1 ? 120 : 319;
        const endY = dimension === 1 ? 30 : -60;

        for (let y = startY; y >= endY; y--) {
            try {
                const block = mc.getBlock(x, y, z, dimension);
                if (block && block.type !== "minecraft:air" && !block.isLiquid()) {
                    const up1 = mc.getBlock(x, y + 1, z, dimension);
                    const up2 = mc.getBlock(x, y + 2, z, dimension);
                    
                    if (up1 && up1.type === "minecraft:air" && up2 && up2.type === "minecraft:air") {
                        return y + 1;
                    }
                }
            } catch (error) {
                continue;
            }
        }
        return 70;
    }

    static isLocationSafe(x, y, z, dimension) {
        try {
            const feetBlock = mc.getBlock(x, y, z, dimension);
            const headBlock = mc.getBlock(x, y + 1, z, dimension);
            const groundBlock = mc.getBlock(x, y - 1, z, dimension);
            
            if (!feetBlock || !headBlock || !groundBlock) return false;

            const dangerousBlocks = [
                "minecraft:air", "minecraft:lava", "minecraft:water",
                "minecraft:flowing_lava", "minecraft:flowing_water",
                "minecraft:cactus", "minecraft:fire", "minecraft:void_air"
            ];
            
            return feetBlock.type === "minecraft:air" &&
                   headBlock.type === "minecraft:air" &&
                   !dangerousBlocks.includes(groundBlock.type);
        } catch (error) {
            return false;
        }
    }

    static async findSafeLocationAsync(centerX, centerZ, dimension, maxAttempts = 25) {
        return new Promise((resolve) => {
            let attempt = 0;
            
            const checkLocation = () => {
                if (attempt >= maxAttempts) {
                    resolve(null);
                    return;
                }

                const searchRadius = 50;
                const offsetX = Math.floor(Math.random() * searchRadius * 2) - searchRadius;
                const offsetZ = Math.floor(Math.random() * searchRadius * 2) - searchRadius;
                
                const x = centerX + offsetX;
                const z = centerZ + offsetZ;

                try {
                    const y = this.getSurfaceHeight(x, z, dimension);
                    
                    if (this.isLocationSafe(x, y, z, dimension)) {
                        resolve({ x, y, z, dimid: dimension });
                        return;
                    }
                } catch (error) {
                    // 继续下一次尝试
                }

                attempt++;
                setTimeout(checkLocation, 20);
            };

            checkLocation();
        });
    }

    static async performRTPAnimationAsync(player, x, z, y) {
        return new Promise((resolve) => {
            if (conf.get("RTP").Animation == 1) {
                player.sendText(INFO_PREFIX + lang.get("rtp.search.chunks"));
                mc.runcmdEx(`effect "${player.realName}" resistance 30 255 true`);
                
                setTimeout(() => {
                    mc.runcmdEx(`camera "${player.realName}" fade time 0.1 10 0.1 color 0 0 0`);
                }, 900);

                setTimeout(() => {
                    player.teleport(x, 500, z, player.pos.dimid);
                }, 3050);
                
                setTimeout(() => {
                    mc.runcmdEx(`camera "${player.realName}" clear`);
                    resolve();
                }, 6900);
            } else {
                player.teleport(x, 500, z, player.pos.dimid);
                player.sendText(INFO_PREFIX + lang.get("rtp.search.chunks"));
                mc.runcmdEx(`effect "${player.realName}" resistance 15 255 true`);
                resolve();
            }
        });
    }

    static async performRTPAsync(player) {
        const config = conf.get("RTP");
        const cost = config.cost || 0;
        const cooldown = config.cooldown || 0;
        const maxRadius = config.maxRadius || 5000;
        const minRadius = config.minRadius || 100;
        
        try {
            // 冷却检查
            if (RuntimeState.cooltime.has(player.realName) && 
                RuntimeState.cooltime.get(player.realName) > 0) {
                player.sendText(INFO_PREFIX + `§c传送冷却中，剩余时间：${RuntimeState.cooltime.get(player.realName)}秒`);
                return false;
            }

            // 金币检查
            if (cost > 0) {
                const balance = EconomyUtils.getBalance(player);
                if (balance < cost) {
                    player.sendText(INFO_PREFIX + `§c需要 ${cost}${lang.get("CoinName")} 才能传送！`);
                    return false;
                }
            }

            player.sendText(INFO_PREFIX + lang.get("rtp.search.chunks"));
            player.sendText(INFO_PREFIX + `§7传送范围：§f${minRadius} - ${maxRadius} 格`);

            // 设置冷却
            if (cooldown > 0) {
                RuntimeState.cooltime.set(player.realName, cooldown);
            }

            // 扣除费用
            if (cost > 0) {
                EconomyUtils.reduceBalance(player, cost);
                player.sendText(INFO_PREFIX + `§e花费 ${cost}${lang.get("CoinName")}`);
            }

            // 尝试找到合适的坐标
            let safeLocation = null;
            let coordinateAttempts = 0;
            const maxCoordinateAttempts = 3;

            while (!safeLocation && coordinateAttempts < maxCoordinateAttempts) {
                coordinateAttempts++;
                
                const { x, z } = this.generateRandomCoordinate();
                
                if (!this.isCoordinateValid(x, z)) continue;
                
                const distance = Math.floor(Math.sqrt(x * x + z * z));
                player.sendText(`§7尝试第 ${coordinateAttempts} 次：坐标 X:${x}, Z:${z} (距离出生点: ${distance}格)`);

                const estimatedY = this.getSurfaceHeight(x, z, player.pos.dimid);
                await this.performRTPAnimationAsync(player, x, z, estimatedY);
                await new Promise(resolve => setTimeout(resolve, 1000));

                safeLocation = await this.findSafeLocationAsync(x, z, player.pos.dimid, 25);
                
                if (!safeLocation) {
                    player.sendText(`§c坐标 (${x}, ${z}) 附近未找到安全位置，尝试新坐标...`);
                    if (conf.get("RTP").Animation == 1) {
                        setTimeout(() => {
                            mc.runcmdEx(`camera "${player.realName}" clear`);
                        }, 1000);
                    }
                }
            }

            if (safeLocation) {
                const finalDistance = Math.floor(Math.sqrt(safeLocation.x * safeLocation.x + safeLocation.z * safeLocation.z));
                player.teleport(safeLocation.x, safeLocation.y, safeLocation.z, safeLocation.dimid);
                player.sendText(INFO_PREFIX + `§a传送成功！位置: ${safeLocation.x}, ${safeLocation.y}, ${safeLocation.z}`);
                player.sendText(INFO_PREFIX + `§e距离出生点: §f${finalDistance} 格`);

                setTimeout(() => {
                    try {
                        mc.runcmdEx("playsound random.levelup " + player.realName);
                    } catch (e) {}
                }, 500);

                return true;
            } else {
                player.sendText(INFO_PREFIX + lang.get("rtp.search.chunks2"));
                const fallbackResult = await this.fallbackTeleport(player);
                
                if (!fallbackResult) {
                    // 退还费用和重置冷却
                    if (cost > 0) {
                        EconomyUtils.addBalance(player, cost);
                        player.sendText(INFO_PREFIX + `§a已退还 ${cost}${lang.get("CoinName")}`);
                    }
                    
                    if (cooldown > 0) {
                        RuntimeState.cooltime.delete(player.realName);
                    }
                    
                    return false;
                }
                
                return true;
            }

        } catch (error) {
            logger.error(`RTP传送失败: ${error.message}`);
            player.sendText(INFO_PREFIX + lang.get("rtp.error"));
            
            if (conf.get("RTP").Animation == 1) {
                try {
                    mc.runcmdEx(`camera "${player.realName}" clear`);
                } catch (e) {}
            }
            
            return false;
        }
    }

    static async fallbackTeleport(player) {
        try {
            const { x, z } = this.generateRandomCoordinate();
            const y = 100;
            
            player.teleport(x, y, z, player.pos.dimid);
            player.sendText(INFO_PREFIX + lang.get("rtp.tp.success2"));
            player.sendText(`§7坐标: X:${x}, Y:${y}, Z:${z}`);
            
            setTimeout(() => {
                try {
                    mc.runcmdEx(`effect "${player.realName}" slow_falling 10 1`);
                } catch (e) {}
            }, 100);

            return true;
        } catch (error) {
            logger.error(`备用传送失败: ${error.message}`);
            return false;
        }
    }
}

// ============================================================================
// 模块初始化
// ============================================================================

/**
 * 初始化数据文件
 */
function initDataFiles() {
    try {
        // 确保目录存在
        const dirs = [
            PATHS.DATA,
            PATHS.DATA + "Money/",
            PATHS.DATA + "NoticeSettingsData/",
            PATHS.DATA + "PVPSettingsData/",
            PATHS.DATA + "RTPData/",
            PATHS.DATA + "TrSeverData/",
            PATHS.DATA + "TpaSettingsData/",
            PATHS.DATA + "Redpacketdata/"
        ];
        
        dirs.forEach(dir => {
            if (!file.exists(dir)) {
                file.mkdir(dir);
            }
        });

        // 初始化配置文件
        lang = new JsonConfigFile(PATHS.LANG_FILE, JSON.stringify(DEFAULT_LANG));
        conf = new JsonConfigFile(PATHS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        homedata = new JsonConfigFile(PATHS.HOME_DATA, "{}");
        rtpdata = new JsonConfigFile(PATHS.RTP_DATA, "{}");
        warpdata = new JsonConfigFile(PATHS.WARP_DATA, "{}");
        noticeconf = new JsonConfigFile(PATHS.NOTICE_DATA, "{}");
        pvpConfig = new JsonConfigFile(PATHS.PVP_DATA, "{}");
        MoneyHistory = new JsonConfigFile(PATHS.MONEY_HISTORY, "{}");
        moneyranking = new JsonConfigFile(PATHS.MONEY_RANKING, "{}");
        offlineMoney = new JsonConfigFile(PATHS.OFFLINE_MONEY, "{}");
        tpacfg = new JsonConfigFile(PATHS.TPA_DATA, "{}");
        
        const defaultServerConfig = JSON.stringify({
            servers: [{ server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }]
        });
        servertp = new JsonConfigFile(PATHS.SERVER_DATA, defaultServerConfig);

        // 初始化红包数据
        redpacketData = new RedpacketManager();

        // 加载PAPI
        try {
            const papiModule = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS');
            PAPI = papiModule.PAPI;
        } catch (e) {
            logger.warn("PAPI加载失败，部分功能可能不可用: " + e.message);
        }

        return true;
    } catch (e) {
        logger.error("初始化数据文件失败: " + e.message);
        return false;
    }
}

/**
 * 初始化PVP模块
 */
function initPvpModule() {
    if (!conf.get("PVPEnabled")) return;

    const pvp = mc.newCommand("pvp", "设置是否 PVP。", PermType.Any);
    pvp.optional("bool", ParamType.Bool);
    pvp.overload(["bool"]);
    pvp.setCallback((_cmd, ori, out, res) => {
        const player = ori.player;
        if (!player) return;
        
        const playerName = player.realName;
        const currentState = pvpConfig.get(playerName) || false;

        if (!conf.get("PVPEnabled")) {
            player.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        if (res.bool === undefined) {
            const newState = !currentState;
            pvpConfig.set(playerName, newState);
            out.success(INFO_PREFIX + (newState ? lang.get("pvp.is.on") : lang.get("pvp.is.off")));
        } else {
            pvpConfig.set(playerName, res.bool);
            out.success(INFO_PREFIX + (res.bool ? lang.get("pvp.is.on") : lang.get("pvp.is.off")));
        }
    });
    pvp.setup();

    // PVP伤害监听
    mc.listen("onMobHurt", (mob, source) => {
        if (!conf.get("PVPEnabled")) return;
        if (!source || !source.isPlayer() || !mob.isPlayer()) return;
        
        const attacker = source.toPlayer();
        const victim = mob.toPlayer();
        
        const attackerPVP = pvpConfig.get(attacker.realName) || false;
        const victimPVP = pvpConfig.get(victim.realName) || false;
        
        if (!attackerPVP) {
            attacker.tell(lang.get("your.pvp.isoff"), 4);
            mob.stopFire();
            return false;
        }
        
        if (!victimPVP) {
            attacker.tell(lang.get("then.pvp.isoff"), 4);
            mob.stopFire();
            return false;
        }
    });
}

/**
 * 初始化灵魂出窍模块
 */
function initFcamModule() {
    const cmd = mc.newCommand("fcam", "灵魂出窍", PermType.Any);
    cmd.overload([]);

    cmd.setCallback((_cmd, ori, out, _res) => {
        const pl = ori.player;
        if (!pl) {
            out.error(INFO_PREFIX + lang.get("fc.error"));
            return;
        }

        const plname = pl.realName;
        const plpos = ori.pos;
        const fcamConfig = conf.get("Fcam") || {};
        const timeout = fcamConfig.TimeOut || 0;
        const FcamCost = fcamConfig.CostMoney || 0;

        if (!fcamConfig.EnableModule) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        if (pl.isOP()) {
            out.error(INFO_PREFIX + lang.get("fc.error2"));
            return;
        }

        // 退出灵魂出窍模式
        if (pl.gameMode == 6) {
            cleanupFcamBossBar(plname);

            try { 
                pl.setGameMode(0); 
            } catch (e) {
                logger.error("FCAM: setGameMode 恢复失败: " + e);
            }

            try { 
                mc.runcmdEx(`tp "${plname}" "${plname}_sp"`); 
            } catch (e) {
                logger.error("FCAM: TP 回原位失败: " + e);
            }

            const spl = mc.getPlayer(plname + "_sp");
            if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                try { 
                    spl.simulateDisconnect(); 
                } catch (e) {
                    logger.error("FCAM: simulateDisconnect 失败: " + e);
                }
            }

            out.success(INFO_PREFIX + lang.get("fc.success.quit"));
            return;
        }

        // 进入灵魂出窍模式
        if (!EconomyUtils.checkAndDeduct(plname, FcamCost)) {
            pl.tell(INFO_PREFIX + lang.get("money.no.enough"));
            return;
        }

        mc.spawnSimulatedPlayer(plname + "_sp", plpos);
        mc.runcmdEx(`gamemode spectator "${plname}_sp"`);
        pl.setGameMode(6);

        out.success(INFO_PREFIX + lang.get("fc.success.getin").replace("${Fcam}", FcamCost));

        if (timeout > 0) {
            startFcamBossBar(pl, plname, timeout);
        }
    });

    cmd.setup();

    function startFcamBossBar(pl, plname, timeout) {
        let remain = timeout;
        const bossId = Number(`10${plname.length}${Date.now()}`);

        pl.setBossBar(bossId, `§e灵魂出窍剩余 §c${remain} §e秒`, 100, 3);

        RuntimeState.fcamBossBars.set(plname, {
            bossId: bossId,
            timer: null,
            remain: remain,
            totalTime: timeout
        });

        const timer = setInterval(() => {
            const data = RuntimeState.fcamBossBars.get(plname);
            if (!data) {
                clearInterval(timer);
                return;
            }

            data.remain--;
            
            const currentPlayer = mc.getPlayer(plname);
            if (!currentPlayer || currentPlayer.gameMode !== 6) {
                cleanupFcamBossBar(plname);
                return;
            }

            if (data.remain <= 0) {
                cleanupFcamBossBar(plname);
                
                try { 
                    currentPlayer.setGameMode(0); 
                    mc.runcmdEx(`tp "${plname}" "${plname}_sp"`);
                    
                    const spl = mc.getPlayer(plname + "_sp");
                    if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                        spl.simulateDisconnect();
                    }
                    
                    currentPlayer.tell(INFO_PREFIX + "§c灵魂出窍时间已到，已自动退出！");
                } catch (e) {
                    logger.error("FCAM: 自动退出失败: " + e);
                }
                return;
            }

            const progress = (data.remain / data.totalTime) * 100;
            let color = 3;
            if (data.remain <= 10) color = 4;
            if (data.remain <= 5) color = 2;

            try {
                currentPlayer.setBossBar(
                    data.bossId,
                    `§e灵魂出窍剩余 §c${data.remain} §e秒`,
                    progress,
                    color
                );
            } catch (e) {
                logger.error("FCAM: 更新 BossBar 失败: " + e);
                cleanupFcamBossBar(plname);
            }
        }, 1000);

        RuntimeState.fcamBossBars.get(plname).timer = timer;
    }

    function cleanupFcamBossBar(plname) {
        const data = RuntimeState.fcamBossBars.get(plname);
        if (data) {
            if (data.timer) clearInterval(data.timer);
            
            const player = mc.getPlayer(plname);
            if (player && data.bossId) {
                try {
                    player.removeBossBar(data.bossId);
                } catch (e) {}
            }
            
            RuntimeState.fcamBossBars.delete(plname);
        }
    }

    // 玩家退出时清理
    mc.listen("onLeft", (player) => {
        const plname = player.realName;
        cleanupFcamBossBar(plname);
        
        const spl = mc.getPlayer(plname + "_sp");
        if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
            spl.simulateDisconnect();
        }
    });
}

/**
 * 初始化掉落物清理模块
 */
function initCleanModule() {
    function broadcastCleanCountdown(sec) {
        const warns = conf.get("AutoCleanItemWarnTimes") || [];
        if (warns.includes(sec)) {
            const msg = INFO_PREFIX + lang.get("clean.msg").replace("${sec}", sec);
            mc.getOnlinePlayers().forEach(pl => {
                pl.sendToast(INFO_PREFIX, lang.get("clean.msg").replace("${sec}", sec));
            });
            mc.broadcast(msg);
        }
    }

    async function runClean() {
        if (RuntimeState.cleaning) return;
        RuntimeState.cleaning = true;

        const batchSize = conf.get("AutoCleanItemBatch") || 200;
        const entities = mc.getAllEntities().filter(e => e.isItemEntity());
        const total = entities.length;

        if (total === 0) {
            RuntimeState.cleaning = false;
            return;
        }

        mc.broadcast(INFO_PREFIX + lang.get("clean.startto.clean").replace("${total}", total));

        let index = 0;
        function cleanBatch() {
            const end = Math.min(index + batchSize, total);
            for (; index < end; index++) {
                if (entities[index]) entities[index].despawn();
            }

            if (index < total) {
                setTimeout(cleanBatch, 2);
            } else {
                mc.broadcast(INFO_PREFIX + lang.get("clean.ok").replace("${total}", total));
                RuntimeState.cleaning = false;
            }
        }
        cleanBatch();
    }

    function startCleanTask() {
        let timeLeft = conf.get("AutoCleanItemInterval") || 60;

        const timer = setInterval(() => {
            timeLeft--;
            broadcastCleanCountdown(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                runClean();
                setTimeout(startCleanTask, 1000);
            }
        }, 1000);
    }

    // 自动触发清理
    mc.listen("onTick", () => {
        const trigger = conf.get("AutoCleanItemTriggerAmount") || 0;
        if (trigger > 0 && !RuntimeState.cleaning) {
            const count = mc.getAllEntities().filter(e => e.isItemEntity()).length;
            if (count >= trigger) {
                mc.broadcast(INFO_PREFIX + lang.get("clean.item.warn").replace("${count}", count));
                runClean();
            }
        }
    });

    // OP手动命令
    const cleanCmd = mc.newCommand("cleanitem", "手动清理掉落物", PermType.GameMasters);
    cleanCmd.overload([]);
    cleanCmd.setCallback(() => runClean());
    cleanCmd.setup();

    if (conf.get("AutoCleanItemInterval") > 0) {
        startCleanTask();
    }
}

/**
 * 初始化维护模块
 */
function initMaintenanceModule() {
    const whConfig = conf.get("wh") || { EnableModule: true, status: 0 };
    RuntimeState.maintenanceMode = whConfig.status === 1;

    const whcmd = mc.newCommand("wh", "维护模式", PermType.GameMasters);
    whcmd.overload([]);
    whcmd.setCallback((cmd, ori, out, res) => {
        const currentConfig = conf.get("wh") || { EnableModule: true, status: 0 };
        if (!currentConfig.EnableModule) {
            out.error("维护模式模块未启用");
            return;
        }
        
        RuntimeState.maintenanceMode = !RuntimeState.maintenanceMode;
        currentConfig.status = RuntimeState.maintenanceMode ? 1 : 0;
        conf.set("wh", currentConfig);
        
        out.success(`维护模式已${RuntimeState.maintenanceMode ? "开启" : "关闭"}`);

        if (RuntimeState.maintenanceMode) {
            mc.getOnlinePlayers().forEach((player) => {
                if (player.isSimulatedPlayer() || player.isOP()) return;
                player.kick(lang.get("weihu.msg"));
            });
        }
    });
    whcmd.setup();

    mc.listen("onPreJoin", (pl) => {
        const currentConfig = conf.get("wh") || { EnableModule: true, status: 0 };
        if (!currentConfig.EnableModule) return;
        
        if (pl.isSimulatedPlayer() || pl.isOP()) return;
        if (RuntimeState.maintenanceMode) {
            pl.kick(lang.get("weihu.msg"));
        }
    });
}

// ============================================================================
// GUI模块
// ============================================================================

/**
 * 金钱排行榜
 */
function showRanking(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    if (conf.get("RankingModel") == 1) {
        const datas = JSON.parse(moneyranking.read());
        let lst = Object.keys(datas).map(name => ({ name, money: datas[name] }));
        
        if (lst.length === 0) {
            pl.tell(INFO_PREFIX + lang.get("no.ranking.data"));
            return;
        }

        lst.sort((a, b) => b.money - a.money);
        const ranking = lst.slice(0, 50);
        const total = ranking.reduce((sum, curr) => sum + curr.money, 0);

        const form = mc.newSimpleForm()
            .setTitle(`§l§6■ 财富排行榜 ■ §r§8[前${ranking.length}名]`)
            .setContent(
                `§7服务器总财富: §6${Utils.formatMoney(total)}\n` +
                `§7统计时间: §f${new Date().toLocaleTimeString()}\n` +
                `§6点击任何按钮返回经济系统主菜单\n` +
                `§8═════════════════════`
            );

        ranking.forEach((v, index) => {
            const rank = index + 1;
            const percentage = total > 0 ? (v.money / total * 100).toFixed(1) : 0;
            
            form.addButton(
                `${Utils.getRankPrefix(rank)} §l${rank}. §r${v.name}\n` +
                `§l§c├ 持有: ${Utils.formatMoney(v.money)}` +
                ` §r§l占比全服: §a${percentage} %`
            );
        });

        pl.sendForm(form, (pl, id) => {
            if (id !== null) {
                pl.tell(INFO_PREFIX + lang.get("money.callback.menu"));
            }
            pl.runcmd("moneygui");
        });
    } else {
        const form = mc.newSimpleForm();
        const rawData = moneyranking.read();
        const data = rawData ? JSON.parse(rawData) : {};
        const keys = Object.keys(data);
        
        if (keys.length === 0) {
            pl.tell(INFO_PREFIX + lang.get("no.ranking.data"));
            return;
        }

        let lst = keys.map(v => [v, data[v]]);
        lst.sort((a, b) => b[1] - a[1]);
        const ranking = lst.slice(0, 50);

        let str = ranking.map(v => `${v[0]}: ${v[1]}`).join('\n');

        form.setTitle(lang.get("ranking.list"));
        form.setContent(str);

        pl.sendForm(form, (pl, id) => {
            if (id == null) pl.runcmd("moneygui");
        });
    }
}

/**
 * 玩家金钱GUI
 */
function MoneyGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("CoinName"));
    fm.addButton(lang.get("money.query") + lang.get("CoinName"), "textures/ui/MCoin");
    fm.addButton(lang.get("money.transfer") + lang.get("CoinName"), "textures/ui/trade_icon");
    fm.addButton(lang.get("moeny.view") + lang.get("CoinName") + lang.get("money.history"), "textures/ui/book_addtextpage_default");
    fm.addButton(lang.get("CoinName") + lang.get("money.player.list"), "textures/ui/icon_book_writable");
    
    if (conf.get("RedPacket").EnabledModule) {
        fm.addButton(lang.get("rp.menu.1"), "textures/ui/gift_square");
    }

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));
        
        switch (id) {
            case 0:
                const queryForm = mc.newSimpleForm();
                queryForm.setTitle(lang.get("money.query") + lang.get("CoinName"));
                const content = EconomyUtils.displayMoneyInfo(pl, pl);
                queryForm.setContent(content);
                pl.sendForm(queryForm, () => pl.runcmd("moneygui"));
                break;
            case 1:
                MoneyTransferGui(pl.realName);
                break;
            case 2:
                showMoneyHistory(pl);
                break;
            case 3:
                showRanking(pl.realName);
                break;
            case 4:
                redpacketGui(pl.realName);
                break;
        }
    });
}

/**
 * 显示金钱历史
 */
function showMoneyHistory(pl) {
    const historyData = MoneyHistory.get(pl.realName) || {};
    const jsonStr = JSON.stringify(historyData);
    const items = jsonStr.slice(1, jsonStr.length - 1).split(',');
    
    let str = "";
    let count = 0;
    for (let i = items.length - 1; i >= 0 && count < 50; i--, count++) {
        str += items[i] + "\n";
    }

    const fm = mc.newSimpleForm();
    fm.setTitle("你的" + lang.get("CoinName") + lang.get("money.history"));
    fm.setContent(str || "暂无记录");
    pl.sendForm(fm, () => pl.runcmd("moneygui"));
}

/**
 * 金钱转账GUI
 */
function MoneyTransferGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.transfer") + lang.get("CoinName"));
    
    const balance = EconomyUtils.getBalance(pl);
    fm.addLabel(`当前税率:${conf.get("PayTaxRate")}(百分号)\n你的${lang.get("CoinName")}为：${balance}`);
    
    const playerList = mc.getOnlinePlayers()
        .filter(p => !p.isSimulatedPlayer())
        .map(p => p.realName);
    
    fm.addDropdown(lang.get("choose") + lang.get("one") + lang.get("player"), playerList);
    fm.addInput(lang.get("money.tr.amount"));
    fm.addInput(lang.get("money.tr.beizhu"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");

        const target = mc.getPlayer(playerList[data[1]]);
        if (!target || target.isSimulatedPlayer()) {
            return pl.tell(INFO_PREFIX + lang.get("money.tr.error1"));
        }
        if (pl.realName === target.realName) {
            return pl.tell(INFO_PREFIX + lang.get("money.tr.error2"));
        }

        let amount = data[2];
        if (!amount) return pl.tell(INFO_PREFIX + lang.get("money.tr.noinput"));
        
        if (amount === "all") {
            amount = EconomyUtils.getBalance(pl);
        }
        
        if (!/^\d+$/.test(amount)) return pl.tell(INFO_PREFIX + lang.get("key.not.number"));
        amount = parseInt(amount);
        
        if (amount <= 0) return pl.tell(INFO_PREFIX + lang.get("money.must.bigger0"));
        
        const plBalance = EconomyUtils.getBalance(pl);
        if (plBalance < amount) return pl.tell(INFO_PREFIX + lang.get("money.no.enough"));

        const tax = Math.floor(amount * conf.get("PayTaxRate") / 100);
        const realAmount = amount - tax;
        
        if (realAmount <= 0) return pl.tell(INFO_PREFIX + lang.get("money.cannot.smaller0"));

        // 执行转账
        EconomyUtils.reduceBalance(pl, amount);
        EconomyUtils.addBalance(target, realAmount);

        // 记录历史
        const coinName = lang.get("CoinName");
        EconomyUtils.addMoneyHistory(pl.realName, 
            `${lang.get("money.transfer")}${coinName}给${target.realName}，数量：${amount}，实际到账：${realAmount}，手续费：${tax}`);
        EconomyUtils.addMoneyHistory(target.realName, 
            `收到${pl.realName}转账${coinName}，数量：${amount}，实际到账：${realAmount}，手续费：${tax}`);

        pl.sendText(INFO_PREFIX + `转账成功，实际到账：${realAmount}，手续费：${tax}`);
        target.sendText(INFO_PREFIX + 
            `${pl.realName}${lang.get("money.transfer")}${coinName}给你，数量：${amount}，实际到账：${realAmount}，手续费：${tax}，备注：${data[3] || "无"}`);
    });
}

/**
 * OP金钱管理GUI
 */
function OPMoneyGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle("(OP)" + lang.get("CoinName"));
    fm.addButton(lang.get("money.op.add") + lang.get("CoinName"), "textures/ui/icon_best3");
    fm.addButton(lang.get("money.op.remove") + lang.get("CoinName"), "textures/ui/redX1");
    fm.addButton(lang.get("money.op.set") + lang.get("CoinName"), "textures/ui/gear");
    fm.addButton(lang.get("money.op.look") + lang.get("CoinName"), "textures/ui/MCoin");
    fm.addButton("查看玩家的" + lang.get("CoinName") + "历史记录", "textures/ui/book_addtextpage_default");
    fm.addButton("全服" + lang.get("CoinName") + "排行榜", "textures/ui/icon_book_writable");
    fm.addButton("使用玩家的金钱菜单", "textures/ui/icon_multiplayer");
    
    if (conf.get("RedPacket").EnabledModule) {
        fm.addButton(lang.get("rp.menu.1"), "textures/ui/gift_square");
    }

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));
        
        switch (id) {
            case 0: MoneyAddGui(pl.realName); break;
            case 1: MoneyReduceGui(pl.realName); break;
            case 2: MoneySetGui(pl.realName); break;
            case 3: MoneyGetGui(pl.realName); break;
            case 4: MoneyHistoryGui(pl.realName); break;
            case 5: showRanking(pl.realName); break;
            case 6: MoneyGui(pl.realName); break;
            case 7: redpacketGui(pl.realName); break;
        }
    });
}

/**
 * OP增加金钱GUI
 */
function MoneyAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.op.add") + lang.get("CoinName"));
    
    const playerList = mc.getOnlinePlayers().map(p => p.realName);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerList);
    fm.addInput(lang.get("money.add.number") + lang.get("CoinName"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");
        if (!data[1]) return pl.tell(INFO_PREFIX + lang.get("pls.input.number"));

        const target = mc.getPlayer(playerList[data[0]]);
        if (!target) return pl.tell(INFO_PREFIX + lang.get("money.tr.noonline"));

        const amount = parseInt(data[1]);
        EconomyUtils.addBalance(target, amount);
        EconomyUtils.addMoneyHistory(target.realName, `${lang.get("CoinName")}增加${amount}`);

        pl.sendText(INFO_PREFIX + `已成功给${target.realName}添加${amount} ${lang.get("CoinName")}`);
        pl.sendText(INFO_PREFIX + `玩家当前${lang.get("CoinName")}为：${EconomyUtils.getBalance(target)}`);
    });
}

/**
 * OP减少金钱GUI
 */
function MoneyReduceGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.op.remove") + lang.get("CoinName"));
    
    const playerList = mc.getOnlinePlayers().map(p => p.realName);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerList);
    fm.addInput(lang.get("money.decrease.number") + lang.get("CoinName"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");
        if (!data[1]) return pl.tell(INFO_PREFIX + lang.get("money.del.number"));

        const target = mc.getPlayer(playerList[data[0]]);
        if (!target) return pl.tell(INFO_PREFIX + lang.get("money.tr.noonline"));

        const amount = parseInt(data[1]);
        EconomyUtils.reduceBalance(target, amount);
        EconomyUtils.addMoneyHistory(target.realName, `${lang.get("CoinName")}减少${amount}`);

        pl.sendText(INFO_PREFIX + `已成功给${target.realName}减少${amount} ${lang.get("CoinName")}`);
        pl.sendText(INFO_PREFIX + `玩家当前${lang.get("CoinName")}为：${EconomyUtils.getBalance(target)}`);
    });
}

/**
 * OP设置金钱GUI
 */
function MoneySetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.op.set") + lang.get("CoinName"));
    
    const playerList = mc.getOnlinePlayers().map(p => p.realName);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerList);
    fm.addInput(lang.get("moeny.set.number") + lang.get("CoinName"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");
        if (!data[1]) return pl.tell(INFO_PREFIX + lang.get("moeny.setting.number"));

        const target = mc.getPlayer(playerList[data[0]]);
        if (!target) return pl.tell(INFO_PREFIX + lang.get("money.tr.noonline"));

        const amount = parseInt(data[1]);
        EconomyUtils.setBalance(target, amount);
        EconomyUtils.addMoneyHistory(target.realName, `${lang.get("CoinName")}设置为${amount}`);

        pl.sendText(INFO_PREFIX + `已成功将${target.realName}的${lang.get("CoinName")}设置为${amount}`);
    });
}

/**
 * OP查看金钱GUI
 */
function MoneyGetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.op.look") + lang.get("CoinName"));
    
    const playerList = mc.getOnlinePlayers().map(p => p.realName);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerList);

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");

        const target = mc.getPlayer(playerList[data[0]]);
        if (!target) return pl.tell(INFO_PREFIX + lang.get("money.tr.noonline"));

        EconomyUtils.displayMoneyInfo(pl, target, false);
    });
}

/**
 * OP查看玩家金钱历史GUI
 */
function MoneyHistoryGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle("查看玩家" + lang.get("CoinName") + "历史记录");
    
    const playerList = mc.getOnlinePlayers().map(p => p.realName);
    fm.addDropdown(lang.get("choose") + lang.get("player"), playerList);

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");

        const target = mc.getPlayer(playerList[data[0]]);
        if (!target) return pl.tell(INFO_PREFIX + lang.get("money.tr.noonline"));

        const historyData = MoneyHistory.get(target.realName) || {};
        const jsonStr = JSON.stringify(historyData);
        const items = jsonStr.slice(1, jsonStr.length - 1).split(',');
        
        pl.sendText(`玩家${target.realName}的${lang.get("CoinName")}${lang.get("money.history")}`);
        let count = 0;
        for (const item of items) {
            if (count >= 50) break;
            pl.sendText(item);
            count++;
        }
    });
}

// ============================================================================
// 红包模块
// ============================================================================

/**
 * 红包主GUI
 */
function redpacketGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("rp.menu.1"));
    fm.addButton(lang.get("rp.send.packet"), "textures/ui/trade_icon");
    fm.addButton(lang.get("rp.open.packet"), "textures/ui/MCoin");
    fm.addButton(lang.get("rp.all.help"), "textures/ui/book_addtextpage_default");

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));
        
        switch (id) {
            case 0:
                showSendRedpacketForm(pl);
                break;
            case 1:
                pl.runcmd("rp list");
                break;
            case 2:
                pl.runcmd("redpackethelp");
                break;
        }
    });
}

/**
 * 发送红包表单
 */
function showSendRedpacketForm(pl) {
    const fm = mc.newCustomForm().setTitle(lang.get("rp.send.packet"));
    fm.addDropdown(lang.get("redpacket.type"), [lang.get("rp.random.packet"), lang.get("rp.average.packet")]);
    fm.addInput(lang.get("rp.send.amount"));
    fm.addInput(lang.get("rp.send.count"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("moneygui");

        const type = data[0];
        let amount = data[2];
        const count = data[1];

        if (!amount) return pl.tell(INFO_PREFIX + lang.get("money.tr.noinput"));
        if (amount === "all") amount = EconomyUtils.getBalance(pl);
        if (!/^\d+$/.test(amount)) return pl.tell(INFO_PREFIX + lang.get("key.not.number"));
        if (parseInt(amount) <= 0) return pl.tell(INFO_PREFIX + lang.get("money.must.bigger0"));
        if (!count || !/^\d+$/.test(count)) return pl.tell(INFO_PREFIX + lang.get("key.not.number"));
        if (parseInt(count) <= 0) return pl.tell(INFO_PREFIX + lang.get("money.must.bigger0"));

        const balance = EconomyUtils.getBalance(pl);
        if (parseInt(amount) > balance) {
            return pl.sendText(lang.get("rp.count.bigger.yourmoney") + lang.get("CoinName"));
        }

        const typeStr = type === 0 ? "" : " average";
        pl.runcmd(`rp send ${count} ${amount}${typeStr}`);
    });
}

/**
 * 处理红包发送
 */
function handleSendRedPacket(pl, amount, count, targetPlayer, message, packetType = "random") {
    if (!conf.get("RedPacket").EnabledModule) {
        pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
        return;
    }

    if (RuntimeState.isSending) {
        pl.tell("§c请勿重复发送红包！");
        return;
    }

    if (typeof amount !== "number" || typeof count !== "number" || count < 1) {
        pl.tell(INFO_PREFIX + "§c用法: /rp send <总金额> <红包个数> [玩家名] [祝福语] [类型]");
        return;
    }

    const config = conf.get("RedPacket");
    
    if (amount < config.minAmount || amount > config.maxAmount) {
        pl.tell(INFO_PREFIX + `§c红包金额必须在${config.minAmount}-${config.maxAmount}之间`);
        return;
    }

    if (count < 1 || count > config.maxCount) {
        pl.tell(INFO_PREFIX + `§c红包个数必须在1-${config.maxCount}之间`);
        return;
    }

    const balance = EconomyUtils.getBalance(pl);
    if (balance < amount) {
        pl.tell(INFO_PREFIX + "§c余额不足，无法发送红包");
        return;
    }

    RuntimeState.isSending = true;
    EconomyUtils.reduceBalance(pl, amount);

    const packetId = redpacketData.get("nextId");
    const packet = {
        id: packetId,
        sender: pl.realName,
        amount: amount,
        count: count,
        remaining: count,
        remainingAmount: amount,
        recipients: [],
        targetType: targetPlayer ? "specific" : "all",
        targetPlayer: targetPlayer || "",
        message: message || `${pl.realName}的红包`,
        packetType: packetType,
        createdAt: Date.now(),
        expireAt: Date.now() + (config.expireTime * 1000)
    };

    redpacketData.set(`packets.${packetId}`, packet);
    redpacketData.set("nextId", packetId + 1);

    const typeName = packetType === "random" ? "拼手气" : "普通";
    
    if (targetPlayer) {
        const target = mc.getPlayer(targetPlayer);
        if (target) {
            target.tell(INFO_PREFIX + `§a你收到来自${pl.realName}的${typeName}红包，输入§e/rp open§a领取`);
        }
        pl.tell(INFO_PREFIX + `§a成功向${targetPlayer}发送${typeName}红包，金额:§e${amount}§a，数量:§e${count}`);
    } else {
        mc.broadcast(INFO_PREFIX + `§a玩家§e${pl.realName}§a
                                                                      发送了${typeName}全服红包，输入§e/rp open§a领取`);
        pl.tell(INFO_PREFIX + `§a成功发送${typeName}全服红包，金额:§e${amount}§a，数量:§e${count}`);
    }

    logger.info(`[红包] 玩家 ${pl.realName} 发送${typeName}红包 #${packetId}, 金额: ${amount}, 数量: ${count}`);
    RuntimeState.isSending = false;
}

/**
 * 处理红包领取
 */
function handleOpenRedPacket(pl) {
    const packets = redpacketData.get("packets") || {};
    const now = Date.now();
    const availablePackets = [];

    for (const id in packets) {
        const packet = packets[id];

        if (packet.expireAt < now) {
            handleExpiredPacket(packet);
            continue;
        }

        const canClaim = 
            packet.remaining > 0 &&
            !packet.recipients.includes(pl.realName) &&
            (packet.targetType === "all" || 
             (packet.targetType === "specific" && 
              packet.targetPlayer.toLowerCase() === pl.realName.toLowerCase()));

        if (canClaim) {
            availablePackets.push(packet);
        }
    }

    if (availablePackets.length === 0) {
        pl.tell(INFO_PREFIX + "§c当前没有可领取的红包");
        return;
    }

    availablePackets.sort((a, b) => a.createdAt - b.createdAt);
    const packet = availablePackets[0];

    let amount;
    if (packet.remaining === 1) {
        amount = packet.remainingAmount;
    } else {
        if (packet.packetType === "random") {
            const maxAmount = Math.min(
                packet.remainingAmount - packet.remaining + 1,
                Math.floor(packet.remainingAmount / packet.remaining * 2)
            );
            amount = Math.floor(Math.random() * maxAmount) + 1;
            amount = Math.max(amount, 1);
        } else {
            amount = Math.floor(packet.remainingAmount / packet.remaining);
            amount = Math.max(amount, 1);
        }
    }

    packet.remaining--;
    packet.remainingAmount -= amount;
    packet.recipients.push(pl.realName);

    redpacketData.set(`packets.${packet.id}`, packet);
    EconomyUtils.addBalance(pl, amount);

    const typeName = packet.packetType === "random" ? "拼手气" : "普通";
    pl.tell(INFO_PREFIX + `§a恭喜你领取到§e${packet.sender}§a的${typeName}红包，获得§e${amount}§a${lang.get("CoinName")}!`);

    const sender = mc.getPlayer(packet.sender);
    if (sender) {
        sender.tell(INFO_PREFIX + `§a玩家§e${pl.realName}§a领取了你的红包，获得§e${amount}§a${lang.get("CoinName")}`);
    }
}

/**
 * 处理过期红包
 */
function handleExpiredPacket(packet) {
    if (packet.remaining <= 0) return;

    logger.info(`[红包] 处理过期红包 #${packet.id}, 剩余金额: ${packet.remainingAmount}`);

    if (packet.remainingAmount > 0) {
        const sender = mc.getPlayer(packet.sender);
        if (sender) {
            EconomyUtils.addBalance(sender, packet.remainingAmount);
            sender.tell(INFO_PREFIX + `§a你的红包#${packet.id}已过期，退还§e${packet.remainingAmount}§a${lang.get("CoinName")}`);
        }
    }

    redpacketData.delete(`packets.${packet.id}`);
}

/**
 * 红包列表
 */
function handleListRedPacket(pl) {
    const packets = redpacketData.get("packets") || {};
    const now = Date.now();
    const form = mc.newSimpleForm()
        .setTitle("§l§6可领取红包")
        .setContent("§7点击查看详情并领取");

    let hasPackets = false;

    for (const id in packets) {
        const packet = packets[id];
        if (packet.expireAt < now || packet.remaining <= 0) continue;
        if (packet.recipients.includes(pl.realName)) continue;
        if (packet.targetType === "specific" && 
            packet.targetPlayer.toLowerCase() !== pl.realName.toLowerCase()) continue;

        const expireIn = Math.ceil((packet.expireAt - now) / 1000);
        const typeName = packet.packetType === "random" ? "§6拼手气" : "§b普通";
        form.addButton(
            `§l${typeName} §e${packet.sender}的红包\n` +
            `§7金额: §f${packet.amount} §7剩余: §a${packet.remaining}/${packet.count}\n` +
            `§7过期: §f${expireIn}秒`
        );
        hasPackets = true;
    }

    if (!hasPackets) {
        form.setContent("§c当前没有可领取的红包");
        form.addButton("§c关闭");
    }

    pl.sendForm(form, (player, id) => {
        if (id !== null && hasPackets) {
            handleOpenRedPacket(pl);
        }
    });
}

/**
 * 红包历史
 */
function handleRedPacketHistory(pl) {
    const packets = redpacketData.get("packets") || {};
    const history = [];

    for (const id in packets) {
        const packet = packets[id];
        if (packet.sender === pl.realName || packet.recipients.includes(pl.realName)) {
            history.push(packet);
        }
    }

    if (history.length === 0) {
        pl.tell(INFO_PREFIX + "§c你还没有红包记录");
        return;
    }

    history.sort((a, b) => b.createdAt - a.createdAt);

    const form = mc.newSimpleForm()
        .setTitle("§l§6红包历史记录")
        .setContent("§7点击查看红包详情");

    history.slice(0, 10).forEach(packet => {
        const isSender = packet.sender === pl.realName;
        const status = packet.remaining > 0 ? "§a进行中" : "§c已结束";
        const typeName = packet.packetType === "random" ? "§6[拼]" : "§b[普]";

        form.addButton(
            `§l${isSender ? "§b[发]" : "§a[收]"} ${typeName} §e${packet.sender}的红包\n` +
            `§7金额: §f${packet.amount} §7状态: ${status}`
        );
    });

    pl.sendForm(form, (player, id) => {
        if (id !== null && history[id]) {
            showRedPacketDetail(pl, history[id]);
        }
    });
}

/**
 * 红包详情
 */
function showRedPacketDetail(pl, packet) {
    const form = mc.newCustomForm().setTitle("§l§6红包详情");

    form.addLabel(`§f发送者: §e${packet.sender}`);
    form.addLabel(`§f目标类型: §e${packet.targetType === "all" ? "全服红包" : "指定红包"}`);
    form.addLabel(`§f红包类型: §e${packet.packetType === "random" ? "拼手气红包" : "普通红包"}`);
    form.addLabel(`§f总金额: §e${packet.amount}${lang.get("CoinName")}`);
    form.addLabel(`§f红包个数: §e${packet.count}`);
    form.addLabel(`§f剩余金额: §e${packet.remainingAmount}${lang.get("CoinName")}`);
    form.addLabel(`§f剩余个数: §e${packet.remaining}`);
    form.addLabel(`§f祝福语: §e${packet.message}`);
    form.addLabel(`§f过期时间: §e${new Date(packet.expireAt).toLocaleTimeString()}`);
    form.addLabel("§f领取记录: " + (packet.recipients.length > 0 ? packet.recipients.join(", ") : "暂无"));

    pl.sendForm(form, () => pl.runcmd("moneygui"));
}

// ============================================================================
// 家园系统
// ============================================================================

/**
 * 家园主菜单
 */
function HomeGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("home.tp.system"));
    fm.addButton(lang.get("home.tp"));
    fm.addButton(lang.get("home.add"));
    fm.addButton(lang.get("home.del"));

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

        switch (id) {
            case 0: TpHome(pl.realName); break;
            case 1: AddHome(pl.realName); break;
            case 2: DelHome(pl.realName); break;
        }
    });
}

/**
 * 传送到家
 */
function TpHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const cost = conf.get("Home").tp || 0;
    const pldata = homedata.get(pl.realName) || {};
    const homes = Object.keys(pldata);

    if (homes.length === 0) {
        pl.tell(INFO_PREFIX + "您还没有设置家！");
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("home.tp"));
    fm.setContent(lang.get("home.tp.choose"));

    homes.forEach(name => {
        const home = pldata[name];
        fm.addButton(`${name}\n坐标：${home.x},${home.y},${home.z} ${DIMENSION_NAMES[home.dimid]}`);
    });

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

        const homeName = homes[id];
        const home = pldata[homeName];

        const confirmForm = mc.newCustomForm();
        confirmForm.setTitle(lang.get("home.tp"));
        confirmForm.addLabel(`确认传送家 ${homeName}？`);
        confirmForm.addLabel(`您的${lang.get("CoinName")}：${EconomyUtils.getBalance(pl)}`);
        confirmForm.addLabel(`传送需要花费${cost}${lang.get("CoinName")}`);
        confirmForm.addLabel(`坐标：${home.x},${home.y},${home.z} ${DIMENSION_NAMES[home.dimid]}`);

        pl.sendForm(confirmForm, (pl, data) => {
            if (data == null) return pl.runcmd("home");

            if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
                return pl.sendText(`传送失败！需要${cost}${lang.get("CoinName")}`);
            }

            pl.teleport(parseFloat(home.x), parseFloat(home.y), parseFloat(home.z), parseInt(home.dimid));
            pl.sendText(`传送家 ${homeName} 成功！`);
        });
    });
}

/**
 * 添加家
 */
function AddHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const cost = conf.get("Home").add || 0;
    const maxHome = conf.get("Home").MaxHome || 10;
    const pldata = homedata.get(pl.realName) || {};

    if (Object.keys(pldata).length >= maxHome) {
        return pl.sendText(`您的家数量已达到上限：${maxHome}!`);
    }

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("home.add"));
    fm.addLabel(`当前坐标：${pl.pos.x.toFixed(1)}, ${pl.pos.y.toFixed(1)}, ${pl.pos.z.toFixed(1)}`);
    fm.addLabel(`您的${lang.get("CoinName")}：${EconomyUtils.getBalance(pl)}`);
    fm.addLabel(`添加花费：${cost}${lang.get("CoinName")}`);
    fm.addInput(lang.get("home.add.input"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("home");
        
        const homeName = data[3];
        if (!homeName) return pl.tell(INFO_PREFIX + lang.get("home.name.noinput"));

        const currentData = homedata.get(pl.realName) || {};
        if (Object.keys(currentData).includes(homeName)) {
            return pl.tell(INFO_PREFIX + lang.get("home.name.repetitive"));
        }

        if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
            return pl.sendText(`添加失败！需要${cost}${lang.get("CoinName")}`);
        }

        currentData[homeName] = {
            x: pl.pos.x.toFixed(1),
            y: pl.pos.y.toFixed(1),
            z: pl.pos.z.toFixed(1),
            dimid: pl.pos.dimid
        };

        homedata.set(pl.realName, currentData);
        pl.sendText(`添加家 ${homeName} 成功！`);
    });
}

/**
 * 删除家
 */
function DelHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const cost = conf.get("Home").del || 0;
    const pldata = homedata.get(pl.realName) || {};
    const homes = Object.keys(pldata);

    if (homes.length === 0) {
        pl.tell(INFO_PREFIX + "您还没有设置家！");
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("home.del"));
    fm.setContent(lang.get("home.del.choose"));

    homes.forEach(name => {
        const home = pldata[name];
        fm.addButton(`${name}\n坐标：${home.x},${home.y},${home.z} ${DIMENSION_NAMES[home.dimid]}`);
    });

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("home");

        const homeName = homes[id];
        const home = pldata[homeName];

        const confirmForm = mc.newCustomForm();
        confirmForm.setTitle(lang.get("home.del"));
        confirmForm.addLabel(`§c§l请问您确认要删除家 ${homeName}？此操作不可撤销！`);
        confirmForm.addLabel(`您的${lang.get("CoinName")}：${EconomyUtils.getBalance(pl)}`);
        confirmForm.addLabel(`删除需要花费${cost}${lang.get("CoinName")}`);

        pl.sendForm(confirmForm, (pl, data) => {
            if (data == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

            if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
                return pl.sendText(`删除失败！需要${cost}${lang.get("CoinName")}`);
            }

            const currentData = homedata.get(pl.realName) || {};
            delete currentData[homeName];
            homedata.set(pl.realName, currentData);
            pl.sendText(`删除家 ${homeName} 成功！`);
        });
    });
}

// ============================================================================
// 公共传送点系统
// ============================================================================

/**
 * 公共传送点主菜单
 */
function WarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const cost = conf.get("Warp") || 0;
    const warps = Object.keys(JSON.parse(warpdata.read()));

    if (warps.length === 0) {
        pl.tell(INFO_PREFIX + "暂无公共传送点！");
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public"));

    warps.forEach(name => {
        const warp = warpdata.get(name);
        fm.addButton(`${name}\n坐标：${warp.x},${warp.y},${warp.z} ${DIMENSION_NAMES[warp.dimid]}`);
    });

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

        const warpName = warps[id];
        const warp = warpdata.get(warpName);

        const confirmForm = mc.newCustomForm();
        confirmForm.setTitle(lang.get("warp.go.to"));
        confirmForm.addLabel(`传送点名称：${warpName}`);
        confirmForm.addLabel(`坐标：${warp.x},${warp.y},${warp.z} ${DIMENSION_NAMES[warp.dimid]}`);
        confirmForm.addLabel(`传送花费：${cost}${lang.get("CoinName")}`);
        confirmForm.addLabel(EconomyUtils.displayMoneyInfo(pl, pl, true));

        pl.sendForm(confirmForm, (pl, data) => {
            if (data == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

            if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
                return pl.tell(INFO_PREFIX + lang.get("money.no.enough"));
            }

            pl.teleport(parseFloat(warp.x), parseFloat(warp.y), parseFloat(warp.z), parseInt(warp.dimid));
            pl.sendText(`已前往传送点 ${warpName}`);
        });
    });
}

/**
 * OP公共传送点管理
 */
function OPWarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public.op"));
    fm.addButton(lang.get("warp.add"));
    fm.addButton(lang.get("warp.del"));
    fm.addButton(lang.get("warp.list"));

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(INFO_PREFIX + lang.get("gui.exit"));

        switch (id) {
            case 0: WarpAddGui(pl.realName); break;
            case 1: WarpDelGui(pl.realName); break;
            case 2: WarpGui(pl.realName); break;
        }
    });
}

/**
 * 添加公共传送点
 */
function WarpAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("warp.add.point"));
    fm.addLabel(lang.get("warp.add.point.xyz"));
    fm.addLabel(`坐标：${pl.pos.x.toFixed(1)},${pl.pos.y.toFixed(1)},${pl.pos.z.toFixed(1)} ${DIMENSION_NAMES[pl.pos.dimid]}`);
    fm.addInput(lang.get("warp.input.name"), lang.get("warp.name"));

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("warp");
        
        const warpName = data[2];
        if (!warpName) return pl.tell(INFO_PREFIX + lang.get("warp.noinput.name"));
        if (warpdata.get(warpName)) return pl.tell(INFO_PREFIX + lang.get("warp.name.repetitive"));

        warpdata.set(warpName, {
            x: pl.pos.x.toFixed(1),
            y: pl.pos.y.toFixed(1),
            z: pl.pos.z.toFixed(1),
            dimid: pl.pos.dimid
        });

        pl.sendText(`添加公共传送点 ${warpName} 成功！`);
    });
}

/**
 * 删除公共传送点
 */
function WarpDelGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const warps = Object.keys(JSON.parse(warpdata.read()));

    if (warps.length === 0) {
        pl.tell(INFO_PREFIX + "暂无公共传送点！");
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.del.point"));

    warps.forEach(name => fm.addButton(name));

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("warp");

        warpdata.delete(warps[id]);
        pl.sendText(`${lang.get("warp.del.point")} ${warps[id]} 成功！`);
    });
}

// ============================================================================
// 死亡返回系统
// ============================================================================

/**
 * 死亡返回GUI
 */
function BackGUI(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const playerDeathPoints = RuntimeState.deathPoints[pl.realName];
    if (!playerDeathPoints || playerDeathPoints.length === 0) {
        return pl.tell(INFO_PREFIX + lang.get("back.list.Empty"));
    }

    const cost = conf.get("Back") || 0;
    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("back.to.point"));
    fm.addLabel(lang.get("back.choose"));

    playerDeathPoints.forEach((point, index) => {
        fm.addLabel(
            `§e死亡点 ${index + 1}：\n` +
            `§7坐标：${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)}\n` +
            `§7维度：${point.dimension}\n` +
            `§7时间：${point.time}`
        );
    });

    const options = playerDeathPoints.map((point, index) =>
        `死亡点${index + 1} - ${point.dimension} (${Math.round(point.pos.x)}, ${Math.round(point.pos.y)}, ${Math.round(point.pos.z)})`
    );
    fm.addDropdown("选择要传送的死亡点", options, 0);
    fm.addLabel(EconomyUtils.displayMoneyInfo(pl, pl, true));
    fm.addLabel(`传送需要花费${cost}${lang.get("CoinName")}`);

    pl.sendForm(fm, (pl, data) => {
        if (data === null || data === undefined) {
            return pl.tell(INFO_PREFIX + lang.get("gui.exit"));
        }

        const currentDeathPoints = RuntimeState.deathPoints[pl.realName];
        if (!currentDeathPoints || currentDeathPoints.length === 0) {
            return pl.tell(INFO_PREFIX + "§c死亡点数据已失效！");
        }

        const dropdownIndex = 1 + currentDeathPoints.length;
        const selectedIndex = data[dropdownIndex];

        if (selectedIndex === undefined || selectedIndex < 0 || selectedIndex >= currentDeathPoints.length) {
            return pl.tell(INFO_PREFIX + lang.get("back.choose.null"));
        }

        const selectedPoint = currentDeathPoints[selectedIndex];
        if (!selectedPoint || !selectedPoint.pos) {
            return pl.tell(INFO_PREFIX + lang.get("back.deathlog.error"));
        }

        if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
            return pl.tell(INFO_PREFIX + lang.get("money.no.enough"));
        }

        try {
            pl.teleport(selectedPoint.pos.x, selectedPoint.pos.y, selectedPoint.pos.z, selectedPoint.pos.dimid);
            mc.runcmdEx(`effect "${pl.realName}" resistance 15 255 true`);
            pl.tell(INFO_PREFIX + `§a已传送至死亡点${selectedIndex + 1}！`);
        } catch (e) {
            pl.tell(INFO_PREFIX + lang.get("back.fail"));
            logger.error("Back System Error: " + e);
        }
    });
}

// ============================================================================
// TPA系统
// ============================================================================

/**
 * TPA主菜单
 */
function showTpaMenu(player) {
    const tpaConfig = conf.get("tpa") || {};
    const cost = tpaConfig.cost || 0;
    const scoreboard = conf.get("Scoreboard");

    if (!tpaConfig.EnabledModule) {
        player.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
        return;
    }

    const onlinePlayers = mc.getOnlinePlayers().filter(p => p.name !== player.name && !p.isSimulatedPlayer());
    if (onlinePlayers.length === 0) {
        player.tell(INFO_PREFIX + lang.get("tpa.noplayer.online"));
        return;
    }

    const form = mc.newCustomForm();
    form.setTitle(INFO_PREFIX + lang.get("tpa.name.ls"));

    const nameList = onlinePlayers.map(p => p.name);
    form.addDropdown(lang.get("tpa.choose.player"), nameList);
    form.addDropdown(lang.get("tpa.choose.fs"), [lang.get("tpa.to.he.she"), lang.get("tpa.to.here")]);
    form.addLabel(lang.get("tpa.cost").replace("${cost}", cost).replace("${Scoreboard}", scoreboard));

    const isDelayEnabled = tpaConfig.isDelayEnabled !== false;
    const maxD = Number(tpaConfig.maxDelay) || 20;
    const timeoutSec = tpaConfig.requestTimeout || 60;

    let hasDelaySlider = false;
    if (isDelayEnabled) {
        form.addSlider(`§e传送延迟(0~${maxD}秒)`, 0, maxD, 1, 0);
        hasDelaySlider = true;
    }

    const isOp = player.isOP();
    if (isOp) {
        form.addSwitch(lang.get("tpa.op.msg"), false);
    }

    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(INFO_PREFIX + lang.get("tpa.exit"));
            return;
        }

        let idx = 0;
        const targetIndex = data[idx++];
        const modeIndex = data[idx++];
        idx++; // 跳过标签

        let delaySec = 0;
        if (hasDelaySlider) {
            delaySec = data[idx++];
        }

        let manage = false;
        if (isOp) {
            manage = data[idx++];
        }

        if (manage === true) {
            showTpaManageForm(pl);
            return;
        }

        const targetName = nameList[targetIndex];
        const direction = modeIndex === 0 ? "to" : "here";
        sendTpaRequest(pl, targetName, direction, Math.floor(delaySec));
    });
}

/**
 * TPA管理表单
 */
function showTpaManageForm(player) {
    const tpaConfig = conf.get("tpa") || {};
    
    const form = mc.newCustomForm();
    form.setTitle(lang.get("tpa.op.menu"));
    form.addInput(lang.get("tpa.send.time"), lang.get("number"), "" + (tpaConfig.requestTimeout || 60));
    form.addDropdown(lang.get("tpa.send.way"), [lang.get("tpa.send.form"), lang.get("tpa.send.bossbar")], tpaConfig.promptType === "bossbar" ? 1 : 0);
    form.addSwitch(lang.get("tpa.Enabled.lag"), tpaConfig.isDelayEnabled !== false);
    form.addInput(lang.get("tpa.max.lagnumber"), lang.get("number"), "" + (tpaConfig.maxDelay || 20));

    player.sendForm(form, (pl, data) => {
        if (!data) {
            pl.tell(lang.get("tpa.exit"));
            return;
        }

        const newTimeout = parseInt(data[0]);
        const promptIndex = data[1];
        const enableDelay = data[2];
        const newMaxDelay = parseInt(data[3]);

        if (isNaN(newTimeout) || newTimeout <= 0) {
            pl.tell(INFO_PREFIX + lang.get("tpa.input.must.number"));
            return;
        }

        if (isNaN(newMaxDelay) || newMaxDelay < 0) {
            pl.tell(INFO_PREFIX + lang.get("tpa.must.biggerzero"));
            return;
        }

        const updatedConfig = {
            ...tpaConfig,
            requestTimeout: newTimeout,
            promptType: promptIndex === 0 ? "form" : "bossbar",
            isDelayEnabled: enableDelay,
            maxDelay: newMaxDelay
        };
        conf.set("tpa", updatedConfig);

        pl.tell(INFO_PREFIX + lang.get("tpa.save.conf.ok"));
    });
}

/**
 * 发送TPA请求
 */
function sendTpaRequest(fromPlayer, toPlayerName, direction, delaySec) {
    delaySec = isNaN(delaySec) ? 0 : delaySec;

    const toPlayer = mc.getPlayer(toPlayerName);
    if (!toPlayer) {
        fromPlayer.tell(INFO_PREFIX + lang.get("tpa.send.fail"));
        return;
            }

    const acceptTpaRequests = tpacfg.get(toPlayerName)?.acceptTpaRequests;
    if (acceptTpaRequests === false) {
        fromPlayer.tell(INFO_PREFIX + lang.get("tpa.send.noway"));
        return;
    }

    if (RuntimeState.pendingTpaRequests[toPlayerName]) {
        fromPlayer.tell(INFO_PREFIX + lang.get("tpa.no.callback"));
        return;
    }

    const uid = Math.floor(Math.random() * 1e8);
    const tpaConfig = conf.get("tpa") || {};
    const timeoutSec = tpaConfig.requestTimeout || 60;

    const req = {
        from: fromPlayer,
        to: toPlayer,
        fromName: fromPlayer.name,
        toName: toPlayerName,
        direction: direction,
        delay: delaySec,
        bossbarId: uid,
        startTime: Date.now(),
        timer: null
    };

    RuntimeState.pendingTpaRequests[toPlayerName] = req;

    const dirText = direction === "to" ? lang.get("tpa.to.here") : lang.get("tpa.to.he.she");
    toPlayer.tell(
        `${INFO_PREFIX}§e收到传送请求(${req.fromName}想${dirText})\n` +
        (delaySec > 0 ? `§6并设置了延迟: ${delaySec}秒\n` : "") +
        `${lang.get("tpa.a.and.d")}\n` +
        `§c请求最多等待${timeoutSec}秒`
    );

    fromPlayer.tell(`${INFO_PREFIX}§a已向 ${toPlayerName} 发送请求(延迟=${delaySec}), 等待对方同意(最多${timeoutSec}s)`);

    const promptType = tpaConfig.promptType || "form";
    if (promptType === "form") {
        showTpaConfirmForm(req, timeoutSec);
    } else {
        showTpaBossbarPrompt(req, timeoutSec);
    }
}

/**
 * TPA确认表单
 */
function showTpaConfirmForm(req, timeoutSec) {
    const toPlayer = req.to;
    const dirText = req.direction === "to" ? lang.get("tpa.to.here") : lang.get("tpa.to.he.she");
    const delayStr = req.delay > 0 ? `(延迟${req.delay}秒)\n` : "";

    const form = mc.newSimpleForm();
    form.setTitle(lang.get("tpa.request"));
    form.setContent(
        `${INFO_PREFIX}§b[${req.fromName}] 请求${dirText}\n` +
        `${delayStr}` +
        `${lang.get("tpa.a.and.d")}\n` +
        `§e剩余时间: ${timeoutSec}s`
    );
    form.addButton(lang.get("tpa.a"));
    form.addButton(lang.get("tpa.d"));

    toPlayer.sendForm(form, (pl, id) => {
        if (id == null) return;
        if (id === 0) acceptTpaRequest(pl.name);
        else denyTpaRequest(pl.name);
    });

    startTpaRequestCountdown(req, timeoutSec, false);
}

/**
 * TPA BossBar提示
 */
function showTpaBossbarPrompt(req, timeoutSec) {
    const toPlayer = req.to;
    const dirText = req.direction === "to" ? lang.get("tpa.to.here") : lang.get("tpa.to.he.she");
    const delayStr = req.delay > 0 ? `(延迟${req.delay}秒)` : "";

    toPlayer.setBossBar(
        req.bossbarId,
        `§a${req.fromName}请求${dirText}§f${delayStr}\n§c(/tpayes同意 /tpano拒绝)`,
        100,
        3
    );

    startTpaRequestCountdown(req, timeoutSec, true);
}

/**
 * TPA请求倒计时
 */
function startTpaRequestCountdown(req, timeoutSec, bossbarMode) {
    let remain = timeoutSec;

    const timerId = setInterval(() => {
        remain--;

        if (!mc.getPlayer(req.toName) || !mc.getPlayer(req.fromName)) {
            clearInterval(timerId);
            cancelTpaRequest(req.toName, lang.get("tpa.player.offline"));
            return;
        }

        if (bossbarMode) {
            const percent = Math.floor((remain / timeoutSec) * 100);
            const dirText = req.direction === "to" ? lang.get("tpa.to.here") : lang.get("tpa.to.he.she");
            const delayStr = req.delay > 0 ? `(延迟${req.delay}秒)` : "";
            req.to.setBossBar(
                req.bossbarId,
                `§a${req.fromName}请求${dirText}§f${delayStr}§s(/tpayes同意 /tpano拒绝),剩余${remain}s`,
                percent,
                3
            );
        }

        if (remain <= 0) {
            clearInterval(timerId);
            cancelTpaRequest(req.toName, INFO_PREFIX + lang.get("tpa.request.timeout"));
        }
    }, 1000);

    req.timer = timerId;
}

/**
 * 接受TPA请求
 */
function acceptTpaRequest(targetName) {
    const req = RuntimeState.pendingTpaRequests[targetName];
    if (!req) {
        const p = mc.getPlayer(targetName);
        if (p) p.tell(INFO_PREFIX + lang.get("tpa.no.request"));
        return;
    }

    clearTpaRequest(req);

    const { from, to, delay, direction } = req;
    const tpaConfig = conf.get("tpa") || {};
    const cost = tpaConfig.cost || 0;

    to.tell(INFO_PREFIX + lang.get("tpa.accpet.request"));
    from.tell(`${INFO_PREFIX}§a对方已同意请求，` + (delay > 0 ? `将在${delay}秒后传送...` : "正在传送..."));

    // 检查并扣费
    if (cost > 0) {
        if (!EconomyUtils.checkAndDeduct(from.realName, cost)) {
            from.sendText(INFO_PREFIX + `§c您需要 ${cost}${lang.get("CoinName")} 才能传送！`);
            delete RuntimeState.pendingTpaRequests[targetName];
            return;
        }
        from.sendText(INFO_PREFIX + `§e传送花费 ${cost}${lang.get("CoinName")}`);
    }

    if (delay > 0) {
        executeTpaWithDelay(req, delay);
    } else {
        executeTpaImmediate(req);
    }

    delete RuntimeState.pendingTpaRequests[targetName];
}

/**
 * 执行带延迟的TPA
 */
function executeTpaWithDelay(req, delay) {
    const { from, to, direction } = req;
    const secondBarId = Math.floor(Math.random() * 1e9);
    let remain = delay;

    const secondTid = setInterval(() => {
        remain--;

        if (!mc.getPlayer(from.name) || !mc.getPlayer(to.name)) {
            clearInterval(secondTid);
            from.removeBossBar(secondBarId);
            to.removeBossBar(secondBarId);
            from.tell(INFO_PREFIX + lang.get("tpa.request.cut"));
            return;
        }

        const percent = Math.floor((remain / delay) * 100);
        from.setBossBar(secondBarId, `§d传送倒计时: ${remain}s`, percent, 1);
        to.setBossBar(secondBarId, `§d传送倒计时: ${remain}s`, percent, 1);

        if (remain <= 0) {
            clearInterval(secondTid);
            from.removeBossBar(secondBarId);
            to.removeBossBar(secondBarId);
            executeTpaImmediate(req);
        }
    }, 1000);
}

/**
 * 立即执行TPA
 */
function executeTpaImmediate(req) {
    const { from, to, direction } = req;

    if (!mc.getPlayer(from.name) || !mc.getPlayer(to.name)) {
        from.tell(INFO_PREFIX + lang.get("tpa.tp.fail.noonline"));
        return;
    }

    try {
        if (direction === "to") {
            const targetPlayer = mc.getPlayer(to.name);
            if (!targetPlayer) {
                from.tell(INFO_PREFIX + lang.get("tpa.tp.fail.noonline"));
                return;
            }
            from.teleport(targetPlayer.pos.x, targetPlayer.pos.y - 1.62, targetPlayer.pos.z, targetPlayer.pos.dimid);
        } else {
            const targetPlayer = mc.getPlayer(from.name);
            if (!targetPlayer) {
                to.tell(INFO_PREFIX + lang.get("tpa.tp.fail.noonline"));
                return;
            }
            to.teleport(targetPlayer.pos.x, targetPlayer.pos.y - 1.62, targetPlayer.pos.z, targetPlayer.pos.dimid);
        }

        from.tell(INFO_PREFIX + lang.get("tpa.tp.okey"));
        to.tell(INFO_PREFIX + lang.get("tpa.tp.okey"));
    } catch (e) {
        logger.error("TPA传送失败: " + e.message);
        from.tell(INFO_PREFIX + lang.get("tpa.tp.fail.noonline"));
    }
}

/**
 * 拒绝TPA请求
 */
function denyTpaRequest(targetName) {
    const req = RuntimeState.pendingTpaRequests[targetName];
    if (!req) {
        const p = mc.getPlayer(targetName);
        if (p) p.tell(INFO_PREFIX + lang.get("tpa.no.request"));
        return;
    }

    clearTpaRequest(req);
    req.from.tell(INFO_PREFIX + lang.get("tpa.d.request"));
    req.to.tell(INFO_PREFIX + lang.get("tpa.d.request.you"));
    delete RuntimeState.pendingTpaRequests[targetName];
}

/**
 * 取消TPA请求
 */
function cancelTpaRequest(targetName, msg) {
    const req = RuntimeState.pendingTpaRequests[targetName];
    if (!req) return;

    clearTpaRequest(req);
    if (req.from && mc.getPlayer(req.from.name)) {
        req.from.tell(msg);
    }
    delete RuntimeState.pendingTpaRequests[targetName];
}

/**
 * 清理TPA请求资源
 */
function clearTpaRequest(req) {
    if (req.timer) {
        clearInterval(req.timer);
    }

    if (req.to && mc.getPlayer(req.to.name)) {
        try {
            req.to.removeBossBar(req.bossbarId);
        } catch (e) {}
    }
}

// ============================================================================
// 命令注册
// ============================================================================

function registerCommands() {
    // 金钱GUI命令
    const moneygui = mc.newCommand("moneygui", lang.get("CoinName"), PermType.Any);
    moneygui.overload([]);
    moneygui.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");
        
        if (pl.isOP()) {
            OPMoneyGui(pl.realName);
        } else {
            MoneyGui(pl.realName);
        }
    });
    moneygui.setup();

    // 金钱管理命令(OP)
    const moneycmd = mc.newCommand("moneys", lang.get("CoinName"), PermType.GameMasters);
    moneycmd.mandatory("option", ParamType.String);
    moneycmd.optional("player", ParamType.String);
    moneycmd.optional("amount", ParamType.Int);
    moneycmd.overload(["option", "player", "amount"]);
    moneycmd.setCallback((cmd, ori, out, res) => {
        const pl = mc.getPlayer(res.player);
        if (!pl) return out.error(lang.get("money.tr.noonline"));

        const coinName = lang.get("CoinName");

        switch (res.option) {
            case "set":
                EconomyUtils.setBalance(pl, res.amount);
                EconomyUtils.addMoneyHistory(pl.realName, `${coinName}设置为${res.amount}`);
                out.success(`成功将玩家${res.player}的${coinName}设置为${res.amount}`);
                break;
            case "add":
                EconomyUtils.addBalance(pl, res.amount);
                EconomyUtils.addMoneyHistory(pl.realName, `${coinName}增加${res.amount}`);
                out.success(`成功给玩家${res.player}增加${res.amount}${coinName}`);
                break;
            case "del":
                EconomyUtils.reduceBalance(pl, res.amount);
                EconomyUtils.addMoneyHistory(pl.realName, `${coinName}减少${res.amount}`);
                out.success(`成功给玩家${res.player}减少${res.amount}${coinName}`);
                break;
            case "get":
                out.success(`玩家${res.player}的${coinName}为${EconomyUtils.getBalance(pl)}`);
                break;
            case "history":
                const historyData = MoneyHistory.get(pl.realName) || {};
                const jsonStr = JSON.stringify(historyData);
                const items = jsonStr.slice(1, jsonStr.length - 1).split(',');
                out.success(`玩家${res.player}的${coinName}历史记录：`);
                items.slice(0, 50).forEach(item => out.success(item));
                break;
            default:
                out.error(lang.get("moneys.help"));
        }
    });
    moneycmd.setup();

    // 家园系统命令
    const homegui = mc.newCommand("home", "家园系统", PermType.Any);
    homegui.overload([]);
    homegui.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");
        HomeGui(pl.realName);
    });
    homegui.setup();

    // 公共传送点命令
    const warpgui = mc.newCommand("warp", "公共传送点", PermType.Any);
    warpgui.overload([]);
    warpgui.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");
        
        if (pl.isOP()) {
            OPWarpGui(pl.realName);
        } else {
            WarpGui(pl.realName);
        }
    });
    warpgui.setup();

    // 死亡返回命令
    const backcmd = mc.newCommand("back", "返回死亡点", PermType.Any);
    backcmd.overload([]);
    backcmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");
        BackGUI(pl.realName);
    });
    backcmd.setup();

    // 死亡记录命令
    const deathlistcmd = mc.newCommand("deathlog", "查看死亡历史记录", PermType.Any);
    deathlistcmd.overload([]);
    deathlistcmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");

        const playerDeathPoints = RuntimeState.deathPoints[pl.realName];
        if (!playerDeathPoints || playerDeathPoints.length === 0) {
            return pl.tell(INFO_PREFIX + lang.get("back.list.Empty"));
        }

        pl.tell("§6=== 您的死亡点列表 ===");
        playerDeathPoints.forEach((point, index) => {
            pl.tell(`§e死亡点 ${index + 1}：`);
            pl.tell(`§7坐标：${point.pos.x}, ${point.pos.y}, ${point.pos.z}`);
            pl.tell(`§7维度：${point.dimension}`);
            pl.tell(`§7时间：${point.time}`);
            pl.tell("§7-------------------");
        });
    });
    deathlistcmd.setup();

    // 自杀命令
    const suicidecmd = mc.newCommand("suicide", "自杀", PermType.Any);
    suicidecmd.overload([]);
    suicidecmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");

        const cost = conf.get("suicide") || 0;
        if (!EconomyUtils.checkAndDeduct(pl.realName, cost)) {
            return pl.tell(INFO_PREFIX + lang.get("money.no.enough"));
        }

        pl.tell(INFO_PREFIX + lang.get("suicide.kill.ok"));
        pl.kill();
    });
    suicidecmd.setup();

    // TPA命令
    mc.regPlayerCmd("tpa", "传送系统", (player, args) => {
        showTpaMenu(player);
    });

    mc.regPlayerCmd("tpayes", "§a同意传送请求", (pl) => {
        acceptTpaRequest(pl.name);
    });

    mc.regPlayerCmd("tpano", "§c拒绝传送请求", (pl) => {
        denyTpaRequest(pl.name);
    });

    // TPA设置命令
    const tpaSettingsCmd = mc.newCommand("tpasettings", "设置是否接收传送请求", PermType.Any);
    tpaSettingsCmd.overload([]);
    tpaSettingsCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return;

        let playerSettings = tpacfg.get(pl.realName) || { acceptTpaRequests: true };
        const newSetting = !playerSettings.acceptTpaRequests;

        tpacfg.set(pl.realName, { ...playerSettings, acceptTpaRequests: newSetting });
        pl.sendText(INFO_PREFIX + (newSetting ? lang.get("tpa.allow.tp") : lang.get("tpa.noallow.tp")));
    });
    tpaSettingsCmd.setup();

    // RTP命令
    const rtpCmd = mc.newCommand("rtp", "随机传送", PermType.Any);
    rtpCmd.overload([]);
    rtpCmd.setCallback(async (cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error("仅限玩家执行");

        if (!conf.get("RTP").EnabledModule) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        try {
            await AsyncTeleportSystem.performRTPAsync(pl);
        } catch (error) {
            logger.error(`RTP命令执行失败: ${error.message}`);
            pl.tell(INFO_PREFIX + "§c传送失败，请稍后重试");
        }
    });
    rtpCmd.setup();

    // RTP重置冷却命令(OP)
    const rtpResetCmd = mc.newCommand("rtpreset", "重置传送冷却", PermType.GameMasters);
    rtpResetCmd.optional("player", ParamType.Player);
    rtpResetCmd.overload(["player"]);
    rtpResetCmd.setCallback((cmd, ori, out, res) => {
        const target = res.player?.[0] || ori.player;
        if (!target) return out.error("未找到玩家");

        RuntimeState.cooltime.set(target.realName, 0);
        out.success(`已重置 ${target.realName} 的传送冷却`);
    });
    rtpResetCmd.setup();

    // Hub命令
    mc.regPlayerCmd('hub', '打开回城菜单', (pl) => {
        const hubConfig = conf.get("Hub");
        if (!hubConfig.EnabledModule) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        const form = mc.newSimpleForm();
        form.setTitle(lang.get("hub.tp.check"));
        form.setContent([
            '§e目标位置：',
            `§bX: §f${hubConfig.x}`,
            `§bY: §f${hubConfig.y}`,
            `§bZ: §f${hubConfig.z}`,
            `§b维度: §f${Utils.getDimensionName(hubConfig.dimid)}`
        ].join('\n'));

        form.addButton(lang.get("hub.tp.now"), 'textures/ui/confirm');
        form.addButton(lang.get("hub.tp.notnow"), 'textures/ui/cancel');

        pl.sendForm(form, (pl, id) => {
            if (id === 0) {
                try {
                    pl.teleport(parseFloat(hubConfig.x), parseFloat(hubConfig.y), parseFloat(hubConfig.z), parseInt(hubConfig.dimid));
                    pl.tell(lang.get("hub.tp.success"));
                } catch (e) {
                    pl.tell(lang.get("hub.tp.fail") + e.message);
                }
            }
        });
    });

    // 设置Hub命令(OP)
    mc.regPlayerCmd('sethub', '设置回城点', (pl) => {
        if (!pl || !pl.isOP()) {
            pl.tell(INFO_PREFIX + lang.get("player.not.op"));
            return;
        }

        const hubData = {
            EnabledModule: true,
            x: pl.pos.x.toFixed(1) * 1,
            y: pl.pos.y.toFixed(1) * 1,
            z: pl.pos.z.toFixed(1) * 1,
            dimid: pl.pos.dimid,
            isSet: true
        };
        conf.set("Hub", hubData);

        pl.tell([
            '§a回城点已设置为：',
            `§eX: §f${pl.pos.x.toFixed(1)}`,
            `§eY: §f${pl.pos.y.toFixed(1)}`,
            `§eZ: §f${pl.pos.z.toFixed(1)}`,
            `§e维度: §f${Utils.getDimensionName(pl.pos.dimid)}`
        ].join('\n'));
    });

    // 公告命令
    const noticeCmd = mc.newCommand("notice", "公告", PermType.Any);
    noticeCmd.overload([]);
    noticeCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return;

        if (!conf.get("NoticeEnabled")) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        noticeconf.init(String(pl.realName), 0);

        if (!file.exists(PATHS.NOTICE_FILE)) {
            file.writeTo(PATHS.NOTICE_FILE, "这是一个公告");
        }

        const content = (file.readFrom(PATHS.NOTICE_FILE) || "暂无公告").split("\n");

        const fm = mc.newCustomForm().setTitle(INFO_PREFIX + lang.get("notice.for.server"));
        content.forEach(line => {
            if (line.trim() !== "") fm.addLabel(line);
        });
        fm.addSwitch(lang.get("notice.dont.showagain"), noticeconf.get(String(pl.realName)) != 0);

        pl.sendForm(fm, (pl, data) => {
            if (data == null) return;
            noticeconf.set(String(pl.realName), data[data.length - 1] ? 1 : 0);
        });
    });
    noticeCmd.setup();

    // 公告编辑命令(OP)
    const noticeSetCmd = mc.newCommand("noticeset", "编辑公告内容", PermType.GameMasters);
    noticeSetCmd.overload([]);
    noticeSetCmd.setCallback((_cmd, ori, output) => {
        const pl = ori.player;
        if (!pl) return;

        if (!conf.get("NoticeEnabled")) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        if (!pl.isOP()) {
            output.error(INFO_PREFIX + lang.get("player.not.op"));
            return;
        }

        let currentNotice = "";
        if (file.exists(PATHS.NOTICE_FILE)) {
            currentNotice = file.readFrom(PATHS.NOTICE_FILE) || "";
        }

        const sendNoticeForm = (player, lines) => {
            const form = mc.newCustomForm().setTitle(INFO_PREFIX + lang.get("notice.editor"));
            lines.forEach((line, index) => form.addInput(`§a行 ${index + 1}`, line || ""));
            form.addStepSlider("操作", ["完成编辑", "添加新行", "删除最后一行"], 0);

            player.sendForm(form, (plr, data) => {
                if (data === null || data === undefined) {
                    plr.tell(INFO_PREFIX + lang.get("notice.exit.edit"));
                    return;
                }

                const action = data.pop();
                const contentLines = data.map(val => val || "");

                switch (action) {
                    case 0:
                        const newContent = contentLines.join('\n');
                        if (newContent === currentNotice) {
                            plr.tell(INFO_PREFIX + lang.get("notice.no.change"));
                            return;
                        }

                        const backupPath = PATHS.DATA + "NoticeSettingsData/notice.txt.bak";
                        try {
                            if (file.exists(PATHS.NOTICE_FILE)) {
                                if (file.exists(backupPath)) file.delete(backupPath);
                                file.rename(PATHS.NOTICE_FILE, backupPath);
                                plr.tell(INFO_PREFIX + "§a原公告已备份为 notice.txt.bak");
                            }
                        } catch (e) {
                            plr.tell(INFO_PREFIX + "§c备份失败: " + e);
                        }

                        file.writeTo(PATHS.NOTICE_FILE, newContent);
                        noticeconf.set("lastNoticeUpdate", Date.now());
                        plr.tell(INFO_PREFIX + lang.get("save.notice.ok"));
                        break;
                    case 1:
                        contentLines.push("");
                        sendNoticeForm(plr, contentLines);
                        break;
                    case 2:
                        if (contentLines.length > 1) {
                            contentLines.pop();
                            sendNoticeForm(plr, contentLines);
                        } else {
                            plr.tell(INFO_PREFIX + "§c不能删除所有行，至少保留一行！");
                            sendNoticeForm(plr, contentLines);
                        }
                        break;
                }
            });
        };

        sendNoticeForm(pl, currentNotice.split('\n'));
    });
    noticeSetCmd.setup();

    // 跨服传送命令
    const serCmd = mc.newCommand("servers", "§l§a跨服传送", PermType.Any);
    serCmd.overload([]);
    serCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!conf.get("TRServersEnabled")) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        if (!pl || typeof pl.sendText !== "function") {
            logger.error("玩家对象无效或已离线！");
            return;
        }

        let serverList = [];
        try {
            serverList = servertp.get("servers") || [];
        } catch (e) {
            logger.error("读取 server.json 失败:", e);
            pl.tell(INFO_PREFIX + lang.get("server.load.error"));
            return;
        }

        if (serverList.length === 0) {
            logger.error(lang.get("no.server.cantpto"));
            pl.tell(INFO_PREFIX + lang.get("no.server.can.tp"));
            return;
        }

        const form = mc.newSimpleForm();
        form.setContent(lang.get("choose.a.server"));
        form.setTitle(lang.get("server.from.title"));
        serverList.forEach(server => {
            form.addButton(`§l§b${server.server_name}\n§7IP: ${server.server_ip}:${server.server_port}`);
        });

        pl.sendForm(form, (pl, id) => {
            if (id === null) return;

            const targetServer = serverList[id];
            if (!targetServer) {
                pl.tell(INFO_PREFIX + lang.get("server.no.select"));
                return;
            }

            try {
                pl.transServer(targetServer.server_ip, targetServer.server_port);
                mc.broadcast(`§a[提示] ${pl.realName} 前往了 ${targetServer.server_name}`);
            } catch (e) {
                logger.error("传送失败:", e);
                pl.tell(INFO_PREFIX + lang.get("server.tp.fail"));
            }
        });
    });
    serCmd.setup();

    // 崩溃命令(OP)
    mc.regPlayerCmd("crash", "§c使玩家客户端崩溃", (player, args) => {
        if (!conf.get("CrashModuleEnabled")) {
            player.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        if (!player || !player.isOP()) {
            player.tell(INFO_PREFIX + lang.get("player.not.op"));
            return;
        }

        const crashForm = mc.newCustomForm();
        crashForm.setTitle(lang.get("crash.player.client"));
        crashForm.addLabel(lang.get("carsh.function.list"));

        const players = mc.getOnlinePlayers().filter(p => !p.isSimulatedPlayer());
        const playerNames = players.map(p => p.name);
        crashForm.addDropdown("请选择玩家:", playerNames);

        player.sendForm(crashForm, (pl, data) => {
            if (data == null) return;

            const targetPlayer = players[data[1]];
            if (targetPlayer) {
                targetPlayer.crash();
                pl.tell(INFO_PREFIX + lang.get("crash.player.ok"));
            }
        });
    }, 1);

    // 红包命令
    const redpacketCmd = mc.newCommand("redpacket", "红包功能", PermType.Any);
    redpacketCmd.setAlias("rp");
    redpacketCmd.setEnum("subcommand", ["send", "open", "list", "history"]);
    redpacketCmd.setEnum("packetType", ["random", "average"]);
    redpacketCmd.mandatory("subcommand", ParamType.Enum, "subcommand");
    redpacketCmd.optional("amount", ParamType.Int);
    redpacketCmd.optional("count", ParamType.Int);
    redpacketCmd.optional("player", ParamType.String);
    redpacketCmd.optional("message", ParamType.String);
    redpacketCmd.optional("packetType", ParamType.Enum, "packetType");
    redpacketCmd.overload(["subcommand", "amount", "count", "player", "message", "packetType"]);
    redpacketCmd.overload(["subcommand", "amount", "count", "player", "message"]);
    redpacketCmd.overload(["subcommand"]);

    redpacketCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return;

        if (!conf.get("RedPacket").EnabledModule) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        switch (res.subcommand) {
            case "send":
                let packetType = res.packetType || "random";
                if (typeof res.player === "string" && (res.player === "random" || res.player === "average")) {
                    packetType = res.player;
                    handleSendRedPacket(pl, res.amount, res.count, "", "", packetType);
                } else {
                    handleSendRedPacket(pl, res.amount, res.count, res.player, res.message, packetType);
                }
                break;
            case "open":
                handleOpenRedPacket(pl);
                break;
            case "list":
                handleListRedPacket(pl);
                break;
            case "history":
                handleRedPacketHistory(pl);
                break;
        }
    });
    redpacketCmd.setup();

    // 红包帮助命令
    mc.regPlayerCmd("redpackethelp", "红包帮助", (pl) => {
        if (!conf.get("RedPacket").EnabledModule) {
            pl.tell(INFO_PREFIX + lang.get("module.no.Enabled"));
            return;
        }

        const helpForm = mc.newSimpleForm()
            .setTitle("红包使用帮助")
            .setContent("选择命令查看详细说明");

        helpForm.addButton("发送红包");
        helpForm.addButton("领取红包");
        helpForm.addButton("查看红包");
        helpForm.addButton("红包历史");
        helpForm.addButton("红包类型说明");

        pl.sendForm(helpForm, (player, id) => {
            if (id === null) return;

            const helpTexts = [
                "§6发送红包命令: §a/rp send <金额> <数量> [玩家名] [祝福语] [类型]\n" +
                "§7- §f金额: 红包总金额\n" +
                "§7- §f数量: 红包个数\n" +
                "§7- §f玩家名: 指定接收玩家(可选)\n" +
                "§7- §f祝福语: 红包祝福语(可选)\n" +
                "§7- §f类型: random(拼手气)或average(普通)(可选，默认random)\n" +
                "§e示例: §a/rp send 1000 5",

                "§6领取红包命令: §a/rp open\n" +
                "§7自动领取最早可用的红包\n\n" +
                "§6查看可领红包: §a/rp list\n" +
                "§7查看所有可领取的红包列表",

                "§6查看红包详情: §a/rp list\n" +
                "§7查看所有可领取的红包\n\n" +
                "§7点击红包可直接领取",

                "§6查看红包历史: §a/rp history\n" +
                "§7查看你发送和领取的红包记录",

                "§6红包类型说明:\n" +
                "§a1. 拼手气红包(random):\n" +
                "§7- 每个红包金额随机分配\n" +
                "§7- 金额在1到剩余均值的两倍之间随机\n\n" +
                "§b2. 普通红包(average):\n" +
                "§7- 每个红包金额平均分配"
            ];

            const detailForm = mc.newCustomForm()
                .setTitle("§l§6红包帮助")
                .addLabel(helpTexts[id]);

            pl.sendForm(detailForm, () => {});
        });
    });
}

// ============================================================================
// 事件监听
// ============================================================================

function registerEventListeners() {
    // 玩家加入事件
    mc.listen("onJoin", (pl) => {
        // 强制公告显示
        if (conf.get("forceNotice")) {
            conf.set("forceNotice", false);
            noticeconf.set(pl.realName, 0);
        }

        // 自动显示公告
        if (conf.get("join_notice") == 1) {
            setTimeout(() => {
                if (!mc.getPlayer(pl.realName)) return;
                if (noticeconf.get(String(pl.realName)) == 1) return;
                if (!conf.get("NoticeEnabled")) return;
                pl.runcmd("notice");
            }, 1000);
        }
    });

    // 玩家预加入事件
    mc.listen("onPreJoin", (pl) => {
        try {
            homedata.init(pl.realName, {});
            rtpdata.init(pl.realName, {});
            MoneyHistory.init(pl.realName, {});

            if (conf.get("LLMoney") == 1) {
                const currentMoney = pl.getMoney();
                if (currentMoney === null || currentMoney === undefined) {
                    pl.setMoney(0);
                }
            } else {
                const score = pl.getScore(conf.get("Scoreboard"));
                if (!score) pl.setScore(conf.get("Scoreboard"), 0);
            }
        } catch (error) {
            logger.error(`玩家 ${pl.realName} 加入事件处理失败: ${error.message}`);
        }
    });

    // 玩家退出事件
    mc.listen("onLeft", (pl) => {
        const pname = pl.name;

        // 清理TPA请求
        for (const [key, request] of Object.entries(RuntimeState.pendingTpaRequests)) {
            if (!request || !request.from || !request.to) continue;

            if (request.toName === pname) {
                clearTpaRequest(request);
                if (request.from && mc.getPlayer(request.from.name)) {
                    request.from.tell(INFO_PREFIX + lang.get("tpa.player.offline"));
                }
                delete RuntimeState.pendingTpaRequests[key];
            } else if (request.fromName === pname) {
                if (request.to && mc.getPlayer(request.to.name)) {
                    request.to.tell(INFO_PREFIX + lang.get("tpa.player.offline"));
                }
                clearTpaRequest(request);
                delete RuntimeState.pendingTpaRequests[key];
            }
        }

        // 清理FCAM
        const fcamData = RuntimeState.fcamBossBars.get(pname);
        if (fcamData) {
            if (fcamData.timer) clearInterval(fcamData.timer);
            RuntimeState.fcamBossBars.delete(pname);
        }

        const spl = mc.getPlayer(pname + "_sp");
        if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
            spl.simulateDisconnect();
        }
    });

    // 玩家死亡事件
    mc.listen("onPlayerDie", (pl, src) => {
        const playerName = pl.realName;

        if (!RuntimeState.deathPoints[playerName]) {
            RuntimeState.deathPoints[playerName] = [];
        }

        const deathPos = pl.pos;
        if (!deathPos) return;

        const deathRecord = {
            pos: {
                x: deathPos.x,
                y: deathPos.y,
                z: deathPos.z,
                dimid: deathPos.dimid
            },
            time: new Date().toLocaleString(),
            dimension: DIMENSION_NAMES[deathPos.dimid] || "未知维度"
        };

        RuntimeState.deathPoints[playerName].unshift(deathRecord);

        if (RuntimeState.deathPoints[playerName].length > 3) {
            RuntimeState.deathPoints[playerName] = RuntimeState.deathPoints[playerName].slice(0, 3);
        }

        pl.tell(INFO_PREFIX + lang.get("back.helpinfo"));
    });

    // 玩家复活事件
    mc.listen("onRespawn", (pl) => {
        if (conf.get("BackTipAfterDeath")) {
            setTimeout(() => {
                BackGUI(pl.realName);
            }, 100);
        }
    });

    // 控制台命令事件
    mc.listen("onConsoleCmd", (cmd) => {
        if (cmd.toLowerCase() !== "stop" || lang.get("stop.msg") == 0) return;

        const msg = lang.get("stop.msg");
        mc.getOnlinePlayers().forEach((pl) => {
            pl.disconnect(msg);
        });

        mc.runcmdEx("stop");
    });
}

// ============================================================================
// 定时任务
// ============================================================================

function initScheduledTasks() {
    // 更新金钱排行榜
    setInterval(() => {
        mc.getOnlinePlayers().forEach((pl) => {
            if (pl.isSimulatedPlayer()) return;
            
            const moneyValue = EconomyUtils.getBalance(pl);
            if (moneyValue !== null && moneyValue !== undefined) {
                moneyranking.set(pl.realName, moneyValue);
            }
        });
    }, 10000);

    // 冷却时间更新
    setInterval(() => {
        RuntimeState.cooltime.forEach((v, k) => {
            if (v > 0) {
                RuntimeState.cooltime.set(k, v - 1);
            } else {
                RuntimeState.cooltime.delete(k);
            }
        });
    }, 1000);

    // 经验球优化
    if (conf.get("OptimizeXporb") == 1) {
        setInterval(() => {
            mc.runcmdEx("execute as @e[type=xp_orb] at @s run tp @p");
        }, 10000);
    }

    // 红包过期检测
    setInterval(() => {
        const now = Date.now();
        const packets = redpacketData.get("packets") || {};
        let updated = false;

        for (const id in packets) {
            const packet = packets[id];
            if (packet.expireAt < now) {
                handleExpiredPacket(packet);
                updated = true;
            }
        }

        if (updated) {
            redpacketData.save();
        }
    }, 5 * 60 * 1000);
}

// ============================================================================
// MOTD轮播
// ============================================================================

function initMotdRotation() {
    const motds = conf.get("Motd");
    if (!motds || motds.length === 0) return;

    let index = 0;
    setInterval(() => {
        mc.setMotd(motds[index]);
        index = (index + 1) % motds.length;
    }, 5000);
}

// ============================================================================
// PAPI注册
// ============================================================================

function registerPAPI() {
    if (!PAPI) return;

    try {
        PAPI.registerPlayerPlaceholder((pl) => {
            return EconomyUtils.getBalance(pl).toString();
        }, "YEssential", "player_money");

        PAPI.registerPlayerPlaceholder((pl) => {
            return (pl.getMoney() || 0).toString();
        }, "YEssential", "player_LLmoney");
    } catch (e) {
        logger.warn("PAPI注册失败: " + e.message);
    }
}

// ============================================================================
// 服务器启动事件
// ============================================================================

mc.listen("onServerStarted", async () => {
    try {
        // 打印Logo
        logger.info(PLUGIN_INFO + lang.get("Version.Chinese") + PLUGIN_VERSION + ", 作者：Nico6719");
        logger.info("--------------------------------------------------------------------------------");
        logger.info(" ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  ");
        logger.info(" ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  ");
        logger.info("  ╚████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     ");
        logger.info("   ╚██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     ");
        logger.info("    ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗");
        logger.info("    ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝");
        logger.info("--------------------------------------------------------------------------------");

        // 注册PAPI
        registerPAPI();

        // 初始化配置
        logger.info("正在初始化配置系统...");
        const configManager = new ConfigManager();
        configManager.initConfigMigration();
        logger.info("配置系统初始化完成！");

        // 异步检查更新
        if (conf.get("AutoUpdate")) {
            AsyncUpdateChecker.checkForUpdates(PLUGIN_VERSION).catch(error => {
                logger.error("后台更新检查失败: " + error.message);
            });
        }

        // 异步合并语言文件
        await AsyncLanguageManager.mergeLangFiles();

        // 检查维护模式
        if (RuntimeState.maintenanceMode) {
            setTimeout(() => {
                logger.warn(lang.get("wh.warn"));
            }, 3000);
        }

        // 启用死亡不掉落
        if (conf.get("KeepInventory")) {
            mc.runcmdEx("gamerule KeepInventory true");
            colorLog("green", lang.get("gamerule.KeepInventory.true"));
        }

        // 检查公告更新
        const lastShutdown = conf.get("lastServerShutdown") || 0;
        conf.set("lastServerShutdown", Date.now());
        const lastUpdate = noticeconf.get("lastNoticeUpdate") || 0;
        if (lastUpdate > lastShutdown) {
            conf.set("forceNotice", true);
            logger.info(lang.get("notice.is.changed"));
        }

        // 清理残留的模拟玩家
        mc.getOnlinePlayers().forEach(p => {
            if (p.isSimulatedPlayer() && p.name.endsWith("_sp")) {
                logger.warn(`[FCAM] 清理残留的模拟玩家: ${p.name}`);
                p.simulateDisconnect();
            }
        });

        // 打印提示信息
        colorLog("blue", lang.get("Tip3"));
        colorLog("blue", lang.get("Tip2"));
        colorLog("blue", lang.get("Tip1"));

    } catch (error) {
        logger.error("服务器启动初始化失败: " + error.message);
        logger.error("错误堆栈: " + error.stack);
    }
});

// ============================================================================
// 主入口
// ============================================================================

(function main() {
    try {
        // 初始化数据文件
        if (!initDataFiles()) {
            logger.error("数据文件初始化失败，插件可能无法正常工作！");
            return;
        }

        // 初始化各个模块
        initPvpModule();
        initFcamModule();
        initCleanModule();
        initMaintenanceModule();

        // 注册命令
        registerCommands();

        // 注册事件监听
        registerEventListeners();

        // 初始化定时任务
        initScheduledTasks();

        // 初始化MOTD轮播
        initMotdRotation();

        logger.info("YEssential 插件模块初始化完成！");
    } catch (error) {
        logger.error("插件初始化失败: " + error.message);
        logger.error("错误堆栈: " + error.stack);
    }
})();


