(下载链接访问密码9192)​
[申明]​

反馈问题前请排查依赖是否正确加载！
反馈请在github反馈或QQ群：1045392458
未经授权禁止整合到整合包内！
求求给个好评罢！！
第一次写插件代码可能有点烂，不爱请勿伤害
[介绍]​
一个基于LegacyScriptEngine制作的lse基础插件，并且支持导入TMEssential的home数据和warp数据！并且兼容LL2和LL3！​
[功能特性]​
功能​
描述​
状态​
Economic​
经济核心,对接PAPI
变量：%player_money% 和 %player_llmoney%
可以显示当前玩家金币数量​
✅​
Hub​
一键回城，可通过指令设置传送点​
✅​
Rtp​
随机传送，附带动画​
✅​
Tpa ​
传送系统，借鉴了子邪大佬写的TeleportMaster​
✅​
Home&Warp​
家系统和公共传送点系统​
✅​
Fcam	
灵魂出窍（旁观者）​
✅​
Back&DeathLog​
回死亡点以及记录玩家死亡点​
✅​
DMotd​
动态Motd功能​
✅​
WeiHu​
维护服务器功能，禁止其他非管理成员进入服务器​
✅​
Clean​
自动清理掉落物和实体，掉落物过多时&定时自动清理，支持白名单​
✅​
Suicide​
玩家紫砂（kill myself）​
✅​
BStopMsg​
自定义关服提示​
✅​
MoreLangSupport ​
多语言支持​
✅​
Notice​
自定义公告，支持颜色符号，\n换行,支持游戏内在线编辑！​
✅​
FixExpLag​
防止经验球卡服​
✅​
Crash​
崩溃玩家客户端（慎用！）​
✅​
RedPacket​
玩家可以自行发红包​
✅​
ServersTP​
一键传送到其他服务器​
✅​
PVP ​
PVP功能，防止玩家恶意攻击​
✅​
Keepinventory​
开服自动开启开启死亡不掉落​
✅​
AutoUpdate​
自动更新插件本体并重载​
✅​
Gui修改插件配置​
网页编辑器​
✅​
Plugin for Endstone​
Endstone版本的YEssential​
开发中​
SideBar	
支持自定义侧边栏以及支持PAPI变量​
计划中​
[指令一览]​

指令	功能描述
/home	家系统菜单(设置、传送到家)
/tpa	玩家互传系统(发送传送请求)
/tpayes	同意传送请求
/tpano	拒绝传送请求
/tpasettings	拒绝或者同意所有传送请求
/rtp	随机传送(在不同维度安全随机传送)
/PVP	开关个人PVP功能
/warp	公共传送点菜单
/servers	跨服传送菜单
/back	死亡点传送(返回死亡位置)
/deathlog	查询以往的死亡记录
/moneygui	打开GUI经济系统
/moneys add & del & set get 玩家（非get时加上“金额”）	经济操作 ：添加/减少/增加玩家的金额
/notice	查看公告
/noticeset	更改公告
/wh	打开或关闭维护状态
/clean {air} status & cancel & tps &help	清理掉落物 & 清理状态 & 取消清理 & 查询tps & 帮助
/suicide	自杀
/fcam	开关灵魂出窍功能
/rtpreset	重置冷却时间（Only 管理员）
/hub	一键回到指定地点（所有人可用）
/sethub	设置/hub传送的地点
/crash	打开崩溃玩家客户端菜单
/redpacket history && list && open && send	红包功能（长指令版）
/rp history && list && open && send	红包功能（短指令版）
/redpackethelp	红包功能详解（GUI界面）

[变量一览]​
%player_LLmoney% --显示各个玩家的LLMoney
%player_money% --显示各个玩家的记分板金币
[配置文件注释]​
Config.json（未说明即0[false]为关闭，1[true]为开启）：

