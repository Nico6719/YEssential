"use strict";

/**
 * YEssential - CleanMgr Module (LSE-safe Ultimate)
 * Compatible with Legacy Script Engine / QuickJS
 */

var CleanMgr = (function () {

  /* ================= 路径 ================= */
  var BASE = "./plugins/YEssential/";
  var CONFIG_DIR = BASE + "config/cleanmgr/";
  var LANG_DIR   = BASE + "lang/cleanmgr/";
  var CONFIG_PATH = CONFIG_DIR + "config.json";
  var LANG_PATH   = LANG_DIR + "lang.json";

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
      cleanup_complete: "§a已清理 {0} 个实体",
      cleanup_stats: "§a清理统计 - 总计: {0}, 保留: {1}, 清理: {2}",
      low_tps_clean: "§cTPS 过低({0})，已自动清理",
      scheduled_clean: "§d计划清理已启动，{0} 秒后执行",
      manual_trigger: "§6玩家触发了手动清理",
      cancel_success: "§c已取消计划清理",
      status_idle: "§a当前没有清理任务在进行",
      status_scheduled: "§a计划清理将在 {0} 秒后执行",
      status_cleaning: "§c正在清理实体...",
      no_scheduled_clean: "§c当前没有计划清理可取消",
      tps_info: "§a当前TPS: §e{0}§a / 20.00",
      tps_excellent: "§a当前TPS: §2{0}§a / 20.00 §7(优秀)",
      tps_good: "§a当前TPS: §e{0}§a / 20.00 §7(良好)",
      tps_poor: "§a当前TPS: §6{0}§a / 20.00 §7(较差)",
      tps_critical: "§a当前TPS: §c{0}§a / 20.00 §7(危险)",
      help_message: "§e用法:\n§a/clean §7- 触发清理\n§a/clean status §7- 查询状态\n§a/clean cancel §7- 取消清理\n§a/clean tps §7- 查询TPS",
      chat_mode_tip: "§e您可以使用聊天命令: /clean [now|status|cancel|tps|help]",
      cooldown_warning: "§c触发清理冷却中，请稍后再试"
    }
  };

  /* ================= 默认配置 ================= */
  var DEFAULT_CONFIG = {
    enable: true,
    interval: 600,
    debug: false, // 调试模式开关
    whitelist: [
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
    notice: { notice1: 30, notice2: 10 },
    LowTpsClean: { enable: true, minimum: 15 },
    clean_Cmd: "clean",
    playerCooldown: 300 // 玩家触发清理冷却时间（秒）
  };

  /* ================= 状态 ================= */
  var state = {
    phase: "idle",
    scheduledTimeouts: [],
    lastPlayerClean: {} // 玩家冷却记录
  };

  var config = null;
  var lang = null;
  var whitelistRegex = [];
  var timers = [];
  var getTps = function () { return 20; };

  /* ================= 工具 ================= */
  function ensureDir(p) { if (!File.exists(p)) File.mkdir(p); }
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function merge(a, b) {
    var o = clone(a);
    for (var k in b) {
      if (typeof o[k] === "object" && typeof b[k] === "object") o[k] = merge(o[k], b[k]);
      else o[k] = b[k];
    }
    return o;
  }
  
  // 调试日志函数
  function debug(msg) {
    if (config && config.debug) {
      logger.info("[DEBUG] " + msg);
    }
  }
  
  // 翻译函数 - 支持多个参数
  function t(path, arg0, arg1, arg2) {
    if (!lang) {
      debug("警告: lang 未初始化");
      // 尝试从 DEFAULT_LANG 获取
      var parts = path.split(".");
      var obj = DEFAULT_LANG;
      for (var i = 0; i < parts.length; i++) {
        if (!obj) return path;
        obj = obj[parts[i]];
      }
      if (typeof obj !== "string") return path;
      var result = obj;
      if (arg0 !== undefined) result = result.replace(/\{0\}/g, String(arg0));
      if (arg1 !== undefined) result = result.replace(/\{1\}/g, String(arg1));
      if (arg2 !== undefined) result = result.replace(/\{2\}/g, String(arg2));
      return result;
    }
    
    var parts = path.split(".");
    var obj = lang;
    for (var i = 0; i < parts.length; i++) {
      if (!obj || typeof obj !== "object") {
        debug("翻译失败: 路径 " + path + " 在索引 " + i + " 处为空或非对象");
        // 回退到 DEFAULT_LANG
        obj = DEFAULT_LANG;
        for (var j = 0; j < parts.length; j++) {
          if (!obj) return path;
          obj = obj[parts[j]];
        }
        break;
      }
      obj = obj[parts[i]];
    }
    
    if (typeof obj !== "string") {
      debug("翻译失败: 路径 " + path + " 的值不是字符串，类型: " + typeof obj + "，值: " + JSON.stringify(obj));
      return path;
    }
    
    var result = String(obj);
    if (arg0 !== undefined) result = result.replace(/\{0\}/g, String(arg0));
    if (arg1 !== undefined) result = result.replace(/\{1\}/g, String(arg1));
    if (arg2 !== undefined) result = result.replace(/\{2\}/g, String(arg2));
    return result;
  }

  /* ================= 语言 & 配置 ================= */
  function loadLang() {
    ensureDir(LANG_DIR);
    
    // 确保语言文件存在
    if (!File.exists(LANG_PATH)) {
      logger.info("语言文件不存在，创建默认语言文件");
      try {
        File.writeTo(LANG_PATH, JSON.stringify(DEFAULT_LANG, null, 2));
        logger.info("默认语言文件创建成功: " + LANG_PATH);
      } catch (e) {
        logger.error("创建语言文件失败: " + e);
        return clone(DEFAULT_LANG);
      }
    }
    
    // 尝试加载语言文件
    try { 
      var content = File.readFrom(LANG_PATH);
      logger.info("读取语言文件，长度: " + content.length);
      
      var loaded = JSON.parse(content);
      logger.info("JSON解析成功");
      
      // 深度合并
      var merged = merge(DEFAULT_LANG, loaded);
      
      // 验证关键字段
      if (!merged.prefix) {
        logger.warn("语言文件缺少 prefix 字段，使用默认值");
        merged.prefix = DEFAULT_LANG.prefix;
      }
      if (!merged.messages || typeof merged.messages !== "object") {
        logger.warn("语言文件缺少 messages 对象，使用默认值");
        merged.messages = DEFAULT_LANG.messages;
      }
      
      // 验证几个关键消息
      var testKeys = ["cleanup_start", "system_starting", "config_loaded"];
      for (var i = 0; i < testKeys.length; i++) {
        if (!merged.messages[testKeys[i]]) {
          logger.warn("语言文件缺少消息: " + testKeys[i]);
          merged.messages[testKeys[i]] = DEFAULT_LANG.messages[testKeys[i]];
        }
      }
      
      logger.info("语言文件加载并验证成功");
      return merged;
    } catch (e) { 
      logger.error("加载语言文件失败: " + e);
      logger.error("使用内置默认语言");
      return clone(DEFAULT_LANG); 
    }
  }
  function loadConfig() {
    ensureDir(CONFIG_DIR);
    if (!File.exists(CONFIG_PATH)) new JsonConfigFile(CONFIG_PATH).init("cleanmgr", DEFAULT_CONFIG);
    var raw = {};
    try { raw = JSON.parse(File.readFrom(CONFIG_PATH)); } catch (e) {}
    raw.cleanmgr = merge(DEFAULT_CONFIG, raw.cleanmgr || {});
    File.writeTo(CONFIG_PATH, JSON.stringify(raw, null, 2));
    return raw.cleanmgr;
  }

  /* ================= TPS ================= */
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
    var successCount = 0;
    var failCount = 0;
    
    for (var i = 0; i < config.whitelist.length; i++) {
      try { 
        whitelistRegex.push(new RegExp(config.whitelist[i]));
        successCount++;
        debug("白名单规则编译成功: " + config.whitelist[i]);
      } catch (e) {
        if (config.debug) {
          logger.warn("编译白名单正则失败: " + config.whitelist[i] + " - " + e);
        }
        failCount++;
      }
    }
    
    //logger.info("白名单编译完成: 成功 " + successCount + " 个，失败 " + failCount + " 个");
    //mc.broadcast(lang.prefix + t("messages.whitelist_loaded", successCount));
    
    // 调试模式下输出白名单规则
    if (config.debug && whitelistRegex.length > 0) {
      logger.info("白名单规则列表 (共 " + config.whitelist.length + " 条):");
      for (var i = 0; i < config.whitelist.length; i++) {
        logger.info("  [" + (i + 1) + "] " + config.whitelist[i]);
      }
    } else if (whitelistRegex.length > 0) {
      //logger.info("白名单示例 (前5条):");
      //for (var i = 0; i < Math.min(5, config.whitelist.length); i++) {
      //logger.info("  - " + config.whitelist[i]);
      //}
    }
  }

  /* ================= 实体判断 ================= */
  function shouldKeep(e) {
    if (!e) return true;
    
    // 保留玩家
    try { 
      if (e.type === "minecraft:player") {
        debug("保留玩家实体");
        return true;
      }
    } catch (ex) {}
    
    // 检查实体类型是否在白名单中
    try {
      var entityType = e.type;
      if (entityType) {
        for (var i = 0; i < whitelistRegex.length; i++) {
          if (whitelistRegex[i].test(entityType)) {
            debug("实体类型匹配白名单: " + entityType + " (规则: " + config.whitelist[i] + ")");
            return true;
          }
        }
      }
    } catch (ex) {
      debug("检查实体类型时出错: " + ex);
    }
    
    // 检查物品实体
    try {
      if (typeof e.isItemEntity === "function" && e.isItemEntity()) {
        var it = e.toItem();
        if (it && it.type) {
          for (var i = 0; i < whitelistRegex.length; i++) {
            if (whitelistRegex[i].test(it.type)) {
              debug("物品类型匹配白名单: " + it.type + " (规则: " + config.whitelist[i] + ")");
              return true;
            }
          }
        }
      }
    } catch (ex) {
      debug("检查物品实体时出错: " + ex);
    }
    
    // 检查命名和驯服的实体
    try {
      var nbt = e.getNbt();
      if (nbt) { 
        var obj = nbt.toObject(); 
        if (obj && (obj.CustomName || obj.IsTamed)) {
          debug("保留命名/驯服实体: " + (obj.CustomName || "已驯服"));
          return true;
        }
      }
    } catch (ex) {
      debug("检查NBT时出错: " + ex);
    }
    
    return false;
  }

  /* ================= 清理 ================= */
  function executeClean() {
    state.phase = "cleaning";
    var removed = 0;
    var kept = 0;
    var total = 0;
    
    mc.broadcast(lang.prefix + t("messages.cleanup_start"));
    debug("开始清理实体...");
    
    var all = mc.getAllEntities();
    total = all.length;
    debug("获取到 " + total + " 个实体");
    
    for (var i = 0; i < all.length; i++) {
      var entity = all[i];
      if (shouldKeep(entity)) {
        kept++;
        debug("保留实体: " + (entity.type || "unknown"));
      } else {
        try { 
          entity.despawn(); 
          removed++;
          debug("清理实体: " + (entity.type || "unknown"));
        } catch (e) {
          if (config.debug) {
            logger.warn("清理实体失败: " + e);
          }
        }
      }
    }
    
    mc.broadcast(lang.prefix + t("messages.cleanup_complete", removed));
    if (config.debug) {
     mc.broadcast(lang.prefix + t("messages.cleanup_stats", total, kept, removed));
     logger.info("清理完成 - 总计: " + total + ", 保留: " + kept + ", 清理: " + removed);
    }
    state.phase = "idle";
    state.scheduledTimeouts = [];
  }

  function scheduleClean(triggerByPlayer, playerName) {
    if (state.phase !== "idle") return;
    state.phase = "scheduled";

    var n1 = config.notice.notice1;
    var n2 = config.notice.notice2;

    if (triggerByPlayer && playerName) {
      var now = Date.now();
      var last = state.lastPlayerClean[playerName] || 0;
      if ((now - last) / 1000 < config.playerCooldown) {
        mc.broadcast(lang.prefix + t("messages.cooldown_warning", playerName));
        state.phase = "idle";
        return;
      }
      state.lastPlayerClean[playerName] = now;
      mc.broadcast(lang.prefix + t("messages.manual_trigger"));
    }

    mc.broadcast(lang.prefix + t("messages.cleanup_notice", n1));

    if (n2 > 0 && n2 < n1) {
      state.scheduledTimeouts.push(setTimeout(function () {
        mc.broadcast(lang.prefix + t("messages.cleanup_notice", n2));
      }, (n1 - n2) * 1000));
    }

    state.scheduledTimeouts.push(setTimeout(executeClean, n1 * 1000));
  }

  /* ================= 命令处理函数 ================= */
  function handleCleanCommand(player, action) {
    var playerName = player.realName || player.name;
    
    // 没有参数或 help 参数 - 显示帮助
    if (!action || action === "help") {
      player.tell(lang.prefix + t("messages.help_message"));
      return true;
    }
    
    // tps 参数 - 查询TPS
    if (action === "tps") {
      var currentTps = getTps();
      var tpsStr = currentTps.toFixed(2);
      var message;
      
      if (currentTps >= 19.5) {
        message = t("messages.tps_excellent", tpsStr);
      } else if (currentTps >= 18) {
        message = t("messages.tps_good", tpsStr);
      } else if (currentTps >= 15) {
        message = t("messages.tps_poor", tpsStr);
      } else {
        message = t("messages.tps_critical", tpsStr);
      }
      
      player.tell(lang.prefix + message);
      return true;
    }
    
    // status 参数 - 查询状态
    if (action === "status") {
      if (state.phase === "idle") {
        player.tell(lang.prefix + t("messages.status_idle"));
      } else if (state.phase === "scheduled") {
        player.tell(lang.prefix + t("messages.status_scheduled", config.notice.notice1));
      } else if (state.phase === "cleaning") {
        player.tell(lang.prefix + t("messages.status_cleaning"));
      }
      return true;
    }
    
    // cancel 参数 - 取消清理
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
    
    // now 参数或无效参数 - 触发清理
    if (action === "now" || action) {
      if (state.phase !== "idle") {
        player.tell(lang.prefix + t("messages.cleanup_in_progress"));
        return true;
      }
      scheduleClean(true, playerName);
      return true;
    }
    
    return false;
  }

  /* ================= 命令注册 ================= */
  function registerCommand() {
    debug("开始注册命令...");
    
    // 方案1：尝试使用枚举参数
    try {
      var cmd = mc.newCommand(config.clean_Cmd, "实体清理系统", PermType.Any);
      
      // 尝试使用枚举类型
      cmd.setEnum("CleanAction", ["now", "status", "cancel", "tps", "help"]);
      cmd.optional("action", ParamType.Enum, "CleanAction", 1);
      cmd.overload(["CleanAction"]);
      
      cmd.setCallback(function(_cmd, _ori, _out, _res) {
        var player = _ori.player;
        if (!player) return false;
        
        var action = _res.action || "now";
        debug("命令执行: action=" + action + ", player=" + (player.realName || player.name));
        return handleCleanCommand(player, action);
      });
      
      cmd.setup();
      logger.info("清理命令 /" + config.clean_Cmd + " 注册成功 (方案1: 枚举参数)");
      logger.info("可用子命令: now(默认), status, cancel, tps, help");
      return;
    } catch (e) {
      if (config.debug) {
        logger.warn("方案1失败: " + e);
      }
    }
    
    // 方案2：尝试无参数命令
    try {
      var cmd2 = mc.newCommand(config.clean_Cmd, "实体清理系统", PermType.Any);
      
      cmd2.setCallback(function(_cmd, _ori, _out, _res) {
        var player = _ori.player;
        if (!player) return false;
        
        // 无参数时显示帮助
        player.tell(lang.prefix + t("messages.help_message"));
        player.tell(lang.prefix + t("messages.chat_mode_tip"));
        return true;
      });
      
      cmd2.setup();
      logger.info("清理命令 /" + config.clean_Cmd + " 注册成功 (方案2: 无参数)");
      logger.info("请使用聊天模式输入命令，如: /clean tps");
    } catch (e2) {
      if (config.debug) {
        logger.error("方案2也失败: " + e2);
      }
    }
    
    // 备用方案：聊天监听（总是启用）
    debug("启用聊天监听模式");
    mc.listen("onChat", function(player, msg) {
      var cmdName = config.clean_Cmd.toLowerCase();
      var msgLower = msg.toLowerCase().trim();
      
      // 匹配 /clean 或 /clean xxx
      if (msgLower === "/" + cmdName || msgLower.indexOf("/" + cmdName + " ") === 0) {
        var parts = msg.trim().split(/\s+/);
        var action = parts.length > 1 ? parts[1].toLowerCase() : "help";
        
        debug("聊天命令触发: " + msg + ", action=" + action);
        handleCleanCommand(player, action);
        return false; // 阻止消息发送到聊天
      }
      return true;
    });
    logger.info("聊天监听模式已启用，命令格式: /clean [now|status|cancel|tps|help]");
  }

  /* ================= 定时 ================= */
  function startTimers() {
    timers.push(setInterval(function () {
      if (config.enable) scheduleClean(false);
    }, config.interval * 1000));

    timers.push(setInterval(function () {
      if (config.LowTpsClean.enable && getTps() <= config.LowTpsClean.minimum) {
        mc.broadcast(lang.prefix + t("messages.low_tps_clean", getTps().toFixed(2)));
        scheduleClean(false);
      }
    }, 1000));
  }

  /* ================= 初始化 ================= */
  function init() {
    setTimeout(() => {  
    logger.info("=".repeat(50));
    logger.info("CleanMgr 模块初始化中…");
    logger.info("LSE版本兼容模式已启用");
    logger.info("=".repeat(50));
    
    // 先加载配置（用于debug设置）
    config = loadConfig();
    logger.info("配置文件加载完成");
    
    // 显示调试模式状态
    if (config.debug) {
      logger.info("调试模式: 已启用");
    }
    
    // 加载语言
    lang = loadLang();
    /*logger.info("语言对象已初始化");
    
    // 详细测试语言功能
    logger.info("=== 语言功能测试 ===");
    logger.info("lang 是否存在: " + (lang ? "是" : "否"));
    logger.info("lang.prefix: " + (lang && lang.prefix ? lang.prefix : "未定义"));
    logger.info("lang.messages 类型: " + (lang && lang.messages ? typeof lang.messages : "未定义"));
    
    if (lang && lang.messages) {
      var msgKeys = Object.keys(lang.messages);
      logger.info("messages 键数量: " + msgKeys.length);
      logger.info("前5个键: " + msgKeys.slice(0, 5).join(", "));
      
      // 测试几个关键消息
      logger.info("cleanup_start 值: " + (lang.messages.cleanup_start || "未定义"));
      logger.info("system_starting 值: " + (lang.messages.system_starting || "未定义"));
    }
    
    // 测试翻译函数
    logger.info("=== 翻译函数测试 ===");
    logger.info("测试1: " + t("messages.system_starting"));
    logger.info("测试2: " + t("messages.cleanup_complete", "123"));
    logger.info("测试3: " + t("messages.cleanup_stats", "100", "50", "50"));
    logger.info("=== 测试结束 ===");
    
    // 现在可以安全使用了
    var msg1 = lang.prefix + t("messages.system_starting");
    var msg2 = lang.prefix + t("messages.config_loaded");
    
    logger.info("准备广播消息1: " + msg1);
    logger.info("准备广播消息2: " + msg2);
    
    mc.broadcast(msg1);
    mc.broadcast(msg2);
    */ 
    compileWhitelist();
    
    initTpsSampler();
    logger.info("TPS采样器已启动");
    
    registerCommand();
    
    startTimers();
    logger.info("定时器已启动 - 间隔: " + config.interval + " 秒");
    
    mc.broadcast(lang.prefix + t("messages.system_started"));
    mc.broadcast(lang.prefix + t("messages.command_help_tip"));
   
    logger.info("=".repeat(50));
    logger.info("CleanMgr 启动完成");
    logger.info("=".repeat(50));  
    }, 2000);
    
  }

  return { init: init };

})();

module.exports = CleanMgr;