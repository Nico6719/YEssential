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
// LiteLoader-AIDS automatic generateds
/// <reference path="c:\Users\Admin/dts/helperlib/src/index.d.ts"/> 
const { PAPI } = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS');
const YEST_LangDir = "./plugins/YEssential/lang/";
const pluginpath = "./plugins/YEssential/";
const datapath = "./plugins/YEssential/data/";
const NAME = `YEssential`;
const PluginInfo =`YEssential多功能基础插件 `;
const version = "2.7.7";
const regversion =[2,7,7];
const info = "§l§6[-YEST-] §r";
const offlineMoneyPath = datapath+"/Money/offlineMoney.json";
// 提取默认语言对象 ,调用示例： pl.tell(info + lang.get("x.x"));
// 创建语言文件（如果不存在）      
const langFilePath = YEST_LangDir + "zh_cn.json";
const defaultLangContent = {
    
    // moneys指令相关
    "moneys.set.success": "成功将玩家 ${player} 的${coin}设置为 ${amount}",
    "moneys.add.success": "成功将玩家 ${player} 的${coin}增加 ${amount}",
    "moneys.del.success": "成功将玩家 ${player} 的${coin}减少 ${amount}",
    "moneys.get.result": "玩家 ${player} 的${coin}为 ${amount}",
    "moneys.history.title": "玩家 ${player} 的${coin}历史记录",
    
    //Cd相关
    "cd.config.error": "§l§c打开菜单失败,配置文件的内容没有完善", 
    "cd.button.isnull":"§l§c菜单中没有任何按钮",
    "cd.yourmoney.iszero":"§l§c你没有足够的金币使用这个按钮",  
    "cd.thisbutton.error":"§l§c这个按钮的类型错误,请联系管理员处理",
    "cd.vip.deny":"§l§c会员功能未启用",
    "cd.op.deny":"§l§c你没有权限使用这个按钮,抱歉",


    // warp相关
    "warp.command.desc": "公共传送点",
    "warp.only.player": "仅限玩家执行",
    "warp.teleport.name": "传送点名称：",
    "warp.teleport.coord": "坐标：",
    "warp.teleport.cost": "传送花费：",
    "warp.teleported": "已前往传送点 ${name}",
    "warp.del.success": "删除公共传送点 ${name} 成功！",
    "warp.add.success": "添加公共传送点 ${name} 成功！",
    "warp.menu.public":"公共传送点",
    "warp.menu.public.op":"(OP)公共传送点",
    "warp.go.to":"前往传送点",
    "warp.add":"添加传送点",
    "warp.add.point":"添加公共传送点",
    "warp.del":"删除传送点",
    "warp.del.point":"删除公共传送点",
    "warp.input.name":"请输入传送点名称",
    "warp.name":"传送点名称",
    "warp.list":"传送点列表",
    "warp.add.point.xyz":"添加当前坐标为公共传送点",
    "warp.noinput.name":"传送点名称不能为空！",
    "warp.name.repetitive":"传送点名称已存在！",

    // 转账相关
    "money.transfer.title": "转账",
    "money.transfer.balance": "您的余额为: ${balance} ${coin}",
    "money.transfer.tax": "当前转账税率: ${rate}%",
    "money.transfer.input.amount": "输入数量或 'all'",
    "money.transfer.success.sender": "转账成功！您支出了 ${amount}，对方收到 ${received}。",
    "money.transfer.success.receiver": "您收到来自 ${sender} 的 ${amount} ${coin}。",
    "money.transfer.log.send": "转账给 ${target}, 数量:${amount}, 到账:${received}, 手续费:${tax}",
    "money.transfer.log.receive": "收到 ${sender} 转账, 数量:${amount}, 到账:${received}, 手续费:${tax}",
    "money.transfer.tax.notenough": "转账金额不足以支付手续费！",
    "money.create.score":"计分板项目不存在，以为您自动创建",
    "money.callback.menu":"§a正在返回经济系统主界面...",
    "money.player.list":"排行榜",
    "moneys.help":"您的语法有误！\n/moneys <name> add \n /monneys <name> del \n /moneys <name> set",
    "money.transfer":"转账",
    "moeny.view":"查看",
    "money.query":"查询",
    "money.history":"历史记录",
    "money.success":"成功",
    "money.decrease.number":"请输入要减少的",
    "money.add.number":"请输入要增加的",
    "moeny.set.number":"请输入要设置的",
    "money.history":"历史记录(最近50条)：",
    "money.no.enough": "您的余额不足！",
    "money.tr.error1":"无效的接收方！",
    "money.tr.error2":"不能给自己转账!",
    "money.tr.noonline":"目标玩家离线",
    "money.tr.noinput":"请输入转账数量!",
    "money.tr.beizhu":"转账的备注（可以留空）",
    "money.tr.amount":"输入转账数量(all为全部)",
    "money.del.number":"请输入减少数量!",
    "money.cannotpay.totax":"转账金额不足以支付手续费！",
    "moeny.setting.number":"请输入设置数量",
    "money.must.bigger0":"转账数量必须大于0！",
    "money.cannot.smaller0":"§c实际到账金额不能为负数！",
    "money.op.add":"增加玩家的",
    "money.op.remove":"减少玩家的",
    "money.op.set":"设置玩家的",
    "money.op.look":"查看玩家的",
    
     //TPA相关
    "tpa.cost":"传送将花费 ${cost} ${Scoreboard} ",
    "tpa.d":"§c拒绝",
    "tpa.d.request":"§c对方拒绝了传送请求。",
    "tpa.d.request.you":"§e你已拒绝传送请求。",
    "tpa.a":"§a同意",
    "tpa.tp.okey":"§a传送成功!",
    "tpa.accpet.request":"§a已同意传送请求。",
    "tpa.request":"§a传送请求",
    "tpa.request.cut":"§c传送中断，对方或你下线。",
    "tpa.tp.fail.noonline":"§c传送失败，目标玩家已离线。",
    "tpa.a.and.d":"§e可在表单点击【同意/拒绝】或输入 /tpayes(同意)/tpano(拒绝)",
    "tpa.name.ls":"§d互传系统",
    "tpa.tp.msg":"§a互传请求",
    "tpa.exit":"§c操作已取消。",
    "tpa.op.msg":"§c管理互传(开启后进入管理页面)",
    "tpa.op.menu":"§c管理互传",
    "tpa.send.time":"§e请求超时时间(秒)",
    "tpa.send.fail":"§c目标玩家离线,无法发送请求",
    "tpa.send.noway":"§c对方拒绝了所有传送请求",
    "tpa.send.way":"§e请求提示方式",
    "tpa.send.form":"form(对方弹窗)",
    "tpa.send.bossbar":"bossbar(血条)",
    "tpa.Enabled.lag":"§b是否启用延迟功能",
    "tpa.max.lagnumber":"§b最大延迟秒数",
    "tpa.player.offline":"§c对方(或你)下线,请求取消",
    "tpa.request.timeout":"§c传送请求已超时",
    "tpa.no.request":"§c你没有待处理的请求。",
    "tpa.input.must.number":"§c请求超时必须是正整数！",
    "tpa.must.biggerzero":"§c最大延迟必须>=0！",
    "tpa.save.conf.ok":"保存配置成功！",
    "tpa.no.callback":"§c对方已有未处理的请求, 稍后再试",
    "tpa.choose.player":"§s选择目标玩家",
    "tpa.allow.tp":"你现在 接受 所有传送请求。",
    "tpa.noallow.tp":"你现在 拒绝 所有传送请求。",
    "tpa.choose.fs":"§a传送方式",
    "tpa.to.he.she":"§a传送到对方",
    "tpa.to.here":"§e传送到我",
    "tpa.noplayer.online":"§c当前没有其他在线玩家",

    "wh.warn":"服务器启动时维护模式已启用，非OP玩家将无法加入!!!!!",
    "Upd.check":"正在检查新版本中.... 您可在config.json禁用自动更新！",
    "Upd.success":"更新成功！稍后将重载插件",
    "Upd.timeout":"获取版本信息超时，请检查网络连接",
    "Upd.json.error":"版本信息格式错误，无法解析JSON",
    "Upd.backup.now":"正在创建备份...",
    "No.backup.canuse":"没有可用的备份",
    "Upd.fail.backing":"更新失败，正在恢复备份...",
    "Upd.back.success":"已恢复到更新前的版本",
    "Upd.fail":"更新失败",
    "network.error.1":"网络连接失败，请检查网络设置或稍后重试",
    "file.permission.error'":"文件写入权限不足，请检查插件目录权限",
    "file.parse.error.":"数据解析失败，可能是服务器返回格式错误",
    "Tip1":"如有Bug请联系作者反馈！！！！",
    "Tip2":"感谢PHEyeji和小黑可爱喵提供技术支持和指导！感谢ender罗小黑提供在线网页支持！",
    "Tip3":"在线config编辑器：https://jzrxh.work/projects/yessential/config.html",
    "Version.Chinese":"版本:",
    "notice.editor":"§l§e公告编辑器",
    "notice.no.change": "§e公告内容未更改！",
    "notice.exit.edit":"已取消编辑",
    "notice.for.server":"§l§e服务器公告",
    "notice.dont.showagain":"以后进服不自动弹出(除非公告更新或停用此开关)",
    "notice.is.changed":"检测到新公告，玩家下次加入将强制显示",
    "player.not.op":"§c权限不足！",
    "gui.exit": "表单已关闭,未收到操作",
    "server.tp.ok": "传送成功！",
    "no.server.can.tp": "暂无可传送服务器!",
    "ranking.list":"排行榜",
    "no.ranking.data": "§c暂无排行榜数据！",
    "server.load.error": "服务器配置加载失败，请联系管理员！",
    "server.no.select": "§c服务器选择无效！",
    "server.from.title":"跨服传送列表",
    "choose.a.server":"请选择一个服务器",
    "server.tp.fail": "§c跨服传送失败，请检查目标服务器状态！",
    "no.server.cantpto":"server.json 内容为空或 servers 键不存在！",
    "save.notice.ok": "保存公告成功！",
    "suicide.kill.ok": "自杀执行成功！",
    "pls.input.number":"请输入增加数量!",
    "key.not.number":"请输入数字！",
    "rp.loading.error":"加载红包数据失败",
    "rp.menu.1":"红包",
    "rp.send.packet":"发送红包",
    "rp.open.packet":"领取红包",
    "rp.all.help":"红包使用帮助",
    "rp.send.amount":"要发送的红包数量：",
    "rp.send.count":"红包金额：",
    "rp.count.bigger.yourmoney":"红包总额度不能大于你的",
    "redpacket.type":"红包类型：",
    "rp.random.packet":"拼手气红包",
    "rp.average.packet":"普通红包",
    "back.to.point":"返回死亡点",
    "back.helpinfo":"§a已记录您的死亡点！使用 /back 查看所有死亡点。",
    "back.to.point.sure":"确认返回死亡点？",
    "back.choose":"§6请选择要传送的死亡点：",
    "back.list.Empty":"您没有死亡历史记录!",
    "back.successful":"返回成功！",
    "back.fail":"§c传送失败！",
    "back.choose.null":"§c选择无效！",
    "back.deathlog.error":"§c死亡点数据错误！",
    "home.tp.system":"§6§l家园传送系统",
    "home.add":"§l§a添加家",
    "home.add.input":"请输入您的家名称",
    "home.del":"§c§l删除家",
    "home.del.choose":"请选择要删除的家",
    "home.tp":"§b§l传送家",
    "home.tp.choose":"请选择要传送的家",
    "home.name.repetitive":"家名称已存在!",
    "home.name.noinput":"请输入家名称!",
    "shop.no.Eabled":"§c商店功能已关闭！",
    "shop.is.nothing" :"§c暂无商品可购买！",
    "shop.conf.error":"§c商品配置错误！",
    "shop.choose.errorthings":"§c商品选择无效！",
    "home.input.name":"请输入您的家名称",
    "home.create.new":"添加家",
    "bag.is.full":"§c背包已满，无法给予物品！",
    "rtp.onlycanusein.overworld":"§c只能在主世界使用随机传送！",
    "module.no.Enabled":"所选模块（功能）未开启！",
    "fc.error":"无法对非玩家对象执行此命令",
    "fc.error2":"你都是管理员了用这个功能干什么（）",
    "fc.success.quit":"成功退出灵魂出窍",
    "fc.success.getin":"成功进入灵魂出窍，花费§e${Fcam}金币",
    "hub.tp.check":"§l§a回城确认",
    "hub.tp.now":"§a✔ 立即传送",
    "hub.tp.notnow":"§c✘ 不是现在",
    "hub.tp.success":"§l§b[YEST] §r §a成功传送到主城！",
    "hub.tp.fail":"§l§b[YEST] §r 回城失败！原因：",
    "crash.player.ok":"成功把玩家崩溃了！",
    "crash.player.client":"§c使玩家客户端崩溃",
    "carsh.function.list":"§c崩溃功能如下",
    "weihu.msg":"服务器正在维护中，请稍后再来",
    "stop.msg":"服务器关闭\n请稍后再来",
    "pls.input.notice":"请输入公告内容，（换行用 \\n）",
    "gamerule.KeepInventory.true":"死亡不掉落已启用",
    "cannot.create.newfile":"无法创建数据存储对象",
    "rtp.search.chunks":"§a正在寻找安全的传送位置，请稍候...",
    "rtp.search.chunks2":"§e未找到理想位置，使用备用传送方案...",
    "rtp.loading.chunks3":"§7正在加载区块...",
    "rtp.loading.chunks2":"§7正在加载区块..",
    "rtp.loading.chunks1":"§7正在加载区块.",
    "rtp.cannotfind.safexyz":"§c无法找到安全的传送位置，请稍后再试",
    "rtp.tp.success":"§a传送成功！",
    "rtp.tp.success2":"§6已传送到安全高度，请自行寻找落脚点",
    "rtp.loadchunks.timeout":"§c目标区块加载超时",
    "rtp.error":"§c传送过程发生错误",
    "pvp.is.on":"§6PVP 已开启。",
    "pvp.is.off":"§6PVP 已关闭。",
    "pvp.player.isoff":"附近玩家 ${player.realName} PVP 关闭, 你无法攻击他。",
    "your.pvp.isoff":"§l§b你关闭了 PVP。",
    "then.pvp.isoff":"§l§b对方关闭了 PVP。",
    "init.success":"所有模块加载成功！",
    "init.fail":"部分模块加载失败，请检查日志",
    "choose":"选择",
    "success":"成功",
    "one":"一个",
    "player":"玩家",
    "number":"数字",
    "CoinName":"金币",
    "to":"将",
    "add":"加",
    
};

