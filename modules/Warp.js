/**
 * YEssential - 公共传送点（Warp）模块  v2.11.4
 * 功能：/warp 指令 → 查看/传送公共传送点；OP 可添加/删除传送点
 *
 * 依赖全局变量（由主文件提供）：
 *   conf, lang, info, warpdata, economyCfg, transdimid,
 *   Economy, EconomyManager, showInsufficientMoneyGui, mc
 */

module.exports = {
    init: function () {
        _registerWarpCmd();
    }
};

// ─────────────────────────────────────────────────────────
// 指令注册
// ─────────────────────────────────────────────────────────

function _registerWarpCmd() {
    const warpgui = mc.newCommand("warp", "公共传送点", PermType.Any);
    warpgui.overload([]);
    warpgui.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error(lang.get("warp.only.player"));
        pl.isOP() ? OPWarpGui(pl.realName) : WarpGui(pl.realName);
    });
    warpgui.setup();
}

// ─────────────────────────────────────────────────────────
// OP 管理菜单
// ─────────────────────────────────────────────────────────

function OPWarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public.op"));
    fm.addButton(lang.get("warp.add"),  "textures/ui/Add-Ons_Nav_Icon36x36");
    fm.addButton(lang.get("warp.del"),  "textures/blocks/barrier");
    fm.addButton(lang.get("warp.list"), "textures/ui/world_glyph_color_2x");

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + lang.get("gui.exit"));
        const actions = [
            () => WarpAddGui(pl.realName),
            () => WarpDelGui(pl.realName),
            () => WarpGui(pl.realName)
        ];
        actions[id]?.();
    });
}

// ─────────────────────────────────────────────────────────
// 普通玩家：传送列表
// ─────────────────────────────────────────────────────────

function WarpGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const warpList = Object.keys(JSON.parse(warpdata.read()));

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.menu.public"));
    warpList.forEach(name => fm.addButton(name));

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + lang.get("gui.exit"));

        const warpName = warpList[id];
        const warpInfo = warpdata.get(warpName);
        const cost     = conf.get("Warp");
        const coinName = economyCfg.coinName;

        const confirmFm = mc.newCustomForm();
        confirmFm.setTitle(lang.get("warp.go.to"));
        confirmFm.addLabel(lang.get("warp.teleport.name") + warpName);
        confirmFm.addLabel(lang.get("warp.teleport.coord") + warpInfo.x + "," + warpInfo.y + "," + warpInfo.z + " " + transdimid[warpInfo.dimid]);
        confirmFm.addLabel(lang.get("warp.teleport.cost") + cost);
        confirmFm.addLabel("您的" + coinName + "为：" + String(Economy.get(pl)));

        pl.sendForm(confirmFm, (pl, data) => {
            if (data == null) return pl.tell(info + lang.get("gui.exit"));
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "warp");
            setTimeout(() => {
                pl.teleport(parseFloat(warpInfo.x), parseFloat(warpInfo.y), parseFloat(warpInfo.z), parseInt(warpInfo.dimid));
                pl.sendText(info + lang.get("warp.teleported").replace("${name}", warpName));
            }, 200);
            mc.runcmdEx(`camera ${pl.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        });
    });
}

// ─────────────────────────────────────────────────────────
// OP：删除传送点
// ─────────────────────────────────────────────────────────

function WarpDelGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const warpList = Object.keys(JSON.parse(warpdata.read()));

    const fm = mc.newSimpleForm();
    fm.setTitle(lang.get("warp.del.point"));
    warpList.forEach(name => fm.addButton(name));

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("warp");
        const warpName = warpList[id];
        warpdata.delete(warpName);
        pl.sendText(info + lang.get("warp.del.success").replace("${name}", warpName));
    });
}

// ─────────────────────────────────────────────────────────
// OP：添加传送点
// ─────────────────────────────────────────────────────────

function WarpAddGui(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const pos = pl.pos;
    const fm  = mc.newCustomForm();
    fm.setTitle(lang.get("warp.add.point"));
    fm.addLabel(lang.get("warp.add.point.xyz"));
    fm.addLabel(lang.get("warp.teleport.coord") + pos.x.toFixed(1) + "," + pos.y.toFixed(1) + "," + pos.z.toFixed(1) + " " + transdimid[pos.dimid]);
    fm.addInput(lang.get("warp.input.name"), lang.get("warp.name"), "myWarp", lang.get("warp.input.name.tip") || "");

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("warp");
        const warpName = data[2];
        if (!warpName) return pl.tell(info + lang.get("warp.noinput.name"));
        if (warpdata.get(warpName)) return pl.tell(info + lang.get("warp.name.repetitive"));
        warpdata.set(warpName, {
            x:     pos.x.toFixed(1),
            y:     pos.y.toFixed(1),
            z:     pos.z.toFixed(1),
            dimid: pos.dimid
        });
        pl.sendText(info + lang.get("warp.add.success").replace("${name}", warpName));
    });
}
