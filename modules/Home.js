/**
 * YEssential - 家园系统（Home）模块  v2.11.4
 * 功能：/home 指令 → 传送家、共享家、添加家、删除家、家设置
 *
 * 依赖全局变量（由主文件提供）：
 *   conf, lang, info, homedata, economyCfg, transdimid,
 *   Economy, EconomyManager, showInsufficientMoneyGui, mc
 */

// 捕获全局 Store 实例，确保在异步回调（如 sendForm）中可用
const homeStore = globalThis.homeStore;

module.exports = {
    init: function () {
        _registerHomeCmd();
    }
};

// ─────────────────────────────────────────────────────────
// 指令注册
// ─────────────────────────────────────────────────────────

function _registerHomeCmd() {
    const homegui = mc.newCommand("home", "家园系统", PermType.Any);
    homegui.overload([]);
    homegui.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return out.error(CachePool.lang("warp.only.player"));
        _showHomeMainGui(pl);
    });
    homegui.setup();
}

// ─────────────────────────────────────────────────────────
// 主菜单
// ─────────────────────────────────────────────────────────

function _showHomeMainGui(pl) {
    const fm = mc.newSimpleForm();
    fm.setTitle(info + CachePool.lang("home.tp.system"));
    fm.addButton(CachePool.lang("home.tp"),       "textures/items/ender_eye");
    fm.addButton(CachePool.lang("home.share"),    "textures/items/compass_item");
    fm.addButton(CachePool.lang("home.add"),      "textures/ui/Add-Ons_Nav_Icon36x36");
    fm.addButton(CachePool.lang("home.del"),      "textures/blocks/barrier");
    fm.addButton(CachePool.lang("home.settings"), "textures/ui/settings_pause_menu_icon");

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + CachePool.lang("gui.exit"));
        switch (id) {
            case 0: TpHome(pl.realName);       break;
            case 1: ShareHome(pl.realName);    break;
            case 2: AddHome(pl.realName);      break;
            case 3: DelHome(pl.realName);      break;
            case 4: HomeSeetings(pl.realName); break;
        }
    });
}

// ─────────────────────────────────────────────────────────
// 传送家
// ─────────────────────────────────────────────────────────

function TpHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const homeConf = CachePool.conf("Home");
    const cost     = homeConf.tp;
    const coinName = economyCfg.coinName;

    let lst    = [];
    let pldata = homeStore.get(pl.realName) || {};

    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("home.tp"));
    fm.setContent(CachePool.lang("home.tp.choose"));
    for (let i in pldata) {
        lst.push(i);
        fm.addButton(i + "\n坐标：" + pldata[i].x + "," + pldata[i].y + "," + pldata[i].z + " " + transdimid[pldata[i].dimid]);
    }

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + CachePool.lang("gui.exit"));
        const fm2 = mc.newCustomForm();
        fm2.setTitle(info + CachePool.lang("home.tp"));
        fm2.addLabel("确认传送家 " + lst[id] + "？");
        fm2.addLabel("您的" + coinName + "：" + String(Economy.get(pl)));
        fm2.addLabel("传送家需要花费" + cost + coinName);
        fm2.addLabel("坐标：" + pldata[lst[id]].x + "," + pldata[lst[id]].y + "," + pldata[lst[id]].z + " " + transdimid[pldata[lst[id]].dimid]);
        pl.sendForm(fm2, (pl, data) => {
            if (data == null) return pl.runcmd("home");
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            setTimeout(() => {
                pl.teleport(parseFloat(pldata[lst[id]].x), parseFloat(pldata[lst[id]].y), parseFloat(pldata[lst[id]].z), parseInt(pldata[lst[id]].dimid));
                pl.sendText(info + "传送家 " + lst[id] + " 成功！");
            }, 200);
            mc.runcmdEx(`camera ${pl.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        });
    });
}

// ─────────────────────────────────────────────────────────
// 公共家（共享）
// ─────────────────────────────────────────────────────────

function ShareHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const homeConf = CachePool.conf("Home");
    const cost     = homeConf.tp;
    const coinName = economyCfg.coinName;

    let allData;
    try { allData = homeStore.getAll(); } catch (e) { allData = {}; }

    const publicList = [];
    for (let owner in allData) {
        const homes = allData[owner];
        for (let homeName in homes) {
            if (homes[homeName].isPublic) {
                publicList.push({ owner, name: homeName, x: homes[homeName].x, y: homes[homeName].y, z: homes[homeName].z, dimid: homes[homeName].dimid });
            }
        }
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("home.share"));

    if (publicList.length === 0) {
        fm.setContent(CachePool.lang("home.no.public.homes"));
        pl.sendForm(fm, (pl, _id) => { pl.runcmd("home"); });
        return;
    }

    fm.setContent(CachePool.lang("home.choose.public.home"));
    publicList.forEach(h => {
        fm.addButton(h.owner + " " + h.name + "\n§l" + transdimid[h.dimid] + " " + h.x + "," + h.y + "," + h.z);
    });

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.tell(info + CachePool.lang("gui.exit"));
        const h   = publicList[id];
        const fm2 = mc.newCustomForm();
        fm2.setTitle(info + CachePool.lang("home.share"));
        fm2.addLabel("§l传送目标：§r" + h.name + " §7(" + h.owner + ")");
        fm2.addLabel("坐标：" + h.x + "," + h.y + "," + h.z + " " + transdimid[h.dimid]);
        fm2.addLabel("您的" + coinName + "：" + String(Economy.get(pl)));
        fm2.addLabel("传送花费：" + cost + coinName);
        pl.sendForm(fm2, (pl, data) => {
            if (data == null) return pl.runcmd("home");
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            setTimeout(() => {
                pl.teleport(parseFloat(h.x), parseFloat(h.y), parseFloat(h.z), parseInt(h.dimid));
                pl.sendText(info + "传送至公共家 §e" + h.name + "§r (" + h.owner + ") 成功！");
            }, 200);
            mc.runcmdEx(`camera ${pl.realName} fade time 0.15 0.5 0.35 color 0 0 0`);
        });
    });
}

// ─────────────────────────────────────────────────────────
// 家设置（公开 / 重命名）
// ─────────────────────────────────────────────────────────

function HomeSeetings(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;

    const pldata = homeStore.get(pl.realName) || {};
    const lst    = Object.keys(pldata);

    if (lst.length === 0) {
        pl.tell(info + CachePool.lang("home.no.homes"));
        return pl.runcmd("home");
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(info + CachePool.lang("home.settings"));
    fm.setContent(CachePool.lang("home.choose.home"));
    lst.forEach(name => {
        const h      = pldata[name];
        const pubTag = h.isPublic ? "§b§l[公开]§r" : "§d§l[私有]§r";
        fm.addButton(name + " " + pubTag + "\n§l坐标：" + transdimid[h.dimid] + " " + h.x + "," + h.y + "," + h.z);
    });

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("home");
        let homeName = lst[id];
        const h      = pldata[homeName];

        const fm2 = mc.newCustomForm();
        fm2.setTitle(info + CachePool.lang("home.settings") + " - " + homeName);
        fm2.addLabel("坐标：" + h.x + "," + h.y + "," + h.z + " " + transdimid[h.dimid]);
        fm2.addSwitch(CachePool.lang("home.set.public"), !!h.isPublic);
        fm2.addInput(CachePool.lang("home.rename"), homeName, "", lang.get("home.add.input.tip") || "");

        pl.sendForm(fm2, (pl, data) => {
            if (data == null) return HomeSeetings(pl.realName);
            const pldata2    = homeStore.get(pl.realName) || {};
            const newIsPublic = data[1];
            const newName     = (data[2] && data[2].trim()) ? data[2].trim() : null;

            if (newName && newName !== homeName) {
                if (Object.keys(pldata2).includes(newName)) return pl.tell(info + CachePool.lang("home.name.repetitive"));
                pldata2[newName] = pldata2[homeName];
                delete pldata2[homeName];
                homeName = newName;
            }
            pldata2[homeName].isPublic = newIsPublic;
            homeStore.set(pl.realName, pldata2);

            const statusText = newIsPublic ? "§b公开" : "§d私有";
            pl.sendText(info + "家 §e" + homeName + "§r 设置已更新！公开状态：" + statusText);
            HomeSeetings(pl.realName);
        });
    });
}

// ─────────────────────────────────────────────────────────
// 删除家
// ─────────────────────────────────────────────────────────

function DelHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const homeConf = CachePool.conf("Home");
    const cost     = homeConf.del;
    const coinName = economyCfg.coinName;

    let lst    = [];
    let pldata = homeStore.get(pl.realName) || {};

    const fm = mc.newSimpleForm();
    fm.setTitle(CachePool.lang("home.del"));
    fm.setContent(CachePool.lang("home.del.choose"));
    for (let i in pldata) {
        lst.push(i);
        fm.addButton(i + "\n坐标：" + pldata[i].x + "," + pldata[i].y + "," + pldata[i].z + " " + transdimid[pldata[i].dimid]);
    }

    pl.sendForm(fm, (pl, id) => {
        if (id == null) return pl.runcmd("home");
        const fm2 = mc.newCustomForm();
        fm2.setTitle(CachePool.lang("home.del"));
        fm2.addLabel("§c§l请问您确认要删除家 " + lst[id] + "？此操作不可撤销！！！");
        fm2.addLabel("您的" + coinName + "：" + String(Economy.get(pl)));
        fm2.addLabel("删除家需要花费" + cost + coinName);
        fm2.addLabel("坐标：" + pldata[lst[id]].x + "," + pldata[lst[id]].y + "," + pldata[lst[id]].z + " " + transdimid[pldata[lst[id]].dimid]);
        pl.sendForm(fm2, (pl, data) => {
            if (data == null) return pl.tell(info + CachePool.lang("gui.exit"));
            if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
            delete pldata[lst[id]];
            homeStore.set(pl.realName, pldata);
            pl.sendText(info + "删除家 " + lst[id] + " 成功！");
        });
    });
}

// ─────────────────────────────────────────────────────────
// 添加家
// ─────────────────────────────────────────────────────────

function AddHome(plname) {
    const pl = mc.getPlayer(plname);
    if (!pl) return;
    const homeConf  = CachePool.conf("Home");
    const cost      = homeConf.add;
    const HomeCount = homeConf.MaxHome;
    const coinName  = economyCfg.coinName;

    const pldata = homeStore.get(pl.realName) || {};
    if (Object.keys(pldata).length >= HomeCount)
        return pl.sendText(info + "您的家数量已达到上限值:" + HomeCount + "!");

    const fm = mc.newCustomForm();
    fm.setTitle(CachePool.lang("home.add"));
    fm.addLabel("当前坐标：" + String(pl.pos));
    fm.addLabel("您的" + coinName + "：" + String(Economy.get(pl)));
    fm.addLabel("添加花费：" + String(cost) + coinName);
    fm.addInput(CachePool.lang("home.add.input"), "home1", "home1", lang.get("home.add.input.tip") || ""); // data[3]
    fm.addSwitch("设置为公共家（其他玩家可传送至此）", false);                                          // data[4]

    pl.sendForm(fm, (pl, data) => {
        if (data == null) return pl.runcmd("home");
        if (data[3] == "" || !data[3]) return pl.tell(info + CachePool.lang("home.name.noinput"));
        const pldata2 = homeStore.get(pl.realName) || {};
        if (Object.keys(pldata2).includes(data[3])) return pl.tell(info + CachePool.lang("home.name.repetitive"));
        if (!EconomyManager.checkAndReduce(pl.realName, cost)) return showInsufficientMoneyGui(pl, cost, "home");
        pldata2[data[3]] = {
            x:       JSON.parse(pl.pos.x).toFixed(1),
            y:       JSON.parse(pl.pos.y).toFixed(1),
            z:       JSON.parse(pl.pos.z).toFixed(1),
            dimid:   JSON.parse(pl.pos.dimid),
            isPublic: data[4]
        };
        homeStore.set(pl.realName, pldata2);
        const pubMsg = data[4] ? " §a(已设为公共家，其他玩家可传送)" : "";
        pl.sendText(info + "添加家：" + data[3] + " 成功！" + pubMsg);
    });
}