ll.registerPlugin(NAME, PluginInfo,regversion, {
    Author: "Nico6719",
    License: "GPL-3.0",
    QQ : "1584573887",
});

let lang = new JsonConfigFile(langFilePath, JSON.stringify(defaultLangContent));

let conf = new JsonConfigFile(pluginpath +"/Config/config.json",JSON.stringify({}));

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

let isSending = false

new IniConfigFile(datapath +"/NoticeSettingsData/notice.txt");

;
// 创建红包数据对象
// --- 红包系统底层优化 ---
const redpacketData = {
    path: datapath + "Redpacketdata/Redpacket.json",
    data: { nextId: 1, packets: {} },

    init() {
        try {
            const content = file.readFrom(this.path);
            if (content) this.data = JSON.parse(content);
        } catch (e) { logger.error(lang.get("rp.loading.error") + e); }
    },

    get(path) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, this.data);
    },

    set(path, value) {
        const keys = path.split('.');
        let curr = this.data;
        keys.slice(0, -1).forEach(key => {
            if (!curr[key]) curr[key] = {};
            curr = curr[key];
        });
        curr[keys[keys.length - 1]] = value;
        this.save();
    },

    delete(path) {
        const keys = path.split('.');
        let curr = this.data;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!curr[keys[i]]) return;
            curr = curr[keys[i]];
        }
        delete curr[keys[keys.length - 1]];
        this.save();
    },

    save() {
        file.writeTo(this.path, JSON.stringify(this.data, null, 2));
    }
};
    
