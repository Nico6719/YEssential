/*--------------------------------
    YEssential Warp Manager
    处理公共传送点逻辑
----------------------------------*/

const ctx = require("./GlobalContext");

const WarpManager = {
    init() {
        let warpgui = mc.newCommand("warp", ctx.lang.get("warp.command.desc"), PermType.Any);
        warpgui.overload([]);
        warpgui.setCallback((cmd, ori, out, res) => {
            let pl = ori.player;
            if (!pl) return out.error(ctx.lang.get("warp.only.player"));
            this.mainGui(pl);
        });
        warpgui.setup();
    },

    mainGui(pl) {
        let fm = mc.newSimpleForm();
        fm.setTitle(ctx.lang.get("warp.menu.public"));
        fm.addButton(ctx.lang.get("warp.go.to"));
        if (pl.isOP()) {
            fm.addButton(ctx.lang.get("warp.add"));
            fm.addButton(ctx.lang.get("warp.del"));
        }

        pl.sendForm(fm, (pl, id) => {
            if (id == null) return pl.tell(ctx.info + ctx.lang.get("gui.exit"));
            switch (id) {
                case 0: this.tpWarpGui(pl); break;
                case 1: this.addWarpGui(pl); break;
                case 2: this.delWarpGui(pl); break;
            }
        });
    },

    tpWarpGui(pl) {
        let cost = ctx.conf.get("Warp").tp;
        let fm = mc.newSimpleForm();
        fm.setTitle(ctx.lang.get("warp.menu.public"));
        fm.setContent(ctx.lang.get("warp.list"));
        let lst = [];
        let pldata = JSON.parse(ctx.warpdata.read()) || {};
        for (let i in pldata) {
            lst.push(i);
            fm.addButton(i + "\n" + ctx.lang.get("warp.teleport.coord") + pldata[i].x + "," + pldata[i].y + "," + pldata[i].z + " " + ctx.transdimid[pldata[i].dimid]);
        }
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return pl.runcmd("warp");
            let cfm = mc.newCustomForm();
            cfm.setTitle(ctx.lang.get("warp.go.to"));
            cfm.addLabel(ctx.lang.get("warp.teleport.name") + lst[id]);
            cfm.addLabel("您的" + ctx.lang.get("CoinName") + "：" + String(ctx.Economy.get(pl)));
            cfm.addLabel(ctx.lang.get("warp.teleport.cost") + cost + ctx.lang.get("CoinName"));
            cfm.addLabel(ctx.lang.get("warp.teleport.coord") + pldata[lst[id]].x + "," + pldata[lst[id]].y + "," + pldata[lst[id]].z + " " + ctx.transdimid[pldata[lst[id]].dimid]);
            pl.sendForm(cfm, (pl, data) => {
                if (data == null) return pl.runcmd("warp");
                if (!ctx.EconomyManager.checkAndReduce(pl.realName, cost)) return ctx.showInsufficientMoneyGui(pl, cost, "warp");
                pl.teleport(parseFloat(pldata[lst[id]].x), parseFloat(pldata[lst[id]].y), parseFloat(pldata[lst[id]].z), parseInt(pldata[lst[id]].dimid));
                pl.sendText(ctx.info + ctx.lang.get("warp.teleported").replace("${name}", lst[id]));
            });
        });
    },

    addWarpGui(pl) {
        let fm = mc.newCustomForm();
        fm.setTitle(ctx.lang.get("warp.add.point"));
        fm.addLabel(ctx.lang.get("warp.add.point.xyz") + "\n" + String(pl.pos));
        fm.addInput(ctx.lang.get("warp.input.name"));
        pl.sendForm(fm, (pl, data) => {
            if (data == null) return pl.runcmd("warp");
            let name = data[1];
            if (!name) return pl.tell(ctx.info + ctx.lang.get("warp.noinput.name"));
            
            if (ctx.warpdata.get(name)) return pl.tell(ctx.info + ctx.lang.get("warp.name.repetitive"));
            
            ctx.warpdata.set(name, {
                "x": pl.pos.x.toFixed(1),
                "y": pl.pos.y.toFixed(1),
                "z": pl.pos.z.toFixed(1),
                "dimid": pl.pos.dimid
            });
            pl.sendText(ctx.info + ctx.lang.get("warp.add.success").replace("${name}", name));
        });
    },

    delWarpGui(pl) {
        let fm = mc.newSimpleForm();
        fm.setTitle(ctx.lang.get("warp.del.point"));
        fm.setContent(ctx.lang.get("warp.list"));
        let lst = [];
        let pldata = JSON.parse(ctx.warpdata.read()) || {};
        for (let i in pldata) {
            lst.push(i);
            fm.addButton(i);
        }
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return pl.runcmd("warp");
            let name = lst[id];
            let cfm = mc.newCustomForm();
            cfm.setTitle(ctx.lang.get("warp.del.point"));
            cfm.addLabel("确认删除传送点 " + name + "？");
            pl.sendForm(cfm, (pl, data) => {
                if (data == null) return pl.runcmd("warp");
                ctx.warpdata.delete(name);
                pl.sendText(ctx.info + ctx.lang.get("warp.del.success").replace("${name}", name));
            });
        });
    }
};

module.exports = WarpManager;
