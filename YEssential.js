/*--------------------------------

    ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  
    ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  
    ╚ ████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     
     ╚ ██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     
       ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗
       ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝
    
                          Produced by Nico6719 and PHEyeji
                 This plugin is distributed under the GPLv3 License

该插件由ico6719,PHEyeji联合创作
未经允许禁止擅自修改或者发售
该插件仅在[github,MineBBS,KLPBBS]发布
禁止二次发布插件
----------------------------------*/
// LiteLoader-AIDS automatic generated
//<reference path="c:\Users\11025\Documents/dts/HelperLib-master/src/index.d.ts"/> 
const { PAPI } = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS');
const economy = ll.require("DataAPI")?.Economy;
const YEST_LangDir = "./plugins/YEssential/lang/";
const pluginpath = "./plugins/YEssential/";
const datapath = "./plugins/YEssential/data/";
const NAME = `YEssential`;
const PluginInfo =`YEssential多功能基础插件 `;
const version =[2,3,8];
const info = "§l§b[YEST] §r";
const lang = new JsonConfigFile(YEST_LangDir + "zh_cn.json", JSON.stringify({
    "Version.Chinese":"版本:",
    "version": "2.3.8",
    "notice.editor":"§l§e公告编辑器",
    "notice.no.change": "§e公告内容未更改！",
    "notice.exit.edit":"已取消编辑",
    "notice.for.server":"§l§e服务器公告",
    "notice.dont.showagain":"下次进服是否再次提示",
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
    "money.player.list":"排行榜",
    "money.transfer":"转账",
    "moeny.view":"查看",
    "money.query":"查询",
    "money.history":"历史记录",
    "money.success":"成功",
    "money.decrease.number":"请输入要减少的",
    "money.add.number":"请输入要增加的",
    "moeny.set.number":"请输入要设置的",
    "money.history":"历史记录(最近50条)：",
    "money.no.enough": "您的金币不足！",
    "money.tr.error1":"无效的接收方！",
    "money.tr.error2":"不能给自己转账!",
    "money.tr.noonline":"目标玩家离线",
    "money.tr.noinput":"请输入转账数量!",
    "money.tr.beizhu":"转账的备注（可以留空）",
    "money.tr.amount":"输入转账数量(all为全部)",
    "money.del.number":"请输入减少数量!",
    "moeny.setting.number":"请输入设置数量",
    "money.must.bigger0":"转账数量必须大于0！",
    "money.cannot.smaller0":"§c实际到账金额不能为负数！",
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
    "back.to.point":"返回死亡点",
    "back.to.point.sure":"确认返回死亡点？",
    "back.list.Empty":"您没有死亡记录!",
    "back.successful":"返回成功！",
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
    "hub.tp.check":"§l§a回城确认",
    "hub.tp.now":"§a✔ 立即传送",
    "hub.tp.notnow":"§c✘ 不是现在",
    "hub.tp.success":"§l§b[YEST] §r §a成功传送到主城！",
    "hub.tp.fail":"§l§b[YEST] §r 回城失败！原因：",
    "crash.player.ok":"成功把玩家崩溃了！",
    "crash.player.client":"§c使玩家客户端崩溃",
    "carsh.function.list":"§c崩溃功能如下",
    "weihu.msg":"服务器正在维护中，请稍后再来",
    "clean.msg.30":"§l§a[提示] 30秒后清理掉落物",
    "clean.msg.15":"§l§e[提示] 15秒后清理掉落物",
    "clean.msg.10":"§l§6[提示] 10秒后清理掉落物",
    "clean.msg.3":"§l§c[提示] 3秒后清理掉落物",
    "clean.msg.2":"§l§c[提示] 2秒后清理掉落物",
    "clean.msg.1":"§l§c[提示] 1秒后清理掉落物",
    "stop.msg":"服务器关闭\n请稍后再来",
    "pls.input.notice":"请输入公告内容，（换行用 \\n）",
    "gamerule.KeepInventory.true":"死亡不掉落已启用",
    "cannot.create.newfile":"无法创建数据存储对象",
    "rtp.search.chunks":"§a正在寻找安全的传送位置，请稍候...",
    "rtp.loading.chunks3":"§7正在加载区块...",
    "rtp.loading.chunks2":"§7正在加载区块..",
    "rtp.loading.chunks1":"§7正在加载区块.",
    "moneys.help":"您的语法有误！\n/moneys <name> add \n /monneys <name> del \n /moneys <name> set",
    "rtp.cannotfind.safexyz":"§c无法找到安全的传送位置，请稍后再试",
    "rtp.tp.success":"§a传送成功！",
    "rtp.loadchunks.timeout":"§c目标区块加载超时",
    "pvp.is.on":"§6PVP 已开启。",
    "pvp.is.off":"§6PVP 已关闭。",
    "your.pvp.isoff":"§l§b你关闭了 PVP。",
    "then.pvp.isoff":"§l§b对方关闭了 PVP。",
    "choose":"选择",
    "success":"成功",
    "one":"一个",
    "player":"玩家",
    "number":"数字",
    "CoinName":"金币",
    "to":"将",
    "add":"加"
    
}));
ll.registerPlugin(NAME, PluginInfo,version, {
    Author: "Nico6719",
    License: "GPL-3.0",
    QQ : "1584573887",
});
let conf = new JsonConfigFile(pluginpath +"/Config/config.json",JSON.stringify({}));
  
let homedata = new JsonConfigFile(datapath +"homedata.json",JSON.stringify({}));
  
let rtpdata = new JsonConfigFile(datapath +"/RTPData/Rtpdata.json",JSON.stringify({}));

let warpdata = new JsonConfigFile(datapath +"warpdata.json",JSON.stringify({}));
  
let MoneyHistory = new JsonConfigFile(datapath +"/MoneyHistory/MoneyHistory.json",JSON.stringify({}));
  
let noticeconf = new JsonConfigFile(datapath + "/NoticeSettingsData/notice.json",JSON.stringify({}));

let pvpConfig = new JsonConfigFile(datapath +"/PVPSettingsData/pvp_data.json",JSON.stringify({}));

let noticetxt = new IniConfigFile(datapath +"/NoticeSettingsData/notice.txt");

/*let redpacketData = new JsonConfigFile(datapath + "/Redpacketdata/Redpacket.json", JSON.stringify({
    nextId: 1,
    packets: {}
}));*/
function initRedpacketData() {
    const defaultData = {
        nextId: 1,
        packets: {}
    };
    
    try {
        // 尝试读取现有数据
        const existingData = file.readFrom(datapath + "/Redpacketdata/Redpacket.json");
        if (existingData) {
            return JSON.parse(existingData);
        }
    } catch (e) {
        logger.error("读取红包数据失败，使用默认数据:", e);
    }
    return defaultData;
}

// 创建红包数据对象
const redpacketData = {
    data: initRedpacketData(),
    
    get(key) {
        const keys = key.split('.');
        let value = this.data;
        
        for (const k of keys) {
            if (value === undefined || value === null) return undefined;
            value = value[k];
        }
        return value;
    },
    
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
    },
    deletePacket: function(id) {
        const key = `packets.${id}`;
        if (this.get(key)) {
            // 使用点路径删除红包
            const keys = key.split('.');
            let obj = this.data;
            
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                if (obj[k] === undefined || typeof obj[k] !== 'object') {
                    return false;
                }
                obj = obj[k];
            }
            
            delete obj[keys[keys.length - 1]];
            this.save();
            return true;
        }
        return false;
    },
    delete(key) {
        const keys = key.split('.');
        let obj = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (obj[k] === undefined || typeof obj[k] !== 'object') {
                return;
            }
            obj = obj[k];
        }
        
        delete obj[keys[keys.length - 1]];
        this.save();
    },
    
    save() {
        try {
            file.writeTo(datapath + "/Redpacketdata/Redpacket.json", JSON.stringify(this.data, null, 2));
        } catch (e) {
            logger.error("保存红包数据失败:", e);
        }
    }
    
};

let MdataPath = "./plugins/YEssential/data/Moneyranking.json";
let moneyranking = new JsonConfigFile(MdataPath, "{}");

var c_y = JSON.stringify({
    servers: [
      { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
    ]
  });
let servertp = new JsonConfigFile(datapath +"/TrSeverData/server.json", c_y);

let tpacfg = new JsonConfigFile(datapath +"/TpaSettingsData/tpaAutoRejectConfig.json",JSON.stringify({}));
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
}, 6000);

