// LiteLoader-AIDS automatic generated
// v2.8.0 - 移除VIP功能；修复孤儿按钮泄漏；修复other-settings表单索引bug；
//          修复冷却内存泄漏；修复文件名校验过严；移除死代码；
//          修正getclock使用正确的giveItem API

// ==================== 常量定义 ====================
const info = globalThis.info || "§l§6[-YEST-] §r";
const MENU_CONFIG = {
    configPath: "./plugins/YEssential/Config/Cd/Config.json",
    menusPath:  "./plugins/YEssential/data/Menus/",
    prefix:     "§e§l[菜单] §r",
    mobileOS:   ["Android", "iOS"]
};

// ==================== 全局状态 ====================
const clickCooldown = {};
// 同步锁：同一 tick 内阻止重复触发（onUseItem 与 onUseItemOn 会在同一毫秒同时派发）
const menuPendingThisTick = new Set();

// ==================== 配置管理器 ====================
class MenuConfigManager {
    constructor() {
        this.ensureDirectory();
        this.configFile = new JsonConfigFile(MENU_CONFIG.configPath, "{}");
    }

    ensureDirectory() {
        const dataDir  = "./plugins/YEssential/data/";
        const menusDir = MENU_CONFIG.menusPath;
        if (!File.exists(dataDir))  File.createDir(dataDir);
        if (!File.exists(menusDir)) File.createDir(menusDir);
    }

    get() {
        this.configFile.reload();
        const content = this.configFile.read();
        return content ? JSON.parse(content) : {};
    }

    set(data) {
        Object.keys(data).forEach(key => this.configFile.set(key, data[key]));
    }

    getMoney()            { return this.get().money; }
    getScore()            { return this.get().score; }
    getItems()            { return this.get().items || []; }
    getMain()             { return this.get().main; }
    getShield()           { return this.get().shield || []; }
    getItemsTriggerMode() { return this.get().itemsTriggerMode; }

    validate() {
        const cur = this.get();
        const defaults = {
            money: 0, score: "money",
            items: ["minecraft:clock"],
            itemsTriggerMode: 0, main: "main", shield: []
        };
        const patch = {};
        if (![0, 1].includes(cur.money))               patch.money = defaults.money;
        if (![0, 1, 2].includes(cur.itemsTriggerMode)) patch.itemsTriggerMode = defaults.itemsTriggerMode;
        if (typeof cur.score !== "string")             patch.score = defaults.score;
        if (typeof cur.main  !== "string")             patch.main  = defaults.main;
        if (!(cur.items instanceof Array) || !cur.items.every(i => typeof i === "string"))
            patch.items = defaults.items;
        if (!(cur.shield instanceof Array) || !cur.shield.every(i => typeof i === "string"))
            patch.shield = defaults.shield;
        if (Object.keys(patch).length > 0) this.set(patch);
    }
}

// ==================== 工具函数 ====================
class MenuUtils {
    // 修复bug：原版 /^[A-Za-z]+$/ 不允许数字，改为允许字母+数字
    static isValidFileName(str) {
        return /^[A-Za-z0-9]+$/.test(str) && str.length >= 1 && str.length <= 20;
    }

    static getMenuFiles(excludeMain) {
        if (!File.exists(MENU_CONFIG.menusPath)) return [];
        let files = File.getFilesList(MENU_CONFIG.menusPath);
        if (excludeMain === true) {
            const mainFile = menuConfig.getMain() + ".json";
            files = files.filter(f => f !== mainFile);
        }
        return files;
    }
}

// ==================== 经济系统 ====================
class MenuEconomyManager {
    static get(player) {
        if (!menuConfig.getMoney()) return Number(player.getScore(menuConfig.getScore()));
        if (typeof money !== "undefined") return Number(money.get(player.xuid));
        return 0;
    }

    static add(player, amount) {
        if (!menuConfig.getMoney()) return player.addScore(menuConfig.getScore(), Number(amount));
        if (typeof money !== "undefined") return money.add(player.xuid, Number(amount));
        return false;
    }

    static reduce(player, amount) {
        if (!menuConfig.getMoney()) return player.reduceScore(menuConfig.getScore(), Number(amount));
        if (typeof money !== "undefined") return money.reduce(player.xuid, Number(amount));
        return false;
    }
}

