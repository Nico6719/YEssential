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
// LiteLoader-AIDS automatic generated
// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Admin\ku/dts/helperlib/src/index.d.ts"/> 
const { PAPI } = require('./GMLIB-LegacyRemoteCallApi/lib/BEPlaceholderAPI-JS');
const YEST_LangDir = "./plugins/YEssential/lang/";
const pluginpath = "./plugins/YEssential/";
const datapath = "./plugins/YEssential/data/";
const NAME = `YEssential`;
const PluginInfo =`YEssential多功能基础插件 `;
const version = "2.4.3";
const regversion =[2,4,3];
const info = "§l§b[YEST] §r";
const offlineMoneyPath = datapath+"/Money/offlineMoney.json";
// 提取默认语言对象 ,调用示例： pl.tell(info + lang.get("1.1"));
const defaultLangContent = {
    "Upd.check":"正在检查新版本中.... 您可在config.json禁用自动更新",
    "Upd.success":"更新成功！稍后将重载插件",
    "Upd.fail":"更新失败",
    "Tip1":"如有Bug请联系作者反馈！！！！",
    "Version.Chinese":"版本:",
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
    "money.create.score":"计分板项目不存在，以为您自动创建",
    "money.callback.menu":"§a正在返回经济系统主界面...",
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
    "money.no.enough": "您的余额不足！",
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
    "money.op.add":"增加玩家的",
    "money.op.remove":"减少玩家的",
    "money.op.set":"设置玩家的",
    "money.op.look":"查看玩家的",
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
};

// 创建语言文件（如果不存在）      
const langFilePath = YEST_LangDir + "zh_cn.json";
let lang = new JsonConfigFile(langFilePath, JSON.stringify(defaultLangContent));

// 语言文件合并功能
function mergeLangFiles() {
    try {
        // 确保语言目录存在
        if (!file.exists(YEST_LangDir)) {
            file.mkdir(YEST_LangDir);
        }
        
        // 读取现有语言文件（如果存在）
        let currentLangData = {};
        if (file.exists(langFilePath)) {
            try {
                const content = file.readFrom(langFilePath);
                currentLangData = JSON.parse(content);
            } catch (e) {
                logger.error("解析语言文件时出错: " + e);
            }
        }
        
        // 合并数据（只添加新键，保留现有键的值）
        const mergedData = {...currentLangData};
        let addedCount = 0;
        
        for (const key in defaultLangContent) {
            if (!(key in mergedData)) {
                mergedData[key] = defaultLangContent[key];
                addedCount++;
            }
        }
        
        // 如果有新键添加，则写入文件
        if (addedCount > 0) {
            file.writeTo(langFilePath, JSON.stringify(mergedData, null, 2));
            colorLog("green",`语言文件已更新，新增 ${addedCount} 个条目`);
            
            // 重新初始化语言对象以使用最新数据
            lang = new JsonConfigFile(langFilePath, JSON.stringify(mergedData));
        }
    } catch (e) {
        logger.error("合并语言文件时出错: " + e);
    }
}

ll.registerPlugin(NAME, PluginInfo,regversion, {
    Author: "Nico6719",
    License: "GPL-3.0",
    QQ : "1584573887",
});


let conf = new JsonConfigFile(pluginpath +"/Config/config.json",JSON.stringify({}));
  
let homedata = new JsonConfigFile(datapath +"homedata.json",JSON.stringify({}));
  
let rtpdata = new JsonConfigFile(datapath +"/RTPData/Rtpdata.json",JSON.stringify({}));

let warpdata = new JsonConfigFile(datapath +"warpdata.json",JSON.stringify({}));
  
let noticeconf = new JsonConfigFile(datapath + "/NoticeSettingsData/notice.json",JSON.stringify({}));

let pvpConfig = new JsonConfigFile(datapath +"/PVPSettingsData/pvp_data.json",JSON.stringify({}));

let noticetxt = new IniConfigFile(datapath +"/NoticeSettingsData/notice.txt");

let MdataPath = datapath +"/Money/Moneyranking.json";

let offlineMoney = new JsonConfigFile(offlineMoneyPath, "{}");

let MoneyHistory = new JsonConfigFile(datapath +"/Money/MoneyHistory.json",JSON.stringify({}));

let moneyranking = new JsonConfigFile(MdataPath, "{}");

