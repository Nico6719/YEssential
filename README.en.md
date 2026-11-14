# YEssential
![](https://img.shields.io/github/v/release/Nico6719/YEssential?style=flat-square&logo=github&color=orange&label=Version)
![](https://img.shields.io/github/downloads/Nico6719/YEssential/total?style=flat-square&logo=github&color=33ccff&label=Downloads)
![](https://img.shields.io/github/languages/top/Nico6719/YEssential?style=flat-square&logo=javascript&color=yellow)

![](https://img.shields.io/github/stars/Nico6719/YEssential?style=flat-square&logo=github&color=yellow&label=Stars)
![](https://img.shields.io/github/last-commit/Nico6719/YEssential?style=flat-square&color=lightgrey)
![](https://komarev.com/ghpvc/?username=Nico6719-YEssential&color=green&style=flat-square&label=Views)

> **English** | [中文](./README.md)

---
> A multi-functional, modular essentials plugin for Minecraft Bedrock. It can migrate part of TMEssential's data (home and warp) and the menu data of [PMenu](https://www.minebbs.com/resources/pmenu.4277/). Import instructions are at the bottom.<br>
> **If your server runs a version below 1.21.80, use an old release (2.10.2 or lower)!**

## 📌 Basic info

- **Name**: YEssential
- **Type**: Essentials plugin / multi-functional modular plugin
- **Platform**: LegacyScriptEngine (LSE)
- **Main features**: Server essentials (Home, Tpr, Tpa, Warp, Money, etc.)
- **Data migration**: TMEssential home/warp data and more can be moved here

---
### 📦 Installation
- Option 1: install with lip: `lip install github.com/Nico6719/YEssential`
- Option 2: download the archive and extract it into your plugin directory

### 📥 Manual download / install

1. Get it from [MineBBS](https://www.minebbs.com/resources/yessential-lse.10332/), [Releases](https://github.com/Nico6719/YEssential/releases) or the [Y-series download site](http://dl.mcmcc.cc)
2. Extract the files into your server's plugin directory and start the server

## ⚙️ Highlights

### Features

| Feature | Description | Status |
|--------|----------------------------|-------------|
| Modules | Multi-module support | ✅ |
| Economic | Economy core | ✅ |
| Menu | Menu system, compatible with [PMenu](https://www.minebbs.com/resources/pmenu.4277/) config files | ✅ |
| Hub | One-click return to a set location | ✅ |
| Rtp | Random teleport with animation | ✅ |
| Tpa | Teleport system, inspired by TeleportMaster by 子邪, supports blacklisting | ✅ |
| Home & Warp | Home system (public homes supported) and shared warps | ✅ |
| Fcam | Spectator-style out-of-body mode | ✅ |
| Back & DeathLog | Return to death point and keep a death log | ✅ |
| DMotd | Dynamic MOTD | ✅ |
| WeiHu | Maintenance mode, keeps non-staff out of the server | ✅ |
| Clean | Auto-clear dropped items and entities, timed and threshold based, with whitelist | ✅ |
| Suicide | Let players kill themselves | ✅ |
| BetterStopMsg | Custom stop message | ✅ |
| MoreLangSupport | Multi-language support | ✅ |
| Notice | Server notices with colour codes and `\n` newlines, editable in game | ✅ |
| FixExpLag | Prevents experience orbs from lagging the server | ✅ |
| CD | Menu system | ✅ |
| Crash | Crash a player's client (use with care) | ✅ |
| RedPacket | Players can send red packets | ✅ |
| ServersTP | Teleport to another server | ✅ |
| Sign | Daily sign-in system | ✅ |
| PVP | Per-player PVP toggle, stops unwanted attacks | ✅ |
| AutoUpdate | Updates and reloads the plugin itself, signed manifests since 2.13.0 | ✅ |
| Bstats | BDS and player-count statistics (can be disabled in config)<br>Stats help the author understand how the plugin behaves in the wild | ✅ |
| WebConfigChange | Edit config in the browser, saved and reloaded automatically (local only by default) | ✅ |
| WebUICustomize | Accent colour, motion, font density, frosted glass, custom background | ✅ |
| MoneyHistory | Ledger of money changes with reason and balance | ✅ |
| Plugin for Endstone | Endstone build of YEssential | 🚧 In development |
| SideBar | Custom sidebar with PAPI placeholders | 📅 Planned |

### Related PAPI placeholders
Note: these placeholders are deprecated since 2.8.7.
| Placeholder | Description |
|--------|----------------------------|
| %player_money% | Player's scoreboard money |
| %player_llmoney% | Player's LLMoney balance |

### 🆕 Added / changed features
<details>
<summary>Click to expand / collapse</summary>

- v2.10.0-v2.11.0
  - Fixed /tpa, /tpayes, /tpano, /hub, /sethub registering through fake commands (**regPlayerCmd**), which broke them after a reload; now registered with real newCommand
  - Fixed inconsistent titles on /hub
  - Added public homes and home settings, and restyled the /home GUI
  - You can now mark a home as public when creating it or in home settings (anyone can teleport to a public home)
  - Commands are only registered when the matching module is enabled, so disabled modules no longer clutter tab completion (tpa, Hub, Servers, RTP)
  - Removed redundant module-toggle checks inside command callbacks, now handled once at registration
  - Removed dead code and improved overall performance
  - Removed Baby Him
  - And more...
- v2.7.1 -- v2.7.2
  - Rewrote the economy system
  - Cleaner logging
  - Removed unused code and optimised
  - Fixed several latent bugs
  - Rewrote large parts of the codebase (economy, RTP)
  - RTP and auto-update turned into modules
  - Fixed RTP animation issues
  - Fixed possible issues on server start
  - More language files exported
  - Initial offline transfer support
- v2.7.0 -- v2.6.6
  - Code cleanup
  - Clean rewritten as an independent module with its own config, usable as a standalone cleaner: entities, whitelist, i18n, error analysis
  - Improved loading messages
  - Config manager split into a module
  - Rewrote the module loader
  - Improved startup logs

</details>

---

## 📈 Version history

The plugin keeps up with LSE and LeviLamina releases. Sample history:
| Version | Highlights | Date |
|--------|----------------------------|-------------|
| 1.0.6 | Adapted to the latest LSE and LeviLamina | 2025/01/26 |
| 2.6.6 | Many feature updates | 2025/12/20 |
| 2.6.8 | Module split | 2025/12/22 |
| 2.8.0 | Module optimisation | 2026/1/22 |
| 2.10.10 | Menu and sign-in modules added | 2026/4/9 |
| 2.11.0 | Large internal changes | 2026/4/14 |
| 2.12.11 | Blacklist added to player teleport | 2026/7/17 |
| 2.12.12 | Cooldowns for suicide / death point, sign-in fixes | 2026/7/31 |
| 2.12.14 | RTP core rewritten, money change ledger added | 2026/9/16 |
| 2.13.0 | Signed auto-update manifests | 2026/10/26 |
| 2.13.2 | Web config console and customisation | 2026/10/28 |
| 3.0.0 | New build downloaded from GitHub | not listed |

⚠️ *This is only a partial list — the resource page and GitHub releases are authoritative.*

---

## 🛠 Requirements

- **LegacyScriptEngine** (LSE)

---

## 💡 Where it fits

Built for Minecraft Bedrock servers, especially when you:

- Want to move off TMEssential to a maintained essentials plugin
- Need a menu plugin that is still maintained

---

## 🧩 Relation with LeviLamina

YEssential has supported **LeviLamina** since 1.0.0. Together with LSE it runs in a stronger server modding environment.

*LeviLamina is a lightweight, modular mod loader for Minecraft Bedrock Edition, providing base APIs and an event system for plugins and mods.*

---

## 📦 Configuration

- ./Config/config.json
Main config file
```json
{
    "PVP": {
        "EnabledModule": true,  // PVP module, on by default
        "DangerousBlocks": [  // block placements to block
            "minecraft:tnt",
            "minecraft:respawn_anchor",
            "minecraft:bed",
            "minecraft:undyed_shulker_box"
        ]
    },
    "RedPacket": {
        "EnabledModule": false,   // red packet module, off by default
        "expireTime": 300,
        "maxAmount": 10000,
        "maxCount": 50,
        "minAmount": 1
    },
    "CrossServerTransfer": {  // cross-server teleport
        "EnabledModule": false,  // enable the feature
        "servers": [  // server list
                    { "server_name": "Survival", "server_ip": "127.0.0.1", "server_port": 19132 }
        ],
        "servers1": [
                    {"server_name":"Shimokitazawa","server_ip":"1.14.5.14","server_port": 11451 }
        ]
     },
    "RTP": {  // random teleport
        "EnabledModule": false,   // module switch, off by default
        "minRadius": 100,    // minimum radius
        "maxRadius": 5000,  // maximum radius
        "cooldown": 300,   // cooldown in seconds
        "cost": 50,    // cost per teleport
        "allowDimensions": [
            0,
            1,
            2
        ],  // allowed dimensions
        "safeCheck": true,   // safety check before teleporting
        "maxAttempts": 50,  // max attempts
        "Animation": 0,   // animation (0 = off, 1 = GTA5 style)
        "enableParticle": true,  // success particles
        "enableSound": true,  // success sound
        "logToFile": true   // write a log
    },
    "Bstats": {  // bStats
          "EnableModule": true, // master switch
          "logSentData": false   // log the payload to console
    },
    "Hub": { // hub coordinates
          "EnabledModule": false,  // hub switch, off by default
          "x": 58776.7,
          "y": 68.6,
          "z": 59617.9,
          "dimid": 0,
          "isSet": false  // whether a point has been set
    },
    "tpa": {  // teleport system
          "EnabledModule": false,  // TPA switch, off by default
          "isDelayEnabled": true, // delayed teleport
          "maxDelay": 20,   // max delay
          "cost" : 1,    // cost per teleport
          "requestTimeout": 60,   // request expiry
          "promptType": "form"  // request prompt type
    },
    "Home": {
          "add": 0,  // cost to add a home
          "del": 0,  // cost to delete a home
          "tp": 0,  // cost to teleport to a home
          "MaxHome": 10   // max homes
    },
    "Fcam": {  // out-of-body mode
          "EnableModule": false,  // true or 1 to enable, 0 or false to disable
          "CostMoney": 0,  // cost per use
          "TimeOut": 0  // usage time limit
    },
    "wh": {  // maintenance mode
           "EnableModule": true,    // true or 1 to enable, 0 or false to disable
           "status": 0,  // 1 = under maintenance, 0 = normal
           "whmotdmsg": "Server is under maintenance, please do not join!",   // MOTD while down, colour codes supported
           "whgamemsg": "Server is under maintenance, please try again later!"   // message shown to blocked players

    },
    "Motd": {
             "EnabledModule": true,  // enable custom MOTD, on by default
             "message" : ["Bedrock_Server", "Geyser"],   // dynamic MOTD entries
    },
    "Notice":{
                "EnableModule": false,    // notice module switch
                "Join_ShowNotice": false,   // pop up on join
                "IsUpdate":false,   // set true to push the notice to everyone next time
    },
    "SimpleLogOutPut": false,   // concise logging, off by default
    "Crash": {

                "EnabledModule": true ,  // crash module switch
                "LogCrashInfo": true  // log actions
    },
    "Economy": {  // economy
                "mode": "scoreboard",  // llmoney or scoreboard
                "PayTaxRate": [   // tiered tax
                  {
                      "min": 0,
                      "max": 1000,
                      "rate": 0   // rate in percent
                  },
                  {
                      "min": 1000,
                      "max": 10000,
                      "rate": 2
                  },
                  {
                      "min": 10000,
                      "max": 100000,
                      "rate": 5
                  },
                  {
                      "min": 100000,
                      "max": -1,
                      "rate": 10
                  }
                ],
                "RankingModel" : "New",   // money leaderboard style (New or Old)
                "Scoreboard": "money",  // scoreboard objective name, no CJK characters
                "CoinName": "Coins"   // display name of the currency
    },
    "Suicide": {  // suicide
                "EnabledModule": true,
                "cost": 0,
                "cooldown": 0   // seconds, 0 = no limit
    },
    "Back": {  // return to death point
                "EnabledModule": true,
                "cost": 0,
                "cooldown": 0,   // seconds, 0 = no limit; only counted after a successful teleport
                "tipAfterDeath": false   // open the return GUI on respawn
    },
    "WebConsole": {  // web config console
                "EnableModule": true,
                "Port": 8787,  // listen port
                "BindAddress": "127.0.0.1",  // bind address, local only by default
                "Token": "",  // access token (generated automatically when binding a non-loopback address)
                "AllowWrite": true  // allow writes from the web UI
    },
    "Warp": 0 ,   // cost to use a public warp
    "Version": 296   // config version marker, do not touch
}
```
> Too lazy to edit JSON? Start the plugin and open the built-in web config console (http://127.0.0.1:8787/ by default, see the startup log for the port).

---
- ./Config/Updateconfig.json
 ```json
"Update": {  // auto-update
        "EnableModule": true,  // enable auto-update
        "CheckInterval": 120,  // check interval in minutes (0 = off, minimum 120)
        "versionUrl": "https://plugin.tobecraft.xyz/file/manifest.json",  // manifest URL
        "baseUrl": "https://plugin.tobecraft.xyz/file/",  // file download base URL
        "files": [ // files covered by the update
            {
                "url": "YEssential.js",
                "path": "YEssential.js"
            },
            {
                "url": "modules/I18n.js",
                "path": "./modules/I18n.js"
            },
            {
                "url": "modules/Cleanmgr.js",
                "path": "./modules/Cleanmgr.js"
            },
            {
                "url": "modules/ConfigManager.js",
                "path": "./modules/ConfigManager.js"
            },
            {
                "url": "modules/AsyncUpdateChecker.js",
                "path": "./modules/AsyncUpdateChecker.js"
            },
            {
                "url": "modules/RadomTeleportSystem.js",
                "path": "./modules/RadomTeleportSystem.js"
            },
            {
                "url": "modules/Bstats.js",
                "path": "./modules/Bstats.js"
            },
            {
                "url": "modules/Cd.js",
                "path": "./modules/Cd.js"
            },
            {
                "url": "modules/PVP.js",
                "path": "./modules/PVP.js"
            },
            {
                "url": "modules/Redpacket.js",
                "path": "./modules/Redpacket.js"
            },
            {
                "url": "modules/Fcam.js",
                "path": "./modules/Fcam.js"
            },
            {
                "url": "modules/Notice.js",
                "path": "./modules/Notice.js"
            },
            {
                "url": "modules/Sign.js",
                "path": "./modules/Sign.js"
            },
            {
                "url": "modules/Crash.js",
                "path": "./modules/Crash.js"
            },
            {
                "url": "modules/Warp.js",
                "path": "./modules/Warp.js"
            },
            {
                "url": "modules/PluginInfo.js",
                "path": "./modules/PluginInfo.js"
            },
            {
                "url": "modules/Home.js",
                "path": "./modules/Home.js"
            },
            {
                "url": "modules/CachePool.js",
                "path": "./modules/CachePool.js"
            },
            {
                "url": "modules/WriteBackStore.js",
                "path": "./modules/WriteBackStore.js"
            },
            {
                "url": "modules/WebConsole.js",
                "path": "./modules/WebConsole.js"
            },
            {
                "url": "web/index.html",
                "path": "./web/index.html"
            },
            {
                "url": "web/assets/app.js",
                "path": "./web/assets/app.js"
            },
            {
                "url": "web/assets/index.js",
                "path": "./web/assets/index.js"
            },
            {
                "url": "web/assets/index.css",
                "path": "./web/assets/index.css"
            }
        ],
        "reloadDelay": 1000,  // delay before reload
        "timeout": 30000,  // update check timeout
        "checkMissingFilesOnStart": true  // check for missing files on startup
    },
```
- ./Config/cleanmgr/config.json
Cleaner config
```json
{
  "cleanmgr": {
    "enable": true,  // enable the cleaner module
    "interval": 600,  // interval in seconds
    "debug": false,
    "whitelist": [  // cleanup whitelist (regex)
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
      "^minecraft:painting$",
      "^minecraft:copper_golem$"
    ],
    "notice": {  // countdown warnings
      "notice1": 30,
      "notice2": 10
    },
    "LowTpsClean": {  // clean automatically on low TPS
      "enable": true,   // enable the feature
      "minimum": 15,   // TPS threshold
      "maxConsecutiveCleans": 2, // max consecutive no-op cleans
      "longCooldown": 450        // long cooldown in seconds (default 7.5 min)
    },
    "clean_Cmd": "clean",  // custom clean command
    "playerCooldown": 300  // per-player cooldown in seconds
  }
}
```
- ./modules/modulelist.json
Module list
```json
{
    "modules": [
        {
            "path": "Cleanmgr.js",
            "name": "CleanMgr"
        },
        {
            "path": "ConfigManager.js",
            "name": "ConfigManager"
        },
        {
            "path": "AsyncUpdateChecker.js",
            "name": "AsyncUpdateChecker"
        },
        {
            "path": "RadomTeleportSystem.js",
            "name": "RadomTeleportSystem"
        },
        {
            "path": "Cd.js",
            "name": "Cd"
        },
        {
            "path": "XXX.js",
            "name": "XXX"  // add modules you want to load here
        }
    ]
}
```

- ./Config/Cd/Config.json
Menu config

```json
{

    "money": 0,  // economy: 0 = scoreboard, 1 = LLMoney
    "itemsTriggerMode": 0,  // trigger mode (reserved; both right-click block and air work)
    "score": "money",  // scoreboard objective name
    "items": [  // items that open the menu
        "minecraft:clock"
    ],
    "main": "main",  // main menu file name
    "shield": [],  // blocked blocks
    "UseDogeUI": 0  // enable DogeUI compatibility
}

```

> 💡 Menu button commands: for `comm` buttons, if the command contains `@s` and the player is not OP, it runs from the console with `@s` replaced by the player name. Regular players can therefore trigger vanilla commands like `tag`, `effect`, `scoreboard` from the menu without being given OP. Commands without `@s` still run as the player, so plugin commands like `home` and `warp` work as usual.

---

## 📥 API usage
To be written

---

## 📦 Example commands

A few common commands (subject to change between versions):

```txt
/cd menu
/menu {set} menu{config}
/home	 # home menu (set / teleport)
/tpa	 # player teleport with preference GUI (send request)
/tpayes	 # accept a teleport request
/tpano	 # deny a teleport request
/rtp	 # random teleport (safe, per dimension)
/PVP	 # toggle personal PVP
/warp	 # public warp menu
/servers	 # cross-server teleport menu
/back	 # return to death point
/deathlog	 # browse past deaths
/moneygui	 # open the economy GUI
/moneys add & del & set get player [amount]	 # economy ops: add / remove / set a player's balance
/notice	 # view notices
/noticeset	 # edit notices
/wh	 # toggle maintenance mode
/clean {air} status & cancel & tps & toast & help	 # clear drops / status / cancel / check TPS / hide toast / help
/suicide	 # suicide
/fcam	 # toggle out-of-body mode
/rtpreset	 # reset cooldown (admin only)
/hub	 # teleport to the hub point (everyone)
/sethub	 # set the /hub destination
/crash	 # open the client-crash menu
/redpacket history && list && open && send	 # red packet (long form)
/rp history && list && open && send	 # red packet (short form)
/redpackethelp	 # red packet help (GUI)
```

---

## Migrating data from other plugins

- Migrating TMEssential:
Move `homelist.json` and `warplist.json` from `<server>\plugins\Timiya\data`
to `<server>\plugins\YEssential\data`, rename them to `homedata.json` and `warpdata.json`, then save.

- Migrating PMenu:
Move everything from `<server>\plugins\Planet\PMENU\packs`
to `<server>\plugins\YEssential\data\menus`.

---

## Contributing

This project would not exist without the help of PHEyeji and others!<br>
Want to help? Open an issue and let's make YEssential better together.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nico6719/YEssential&type=Date)](https://star-history.com/#Nico6719/YEssential&Date)