// ==================== 菜单数据管理器 ====================
class MenuDataManager {
    static getDefaultMainMenu() {
        return {
            title: "服务器菜单", content: "选择:",
            buttons: [
                { images: true,  image: "textures/items/apple", money: 0, text: "获取一个苹果", command: "give @s apple", type: "comm" },
                { images: false, image: "textures/items/apple", money: 0, text: "发送一句你好",  command: "msg @a 你好",   type: "comm" },
                { images: false, image: "textures/items/apple", money: 0, text: "管理员菜单",   command: "admin",        type: "form", oplist: [] }
            ]
        };
    }

    static getDefaultAdminMenu() {
        return {
            title: "管理员菜单", content: "选择:",
            buttons: [
                { images: false, image: "textures/items/apple", money: 0, text: "菜单设置", command: "cd set", type: "comm", oplist: [] },
                { images: false, image: "textures/items/apple", money: 0, text: "返回",     command: "main",   type: "form", oplist: [] }
            ]
        };
    }

    static getDefaultSubMenu() {
        return {
            title: "初始菜单", content: "选择:",
            buttons: [{ images: true, image: "textures/items/apple", money: 0, text: "返回", command: "main", type: "form" }]
        };
    }

    static getMenu(fileName) {
        if (!fileName.includes(".json")) fileName += ".json";
        var menuFile = new JsonConfigFile(
            MENU_CONFIG.menusPath + fileName,
            JSON.stringify(this.getDefaultSubMenu())
        );
        return JSON.parse(menuFile.read());
    }

    static setMenu(fileName, data) {
        if (!fileName.includes(".json")) fileName += ".json";
        var menuFile = new JsonConfigFile(MENU_CONFIG.menusPath + fileName);
        Object.keys(data).forEach(key => menuFile.set(key, data[key]));
    }

    static deleteMenu(fileName) {
        if (!fileName.includes(".json")) fileName += ".json";
        if (File.exists(MENU_CONFIG.menusPath + fileName))
            File.delete(MENU_CONFIG.menusPath + fileName);
    }

    // 修复bug：删除子菜单后，清理其他所有菜单里指向该文件的孤儿按钮
    static removeOrphanButtons(deletedFileName) {
        var target = deletedFileName.replace(".json", "");
        if (!File.exists(MENU_CONFIG.menusPath)) return;
        var files = File.getFilesList(MENU_CONFIG.menusPath);
        files.forEach(function(f) {
            var menuData = MenuDataManager.getMenu(f);
            if (!menuData || !menuData.buttons) return;
            var before = menuData.buttons.length;
            menuData.buttons = menuData.buttons.filter(function(btn) {
                // 只清理 form/opfm 类型中 command 指向被删文件的按钮
                return !((btn.type === "form" || btn.type === "opfm") && btn.command === target);
            });
            if (menuData.buttons.length !== before) {
                File.writeTo(MENU_CONFIG.menusPath + f, JSON.stringify(menuData, null, 4));
            }
        });
    }

    static addButton(fileName, button, index) {
        if (!fileName.includes(".json")) fileName += ".json";
        var menuData = this.getMenu(fileName);
        if (index == null || index === "") menuData.buttons.push(button);
        else menuData.buttons.splice(index, 0, button);
        File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
    }

    static deleteButton(fileName, buttonIndex) {
        if (!fileName.includes(".json")) fileName += ".json";
        var menuData = this.getMenu(fileName);
        if (buttonIndex >= 0 && buttonIndex < menuData.buttons.length) {
            menuData.buttons.splice(buttonIndex, 1);
            File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
            return true;
        }
        return false;
    }

    static updateButton(fileName, buttonIndex, newButton) {
        if (!fileName.includes(".json")) fileName += ".json";
        var menuData = this.getMenu(fileName);
        if (buttonIndex >= 0 && buttonIndex < menuData.buttons.length) {
            menuData.buttons[buttonIndex] = newButton;
            File.writeTo(MENU_CONFIG.menusPath + fileName, JSON.stringify(menuData, null, 4));
            return true;
        }
        return false;
    }

    static filterButtonsForPlayer(player, menuData) {
        menuData.buttons = menuData.buttons.filter(function(button) {
            // 向后兼容：旧配置里的vipfm/vipcm按钮对所有人都隐藏
            if (button.type === "vipfm" || button.type === "vipcm") return false;
            // 非OP玩家不显示管理员按钮
            if (!player.isOP() && (button.type === "opfm" || button.type === "opcm")) return false;
            return true;
        });
        return menuData;
    }