// 异步文件操作工具类
class AsyncFileManager {
    static async readFile(path, defaultContent = '{}') {
        return new Promise((resolve, reject) => {
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
 * YEssential - 模块初始化管理器
 * 自动加载并初始化 modules 文件夹中的所有模块
 */


(function() {
  
  // 注意：require() 会自动添加 plugins/ 前缀，所以路径不需要 ./plugins/
  var BASE_PATH = "plugins/YEssential/modules/";
 
  // 从 JSON 文件读取模块列表
  var modules = [];
 try {
    var fullPath = BASE_PATH + "modulelist.json";
    
    // 1. 打印试图读取的完整路径，检查拼写和层级
    //logger.info("正在尝试读取路径: " + fullPath);
    
    var moduleListData = file.readFrom(fullPath);
    
    // 2. 打印读取到的内容类型
    //logger.info("读取到的数据类型: " + typeof moduleListData);
    
    // 3. 如果是 undefined，手动抛出更清晰的错误
    if (moduleListData == null || moduleListData == undefined) {
        throw new Error("文件存在但读取内容为空！请检查路径是否正确: " + fullPath);
    }

    var moduleList = JSON.parse(moduleListData);
    
    // ... 后续原有代码 ...
    modules = moduleList.modules.map(function(module) {
      return {
        path: BASE_PATH + module.path,
        name: module.name
      };
    });
    
  } catch (err) {
    // ...
    logger.error("读取模块列表失败: " + err);
    logger.error("请确保 " + BASE_PATH + "modulelist.json 文件存在且格式正确");
  }
  
  /**
   * 初始化所有模块
   */
  function initModules() {

    var loadedCount = 0;
    var failedCount = 0;
    var currentIndex = 0;
    
    function loadNextModule() {
      if (currentIndex >= modules.length) {
        initPvpModule();
        initFcamModule();
        let whConfig = conf.get("wh") || { EnableModule: true, status: 0 };
        stats = whConfig.status === 1;
        
        try {
            initializePlugin();
            
            if (failedCount > 0) {
                logger.warn(lang.get("init.fail"));
            } else {
                colorLog("green",lang.get("init.success"));
            }
        } catch (error) {   
            logger.error("服务器启动初始化失败: " + error.message);
            logger.error("错误堆栈: " + error.stack);
        }
        
        return;
      }
      
      var moduleInfo = modules[currentIndex];
      currentIndex++;
      
      try {
        logger.info("正在加载模块: " + moduleInfo.name + " (" + moduleInfo.path + ")");
        
        var module = require(moduleInfo.path);
        
        if (!module) {
          logger.warn("模块 " + moduleInfo.name + " 加载失败: 返回值为空");
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
          logger.info("执行模块初始化: " + moduleInfo.name + ".init()");
          module.init();
          loadedCount++;
        }
        else {
          loadedCount++;
        }
        
      } catch (err) {
        logger.error("✗ 模块 " + moduleInfo.name + " 加载失败: " + err);
        logger.error("错误堆栈: " + (err.stack || "无堆栈信息"));
        failedCount++;
      }
      
      setTimeout(loadNextModule, 10);
    }
    
    // 在开始加载模块前先打印Logo和基本信息
    printGradientLogo();
    loadNextModule();
  }
  
  setTimeout(function() {
    initModules();
  }, 10);
})();

// 渐变效果（逐字符渐变）
function printGradientLogo() {
    const logo = [
        " ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  ",
        " ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  ",
        "  ╚████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     ",
        "   ╚██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     ",
        "    ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗",
        "    ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝"
    ];
    
    // RGB颜色渐变（需要终端支持真彩色）
    function getRGBColor(r, g, b) {
        return `\x1b[38;2;${r};${g};${b}m`;
    }
    
    const reset = '\x1b[0m';
    
    logger.info(PluginInfo + lang.get("Version.Chinese") + version + ", 作者：Nico6719");
    logger.info("=".repeat(80));
    
    logo.forEach((line, lineIndex) => {
        let coloredLine = '';
        for (let i = 0; i < line.length; i++) {
            // 计算渐变颜色（从青色到紫色）
            const progress = (lineIndex * line.length + i) / (logo.length * line.length);
            const r = Math.floor(0 + progress * 138);      // 0 -> 138
            const g = Math.floor(255 - progress * 112);    // 255 -> 143
            const b = Math.floor(255);                      // 保持255
            
            coloredLine += getRGBColor(r, g, b) + line[i];
        }
        logger.log(coloredLine + reset);
    });
    
    logger.info("=".repeat(80));
    colorLog("blue",lang.get("Tip1"));
    colorLog("blue",lang.get("Tip2"));
    colorLog("blue",lang.get("Tip3"));
}
function initializePlugin() {
    // 第零步：获取并创建计分板
    const scoreboardName = conf.get("Scoreboard") || "money";
    
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
    
    // 第一步：注册PAPI
    PAPI.registerPlayerPlaceholder(getScoreMoney, "YEssential", "player_money");
    PAPI.registerPlayerPlaceholder(getLLMoney, "YEssential", "player_LLmoney");
    
    // 第二步：异步合并语言文件
    AsyncLanguageManager.mergeLangFiles();
    
    // 第三步：提示维护功能是否开启
    if (stats) {
        setTimeout(() => {
            logger.warn(lang.get("wh.warn"));
        }, 3000);
    }
    
    // 第四步：启用死亡不掉落
    if (conf.get("KeepInventory")) {
        mc.runcmdEx("gamerule KeepInventory true");
        colorLog("green", lang.get("gamerule.KeepInventory.true"));
    }
    
    // 第五步：检查公告更新
    const lastShutdown = conf.get("lastServerShutdown") || 0;
    conf.set("lastServerShutdown", Date.now());
    const lastUpdate = noticeconf.get("lastNoticeUpdate") || 0;
    if (lastUpdate > lastShutdown) {
        conf.set("forceNotice", true);
        logger.info(lang.get("notice.is.changed"));
    }
    
    // 第六步：清理残留的灵魂出窍模拟玩家
    const allPlayers = mc.getOnlinePlayers();
    allPlayers.forEach(p => {
        // FCAM 创建的模拟玩家通常以 _sp 结尾
        if (p.isSimulatedPlayer() && p.name.endsWith("_sp")) {
            logger.warn(`[Fcam] 清理残留的模拟玩家: ${p.name}`);
            p.simulateDisconnect();
        }
    });
    
    // 第七步：异步检查更新
    setTimeout(() => {
    if (conf.get("AutoUpdate")) {
        AsyncUpdateChecker.checkForUpdates(version).catch(error => {
            logger.error("后台更新检查失败: " + error.message);
        });
    }  }, 1000);
}
// 异步语言文件管理器
class AsyncLanguageManager {
    static async mergeLangFiles() {
        try {
            // 确保语言目录存在
            if (!file.exists(YEST_LangDir)) {
                file.mkdir(YEST_LangDir);
            }
            
            // 异步读取现有语言文件
            const currentLangData = await AsyncFileManager.readFile(langFilePath, JSON.stringify(defaultLangContent));
            
            // 合并数据
            const mergedData = { ...currentLangData };
            let addedCount = 0;
            
            for (const key in defaultLangContent) {
                if (!(key in mergedData)) {
                    mergedData[key] = defaultLangContent[key];
                    addedCount++;
                }
            }
            
            // 如果有新键添加，则异步写入文件
            if (addedCount > 0) {
                await AsyncFileManager.writeFile(langFilePath, mergedData);
                colorLog("green", `语言文件已更新，新增 ${addedCount} 个条目`);
                
                // 重新初始化语言对象
                lang = new JsonConfigFile(langFilePath, JSON.stringify(mergedData));
            }
        } catch (error) {
            logger.error("合并语言文件时出错: " + error.message);
        }
    }
}
function ranking(plname) {
    let pl = mc.getPlayer(plname);
    if (!pl) return;
    if (conf.get("RankingModel")==1) {
    let datas = JSON.parse(moneyranking.read());
    let lst = Object.keys(datas).map(name => ({
      name: name,
      money: datas[name]
    }));
    
    if (lst.length === 0) {
        pl.tell(info + lang.get("no.ranking.data"));
        return;
    }

    lst.sort((a, b) => b.money - a.money);
    const ranking = lst.slice(0, 50);
    const total = ranking.reduce((sum, curr) => sum + curr.money, 0);

    // 构建表单
    let form = mc.newSimpleForm()
        .setTitle(`§l§6■ 财富排行榜 ■ §r§8[前${ranking.length}名]`)
        .setContent(
            `§7服务器总财富: §6${formatMoney(total)}\n` +
            `§7统计时间: §f${new Date().toLocaleTimeString()}\n` +
            `§6点击任何按钮返回经济系统主菜单\n` +
            `§8═════════════════════`
        );

    // 添加排名条目（调整第二名颜色为亮蓝色）
    ranking.forEach((v, index) => {
        const rank = index + 1;
        const percentage = total > 0 ? (v.money / total * 100).toFixed(1) : 0;
        
        form.addButton(
            `${getRankPrefix(rank)} §l${rank}. §r${v.name}\n` +
            `§l§c├ 持有: ${formatMoney(v.money)}` +
            ` §r§l占比全服: §a${percentage} %`
        );
    });

    // 发送表单并处理交互
    pl.sendForm(form, (pl, id) => {
        // 点击任何按钮都提示并返回主菜单
        if (id !== null) {
            pl.tell(info +lang.get("money.callback.menu"));
        }
        pl.runcmd("moneygui");
    });

    // 辅助函数
    function formatMoney(amount) {
        if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M";
        if (amount >= 1e3) return (amount / 1e3).toFixed(1) + "K";
        return amount.toLocaleString();
    }

    function getRankPrefix(rank) {
        return [
            "§6★",  // 第一名 - 金色
            "§b☆",  // 第二名 - 亮蓝色（调整后）
            "§c◆",  // 第三名 - 红色
            "§a▣"   // 其他名次 - 绿色
        ][Math.min(3, rank - 1)] || "§7";
    }
    } 
    else
    {

        let form = mc.newSimpleForm();
        let str = '';
        let lst = [];
        
        // 读取并解析整个 JSON 文件
        const rawData = moneyranking.read();
        const data = rawData ? JSON.parse(rawData) : {};
        const keys = Object.keys(data);
        
        if (keys.length === 0) {
            pl.tell(info + lang.get("no.ranking.data"));
            return;
        }

        keys.forEach((v) => {
            let money = data[v]; // 直接从解析后的对象获取值
            lst.push([v, money]);
        });

        // 排序并取前50名
        lst.sort((a, b) => b[1] - a[1]);
        let ranking = lst.slice(0, 50);

        ranking.forEach((v) => {
            str += `${v[0]}: ${v[1]}\n`;
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
// 定时更新玩家金币排行榜
setInterval(() => {
    mc.getOnlinePlayers().forEach((pl) => {
        let moneyValue;
        if (conf.get("LLMoney") == 0) {
            // 使用记分板
            moneyValue = pl.getScore(conf.get("Scoreboard"));
        } else {
            // 使用LLMoney
            moneyValue = pl.getMoney();
        }
        
        if (moneyValue !== null && moneyValue !== undefined) {
            moneyranking.set(pl.realName, moneyValue);
        }
    });
}, 10000);
// 跨服传送命令模块
let Sercmd = mc.newCommand("servers", "§l§a跨服传送", PermType.Any);
Sercmd.overload([]);
Sercmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!conf.get("TRServersEnabled")) {
        pl.tell(info + lang.get("module.no.Enabled"));
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
        pl.tell(info + lang.get("server.load.error"));
        return;
    }

    if (serverList.length === 0) {
        logger.error(lang.get("no.server.cantpto"));
        pl.tell(info + lang.get("no.server.can.tp"));
        return;
    }

    // 构建表单
    let form = mc.newSimpleForm();
    form.setContent(lang.get("choose.a.server"))
    form.setTitle(lang.get("server.from.title"));
    serverList.forEach((server) => {
        form.addButton(`§l§b${server.server_name}\n§7IP: ${server.server_ip}:${server.server_port}`);
    });

    // 发送表单
    pl.sendForm(form, (pl, id) => {
        if (id === null) return;

        const targetServer = serverList[id];
        if (!targetServer) {
            pl.tell(info + lang.get("server.no.select"));
            return;
        }

        // 执行传送
        try {
            pl.transServer(targetServer.server_ip, targetServer.server_port);
            mc.broadcast(`§a[提示] ${pl.realName} 前往了 ${targetServer.server_name}`);
        } catch (e) {
            logger.error("传送失败:", e);
            pl.tell(info + lang.get("server.tp.fail"));
        }
    });
});
Sercmd.setup();
// ======================
// 管理员修改公告（GUI 表单） - 21：15 25-8-5 Add：备份功能，多行输入
// ======================
const noticeSetCmd = mc.newCommand("noticeset", "编辑公告内容", PermType.GameMasters);
noticeSetCmd.overload([]);

noticeSetCmd.setCallback((_cmd, ori, output) => {
    const pl = ori.player;
    if (!pl) return;
    
    if (!conf.get("NoticeEnabled")) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (!pl.isOP()) {
        output.error(info + lang.get("player.not.op"));
        return;
    }

    // 文件路径常量
    const noticeDir = "./plugins/YEssential/data/NoticeSettingsData/";
    const noticePath = noticeDir + "notice.txt";
    const backupPath = noticeDir + "notice.txt.bak";

    // 读取现有公告内容
    let currentNotice = "";
    if (file.exists(noticePath)) {
        currentNotice = file.readFrom(noticePath) || "";
    }

    // 递归函数处理多行表单
    const sendNoticeForm = (player, lines) => {
        const form = mc.newCustomForm()
            .setTitle(info + lang.get("notice.editor"));
        
        // 添加每行输入框
        lines.forEach((line, index) => {
            form.addInput(`§a行 ${index + 1}`, line || "");
        });
        
        // 添加控制按钮
        form.addStepSlider("操作", ["完成编辑", "添加新行", "删除最后一行"], 0);
        
        player.sendForm(form, (plr, data) => {
            if (data === null || data === undefined) {
                plr.tell(info + lang.get("notice.exit.edit"));
                return;
            }
            
            const action = data.pop(); // 获取操作类型
            const contentLines = data.map(val => val || ""); // 获取所有行内容
            
            switch (action) {
                case 0: // 完成编辑
                    const newContent = contentLines.join('\n');
                    
                    if (newContent === currentNotice) {
                        plr.tell(info + lang.get("notice.no.change"));
                        return;
                    }
                    
                    // 备份原文件
                    try {
                        if (file.exists(noticePath)) {
                            if (file.exists(backupPath)) {
                                file.delete(backupPath);
                            }
                            file.rename(noticePath, backupPath);
                            plr.tell(info + "§a原公告已备份为 notice.txt.bak");
                        }
                    } catch (e) {
                        plr.tell(info + "§c备份失败: " + e);
                    }
                    
                    // 保存新公告
                    file.writeTo(noticePath, newContent);
                    noticeconf.set("lastNoticeUpdate", Date.now());
                    plr.tell(info + lang.get("save.notice.ok"));
                    break;
                    
                case 1: // 添加新行
                    contentLines.push(""); // 添加空行
                    sendNoticeForm(plr, contentLines);
                    break;
                    
                case 2: // 删除最后一行
                    if (contentLines.length > 1) {
                        contentLines.pop();
                        sendNoticeForm(plr, contentLines);
                    } else {
                        plr.tell(info + "§c不能删除所有行，至少保留一行！");
                        sendNoticeForm(plr, contentLines); // 保持表单打开
                    }
                    break;
            }
        });
    };

    // 初始调用表单
    sendNoticeForm(pl, currentNotice.split('\n'));
});

noticeSetCmd.setup();

let = cmd = mc.newCommand("notice","公告",PermType.Any)
cmd.overload([])
cmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player;
    if (!conf.get("NoticeEnabled")) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (!pl) return;
    noticeconf.init(String(pl.realName),0)
    if(!file.exists("./plugins/YEssential/data/NoticeSettingsData/notice.txt")){
        new JsonConfigFile("./plugins/YEssential/data/NoticeSettingsData/notice.txt")
        file.writeTo("./plugins/YEssential/data/NoticeSettingsData/notice.txt"," 这是一个公告")
    }
    // 读取公告内容（支持换行）
    let content = file.readFrom("./plugins/YEssential/data/NoticeSettingsData/notice.txt") || "暂无公告";
    content = content.split("\n"); // 按换行分割

    let fm = mc.newCustomForm()
    .setTitle(info+lang.get("notice.for.server"));
    
    content.forEach(line => {
        if (line.trim() !== "") {
            fm.addLabel(line);
        }
    });

    fm.addSwitch(lang.get("notice.dont.showagain"), noticeconf.get(String(pl.realName)) != 0)
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return;
        if(data[data.length - 1] == 1){
            noticeconf.set(String(pl.realName),1)
        }else{
            noticeconf.set(String(pl.realName),0)
        }
    });
});
cmd.setup()
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

function getScoreMoney(pl) {
    let ScoreMoney = pl.getScore(conf.get("Scoreboard"))
    return  ScoreMoney.toString();
}
function getLLMoney(pl){
    let LLMoney = pl.getMoney();
    return LLMoney.toString();

}
// 金币信息显示函数
function displayMoneyInfo(pl, target, isSelf = true) {
    if (!pl || !target) return "信息获取失败";
    const prefix = isSelf ? "你的" : `玩家 ${target.realName} 的`;
    
    if (!conf.get("LLMoney")) {
        const money = target.getScore(conf.get("Scoreboard"));
        pl.sendText(info + `${prefix}当前金币为：${money}`);
        return `${prefix}${lang.get("CoinName")}为: ${money}`;
    } else {
        const money = target.getMoney();
        pl.sendText(info + `${prefix}当前LLMoney金币为：${money}`);
        return `${prefix}${lang.get("CoinName")}为: ${money}`;
    }
}
mc.listen("onJoin", (pl) => {
    if (conf.get("forceNotice")) {
        conf.set("forceNotice", false);
        noticeconf.set(pl.realName, 0);
    }
    // 异步公告显示
    if (conf.get("join_notice") == 1) {
            setTimeout(() => {
                if (!mc.getPlayer(pl.realName)) return;
                if (noticeconf.get(String(pl.realName)) == 1) return;
                if (!conf.get("NoticeEnabled")) return;
                pl.runcmd("notice");
            }, 1000);
        }
});
  
mc.listen("onJoin",(pl)=>{
   try {
        // 初始化玩家数据
        homedata.init(pl.realName, {});
        rtpdata.init(pl.realName, {});
        MoneyHistory.init(pl.realName, {});
        setTimeout(() => {
        // 初始化金币
        if (conf.get("LLMoney") == 1) {
            let currentMoney = pl.getMoney();
            if (currentMoney === null || currentMoney === undefined) {
                pl.setMoney(0);
            }
        } else {
            let score = pl.getScore(conf.get("Scoreboard"));
            if (!score) pl.setScore(conf.get("Scoreboard"), 0);
        }
    }, 2000);
    } catch (error) {
        logger.error(`玩家 ${pl.realName} 加入事件处理失败: ${error.message}`);
    }
});
mc.listen("onConsoleCmd",(cmd)=>{
    if(cmd.toLowerCase() != "stop" || lang.get("stop.msg") == 0 ) return
    let msg = lang.get("stop.msg")
    mc.getOnlinePlayers().forEach((pl)=>{
        pl.disconnect(msg)
    })

    mc.runcmdEx("stop")  //再次尝试
})
//经验球优化相关
if (conf.get("OptimizeXporb") == 1 )
    {
setInterval(() => {
  mc.runcmdEx("execute as @e[type=xp_orb] at @s run tp @p")
}, 1000*10);
}  else{ }  
//自杀模块

let suicidecmd = mc.newCommand("suicide","自杀",PermType.Any)
suicidecmd.overload([])
suicidecmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,conf.get("suicide"))) return pl.tell(info + lang.get("money.no.enough"));
    }else{
            if(!LLValueCheck(pl.realName,conf.get("suicide"))) return pl.tell(info + lang.get("money.no.enough"));
    }
    pl.tell(info + lang.get("suicide.kill.ok"));
    pl.kill()

})
suicidecmd.setup()



