"use strict";

/**
 * YEssential - CleanMgr Module (LSE-safe Ultimate)
 * 修改版 v4：
 * 1. 修复命令补全：使用 LSE 标准的双重 Overload 写法，完美支持客户端枚举提示。
 * 2. 玩家数据保存路径分离至 /data/CleanmgrSettingData.json
 * 3. 修复 merge() 对数组的错误处理（数组整体替换，不按下标递归合并）。
 * 4. 修复 loadConfig() 每次启动都强制回写配置文件的问题。
 */

var CleanMgr = (function () {

  /* ================= 路径 ================= */
  var BASE = "./plugins/YEssential/";
  
  // 配置文件路径
  var CONFIG_DIR = BASE + "config/cleanmgr/";
  var CONFIG_PATH = CONFIG_DIR + "config.json";
  
  // 语言文件路径
  var LANG_DIR   = BASE + "lang/cleanmgr/";
  var LANG_PATH   = LANG_DIR + "lang.json";

  // 玩家数据路径: plugins/YEssential/data/CleanmgrSettingData.json
  var DATA_DIR = BASE + "data/";
  var PLAYER_SETTINGS_PATH = DATA_DIR + "CleanmgrSettingData.json"; 

  /* ================= 默认语言 ================= */
  var DEFAULT_LANG = {
    prefix: "§l§6[-YEST-] §l§e[清理系统] §r",
    toast_title: "§l§6[-YEST-] §l§e[清理系统] §r",
    messages: {
      system_starting: "§a清理系统正在启动...",
      config_loaded: "§a配置文件加载完成",
      system_started: "§a清理系统已启动",
      command_help_tip: "§e使用 /clean help 查看命令帮助",
      whitelist_loaded: "§a白名单加载完成，共 {0} 条规则",
      cleanup_start: "§a开始清理实体...",
      cleanup_in_progress: "§c清理任务进行中！",
      cleanup_notice: "§e请注意 ！ {0} 秒后清理实体，请捡起贵重物品！",
      cleanup_notice2: "§6请注意 ！ {0} 秒后清理实体，请捡起贵重物品！",
      cleanup_notice3: "§c请注意 ！ {0} 秒后清理实体，请捡起贵重物品！",
      cleanup_complete: "§a已清理 {0} 个实体",
      cleanup_stats: "§a清理统计 - 总计: {0}, 保留: {1}, 清理: {2}",
      low_tps_clean: "§cTPS 过低({0})，已自动清理",
      low_tps_clean_cooldown: "§6TPS 过低但清理冷却中，将在 {0} 分钟后重试",
      low_tps_ineffective: "§c连续清理后TPS仍未改善，系统将暂停低TPS自动清理 {0} 分钟",
      scheduled_clean: "§d计划清理已启动，{0} 秒后执行",
      manual_trigger: "§6玩家触发了手动清理",
      cancel_success: "§c已取消计划清理",
      status_idle: "§a当前没有清理任务在进行",
      status_scheduled: "§a计划清理将在 {0} 秒后执行",
      status_cleaning: "§c正在清理实体...",
      no_scheduled_clean: "§c当前没有计划清理可取消",
      tps_info: "§a当前TPS: §e{0}§a / 20.00",
      help_message: "§e用法:\n§a/clean §7- 触发清理\n§a/clean status §7- 查询状态\n§a/clean cancel §7- 取消清理\n§a/clean tps §7- 查询TPS\n§a/clean toast §7- 开关顶部弹窗",
      chat_mode_tip: "§e您可以使用聊天命令: /clean [now|status|cancel|tps|help|toast]",
      cooldown_warning: "§c触发清理冷却中，请稍后再试",
      toast_enabled: "§a您已开启清理系统的顶部弹窗通知",
      toast_disabled: "§c您已关闭清理系统的顶部弹窗通知"
    }
  };

  /* ================= 默认配置 ================= */
  var DEFAULT_CONFIG = {
    enable: true,
    interval: 600,
    debug: false,
    whitelist: [
      "^minecraft:netherite_", "^minecraft:ancient_debris$", "^minecraft:dragon_egg$",
      "^minecraft:nether_star$", "^minecraft:elytra$", "^minecraft:emerald$",
      "^minecraft:beacon$", "^minecraft:ender_eye$", "^minecraft:shulker_box$",
      "^minecraft:sea_lantern$", "^minecraft:enchanted_book$", "^minecraft:diamond",
      "^minecraft:totem_of_undying$", "^minecraft:ender_pearl$", "^minecraft:villager_v2$",
      "^minecraft:ender_crystal$", "^minecraft:ender_dragon$", "^minecraft:parrot$",
      "^minecraft:chest_minecart$", "^minecraft:minecart$", "^minecraft:hopper_minecart$",
      "^minecraft:armor_stand$", "^minecraft:boat$", "^minecraft:sheep$","^minecraft:leash_knot$",
      "^minecraft:cow$", "^minecraft:pig$", "^minecraft:painting$"
    ],
    notice: { notice1: 30, notice2: 15, notice3: 5 },
    LowTpsClean: { 
      enable: true, 
      minimum: 15,
      maxConsecutiveCleans: 2, 
      longCooldown: 450        
    },
    clean_Cmd: "clean",
    playerCooldown: 300
  };


  /* ================= 状态 ================= */
  var state = {
    phase: "idle",
    scheduledTimeouts: [],
    lastPlayerClean: {}, 
    lowTpsCleanCount: 0,      
    lowTpsRetryTime: 0,       
    tpsBeforeClean: 20,       
    isLowTpsTrigger: false    
  };

  var config = null;
  var lang = null;
  var playerSettings = {}; 
  var whitelistRegex = [];
  var timers = [];
  var getTps = function () { return 20; };

  /* ================= 工具 ================= */
  function ensureDir(p) { if (!File.exists(p)) File.mkdir(p); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  /**
   * 将 b 的字段合并到 a 的克隆中，b 优先。
   * 修复：数组类型整体替换，不按下标递归合并，避免服主配置被默认值污染。
   */
  function merge(a, b) {
    var o = clone(a);
    for (var k in b) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) continue;
      if (Array.isArray(b[k])) {
        // 数组整体用 b 的值替换，保留服主自定义内容
        o[k] = clone(b[k]);
      } else if (
        b[k] !== null && typeof b[k] === "object" &&
        o[k] !== null && typeof o[k] === "object" &&
        !Array.isArray(o[k])
      ) {
        // 两边都是普通对象时才递归合并
        o[k] = merge(o[k], b[k]);
      } else {
        o[k] = b[k];
      }
    }
    return o;
  }
  
  function debug(msg) {
    if (config && config.debug) logger.info("[CleanMgr-DEBUG] " + msg);
  }
  
  function t(path, arg0, arg1, arg2) {
    var parts = path.split(".");
    var obj = lang || DEFAULT_LANG;
    for (var i = 0; i < parts.length; i++) {
      if (!obj) break;
      obj = obj[parts[i]];
    }
    if (typeof obj !== "string") return path;
    var result = obj;
    if (arg0 !== undefined) result = result.replace(/\{0\}/g, String(arg0));
    if (arg1 !== undefined) result = result.replace(/\{1\}/g, String(arg1));
    if (arg2 !== undefined) result = result.replace(/\{2\}/g, String(arg2));
    return result;
  }

  /* ================= 加载 ================= */
  function loadLang() {
    ensureDir(LANG_DIR);
    if (!File.exists(LANG_PATH)) {
      File.writeTo(LANG_PATH, JSON.stringify(DEFAULT_LANG, null, 2));
    }
    try { 
      var loaded = JSON.parse(File.readFrom(LANG_PATH));
      // lang 文件：用默认值补全缺失字段，但优先保留自定义内容
      return merge(DEFAULT_LANG, loaded);
    } catch (e) { return clone(DEFAULT_LANG); }
  }

  /**
   * 加载配置。
   * 修复：
   * 1. 仅在配置文件不存在时写入默认配置，之后不再回写，避免覆盖服主修改。
   * 2. merge 仅在内存中补全缺失字段，磁盘文件保持服主原样。
   */
  function loadConfig() {
    ensureDir(CONFIG_DIR);
    if (!File.exists(CONFIG_PATH)) {
      // 首次运行：生成默认配置文件
      var initial = { cleanmgr: clone(DEFAULT_CONFIG) };
      File.writeTo(CONFIG_PATH, JSON.stringify(initial, null, 2));
      return clone(DEFAULT_CONFIG);
    }
    var raw = {};
    try { raw = JSON.parse(File.readFrom(CONFIG_PATH)); } catch (e) {
      logger.warn("[CleanMgr] 配置文件解析失败，使用默认配置");
    }
    // 仅在内存中用默认值补全缺失字段，不回写磁盘
    return merge(DEFAULT_CONFIG, raw.cleanmgr || {});
  }

  function loadPlayerSettings() {
    ensureDir(DATA_DIR); 
    if (File.exists(PLAYER_SETTINGS_PATH)) {
      try {
        playerSettings = JSON.parse(File.readFrom(PLAYER_SETTINGS_PATH));
      } catch (e) {
        playerSettings = {};
        logger.warn("[CleanMgr] 玩家数据文件损坏，已重置");
      }
    } else {
      playerSettings = {};
    }
  }

  function savePlayerSettings() {
    ensureDir(DATA_DIR);
    File.writeTo(PLAYER_SETTINGS_PATH, JSON.stringify(playerSettings, null, 2));
  }

  /* ================= TPS 采样 ================= */
  function initTpsSampler() {
    var tick = 0, start = Date.now(), last = 20;
    mc.listen("onTick", function () {
      tick++;
      if (tick >= 20) {
        var sec = (Date.now() - start) / 1000;
        if (sec > 0) last = Math.min(20 / sec, 20);
        tick = 0; start = Date.now();
      }
    });
    getTps = function () { return last; };
  }

  /* ================= 白名单 ================= */
  function compileWhitelist() {
    whitelistRegex = [];
    for (var i = 0; i < config.whitelist.length; i++) {
      try { whitelistRegex.push(new RegExp(config.whitelist[i])); } catch (e) {}
    }
  }

  function shouldKeep(e) {
    if (!e) return true;
    try { if (e.type === "minecraft:player") return true; } catch (ex) {}
    
    try {
      var type = e.type;
      for (var i = 0; i < whitelistRegex.length; i++) {
        if (whitelistRegex[i].test(type)) return true;
      }
    } catch (ex) {}

    try {
      if (typeof e.isItemEntity === "function" && e.isItemEntity()) {
        var it = e.toItem();
        if (it && it.type) {
          for (var i = 0; i < whitelistRegex.length; i++) {
            if (whitelistRegex[i].test(it.type)) return true;
          }
        }
      }
    } catch (ex) {}

    try {
      var nbt = e.getNbt();
      if (nbt) { 
        var obj = nbt.toObject(); 
        if (obj && (obj.CustomName || obj.IsTamed)) return true;
      }
    } catch (ex) {}
    return false;
  }

  function sendToastToAll(title, message) {
    var players = mc.getOnlinePlayers();
    for (var i = 0; i < players.length; i++) {
      try { 
        var p = players[i];
        if (playerSettings[p.xuid] !== false) {
          p.sendToast(title, message); 
        }
      } catch (e) {}
    }
  }

  /* ================= 执行清理 ================= */
  function executeClean() {
    state.phase = "cleaning";
    var removed = 0, kept = 0, total = 0;
    
    mc.broadcast(lang.prefix + t("messages.cleanup_start"));
    var all = mc.getAllEntities();
    total = all.length;
    
    for (var i = 0; i < all.length; i++) {
      var entity = all[i];
      if (shouldKeep(entity)) {
        kept++;
      } else {
        try { entity.despawn(); removed++; } catch (e) {}
      }
    }
    
    mc.broadcast(lang.prefix + t("messages.cleanup_complete", removed));
    sendToastToAll(t("toast_title"), t("messages.cleanup_complete", removed));

    if (state.isLowTpsTrigger) {
      setTimeout(function() {
        var currentTps = getTps();
        var improved = currentTps > (state.tpsBeforeClean + 2.0);
        
        debug("TPS清理评估: 前=" + state.tpsBeforeClean.toFixed(2) + " 后=" + currentTps.toFixed(2));

        if (improved) {
          state.lowTpsCleanCount = 0; 
          debug("TPS已改善，重置连续清理计数");
        } else {
          state.lowTpsCleanCount++;
          debug("TPS未明显改善，连续无效计数: " + state.lowTpsCleanCount);
          
          if (state.lowTpsCleanCount >= config.LowTpsClean.maxConsecutiveCleans) {
            var coolMin = Math.round(config.LowTpsClean.longCooldown / 60);
            mc.broadcast(lang.prefix + t("messages.low_tps_ineffective", coolMin));
            
            state.lowTpsRetryTime = Date.now() + (config.LowTpsClean.longCooldown * 1000);
            state.lowTpsCleanCount = 0; 
            logger.warn("[清理系统] 低TPS清理连续无效，进入长冷却模式：" + coolMin + "分钟");
          }
        }
        state.isLowTpsTrigger = false;
      }, 5000);
    }

    state.phase = "idle";
    state.scheduledTimeouts = [];
  }

  function scheduleClean(isManual, playerName, isLowTps) {
    if (state.phase !== "idle") return;
    
    if (isManual && playerName) {
      var now = Date.now();
      var last = state.lastPlayerClean[playerName] || 0;
      if ((now - last) / 1000 < config.playerCooldown) {
        var p = mc.getPlayer(playerName);
        if(p) p.tell(lang.prefix + t("messages.cooldown_warning"));
        return;
      }
      state.lastPlayerClean[playerName] = now;
      mc.broadcast(lang.prefix + t("messages.manual_trigger"));
    }

    state.phase = "scheduled";
    state.isLowTpsTrigger = !!isLowTps;

    var n1 = config.notice.notice1;
    var n2 = config.notice.notice2;
    var n3 = config.notice.notice3;

    mc.broadcast(lang.prefix + t("messages.cleanup_notice", n1));
    sendToastToAll(t("toast_title"), t("messages.cleanup_notice", n1));

    if (n2 > 0 && n2 < n1) {
      state.scheduledTimeouts.push(setTimeout(function () {
        mc.broadcast(lang.prefix + t("messages.cleanup_notice2", n2));
        sendToastToAll(t("toast_title"), t("messages.cleanup_notice2", n2));
      }, (n1 - n2) * 1000));
    }
    if (n3 > 0 && n3 < n2) {
      state.scheduledTimeouts.push(setTimeout(function () {
        mc.broadcast(lang.prefix + t("messages.cleanup_notice3", n3));
        sendToastToAll(t("toast_title"), t("messages.cleanup_notice3", n3));
      }, (n1 - n3) * 1000));  // 修复：延迟基准为n1，而非n2
    }
    state.scheduledTimeouts.push(setTimeout(executeClean, n1 * 1000));
  }

  /* ================= 命令处理 ================= */
  function handleCleanCommand(player, action) {
    var playerName = player.realName || player.name;
    var xuid = player.xuid; 

    if (!action || action === "help") {
      player.tell(lang.prefix + t("messages.help_message"));
      return true;
    }
    if (action === "tps") {
      var cur = getTps();
      player.tell(lang.prefix + t("messages.tps_info", cur.toFixed(2)));
      return true;
    }
    if (action === "status") {
      player.tell(lang.prefix + "状态: " + state.phase + (state.lowTpsRetryTime > Date.now() ? " (TPS清理长冷却中)" : ""));
      return true;
    }
    if (action === "cancel") {
      if (state.phase === "scheduled") {
        state.scheduledTimeouts.forEach(clearTimeout);
        state.scheduledTimeouts = [];
        state.phase = "idle";
        mc.broadcast(lang.prefix + t("messages.cancel_success"));
      } else {
        player.tell(lang.prefix + t("messages.no_scheduled_clean"));
      }
      return true;
    }
    if (action === "now") {
      scheduleClean(true, playerName, false);
      return true;
    }
    if (action === "toast") {
      var current = playerSettings[xuid];
      if (current === undefined) current = true; 
      
      playerSettings[xuid] = !current;
      savePlayerSettings();
      
      if (playerSettings[xuid]) {
        player.tell(lang.prefix + t("messages.toast_enabled"));
        player.sendToast(t("toast_title"), "测试弹窗：开启成功");
      } else {
        player.tell(lang.prefix + t("messages.toast_disabled"));
      }
      return true;
    }
    return false;
  }

/* ================= 注册命令 (LSE 补全增强版) ================= */
  function registerCommand() {
    setTimeout(function() {
    
    var cmd = mc.newCommand(config.clean_Cmd, "实体清理系统", PermType.Any);

    cmd.setEnum("CleanActions", ["now", "status", "cancel", "tps", "help", "toast"]);
    cmd.mandatory("action", ParamType.Enum, "CleanActions", 1);
    cmd.overload([]);
    cmd.overload(["action"]);

    cmd.setCallback(function(_cmd, _ori, _out, _res) {
        var p = _ori.player;
        var act = _res.action;
        if (!act) act = "now";

        // 后台（控制台）执行：无player对象，用logger输出反馈
        if (!p) {
            var cur = getTps();
            if (act === "tps") {
                logger.info(t("messages.tps_info", cur.toFixed(2)));
            } else if (act === "status") {
                logger.info("状态: " + state.phase + (state.lowTpsRetryTime > Date.now() ? " (TPS清理长冷却中)" : ""));
            } else if (act === "cancel") {
                if (state.phase === "scheduled") {
                    state.scheduledTimeouts.forEach(clearTimeout);
                    state.scheduledTimeouts = [];
                    state.phase = "idle";
                    mc.broadcast(lang.prefix + t("messages.cancel_success"));
                    logger.info(t("messages.cancel_success"));
                } else {
                    logger.info(t("messages.no_scheduled_clean"));
                }
            } else if (act === "now") {
                scheduleClean(false, null, false);
                logger.info(t("messages.scheduled_clean", config.notice.notice1));
            } else if (!act || act === "help") {
                logger.info(t("messages.help_message"));
            }
            return true;
        }

        return handleCleanCommand(p, act);
    });

    cmd.setup();
    }, 2000);
  }

  /* ================= 定时任务 ================= */
  function startTimers() {
    timers.push(setInterval(function () {
      if (config.enable && state.phase === "idle") scheduleClean(false, null, false);
    }, config.interval * 1000));

    timers.push(setInterval(function () {
      if (!config.LowTpsClean.enable) return;
      var now = Date.now();
      if (now < state.lowTpsRetryTime) return; 

      var currentTps = getTps();
      if (currentTps <= config.LowTpsClean.minimum) {
        if (state.phase === "idle") {
          state.tpsBeforeClean = currentTps; 
          mc.broadcast(lang.prefix + t("messages.low_tps_clean", currentTps.toFixed(2)));
          scheduleClean(false, null, true); 
        }
      }
    }, 5000));
  }

  /* ================= 初始化 ================= */
  function init() {
    config = loadConfig();
    lang = loadLang();
    loadPlayerSettings(); 
    compileWhitelist();
    initTpsSampler();
    registerCommand();
    startTimers();
  }

  return { init: init };

})();

module.exports = CleanMgr;
