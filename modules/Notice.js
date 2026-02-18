/**
 * YEssential - 公告（Notice）模块
 * 功能：/notice 查看公告、/noticeset 编辑公告、玩家进服自动弹出
 *
 * 依赖全局变量（由主文件提供）：
 *   conf, lang, info, datapath, noticeconf, mc, file, File, logger,
 *   randomGradientLog
 */

// 注意：路径常量不能在模块顶层用 datapath 拼接（require 时 datapath 尚未注入 globalThis）
// 改为在 init() 后通过函数延迟求值
const NOTICE_DIR  = "./plugins/YEssential/data/NoticeSettingsData/";
const NOTICE_FILE = NOTICE_DIR + "notice.txt";
const NOTICE_BAK  = NOTICE_DIR + "notice.txt.bak";
// _getNoticeSettingFile() 延迟到函数内获取，确保 datapath 已由 globalThis 注入

function _getNoticeSettingFile() {
    return datapath + "/NoticeSettingsData/playersettingdata.json";
}

module.exports = {
    init: function () {
        initNoticeModule();
    }
};

function initNoticeModule() {
    // ── 检查启动时公告是否有更新标记 ─────────────────────
    _checkNoticeUpdateFlag();

    // ── 注册 /notice 命令（玩家查看公告）────────────────
    _registerNoticeCmd();

    // ── 注册 /noticeset 命令（OP 编辑公告）──────────────
    _registerNoticeSetCmd();

    // ── 监听玩家进服，自动弹出公告 ───────────────────────
    _registerJoinListener();
}

// ─────────────────────────────────────────────────────────
// 内部函数
// ─────────────────────────────────────────────────────────

/** 启动时若 IsUpdate == 1，清空玩家阅读记录并重置标记 */
function _checkNoticeUpdateFlag() {
    const noticeCfg = conf.get("Notice");
    if (!noticeCfg || noticeCfg.IsUpdate != 1) return;

    File.delete(_getNoticeSettingFile());
    randomGradientLog(lang.get("notice.is.changed"));
    noticeCfg.IsUpdate = false;
    conf.set("Notice", noticeCfg);
}

/** /notice —— 玩家查看公告 */
function _registerNoticeCmd() {
    const cmd = mc.newCommand("notice", "公告", PermType.Any);
    cmd.overload([]);

    cmd.setCallback((_cmd, ori, _out, _res) => {
        const pl = ori.player;
        if (!pl) return;

        if (!conf.get("Notice").EnableModule) {
            pl.tell(info + lang.get("module.no.Enabled"));
            return;
        }

        // 初始化玩家偏好（默认 0 = 每次进服都弹）
        noticeconf.init(String(pl.realName), 0);

        // 若公告文件不存在，自动创建
        if (!file.exists(NOTICE_FILE)) {
            file.writeTo(NOTICE_FILE, " 这是一个公告");
        }

        const rawContent = file.readFrom(NOTICE_FILE) || "暂无公告";
        const lines = rawContent.split("\n");

        const fm = mc.newCustomForm()
            .setTitle(info + lang.get("notice.for.server"));

        lines.forEach(line => {
            if (line.trim() !== "") fm.addLabel(line);
        });

        fm.addSwitch(
            lang.get("notice.dont.showagain"),
            noticeconf.get(String(pl.realName)) != 0
        );

        pl.sendForm(fm, (plr, data) => {
            if (data == null) return;
            noticeconf.set(
                String(plr.realName),
                data[data.length - 1] == 1 ? 1 : 0
            );
        });
    });

    cmd.setup();
}

/** /noticeset —— OP 多行编辑公告 */
function _registerNoticeSetCmd() {
    const noticeSetCmd = mc.newCommand("noticeset", "编辑公告内容", PermType.GameMasters);
    noticeSetCmd.overload([]);

    noticeSetCmd.setCallback((_cmd, ori, output) => {
        const pl = ori.player;
        if (!pl) return;

        if (!conf.get("Notice").EnableModule) {
            pl.tell(info + lang.get("module.no.Enabled"));
            return;
        }
        if (!pl.isOP()) {
            output.error(info + lang.get("player.not.op"));
            return;
        }

        const currentNotice = file.exists(NOTICE_FILE)
            ? (file.readFrom(NOTICE_FILE) || "")
            : "";

        // 递归多行编辑表单
        const sendNoticeForm = (player, lines) => {
            const form = mc.newCustomForm()
                .setTitle(info + lang.get("notice.editor"));

            lines.forEach((line, index) => {
                form.addInput(`§a行 ${index + 1}`, "", line || "");
            });

            form.addStepSlider("操作", ["完成编辑", "添加新行", "删除最后一行"], 0);

            player.sendForm(form, (plr, data) => {
                if (data === null || data === undefined) {
                    plr.tell(info + lang.get("notice.exit.edit"));
                    return;
                }

                const action       = data.pop();
                const contentLines = data.map(val => val || "");

                switch (action) {
                    case 0: { // 完成编辑
                        const newContent = contentLines.join("\n");
                        if (newContent === currentNotice) {
                            plr.tell(info + lang.get("notice.no.change"));
                            return;
                        }
                        // 备份旧公告
                        try {
                            if (file.exists(NOTICE_FILE)) {
                                if (file.exists(NOTICE_BAK)) file.delete(NOTICE_BAK);
                                file.rename(NOTICE_FILE, NOTICE_BAK);
                                plr.tell(info + lang.get("notice.backupto"));
                            }
                        } catch (e) {
                            plr.tell(info + "§c备份失败: " + e);
                        }
                        // 保存新公告并重置阅读记录
                        file.writeTo(NOTICE_FILE, newContent);
                        plr.tell(info + lang.get("notice.save.ok"));
                        File.delete(_getNoticeSettingFile());
                        randomGradientLog(lang.get("notice.is.changed"));
                        // 重置更新标记
                        const noticeObj = conf.get("Notice");
                        noticeObj.IsUpdate = false;
                        conf.set("Notice", noticeObj);
                        break;
                    }
                    case 1: // 添加新行
                        contentLines.push("");
                        sendNoticeForm(plr, contentLines);
                        break;

                    case 2: // 删除最后一行
                        if (contentLines.length > 1) {
                            contentLines.pop();
                            sendNoticeForm(plr, contentLines);
                        } else {
                            plr.tell(info + lang.get("notice.cannot.del"));
                            sendNoticeForm(plr, contentLines);
                        }
                        break;
                }
            });
        };

        sendNoticeForm(pl, currentNotice.split("\n"));
    });

    noticeSetCmd.setup();
}

/** 监听 onJoin，自动弹出公告 */
function _registerJoinListener() {
    mc.listen("onJoin", (pl) => {
        const noticeCfg = conf.get("Notice");
        if (!noticeCfg || !noticeCfg.EnableModule) return;
        if (!noticeCfg.Join_ShowNotice) return;

        setTimeout(() => {
            if (!mc.getPlayer(pl.realName)) return;
            if (noticeconf.get(String(pl.realName)) == 1) return;
            pl.runcmd("notice");
        }, 1000);
    });
}