function initPvpModule() {
    // 1. 基础检查
    if (!conf.get("PVP").EnabledModule) {
        return;
    }

    // 2. 注册 PVP 命令
    const pvp = mc.newCommand("pvp", "设置是否 PVP。", PermType.Any);
    pvp.optional("bool", ParamType.Bool);
    pvp.overload(["bool"]);

    pvp.setCallback(function (_cmd, ori, out, res) {
        if (!ori.player) return;
        const player = ori.player;
        const xuid = player.realName;

        // 再次检查全局开关
        if (!conf.get("PVP").EnabledModule) {
            player.tell(info + lang.get("module.no.Enabled"));
            return;
        }

        const currentState = pvpConfig.get(xuid, false);
        let newState = false;

        if (res.bool === undefined) {
            newState = !currentState;
        } else {
            newState = res.bool;
        }

        pvpConfig.set(xuid, newState);
        out.success(info + (newState ? lang.get("pvp.is.on") : lang.get("pvp.is.off")));
    });
    pvp.setup();

    // 3. 监听玩家加入 (初始化状态)
    mc.listen("onJoin", function (player) {
        const xuid = player.realName;
        if (pvpConfig.get(xuid) === undefined) {
            pvpConfig.set(xuid, false);
        }
    });

    // 4. 监听实体爆炸 (核心修改部分)
    mc.listen("onEntityExplode", (source, pos, radius, maxResistance, isDestroy, isFire) => {
        // 如果位置不存在，无法判断距离，直接放行（防止报错）
        if (!pos) return true;
        //logger.warn("PVPDebug"+source.type)
        // ===== 1. PVP 模块开关 =====
        const pvpSettings = conf.get("PVP");
        if (!pvpSettings || !pvpSettings.EnabledModule) {
            return true;
        }

        // 【修改点】：移除了 DangerousBlocks 的检测逻辑
        // 之前的逻辑是：如果爆炸物不在名单里，就放行。这导致模组物品无法被拦截。
        // 现在的逻辑是：不论是谁炸的，只要旁边有不开PVP的玩家，就拦截。

        // ===== 2. 扫描附近玩家 =====say
        // 设定保护范围，至少保护 6 格，或者爆炸半径
        const range = Math.max(radius, 6);
        const players = mc.getOnlinePlayers();

        for (const player of players) {
            const p = player.pos;
            // 必须在同一维度
            if (p.dimid !== pos.dimid) continue;

            const dx = Math.abs(p.x - pos.x);
            const dy = Math.abs(p.y - pos.y);
            const dz = Math.abs(p.z - pos.z);

            // 如果玩家在爆炸范围内
            if (dx <= range && dy <= range && dz <= range) {
                const pvpState = pvpConfig.get(player.realName, false);

                // 如果该玩家关闭了 PVP
                if (!pvpState) {
                    try {
                        // 提示玩家（可选）
                        player.sendToast(
                            info,
                            lang.get("pvp.player.isoff").replace("${player.realName}", player.realName)
                        );
                    } catch (e) {
                        logger.error("onEntityExplode 事件处理警告: " + e);
                    }
                    
                    // 【核心】：直接返回 false 拦截爆炸
                    // 这样就像“无敌时间”一样，强制阻止伤害和破坏
                    return false;
                }
            }
        }

        return true;
    });
    // 4. 监听实体爆炸 (优化判定版)
    mc.listen("onEntityExplode", (source, pos, radius, maxResistance, isDestroy, isFire) => {
        if (!pos) return true;

        const pvpSettings = conf.get("PVP");
        if (!pvpSettings || !pvpSettings.EnabledModule) return true;

        // 获取所有在线玩家
        const allPlayers = mc.getOnlinePlayers();
        
        // 1. 第一步：筛选出在【范围5】内的所有玩家
        let playersNearby = allPlayers.filter(player => {
            const p = player.pos;
            // 维度检查
            if (p.dimid !== pos.dimid) return false;
            
            // 使用标准的 3D 距离公式计算 (更精准)
            const dist = Math.sqrt(
                Math.pow(p.x - pos.x, 2) + 
                Math.pow(p.y - pos.y, 2) + 
                Math.pow(p.z - pos.z, 2)
            );
            return dist <= 5; 
        });

        // 2. 第二步：人数判定
        // 只有附近有 2 个或更多人时，才执行拦截检查
        if (playersNearby.length >= 2) {
            // 检查这几个人里有没有人关了 PVP
            for (const p of playersNearby) {
                const isPvpOff = !pvpConfig.get(p.realName, false);
                if (isPvpOff) {
                    // 只要有一个人没开PVP，为了保护他，直接拦截整个爆炸
                    p.sendToast(info, "检测到多人聚集且您处于PVP保护，已拦截爆炸");
                    return false; 
                }
            }
        }

        // 只有 1 个人，或者附近的人全部都开了 PVP，则不拦截
        return true;
    });

    // 5. 补充拦截：如果爆炸事件没拦住，在伤害阶段强制拦截伤害 (类似无敌时间插件)
    mc.listen("onMobHurt", (mob, source, damage, cause) => {
        if (!mob.isPlayer()) return true;
        const victim = mob.toPlayer();
        const victimPvpOff = !pvpConfig.get(victim.realName, false);

        // 如果玩家关闭了 PVP，且伤害来源是爆炸 (cause 2:实体爆炸, 3:方块爆炸)
        if (victimPvpOff && (cause === 2 || cause === 3)) {
            
            // 同样执行人数检查：受害者坐标 5 格内是否有其他人
            const p = victim.pos;
            const nearbyCount = mc.getOnlinePlayers().filter(other => {
                const op = other.pos;
                if (op.dimid !== p.dimid) return false;
                const dist = Math.sqrt(Math.pow(op.x - p.x, 2) + Math.pow(op.y - p.y, 2) + Math.pow(op.z - p.z, 2));
                return dist <= 5;
            }).length;

            // 如果附近有 2 人以上且受害者关了 PVP，伤害降为 0 (彻底无敌)
            if (nearbyCount >= 2) {
                return false; 
            }
        }
        return true;
    });
    // 5. 监听物理攻击伤害 (PVP)
    mc.listen("onMobHurt", function (mob, source, damage, cause) {
        if (!mob.isPlayer()) return true;

        const victim = mob.toPlayer();

        // 全局 PVP 开关
        if (!conf.get("PVP").EnabledModule) return true;

        // 玩家互殴检测
        if (source && source.isPlayer()) {
            const attacker = source.toPlayer();
            const attackerPVP = pvpConfig.get(attacker.realName, false);
            const victimPVP = pvpConfig.get(victim.realName, false);

            if (!attackerPVP) {
                attacker.tell(lang.get("your.pvp.isoff"), 4);
                return false;
            } else if (!victimPVP) {
                attacker.tell(lang.get("then.pvp.isoff"), 4);
                return false;
            }
        }

        // 【额外建议】：为了像 LKinvincibleTime 一样彻底，
        // 如果爆炸拦截漏网（例如非实体爆炸），可以在这里通过 cause 再次拦截伤害
        const victimPVP = pvpConfig.get(victim.realName, false);
        // 如果是爆炸伤害 (cause 2 或 3 通常是爆炸) 且玩家 PVP 关闭
        if (!victimPVP && (cause === 2 || cause === 3 || cause === 11)) {
            return false;
        }

        // mob.stopFire(); // 可选
        return true;
    });
}
function Motd(){
    let motds = conf.get("Motd")
    if(motds == []) return
    
    let items = motds
    let index = 0;
    let intervalId; // 存储 setInterval 的返回值，以便后续清除
    
    intervalId = setInterval(() => {
        let item = items[index];
        index = (index + 1) % items.length; // 计算下一个元素的索引，如果到达末尾则回到开头
        mc.setMotd(item)
    }, 5000); // 每 5000 毫秒（即 5下· 秒）执行一次
}