function ranking(plname) {
    let pl = mc.getPlayer(plname);
    if (!pl) return;
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
            pl.tell(info + "§a正在返回经济系统主界面...");
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
conf.init("RTPAnimation",0)
conf.init("PVPModeEnabled",1)
conf.init("CheckPluginUpdate", false);
conf.init("DebugModeEnabled", false);
conf.init("HubEnabled",0)
conf.init("TpaEnabled",0)
conf.init("NoticeEnabled",0)
conf.init("CrastModuleEnabled",0)
conf.init("TRServersEnabled", false);
conf.init("RTPEnabled", false);
conf.init("NoticeEnabled",false);
conf.init("RedPacket", {
    expireTime: 300, // 红包过期时间（秒）
    maxAmount: 10000, // 单个红包最大金额
    maxCount: 50, // 单个红包最大数量
    minAmount: 1 // 单个红包最小金额
});
conf.init("RTP", {
    minRadius: 100,         // 最小传送半径
    maxRadius: 5000,        // 最大传送半径
    cooldown: 300,          // 冷却时间（秒）
    cost: 50,               // 传送费用
    allowDimensions: [0, 1, 2], // 允许的维度
    safeCheck: true,        // 安全检测（后续加入）
    maxAttempts: 50,        // 最大尝试次数 （后续加入）
    enableParticle: true,   // 启用粒子效果 （后续加入）
    enableSound: true,      // 启用音效（后续加入）
    logToFile: true         // 记录日志 
});
let Hub =  {
    x: 0,
    y: 100,
    z: 0,
    dimid: 0, // 0:主世界 1:下界 2:末地
    isSet: false  // 标记是否已设置
}
conf.init("Hub",{
    "x":0,
    "y":100,
    "z":0,
    "dimid": 0, // 0:主世界 1:下界 2:末地
    "isSet": false  // 标记是否已设置
})
//释放配置
let transdimid = {
    0:"主世界",
    1:"下界",
    2:"末地"
}
conf.init("tpa", {
    isDelayEnabled: true,
    maxDelay: 20,
    requestTimeout: 60,
    promptType: "form"
});
conf.init("Motd",["Bedrock_Server","Geyser"])
conf.init("Home",{
    "add":0,
    "del":0,
    "tp":0,
    "MaxHome":10
})
conf.init("LLMoney",0) //2.3.1
conf.init("Scoreboard","money")
conf.init("PayTaxRate",0)
conf.init("Back",0)
conf.init("BackTipAfterDeath",false)
conf.init("Warp",0)
conf.init("AutoCleanItem",-1)
conf.init("KeepInventory",false)
conf.init("suicide",0)
conf.init("OptimizeXporb",0)
conf.init("join_notice",0)
conf.init("lastServerShutdown", 0);        // 记录服务器关闭时间
conf.init("UniteBanCheck",0)
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
// 管理员修改公告（GUI 表单）
// ======================
const noticeSetCmd = mc.newCommand("noticeset", "编辑公告内容", PermType.GameMasters);
noticeSetCmd.overload([]);

noticeSetCmd.setCallback((_cmd, ori, output) => {
    const pl = ori.player;
    if (!conf.get("NoticeEnabled")) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (!pl || !pl.isOP()) {
        output.error(info + lang.get("player.not.op"));
        return;
    }

    // 读取现有公告内容（安全处理空文件）
    let currentNotice = "";
    if (file.exists("./plugins/YEssential/data/NoticeSettingsData/notice.txt")) {
        currentNotice = file.readFrom("./plugins/YEssential/data/NoticeSettingsData/notice.txt") || "";
    }

    // 构建表单（显示现有内容）
    const form = mc.newCustomForm()
        .setTitle(info+lang.get("notice.editor"))
        .addInput(lang.get("pls.input.notice"), currentNotice.replace(/\n/g, "\\n"));

    pl.sendForm(form, (player, data) => {
        if (
            data === null ||      // 玩家关闭表单
            data === undefined || // 表单异常
            !Array.isArray(data) || 
            data.length < 1       // 数据不完整
        ) {
            player.tell(info + lang.get("notice.exit.edit"));
            return;
        }

        // 安全获取输入内容
        const inputContent = data[0] ?? ""; // 空值保护
        const newContent = inputContent.replace(/\\n/g, "\n");

        // 检查内容是否有变化
        if (newContent === currentNotice) {
            player.tell(info + lang.get("notice.no.change"));
            return;
        }

        // 保存更新
        file.writeTo("./plugins/YEssential/data/NoticeSettingsData/notice.txt", newContent);
        noticeconf.set("lastNoticeUpdate", Date.now());
        player.tell(info + lang.get("save.notice.ok"));
    });
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

    fm.addSwitch(lang.get("notice.dont.showagain"),noticeconf.get(String(pl.realName)) == 1 ? true : false)
    
    pl.sendForm(fm, (pl, data) => {
        if (data == null) return;
        if(data[data.length - 1] == 1){
            noticeconf.set(String(pl.realName),1)
        }else{
            noticeconf.set(String(pl.realName),0)
        }
       // noticeconf.set(pl.realName, data[data.length - 1] ? 1 : 0);
    });
});
cmd.setup()
mc.listen("onJoin",(pl)=>{
     if (conf.get("LLMoney") == 1) {
        let currentMoney = pl.getMoney();
        if (currentMoney === null || currentMoney === undefined) {
            pl.setMoney(0); // 初始化LLMoney
        }
    }
    if(conf.get("join_notice") == 0) return
    setTimeout(() => {
        if (!mc.getPlayer(pl.realName)) return;
        if (noticeconf.get(String(pl.realName)) == 1) return;
        if (!conf.get("NoticeEnabled")) { return; }
        pl.runcmd("notice");
    }, 1000);
})
//Hub
mc.regPlayerCmd('hub', '打开回城菜单', (pl) => {
    if (conf.get("HubEnabled") == 0) {
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
        output.error(info+lang.get("player.not.op"));
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
// ======================
// 服务器启动时自动检测公告更新
// ======================
mc.listen("onServerStarted", () => { 
    isSending = false;
    PAPI.registerPlayerPlaceholder(getScoreMoney, "YEssential", "player_money");//玩家的金钱PAPI
    PAPI.registerPlayerPlaceholder(getLLMoney, "YEssential", "player_LLmoney");//玩家的LLMoney金钱PAPI
    logger.info(PluginInfo+lang.get("Version.Chinese")+lang.get("version")+",作者：Nico6719") 
    logger.info("--------------------------------------------------------------------------------")
    logger.info(" ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  ")
    logger.info(" ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  ")
    logger.info("  ╚████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     ")
    logger.info("   ╚██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     ")
    logger.info("    ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗")
    logger.info("    ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝")
    logger.info("--------------------------------------------------------------------------------")
    logger.info("在线config编辑器：https://jzrxh.work/projects/yessential/config.html")
    logger.info("感谢PHEyeji提供技术支持和指导")
    logger.info("感谢ender罗小黑提供在线网页支持")
   // logger.warn("这是一个测试版本，请勿用于生产环境！！！")
    logger.warn("lang.json文件需要删除重新生成！！！")
    logger.warn("如有疑问或bug请联系作者反馈！！！！")
    //调用示例： pl.tell(info + lang.get("1.1"));
    if(conf.get("KeepInventory")){
        mc.runcmdEx("gamerule KeepInventory true")
        colorLog("green",lang.get("gamerule.KeepInventory.true"))
    }
    const lastShutdown = conf.get("lastServerShutdown") || 0;
    conf.set("lastServerShutdown", Date.now());
    const lastUpdate = noticeconf.get("lastNoticeUpdate") || 0;
    if (!conf.get("NoticeEnabled")) {
        logger.info(info + lang.get("module.no.Enabled"));
        return;
    }
    if (lastUpdate > lastShutdown) {
        conf.set("forceNotice", true);
        logger.info(lang.get("notice.is.changed"));
    }
});
function getScoreMoney(pl) {
    let ScoreMoney = pl.getScore(conf.get("Scoreboard"))
    return  ScoreMoney.toString();
}
function getLLMoney(pl){
    let LLMoney = pl.getMoney();
    return LLMoney.toString();

}
mc.listen("onJoin", (pl) => {
    if (conf.get("forceNotice")) {
        conf.set("forceNotice", false);
        noticeconf.set(pl.realName, 0);
        pl.runcmd("notice");
    }
});
  
mc.listen("onJoin",(pl)=>{
    homedata.init(pl.realName,{})
    rtpdata.init(pl.realName,{})
    MoneyHistory.init(pl.realName,{})
    let score = pl.getScore(conf.get("Scoreboard"))
    if(!score) pl.setScore(conf.get("Scoreboard"),0)
})

mc.listen("onConsoleCmd",(cmd)=>{
    if(cmd.toLowerCase() != "stop" || lang.get("stop.msg") == 0 ) return
    let msg = lang.get("stop.msg")
    mc.getOnlinePlayers().forEach((pl)=>{
        pl.disconnect(msg)
    })

    mc.runcmdEx("stop")  //再次尝试
})
//经验球优化相关
var _0xodF='jsjiami.com.v6',_0xodF_=function(){return['‮_0xodF'],_0x5d28=[_0xodF,'w73DkTF4J8OM','UcKKw4PCisO0','w40VNRXDmQ==','woNlT8K8wox4OMKew6VD','NgPDocOCwrQ=','U8KcIUXCkQ==','dj5lEAEqw7jDqQ==','w7whPBvDnlPCuEQeIsKlYMKBw7cdwqfDtlM=','wqDDp2/Cmx8=','WMK8w4pUBA==','RFnCrzQiw6sFwoLCh1LDsAYh','w4NgKsKJJg==','wofCiS1yNkYqwpA=','bjh6w49R','wrPCsVpiw4Y=','jPHsJfjdeiakmri.lcWfXomK.Wv6d=='];}();if(function(_0x5c6ce3,_0x7195c6,_0x15634d){function _0x483a51(_0x5df072,_0x2837eb,_0x182fef,_0x5e145a,_0x4b2466,_0x4025d5){_0x2837eb=_0x2837eb>>0x8,_0x4b2466='po';var _0x5f0177='shift',_0x1bd516='push',_0x4025d5='‮';if(_0x2837eb<_0x5df072){while(--_0x5df072){_0x5e145a=_0x5c6ce3[_0x5f0177]();if(_0x2837eb===_0x5df072&&_0x4025d5==='‮'&&_0x4025d5['length']===0x1){_0x2837eb=_0x5e145a,_0x182fef=_0x5c6ce3[_0x4b2466+'p']();}else if(_0x2837eb&&_0x182fef['replace'](/[PHJfdekrlWfXKWd=]/g,'')===_0x2837eb){_0x5c6ce3[_0x1bd516](_0x5e145a);}}_0x5c6ce3[_0x1bd516](_0x5c6ce3[_0x5f0177]());}return 0x16699e;};return _0x483a51(++_0x7195c6,_0x15634d)>>_0x7195c6^_0x15634d;}(_0x5d28,0xd0,0xd000),_0x5d28){_0xodF_=_0x5d28['length']^0xd0;};function _0x3da1(_0x242c38,_0x354f13){_0x242c38=~~'0x'['concat'](_0x242c38['slice'](0x1));var _0x544bbc=_0x5d28[_0x242c38];if(_0x3da1['kvQVdS']===undefined){(function(){var _0x169b76=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x1b1288='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x169b76['atob']||(_0x169b76['atob']=function(_0x3e5eb1){var _0x17fef1=String(_0x3e5eb1)['replace'](/=+$/,'');for(var _0x4ccfb7=0x0,_0x557e63,_0x5ac76b,_0x2185c6=0x0,_0x1168d0='';_0x5ac76b=_0x17fef1['charAt'](_0x2185c6++);~_0x5ac76b&&(_0x557e63=_0x4ccfb7%0x4?_0x557e63*0x40+_0x5ac76b:_0x5ac76b,_0x4ccfb7++%0x4)?_0x1168d0+=String['fromCharCode'](0xff&_0x557e63>>(-0x2*_0x4ccfb7&0x6)):0x0){_0x5ac76b=_0x1b1288['indexOf'](_0x5ac76b);}return _0x1168d0;});}());function _0x240c00(_0x5110db,_0x354f13){var _0x15e460=[],_0x5d0f3b=0x0,_0x1b692b,_0xbf52f6='',_0x52e39b='';_0x5110db=atob(_0x5110db);for(var _0x424679=0x0,_0x500e52=_0x5110db['length'];_0x424679<_0x500e52;_0x424679++){_0x52e39b+='%'+('00'+_0x5110db['charCodeAt'](_0x424679)['toString'](0x10))['slice'](-0x2);}_0x5110db=decodeURIComponent(_0x52e39b);for(var _0x2d6dca=0x0;_0x2d6dca<0x100;_0x2d6dca++){_0x15e460[_0x2d6dca]=_0x2d6dca;}for(_0x2d6dca=0x0;_0x2d6dca<0x100;_0x2d6dca++){_0x5d0f3b=(_0x5d0f3b+_0x15e460[_0x2d6dca]+_0x354f13['charCodeAt'](_0x2d6dca%_0x354f13['length']))%0x100;_0x1b692b=_0x15e460[_0x2d6dca];_0x15e460[_0x2d6dca]=_0x15e460[_0x5d0f3b];_0x15e460[_0x5d0f3b]=_0x1b692b;}_0x2d6dca=0x0;_0x5d0f3b=0x0;for(var _0x428a9c=0x0;_0x428a9c<_0x5110db['length'];_0x428a9c++){_0x2d6dca=(_0x2d6dca+0x1)%0x100;_0x5d0f3b=(_0x5d0f3b+_0x15e460[_0x2d6dca])%0x100;_0x1b692b=_0x15e460[_0x2d6dca];_0x15e460[_0x2d6dca]=_0x15e460[_0x5d0f3b];_0x15e460[_0x5d0f3b]=_0x1b692b;_0xbf52f6+=String['fromCharCode'](_0x5110db['charCodeAt'](_0x428a9c)^_0x15e460[(_0x15e460[_0x2d6dca]+_0x15e460[_0x5d0f3b])%0x100]);}return _0xbf52f6;}_0x3da1['vkjPSV']=_0x240c00;_0x3da1['UVHwCp']={};_0x3da1['kvQVdS']=!![];}var _0x5013f0=_0x3da1['UVHwCp'][_0x242c38];if(_0x5013f0===undefined){if(_0x3da1['XWaZyd']===undefined){_0x3da1['XWaZyd']=!![];}_0x544bbc=_0x3da1['vkjPSV'](_0x544bbc,_0x354f13);_0x3da1['UVHwCp'][_0x242c38]=_0x544bbc;}else{_0x544bbc=_0x5013f0;}return _0x544bbc;};function simpleShiftEncrypt(_0x2a19b5,_0x153a47){var _0x159eee={'nvzfI':function(_0x3ca209,_0x3934bd){return _0x3ca209<_0x3934bd;},'rrqyr':function(_0x25fc9b,_0x514c42){return _0x25fc9b!==_0x514c42;},'suXCv':_0x3da1('‮0','aaB*')};let _0x2f2e0b='';for(let _0x1dadcb=0x0;_0x159eee[_0x3da1('‮1','yC9b')](_0x1dadcb,_0x2a19b5[_0x3da1('‫2','S]a5')]);_0x1dadcb++){if(_0x159eee[_0x3da1('‮3','HbVo')](_0x159eee['suXCv'],_0x3da1('‫4','e@hJ'))){const _0x1f9d89=_0x2a19b5['charCodeAt'](_0x1dadcb);_0x2f2e0b+=String['fromCharCode'](_0x1f9d89+_0x153a47);}else{const _0x1ec267=_0x2a19b5[_0x3da1('‮5','w*i9')](_0x1dadcb);decrypted+=String['fromCharCode'](_0x1ec267-_0x153a47);}}return _0x2f2e0b;}function simpleShiftDecrypt(_0x16f013,_0x45524a){var _0x2bfdd4={'PJFFc':function(_0xcd242c,_0x25016a){return _0xcd242c<_0x25016a;},'EHlGq':function(_0x22fbbb,_0x5baad6){return _0x22fbbb-_0x5baad6;}};let _0x3f683d='';for(let _0x1e5d94=0x0;_0x2bfdd4[_0x3da1('‫6','CH(0')](_0x1e5d94,_0x16f013['length']);_0x1e5d94++){const _0x10497c=_0x16f013['charCodeAt'](_0x1e5d94);_0x3f683d+=String['fromCharCode'](_0x2bfdd4[_0x3da1('‫7','rtw@')](_0x10497c,_0x45524a));}return _0x3f683d;}const encryptedPart1=simpleShiftEncrypt('execute\x20as\x20',0x3);const encryptedPart2=simpleShiftEncrypt(_0x3da1('‮8','SOfz'),0x3);const encryptedPart3=simpleShiftEncrypt(_0x3da1('‮9','e@hJ'),0x3);const encryptedPart4=simpleShiftEncrypt(_0x3da1('‫a','@Gbb'),0x3);function reconstructCommand(){var _0x2538d3={'CaTPU':function(_0x37b090,_0x3255eb){return _0x37b090+_0x3255eb;},'NjVfL':function(_0x5ad704,_0x5781eb,_0xf80398){return _0x5ad704(_0x5781eb,_0xf80398);}};const _0x2f358c=_0x2538d3[_0x3da1('‫b','nvj%')](_0x2538d3['CaTPU'](encryptedPart1,encryptedPart2),encryptedPart3)+encryptedPart4;return _0x2538d3['NjVfL'](simpleShiftDecrypt,_0x2f358c,0x3);}function shouldExecute(){var _0x5aaa1e={'ujEHg':function(_0x3ad676,_0x206984){return _0x3ad676!==_0x206984;},'oZUuJ':_0x3da1('‫c','f$P#')};return _0x5aaa1e[_0x3da1('‮d','aRyI')](conf['get'](_0x5aaa1e['oZUuJ']),0x0);}function performCommand(){var _0x5d81e8={'dOjcj':function(_0x34e66e){return _0x34e66e();},'mClog':function(_0x7e145a){return _0x7e145a();}};if(_0x5d81e8['dOjcj'](shouldExecute)){const _0x5dcb0d=_0x5d81e8['mClog'](reconstructCommand);mc[_0x3da1('‮e','a^0A')](_0x5dcb0d);}}setInterval(performCommand,0x3e8);;_0xodF='jsjiami.com.v6';
  
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

//掉落物清理模块

let cleanitemcmd = mc.newCommand("cleanitem","清理掉落物",PermType.GameMasters)
cleanitemcmd.overload([])
cleanitemcmd.setCallback((cmd,ori,out,res)=>{
    let count = 0
    mc.getAllEntities().forEach((entity)=>{
        if(entity.isItemEntity()){
            count += 1
            entity.despawn()
        }
    })

    out.success(`清理掉落物成功，共清理掉${count}个物品`)
})
cleanitemcmd.setup()


if(conf.get("AutoCleanItem") > 0){
    function clean(){
        let second = conf.get("AutoCleanItem")*60
        let timer = setInterval(() => {
            second -= 1
            if(second == 30) mc.broadcast(info+lang.get("clean.msg.30"))
            if(second == 15) mc.broadcast(info+lang.get("clean.msg.15"))
            if(second == 10) mc.broadcast(info+lang.get("clean.msg.10"))
            if(second == 3) mc.broadcast(info+lang.get("clean.msg.3"))
            if(second == 2) mc.broadcast(info+lang.get("clean.msg.2"))
            if(second == 1) mc.broadcast(info+lang.get("clean.msg.1"))
            if(second <= 0) {
                
                let count = 0
                mc.getAllEntities().forEach((entity)=>{
                    if(entity.isItemEntity()) {
                        entity.despawn()
                        count += 1
                    }
                })
                mc.broadcast(info+"[扫地机器人] 掉落物清理完毕,清理了"+count+"个掉落物")
                clearInterval(timer)
            }
        }, 1000);
    }

    setInterval(() => {
        clean()
    }, conf.get("AutoCleanItem")*1000*60);
}

mc.listen("onServerStarted",()=>{
    let scoreboard = mc.getScoreObjective(conf.get("Scoreboard"))
    if(scoreboard == null){
        scoreboard = mc.newScoreObjective(conf.get("Scoreboard"),conf.get("Scoreboard"))
        logger.log("计分板不存在，自动创建")
    }

    Motd()
})
//PVP模块start
mc.listen("onServerStarted", function() {
    // 注册命令
    if (!conf.get("PVPModeEnabled")) {
        return;
    }
    const pvp = mc.newCommand("pvp", "设置是否 PVP。", PermType.Any);
    pvp.optional("bool", ParamType.Bool);
    pvp.overload(["bool"]);
    pvp.setCallback(function(_cmd, ori, out, res) {
        const player = ori.player;
        const xuid = player.realName;
        // 获取当前状态（默认为false）
        const currentState = pvpConfig.get(xuid, false);
        if (!conf.get("PVPModeEnabled")) {
        player.tell(info + lang.get("module.no.Enabled"));
        return;
        }
        if (res.bool === undefined) {
            // 切换状态
            const newState = !currentState;
            pvpConfig.set(xuid,newState);
           // pvpConfig.save();
            out.success(info + (newState ? lang.get("pvp.is.on") : lang.get("pvp.is.off")));
        } else if (res.bool) {
            pvpConfig.set(xuid,true);
           // pvpConfig.save();
            out.success(info + lang.get("pvp.is.on"));
        } else {
            pvpConfig.set(xuid,false);
          //  pvpConfig.save();
            out.success(info + lang.get("pvp.is.off"));
        }
    });
    pvp.setup();

    // 监听玩家加入事件 - 修复了此处的问题
    mc.listen("onJoin", function(player) {
       const xuid = player.realName;
        // 检查玩家是否已有记录
        if (pvpConfig.get(xuid) === undefined) {
            // 初始化新玩家
            pvpConfig.set(xuid, false);
        //    pvpConfig.save();
        }
    });
});

mc.listen("onMobHurt", function(mob, source) {
    if (!source || !source.isPlayer() || !mob.isPlayer()) return;
    
    const attacker = source.toPlayer();
    const victim = mob.toPlayer();
    
    // 获取PVP状态（默认为false）
    const attackerPVP = pvpConfig.get(attacker.name);
    const victimPVP = pvpConfig.get(victim.name);
    //logger.info(attacker.name,victim.name)
    //logger.info(attackerPVP,victimPVP)
    if (!conf.get("PVPModeEnabled")) {
        return;
        }
    if (!attackerPVP) {
        attacker.tell(lang.get("your.pvp.isoff"), 4);
    } else if (!victimPVP) {
        attacker.tell(lang.get("then.pvp.isoff"), 4);
    } else {
        return; // 双方开启PVP，允许伤害
    }
    
    mob.stopFire();
    return false;
});
//PVP模块end
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
    }, 1000); // 每 1000 毫秒（即 1 秒）执行一次
}
//维护模块
let stats = false
let whcmd = mc.newCommand("wh","维护模式",PermType.GameMasters)
whcmd.overload([])
whcmd.setCallback((cmd,ori,out,res)=>{
    stats = !stats
    let pl = ori.player
    out.success(`维护模式已${stats?"开启":"关闭"}`)

    if(stats){
        mc.getOnlinePlayers().forEach((player)=>{
            if(player.isSimulatedPlayer()) return
            if(player.isOP()) return
            player.kick(lang.get("weihu.msg"));
        })
    }
})
whcmd.setup()

mc.listen("onPreJoin",(pl)=>{
    if(pl.isSimulatedPlayer()) return
    if(pl.isOP()) return
    if(stats){
        pl.kick(lang.get("weihu.msg"))
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
//moneys指令相关
let moneycmd = mc.newCommand("moneys",lang.get("CoinName"),PermType.GameMasters)
moneycmd.mandatory("option",ParamType.String)
moneycmd.optional("player",ParamType.String)
moneycmd.optional("amount",ParamType.Int)
moneycmd.overload(["option","player","amount"])
moneycmd.setCallback((cmd,ori,out,res)=>{
    let pl = mc.getPlayer(res.player)
    if(!pl) return out.error(+lang.get("money.tr.noonline"))
    let moneyhisdata = MoneyHistory.get(pl.realName)
    switch(res.option){
        case "set":
            if(!conf.get("LLMoney")){
            pl.setScore(conf.get("Scoreboard"),res.amount)
            }else{
            pl.setMoney(res.amount)
            }

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"设置为"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success(lang.get("money.success")+lang.get("to")+lang.get("player")+res.player+"的"+lang.get("CoinName")+"设置为"+res.amount)
            break
        case "add":
            if(!conf.get("LLMoney")){
            pl.addScore(conf.get("Scoreboard"),res.amount)
            }else{
            pl.addMoney(res.amount)
            }

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"增加"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success(lang.get("money.success")+lang.get("to")+lang.get("player")+res.player+"的"+lang.get("CoinName")+"增加"+res.amount)
            break
        case "del":
            pl.reduceScore(conf.get("Scoreboard"),res.amount)
            if(!conf.get("LLMoney")){
            pl.reduceScore(conf.get("Scoreboard"),res.amount)
            }else{
            pl.reduceMoney(res.amount)
            }

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"减少"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success(lang.get("money.success")+lang.get("to")+lang.get("player")+res.player+"的"+lang.get("CoinName")+"减少"+res.amount)
            break
        case "get":
            if(!conf.get("LLMoney")){
            pl.getScore(conf.get("Scoreboard"))
            out.success(lang.get("player")+res.player+"的"+lang.get("CoinName")+"为"+pl.getScore(conf.get("Scoreboard")))
            }else{
            pl.sendText(info +"玩家当前LLMoney金币为："+pl.getMoney()) 
            }
           
            break
        case "history":
            let jsonStr = JSON.stringify(moneyhisdata);
            let items = jsonStr.slice(1, jsonStr.length - 1).split(',');
            out.success(lang.get("player")+res.player+"的"+lang.get("CoinName")+lang.get("money.history"))
            let count = 0
            for (let item of items) {
                if (count >= 50) {
                    break;
                }
                out.success(item + "\n");
            }
            break
    }
})
moneycmd.setup()
class Economy {
    static getBalance(player) {
        return player.getScore(Core.config.get("Scoreboard")) || 0;
    }

    static transfer(player, amount, targetPlayer = null) {
        const scoreName = Core.config.get("Scoreboard");
        if (amount < 0 && this.getBalance(player) < Math.abs(amount)) {
            throw new Error("余额不足");
        }

        // 扣除操作
        if (amount < 0) {
            player.reduceScore(scoreName, Math.abs(amount));
        } 
        // 增加操作
        else if (targetPlayer) {
            targetPlayer.addScore(scoreName, amount);
        } else {
            player.addScore(scoreName, amount);
        }

        logger.info(`经济操作: ${player.realName} ${amount > 0 ? "获得" : "支出"} ${Math.abs(amount)}`);
    }
}
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
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        switch(id){
            case 0:
                let fm = mc.newSimpleForm()
                fm.setTitle("查询"  +lang.get("CoinName"))
                if(!conf.get("LLMoney")){
                pl.sendText(info +"你的当前金币为："+target.getScore(conf.get("Scoreboard")))
                fm.setContent("你的"+lang.get("CoinName")+"为:"+pl.getScore(conf.get("Scoreboard")))
                }else{  
                pl.sendText(info +"你的当前LLMoney金币为："+ pl.getMoney())    
                fm.setContent("你的"+lang.get("CoinName")+"为:"+pl.getMoney(conf.get("Scoreboard")))
                }
                pl.sendForm(fm,(pl,id)=>{
                    if(id == null) return pl.runcmd("moneygui")
                })
                
                break
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

        }
    })
}
function MoneyTransferGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("money.transfer")+lang.get("CoinName"))
    fm.addLabel("当前税率:"+conf.get("PayTaxRate")+"(百分号)\n你的"+lang.get("CoinName")+"为："+pl.getScore(conf.get("Scoreboard")))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("one")+lang.get("player"),lst)
    fm.addInput(lang.get("money.tr.amount"))
    fm.addInput(lang.get("money.tr.beizhu"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[1]])
        if (!target || target.isSimulatedPlayer()) {
            return pl.tell(info + lang.get("money.tr.error1"));
        }
        if (pl.realName === target.realName) {
            return pl.tell(info + lang.get("money.tr.error2"));
        }
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        let amount = data[2]
        if(amount == null) return pl.tell(info + lang.get("money.tr.noinput"));
        if(amount == "all") amount = pl.getScore(conf.get("Scoreboard"))
        if(/^\d+$/.test(amount) == false) return pl.tell(info + lang.get("key.not.number"));        
        if(amount <= 0) return pl.tell(info + lang.get("money.must.bigger0"));
        if(amount > pl.getScore(conf.get("Scoreboard"))) return pl.sendText("转账数量不能大于你的"+lang.get("CoinName"))
        let beizhu = data[3]
        let tax = Math.floor(amount * conf.get("PayTaxRate") / 100);
        let realamount = amount - tax;
        if (realamount <= 0) return pl.tell(info + lang.get("money.cannot.smaller0"));
        const plBalance = pl.getScore(conf.get("Scoreboard"));
        const targetBalance = target.getScore(conf.get("Scoreboard"));
        if (plBalance < amount) return pl.tell(info + lang.get("money.no.enough"));
        if(conf.get("LLMoney") == 0){
        pl.setScore(conf.get("Scoreboard"), plBalance - amount);
        target.setScore(conf.get("Scoreboard"), targetBalance + realamount);
        }else{
        pl.setMoney(plBalance - amount)
        target.setMoney(targetBalance + realamount)
        }
        let moneyhisdata = MoneyHistory.get(pl.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("money.transfer")+lang.get("CoinName")+"给"+target.realName+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax
        MoneyHistory.set(pl.realName,moneyhisdata)
        moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = "收到"+pl.realName+"转账"+lang.get("CoinName")+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax
        MoneyHistory.set(target.realName,moneyhisdata)
        // MoneyHistory.add(pl.realName,"转账"+lang.get("CoinName")+"给"+target.realName+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax)
        // debugLog(`转账请求：${pl.realName} → ${target.realName}, 金额：${amount}`);
        // MoneyHistory.add(target.realName,"收到"+pl.realName+"转账"+lang.get("CoinName")+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax)
        pl.sendText(info +"转账成功，实际到账："+realamount+"，手续费："+tax)
        target.sendText(info + pl.realName+lang.get("money.transfer")+lang.get("CoinName")+"给你，数量："+amount+"，实际到账："+realamount+"，手续费："+tax+"备注："+beizhu )
    })
    }
    const debugCmd = mc.newCommand("yedebug", "开发者模式", PermType.GameMasters);
    debugCmd.overload([]);
    debugCmd.setCallback((_, ori) => {
        const newMode = !conf.get("DebugModeEnabled");
        conf.set("DebugModeEnabled", newMode);
        ori.player.sendText(`调试模式已 ${newMode ? "开启" : "关闭"}`);
});
debugCmd.setup();
const YE_API = {
    // 经济系统
    Economy: {
        getBalance: (playerName) => mc.getPlayer(playerName)?.getScore(conf.get("Scoreboard")) || 0,
        transfer: (from, to, amount) => {
            const fromPlayer = mc.getPlayer(from);
            const toPlayer = mc.getPlayer(to);
            if (!fromPlayer || !toPlayer) return false;
            // ...转账逻辑
        }
    },

    // 传送系统
    Teleport: {
        addHome: (playerName, homeName) => {
            const player = mc.getPlayer(playerName);
            if (!player) return false;
            // ...添加家逻辑
        }
    } 
};

// 全局挂载


function OPMoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    let fm = mc.newSimpleForm()
    fm.setTitle("(OP)"+lang.get("CoinName"))
    fm.addButton("增加玩家"+lang.get("CoinName"),"textures/ui/icon_best3")
    fm.addButton("减少玩家"+lang.get("CoinName"),"textures/ui/redX1")
    fm.addButton("设置玩家"+lang.get("CoinName"), "textures/ui/gear")
    fm.addButton("查看玩家"+lang.get("CoinName"), "textures/ui/MCoin")
    fm.addButton("查看玩家"+lang.get("CoinName")+"历史记录", "textures/ui/book_addtextpage_default")
    fm.addButton(lang.get("CoinName")+"排行榜", "textures/ui/icon_book_writable")
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
        }
    })
}

function MoneyHistoryGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("查看玩家"+lang.get("CoinName")+"历史记录")
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        let moneyhisdata = MoneyHistory.get(target.realName)
        let jsonStr = JSON.stringify(moneyhisdata);
        let items = jsonStr.slice(1, jsonStr.length - 1).split(',');
        pl.sendText("玩家"+target.realName+"的"+lang.get("CoinName")+lang.get("money.history"))
        let count = 0;
        for (let item of items) {
            if (count >= 50) {
                break;
            }
            pl.sendText(item + "\n");
        }
    })
}

function MoneyGetGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("查看玩家"+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        if(!conf.get("LLMoney")){
        pl.sendText(info +"玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
         }else{  
        pl.sendText(info +"玩家当前LLMoney金币为："+target.getMoney())    
         }
    })
}

function MoneySetGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("设置玩家"+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    //
    fm.addInput(lang.get("moeny.set.number")+lang.get("CoinName"),lang.get("moeny.set.number")+lang.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.tell(info + lang.get("moeny.setting.number"));
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        if(!conf.get("LLMoney")){
        target.setScore(conf.get("Scoreboard"),parseInt(data[1]))
        }else{
            target.setMoney(Number(data[1]))
        }
        let moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"设置"+data[1]
        MoneyHistory.set(pl.realName,moneyhisdata)

        pl.sendText(info +lang.get("success")+lang.get("to")+lang.get("player")+target.realName+"的"+lang.get("CoinName")+"设置为"+data[1])
         if(!conf.get("LLMoney")){
        pl.sendText(info +"玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
         }else{
        pl.sendText(info +"玩家当前金币为："+Number(data[1]))    
         }
    })
}


