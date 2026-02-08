/*--------------------------------
    YEssential Home Manager
    处理家园系统逻辑
----------------------------------*/

const ctx = require("./GlobalContext");

const HomeManager = {
    init() {
        let homegui = mc.newCommand("home", "家园系统", PermType.Any);
        homegui.overload([]);
        homegui.setCallback((cmd, ori, out, res) => {
            let pl = ori.player;
            if (!pl) return out.error("仅限玩家执行");

            let fm = mc.newSimpleForm();
            fm.setTitle(ctx.lang.get("home.tp.system"));
            fm.addButton(ctx.lang.get("home.tp"));
            fm.addButton(ctx.lang.get("home.add"));
            fm.addButton(ctx.lang.get("home.del"));

            pl.sendForm(fm, (pl, id) => {
                if (id == null) return pl.tell(ctx.info + ctx.lang.get("gui.exit"));
                switch (id) {
                    case 0: this.tpHomeGui(pl); break;
                    case 1: this.addHomeGui(pl); break;
                    case 2: this.delHomeGui(pl); break;
                }
            });
        });
        homegui.setup();
    },

    tpHomeGui(pl) {
        let cost = ctx.conf.get("Home").tp;
        let fm = mc.newSimpleForm();
        fm.setTitle(ctx.lang.get("home.tp"));
        fm.setContent(ctx.lang.get("home.tp.choose"));
        let lst = [];
        let pldata = ctx.homedata.get(pl.realName) || {};
        for (let i in pldata) {
            lst.push(i);
            fm.addButton(i + "\n坐标：" + pldata[i].x + "," + pldata[i].y + "," + pldata[i].z + " " + ctx.transdimid[pldata[i].dimid]);
        }
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return pl.tell(ctx.info + ctx.lang.get("gui.exit"));
            let cfm = mc.newCustomForm();
            cfm.setTitle(ctx.lang.get("home.tp"));
            cfm.addLabel("确认传送家 " + lst[id] + "？");
            cfm.addLabel("您的" + ctx.lang.get("CoinName") + "：" + String(ctx.Economy.get(pl)));
            cfm.addLabel("传送家需要花费" + cost + ctx.lang.get("CoinName"));
            cfm.addLabel("坐标：" + pldata[lst[id]].x + "," + pldata[lst[id]].y + "," + pldata[lst[id]].z + " " + ctx.transdimid[pldata[lst[id]].dimid]);
            pl.sendForm(cfm, (pl, data) => {
                if (data == null) return pl.runcmd("home");
                if (!ctx.EconomyManager.checkAndReduce(pl.realName, cost)) return ctx.showInsufficientMoneyGui(pl, cost, "home");
                pl.teleport(parseFloat(pldata[lst[id]].x), parseFloat(pldata[lst[id]].y), parseFloat(pldata[lst[id]].z), parseInt(pldata[lst[id]].dimid));
                pl.sendText(ctx.info + "传送家 " + lst[id] + " 成功！");
            });
        });
    },

    delHomeGui(pl) {
        let cost = ctx.conf.get("Home").del;
        let fm = mc.newSimpleForm();
        fm.setTitle(ctx.lang.get("home.del"));
        fm.setContent(ctx.lang.get("home.del.choose"));
        let lst = [];
        let pldata = ctx.homedata.get(pl.realName) || {};
        for (let i in pldata) {
            lst.push(i);
            fm.addButton(i + "\n坐标：" + pldata[i].x + "," + pldata[i].y + "," + pldata[i].z + " " + ctx.transdimid[pldata[i].dimid]);
        }
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return pl.runcmd("home");
            let cfm = mc.newCustomForm();
            cfm.setTitle(ctx.lang.get("home.del"));
            cfm.addLabel("§c§l请问您确认要删除家 " + lst[id] + "？此操作不可撤销！！！");
            cfm.addLabel("您的" + ctx.lang.get("CoinName") + "：" + String(ctx.Economy.get(pl)));
            cfm.addLabel("删除家需要花费" + cost + ctx.lang.get("CoinName"));
            cfm.addLabel("坐标：" + pldata[lst[id]].x + "," + pldata[lst[id]].y + "," + pldata[lst[id]].z + " " + ctx.transdimid[pldata[lst[id]].dimid]);
            pl.sendForm(cfm, (pl, data) => {
                if (data == null) return pl.tell(ctx.info + ctx.lang.get("gui.exit"));
                if (!ctx.EconomyManager.checkAndReduce(pl.realName, cost)) return ctx.showInsufficientMoneyGui(pl, cost, "home");
                let currentData = ctx.homedata.get(pl.realName) || {};
                delete currentData[lst[id]];
                ctx.homedata.set(pl.realName, currentData);
                pl.sendText(ctx.info + "删除家 " + lst[id] + " 成功！");
            });
        });
    },

    addHomeGui(pl) {
        let cost = ctx.conf.get("Home").add;
        let HomeCount = ctx.conf.get("Home").MaxHome;
        let pldata = ctx.homedata.get(pl.realName) || {};
        if (Object.keys(pldata).length >= HomeCount) return pl.sendText(ctx.info + "您的家数量已达到上限值:" + HomeCount + "!");
        
        let fm = mc.newCustomForm();
        fm.setTitle(ctx.lang.get("home.add"));
        fm.addLabel("当前坐标：" + String(pl.pos));
        fm.addLabel("您的" + ctx.lang.get("CoinName") + "：" + String(ctx.Economy.get(pl)));
        fm.addLabel("添加花费：" + String(cost) + ctx.lang.get("CoinName"));
        fm.addInput(ctx.lang.get("home.add.input"));
        pl.sendForm(fm, (pl, data) => {
            if (data == null) return pl.runcmd("home");
            if (data[3] == "" || !data[3]) return pl.tell(ctx.info + ctx.lang.get("home.name.noinput"));
            let currentData = ctx.homedata.get(pl.realName) || {};
            if (Object.keys(currentData).includes(data[3])) return pl.tell(ctx.info + ctx.lang.get("home.name.repetitive"));
            if (!ctx.EconomyManager.checkAndReduce(pl.realName, cost)) return ctx.showInsufficientMoneyGui(pl, cost, "home");
            
            currentData[data[3]] = {
                "x": pl.pos.x.toFixed(1),
                "y": pl.pos.y.toFixed(1),
                "z": pl.pos.z.toFixed(1),
                "dimid": pl.pos.dimid
            };
            ctx.homedata.set(pl.realName, currentData);
            pl.sendText(ctx.info + "添加家：" + data[3] + " 成功！");
        });
    }
};

module.exports = HomeManager;