// 灵魂出窍（FCAM）
function initFcamModule() {
    // 注册命令
    let cmd = mc.newCommand("fcam", "灵魂出窍", PermType.Any);
    cmd.overload([]);

    // 存储玩家的 BossBar 数据
    const fcamBossBars = new Map();

    cmd.setCallback((_cmd, ori, out, _res) => {
        let pl = ori.player;
        if (!pl) {
            out.error(info + lang.get("fc.error"));
            return;
        }

        let plname = pl.realName;
        let plpos = ori.pos;
        let timeout = conf.get("Fcam").TimeOut;
        let FcamCost = conf.get("Fcam").CostMoney;

        if (conf.get("Fcam").EnableModule == 0) {
            pl.tell(info + lang.get("module.no.Enabled"));
            return;
        }
        //===============================
        // 退出灵魂出窍模式
        //===============================
        if (pl.gameMode == 6) {
            // 清理 BossBar 和计时器
            cleanupFcamBossBar(plname);

            try { pl.setGameMode(0); } catch (e) {
                logger.error("FCAM: setGameMode 恢复失败: " + e);
            }

            try { mc.runcmdEx(`tp "${plname}" "${plname}_sp"`); } catch (e) {
                logger.error("FCAM: TP 回原位失败: " + e);
            }

            let spl = mc.getPlayer(plname + "_sp");
            if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                try { spl.simulateDisconnect(); } catch (e) {
                    logger.error("FCAM: simulateDisconnect 失败: " + e);
                }
            } else {
                logger.warn(`FCAM: 未找到模拟玩家 ${plname}_sp，跳过断开`);
            }

            out.success(info + lang.get("fc.success.quit"));
            return;
        }

        //===============================
        // 进入灵魂出窍模式
        //===============================

        // 费用判断
        if (!conf.get("LLMoney")) {
            if (!ValueCheck(pl.realName, FcamCost))
                return pl.tell(info + lang.get("money.no.enough"));
        } else {
            if (!LLValueCheck(pl.realName, FcamCost))
                return pl.tell(info + lang.get("money.no.enough"));
        }

        // 创建模拟玩家
        mc.spawnSimulatedPlayer(plname + "_sp", plpos);
        mc.runcmdEx(`gamemode spectator "${plname}_sp"`);
        pl.setGameMode(6);

        out.success(info + lang.get("fc.success.getin").replace("${Fcam}", FcamCost));

        //===============================
        // 灵魂出窍倒计时 BossBar  
        //===============================
        if (timeout > 0) {
            startFcamBossBar(pl, plname, timeout);
        }
    });

    cmd.setup();

    // 启动 BossBar 倒计时
    function startFcamBossBar(pl, plname, timeout) {
        let remain = timeout;
        const bossId = Number(`10${plname.length}${Date.now()}`); // 保证唯一

        // 初次显示 BossBar
        pl.setBossBar(
            bossId,
            `§e灵魂出窍剩余 §c${remain} §e秒`,
            100,
            3 // green
        );

        // 存储 BossBar 数据
        fcamBossBars.set(plname, {
            bossId: bossId,
            timer: null,
            remain: remain,
            totalTime: timeout
        });

        // 设置计时器，每秒更新一次
        const timer = setInterval(() => {
            const data = fcamBossBars.get(plname);
            if (!data) {
                clearInterval(timer);
                return;
            }

            data.remain--;
            
            // 检查玩家是否还在线且处于观察者模式
            const currentPlayer = mc.getPlayer(plname);
            if (!currentPlayer || currentPlayer.gameMode !== 6) {
                cleanupFcamBossBar(plname);
                return;
            }

            if (data.remain <= 0) {
                // 时间到，自动退出灵魂出窍模式
                cleanupFcamBossBar(plname);
                
                try { 
                    currentPlayer.setGameMode(0); 
                    mc.runcmdEx(`tp "${plname}" "${plname}_sp"`);
                    
                    let spl = mc.getPlayer(plname + "_sp");
                    if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                        spl.simulateDisconnect();
                    }
                    
                    currentPlayer.tell(info + "§c灵魂出窍时间已到，已自动退出！");
                } catch (e) {
                    logger.error("FCAM: 自动退出失败: " + e);
                }
                return;
            }

            // 更新 BossBar
            const progress = (data.remain / data.totalTime) * 100;
            let color = 3; // green
            if (data.remain <= 10) {
                color = 4; // YELLOW 当剩余10秒时变为黄色
            }
            if (data.remain <= 5) {
                color = 2; // PINK 当剩余5秒时变为粉色闪烁
            }

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

        // 更新计时器引用
        fcamBossBars.get(plname).timer = timer;
    }

    // 清理 BossBar 和计时器
    function cleanupFcamBossBar(plname) {
        const data = fcamBossBars.get(plname);
        if (data) {
            // 清除计时器
            if (data.timer) {
                clearInterval(data.timer);
            }
            
            // 移除 BossBar
            const player = mc.getPlayer(plname);
            if (player && data.bossId) {
                try {
                    player.removeBossBar(data.bossId);
                } catch (e) {
                    logger.error("FCAM: 移除 BossBar 失败: " + e);
                }
            }
            
            // 从 Map 中移除
            fcamBossBars.delete(plname);
        }
    }

    // 监听玩家退出事件，清理对应的 BossBar
    mc.listen("onLeft", (player) => {
        const plname = player.realName;
        cleanupFcamBossBar(plname);
        
        // 断开模拟玩家
        let spl = mc.getPlayer(plname + "_sp");
        if (spl) {
            spl.simulateDisconnect();
        }
    });

    // 监听玩家加入事件
    mc.listen("onJoin", (pl) => {
        let plname = pl.realName;
        if (pl.isOP()) {
            return;
        }
        pl.setGameMode(0)
        setTimeout(() => {
            mc.runcmdEx(`tp ${plname} ${plname + "_sp"}`)
        }, 1000);
    });
}

//维护模块
// 初始化维护状态变量，从配置读取
let whConfig = conf.get("wh") || { EnableModule: true, status: 0 };
let stats = whConfig.status === 1;

let whcmd = mc.newCommand("wh", "维护模式", PermType.GameMasters)
whcmd.overload([])
whcmd.setCallback((cmd, ori, out, res) => {
    // 检查模块是否启用
    let currentConfig = conf.get("wh") || { EnableModule: true, status: 0 };
    if (!currentConfig.EnableModule) {
        out.error("维护模式模块未启用");
        return;
    }
    
    // 切换状态
    stats = !stats;
    let newStatus = stats ? 1 : 0;
    
    // 更新配置
    currentConfig.status = newStatus;
    conf.set("wh", currentConfig);
    
    let pl = ori.player;
    out.success(`维护模式已${stats ? "开启" : "关闭"}`);

    if (stats) {
        mc.getOnlinePlayers().forEach((player) => {
            if (player.isSimulatedPlayer()) return;
            if (player.isOP()) return;
            player.kick(lang.get("weihu.msg"));
        });
    }
})
whcmd.setup()

mc.listen("onPreJoin", (pl) => {
    // 检查模块是否启用
    let currentConfig = conf.get("wh") || { EnableModule: true, status: 0 };
    if (!currentConfig.EnableModule) return;
    
    if (pl.isSimulatedPlayer()) return;
    if (pl.isOP()) return;
    if (stats) {
        pl.kick(lang.get("weihu.msg"));
    }
})

function getRandomLetter() {
    // 获取当前时间的毫秒数
    let ms = new Date().getTime();
    // 使用 Math.random 生成一个 0 到 1 之间的随机数，并乘以 26
    let randomIndex = Math.floor(Math.random() * 26);
    // 将随机数转换为对应的 ASCII 码，65 是 'A' 的 ASCII 码
    let charCode = 65 + randomIndex;
    // 将 ASCII 码转换为字符
    let letter = String.fromCharCode(charCode);
    return letter;
}
// moneys指令相关
const moneycmd = mc.newCommand("moneys", lang.get("CoinName"), PermType.GameMasters);
moneycmd.mandatory("option", ParamType.String);
moneycmd.optional("player", ParamType.String);
moneycmd.optional("amount", ParamType.Int);
moneycmd.overload(["option", "player", "amount"]);

moneycmd.setCallback((cmd, ori, out, res) => {
    const pl = mc.getPlayer(res.player);
    if (!pl) return out.error(info+lang.get("money.tr.noonline"));

    const coinName = lang.get("CoinName");
    const playerName = lang.get("player"); 
    const moneyhisdata = MoneyHistory.get(pl.realName);
    const timestamp = `${system.getTimeStr()}§${getRandomLetter()}`;

    const logHistory = (action, amount) => {
        moneyhisdata[timestamp] = `${coinName}${action}${amount}`;
        MoneyHistory.set(pl.realName, moneyhisdata);
    };

    const actions = {
        set: () => {
            // 验证 amount 参数
            if (res.amount === undefined || res.amount === null) {
                return out.error("§c请指定数量！用法: /moneys set <玩家> <数量>");
            }
            Economy.execute(pl, 'set', res.amount);
            logHistory(lang.get("money.op.set"), res.amount);
            out.success(info + lang.get("moneys.set.success")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", res.amount));
        },
        add: () => {
            // 验证 amount 参数
            if (res.amount === undefined || res.amount === null) {
                return out.error("§c请指定数量！用法: /moneys add <玩家> <数量>");
            }
            Economy.execute(pl, 'add', res.amount);
            logHistory(lang.get("money.op.add"), res.amount);
            out.success(info + lang.get("moneys.add.success")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", res.amount));
        },
        del: () => {
            // 验证 amount 参数
            if (res.amount === undefined || res.amount === null) {
                return out.error("§c请指定数量！用法: /moneys del <玩家> <数量>");
            }
            Economy.execute(pl, 'reduce', res.amount);
            logHistory(lang.get("money.op.remove"), res.amount);
            out.success(info + lang.get("moneys.del.success")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", res.amount));
        },
        get: () => {
            const balance = Economy.get(pl);
            out.success(info + lang.get("moneys.get.result")
                .replace("${player}", res.player)
                .replace("${coin}", coinName)
                .replace("${amount}", balance));
        },
        history: () => {
            const items = Object.entries(moneyhisdata).slice(0, 50);
            out.success(info + lang.get("moneys.history.title")
                .replace("${player}", res.player)
                .replace("${coin}", coinName));
            items.forEach(([key, value]) => out.success(`${key}: ${value}`));
        }
    };

    // 验证操作是否存在
    if (!actions[res.option]) {
        return out.error("§c无效的操作！可用操作: set, add, del, get, history");
    }

    actions[res.option]();
});
moneycmd.setup();
let moneygui = mc.newCommand("moneygui",lang.get("CoinName"),PermType.Any)
moneygui.overload([])
moneygui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error("仅限玩家执行")
    if(pl.isOP()){
        OPMoneyGui(pl.realName)
    }else{
        MoneyGui(pl.realName)
    }

})
moneygui.setup()

function MoneyGui(plname){
    let pl = mc.getPlayer(plname)
    let target = mc.getPlayer(plname)
    if(!pl) return

    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("CoinName"))
    fm.addButton(lang.get("money.query")+lang.get("CoinName"), "textures/ui/MCoin")
    fm.addButton(lang.get("money.transfer")+lang.get("CoinName"), "textures/ui/trade_icon")
    fm.addButton(lang.get("moeny.view")+lang.get("CoinName")+lang.get("money.history"), "textures/ui/book_addtextpage_default")
    fm.addButton(lang.get("CoinName")+lang.get("money.player.list"), "textures/ui/icon_book_writable")
    if (conf.get("RedPacket").EnabledModule== 1){
    fm.addButton(lang.get("rp.menu.1"),"textures/ui/gift_square")
    } else {}
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        switch(id){
           case 0:
                let fm = mc.newSimpleForm()
                fm.setTitle(lang.get("money.query") + lang.get("CoinName"))
                const content = displayMoneyInfo(pl, pl); // 查询自己
                fm.setContent(content);
                pl.sendForm(fm, (pl, id) => {
                if (id === null) return pl.runcmd("moneygui");
                });
                break;
            case 1:
                MoneyTransferGui(pl.realName)
                break
            case 2:
                let moneyhisdata = MoneyHistory.get(pl.realName)
                let jsonStr = JSON.stringify(moneyhisdata);
                let items = jsonStr.slice(1, jsonStr.length - 1).split(',');
                let count = 0
                let str;
                for (let i = items.length - 1; i >= 0; i--) {
                    let item = items[i];
                    if (count >= 50) {
                        break;
                    }
                    str = (str ? str : "") + item + "\n";
                }
                let fm2 = mc.newSimpleForm()
                fm2.setTitle("你的"+lang.get("CoinName")+lang.get("money.history"))
                fm2.setContent(str)
                pl.sendForm(fm2,(pl,id)=>{
                    if(id == null) return pl.runcmd("moneygui")
                })
                break
            case 3:
                ranking(pl.realName)
                break
            case 4:
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
                sendFm.addInput(lang.get("rp.send.amount"), "请输入红包个数");
                sendFm.addInput(lang.get("rp.send.count"), "请输入总金额");

                pl.sendForm(sendFm, (pl, data) => {
                    if (data === null) return pl.runcmd("moneygui");

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
                        return pl.sendText(info + lang.get("rp.count.bigger.yourmoney") + lang.get("CoinName"));
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
                pl.runcmd("redpackethelp");
                break;
        }
    });
}

function OPMoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    let fm = mc.newSimpleForm()
    fm.setTitle("(OP)"+lang.get("CoinName"))
    fm.addButton(lang.get("money.op.add")+lang.get("CoinName"),"textures/ui/icon_best3")
    fm.addButton(lang.get("money.op.remove")+lang.get("CoinName"),"textures/ui/redX1")
    fm.addButton(lang.get("money.op.set")+lang.get("CoinName"), "textures/ui/gear")
    fm.addButton(lang.get("money.op.look")+lang.get("CoinName"), "textures/ui/MCoin")
    fm.addButton("查看玩家的"+lang.get("CoinName")+"历史记录", "textures/ui/book_addtextpage_default")
    fm.addButton("全服"+lang.get("CoinName")+"排行榜", "textures/ui/icon_book_writable")
    fm.addButton("使用玩家的金钱菜单", "textures/ui/icon_multiplayer")
    if (conf.get("RedPacket").EnabledModule== 1){
    fm.addButton(lang.get("rp.menu.1"),"textures/ui/gift_square")
    } else {}
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        switch(id){
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
                MoneyGetGui(pl.realName)
                break
            case 4:
                MoneyHistoryGui(pl.realName)
                break
            case 5:
                ranking(pl.realName)
                break
            case 6:
                MoneyGui(pl.realName)
                break
            case 7:
                redpacketgui(pl.realName)
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
        
        const coinName = lang.get("CoinName");
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
                ? `§a你离线期间收到了 ${totalChange} ${coinName}`
                : `§c你离线期间扣除了 ${Math.abs(totalChange)} ${coinName}`;
            player.tell(message);
        }
        
    }
};

// --- 改进的 Economy 核心 ---
const Economy = {
    isScoreboard: () => conf.get("LLMoney") == 0,
    getObjName: () => conf.get("Scoreboard"),
    
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
            logger.info(`[Economy] 玩家 ${playerName} 离线，操作已缓存: ${type} ${amount}`);
            return true; // 返回成功，因为已缓存
        }
    }
};

// --- 玩家加入事件监听 ---
mc.listen("onJoin", (player) => {
    // 应用离线货币操作
    OfflineMoneyCache.apply(player);
});
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
 * 通用的管理员金币操作逻辑 (设置/增加/减少)
 */
function handleAdminOp(pl, target, opType, actionText, inputLabel) {
    const fm = mc.newCustomForm();
    fm.setTitle(`${actionText} ${target.realName} 的 ${lang.get("CoinName")}`);
    fm.addInput(inputLabel, "请输入数字");
    
    pl.sendForm(fm, (admin, data) => {
        if (data == null) return;
        
        const inputVal = data[0];
        if (!inputVal || inputVal.trim() === "") {
            return admin.tell(info + lang.get("moeny.setting.number")); // 使用原本的提示key
        }
        
        const amount = Number(inputVal);
        if (isNaN(amount)) return admin.tell(info + lang.get("key.not.number"));
        
        // 执行经济操作
        Economy.execute(target, opType, amount);
        
        // 记录日志 (修复了原代码存错人的Bug)
        const logMsg = `${lang.get("CoinName")}${actionText}${amount} (操作员: ${admin.realName})`;
        Logger.add(target.realName, logMsg);
        
        // 发送反馈
        admin.sendText(`${info}${lang.get("success")}${lang.get("to")}${lang.get("player")}${target.realName}的${lang.get("CoinName")}${actionText}${amount}`);
        admin.sendText(`${info}玩家当前金币为：${Economy.get(target)}`);
    });
}

// --- 3. 功能入口函数 ---

// [查看历史]
function MoneyHistoryGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, `查看玩家${lang.get("CoinName")}历史`, (target) => {
        const historyData = MoneyHistory.get(target.realName);
        
        pl.sendText(`玩家 ${target.realName} 的 ${lang.get("CoinName")} ${lang.get("money.history")}`);
        
        if (!historyData || Object.keys(historyData).length === 0) {
            return pl.sendText("暂无记录");
        }
        const logs = Object.values(historyData).reverse();
        
        // 只显示前 50 条
        logs.slice(0, 50).forEach(log => {
            pl.sendText(log);
        });
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
    const taxRate = conf.get("PayTaxRate");
    const coinName = lang.get("CoinName");

    const fm = mc.newCustomForm();
    fm.setTitle(lang.get("money.transfer.title") + coinName);
    fm.addLabel(lang.get("money.transfer.balance")
        .replace("${balance}", myBalance)
        .replace("${coin}", coinName) + "\n" + 
        lang.get("money.transfer.tax").replace("${rate}", taxRate));
    fm.addDropdown(lang.get("choose") + lang.get("one") + lang.get("player"), playerNames);
    fm.addInput(lang.get("money.tr.amount"), lang.get("money.transfer.input.amount"));
    fm.addInput(lang.get("money.tr.beizhu"), lang.get("money.tr.beizhu"));

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

        player.sendText(info + lang.get("money.transfer.success.sender")
            .replace("${amount}", finalAmount)
            .replace("${received}", actualReceived));
        target.sendText(info + lang.get("money.transfer.success.receiver")
            .replace("${sender}", player.realName)
            .replace("${amount}", actualReceived)
            .replace("${coin}", coinName) + noteMsg);
    });
}
// [查询余额]
function MoneyGetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.look") + lang.get("CoinName"), (target) => {
        // 假设 displayMoneyInfo 是外部定义的函数，保持调用
        displayMoneyInfo(pl, target, false); 
    });
}

// [设置余额]
function MoneySetGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.set") + lang.get("CoinName"), (target) => {
        handleAdminOp(
            pl, target, 'set', 
            "设置", 
            lang.get("moeny.set.number") + lang.get("CoinName")
        );
    });
}

// [减少余额]
function MoneyReduceGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    // 修复了原代码第一行 const amount = Number(data[1]) 导致的崩溃
    openPlayerSelectionGui(pl, lang.get("money.op.remove") + lang.get("CoinName"), (target) => {
        handleAdminOp(
            pl, target, 'reduce', 
            "减少", 
            lang.get("money.decrease.number") + lang.get("CoinName")
        );
    });
}

// [增加余额]
function MoneyAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    openPlayerSelectionGui(pl, lang.get("money.op.add") + lang.get("CoinName"), (target) => {
        handleAdminOp(
            pl, target, 'add', 
            "增加", 
            lang.get("money.add.number") + lang.get("CoinName")
        );
    });
}

const warpgui = mc.newCommand("warp", "公共传送点", PermType.Any);
warpgui.overload([]);
warpgui.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error("仅限玩家执行");
    
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
        const cost = conf.get("Warp");
        
        const confirmFm = mc.newCustomForm();
        confirmFm.setTitle(lang.get("warp.go.to"));
        confirmFm.addLabel(lang.get("warp.teleport.name") + warpName);
        confirmFm.addLabel(lang.get("warp.teleport.coord") + `${warpInfo.x},${warpInfo.y},${warpInfo.z} ${transdimid[warpInfo.dimid]}`);
        confirmFm.addLabel(lang.get("warp.teleport.cost") + cost);
        confirmFm.addLabel(displayMoneyInfo(pl, pl, true));
        
        pl.sendForm(confirmFm, (pl, data) => {
            if (data == null) return pl.tell(info + lang.get("gui.exit"));
            
            if (Economy.get(pl) < cost) {
                return pl.tell(info + lang.get("money.no.enough"));
            }
            
            Economy.execute(pl, 'reduce', cost);
            pl.teleport(
                parseFloat(warpInfo.x),
                parseFloat(warpInfo.y),
                parseFloat(warpInfo.z),
                parseInt(warpInfo.dimid)
            );
            pl.sendText(info +lang.get("warp.teleported").replace("${name}", warpName));
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
    fm.addInput(lang.get("warp.input.name"), lang.get("warp.name"));
    
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


mc.listen("onRespawn",(pl)=>{
    if(conf.get("BackTipAfterDeath")) {
         setTimeout(() => {
            BackGUI(pl.realName)
            }, 100);
    }
})
// 存储玩家死亡点数据
let deathPoints = {};

// 监听玩家死亡事件记录死亡点
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

let backcmd = mc.newCommand("back", "返回死亡点", PermType.Any)
backcmd.overload([])
backcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player
    if (!pl) return out.error("仅限玩家执行")
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
    
    let cost = conf.get("Back")
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
    fm.addLabel("传送需要花费" + cost + lang.get("CoinName"))
    
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
        if (!conf.get("LLMoney")) {
            if (!ValueCheck(pl.realName, conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
        } else {
            if (!LLValueCheck(pl.realName, conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
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
    if (!pl) return out.error("仅限玩家执行")
    
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

    if(!pl) return out.error("仅限玩家执行")        
    
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
    let cost = conf.get("Home").tp
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
        fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("传送家需要花费"+cost+lang.get("CoinName"))
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.runcmd("home")
            if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,cost)) return pl.sendText(info+"传送失败！\n传送家需要花费 "+conf.get("Home").tp+lang.get("CoinName"))
            }else{
            if(!LLValueCheck(pl.realName,cost)) return pl.sendText(info+"传送失败！\n传送家需要花费 "+conf.get("Home").tp+lang.get("CoinName"))
            }
            pl.teleport(parseFloat(pldata[lst[id]].x),parseFloat(pldata[lst[id]].y),parseFloat(pldata[lst[id]].z),parseInt(pldata[lst[id]].dimid))
            pl.sendText(info+"传送家 "+lst[id]+" 成功！")
        })
    })
}

function DelHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Home").del
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
        fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("删除家需要花费"+cost+lang.get("CoinName"))
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.tell(info + lang.get("gui.exit"));
            if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,cost)) return pl.sendText(info+"删除失败！\n删除家需要花费 "+conf.get("Home").del+lang.get("CoinName"))
            }else{
            if(!LLValueCheck(pl.realName,cost)) return pl.sendText(info+"删除失败！\n删除家需要花费 "+conf.get("Home").del+lang.get("CoinName"))
            }
            delete pldata[lst[id]]
            homedata.set(pl.realName,pldata)
            pl.sendText(info+"删除家 "+lst[id]+" 成功！")
            
    })
    })
}

function AddHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Home").add

    let HomeCount = conf.get("Home").MaxHome
    let pldata = homedata.get(pl.realName)
    if(Object.keys(pldata).length >= HomeCount) return pl.sendText(info+"您的家数量已达到上限值:"+HomeCount+"!")
        let fm = mc.newCustomForm()
        fm.setTitle(lang.get("home.add"))
        fm.addLabel("当前坐标："+String(pl.pos))
        fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("添加花费："+String(cost)+lang.get("CoinName"))
        fm.addInput((lang.get("home.add.input")))
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.runcmd("home")
            if(data[3] == "" || !data[3]) return pl.tell(info + lang.get("home.name.noinput"));
            let pldata = homedata.get(pl.realName)
            if(Object.keys(pldata).includes(data[3])) return pl.tell(info + lang.get("home.name.repetitive"));
            if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText(info+"添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }else{
            if(!LLValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText(info+"添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }
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
let tpaSettingsCmd = mc.newCommand("tpasettings", "设置是否接收传送请求", PermType.Any);
tpaSettingsCmd.overload([]);
tpaSettingsCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return;
    let playerSettings = tpacfg.get(pl.realName);
    if (!playerSettings) {
        playerSettings = { acceptTpaRequests: true };
        tpacfg.set(pl.realName, playerSettings);
    }

    const currentSetting = playerSettings.acceptTpaRequests;
    const newSetting = !currentSetting;

    tpacfg.set(pl.realName, {
        ...playerSettings,
        acceptTpaRequests: newSetting
    });
    
    if (newSetting) {
        pl.sendText(info+lang.get("tpa.allow.tp"));
        }else{
        pl.sendText(info+lang.get("tpa.noallow.tp"));
        }
});
tpaSettingsCmd.setup();
mc.regPlayerCmd("tpa","传送系统", (player, args) => {
    showTpaMenu(player);
});
const pendingTpaRequests = {};
function showTpaMenu(player) {
    let cost = conf.get("tpa").cost;
    let Scoreboard = conf.get("Scoreboard");
    let onlinePlayers = mc.getOnlinePlayers().filter(p => p.name !== player.name);
    if (!conf.get("tpa").EnabledModule) {
        player.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (onlinePlayers.length === 0) {
        player.tell(info + lang.get("tpa.noplayer.online"));
        return;
    }
    let form = mc.newCustomForm();
    form.setTitle(info + lang.get("tpa.name.ls"));
    let nameList = onlinePlayers.map(p => p.name);
    form.addDropdown(lang.get("tpa.choose.player"), nameList);
    form.addDropdown(lang.get("tpa.choose.fs"), [lang.get("tpa.to.he.she"), lang.get("tpa.to.here")]);
    form.addLabel(lang.get("tpa.cost").replace("${cost}", cost).replace("${Scoreboard}", Scoreboard));
    const tpaConfig = conf.get("tpa") || {}; // 获取tpa配置节
    let isDelayEnabled = tpaConfig.isDelayEnabled !== false;
    let maxD = Number(tpaConfig.maxDelay) || 20;
    let timeoutSec = tpaConfig.requestTimeout || 60;
    
    // 修复：使用局部变量跟踪是否添加了延迟滑块
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
        let modeIndex = data[idx++];
        
        // 跳过标签字段（标签不返回数据）
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
        
        let targetName = nameList[targetIndex];
        let direction = (modeIndex === 0 ? "to" : "here");
        sendTpaRequest(pl, targetName, direction, Math.floor(delaySec));
    });
}