JSON：
{
    "AutoUpdate": 1,  //自动更新，默认为开启
    "PVPEnabled": 1,  //PVP模块开关，默认为开启
    "DebugMode": 0,  //Debug模式，默认为关闭
    "CrashModuleEnabled": 0,  //崩端功能开关，默认为关闭
    "NoticeEnabled":0,  //Notice 功能开关，默认为关闭
    "TRServersEnabled": 0,  // 跨服传送开关，默认为关闭
    "RedPacket": {
        "EnabledModule": false,   //红包模块开关，默认为关闭
        "expireTime": 300,
        "maxAmount": 10000,
        "maxCount": 50,
        "minAmount": 1
    },
    "RTP": {  //随机传送模块
        "EnabledModule": false,   //随机传送模块开关，默认为关闭
        "minRadius": 100,    // 最小传送半径
        "maxRadius": 5000,  // 最大传送半径
        "cooldown": 300,   // 冷却时间（秒）
        "cost": 50,    // 传送费用
        "allowDimensions": [
            0,
            1,
            2
        ],  // 允许的维度
        "safeCheck": true,   //传送前安全性检查
        "maxAttempts": 50,  // 最大尝试次数
        "Animation": 0,   //随机传送动画（0为关闭，1为GTA5样式）
        "enableParticle": true,  //传送成功粒子
        "enableSound": true,  //传送成功音效
        "logToFile": true   // 记录日志
    },
    "Hub": { //Hub坐标配置
          "EnabledModule": false,  //Hub功能开关，默认为关闭
          "x": 58776.7,  //x轴
          "y": 68.6,  //y轴
          "z": 59617.9,  //z轴
          "dimid": 0,  //维度坐标
          "isSet": false  //是否已经设置
    },
    "tpa": {  //传送系统配置
        "EnabledModule": false,  //TPA功能开关，默认为关闭
        "isDelayEnabled": true, //是否开启延迟传送
        "maxDelay": 20,   //传送最大延迟
        "cost" : 1,    //tpa传送花费
        "requestTimeout": 60,   //传送请求过期时间
        "promptType": "form"  //传送请求类型
    },
    "Home": {
        "add": 0,  //添加家花费
        "del": 0,  //删除家花费
        "tp": 0,  //传送家花费
        "MaxHome": 10   //最大家数量
    },
    "Fcam": {  //灵魂出窍的配置
                "EnableModule": false,  //是否开启该功能 true或1为开启，0或false关闭
                "CostMoney": 0,  //使用该功能花费的金钱
                "TimeOut": 0  //灵魂出窍使用时间限制
    },
    "wh": {  //维护功能的配置
                "EnableModule": true,    //是否开启该功能 true或1为开启，0或false关闭
                "status": 0  //维护状态1为维护中，0为未维护
    },
    "Motd": [ //动态Motd
        "Bedrock_Server",
        "Geyser"
    ],
    "LLMoney": 0,  //切换经济系统（0为记分板，1为LLmoney模式）
    "Scoreboard": "money",  //计分板名称
    "PayTaxRate": 0,   //转账税率（%）
    "Back": 0 ,  //返回死亡点花费的金钱
    "Warp": 0 ,   //前往公共传送点花费的金钱
    "BackTipAfterDeath": 0,   //重生后是否自动弹窗（1开启，0关闭）
    "KeepInventory": 1,   //开服是否自动执行开启死亡不掉落指令
    "suicide": 0,   //自杀所花费的金钱
    "OptimizeXporb": 1,  //经验球拾取优化，防止堆积卡服
    "join_notice": 0,   //进服是否自动弹出公告（默认为关闭，1开启）
    "RankingModel": 1,  //金币排行榜GUI样式 1为新版，2为旧版
    "lastServerShutdown": 1742694883508,   //勿动
    "forceNotice": 0 , //勿动
    "Version": 265   //版本标识符，勿动！
}