    static initializeAdminMenu() {
        if (!File.exists(MENU_CONFIG.menusPath + "admin.json"))
            this.setMenu("admin", this.getDefaultAdminMenu());
    }
}

// ==================== 玩家菜单交互 ====================
class MenuPlayerHandler {
    static showMenu(player, fileName) {
        var menuData = MenuDataManager.getMenu(fileName);
        menuData = MenuDataManager.filterButtonsForPlayer(player, menuData);

        if (!menuData.title || !menuData.content || !menuData.buttons) {
            player.tell(info + "菜单配置错误", 5); return;
        }
        if (menuData.buttons.length === 0) {
            player.tell(info + "菜单按钮为空", 5); return;
        }

        var form = mc.newSimpleForm();
        form.setTitle(info + menuData.title);
        form.setContent(menuData.content);
        menuData.buttons.forEach(function(button) {
            form.addButton(button.text, button.images ? button.image : "");
        });

        var self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null) return;
            if (id >= 0 && id < menuData.buttons.length)
                self.handleButtonClick(player, menuData.buttons[id], fileName);
        });
    }

    static handleButtonClick(player, button, currentMenu) {
        var requiredMoney = Number(button.money);
        if (requiredMoney > 0 && MenuEconomyManager.get(player) < requiredMoney) {
            this.showMenu(player, currentMenu);
            player.tell(info + "金币不足", 5);
            return;
        }
        switch (button.type) {
            case "form": this.showMenu(player, button.command); break;
            case "opfm": this.handleOpForm(player, button, currentMenu); break;
            case "comm": this.executeCommand(player, button.command); break;
            case "opcm": this.handleOpCommand(player, button, currentMenu); break;
            default:
                this.showMenu(player, currentMenu);
                player.tell(info + "按钮类型错误", 5);
                return;
        }
        if (requiredMoney > 0) MenuEconomyManager.reduce(player, requiredMoney);
    }

    static handleOpForm(player, button, currentMenu) {
        var opList = button.oplist || [];
        if (!player.isOP() && opList.length > 0 && opList.indexOf(player.realName) === -1) {
            this.showMenu(player, currentMenu);
            player.tell(info + "此功能仅限管理员使用", 5);
            return;
        }
        this.showMenu(player, button.command);
    }

    static executeCommand(player, command) {
        if (command.includes("@s") && !player.isOP())
            mc.runcmdEx(command.replace("@s", player.realName));
        else
            player.runcmd("/" + command);
    }

    static handleOpCommand(player, button, currentMenu) {
        var opList = button.oplist || [];
        if (!player.isOP() && opList.length > 0 && opList.indexOf(player.realName) === -1) {
            this.showMenu(player, currentMenu);
            player.tell(info + "此功能仅限管理员使用", 5);
            return;
        }
        this.executeCommand(player, button.command);
    }
}

// ==================== 命令注册 ====================
class MenuCommandHandler {
    static register() {
        var commands = [
            { cmd: "menu", des: "menu", per: PermType.Any },
            { cmd: "cd",   des: "menu", per: PermType.Any }
        ];
        var self = this;
        commands.forEach(function(cmdInfo) {
            var cmd = mc.newCommand(cmdInfo.cmd, cmdInfo.des, cmdInfo.per);
            cmd.setAlias(cmdInfo.des);
            cmd.setEnum("menuset", ["set"]);
            cmd.optional("menuset", ParamType.Enum, "menuset", 1);
            cmd.overload(["menuset"]);
            cmd.setCallback(function(_cmd, ori, out, res) { self.callback(_cmd, ori, out, res); });
            cmd.setup();
        });
    }

    static callback(_cmd, ori, out, res) {
        if (!ori.player) {
            out.error(MENU_CONFIG.prefix + "§4请不要使用命令方块或控制台执行§f" + _cmd + "§4命令");
            return;
        }
        if (!res.menuset) {
            MenuPlayerHandler.showMenu(ori.player, menuConfig.getMain());
        } else if (res.menuset === "set") {
            if (!ori.player.isOP()) ori.player.tell(MENU_CONFIG.prefix + "你不是管理员!");
            else MenuAdminHandler.showMainSettings(ori.player);
        }
    }
}