var c_y = JSON.stringify({
    servers: [
      { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
    ]
  });

let servertp = new JsonConfigFile(datapath +"/TrSeverData/server.json", c_y);

let tpacfg = new JsonConfigFile(datapath +"/TpaSettingsData/tpaAutoRejectConfig.json",JSON.stringify({}));

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
function displayPlayerMoneyInfo(pl, target) {
    if (!conf.get("LLMoney")) {
        pl.sendText(info + "你的当前金币为：" + target.getScore(conf.get("Scoreboard")))
        return "你的" + lang.get("CoinName") + "为:" + pl.getScore(conf.get("Scoreboard"));
    } else {
        pl.sendText(info + "你的当前LLMoney金币为：" + pl.getMoney());
        return "你的" + lang.get("CoinName") + "为:" + pl.getMoney();
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

conf.init("AutoUpdate",1)  //2.4.0
conf.init("PVPModeEnabled",1)
//conf.init("DebugModeEnabled", false);
conf.init("HubEnabled",0)
conf.init("TpaEnabled",0)
conf.init("NoticeEnabled",0)
conf.init("CrastModuleEnabled",0)
conf.init("TRServersEnabled", false);
conf.init("RTPEnabled", false);
conf.init("NoticeEnabled",false);
conf.init("RedPacketEnabled",false)
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
conf.init("RTPAnimation",0)
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
conf.init("RankingModel",1)//2.4.3
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
}, 6000);
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
function compareVersions(v1, v2) {
    // 将版本号拆分成数字数组 ("2.3.9" => [2, 3, 9])
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    // 比较每个分段
    const maxLength = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < maxLength; i++) {
        // 处理长度不一致的情况（缺失的部分视为0）
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        
        if (num1 > num2) return 1;   // v1 > v2
        if (num1 < num2) return -1;  // v1 < v2
    }
    return 0;  // 版本相同
}
// ======================
// 服务器启动时自动检测公告更新
// ======================
mc.listen("onServerStarted", () => { 
    isSending = false;
    PAPI.registerPlayerPlaceholder(getScoreMoney, "YEssential", "player_money");//注册玩家的金钱PAPI
    PAPI.registerPlayerPlaceholder(getLLMoney, "YEssential", "player_LLmoney");//注册玩家的LLMoney金钱PAPI
    logger.info(PluginInfo+lang.get("Version.Chinese")+version+",作者：Nico6719") 
    logger.info("--------------------------------------------------------------------------------")
    logger.info(" ██╗   ██╗███████╗███████╗███████╗███████╗███╗   ██╗████████╗██╗ █████╗ ██╗  ")
    logger.info(" ╚██╗ ██╔╝██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║██╔══██╗██║  ")
    logger.info("  ╚████╔╝ █████╗  ███████╗███████╗█████╗  ██╔██╗ ██║   ██║   ██║███████║██║     ")
    logger.info("   ╚██╔╝  ██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██╔══██║██║     ")
    logger.info("    ██║   ███████╗███████║███████║███████╗██║ ╚████║   ██║   ██║██║  ██║███████╗")
    logger.info("    ╚═╝   ╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚══════╝")
    logger.info("--------------------------------------------------------------------------------")
    logger.info("在线config编辑器：https://jzrxh.work/projects/yessential/config.html")
    colorLog("blue","感谢PHEyeji提供技术支持和指导！感谢ender罗小黑提供在线网页支持！")
 // logger.warn("这是一个测试版本，请勿用于生产环境！！！")
    colorLog("blue",lang.get("Tip1"))
    if(conf.get("KeepInventory")){
        mc.runcmdEx("gamerule KeepInventory true")
        colorLog("green",lang.get("gamerule.KeepInventory.true"))
    }
    mergeLangFiles();
    if(conf.get("AutoUpdate")) {
    logger.warn(lang.get("Upd.check"))
    network.httpGet("https://dl.mcmcc.cc/file/Version.json", (status, result) => {
    if (status !== 200) {
        logger.error(`请求失败！状态码: ${status}`);
        return;
    }
    try {
        // 解析 JSON 数据
        const jsonData = JSON.parse(result);
        
        // 提取版本号

        const remoteVersion = jsonData.version;
        
        // 比较版本
        const comparison = compareVersions(remoteVersion, version);
        
        if (comparison > 0) {
            logger.warn(`发现新版本! ${version} → ${remoteVersion}`);
            logger.warn(`正在更新到 ${remoteVersion} 中.....`);
	        network.httpGet('https://dl.mcmcc.cc/file/YEssential.js', function (st2, dat2) {
		    if (st2 == 200) {
               colorLog("green",lang.get("Upd.success"))
			   let new_plugin_raw = dat2.replace(/\r/g, '');
			   file.writeTo(pluginpath+"YEssential.js", new_plugin_raw) 
               setTimeout(() => {
                mc.runcmdEx("ll reload YEssential")
               } , 1000);
		    }
		    else 
            {
			logger.error(lang.get("Upd.fail"))
		    }
    	})
        } else if (comparison < 0) {
            colorLog("red",`您的本地版本比远程版本更新！ (${version} > ${remoteVersion})`);
        } else {
            colorLog("green",`您已是最新版本 (${version})`);
        }
    } catch (e) {
        logger.error("JSON 解析错误: " + e);
    }
    });
    } else {
        return;  
    }   
    
    const lastShutdown = conf.get("lastServerShutdown") || 0;
    conf.set("lastServerShutdown", Date.now());
    const lastUpdate = noticeconf.get("lastNoticeUpdate") || 0;
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
if (conf.get("OptimizeXporb") == 1 )
    {
setInterval(() => {
  mc.runcmdEx("execute as @e[type=xp_orb] at @s run tp @p")
}, 1000*10);
}  else
{ 
}  
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
        logger.warn(lang.get("money.create.score"))
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
    if (conf.get("RedPacketEnabled")== 1){
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
function redpacketgui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newSimpleForm()
    fm.setTitle(lang.get("rp.menu.1"))
    fm.addButton(lang.get("rp.send.packet"), "textures/ui/trade_icon")
    fm.addButton(lang.get("rp.open.packet"), "textures/ui/MCoin")
    fm.addButton(lang.get("rp.all.help"), "textures/ui/book_addtextpage_default")
     pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.tell(info + lang.get("gui.exit"));
        switch(id){
           case 0:
                if (data === null) return pl.runcmd("moneygui");
                let fm = mc.newCustomForm().setTitle(lang.get("rp.send.packet"))
                fm.addDropdown(lang.get("redpacket.type"),[lang.get("rp.random.packet"),lang.get("rp.average.packet")])
                fm.addInput(lang.get("rp.send.amount"))
                fm.addInput(lang.get("rp.send.count"))
                pl.sendForm(fm, (pl, data) => {
                let type = data[0]      
                let amount = data[1]
                if(amount == null) return pl.tell(info + lang.get("money.tr.noinput"));
                if(amount == "all") amount = pl.getScore(conf.get("Scoreboard"))
                if(/^\d+$/.test(amount) == false) return pl.tell(info + lang.get("key.not.number"));        
                if(amount <= 0) return pl.tell(info + lang.get("money.must.bigger0"));
                let count = data[2]
                if(count == null) return pl.tell(info + lang.get("money.tr.noinput"));
                if(/^\d+$/.test(count) == false) return pl.tell(info + lang.get("key.not.number"));        
                if(count <= 0) return pl.tell(info + lang.get("money.must.bigger0"));
                if(!conf.get("LLMoney")){
                if(count > pl.getScore(conf.get("Scoreboard"))) return pl.sendText(lang.get("rp.count.bigger.yourmoney")+lang.get("CoinName"))
                }else{
                if(count > pl.getMoney()) return pl.sendText(lang.get("rp.count.bigger.yourmoney")+lang.get("CoinName"))
                }
                if(type == 0){
                pl.runcmd("rp send "+amount+" "+count)
                }else{
                pl.runcmd("rp send "+amount+" "+count+" average")
                }
                });
                break;
            case 1:
                pl.runcmd("rp list")
                break
            case 2:
                pl.runcmd("redpackethelp")
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
    fm.addButton(lang.get("money.op.add")+lang.get("CoinName"),"textures/ui/icon_best3")
    fm.addButton(lang.get("money.op.remove")+lang.get("CoinName"),"textures/ui/redX1")
    fm.addButton(lang.get("money.op.set")+lang.get("CoinName"), "textures/ui/gear")
    fm.addButton(lang.get("money.op.look")+lang.get("CoinName"), "textures/ui/MCoin")
    fm.addButton("查看玩家的"+lang.get("CoinName")+"历史记录", "textures/ui/book_addtextpage_default")
    fm.addButton("全服"+lang.get("CoinName")+"排行榜", "textures/ui/icon_book_writable")
    if (conf.get("RedPacketEnabled")== 1){
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
                redpacketgui(pl.realName)
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
    fm.setTitle(lang.get("money.op.look")+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
    pl.sendForm(fm, (pl, data) => {
     if (data == null) return pl.runcmd("moneygui");
       let target = mc.getPlayer(lst[data[0]]);
          if (!target) return pl.tell(info + lang.get("money.tr.noonline"));
          displayMoneyInfo(pl, target, false); // 查询其他玩家
    });
}

function MoneySetGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("money.op.set")+lang.get("CoinName"))
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
        pl.sendText(info +"玩家当前金币为："+target.getMoney())    
         }
    })
}