如果你懒，可以试试这个：
YEssential插件配置编辑器
一键配置​
/cleanmgr/Config.json（未说明即0[false]为关闭，1[true]为开启）：
JSON：
{
  "cleanmgr": {
    "enable": true,  //是否开启清理模块
    "interval": 600,  //定时清理（单位： 秒）
    "debug": false,  //debug模式
    "whitelist": [  //清理白名单
      "^minecraft:netherite_",
      "^minecraft:ancient_debris$",
      "^minecraft:dragon_egg$",
      "^minecraft:nether_star$",
      "^minecraft:elytra$",
      "^minecraft:emerald$",
      "^minecraft:beacon$",
      "^minecraft:ender_eye$",
      "^minecraft:shulker_box$",
      "^minecraft:sea_lantern$",
      "^minecraft:enchanted_book$",
      "^minecraft:diamond",
      "^minecraft:totem_of_undying$",
      "^minecraft:ender_pearl$",
      "^minecraft:villager_v2$",
      "^minecraft:ender_crystal$",
      "^minecraft:ender_dragon$",
      "^minecraft:parrot$",
      "^minecraft:chest_minecart$",
      "^minecraft:minecart$",
      "^minecraft:hopper_minecart$",
      "^minecraft:armor_stand$",
      "^minecraft:boat$",
      "^minecraft:sheep$",
      "^minecraft:cow$",
      "^minecraft:pig$",
      "^minecraft:painting$"
    ],
    "notice": {  //倒计时提示
      "notice1": 30,
      "notice2": 10
    },
    "LowTpsClean": {  //低tps自动清理
      "enable": true,
      "minimum": 15
    },
    "clean_Cmd": "clean",  //清理命令自定义
    "playerCooldown": 300  //玩家执行清理冷却时长（单位/秒）
  }
}

server.json，格式如下：
JSON：
{
    "servers": [
      {"server_name":"下北泽服务器","server_ip":"1.14.5.14","server_port":19181}
    ]
  }
[部分数据文件位置一览]​
config.json （插件总配置）
2.2.8及以前在插件根目录
2.2.9之后在.\plugins\YEssential\Config\目录下
server.json （跨服传送配置）
2.2.8及以前在插件根目录
2.2.9之后在.\plugins\YEssential\data\TrSeverData目录下

zh_cn.json (语言文件，原lang.json)
2.2.8及以前.\plugins\YEssential\data\目录下
2.2.9之后在.\plugins\YEssential\lang\目录下
stop指令和wh指令的提示可以在这自行修改

tpaAutoRejectConfig.json
2.2.8及以前.\plugins\YEssential\data\目录下
2.2.9之后在.\plugins\YEssential\TpaSettingsData\目录下
玩家可以使用/tpasettings设置
RTPData.json
2.2.8及以前.\plugins\YEssential\data\目录下
2.2.9之后在.\plugins\YEssential\RTPData\目录下
玩家可以使用/rtp随机传送，/rtpreset 重置时间（Only OP）

pvp_data.json
在.\plugins\YEssential\PVPSettingsData\目录下
玩家可以使用/pvp指令切换PVP功能

notice.json
2.2.8及以前.\plugins\YEssential\data\目录下
2.2.9之后在.\plugins\YEssential\NoticeSettingsData\目录下
/notice内的不再提示的开关数据文件

notice.txt
2.2.8及以前.\plugins\YEssential\目录下
2.2.9之后在.\plugins\YEssential\NoticeSettingsData\目录下
这是输入/notice打开的GUI显示的东西

MoneyHistory.json
2.2.8及以前.\plugins\YEssential\data\目录下
2.2.9之后在.\plugins\YEssential\MoneyHistory\目录下
2.4.0之后在.\plugins\YEssential\Money\目录下
这是所有玩家的转账历史记录

[界面一览]​
Home功能
1760800006549.webp

公告功能
1761732429366.webp

（公告编辑器）

1761732447968.webp

（公告配置文件文件在 ./plugins/YEssential/notice.txt）


金币菜单 （OP）

1760799916459.webp

（玩家）
1760799920629.webp

Back死亡点传送功能：
1760799872589.webp
​
[食用方法]​
丢入服务端目录\plugins即可​

迁移配置文件教程：

把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json
移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json然后保存
贡献：​
欢迎提交 Issue 和 Pull Request到Github上，共同完善 YEssential。
