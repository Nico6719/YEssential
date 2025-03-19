求求给个好评罢（​
[介绍]​
这是一个基于LegacyScriptEngine写的基础插件，支持导入TMEssential的home数据和warp数据，包含了服务器优化功能的基础插件​
[功能一览]​

Economic (经济核心)
Shop （预计在2.0.0正式版发布此功能）
HOME (家)
BACK (返回死亡点)
WARP (公共传送点)
DMotd (动态服务器motd)
WeiHu (服务器维护)
Cleanitem (清理掉落物)
Suicide (自杀)
BStopMsg (自定义stop提示)
Notice (自定义公告，配置文件在 ./plugins/YEssential/notice.txt)（支持颜色符号，\n换行）
FixExpLag (防止经验球过多卡服)
ServersTP (跨服传送到其他服务器)（配置文件：Server.json）
FixCopy （防止夸区块漏斗刷物品）
开服自动执行开启死亡不掉落（可在config.json配置是否开启）
[指令一览]​

/home //打开home菜单
/warp //打开warp菜单
/back //前往最近的暴毙点
/moneygui //打开经济系统配置界面
/moneys add & reduce & set 玩家名 金额 //添加玩家的金额
/moneys get 玩家名 //查询该名玩家的余额
/notice //查看公告
/wh //打开或者关闭维护状态
/cleanitem //清理掉落物（立刻执行）
/suicide //自杀
/servers //跨服传送
[部分配置文件]​
Config.json:
自动生成在 plugins/YEssential/，格式如下：
JSON：
{
    {
    "Scoreboard": "money", //计分板名称
    "CoinName": "金币", //货币名称
    "PayTaxRate": 0, //转账税率（%）
    "Home": {
        "add": 100, //添加家花费
        "del": 0, //删除家花费
        "tp": 0, //传送家花费
        "MaxHome": 10 //最大家数量
    },
    "Back": 0, //返回死亡点花费
    "BackTipAfterDeath": 0, //重生后是否自动弹窗（1开启，0关闭）
    "Warp": 0, //前往公共传送点花费
    "Motd": [ //动态Motd
        "Bedrock_Server",
        "Geyser"
    ],
    "WeiHuMsg": "服务器正在维护中，请稍后再来", //维护踢出消息
    "AutoCleanItem": -1, //自动清理掉落物（单位分钟，0关闭）
    "KeepInventory": 1, //开服是否自动执行开启死亡不掉落指令
    "suicide": 0, //自杀所花费的金钱
    "StopServerMsg": "服务器关闭\n请稍后再来", //stop停服自定义信息
    "OptimizeXporb": 1, //经验球拾取优化，防止堆积卡服
    "PlayerCheck_DenyChat": 0 ,//对接PlayerCheck玩家真实性检测，不通过禁止聊天（1开启，0关闭）
    "join_notice": 0, //进服是否自动弹出公告（默认为关闭，1开启）
    "ShopEnabled": true // 商店开关，默认为开启
}
}

配置文件 (shop.json)
图标支持
使用游戏内置材质路径，例如：
textures/items/diamond (钻石)
textures/blocks/gold_block (金块)
支持网络图片（需 Base64 编码）
操作流程
输入 /shop 打开商店主界面
出售：选择物品后设置数量，自动扣除背包物品并增加金币
购买：选择商品后设置数量，自动扣除金币并发放物品
自动生成在 plugins/YEssential/shop.json，格式如下：
JSON：
{
    "sell": [
        {
            "name": "§a钻石",
            "price": 10,
            "item": "minecraft:diamond",
            "meta": 0
        }
    ],
    "buy": [
        {
            "name": "§6金锭",
            "price": 5,
            "item": "minecraft:gold_ingot",
            "meta": 0
        }
    ]
}

server.json
自动生成在 plugins/YEssential/，格式如下：
JSON：
{
    "servers": [
      {"server_name":"下北泽服务器","server_ip":"1.14.5.14","server_port":19181}
    ]
  }

[界面一览]​
1737984968714.png
1737984878759.png
1737984833648.png
公告功能​
1738302178705.png
（公告配置文件文件在 ./plugins/YEssential/notice.txt）
更详细的功能可以前往QQ群530878014查看​
[食用方法]​
丢入服务端目录\plugins即可​

迁移配置文件教程：

把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json
移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json即可
