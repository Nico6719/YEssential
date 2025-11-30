 # YEssential
 一个基于LegacyScriptEngine制作的lse基础插件，并且支持导入TMEssential的home数据和warp数据！并且兼容LL2和LL3！
 More Info: https://www.minebbs.com/resources/yessential-lse.10332/

## Eula

反馈问题前请排查依赖是否正确加载！

反馈在讨论区或者github反馈[（QQ群：1045392458）](https://qm.qq.com/cgi-bin/qm/qr?k=NXRAgTOPiTci5lD9CiUNanMoQFnFSu_y&jump_from=webapi&authKey=soeBGqg/5XJrPvri6uMtcsDvvlUWijGyw3nQXF7Q5q1wWkoyXAtS)

未经授权禁止整合到整合包内！


## 功能一览

Economic (经济核心)（对接PAPI，变量名：%player_money%和%player_llmoney% ，可以显示当前玩家金币数量）（需要GMLIB和GMLIB-LRCA）

SupportLLMoney （支持LLmoney经济系统）

Hub (一键回城，可通过指令设置传送点)

Rtp （随机传送）

Tpa （传送系统）

Home (家)

Back (回死亡点)

Warp (公共传送点)

DMotd (动态motd)

WeiHu (维护提示)

Cleanitem (清理掉落物)

Suicide (自杀)

BStopMsg (自定义stop提示)

Notice （自定义公告，支持颜色符号，\n换行）

FixExpLag (防止经验球卡服)

Crash (把玩家客户端搞崩)

ServersTP (传送到其他服务器)（配置文件：Server.json）

PVP （PVP功能，防止玩家恶意攻击）

MoreLangSupport (插件支持多语言，配置文件：lang.json，您可以自行编写翻译成其他语言发布lang文件到minebbs内！)

开服自动开启死亡不掉落（可在config.json配置）


## 指令一览

/home //打开home菜单

/warp //打开warp菜单

/back //前往最近的暴毙点

/moneygui //打开经济系统

/moneys add & reduce & set 玩家名 金额 //添加玩家的金额

/moneys get 玩家名 //查询该名玩家的余额

/notice //查看公告

/noticeset //更改公告

/wh //打开或关闭维护状态

/cleanitem //清理掉落物（立刻执行）

/suicide //自杀

/servers //跨服传送

/PVP //PVP功能

/rtp //随机传送

/rtpreset //重置冷却时间（Only 管理员）

/tpa //玩家互传系统

/tpayes //同意传送

/tpano //拒绝传送

/tpasettings //拒绝或者同意所有传送请求

/hub //一键回到指定地点

/sethub //设置/hub传送的地点

/crash //打开崩溃玩家客户端菜单


## 部分数据文件位置一览

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

这是所有玩家的转账历史记录


迁移配置文件教程：

把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json

移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json即可


## 贡献

欢迎参与贡献！你可以[提出问题](https://github.com/Nico6719/YEssential/issues/new)或为我们提交拉取请求。

## 许可证

本项目的非闭源部分采用 MIT 许可证发行 - 阅读 [LICENSE](LICENSE) 文件获取更多信息。