function MoneyReduceGui(plname){
    const amount = Number(data[1])
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("money.op.remove")+lang.get("CoinName"))
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
    fm.setTitle(lang.get("money.op.add")+lang.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown(lang.get("choose")+lang.get("player"),lst)
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
        pl.sendText(info +"已成功给"+pl.realName+"添加"+data[1]+" "+conf.get("Scoreboard"))   
        pl.sendText(info +"玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
         }else{   
        pl.sendText(info +"已成功给"+pl.realName+"添加"+data[1]+conf.get("Scoreboard"))   
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
        fm.addLabel(displayMoneyInfo(pl, pl, true))        
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
    let fm = mc.newCustomForm()
    fm.setTitle(lang.get("back.to.point"))
    fm.addLabel(lang.get("back.to.point.sure"))
    fm.addLabel("死亡点坐标："+pl.lastDeathPos.x+","+pl.lastDeathPos.y+","+pl.lastDeathPos.z+" "+transdimid[pl.lastDeathPos.dimid])
    fm.addLabel(displayMoneyInfo(pl, pl, true))    
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
            if(!ValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }else{
            if(!LLValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+lang.get("CoinName"))
            }
            pldata[data[3]] = {
                "x":JSON.parse(pl.pos.x).toFixed(1),
                "y":JSON.parse(pl.pos.y).toFixed(1),
                "z":JSON.parse(pl.pos.z).toFixed(1),
                "dimid":JSON.parse(pl.pos.dimid)
            }
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
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },900)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+20)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks2"),5)
    },1000)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },1910)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+50)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks1"),5)
    },1900)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.1 0.01 0.1  color 0 0 0")
    },1900)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" set minecraft:free pos "+RTPx+" "+(RTPy+75)+" "+RTPz+" facing " + pl.realName)
        pl.sendText(info+lang.get("rtp.loading.chunks3"),5)
    },2900)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.01 0.01 0.1  color 0 0 0")
    },2900)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.1 2 1  color 0 0 0")
    },4100)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" fade time 0.1 2 1  color 0 0 0")
    },4900)
    setTimeout(()=> {
        pl.teleport(x,500,z,pl.pos.dimid)
    },3050)
    setTimeout(()=> {
        mc.runcmdEx("camera \"" + pl.realName +"\" clear")
    },6900)
    pl.sendText(info+lang.get("rtp.search.chunks"));
    pl.sendText(`§7随机坐标：§fX: ${x}, Z: ${z}`);
    mc.runcmdEx("effect \"" + pl.realName +"\" resistance 30 255 true")
    }else
    {
    pl.teleport(x,500,z,pl.pos.dimid)
    pl.sendText(info+lang.get("rtp.search.chunks"));
    pl.sendText(`§7随机坐标：§fX: ${x}, Z: ${z}`);
    mc.runcmdEx("effect \"" + pl.realName +"\" resistance 15 255 true")
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
            mc.runcmdEx("playsound random.levelup "+ pl.realName)
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
    if (!conf.get("RedPacketEnabled")) {
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
    
    if (!conf.get("RedPacketEnabled")) {
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
        // 点击任何按钮都提示并返回主菜单
        if (id !== null) {
            pl.tell(info + "§a正在返回经济系统主界面...");
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
    if (!conf.get("RedPacketEnabled")) {
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
    }
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
    const url = "https://uniteban.mcwaf.cn/api.php";

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
