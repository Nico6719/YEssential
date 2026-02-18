/**
 * YEssential - FCAM（灵魂出窍）模块
 * 负责 /fcam 命令、BossBar 倒计时、模拟玩家管理
 * 依赖全局变量: conf, lang, info, mc, logger, smartMoneyCheck
 */

module.exports = {
    init: function () {
        initFcamModule();
    }
};

function initFcamModule() {
    const cmd = mc.newCommand("fcam", "灵魂出窍", PermType.Any);
    cmd.overload([]);

    // 存储玩家的 BossBar 数据（模块内私有）
    const fcamBossBars = new Map();

    cmd.setCallback((_cmd, ori, out, _res) => {
        const pl = ori.player;
        if (!pl) {
            out.error(info + lang.get("fc.error"));
            return;
        }

        const plname   = pl.realName;
        const plpos    = ori.pos;
        const timeout  = conf.get("Fcam").TimeOut;
        const FcamCost = conf.get("Fcam").CostMoney;

        if (conf.get("Fcam").EnableModule == 0) {
            pl.tell(info + lang.get("module.no.Enabled"));
            return;
        }

        // ── 退出灵魂出窍 ────────────────────────────────────
        if (pl.gameMode == 6) {
            cleanupFcamBossBar(plname);

            try { pl.setGameMode(0); }
            catch (e) { logger.error(lang.get("fc.error.log1") + e); }

            try { mc.runcmdEx(`tp "${plname}" "${plname}_sp"`); }
            catch (e) { logger.error(lang.get("fc.error.log2") + e); }

            const spl = mc.getPlayer(plname + "_sp");
            if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                try { spl.simulateDisconnect(); }
                catch (e) { logger.error(lang.get("fc.error.log3") + e); }
            } else {
                logger.warn(`FCAM: 未找到模拟玩家 ${plname}_sp，跳过断开`);
            }

            out.success(info + lang.get("fc.success.quit"));
            return;
        }

        // ── 进入灵魂出窍 ────────────────────────────────────

        // 费用检查（smartMoneyCheck 定义于主文件）
        if (!smartMoneyCheck(pl.realName, FcamCost)) {
            return pl.tell(info + lang.get("money.no.enough"));
        }

        mc.spawnSimulatedPlayer(plname + "_sp", plpos);
        mc.runcmdEx(`gamemode spectator "${plname}_sp"`);
        pl.setGameMode(6);

        out.success(info + lang.get("fc.success.getin").replace("${Fcam}", FcamCost));

        if (timeout > 0) {
            startFcamBossBar(pl, plname, timeout);
        }
    });

    cmd.setup();

    // ── BossBar 倒计时 ──────────────────────────────────────
    function startFcamBossBar(pl, plname, timeout) {
        let remain  = timeout;
        const bossId = Number(`10${plname.length}${Date.now()}`);

        pl.setBossBar(bossId, `§e灵魂出窍剩余 §c${remain} §e秒`, 100, 3);

        fcamBossBars.set(plname, {
            bossId,
            timer: null,
            remain,
            totalTime: timeout
        });

        const timer = setInterval(() => {
            const data = fcamBossBars.get(plname);
            if (!data) { clearInterval(timer); return; }

            data.remain--;
            const currentPlayer = mc.getPlayer(plname);

            if (!currentPlayer || currentPlayer.gameMode !== 6) {
                cleanupFcamBossBar(plname);
                return;
            }

            if (data.remain <= 0) {
                cleanupFcamBossBar(plname);
                try {
                    currentPlayer.setGameMode(0);
                    mc.runcmdEx(`tp "${plname}" "${plname}_sp"`);
                    const spl = mc.getPlayer(plname + "_sp");
                    if (spl && spl.isSimulatedPlayer && spl.isSimulatedPlayer()) {
                        spl.simulateDisconnect();
                    }
                    currentPlayer.tell(info + lang.get("fc.timeout"));
                } catch (e) {
                    logger.error(lang.get("fc.error.log4") + e);
                }
                return;
            }

            const progress = (data.remain / data.totalTime) * 100;
            let color = 3;
            if (data.remain <= 10) color = 4;
            if (data.remain <= 5)  color = 2;

            try {
                currentPlayer.setBossBar(
                    data.bossId,
                    `§e灵魂出窍剩余 §c${data.remain} §e秒`,
                    progress,
                    color
                );
            } catch (e) {
                logger.error("FCAM: 更新 BossBar 失败: " + e);
                cleanupFcamBossBar(plname);
            }
        }, 1000);

        fcamBossBars.get(plname).timer = timer;
    }

    // ── 清理 BossBar 和计时器 ───────────────────────────────
    function cleanupFcamBossBar(plname) {
        const data = fcamBossBars.get(plname);
        if (!data) return;

        if (data.timer) clearInterval(data.timer);

        const player = mc.getPlayer(plname);
        if (player && data.bossId) {
            try { player.removeBossBar(data.bossId); }
            catch (e) { logger.error(lang.get("fc.error.log5") + e); }
        }

        fcamBossBars.delete(plname);
    }

    // ── 监听玩家退出，清理残留状态 ─────────────────────────
    mc.listen("onLeft", (player) => {
        const plname = player.realName;
        cleanupFcamBossBar(plname);

        const spl = mc.getPlayer(plname + "_sp");
        if (spl) spl.simulateDisconnect();
    });
}
