/**
 * YEssential - 插件信息（PluginInfo）模块（已修改）
 * 功能：/il 指令 → SimpleForm GUI 展示版本、作者、模块状态，并提供更新检查入口
 *
 * 依赖全局变量（由主文件提供）：
 *   conf, lang, info, version, PluginInfo, NAME, regversion,
 *   mc, logger, file, network, randomGradientLog
 */

module.exports = {
    init: function () {
        _registerYestCmd();
    }
};

// ─────────────────────────────────────────────────────────
// 指令注册
// ─────────────────────────────────────────────────────────

function _registerYestCmd() {
    const cmd = mc.newCommand("il", "YEssential 插件信息", PermType.Any);
    cmd.overload([]);
    cmd.setCallback((_cmd, ori, _out, _res) => {
        const pl = ori.player;
        if (!pl) {
            randomGradientLog(`版本: ${version}  作者: Nico6719  协议: AGPL-3.0`);
            return;
        }

        _showMainGui(pl);
    });
    cmd.setup();
}

// ─────────────────────────────────────────────────────────
// 主 GUI
// ─────────────────────────────────────────────────────────

function _showMainGui(pl) {
    if (!pl.isOP()) {
        pl.tell(info + "§c仅管理员可查看插件配置。");
        return;
    }
    const fm = mc.newSimpleForm();
    fm.setTitle(info+"§l插件信息");
    fm.setContent(
        "§l插件名称：§r§e" + NAME + "§r\n" +
        "§l插件版本：§r§a" + version + "§r\n" +
        "§l插件描述：§r" + PluginInfo + "§r\n" +
        "§l插件作者：§r§bNico6719  \n" +
        "§l开源协议：§r§dAGPL-3.0§r\n" +
        "§l作者QQ：§r§71584573887§r"
    );
    fm.addButton("§l模块列表",  "textures/ui/icon_recipe_nature");
    fm.addButton("§l检查更新",  "textures/ui/refresh_light");
    fm.addButton("§l配置概览",  "textures/ui/settings_pause_menu_icon");
    fm.addButton("§l关闭",      "textures/ui/cancel");
    
    pl.sendForm(fm, (pl, id) => {
        if (id == null || id === 3) return;
        switch (id) {
            case 0: _showModuleListGui(pl); break;
            case 1: _checkUpdate(pl);       break;
            case 2: _showConfigGui(pl);     break;
        }
    });
}

// ─────────────────────────────────────────────────────────
// 模块列表 GUI
// ─────────────────────────────────────────────────────────

function _showModuleListGui(pl) {
    const moduleListPath = pluginpath + "modules/modulelist.json";
    let modules = [];
    try {
        const raw = file.readFrom(moduleListPath);
        if (raw) modules = JSON.parse(raw).modules || [];
    } catch (e) {
        pl.tell(info + "§c读取模块列表失败：" + e.message);
        return;
    }

    const fm = mc.newSimpleForm();
    fm.setTitle(info+"§r§l模块列表");
    fm.setContent("§7共加载 §e" + modules.length + " §7个模块");
    modules.forEach(m => {
        fm.addButton("§e" + m.name + "§r\n" + m.path, "textures/ui/icon_recipe_equipment");
    });

    pl.sendForm(fm, (pl, _id) => {
        _showMainGui(pl);
    });
}

// ─────────────────────────────────────────────────────────
// 检查更新
// ─────────────────────────────────────────────────────────

async function _checkUpdate(pl) {
    if (!pl || !pl.isOP()) return;
    const xuid = pl.xuid;
    pl.tell(info + "§e正在检查更新，请稍候...");
    try {
        const updater = globalThis.AsyncUpdateChecker;
        if (!updater || typeof updater.fetchRemoteVersion !== "function" ||
            typeof updater.compareVersions !== "function" || typeof updater.checkForUpdates !== "function") {
            throw new Error("更新模块未加载");
        }
        // 复用更新模块的地址配置、超时处理和安装校验流程。
        const remoteVer = await updater.fetchRemoteVersion();
        if (!remoteVer || !remoteVer.version) throw new Error("版本信息缺少 version 字段");
        const remoteStr = String(remoteVer.version);
        const comparison = updater.compareVersions(remoteStr, version);
        const hasUpdate = comparison > 0;
        const online = mc.getPlayer(xuid);
        if (!online || !online.isOP()) return;

        const fm = mc.newSimpleForm();
        fm.setTitle(info + "§r§l更新检查");
        fm.setContent(
            "§l当前版本：§r§e" + version + "§r\n" +
            "§l最新版本：§r§a" + remoteStr + "§r\n\n" +
            (hasUpdate ? "§c检测到新版本，点击更新按钮即可更新！" :
                comparison < 0 ? "§a本地版本高于远程版本，无需更新。" : "§a当前已是最新版本，无需更新。")
        );
        if (hasUpdate) fm.addButton("§l更新", "textures/ui/new_offer_symbol");
        fm.addButton("§l返回", "textures/ui/cancel");
        online.sendForm(fm, async (player, id) => {
            if (!player || id == null || !player.isOP()) return;
            if (!hasUpdate || id === 1) return _showMainGui(player);
            if (id !== 0) return;
            player.tell(info + "§e已开始检查并更新，进度请查看服务器控制台。");
            try {
                await updater.checkForUpdates(version);
            } catch (e) {
                const current = mc.getPlayer(xuid);
                if (current) current.tell(info + "§c更新异常：" + e.message);
            }
        });
    } catch (e) {
        const current = mc.getPlayer(xuid);
        if (current) current.tell(info + "§c检查更新异常：" + e.message);
    }
}

// ─────────────────────────────────────────────────────────
// 配置概览 GUI（仅 OP）
// ─────────────────────────────────────────────────────────

function _showConfigGui(pl) {
    if (!pl.isOP()) {
        pl.tell(info + "§c仅管理员可查看插件配置。");
        return;
    }

    const sections = [
        ["Home",      "家园系统"],
        ["Warp",      "公共传送"],
        ["tpa",       "TPA传送"],
        ["PVP",       "PVP开关"],
        ["Notice",    "公告系统"],
        ["Sign",      "签到系统"],
        ["Redpacket", "红包系统"],
        ["Cleanmgr",  "实体清理"],
    ];

    let content = "";
    sections.forEach(([key, label]) => {
        const cfg     = CachePool.conf(key);
        const enabled = cfg ? (cfg.EnabledModule !== undefined ? cfg.EnabledModule : cfg.EnableModule) : undefined;
        const tag     = enabled === true  ? "§a[启用]§r" :
                        enabled === false ? "§c[禁用]§r" : "§7[未配置]§r";
        content += tag + " §l" + label + "§r\n";
    });

    const fm = mc.newSimpleForm();
    fm.setTitle("§l§d[-YEST-] §r§l配置概览");
    fm.setContent(content.trim());
    fm.addButton("§l返回", "textures/ui/cancel");
    pl.sendForm(fm, (pl, _id) => { _showMainGui(pl); });
}
