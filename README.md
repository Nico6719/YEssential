# 📦 YEssential  
**基于 LSE 的多功能基础插件**  

> 一个简洁、实用的基础插件，适用于基岩版服务器。支持 LegacyScriptEngine (LSE) 平台，并可迁移 TMEssential 的部分数据（如 home 和 warp）。 
## 📌 基本信息

- **名称**：YEssential  
- **类型**：基础插件 / 多功能前置  
- **平台**：LegacyScriptEngine (LSE)  
- **主要功能**：提供服务器基础功能（如：Home Tpr Tpa Warp Money 等）  
- **支持迁移**：TMEssential 的 home 和 warp 数据（可迁移到本插件）

---

## ⚙️ 功能亮点

具体功能会随着版本迭代而更新，已知功能包括：

### 🆕 新增 / 修改功能  
<details>
<summary>点击这里展开/折叠</summary>

这里放置你想折叠的内容，可以是：
- 普通文本
- 列表
- **加粗**等Markdown格式
- 最重要的是：**代码块**
- 添加了公告设置功能  
  - 指令：`/noticeset`  
  - 可通过 GUI 修改公告内容  
  - 重启服务器后会对所有玩家强制弹出公告  
- 添加随机传送指令：`/rtp`  
- 更多基础功能完善与指令优化 
---

## 📈 版本更新

插件已持续迭代更新以适应不同 LSE 与 LeviLamina 版本。示例更新版本： 
| 版本   | 更新内容                   | 日期        |
|--------|----------------------------|-------------|
| 1.0.6  | 适配最新 LSE 和 LeviLamina | 2025/01/26  |
| 2.6.6  | 多项功能更新                | 2025/12/20  |
| 2.6.8  | 模块拆分更新                | 2025/12/22  |
| 3.0.0  | GitHub 下载新版            | 未注明      |

⚠️ *以上为部分版本信息，具体以最新资源页 / GitHub 为准。* 

---

## 📥 下载 / 安装

1. 前往 [MineBBS](https://www.minebbs.com/resources/yessential-lse.10332/) & [何意味网盘](https://xn--vzyr4p.xn--vqqq8jxym.com/disk/s/pVEv2fyRnFB?domainId=bj27706) & [Releases](https://github.com/Nico6719/YEssential-For-Levilamina/releases) & [Y系列插件下载站](dl.mcmcc.cc)下载本插件
2. 将插件文件解压后放入服务器的 `./plugins/` 目录即可运行。
---

## 🛠 依赖要求

- 需要 **LegacyScriptEngine** 平台支持  
- 兼容并能够导入部分 **TMEssential** 的数据
>把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json<br>
>移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json然后保存

---

## 💡 适用场景

适合基岩版 Minecraft 服务器使用，特别是：

- 想从 TMEssential 迁移到新基础插件  
- 需要增强默认指令与服务器管理功能 
---

## 🧩 与 LeviLamina 关系说明

YEssential 在版本 1.0.0 起已开始兼容 **LeviLamina** 平台，与 LSE 平台配合可以用于更强的服务器模组环境支持。

*LeviLamina 是一个轻量、模块化的 Minecraft Bedrock Edition 模组加载器，为插件/模组提供基础 API 和事件系统支持。* 

---
## 📦 配置文件
- ./Config/config.json
```json
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
```
> 懒怎么办？？ 试试[网页配置编辑器](https://jzrxh.work/projects/yessential/config.html)吧！
- ./Config/cleanmgr/config.json
```json
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
```
- ./data/TrSeverData/server.json
```json
{
    "servers": [
      {"server_name":"下北泽服务器","server_ip":"1.14.5.14","server_port":19181}
    ],
    "servers1": [
      {"server_name":"下北泽服务器","server_ip":"1.14.5.14","server_port":11451}
    ]
  }
```

---
## 📦 示例指令

以下是部分常用指令示例（视插件版本可能会有所变动）：

```txt
/home	 #家系统菜单(设置、传送到家)
/tpa	 #玩家互传系统(发送传送请求)
/tpayes	 #同意传送请求
/tpano	 #拒绝传送请求
/tpasettings	 #拒绝或者同意所有传送请求
/rtp	 #随机传送(在不同维度安全随机传送)
/PVP	 #开关个人PVP功能
/warp	 #公共传送点菜单
/servers	 #跨服传送菜单
/back	 #死亡点传送(返回死亡位置)
/deathlog	 #查询以往的死亡记录
/moneygui	 #打开GUI经济系统
/moneys add & del & set get 玩家（非get时加上“金额”）	 #经济操作 ：添加/减少/增加玩家的金额
/notice	 #查看公告
/noticeset	 #更改公告
/wh	 #打开或关闭维护状态
/clean {air} status & cancel & tps &help	 #清理掉落物 & 清理状态 & 取消清理 & 查询tps & 帮助
/suicide	 #自杀
/fcam	 #开关灵魂出窍功能
/rtpreset	 #重置冷却时间（Only 管理员）
/hub	 #一键回到指定地点（所有人可用）
/sethub	 #设置/hub传送的地点
/crash	 #打开崩溃玩家客户端菜单
/redpacket history && list && open && send	 #红包功能（长指令版）
/rp history && list && open && send	 #红包功能（短指令版）
/redpackethelp	 #红包功能详解（GUI界面）
```
## 贡献

欢迎提交 Issue 和 Pull Request，共同完善 YEssential。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nico6719/YEssential-For-Levilamina&type=Date)](https://star-history.com/#Nico6719/YEssential-For-Levilamina&Date)
