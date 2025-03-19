​这是一个基于LegacyScriptEngine写的基础插件，支持导入TMEssential的home数据和warp数据，包含了服务器优化功能的基础插件​

[功能一览]
​

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

[食用方法]
​
丢入服务端目录\plugins即可​


迁移配置文件教程：


把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json

移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json即可