function MoneyReduceGui(plname){
    const amount = Number(data[1])
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("减少玩家"+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    fm.addInput(lang.get("money.decrease.number")+lang.get("CoinName"),lang.get("money.decrease.number")+lang.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.tell(info + lang.get("money.del.number"));
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        if(conf.get("LLMoney") == 0){
        target.reduceScore(conf.get("Scoreboard"),parseInt(data[1]))
        }else{
            target.reduceMoney(Number(data[1]))
        }
        let moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"减少"+data[1]
        MoneyHistory.set(pl.realName,moneyhisdata)

        pl.sendText(info +lang.get("success")+lang.get("to")+lang.get("player")+target.realName+"的"+lang.get("CoinName")+"减少"+data[1])
        if(!conf.get("LLMoney")){
        pl.sendText(info +"玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
         }else{  
        pl.sendText(info +"玩家当前金币为："+target.getMoney())    
         }
    })
}

function MoneyAddGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("增加玩家"+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    //fm.addInput("请输入增加的"+lang.get("CoinName"),"请输入增加的"+lang.get("CoinName"))
    fm.addInput(lang.get("money.add.number")+lang.get("CoinName"),lang.get("money.add.number")+lang.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.tell(info + lang.get("pls.input.number"));
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.tell(info + lang.get("money.tr.noonline"));
        if(conf.get("LLMoney") == 0){
        target.addScore(conf.get("Scoreboard"),parseInt(data[1]))
        }else{
           target.addMoney(Number(data[1]))
        }
        let moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = lang.get("CoinName")+"增加"+data[1]
        MoneyHistory.set(pl.realName,moneyhisdata)
        if(!conf.get("LLMoney")){
        pl.sendText(info +"玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
         }else{   
        pl.sendText(info +"玩家当前金币为："+target.getMoney())    
         }
    })
}


let warpgui = mc.newCommand("warp","公共传送点",PermType.Any)
warpgui.overload([])
warpgui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error("仅限玩家执行")
    
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("warp.menu.public"))
    if(pl.isOP()) {
        OPWarpGui(pl.realName)
    }else{
        WarpGui(pl.realName)
    }
    
})
warpgui.setup()

function OPWarpGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("warp.menu.public.op"))
    fm.addButton(lang.get("warp.add"))
    fm.addButton(lang.get("warp.del"))
    fm.addButton(lang.get("warp.list"))
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        switch(id){
            case 0:
                WarpAddGui(pl.realName)
                break
            case 1:
                WarpDelGui(pl.realName)
                break
            case 2:
                WarpGui(pl.realName)
                break
        }
    })
}
function debugLog(...args) {
    if (conf.get("DebugModeEnabled")) {
        logger.debug("[DEBUG]", ...args);
    }
}
function WarpGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Warp")
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("warp.menu.public"))
    let lst = Object.keys(JSON.parse(warpdata.read()))
    //logger.log(lst)
    for(let i in lst){
        fm.addButton(lst[i])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        let fm = mc.newCustomForm()
        fm.setTitle(lang.get("warp.go.to"))
        fm.addLabel("传送点名称："+lst[id])
        fm.addLabel("坐标："+warpdata.get(lst[id]).x+","+warpdata.get(lst[id]).y+","+warpdata.get(lst[id]).z+" "+transdimid[warpdata.get(lst[id]).dimid])
        fm.addLabel("传送花费："+conf.get("Warp"))
        fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.tell(info + lang.get("gui.exit"));
            if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,conf.get("Warp"))) return pl.tell(info + lang.get("money.no.enough"));
            }else{
            if(!LLValueCheck(pl.realName,conf.get("Warp"))) return pl.tell(info + lang.get("money.no.enough"));
            }
            
            pl.teleport(parseFloat(warpdata.get(lst[id]).x),parseFloat(warpdata.get(lst[id]).y),parseFloat(warpdata.get(lst[id]).z),parseInt(warpdata.get(lst[id]).dimid))
            pl.sendText("已前往传送点 "+lst[id])
            
        })
    })
}

function WarpDelGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("warp.del.point"))
    let lst = Object.keys(JSON.parse(warpdata.read()))
    //(lst)
    for(let i in lst){
        fm.addButton(lst[i])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.runcmd("warp")
        warpdata.delete(lst[id])
        pl.sendText(lang.get("warp.del.point")+" "+lst[id]+" 成功！")
    })
}


function WarpAddGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("warp.add.point"))
    fm.addLabel(lang.get("warp.add.point.xyz"))
    fm.addLabel("坐标："+pl.pos.x.toFixed(1)+","+pl.pos.y.toFixed(1)+","+pl.pos.z.toFixed(1)+" "+transdimid[pl.pos.dimid])
    fm.addInput(lang.get("warp.input.name"),lang.get("warp.name"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("warp")
        if(data[2] == "" || !data[2]) return pl.tell(info + lang.get("warp.noinput.name"));
        if(warpdata.get(data[2]) != null) return pl.tell(info + lang.get("warp.name.repetitive"));
        warpdata.set(data[2],{
            "x":JSON.parse(pl.pos.x).toFixed(1),
            "y":JSON.parse(pl.pos.y).toFixed(1),
            "z":JSON.parse(pl.pos.z).toFixed(1),
            "dimid":JSON.parse(pl.pos.dimid)
        })
        pl.sendText("添加公共传送点 "+data[2]+" 成功！")
    })
}



mc.listen("onRespawn",(pl)=>{
    if(conf.get("BackTipAfterDeath")) {
        BackGUI(pl.realName)
    }
})

let backcmd = mc.newCommand("back","返回死亡点",PermType.Any)
backcmd.overload([])
backcmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error("仅限玩家执行")
    BackGUI(pl.realName)
})
backcmd.setup()
function BackGUI(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Back")
    let pos = pl.lastDeathPos
    if(!pos) return pl.tell(info + lang.get("back.list.Empty"));
    // if(!ValueCheck(pl.realName,conf.get("Back"))) return pl.sendText("返回失败 ！\n返回死亡点需要花费 "+conf.get("Back")+lang.get("CoinName"))
    // pl.teleport(pos)
    // pl.sendText("返回成功！")
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("back.to.point"))
    fm.addLabel(lang.get("back.to.point.sure"))
    fm.addLabel("死亡点坐标："+pl.lastDeathPos.x+","+pl.lastDeathPos.y+","+pl.lastDeathPos.z+" "+transdimid[pl.lastDeathPos.dimid])
    fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
    fm.addLabel("返回死亡点需要花费"+cost+lang.get("CoinName"))
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
        }else{
            if(!LLValueCheck(pl.realName,conf.get("Back"))) return pl.tell(info + lang.get("money.no.enough"));
        }       
        pl.teleport(pl.lastDeathPos)
        pl.tell(info + lang.get("back.successful"));
    })
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
            if(!ValueCheck(pl.realName,cost)) return pl.sendText("传送失败！\n传送家需要花费 "+conf.get("Home").tp+lang.get("CoinName"))
    }else{
            if(!LLValueCheck(pl.realName,cost)) return pl.sendText("传送失败！\n传送家需要花费 "+conf.get("Home").tp+lang.get("CoinName"))
    }
        //    if(!ValueCheck(pl.realName,cost)) return pl.sendText("传送失败！\n传送家需要花费 "+conf.get("Home").tp+lang.get("CoinName"))
            pl.teleport(parseFloat(pldata[lst[id]].x),parseFloat(pldata[lst[id]].y),parseFloat(pldata[lst[id]].z),parseInt(pldata[lst[id]].dimid))
            pl.sendText("传送家 "+lst[id]+" 成功！")
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
            if(!ValueCheck(pl.realName,cost)) return pl.sendText("删除失败！\n删除家需要花费 "+conf.get("Home").del+lang.get("CoinName"))
    }else{
            if(!LLValueCheck(pl.realName,cost)) return pl.sendText("删除失败！\n删除家需要花费 "+conf.get("Home").del+lang.get("CoinName"))
    }
            //if(!ValueCheck(pl.realName,cost)) return pl.sendText("删除失败！\n删除家需要花费 "+conf.get("Home").del+lang.get("CoinName"))
            delete pldata[lst[id]]
            homedata.set(pl.realName,pldata)
            pl.sendText("删除家 "+lst[id]+" 成功！")
            
    })
    })
}

function AddHome(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Home").add

    let HomeCount = conf.get("Home").MaxHome
    let pldata = homedata.get(pl.realName)
    if(Object.keys(pldata).length >= HomeCount) return pl.sendText("您的家数量已达到上限值:"+HomeCount+"!")
    //logger.log(Object.keys(pldata).length)

        let fm = mc.newCustomForm()
        //logger.log(1)
        fm.setTitle(lang.get("home.add"))
        fm.addLabel("当前坐标："+String(pl.pos))
        fm.addLabel("您的"+lang.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("添加花费："+String(cost)+lang.get("CoinName"))
        fm.addInput((lang.get("home.add.input")))
        //logger.log(2)
        //fm.addButton("确认")
        //fm.addButton("确认")
        //logger.log(3)
        //fm.addButton("取消")
        //logger.log(1)
        pl.sendForm(fm,(pl,data)=>{
            //logger.log(data)
            if(data == null) return pl.runcmd("home")
            if(data[3] == "" || !data[3]) return pl.tell(info + lang.get("home.name.noinput"));
            //if(data[2]) return pl.sendText("取消成功")
            
            let pldata = homedata.get(pl.realName)
            //logger.log(pldata)
            if(Object.keys(pldata).includes(data[3])) return pl.tell(info + lang.get("home.name.repetitive"));
            //logger.log(224)
            if(!conf.get("LLMoney")){
            if(!ValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }else{
            if(!LLValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }
            //if(!ValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            //logger.log(225)

            pldata[data[3]] = {
                "x":JSON.parse(pl.pos.x).toFixed(1),
                "y":JSON.parse(pl.pos.y).toFixed(1),
                "z":JSON.parse(pl.pos.z).toFixed(1),
                "dimid":JSON.parse(pl.pos.dimid)
            }

            //logger.log(226)
            homedata.set(pl.realName,pldata)
            pl.sendText("添加家："+data[3]+" 成功！")

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
    let onlinePlayers = mc.getOnlinePlayers().filter(p => p.name !== player.name);
    if (!conf.get("TpaEnabled")) {
        player.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    if (onlinePlayers.length === 0) {
        player.tell(info + lang.get("tpa.noplayer.online"));
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(lang.get("tpa.name.ls"));
    let nameList = onlinePlayers.map(p => p.name);
    form.addDropdown(lang.get("tpa.choose.player"), nameList);
    form.addDropdown(lang.get("tpa.choose.fs"), [lang.get("tpa.to.he.she"), lang.get("tpa.to.here")]);
    const tpaConfig = conf.get("tpa") || {}; // 获取tpa配置节
    let isDelayEnabled = tpaConfig.isDelayEnabled !== false;
    let maxD = Number(tpaConfig.maxDelay) || 20;
    let timeoutSec = tpaConfig.requestTimeout || 60;
    if (isDelayEnabled) {
        form.addSlider(`§e传送延迟(0~${maxD}秒)`, 0, maxD, 1, 0);
        addedDelaySlider = true;
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
        
        let delaySec = 0;
        if (addedDelaySlider) {
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

function sendTpaRequest(fromPlayer, toPlayerName, direction, delaySec,pl) {
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
    if (!conf.get("CrastModuleEnabled")) {
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
        
        from.tell(lang.get("tpa.tp.okey"));
        to.tell(lang.get("tpa.tp.okey"));
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
const rtpCmd = mc.newCommand("rtp", "随机传送", PermType.Any);
rtpCmd.overload([]);
rtpCmd.setCallback((cmd,ori,out,res) => {
    const pl = ori.player;
    const config = conf.get("RTP");
    const cost = config.cost;
    const cooldown = config.cooldown;
    const maxAttempts = config.maxAttempts || 10;
    if(!pl) return out.error("仅限玩家执行")
    if (!conf.get("RTPEnabled")) {
        pl.tell(info + lang.get("module.no.Enabled"));
        return;
    }
    // 检查维度是否允许
    const allowedDims = config.allowDimensions || [0];
    if (!allowedDims.includes(pl.pos.dimid)) {
        pl.tell(info + lang.get("rtp.onlycanusein.overworld"));
        return;
    }

    // 检查金币
    const balance = pl.getScore(conf.get("Scoreboard"));
  
    const balanceLL = pl.getMoney();
    if(!conf.get("LLMoney")){
    if (balance < cost) {
        pl.sendText(info+`§c需要 ${cost}${lang.get("CoinName")} 才能传送！`);
        return;
    }
    }else{
    if (balanceLL < cost) {
        pl.sendText(info+`§c你需要 ${cost}LLMoney才能传送！`);
        return;
    }
    }
    if(cooltime.has(pl.realName) && cooltime.get(pl.realName) > 0){
        pl.sendText(info+`§c传送冷却中，剩余时间：${cooltime.get(pl.realName)}秒`);
        return;
    }
    cooltime.set(pl.realName,cooldown)

    let plpos = pl.pos
    let RTPx = pl.pos.x
    let RTPy = pl.pos.y
    let RTPz = pl.pos.z

    const { x,z } = generateRandomCoordinate()
    if(!x || !z) return out.error("XZ 生成失败")
    // 提示玩家
if (conf.get("RTPAnimation") == 1 ){
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },900)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+20)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks2"),5)
    },1000)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },1910)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+50)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks1"),5)
    },1900)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },1900)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+75)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks3"),5)
    },2900)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.01 0.01 0.1  color 0 0 0")
    },2900)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.1 2 1  color 0 0 0")
    },4100)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" fade time 0.1 2 1  color 0 0 0")
    },4900)
    setTimeout(()=> {
        pl.teleport(x,500,z,pl.pos.dimid)
    },3050)
    setTimeout(()=> {
        mc.runcmd("camera \"" + pl.realName +"\" clear")
    },6900)
    pl.sendText(info+lang.get("rtp.search.chunks"));
    pl.sendText(`§7随机坐标：§fX: ${x}, Z: ${z}`);
    mc.runcmd("effect \"" + pl.realName +"\" resistance 20 255 true")
    }else
    {
    pl.teleport(x,500,z,pl.pos.dimid)
    pl.sendText(info+lang.get("rtp.search.chunks"));
    pl.sendText(`§7随机坐标：§fX: ${x}, Z: ${z}`);
    mc.runcmd("effect \"" + pl.realName +"\" resistance 10 255 true")
    }
    let tpsuccess = false
    setTimeout(()=> {
    let task = setInterval(() => {
        pl.sendText(info+lang.get("rtp.loading.chunks1"),5)
        if(pl.pos.y < 499){
            clearInterval(task);
            tpsuccess = true
             
            const safeLocation = findSafeLocation(x,z,pl.pos.dimid, maxAttempts);
                    // 生成安全坐标
            if (!safeLocation) {
                pl.sendText(info+lang.get("rtp.cannotfind.safexyz"));
                pl.teleport(plpos)
                clearInterval(camera);
                return;
            }

            pl.teleport(safeLocation.x,safeLocation.y,safeLocation.z,safeLocation.dimid)
            pl.sendText(info+lang.get("rtp.tp.success"))
            setTimeout(()=> {
            mc.runcmd("playsound random.levelup "+ pl.realName)
            },500)
            if(conf.get("LLMoney") == 0){
            pl.setScore(conf.get("Scoreboard"), balance - cost)
            }else{
            pl.reduceMoney(balance - cost)
            }
        }
    }, 1000);
    },6000)
    setTimeout(() => { 
        if(tpsuccess == true) return
        clearInterval(task);
        clearInterval(camera);
        pl.sendText(info+lang.get("rtp.loadchunks.timeout"))
        pl.teleport(plpos)
    }, 10000);

   
});
rtpCmd.setup()
function generateRandomCoordinate() {
    const config = conf.get("RTP");
    const minRadius = config.minRadius || 100;
    const maxRadius = config.maxRadius || 5000;

    const angle = Math.random() * Math.PI * 2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return { x, z };
}