// ==================== 获取钟表命令（独立，每人限领一次）====================
class GetClockCommandHandler {
    static get dataPath() {
        return "./plugins/YEssential/data/getclock_claimed.json";
    }

    // 兼容原格式：JSON 数组，每项为 xuid 字符串
    static loadClaimed() {
        if (!File.exists(this.dataPath)) {
            File.writeTo(this.dataPath, "[]");
            return [];
        }
        try {
            var parsed = JSON.parse(File.readFrom(this.dataPath));
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }

    static saveClaimed(list) {
        File.writeTo(this.dataPath, JSON.stringify(list));
    }

    static hasClaimed(xuid)  { return this.loadClaimed().indexOf(xuid) !== -1; }

    static markClaimed(xuid) {
        var list = this.loadClaimed();
        if (list.indexOf(xuid) === -1) { list.push(xuid); this.saveClaimed(list); }
    }

    static register() {
        var cmd = mc.newCommand("getclock", "获取钟表（每人限领一次）", PermType.Any);
        cmd.overload([]);
        cmd.setCallback(function(_cmd, ori, out, res) {
            if (!ori.player) { out.error("§c请不要使用命令方块或控制台执行此命令"); return; }
            var player = ori.player;
            if (GetClockCommandHandler.hasClaimed(player.xuid)) {
                player.tell(info + "§c你已经领取过钟表了");
                return;
            }
            var clockItem = mc.newItem("minecraft:clock", 1);
            if (!clockItem) { player.tell(info + "§c获取钟表失败"); return; }

            // 背包满时掉落到玩家脚下，否则直接给予
            if (!player.getInventory().hasRoomFor(clockItem)) {
                mc.spawnItem(clockItem, player.pos);
                player.tell(info + "§e已获得钟表（背包已满，已掉落在你脚下），此物品每人仅限领取一次");
            } else {
                player.giveItem(clockItem);
                player.refreshItems();
                player.tell(info + "§a已获得钟表，此物品每人仅限领取一次");
            }
            GetClockCommandHandler.markClaimed(player.xuid);
        });
        cmd.setup();
    }
}

// ==================== 管理员设置界面 ====================
class MenuAdminHandler {
    static showMainSettings(player) {
        var form = mc.newSimpleForm();
        form.setTitle(info + "菜单设置");
        form.setContent("选择:");
        form.addButton("经济设置");
        form.addButton("添加菜单");
        form.addButton("删除菜单");
        form.addButton("修改菜单");
        form.addButton("修改其他");
        var self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null) return;
            switch (id) {
                case 0: self.showMoneySettings(player); break;
                case 1: self.showAddMenu(player);       break;
                case 2: self.showDeleteMenu(player);    break;
                case 3: self.showEditMenu(player);      break;
                case 4: self.showOtherSettings(player); break;
            }
        });
    }

    static showMoneySettings(player, error, moneyType, scoreName) {
        var currentMoneyType = menuConfig.getMoney();
        var currentScore     = menuConfig.getScore();
        var form = mc.newCustomForm();
        form.setTitle("设置经济参数");
        // data[0]=dropdown, data[1]=input
        form.addDropdown("选择经济模式---当前: " + (currentMoneyType ? "LLMoney" : "计分板"),
            ["计分板", "LLMoney"], moneyType != null ? moneyType : currentMoneyType);
        form.addInput("输入计分板项--当前: " + currentScore, "例如: money",
            scoreName != null ? scoreName : "");
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showMainSettings(player); return; }
            var selectedMoneyType = data[0], inputScore = data[1];
            if (selectedMoneyType === currentMoneyType && inputScore === "") {
                self.showMoneySettings(player, "§l§c你好像什么都没有操作", selectedMoneyType, inputScore);
                return;
            }
            menuConfig.set({ money: selectedMoneyType });
            if (inputScore !== "") menuConfig.set({ score: inputScore });
            player.sendModalForm("§l§2修改成功", "已保存更改经济配置", "§1返回", "§1完成",
                function(pl, btnId) {
                    if (btnId === 0) self.showMainSettings(player);
                    else self.showMoneySettings(player, "§l§2已完成更改");
                });
        });
    }

    static showAddMenu(player, type) {
        if (!type) {
            var form = mc.newSimpleForm();
            form.setTitle("添加菜单");
            form.setContent("选择操作:");
            form.addButton("添加二级菜单");
            form.addButton("添加菜单按钮");
            form.addButton("返回上级");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showAddMenu(player, "add_menu");
                else if (id === 1) self.showAddMenu(player, "add_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }
        if (type === "add_menu")    this.showAddSubMenu(player);
        else if (type === "add_button") this.showAddButton(player);
    }

    static showAddSubMenu(player, error, formData) {
        formData = formData || {};
        var menuFiles   = MenuUtils.getMenuFiles();
        var fileOptions = menuFiles.map(f => MenuDataManager.getMenu(f).title + " | " + f);
        var form = mc.newCustomForm();
        form.setTitle("添加二级菜单");
        form.addDropdown("选择上级菜单", fileOptions, formData.parentIndex || 0);
        form.addInput("二级菜单文件名称", "例如: aaa 或 menu2", formData.fileName || "");
        form.addInput("二级菜单标题",     "例如: 二级菜单",      formData.title   || "");
        form.addInput("二级菜单提示",     "例如: 选择:",         formData.content || "");
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            var [parentIndex, fileName, title, content] = data;
            // 修复bug：文件名改为支持字母+数字
            if (!MenuUtils.isValidFileName(fileName)) {
                self.showAddSubMenu(player, "§l§c文件名称不合法（仅限英文字母和数字，1-20个字符）",
                    { parentIndex, fileName, title, content });
                return;
            }
            if (File.exists(MENU_CONFIG.menusPath + fileName + ".json")) {
                self.showAddSubMenu(player, "§l§c文件已存在", { parentIndex, fileName, title, content });
                return;
            }
            MenuDataManager.addButton(menuFiles[parentIndex], {
                images: true, image: "textures/items/apple", money: 0,
                text: title, command: fileName, type: "form"
            });
            MenuDataManager.setMenu(fileName, {
                title: title, content: content || "选择:",
                buttons: MenuDataManager.getDefaultSubMenu().buttons
            });
            self.showAddMenu(player, "add_menu");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showAddButton(player, error, formData) {
        formData = formData || {};
        var menuFiles = MenuUtils.getMenuFiles();
        if (menuFiles.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c没有可用的菜单文件");
            this.showAddMenu(player); return;
        }
        var fileOptions = menuFiles.map(f => MenuDataManager.getMenu(f).title + " | " + f);
        // 移除了VIP类型
        var buttonTypes = ["玩家二级菜单", "管理员二级菜单", "玩家执行指令", "管理员执行指令"];
        var form = mc.newCustomForm();
        form.setTitle("添加菜单按钮");
        form.addDropdown("选择菜单文件",          fileOptions,  formData.fileIndex   || 0);
        form.addDropdown("选择按钮类型",          buttonTypes,  formData.buttonType  || 0);
        form.addSwitch("是否开启按钮贴图",                      formData.enableImage || false);
        form.addInput("[选填]按钮贴图地址",  "textures/items/apple", formData.imagePath  || "");
        form.addInput("[必填]按钮标题",      "例如: 说你好",          formData.buttonText || "");
        form.addInput("[必填]按钮执行的结果","例如: say @a 你好",     formData.command    || "");
        form.addInput("[选填]按钮所需金币",  "例如: 999",             formData.money      || "");
        form.addInput("[选填]按钮位置(0为首)","例如: 0",              formData.position ?? "");
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            var [fileIndex, typeIndex, enableImage, imagePath, buttonText, command, money, position] = data;
            if (!buttonText || !command) {
                self.showAddButton(player, "§c标题和指令必填",
                    { fileIndex, buttonType: typeIndex, enableImage, imagePath, buttonText, command, money, position });
                return;
            }
            // typeMap 与 buttonTypes 对齐（已移除vipfm/vipcm）
            var typeMap   = ["form", "opfm", "comm", "opcm"];
            var newButton = {
                images: enableImage, image: enableImage ? (imagePath || "textures/items/apple") : "",
                money: parseInt(money) || 0, text: buttonText, command: command, type: typeMap[typeIndex]
            };
            if (typeMap[typeIndex].includes("op")) newButton.oplist = [];
            MenuDataManager.addButton(menuFiles[fileIndex], newButton,
                position !== "" ? parseInt(position) : null);
            self.showAddMenu(player, "add_button");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showDeleteMenu(player, type) {
        if (!type) {
            var form = mc.newSimpleForm();
            form.setTitle("删除菜单");
            form.setContent("选择操作:");
            form.addButton("删除二级菜单");
            form.addButton("删除菜单按钮");
            form.addButton("返回上级");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showDeleteMenu(player, "del_menu");
                else if (id === 1) self.showDeleteMenu(player, "del_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }

        if (type === "del_menu") {
            var files = MenuUtils.getMenuFiles(true);
            if (!files.length) {
                player.tell(MENU_CONFIG.prefix + "§c无可删除的菜单");
                this.showDeleteMenu(player); return;
            }
            var form = mc.newSimpleForm();
            form.setTitle("删除二级菜单");
            form.setContent("选择要删除的菜单:");
            files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
            form.addButton("§c返回上级");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null || id === files.length) { self.showDeleteMenu(player); return; }
                if (id >= 0 && id < files.length) {
                    var deleted = files[id];
                    MenuDataManager.deleteMenu(deleted);
                    // 修复bug：清理其他菜单里指向该文件的孤儿按钮
                    MenuDataManager.removeOrphanButtons(deleted);
                    player.tell(MENU_CONFIG.prefix + "§2删除成功: " + deleted);
                    self.showDeleteMenu(player, type);
                } else { self.showDeleteMenu(player); }
            });

        } else if (type === "del_button") {
            var files = MenuUtils.getMenuFiles();
            if (!files.length) {
                player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
                this.showDeleteMenu(player); return;
            }
            var form = mc.newSimpleForm();
            form.setTitle("删除菜单按钮");
            form.setContent("选择菜单:");
            files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
            form.addButton("§c返回上级");
            var self = this;
            player.sendForm(form, function(pl, fileId) {
                if (fileId == null || fileId === files.length) { self.showDeleteMenu(player); return; }
                if (fileId >= 0 && fileId < files.length) self.showDeleteButtonList(player, files[fileId]);
                else self.showDeleteMenu(player);
            });
        }
    }

    static showDeleteButtonList(player, fileName) {
        var menuData = MenuDataManager.getMenu(fileName);
        if (!menuData.buttons || menuData.buttons.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c该菜单没有按钮");
            this.showDeleteMenu(player, "del_button"); return;
        }
        var form = mc.newSimpleForm();
        form.setTitle("删除按钮 - " + menuData.title);
        form.setContent("选择要删除的按钮:");
        menuData.buttons.forEach(function(btn) {
            var t = btn.text + " [" + btn.type + "]";
            if (btn.money > 0) t += " (需" + btn.money + "金币)";
            form.addButton(t);
        });
        form.addButton("§c返回上级");
        var self = this;
        player.sendForm(form, function(pl, btnId) {
            if (btnId == null || btnId === menuData.buttons.length) {
                self.showDeleteMenu(player, "del_button"); return;
            }
            if (btnId >= 0 && btnId < menuData.buttons.length) {
                var deletedBtn = menuData.buttons[btnId];
                if (MenuDataManager.deleteButton(fileName, btnId))
                    player.tell(MENU_CONFIG.prefix + "§2删除成功: " + deletedBtn.text);
                else
                    player.tell(MENU_CONFIG.prefix + "§c删除失败");
                self.showDeleteButtonList(player, fileName);
            } else { self.showDeleteMenu(player, "del_button"); }
        });
    }

    static showEditMenu(player, type) {
        if (!type) {
            var form = mc.newSimpleForm();
            form.setTitle("修改菜单");
            form.setContent("选择操作:");
            form.addButton("修改菜单信息");
            form.addButton("修改菜单按钮");
            form.addButton("返回上级");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id == null) return;
                if (id === 0) self.showEditMenu(player, "edit_menu");
                else if (id === 1) self.showEditMenu(player, "edit_button");
                else if (id === 2) self.showMainSettings(player);
            });
            return;
        }
        if (type === "edit_menu")        this.showEditMenuInfo(player);
        else if (type === "edit_button") this.showEditButtonSelect(player);
    }

    static showEditMenuInfo(player) {
        var files = MenuUtils.getMenuFiles();
        if (!files.length) {
            player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
            this.showEditMenu(player); return;
        }
        var form = mc.newSimpleForm();
        form.setTitle("修改菜单信息");
        form.setContent("选择要修改的菜单:");
        files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
        form.addButton("§c返回上级");
        var self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null || id === files.length) { self.showEditMenu(player); return; }
            if (id >= 0 && id < files.length) self.showEditMenuInfoForm(player, files[id]);
            else self.showEditMenu(player);
        });
    }

    static showEditMenuInfoForm(player, fileName, error) {
        var menuData = MenuDataManager.getMenu(fileName);
        var form = mc.newCustomForm();
        form.setTitle("修改菜单: " + fileName);
        form.addInput("菜单标题", "当前: " + menuData.title,   menuData.title);
        form.addInput("菜单内容", "当前: " + menuData.content, menuData.content);
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showEditMenuInfo(player); return; }
            var [newTitle, newContent] = data;
            if (!newTitle || !newContent) {
                self.showEditMenuInfoForm(player, fileName, "§c标题和内容不能为空"); return;
            }
            menuData.title = newTitle; menuData.content = newContent;
            MenuDataManager.setMenu(fileName, menuData);
            player.tell(MENU_CONFIG.prefix + "§2修改成功");
            self.showEditMenuInfo(player);
        });
    }

    static showEditButtonSelect(player) {
        var files = MenuUtils.getMenuFiles();
        if (!files.length) {
            player.tell(MENU_CONFIG.prefix + "§c无可用的菜单");
            this.showEditMenu(player); return;
        }
        var form = mc.newSimpleForm();
        form.setTitle("修改菜单按钮");
        form.setContent("选择菜单:");
        files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
        form.addButton("§c返回上级");
        var self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null || id === files.length) { self.showEditMenu(player); return; }
            if (id >= 0 && id < files.length) self.showEditButtonList(player, files[id]);
            else self.showEditMenu(player);
        });
    }

    static showEditButtonList(player, fileName) {
        var menuData = MenuDataManager.getMenu(fileName);
        if (!menuData.buttons || menuData.buttons.length === 0) {
            player.tell(MENU_CONFIG.prefix + "§c该菜单没有按钮");
            this.showEditButtonSelect(player); return;
        }
        var form = mc.newSimpleForm();
        form.setTitle("修改按钮 - " + menuData.title);
        form.setContent("选择要修改的按钮:");
        menuData.buttons.forEach(btn => form.addButton(btn.text + " [" + btn.type + "]"));
        form.addButton("§c返回上级");
        var self = this;
        player.sendForm(form, function(pl, btnId) {
            if (btnId == null || btnId === menuData.buttons.length) {
                self.showEditButtonSelect(player); return;
            }
            if (btnId >= 0 && btnId < menuData.buttons.length)
                self.showEditButtonForm(player, fileName, btnId);
            else self.showEditButtonSelect(player);
        });
    }

    static showEditButtonForm(player, fileName, buttonIndex, error) {
        var menuData = MenuDataManager.getMenu(fileName);
        var button   = menuData.buttons[buttonIndex];

        // 移除了VIP类型，typeMap与UI对齐
        var typeMap     = ["form", "opfm", "comm", "opcm"];
        var buttonTypes = ["玩家二级菜单", "管理员二级菜单", "玩家执行指令", "管理员执行指令"];

        // 向后兼容：旧的vipfm/vipcm平滑迁移
        var rawType = button.type;
        if (rawType === "vipfm") rawType = "form";
        if (rawType === "vipcm") rawType = "comm";
        var currentTypeIndex = typeMap.indexOf(rawType);
        if (currentTypeIndex === -1) currentTypeIndex = 0;

        var form = mc.newCustomForm();
        form.setTitle("修改按钮: " + button.text);
        form.addDropdown("按钮类型",        buttonTypes, currentTypeIndex);
        form.addSwitch("是否开启按钮贴图",               button.images  || false);
        form.addInput("按钮贴图地址", "textures/items/apple", button.image   || "");
        form.addInput("按钮标题",     "例如: 说你好",           button.text);
        form.addInput("按钮执行的结果","例如: say @a 你好",     button.command);
        form.addInput("按钮所需金币", "例如: 999",              String(button.money || 0));
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showEditButtonList(player, fileName); return; }
            var [typeIndex, enableImage, imagePath, buttonText, command, money] = data;
            if (!buttonText || !command) {
                self.showEditButtonForm(player, fileName, buttonIndex, "§c标题和指令不能为空"); return;
            }
            var newButton = {
                images: enableImage, image: enableImage ? (imagePath || "textures/items/apple") : "",
                money: parseInt(money) || 0, text: buttonText, command: command, type: typeMap[typeIndex]
            };
            if (typeMap[typeIndex].includes("op")) newButton.oplist = button.oplist || [];
            if (MenuDataManager.updateButton(fileName, buttonIndex, newButton))
                player.tell(MENU_CONFIG.prefix + "§2修改成功");
            else
                player.tell(MENU_CONFIG.prefix + "§c修改失败");
            self.showEditButtonList(player, fileName);
        });
    }

    static showOtherSettings(player, error) {
        var files = MenuUtils.getMenuFiles();
        var form = mc.newCustomForm();
        form.setTitle("其他设置");
        // 修复bug：label不占data下标，所以dropdown在data[0]
        // 将当前主菜单名显示在标题里，省去了原来占位的addLabel
        form.addDropdown("主菜单文件（当前: " + menuConfig.getMain() + "）",
            ["不修改", ...files], 0);
        if (error) form.addLabel(error);
        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showMainSettings(player); return; }
            // data[0] = dropdown
            if (data[0] > 0) {
                menuConfig.set({ main: files[data[0] - 1].replace(".json", "") });
                self.showOtherSettings(player, "§2修改成功");
            } else {
                self.showOtherSettings(player, "§e未做任何修改");
            }
        });
    }
}

