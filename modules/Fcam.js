/**
 * YEssential - FCAM（灵魂出窍）模块
 * 负责 /fcam 命令、BossBar 倒计时、盔甲架身体标记
 * 依赖全局变量: info, mc, logger, smartMoneyCheck, CachePool
 * 不要改回 mc.spawnSimulatedPlayer：模拟玩家依赖 BDS GameTest 子系统，装 addon 会残废（LSE #254）
 */

module.exports = { init: initFcamModule, cleanupOrphans: cleanupOrphanMarkers };

const TAG = "yessential_fcam_marker";
// plname -> { pos, rot, gameMode, anchor, entity, timer, bossId, remain, total }
const state = new Map();

function conf() { return CachePool.conf("Fcam") || {}; }
function K(key) { return CachePool.lang(key); }
function barText(remain) { return "§e灵魂出窍剩余 §c" + remain + " §e秒"; }

// 实测（jsdebug）旁观者返回 6；Player.md 属性表写的「3 = 旁观者」是文档错误
function isSpec(gm) { return gm === 6; }
// 只保留 0/1/2 三种真实模式，异常值一律按生存，杜绝把普通玩家还原成创造
function safeMode(gm) { return (gm === 1 || gm === 2) ? gm : 0; }

function spawnStand(plname, anchor) {
    let en = null;
    try {
        en = mc.spawnMob("minecraft:armor_stand", anchor);
    } catch (e) {
        logger.error("FCAM: 盔甲架生成失败: " + e);
    }
    if (!en) return null;
    // 必须设 CustomName：Cleanmgr 的 shouldKeep() 只放行 player / 白名单 / 带 CustomName 或 IsTamed 的实体
    try { en.setCustomName("§e" + plname + " 的身体"); } catch (e) {}
    try { en.addTag(TAG); } catch (e) {}   // Tag 供启动清理识别
    return en;
}

function clearMarker(st) {
    if (!st || !st.entity) return;
    try { if (st.entity.inWorld) st.entity.remove(); } catch (e) {}
    st.entity = null;
}

// 启动清理：盔甲架会进存档，重启后残留必须回收。在 YEssential 启动流程里调用。
function cleanupOrphanMarkers() {
    let n = 0;
    try {
        const all = mc.getAllEntities();
        for (let i = 0; i < all.length; i++) {
            const e = all[i];
            if (e.type !== "minecraft:armor_stand") continue;
            try {
                if (e.getAllTags().indexOf(TAG) >= 0) { e.despawn(); n++; }
            } catch (x) {}
        }
    } catch (e) {
        logger.error("FCAM: 清理残留标记失败: " + e);
    }
    if (n) logger.info("FCAM: 已清理 " + n + " 个残留的身体标记");
    return n;
}
// 主加载器不保留模块对象，故挂到 globalThis 供启动阶段直接调用
globalThis.fcamCleanupOrphans = cleanupOrphanMarkers;

function stopTimer(pl, plname, st) {
    if (st.timer) { try { clearInterval(st.timer); } catch (e) {} st.timer = null; }
    const p = pl || mc.getPlayer(plname);
    if (p && st.bossId) {
        try { p.removeBossBar(st.bossId); } catch (e) { logger.error(K("fc.error.log5") + e); }
    }
    st.bossId = null;
}

// 只在玩家当前仍是旁观者时才还原模式：期间被管理员改过就说明有人接管了，不抢
function restoreMode(pl, st) {
    if (!pl || !isSpec(pl.gameMode)) return;
    try { pl.setGameMode(st.gameMode); } catch (e) { logger.error(K("fc.error.log1") + e); }
}

function enterFcam(pl, plname, anchor) {
    const st = {
        pos: pl.pos, rot: pl.direction, gameMode: safeMode(pl.gameMode), anchor: anchor,
        entity: null, timer: null, bossId: null, remain: 0, total: 0
    };
    state.set(plname, st);
    // 先切模式再放标记，避免标记实体与玩家实体在同一格互相推挤
    try { pl.setGameMode(6); } catch (e) { logger.error(K("fc.error.log1") + e); }
    if (String(conf().BodyMarker || "armor_stand").toLowerCase() !== "none") {
        st.entity = spawnStand(plname, anchor);
    }
    startTimer(pl, plname, st);
    return st;
}

function exitFcam(pl, plname) {
    const st = state.get(plname);
    if (!st) return false;
    stopTimer(pl, plname, st);
    clearMarker(st);
    restoreMode(pl, st);
    try { pl.teleport(st.pos, st.rot); } catch (e) { logger.error(K("fc.error.log2") + e); }
    // 删状态放在最后：中途抛错则状态仍在，玩家可再执行一次 /fcam 重试退出
    state.delete(plname);
    return true;
}

// 死亡中断：回收资源但不传送（死亡即新的现实）
function abortFcam(pl, plname) {
    const st = state.get(plname);
    if (!st) return false;
    stopTimer(pl, plname, st);
    clearMarker(st);
    restoreMode(pl, st);
    state.delete(plname);
    return true;
}

