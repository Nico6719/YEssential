// LiteLoader-AIDS automatic generated
// v2.8.1 - 修复钟表无反应：事件名错误/平台过滤/mode死代码/孤立字符

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
const menuPendingThisTick = new Set();

// ==================== 配置管理器 ====================
class MenuConfigManager {
    constructor() {
        this.ensureDirectory();
        this.configFile = new JsonConfigFile(MENU_CONFIG.configPath, "{}");
        // 模块缓存，TTL 3000ms
        this._cache = (globalThis.CachePool
            ? globalThis.CachePool.createModuleCache(3000)
            : null);
        this._CACHE_KEY = "cd_menu_cfg";
    }

    ensureDirectory() {
        const dataDir  = "./plugins/YEssential/data/";
        const menusDir = MENU_CONFIG.menusPath;
        if (!File.exists(dataDir))  File.createDir(dataDir);
        if (!File.exists(menusDir)) File.createDir(menusDir);
    }

    get() {
        // 优先走缓存
        if (this._cache) {
            let v = this._cache.get(this._CACHE_KEY);
            if (v !== undefined) return v;
        }
        // 缓存 miss：读磁盘
        this.configFile.reload();
        const content = this.configFile.read();
        const result = content ? JSON.parse(content) : {};
        if (this._cache) this._cache.set(this._CACHE_KEY, result);
        return result;
    }

    set(data) {
        Object.keys(data).forEach(key => this.configFile.set(key, data[key]));
        // 写入后立即失效缓存，保证下次读取是最新值
        if (this._cache) this._cache.invalidate(this._CACHE_KEY);
    }

    getMoney()            { return this.get().money; }
    getScore()            { return this.get().score; }
    getItems()            { return this.get().items || []; }
    getMain()             { return this.get().main; }
    getShield()           { return this.get().shield || []; }
    getItemsTriggerMode() { return this.get().itemsTriggerMode; }
    getUseDogeUI()        { return this.get().UseDogeUI === 1; }

    validate() {
        const cur = this.get();
        const defaults = {
            money: 0, score: "money",
            items: ["minecraft:clock"],
            itemsTriggerMode: 0, main: "main", shield: [],
            UseDogeUI: 0
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
        if (![0, 1].includes(cur.UseDogeUI))           patch.UseDogeUI = defaults.UseDogeUI;
        if (Object.keys(patch).length > 0) this.set(patch);
    }
}

// ==================== 工具函数 ====================
class MenuUtils {
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

    static removeOrphanButtons(deletedFileName) {
        var target = deletedFileName.replace(".json", "");
        if (!File.exists(MENU_CONFIG.menusPath)) return;
        var files = File.getFilesList(MENU_CONFIG.menusPath);
        files.forEach(function(f) {
            var menuData = MenuDataManager.getMenu(f);
            if (!menuData || !menuData.buttons) return;
            var before = menuData.buttons.length;
            menuData.buttons = menuData.buttons.filter(function(btn) {
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
            if (button.type === "vipfm" || button.type === "vipcm") return false;
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
        // DogeUI 判断：UseDogeUI=1 且当前是主菜单时，使用 /D 前缀格式由客户端渲染广告图
        if (menuConfig.getUseDogeUI() && fileName === menuConfig.getMain()) {
            form.setTitle("/D textures/menu/ad/1");
        } else {
            form.setTitle(menuData.title);
        }
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
        if (!player.isOP()) {
            this.showMenu(player, currentMenu);
            player.tell(info + "权限不足", 5);
            return;
        }
        this.showMenu(player, button.command);
    }

    static handleOpCommand(player, button, currentMenu) {
        if (!player.isOP()) {
            this.showMenu(player, currentMenu);
            player.tell(info + "权限不足", 5);
            return;
        }
        this.executeCommand(player, button.command);
    }

    static executeCommand(player, command) {
        mc.runcmdEx("execute as \"" + player.realName + "\" run " + command);
    }
}

// ==================== 实例初始化 ====================
const menuConfig = new MenuConfigManager();
menuConfig.validate();
MenuDataManager.initializeAdminMenu();

// ==================== 指令注册 ====================
function registerCommands() {
    const cdCmd = mc.newCommand("cd", "菜单系统", PermType.Any);
    cdCmd.setAlias("menu");
    cdCmd.overload([]);
    cdCmd.overload(["set"]);
    cdCmd.overload(["add", "string"]);
    cdCmd.overload(["del", "string"]);
    cdCmd.overload(["open", "string"]);
    
    cdCmd.setCallback((cmd, ori, out, res) => {
        const pl = ori.player;
        if (!pl) return;
        
        const action = res.action || "";
        const target = res.string || "";
        
        switch (action) {
            case "set":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showSettings(pl);
                break;
            case "add":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showAddMenu(pl, target);
                break;
            case "del":
                if (!pl.isOP()) return pl.tell(info + "权限不足");
                MenuAdminHandler.showDeleteMenu(pl, target);
                break;
            case "open":
                MenuPlayerHandler.showMenu(pl, target);
                break;
            default:
                MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
                break;
        }
    });
    cdCmd.setup();
}

// ==================== 事件监听 ====================
function registerEvents() {
    mc.listen("onUseItemOn", (pl, item) => {
        if (menuPendingThisTick.has(pl.xuid)) return;
        const triggerMode = menuConfig.getItemsTriggerMode();
        if (triggerMode !== 0 && triggerMode !== 2) return;
        
        const items = menuConfig.getItems();
        if (items.includes(item.type)) {
            menuPendingThisTick.add(pl.xuid);
            MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
            setTimeout(() => menuPendingThisTick.delete(pl.xuid), 50);
        }
    });

    mc.listen("onUseItem", (pl, item) => {
        if (menuPendingThisTick.has(pl.xuid)) return;
        const triggerMode = menuConfig.getItemsTriggerMode();
        if (triggerMode !== 1 && triggerMode !== 2) return;
        
        const items = menuConfig.getItems();
        if (items.includes(item.type)) {
            menuPendingThisTick.add(pl.xuid);
            MenuPlayerHandler.showMenu(pl, menuConfig.getMain());
            setTimeout(() => menuPendingThisTick.delete(pl.xuid), 50);
        }
    });
}

// ==================== 模块导出 ====================
module.exports = {
    init: function() {
        registerCommands();
        registerEvents();
    }
};