// ==================== 事件与初始化 ====================
class MenuEventListeners {
    static register() {
        this.initializeResources();
        const mode = menuConfig.getItemsTriggerMode();
        if (mode === 1)      { this.onUseItemOn(); }
        else  { this.onUseItemOn(); }
        this.onJoin();
        this.onLeft();
    }

    static initializeResources() {
        MenuCommandHandler.register();
        GetClockCommandHandler.register();
        MenuDataManager.initializeAdminMenu();
        menuConfig.validate();
        if (!File.exists(MENU_CONFIG.menusPath + "main.json"))
            MenuDataManager.setMenu("main", MenuDataManager.getDefaultMainMenu());
    }

    static onUseItemOn() {
        mc.listen("onUseItemOn", (player, item, block) => {
            const items = menuConfig.getItems();
            if (!items.includes(item.type)) return;
            const device = player.getDevice();
            if (!MENU_CONFIG.mobileOS.includes(device.os)) return;
            if (block.hasContainer()) return;
            if (clickCooldown[player.xuid]) return;
            if (menuPendingThisTick.has(player.xuid)) return;
            menuPendingThisTick.add(player.xuid);
            clickCooldown[player.xuid] = true;
            MenuPlayerHandler.showMenu(player, menuConfig.getMain());
            setTimeout(() => {
                clickCooldown[player.xuid] = false;
                menuPendingThisTick.delete(player.xuid);
            }, 1000);
        });
    }