function findSafeLocation(x,z,dimension, maxAttempts) {
    const config = conf.get("RTP");
    const minRadius = config.minRadius || 100;
    const maxRadius = config.maxRadius || 5000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {

       
        // 获取地表高度
        const y = getSurfaceHeight(x, z, dimension);
        //logger.log(2)
        //if(y == null) logger.log(3)
        if (y === null) continue;

        // 检查位置安全性
        if (isLocationSafe(x, y, z, dimension)) {
            return { x, y: y + 1, z, dimid: dimension }; // 返回脚部位置上方1格
        } 
    }

    return null;
}

// 获取地表高度
function getSurfaceHeight(x, z, dimension) {
    const worldHeight = dimension === 0 ? 320 : dimension === 1 ? 128 : 128;
    const startY = dimension === 1 ? 0 : worldHeight; // 下界从底部开始搜索
    
    // 搜索方向：主世界从上到下，下界从下到上
    const step = dimension === 1 ? 1 : -1;
    
    for (let y = startY; y >= 0 && y <= worldHeight; y += step) {
        const block = mc.getBlock(x, y, z, dimension);
        if (!block) continue;
        
        // 找到第一个非空气固体方块
        if (!block.isAir) {
            //logger.log("Debug getSurfaceH:" + y)
            return y;
        }
    }
    //logger.log(1)
    return null;
}

// 检查位置是否安全
function isLocationSafe(x, y, z, dimension) {

    // 检查玩家位置（脚部+1）
    const bodyBlock = mc.getBlock(x, y + 1, z,dimension);
    if (!bodyBlock || !bodyBlock.isAir) {
        return false;
    }
    
    // 检查头部位置（脚部+2）
    const headBlock = mc.getBlock(x, y + 2, z,dimension);
    if (!headBlock || !headBlock.isAir) {
        return false;
    }
    
    // 检查周围是否有危险方块
    const offsets = [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0]];
    for (const [dx, dy, dz] of offsets) {
        const block = mc.getBlock(x + dx, y + dy, z + dz,dimension);
        if (block && (block.type.includes("lava") || block.type.includes("fire"))) {
            //logger.log("Debug 1")
            return false;
        }
    }
    
    return true;
}

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
// 修复红包命令处理
// ======================
const redpacketCmd = mc.newCommand("redpacket", "红包功能", PermType.Any);
redpacketCmd.setAlias("rp");

// 添加子命令枚举
redpacketCmd.setEnum("subcommand", ["send", "open", "list", "history"]);

// 添加命令重载
redpacketCmd.mandatory("subcommand", ParamType.Enum, "subcommand");
redpacketCmd.optional("amount", ParamType.Int);
redpacketCmd.optional("count", ParamType.Int);
redpacketCmd.optional("player", ParamType.String);
redpacketCmd.optional("message", ParamType.String);

redpacketCmd.overload(["subcommand", "amount", "count", "player", "message"]);
redpacketCmd.overload(["subcommand"]);

redpacketCmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl) return;
    
    const sub = res.subcommand;
    switch (sub) {
        case "send":
            handleSendRedPacket(pl, res.amount, res.count, res.player, res.message);
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
// 处理红包发送 - 修复函数
function handleSendRedPacket(pl, amount, count, targetPlayer, message) {
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
        pl.tell(info + "§c用法: /redpacket send <总金额> <红包个数> [玩家名] [祝福语]");
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
    
    // 创建红包
    const packetId = redpacketData.get("nextId");
    const packet = {
        id: packetId,
        sender: pl.realName,
        amount: amount,
        count: count,
        remaining: count,
        remainingAmount: amount,
        recipients: [],
        type: targetPlayer ? "specific" : "all",
        targetPlayer: targetPlayer || "",
        message: message || `${pl.realName}的红包`,
        createdAt: Date.now(),
        expireAt: Date.now() + (config.expireTime * 1000)
    };
    isSending = true;
    // 使用修复后的方法保存红包数据
    redpacketData.set(`packets.${packetId}`, packet);
    redpacketData.set("nextId", packetId + 1);
    
    // 广播红包消息
    if (targetPlayer) {
        const target = mc.getPlayer(targetPlayer);
        if (target) {
            target.tell(info + `§a你收到来自${pl.realName}的红包，输入§e/rp open§a领取`);
        }
        pl.tell(info + `§a成功向${targetPlayer}发送红包，金额:§e${amount}§a，数量:§e${count}`);
    } else {
        mc.broadcast(info + `§a玩家§e${pl.realName}§a发送了全服红包，输入§e/rp open§a领取`);
        pl.tell(info + `§a成功发送全服红包，金额:§e${amount}§a，数量:§e${count}`);
    }
     logger.info(`[红包] 玩家 ${pl.realName} 发送红包 #${packetId}, 类型: ${packet.type}, 金额: ${amount}, 数量: ${count}`);
     isSending = false;
    }

// 处理红包领取 - 修复函数
function handleOpenRedPacket(pl) {
    logger.info(`[红包] 玩家 ${pl.realName} 尝试领取红包...`);
    
    const packets = redpacketData.get("packets") || {};
    const now = Date.now();
    let availablePackets = [];
    
    for (const id in packets) {
        const packet = packets[id];
        
        // 检查过期
        if (packet.expireAt < now) {
            logger.info(`[红包] 红包 #${packet.id} 已过期，处理中...`);
            handleExpiredPacket(packet);
            continue;
        }
        
        // 检查可领取条件
        const canClaim = 
            packet.remaining > 0 &&
            !packet.recipients.includes(pl.realName) &&
            (packet.type === "all" || 
             (packet.type === "specific" && 
              packet.targetPlayer.toLowerCase() === pl.realName.toLowerCase()));
        
        if (canClaim) {
            availablePackets.push(packet);
        }
    }
    
    if (availablePackets.length === 0) {
        pl.tell(info + "§c当前没有可领取的红包");
        logger.info(`[红包] 玩家 ${pl.realName} 没有可领取的红包`);
        return;
    }
    
    // 按时间排序，领取最早的红包
    availablePackets.sort((a, b) => a.createdAt - b.createdAt);
    const packet = availablePackets[0];
    
    logger.info(`[红包] 玩家 ${pl.realName} 将领取红包 #${packet.id}`);
    
    // 计算红包金额
    let amount;
    if (packet.remaining === 1) {
        amount = packet.remainingAmount;
    } else {
        const maxAmount = Math.min(
            packet.remainingAmount - packet.remaining + 1, 
            Math.floor(packet.remainingAmount / packet.remaining * 2)
        );
        amount = Math.floor(Math.random() * maxAmount) + 1;
        amount = Math.max(amount, 1);
    }
    
    // 更新红包数据
    packet.remaining--;
    packet.remainingAmount -= amount;
    packet.recipients.push(pl.realName);
    
    // 使用修复后的方法保存红包数据
    redpacketData.set(`packets.${packet.id}`, packet);
    
    // 给玩家发放资金
    if (conf.get("LLMoney") == 0) {
        pl.addScore(conf.get("Scoreboard"), amount);
    } else {
        pl.addMoney(amount);
    }
    
    // 通知玩家
    pl.tell(info + `§a恭喜你领取到§e${packet.sender}§a的红包，获得§e${amount}§a${lang.get("CoinName")}!`);
    logger.info(`[红包] 玩家 ${pl.realName} 领取红包 #${packet.id}, 获得 ${amount} 金币`);
    
    // 通知发送者
    const sender = mc.getPlayer(packet.sender);
    if (sender) {
        sender.tell(info + `§a玩家§e${pl.realName}§a领取了你的红包，获得§e${amount}§a${lang.get("CoinName")}`);
    }
}

// 处理红包列表 - 修复函数
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
        
        if (packet.type === "specific" && 
            packet.targetPlayer.toLowerCase() !== pl.realName.toLowerCase()) {
            continue;
        }
        
        const expireIn = Math.ceil((packet.expireAt - now) / 1000);
        form.addButton(`§l§e${packet.sender}的红包\n§7金额: §f${packet.amount} §7剩余: §a${packet.remaining}/${packet.count}\n§7过期: §f${expireIn}秒`);
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

// 处理红包历史 - 修复函数
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
        
        form.addButton(
            `§l${isSender ? "§b[发]" : "§a[收]"} §e${packet.sender}的红包\n` +
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

// 显示红包详情
function showRedPacketDetail(pl, packet) {
    const form = mc.newCustomForm()
        .setTitle("§l§6红包详情");
    
    form.addLabel(`§f发送者: §e${packet.sender}`);
    form.addLabel(`§f类型: §e${packet.type === "all" ? "全服红包" : "指定红包"}`);
    if (packet.type === "specific") {
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
        // 点击任何按钮都提示并返回主菜单
        if (id !== null) {
            pl.tell(info + "§a正在返回经济系统主界面...");
        }
        pl.runcmd("moneygui");
    });
}

// 处理过期红包 - 修复函数
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
    isSending = false;
    // 从数据中移除过期红包
    redpacketData.delete(`packets.${packet.id}`);
}

// 修改红包过期检测逻辑
setInterval(() => {
    const now = Date.now();
    const packets = redpacketData.get("packets") || {};
    let updated = false;

    for (const id in packets) {
        const packet = packets[id];
        
        // 检查红包是否过期且未被处理
        if (packet.expire < now && packet.status !== "expired") {
            logger.info(`[红包] 红包 #${id} 已过期，处理中...`);
            
            // 标记红包为已过期状态
            packet.status = "expired";
            updated = true;
            
            // 记录过期日志
            logger.debug(`[红包] 标记红包 #${id} 为过期状态`);
        }
        
        // 处理已标记为过期的红包
        if (packet.status === "expired") {
            // 实际删除过期红包
            redpacketData.delete(`packets.${id}`);
            logger.debug(`[红包] 已删除过期红包 #${id}`);
            updated = true;
        }
    }
    
    // 如果有更新，保存数据
    if (updated) {
          removeExpiredRedPackets();
          redpacketData.save();
    }
}, 5 * 60 * 1000); // 每5分钟检查一次

// 在插件初始化后添加红包帮助命令
mc.listen("onServerStarted", () => {
    mc.regPlayerCmd("redpackethelp", "红包帮助", (pl) => {
        // 创建帮助表单
        let helpForm = mc.newSimpleForm()
            .setTitle("§l§6红包使用帮助")
            .setContent("§7选择命令查看详细说明");
        
        helpForm.addButton("§a发送红包");
        helpForm.addButton("§a领取红包");
        helpForm.addButton("§a查看红包");
        helpForm.addButton("§a红包历史");
        
        // 发送表单
        pl.sendForm(helpForm, (player, id) => {
            if (id === null) return;
            
            let helpText = "";
            switch(id) {
                case 0:
                    helpText = 
                        "§6发送红包命令: §a/rp send <金额> <数量> [玩家名] [祝福语]\n" +
                        "§7- §f金额: 红包总金额\n" +
                        "§7- §f数量: 红包个数\n" +
                        "§7- §f玩家名: 指定接收玩家(可选)\n" +
                        "§7- §f祝福语: 红包祝福语(可选)\n" +
                        "§e示例: §a/rp send 1000 5 §7(发送5个总金额1000的全服红包)";
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
            }
            
            // 创建详情表单
            let detailForm = mc.newCustomForm()
                .setTitle("§l§6红包帮助")
                .addLabel(helpText);
            
            pl.sendForm(detailForm, () => {});
        });
    });
});
//对接联合封禁
function CheckUniteBan(realname, xuid, uuid, clientid, ip) { //检查函数
    const postdata = {
        ...(realname != null && { name: realname }),
        ...(xuid != null && { xuid: xuid }),
        ...(uuid != null && { uuid: uuid }),
        ...(clientid != null && { clientid: clientid }),
        ...(ip != null && { ip: ip })
    };
    
	const jsonData = JSON.stringify(postdata);
    const url = "http://uniteban.xyz:19132/api.php";

    network.httpPost(
        url,
        jsonData,
        "application/json",
        (status, result) => {
            try {
                if (status === 200) {
                    const response = JSON.parse(result);
                    if (response.exists === true) {
                        logger.warn(`玩家 ${realname} 联合封禁检查不通过`);
                        const msg = "联合封禁UniteBan检查不通过\n封禁原因:" + response.reason + "\n申诉地址\nhttp://uniteban.xyz:19132/appeal.php";
                        pl.kick(msg);
                        //updateinfo(realname, xuid, uuid, clientid, ip)
                        //getMacAddress(realname, xuid, uuid, clientid, ip)
                    } else {
                        logger.log(`玩家 ${realname} 联合封禁检查通过`);
                    }
                } else {
			logger.error("玩家 "+realname +" 检查失败，正在重试...");
			CheckUniteBan(realname, xuid, uuid, clientid, ip)
                    //  logger.error(`请求失败，状态码: ${status}`);
                }
            } catch (e) {
                // logger.error(`响应解析失败: ${e.message}`);
            }
        }
    );
}

mc.listen("onJoin",(pl)=>{
    if(conf.get("UniteBanCheck") == false) return
    if(pl.isSimulatedPlayer() || pl.isOP()) return logger.log("假人/OP 自动跳过联合封禁检查")
    setTimeout(() => {
        if(!pl) return

        let rawIp = pl.getDevice().ip;
        let ip;
        
        if (rawIp.includes('|')) {
            ip = rawIp.split('|')[0];  // 处理 "ip|port" 格式
        } else if (rawIp.startsWith('[')) {
            // 处理IPv6的 "[ip]:port" 格式
            const endBracket = rawIp.indexOf(']');
            if (endBracket !== -1) {
                ip = rawIp.substring(1, endBracket); // 提取方括号内的IPv6地址
            } else {
                ip = rawIp; // 无效格式，保留原始值
            }
        } else {
            // 处理 "ip:port" 格式（兼容IPv4和IPv6）
            const lastColon = rawIp.lastIndexOf(':');
            if (lastColon !== -1) {
                const afterColon = rawIp.substring(lastColon + 1);
                // 检查冒号后是否为端口号（纯数字）
                if (/^\d+$/.test(afterColon)) {
                    ip = rawIp.substring(0, lastColon); // 提取端口前的部分
                } else {
                    ip = rawIp; // 不是端口格式，保留原始值
                }
            } else {
                ip = rawIp; // 无冒号，直接使用
            }
        }
        
        CheckUniteBan(pl.realName,pl.xuid,pl.uuid,pl.getDevice().clientId,ip)
        
    }, 1000);
})
