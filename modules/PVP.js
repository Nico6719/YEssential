/**
 * YEssential - PVP 模块
 * 负责 /pvp 命令注册、伤害拦截和爆炸防护
 * 依赖全局变量: conf, pvpConfig, lang, info, mc, logger
 */

module.exports = {
    init: function () {
        initPvpModule();
    }
};

function initPvpModule() {
    if (!conf.get("PVP").EnabledModule) return;

    // ── 注册 /pvp 命令 ───────────────────────────────────────
    const pvp = mc.newCommand("pvp", "设置是否 PVP。", PermType.Any);
    pvp.optional("bool", ParamType.Bool);
    pvp.overload(["bool"]);

    pvp.setCallback(function (_cmd, ori, out, res) {
        if (!ori.player) return;
        const player = ori.player;
        const xuid   = player.realName;

        if (!conf.get("PVP").EnabledModule) {
            player.tell(info + lang.get("module.no.Enabled"));
            return;
        }

        const currentState = pvpConfig.get(xuid, false);
        const newState     = (res.bool === undefined) ? !currentState : res.bool;

        pvpConfig.set(xuid, newState);
        out.success(info + (newState ? lang.get("pvp.is.on") : lang.get("pvp.is.off")));
    });
    pvp.setup();

    // ── 监听实体爆炸（带 PVP 保护） ─────────────────────────
    mc.listen("onEntityExplode", (source, pos, radius, maxResistance, isDestroy, isFire) => {
        if (!pos) return true;

        const pvpSettings = conf.get("PVP");
        if (!pvpSettings || !pvpSettings.EnabledModule) return true;

        const protectionRange = Math.max(radius, 5);
        const allPlayers      = mc.getOnlinePlayers();

        const playersNearby = allPlayers.filter(player => {
            const p = player.pos;
            if (p.dimid !== pos.dimid) return false;
            const dist = Math.sqrt(
                Math.pow(p.x - pos.x, 2) +
                Math.pow(p.y - pos.y, 2) +
                Math.pow(p.z - pos.z, 2)
            );
            return dist <= protectionRange;
        });

        if (playersNearby.length >= 2) {
            for (const player of playersNearby) {
                if (!pvpConfig.get(player.realName, false)) {
                    try {
                        player.sendToast(info, "检测到多人聚集且您处于 PVP 保护，已拦截爆炸");
                    } catch (e) {
                        logger.error("发送提示失败: " + e);
                    }
                    return false;
                }
            }
        }
        return true;
    });

    // ── 监听伤害事件（统一处理） ─────────────────────────────
    mc.listen("onMobHurt", function (mob, source, damage, cause) {
        if (!mob.isPlayer()) return true;

        const victim = mob.toPlayer();
        if (!conf.get("PVP").EnabledModule) return true;

        // 情况 1：玩家互殴
        if (source && source.isPlayer()) {
            const attacker    = source.toPlayer();
            const attackerPVP = pvpConfig.get(attacker.realName, false);
            const victimPVP   = pvpConfig.get(victim.realName, false);

            if (!attackerPVP) {
                attacker.tell(info + lang.get("your.pvp.isoff"), 6);
                return false;
            }
            if (!victimPVP) {
                attacker.tell(info + lang.get("then.pvp.isoff"), 6);
                return false;
            }
        }

        // 情况 1附加：火焰附魔附加伤害
        const isFireDamage = (cause === 6 || cause === 7);
        if (isFireDamage && !pvpConfig.get(victim.realName, false)) {
            const p = victim.pos;
            const nearbyPlayers = mc.getOnlinePlayers().filter(other => {
                if (other.realName === victim.realName) return false;
                const op = other.pos;
                if (op.dimid !== p.dimid) return false;
                return Math.sqrt(
                    Math.pow(op.x - p.x, 2) +
                    Math.pow(op.y - p.y, 2) +
                    Math.pow(op.z - p.z, 2)
                ) <= 3;
            });
            if (nearbyPlayers.length > 0) return false;
        }

        // 情况 2：爆炸伤害补充拦截
        const isExplosionDamage = (cause === 2 || cause === 3 || cause === 11);
        if (isExplosionDamage && !pvpConfig.get(victim.realName, false)) {
            const p = victim.pos;
            const nearbyPlayers = mc.getOnlinePlayers().filter(other => {
                const op = other.pos;
                if (op.dimid !== p.dimid) return false;
                return Math.sqrt(
                    Math.pow(op.x - p.x, 2) +
                    Math.pow(op.y - p.y, 2) +
                    Math.pow(op.z - p.z, 2)
                ) <= 5;
            });
            if (nearbyPlayers.length >= 2) return false;
        }

        return true;
    });
}