    static onJoin() {
        mc.listen("onJoin", (player) => {
            MenuEconomyManager.add(player, 0);

            // 自动发钟：首次进服限领一次，背包满则掉落地上
            if (!GetClockCommandHandler.hasClaimed(player.xuid)) {
                var clockItem = mc.newItem("minecraft:clock", 1);
                if (clockItem) {
                    if (!player.getInventory().hasRoomFor(clockItem)) {
                        mc.spawnItem(clockItem, player.pos);
                        player.tell(info + "§e首次进服赠品：钟表已掉落在你脚下（背包已满），此物品每人仅限一次");
                    } else {
                        player.giveItem(clockItem);
                        player.refreshItems();
                        player.tell(info + "§a首次进服赠品：已获得钟表，此物品每人仅限一次");
                    }
                    GetClockCommandHandler.markClaimed(player.xuid);
                }
            }
        });
    }

    // 修复bug：玩家离线时清理冷却缓存，防止长期运行内存泄漏
    static onLeft() {
        mc.listen("onLeft", (player) => {
            delete clickCooldown[player.xuid];
        });
    }
}

// ==================== 模块导出与启动 ====================
const menuConfig = new MenuConfigManager();

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        MenuConfigManager, MenuEventListeners, MenuUtils,
        MenuEconomyManager, MenuDataManager, MenuPlayerHandler,
        MenuCommandHandler, MenuAdminHandler, GetClockCommandHandler
    };
}