function showTpaManageForm(player) {
    // 修复：从配置文件获取 tpa 配置节
    const tpaConfig = conf.get("tpa") || {}; // <-- 添加这行
    let form = mc.newCustomForm();
    form.setTitle(lang.get("tpa.op.menu"));
    form.addInput(lang.get("tpa.send.time"),lang.get("number"), "" + tpaConfig.requestTimeout);
    form.addDropdown(lang.get("tpa.send.way"), [lang.get("tpa.send.form"), lang.get("tpa.send.bossbar")], (tpaConfig.promptType === "bossbar" ? 1 : 0));
    let isDelayOn = (tpaConfig.isDelayEnabled !== false);
    form.addSwitch(lang.get("tpa.Enabled.lag"), isDelayOn);
    form.addInput(lang.get("tpa.max.lagnumber"), lang.get("number"), "" + (tpaConfig.maxDelay || 20));
    
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
    const tpaConfig = conf.get("tpa") || {}; // 安全获取 tpa 配置
    let pType = tpaConfig.promptType || "form";
    let timeoutSec = tpaConfig.requestTimeout || 60;
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
mc.regPlayerCmd("crash", "§c使玩家客户端崩溃", (player,args) => {
    if (!conf.get("CrashModuleEnabled")) {
        player.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (!player || !player.isOP()) {
        output.error(info + lang.get("player.not.op"));
        return;
    }
    let crashplayer = mc.newCustomForm();
    crashplayer.setTitle(lang.get("crash.player.client"));
    crashplayer.addLabel(lang.get("carsh.function.list"));
    let players = []
    let playersname = []
    let playerss = mc.getOnlinePlayers();
    for(var i = 0;i < playerss.length;i++) {
        let pl = playerss[i];
        players[i] = pl;
        playersname[i] = pl.name;
    }
    crashplayer.addDropdown("请选择玩家:", playersname);
    player.sendForm(crashplayer,function(pl,crashplayerdata) {
        if(crashplayerdata == null) {
            pl.tell(info+lang.get("crash.player.ok"));
        }else{
            let player = crashplayerdata[1];
            let playername = playersname[player];
            let play = players[player];
            play.crash();
            pl.tell(info+lang.get("crash.player.ok"));
        }
    })
},1);

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
                const balance = conf.get("LLMoney") ? from.getMoney() : from.getScore(conf.get("Scoreboard"));
                if (balance < cost) {
                    from.sendText(info + `§c您需要 ${cost}${lang.get("CoinName")} 才能传送！`);
                    return false;
                }
            }
    if (cost > 0) {
                if (conf.get("LLMoney")) {
                    from.reduceMoney(cost);
                } else {
                    from.reduceScore(conf.get("Scoreboard"), cost);
                }
                from.sendText(info + `§e传送花费 ${cost}${lang.get("CoinName")}`);
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
// ======================
// RTP2252 2.2.9
// ======================
//冷却Map
let cooltime = new Map()
setInterval(() => {
    cooltime.forEach((v,k)=>{
        if(v > 0){
            cooltime.set(k,v-1)
        }else{
            cooltime.delete(k)
        }
    })
}, 1000);
////rtp  remake
const rtpResetCmd = mc.newCommand("rtpreset", "重置传送冷却", PermType.GameMasters);
rtpResetCmd.overload([]);
rtpResetCmd.mandatory("player", ParamType.Player);
rtpResetCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    const config = conf.get("RTP");
    const cooldown = config.cooldown;
    cooltime.set(pl.realName,0)
    out.success(`已重置 ${pl.realName} 的传送冷却`);
});
rtpResetCmd.setup();
const asyncRtpCmd = mc.newCommand("rtp", "异步随机传送", PermType.Any);
asyncRtpCmd.overload([]);
asyncRtpCmd.setCallback(async (cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return out.error("仅限玩家执行");
    
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
function ValueCheck(plname,value){
    let score = mc.getPlayer(plname).getScore(conf.get("Scoreboard"))
    if(!score){
        mc.getPlayer(plname).setScore(conf.get("Scoreboard"),0)
    }
    if(score < value){
        return false
    }else{
        mc.getPlayer(plname).reduceScore(conf.get("Scoreboard"),value)
        return true
    }
}
function LLValueCheck(plname, value) {
    let pl = mc.getPlayer(plname);
    if (!pl) return false;
    
    let LLMoney = pl.getMoney();  // 正确获取LLMoney
    if (LLMoney === null || LLMoney === undefined) {
        pl.setMoney(0);  // 初始化LLMoney
        return false;
    }

    if (LLMoney < value) {
        return false;
    } else {
        pl.reduceMoney(value);  // 正确扣除LLMoney
        return true;
    }
}
// ======================
// Rp
// ======================
const redpacketCmd = mc.newCommand("redpacket", "红包功能", PermType.Any);

redpacketCmd.setAlias("rp");

// 添加子命令枚举
redpacketCmd.setEnum("subcommand", ["send", "open", "list", "history"]);
// 添加红包类型枚举
redpacketCmd.setEnum("packetType", ["random", "average"]);

// 添加命令重载
redpacketCmd.mandatory("subcommand", ParamType.Enum, "subcommand");
redpacketCmd.optional("amount", ParamType.Int);
redpacketCmd.optional("count", ParamType.Int);
redpacketCmd.optional("player", ParamType.String);
redpacketCmd.optional("message", ParamType.String);
// 新增红包类型参数
redpacketCmd.optional("packetType", ParamType.Enum, "packetType");

// 更新重载，包含红包类型参数
redpacketCmd.overload(["subcommand", "amount", "count", "player", "message", "packetType"]);
redpacketCmd.overload(["subcommand", "amount", "count", "player", "message"]);
redpacketCmd.overload(["subcommand"]);

redpacketCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return;
    if (!conf.get("RedPacket").EnabledModule) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    const sub = res.subcommand;
    switch (sub) {
        case "send":
            handleSendRedPacket(pl, res.amount, res.count, res.player, res.message, res.packetType);
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

// 修复：添加 handleExpiredPacket 函数定义
function handleExpiredPacket(packet) {
    if (packet.remaining <= 0) return;
    
    logger.info(`[红包] 处理过期红包 #${packet.id}, 剩余金额: ${packet.remainingAmount}`);
    
    if (packet.remainingAmount > 0) {
        const sender = mc.getPlayer(packet.sender);
        if (sender) {
            if (conf.get("LLMoney") == 0) {
                sender.addScore(conf.get("Scoreboard"), packet.remainingAmount);
            } else {
                sender.addMoney(packet.remainingAmount);
            }
            sender.tell(info + `§a你的红包#${packet.id}已过期，退还§e${packet.remainingAmount}§a${lang.get("CoinName")}`);
        }
    }
    
    // 从数据中移除过期红包
    redpacketData.delete(`packets.${packet.id}`);
}

// 处理红包发送 - 添加红包类型支持
function handleSendRedPacket(pl, amount, count, targetPlayer, message, packetType = "random") {
    // 智能参数类型识别
    if (typeof targetPlayer === "string") {
        // 如果第五个参数是红包类型
        if (targetPlayer === "random" || targetPlayer === "average") {
            packetType = targetPlayer;
            targetPlayer = "";
            message = "";
        }
        // 如果第六个参数是红包类型
        if (typeof message === "string" && (message === "random" || message === "average")) {
            packetType = message;
            message = "";
        }
    }
    
    // 设置默认值
    if (!packetType) packetType = "random"; // 默认拼手气红包
    
    if (!conf.get("RedPacket").EnabledModule) {
        pl.tell(info + lang.get("module.no.Enabled")); 
        return;    
    }
    // 参数验证
    if (isSending) {
        pl.tell("§c请勿重复发送红包！");
        return;
    }
    if (typeof amount !== "number" || typeof count !== "number") {
        pl.tell(info + "§c参数错误: 金额和数量必须是数字");
        return;
    }
    
    if (!amount || !count || count < 1) {
        pl.tell(info + "§c用法: /redpacket send <总金额> <红包个数> [玩家名] [祝福语] [类型]");
        pl.tell(info + "§7类型: random(拼手气) 或 average(普通)");
        return;
    }
    
    const config = conf.get("RedPacket");
    const maxAmount = config.maxAmount;
    const maxCount = config.maxCount;
    const minAmount = config.minAmount;
    
    // 验证金额和数量
    if (amount < minAmount || amount > maxAmount) {
        pl.tell(info + `§c红包金额必须在${minAmount}-${maxAmount}之间`);
        return;
    }
    
    if (count < 1 || count > maxCount) {
        pl.tell(info + `§c红包个数必须在1-${maxCount}之间`);
        return;
    }
    
    // 检查玩家是否有足够资金
    let balance;
    if (conf.get("LLMoney") == 0) {
        balance = pl.getScore(conf.get("Scoreboard"));
    } else {
        balance = pl.getMoney();
    }
    
    if (balance < amount) {
        pl.tell(info + "§c余额不足，无法发送红包");
        return;
    }
    
    // 扣除资金
    if (conf.get("LLMoney") == 0) {
        pl.reduceScore(conf.get("Scoreboard"), amount);
    } else {
        pl.reduceMoney(amount);
    }
    
    // 创建红包 - 添加红包类型
    const packetId = redpacketData.get("nextId");
    const packet = {
        id: packetId,
        sender: pl.realName,
        amount: amount,
        count: count,
        remaining: count,
        remainingAmount: amount,
        recipients: [],
        targetType: targetPlayer ? "specific" : "all", // 重命名为targetType避免混淆
        targetPlayer: targetPlayer || "",
        message: message || `${pl.realName}的红包`,
        packetType: packetType, // 新增红包类型字段
        createdAt: Date.now(),
        expireAt: Date.now() + (config.expireTime * 1000)
    };
    isSending = true;
    // 保存红包数据
    redpacketData.set(`packets.${packetId}`, packet);
    redpacketData.set("nextId", packetId + 1);
    
    // 广播红包消息
    const typeName = packetType === "random" ? "拼手气" : "普通";
    if (targetPlayer) {
        const target = mc.getPlayer(targetPlayer);
        if (target) {
            target.tell(info + `§a你收到来自${pl.realName}的${typeName}红包，输入§e/rp open§a领取`);
        }
        pl.tell(info + `§a成功向${targetPlayer}发送${typeName}红包，金额:§e${amount}§a，数量:§e${count}`);
    } else {
        mc.broadcast(info + `§a玩家§e${pl.realName}§a发送了${typeName}全服红包，输入§e/rp open§a领取`);
        pl.tell(info + `§a成功发送${typeName}全服红包，金额:§e${amount}§a，数量:§e${count}`);
    }
     logger.info(`[红包] 玩家 ${pl.realName} 发送${typeName}红包 #${packetId}, 类型: ${packet.targetType}, 金额: ${amount}, 数量: ${count}`);
     isSending = false;
}

// 处理红包领取 - 添加红包类型支持
function handleOpenRedPacket(pl) {
    //logger.info(`[红包] 玩家 ${pl.realName} 尝试领取红包...`);
    
    const packets = redpacketData.get("packets") || {};
    const now = Date.now();
    let availablePackets = [];
    
    for (const id in packets) {
        const packet = packets[id];
        
        // 检查过期
        if (packet.expireAt < now) {
            handleExpiredPacket(packet); // 现在这个函数已经定义
            continue;
        }
        
        // 检查可领取条件
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
        pl.tell(info + "§c当前没有可领取的红包");
        //logger.info(`[红包] 玩家 ${pl.realName} 没有可领取的红包`);
        return;
    }
    
    // 按时间排序，领取最早的红包
    availablePackets.sort((a, b) => a.createdAt - b.createdAt);
    const packet = availablePackets[0];
    
    //logger.info(`[红包] 玩家 ${pl.realName} 将领取红包 #${packet.id}`);
    
    // 计算红包金额 - 根据红包类型使用不同算法
    let amount;
    if (packet.remaining === 1) {
        // 最后一个红包，领取剩余全部金额
        amount = packet.remainingAmount;
    } else {
        if (packet.packetType === "random") {
            // 拼手气红包算法
            const maxAmount = Math.min(
                packet.remainingAmount - packet.remaining + 1, 
                Math.floor(packet.remainingAmount / packet.remaining * 2)
            );
            amount = Math.floor(Math.random() * maxAmount) + 1;
            amount = Math.max(amount, 1);
        } else {
            // 普通红包算法（平均分配）
            amount = Math.floor(packet.remainingAmount / packet.remaining);
            amount = Math.max(amount, 1); // 确保至少1单位
        }
    }
    
    // 更新红包数据
    packet.remaining--;
    packet.remainingAmount -= amount;
    packet.recipients.push(pl.realName);
    
    // 保存红包数据
    redpacketData.set(`packets.${packet.id}`, packet);
    
    // 给玩家发放资金
    if (conf.get("LLMoney") == 0) {
        pl.addScore(conf.get("Scoreboard"), amount);
    } else {
        pl.addMoney(amount);
    }
    
    // 通知玩家
    const typeName = packet.packetType === "random" ? "拼手气" : "普通";
    pl.tell(info + `§a恭喜你领取到§e${packet.sender}§a的${typeName}红包，获得§e${amount}§a${lang.get("CoinName")}!`);
    logger.info(`[红包] 玩家 ${pl.realName} 领取红包 #${packet.id}, 获得 ${amount} 金币`);
    
    // 通知发送者
    const sender = mc.getPlayer(packet.sender);
    if (sender) {
        sender.tell(info + `§a玩家§e${pl.realName}§a领取了你的红包，获得§e${amount}§a${lang.get("CoinName")}`);
    }
}

// 在红包列表和详情中显示红包类型
function handleListRedPacket(pl) {
    const packets = redpacketData.get("packets") || {};
    const now = Date.now();
    let form = mc.newSimpleForm()
        .setTitle("§l§6可领取红包")
        .setContent("§7点击查看详情并领取");
    
    let hasPackets = false;
    
    for (const id in packets) {
        const packet = packets[id];
        if (packet.expireAt < now) continue;
        if (packet.remaining <= 0) continue;
        if (packet.recipients.includes(pl.realName)) continue;
        
        if (packet.targetType === "specific" && 
            packet.targetPlayer.toLowerCase() !== pl.realName.toLowerCase()) {
            continue;
        }
        
        const expireIn = Math.ceil((packet.expireAt - now) / 1000);
        const typeName = packet.packetType === "random" ? "§6拼手气" : "§b普通";
        form.addButton(`§l${typeName} §e${packet.sender}的红包\n§7金额: §f${packet.amount} §7剩余: §a${packet.remaining}/${packet.count}\n§7过期: §f${expireIn}秒`);
        hasPackets = true;
    }
    
    if (!hasPackets) {
        form.setContent("§c当前没有可领取的红包");
        form.addButton("§c关闭");
    }
    
    if (form && pl) {
        pl.sendForm(form, (player, id) => {
            if (id !== null && hasPackets) {
                handleOpenRedPacket(pl);
            }
        });
    }
}

// 在红包历史中显示红包类型
function handleRedPacketHistory(pl) {
    const packets = redpacketData.get("packets") || {};
    let history = [];
    
    for (const id in packets) {
        const packet = packets[id];
        if (packet.sender === pl.realName || packet.recipients.includes(pl.realName)) {
            history.push(packet);
        }
    }
    
    if (history.length === 0) {
        pl.tell(info + "§c你还没有红包记录");
        return;
    }
    
    history.sort((a, b) => b.createdAt - a.createdAt);
    
    let form = mc.newSimpleForm()
        .setTitle("§l§6红包历史记录")
        .setContent("§7点击查看红包详情");
    
    history.slice(0, 10).forEach(packet => {
        const isSender = packet.sender === pl.realName;
        const status = packet.remaining > 0 ? "§a进行中" : "§c已结束";
        const amountReceived = isSender ? 
            `§7已领取: §f${packet.amount - packet.remainingAmount}` :
            `§7获得: §f${packet.recipients.includes(pl.realName) ? 
                packet.amount - packet.remainingAmount : 0}`;
        const typeName = packet.packetType === "random" ? "§6[拼]" : "§b[普]";
        
        form.addButton(
            `§l${isSender ? "§b[发]" : "§a[收]"} ${typeName} §e${packet.sender}的红包\n` +
            `§7金额: §f${packet.amount} §7状态: ${status}\n` +
            amountReceived
        );
    });
    
    pl.sendForm(form, (player, id) => {
        if (id !== null) {
            const packet = history[id];
            showRedPacketDetail(pl, packet);
        }
    });
}

// 在红包详情中显示红包类型
function showRedPacketDetail(pl, packet) {
    const form = mc.newCustomForm()
        .setTitle("§l§6红包详情");
    
    form.addLabel(`§f发送者: §e${packet.sender}`);
    form.addLabel(`§f目标类型: §e${packet.targetType === "all" ? "全服红包" : "指定红包"}`);
    // 新增红包类型显示
    form.addLabel(`§f红包类型: §e${packet.packetType === "random" ? "拼手气红包" : "普通红包"}`);
    if (packet.targetType === "specific") {
        form.addLabel(`§f指定玩家: §e${packet.targetPlayer}`);
    }
    form.addLabel(`§f总金额: §e${packet.amount}${lang.get("CoinName")}`);
    form.addLabel(`§f红包个数: §e${packet.count}`);
    form.addLabel(`§f剩余金额: §e${packet.remainingAmount}${lang.get("CoinName")}`);
    form.addLabel(`§f剩余个数: §e${packet.remaining}`);
    form.addLabel(`§f祝福语: §e${packet.message}`);
    
    const expireTime = new Date(packet.expireAt).toLocaleTimeString();
    form.addLabel(`§f过期时间: §e${expireTime}`);
    
    form.addLabel("§f领取记录:");
    packet.recipients.forEach(recipient => {
        form.addLabel(`§7- §e${recipient}`);
    });
    
    pl.sendForm(form, (pl, id) => {
        // 点击任何按钮都返回主菜单
        if (id !== null) {
        }
        pl.runcmd("moneygui");
    });
}

// 修改红包过期检测逻辑
setInterval(() => {
    const now = Date.now();
    const packets = redpacketData.get("packets") || {};
    let updated = false;

    for (const id in packets) {
        const packet = packets[id];
        
        // 检查红包是否过期
        if (packet.expireAt < now) {
            handleExpiredPacket(packet);
            updated = true;
        }
    }
    
    // 如果有更新，保存数据
    if (updated) {
        redpacketData.save();
    }
}, 5 * 60 * 1000); // 每5分钟检查一次

// 在插件初始化后添加红包帮助命令
mc.listen("onServerStarted", () => {
    setTimeout(() => {
    if (!conf.get("RedPacket").EnabledModule) {
        return;
    } else {
        mc.regPlayerCmd("redpackethelp", "红包帮助", (pl) => {
            // 创建帮助表单
            let helpForm = mc.newSimpleForm()
                .setTitle("红包使用帮助")
                .setContent("选择命令查看详细说明");
            
            helpForm.addButton("发送红包");
            helpForm.addButton("领取红包");
            helpForm.addButton("查看红包");
            helpForm.addButton("红包历史");
            helpForm.addButton("红包类型说明");
            
            // 发送表单
            pl.sendForm(helpForm, (player, id) => {
                if (id === null) return;
                
                let helpText = "";
                switch(id) {
                    case 0:
                        helpText = 
                            "§6发送红包命令: §a/rp send <金额> <数量> [玩家名] [祝福语] [类型]\n" +
                            "§7- §f金额: 红包总金额\n" +
                            "§7- §f数量: 红包个数\n" +
                            "§7- §f玩家名: 指定接收玩家(可选)\n" +
                            "§7- §f祝福语: 红包祝福语(可选)\n" +
                            "§7- §f类型: random(拼手气)或average(普通)(可选，默认random)\n" +
                            "§e示例: §a/rp send 1000 5 §7(发送5个总金额1000的拼手气红包)\n" +
                            "§e示例: §a/rp send 1000 5 average §7(发送5个总金额1000的普通红包)\n" +
                            "§e示例: §a/rp send 1000 5 Steve \"恭喜发财\" random §7(指定玩家的拼手气红包)";
                        break;
                    case 1:
                        helpText = 
                            "§6领取红包命令: §a/rp open\n" +
                            "§7自动领取最早可用的红包\n\n" +
                            "§6查看可领红包: §a/rp list\n" +
                            "§7查看所有可领取的红包列表";
                        break;
                    case 2:
                        helpText = 
                            "§6查看红包详情: §a/rp list\n" +
                            "§7查看所有可领取的红包\n\n" +
                            "§7点击红包可直接领取";
                        break;
                    case 3:
                        helpText = 
                            "§6查看红包历史: §a/rp history\n" +
                            "§7查看你发送和领取的红包记录";
                        break;
                    case 4:
                        helpText = 
                            "§6红包类型说明:\n" +
                            "§a1. 拼手气红包(random):\n" +
                            "§7- 每个红包金额随机分配\n" +
                            "§7- 金额在1到剩余均值的两倍之间随机\n" +
                            "§7- 最后一人获得剩余所有金额\n\n" +
                            "§b2. 普通红包(average):\n" +
                            "§7- 每个红包金额平均分配\n" +
                            "§7- 金额 = 剩余金额 / 剩余个数(取整)\n" +
                            "§7- 最后一人获得剩余所有金额";
                        break;
                }
                
                // 创建详情表单
                let detailForm = mc.newCustomForm()
                    .setTitle("§l§6红包帮助")
                    .addLabel(helpText);
                
                pl.sendForm(detailForm, () => {});
            });
        });
    }}, 1000);
});         