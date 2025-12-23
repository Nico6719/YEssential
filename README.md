# 📦 YEssential  
**基于 LSE 的多功能基础插件**  

> 一个简洁、实用的基础插件，适用于基岩版服务器。支持 LegacyScriptEngine (LSE) 平台，并可迁移 TMEssential 的部分数据（如 home 和 warp）。 
**插件重构进度：35%**  
已完成：[■■■■□□□□□□] 35%
---

## 📌 基本信息

- **名称**：YEssential  
- **类型**：基础插件 / 多功能前置  
- **平台**：LegacyScriptEngine (LSE)  
- **主要功能**：提供服务器基础指令与功能支持  
- **支持迁移**：TMEssential 的 home 和 warp 数据（可迁移到本插件）

---

## ⚙️ 功能亮点

具体功能会随着版本迭代而更新，已知功能包括：

### 🆕 新增 / 修改功能  

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

1. 登录 MineBBS 下载资源文件（可能需要权限查看/下载）。  
2. 将插件文件解压后放入服务器的 `./plugins/` 目录即可运行。
---

## 🛠 依赖要求

- 需要 **LegacyScriptEngine** 平台支持  
- 兼容并能够导入部分 **TMEssential** 的数据
- 把 服务端目录\plugins\Timiya\data内的homelist.json和warplist.json
- 移动到服务端目录\plugins\YEssential\data内并且分别重命名为homedata.json和warpdata.json然后保存

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
