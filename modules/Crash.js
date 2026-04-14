/**
 * YEssential - Crash 模块
 * 功能：OP 专用，强制使指定玩家客户端崩溃
 */

module.exports = {
    init: function () {
        initCrashModule();
    }
};

function initCrashModule() {
    const crashCfg = conf.get("Crash");

    // 写入默认配置（若字段缺失）
    if (!crashCfg || crashCfg.EnabledModule === undefined) {
        conf.set("Crash", Object.assign({
            EnabledModule: false
        }, crashCfg || {}));
    }

    if (!conf.get("Crash").EnabledModule) return;

    // ── 注册 /crash 命令（权限等级 1 = OP） ──────────────────
    mc.regPlayerCmd("crash", "§c使玩家客户端崩溃", (player) => {
        // 命令权限 + isOP()
        if (!player || !player.isOP()) {
            player.tell(info + lang.get("player.not.op"));
            return;
        }

        const onlinePlayers = mc.getOnlinePlayers();

        // 过滤掉操作者自身
        const targets = onlinePlayers.filter(p => p.realName !== player.realName);

        if (targets.length === 0) {
            player.tell(info + lang.get("crash.no.online"));
            return;
        }

        const form = mc.newCustomForm();
        form.setTitle(lang.get("crash.player.client"));
        form.addLabel(lang.get("carsh.function.list"));
        form.addDropdown("请选择玩家:", targets.map(p => p.name));

        player.sendForm(form, function (pl, data) {
            if (data == null) {
                pl.tell(info + lang.get("gui.exit"));
                return;
            }

            const selectedIndex = data[1];
            const target = targets[selectedIndex];

            if (!target) {
                pl.tell(info + lang.get("crash.target.offline"));
                return;
            }

            target.crash();
            pl.tell(info + lang.get("crash.player.ok"));
            // 操作日志
            if (conf.get("Crash").  LogCrashInfo) {
                logger.warn(`[Crash] ${pl.realName} 对 ${target.realName} 执行了 crash 操作`);
            }
        });

    }, 1); // 权限等级 1 = OP only
}