// 卸载/重载兜底：否则内存状态随模块作废，玩家卡在旁观者且 /fcam 只回 fc.error2。
// ll.onUnload 内部是 addUnloadCallback（追加注册），不会顶掉主文件的落盘回调。
function exitAllFcam() {
    try {
        const list = mc.getOnlinePlayers();
        for (let i = 0; i < list.length; i++) {
            try {
                if (state.has(list[i].realName)) exitFcam(list[i], list[i].realName);
            } catch (e) {}
        }
    } catch (e) {
        logger.error("FCAM: 卸载清理失败: " + e);
    }
}

function distText(p, a) {
    const c = "(" + Math.round(a.x) + ", " + Math.round(a.y) + ", " + Math.round(a.z) + ")";
    // 跨维度时 distanceTo 会返回整数最大值，必须单独说明
    if (p.pos.dimid !== a.dimid) return "§e身体在 §c另一个维度 §7" + c;
    return "§e距离身体 §c" + Math.round(p.distanceTo(a)) + " §e米 §7" + c;
}

function startTimer(pl, plname, st) {
    const c = conf();
    const showHud = c.ShowHud !== false;
    const timeout = Number(c.TimeOut) || 0;

    st.total = timeout > 0 ? timeout : 0;
    st.remain = st.total;

    if (st.total > 0) {
        st.bossId = Number("10" + plname.length + Date.now());
        try {
            pl.setBossBar(st.bossId, barText(st.remain), 100, 3);
        } catch (e) {
            logger.error("FCAM: 创建 BossBar 失败: " + e);
            st.bossId = null;
        }
    }

    st.timer = setInterval(function () {
        const cur = state.get(plname);
        if (!cur) return;

        const p = mc.getPlayer(plname);
        // 人没了，或模式被外部改掉：回收资源，但不还原模式（不抢控制权）
        if (!p || !isSpec(p.gameMode)) { abortFcam(p, plname); return; }

        if (showHud) { try { p.tell(info + distText(p, cur.anchor), 5); } catch (e) {} }

        if (cur.total <= 0) return;
        cur.remain--;

        if (cur.remain <= 0) {
            try {
                exitFcam(p, plname);
                p.tell(info + K("fc.timeout"));
            } catch (e) {
                logger.error(K("fc.error.log4") + e);
            }
            return;
        }

        if (cur.bossId) {
            try {
                p.setBossBar(cur.bossId, barText(cur.remain), cur.remain / cur.total * 100,
                             cur.remain <= 5 ? 2 : (cur.remain <= 10 ? 4 : 3));
            } catch (e) {
                logger.error("FCAM: 更新 BossBar 失败: " + e);
                cur.bossId = null;
            }
        }
    }, 1000);
}

function initFcamModule() {
    const cmd = mc.newCommand("fcam", "灵魂出窍", PermType.Any);
    cmd.overload([]);

    cmd.setCallback(function (_c, ori, out, _r) {
        try {
            const pl = ori.player;
            if (!pl) return out.error(info + K("fc.error"));

            const plname = pl.realName;
            const c = conf();
            if (c.EnableModule == 0) return pl.tell(info + K("module.no.Enabled"));

            if (state.has(plname)) {
                exitFcam(pl, plname);
                return out.success(info + K("fc.success.quit"));
            }

            // 已是旁观者（非本模块所致）→ 只提示，不动模式。绝不能"救援"成其他模式：会覆盖管理员的合法状态
            if (isSpec(pl.gameMode)) return out.error(info + K("fc.error2"));

            const cost = c.CostMoney;
            if (!smartMoneyCheck(plname, cost, "灵魂出窍(Fcam)")) {
                return pl.tell(info + K("money.no.enough"));
            }

            enterFcam(pl, plname, pl.feetPos);
            return out.success(info + K("fc.success.getin").replace("${Fcam}", cost));
        } catch (e) {
            logger.error("FCAM: 执行 /fcam 异常: " + e);
            try { out.error(info + "灵魂出窍执行失败，请查看控制台日志。"); } catch (e2) {}
        }
    });

    cmd.setup();

    // 不注册则 reload 会留下卡在旁观者的玩家；每次加载都注册（回调随引擎销毁，幂等）
    ll.onUnload(exitAllFcam);

    mc.listen("onLeft", function (p) {
        // 必须在玩家数据落盘前还原模式，否则下次进服会以旁观者身份出现
        try { if (state.has(p.realName)) exitFcam(p, p.realName); }
        catch (e) { logger.error("FCAM: onLeft 清理失败: " + e); }
    });

    // 死亡兜底（/suicide、/kill 通用）：否则留下孤儿盔甲架，且重生后 /fcam 会被误判成"已在旁观者"
    mc.listen("onPlayerDie", function (p) {
        try { if (state.has(p.realName)) abortFcam(p, p.realName); }
        catch (e) { logger.error("FCAM: onPlayerDie 清理失败: " + e); }
    });
}
