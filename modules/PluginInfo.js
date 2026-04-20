/**
 * YEssential - 插件信息（PluginInfo）模块  v2.11.4
 * 功能：/yest 指令 → SimpleForm GUI 展示版本、作者、模块状态，并提供更新检查入口
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
    const moduleListPath = "./plugins/YEssential/modules/modulelist.json";
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

function _checkUpdate(pl) {
    pl.tell(info + "§e正在检查更新，请稍候...");

    // 优先复用 AsyncUpdateChecker 模块
    if (globalThis.AsyncUpdateChecker && typeof globalThis.AsyncUpdateChecker.checkForUpdates === "function") {
        globalThis.AsyncUpdateChecker.checkForUpdates(version).catch(e => {
            pl.tell(info + "§c检查更新失败：" + e.message);
        });
        return;
    }

    // 降级：直接 HTTP 请求
    try {
        network.httpGet("https://dl.mcmcc.cc/file/Version.json", (status, result) => {
            if (status !== 200) {
                pl.tell(info + "§c请求失败，状态码：" + status);
                return;
            }
            let remoteVer;
            try { remoteVer = JSON.parse(result); } catch (e) {
                pl.tell(info + "§c解析版本信息失败");
                return;
            }
            const remoteStr = remoteVer.version || remoteVer.Version || "未知";
            const isLatest  = remoteStr === version;

            const fm = mc.newSimpleForm();
            fm.setTitle("§l§d[-YEST-] §r§l更新检查");
            fm.setContent(
                "§l当前版本：§r§e" + version + "§r\n" +
                "§l最新版本：§r§a" + remoteStr + "§r\n\n" +
                (isLatest ? "§a当前已是最新版本，无需更新。" : "§c检测到新版本，请前往发布页下载更新！")
            );
            fm.addButton("§l返回", "textures/ui/cancel");
            pl.sendForm(fm, (pl, _id) => { _showMainGui(pl); });
        });
    } catch (e) {
        pl.tell(info + "§c检查更新异常：" + e.message);
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
        const cfg     = conf.get(key);
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
