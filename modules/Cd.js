// LiteLoader-AIDS automatic generated
// v2.7.4 - 修复热重载无法注册指令的问题

// ==================== 常量定义 ====================
const info = "§l§6[-YEST-] §r";
const MENU_CONFIG = {
    configPath: "./plugins/YEssential/Config/Cd/Config.json",
    menusPath: "./plugins/YEssential/data/Menus/",
    prefix: "§e§l[菜单] §r",
    mobileOS: ["Android", "iOS"],
    shieldBlocks: [
        "minecraft:ender_chest", "minecraft:stonecutter_block", "minecraft:anvil",
        "minecraft:enchanting_table", "minecraft:loom", "minecraft:cake",
        "minecraft:frame", "minecraft:glow_frame", "minecraft:cartography_table",
        "minecraft:crafting_table", "minecraft:smithing_table", "minecraft:grindstone",
        "minecraft:noteblock", "minecraft:bell", "minecraft:beacon", "minecraft:bed",
        "minecraft:flower_pot", "minecraft:sweet_berry_bush", "minecraft:daylight_detector",
        "minecraft:command_block", "minecraft:jigsaw", "minecraft:structure_block"
    ]
};

// ==================== 全局状态 ====================
let interceptCommands = false;
const clickCooldown = {};

// ==================== 配置管理器 ====================
class MenuConfigManager {
    constructor() {
        this.ensureDirectory();
        this.configFile = new JsonConfigFile(MENU_CONFIG.configPath, "{}");
    }

    ensureDirectory() {
        const dataDir = "./plugins/YEssential/data/";
        const menusDir = MENU_CONFIG.menusPath;
        
        if (!File.exists(dataDir)) {
            File.createDir(dataDir);
        }
        if (!File.exists(menusDir)) {
            File.createDir(menusDir);
        }
    }

    get() {
        this.configFile.reload();
        const content = this.configFile.read();
        return content ? JSON.parse(content) : {};
    }

    set(data) {
        Object.keys(data).forEach(key => {
            this.configFile.set(key, data[key]);
        });
    }

    getVersion() { return this.get().version; }
    getMoney() { return this.get().money; }
    getScore() { return this.get().score; }
    getItem() { return this.get().item; }
    getMain() { return this.get().main; }
    getIntercept() { return this.get().intercept; }
    getShield() { return this.get().shield || []; }

    initialize() {
        this.set({
            money: 0,  //经济模式 0为计分板 1为LLMoney
            score: "money", //计分板名称
            item: "minecraft:clock", //菜单触发物品
            main: "main", //主菜单文件名
            shield: [] //屏蔽方块列表
        });
    }

    validate() {
        const currentConfig = this.get();
        if (!currentConfig.version) {
            this.initialize();
        }
    }
}

// ==================== 工具函数 ====================
class MenuUtils {
    static isEnglish(str) {
        return /^[A-Za-z]+$/.test(str);
    }

    static isChinese(str) {
        return /[\u4e00-\u9fff]/.test(str);
    }

    static getMenuFiles(excludeMain) {
        if (!File.exists(MENU_CONFIG.menusPath)) return [];
        let files = File.getFilesList(MENU_CONFIG.menusPath);
        if (excludeMain === true) {
            const mainFile = menuConfig.getMain() + ".json";
            files = files.filter(function(f) { return f !== mainFile; });
        }
        return files;
    }

    static filterValidItems(itemList) {
        return itemList.filter(function(item) {
            return item.type && 
                   item.type !== menuConfig.getItem() && 
                   item.type !== "" && 
                   item !== undefined;
        });
    }

    static getItemDisplayName(item) {
        if (item.type === "minecraft:name_tag") {
            return item.name + "---命名牌";
        }
        return item.name;
    }
}

// ==================== 经济系统 ====================
class MenuEconomyManager {
    static get(player) {
        if (!menuConfig.getMoney()) {
            return Number(player.getScore(menuConfig.getScore()));
        }
        if (typeof money !== 'undefined') {
            return Number(money.get(player.xuid));
        }
        return 0;
    }

    static add(player, amount) {
        if (!menuConfig.getMoney()) {
            return player.addScore(menuConfig.getScore(), Number(amount));
        }
        if (typeof money !== 'undefined') {
            return money.add(player.xuid, Number(amount));
        }
        return false;
    }

    static reduce(player, amount) {
        if (!menuConfig.getMoney()) {
            return player.reduceScore(menuConfig.getScore(), Number(amount));
        }
        if (typeof money !== 'undefined') {
            return money.reduce(player.xuid, Number(amount));
        }
        return false;
    }
}

// ==================== 菜单数据管理器 ====================
class MenuDataManager {
    static getDefaultMainMenu() {
        return {
            title: "服务器菜单",
            content: '选择:',
            buttons: [
                {
                    images: true,
                    image: "textures/items/apple",
                    money: 0,
                    text: "获取一个苹果",
                    command: "give @s apple",
                    type: "comm"
                },
                {
                    images: false,
                    image: "textures/items/apple",
                    money: 0,
                    text: "发送一句你好",
                    command: "msg @a 你好",
                    type: "comm"
                },
                {
                    images: false,
                    image: "textures/items/apple",
                    money: 0,
                    text: "管理员菜单",
                    command: "admin",
                    type: "form",
                    oplist: []
                }
            ]
        };
    }

    static getDefaultAdminMenu() {
        return {
            title: "管理员菜单",
            content: '选择:',
            buttons: [
                {
                    images: false,
                    image: "textures/items/apple",
                    money: 0,
                    text: "菜单设置",
                    command: "cd set",
                    type: "comm",
                    oplist: []
                },
                {
                    images: false,
                    image: "textures/items/apple",
                    money: 0,
                    text: "返回",
                    command: "main",
                    type: "form",
                    oplist: []
                }
            ]
        };
    }

    static getDefaultSubMenu() {
        return {
            title: "初始菜单",
            content: '选择:',
            buttons: [
                {
                    images: true,
                    image: "textures/items/apple",
                    money: 0,
                    text: "返回",
                    command: "main",
                    type: "form"
                }
            ]
        };
    }

    static getMenu(fileName) {
        if (!fileName.includes(".json")) {
            fileName = fileName + ".json";
        }
        var menuFile = new JsonConfigFile(
            MENU_CONFIG.menusPath + fileName,
            JSON.stringify(this.getDefaultSubMenu())
        );
        return JSON.parse(menuFile.read());
    }

    static setMenu(fileName, data) {
        if (!fileName.includes(".json")) {
            fileName = fileName + ".json";
        }
        var menuFile = new JsonConfigFile(MENU_CONFIG.menusPath + fileName);
        Object.keys(data).forEach(function(key) {
            menuFile.set(key, data[key]);
        });
    }

    static addMenu(fileName, title, content) {
        if (!fileName.includes(".json")) {
            fileName = fileName + ".json";
        }
        if (!File.exists(MENU_CONFIG.menusPath + fileName)) {
            new JsonConfigFile(
                MENU_CONFIG.menusPath + fileName,
                JSON.stringify({
                    title: title,
                    content: content,
                    buttons: [
                        {
                            images: false,
                            image: "textures/items/apple",
                            money: 0,
                            text: "返回",
                            command: "main",
                            type: "form",
                            oplist: []
                        }
                    ]
                })
            );
        }
    }

    static deleteMenu(fileName) {
        if (!fileName.includes(".json")) {
            fileName = fileName + ".json";
        }
        if (File.exists(MENU_CONFIG.menusPath + fileName)) {
            File.delete(MENU_CONFIG.menusPath + fileName);
        }
    }

    static addButton(fileName, button, index) {
        var menuData = this.getMenu(fileName);
        
        if (index == null || index === "") {
            menuData.buttons.push(button);
        } else {
            menuData.buttons.splice(index, 0, button);
        }
        
        File.writeTo(
            MENU_CONFIG.menusPath + fileName,
            JSON.stringify(menuData, null, 4)
        );
    }

    static deleteButton(fileName, button) {
        var menuData = this.getMenu(fileName);
        var index = -1;
        
        for (var i = 0; i < menuData.buttons.length; i++) {
            var b = menuData.buttons[i];
            if (b.text === button.text && b.command === button.command) {
                index = i;
                break;
            }
        }
        
        if (index !== -1) {
            menuData.buttons.splice(index, 1);
            File.writeTo(
                MENU_CONFIG.menusPath + fileName,
                JSON.stringify(menuData, null, 4)
            );
        }
    }

    static collectCommands() {
        if (!File.exists(MENU_CONFIG.menusPath)) return [];
        var files = File.getFilesList(MENU_CONFIG.menusPath);
        var commands = [];
        
        for (var i = 0; i < files.length; i++) {
            var menuData = this.getMenu(files[i]);
            if (menuData && menuData.buttons) {
                for (var j = 0; j < menuData.buttons.length; j++) {
                    commands.push(menuData.buttons[j].command);
                }
            }
        }
        
        return commands;
    }

    static filterButtonsForPlayer(player, menuData) {
        if (player.isOP()) {
            return menuData;
        }

        menuData.buttons = menuData.buttons.filter(function(button) {
            return button.type !== "opfm" && button.type !== "opcm";
        });
        
        return menuData;
    }

    static initializeAdminMenu() {
        this.setMenu("admin", this.getDefaultAdminMenu());
    }
}

// ==================== 玩家菜单交互 ====================
class MenuPlayerHandler {
    static showMenu(player, fileName) {
        var menuData = MenuDataManager.getMenu(fileName);
        menuData = MenuDataManager.filterButtonsForPlayer(player, menuData);

        if (!menuData.title || !menuData.content || !menuData.buttons) {
            player.tell(info+lang.get("cd.config.error"), 5);
            return;
        }

        if (menuData.buttons.length === 0) {
            player.tell(info+lang.get("cd.button.isnull"), 5);
            return;
        }

        var form = mc.newSimpleForm();
        form.setTitle(info+menuData.title);
        form.setContent(menuData.content);

        menuData.buttons.forEach(function(button) {
            var image = button.images ? button.image : "";
            form.addButton(button.text, image);
        });

        var self = this;
        player.sendForm(form, function(pl, id) {
            if (id == null) return;
            if (id >= 0 && id < menuData.buttons.length) {
                self.handleButtonClick(player, menuData.buttons[id], fileName);
            }
        });
    }

    static handleButtonClick(player, button, currentMenu) {
        var requiredMoney = Number(button.money);
        var playerMoney = MenuEconomyManager.get(player);

        if (requiredMoney > 0 && playerMoney < requiredMoney) {
            this.showMenu(player, currentMenu);
            player.tell(info+lang.get("cd.yourmoney.iszero"), 5);
            return;
        }

        switch (button.type) {
            case "form":
                this.showMenu(player, button.command);
                break;
            case "vipfm":
                this.handleVipForm(player, button, currentMenu);
                break;
            case "opfm":
                this.handleOpForm(player, button, currentMenu);
                break;
            case "comm":
                this.executeCommand(player, button.command);
                break;
            case "vipcm":
                this.handleVipCommand(player, button, currentMenu);
                break;
            case "opcm":
                this.handleOpCommand(player, button, currentMenu);
                break;
            default:
                this.showMenu(player, currentMenu);
                player.tell(info+lang.get("cd.thisbutton.error"), 5);
                return;
        }

        if (requiredMoney > 0) {
            MenuEconomyManager.reduce(player, requiredMoney);
        }
    }

    static handleVipForm(player, button, currentMenu) {
        this.showMenu(player, currentMenu);
        player.tell(info+lang.get("cd.vip.deny"), 5);
    }

    static handleOpForm(player, button, currentMenu) {
        var opList = button.oplist || [];
        if (!player.isOP() && opList.length > 0 && opList.indexOf(player.realName) === -1) {
            this.showMenu(player, currentMenu);
            player.tell(info+lang.get("cd.op.deny"), 5);
            return;
        }
        this.showMenu(player, button.command);
    }

    static executeCommand(player, command) {
        interceptCommands = true;
        
        if (command.includes("@s") && !player.isOP()) {
            mc.runcmdEx(command.replace("@s", player.realName));
        } else {
            player.runcmd("/" + command);
        }
        
        setTimeout(function() { 
            interceptCommands = false; 
        }, 1000);
    }

    static handleVipCommand(player, button, currentMenu) {
        this.showMenu(player, currentMenu);
        player.tell(info+lang.get("cd.vip.deny"), 5);
    }

    static handleOpCommand(player, button, currentMenu) {
        var opList = button.oplist || [];
        if (!player.isOP() && opList.length > 0 && opList.indexOf(player.realName) === -1) {
            this.showMenu(player, currentMenu);
            player.tell(info+lang.get("cd.op.deny"), 5);
            return;
        }
        this.executeCommand(player, button.command);
    }
}

// ==================== 命令注册 ====================
class MenuCommandHandler {
    static register() {
        var commands = [
            { cmd: "menu", des: "YEssential--菜单", per: PermType.Any },
            { cmd: "cd", des: "YEssential--菜单", per: PermType.Any }
        ];

        var self = this;
        commands.forEach(function(cmdInfo) {
            var cmd = mc.newCommand(cmdInfo.cmd, cmdInfo.des, cmdInfo.per);
            cmd.setAlias(cmdInfo.des);
            cmd.setEnum("menuset", ["set"]);
            cmd.optional("menuset", ParamType.Enum, "menuset", 1);
            cmd.overload(["menuset"]);
            cmd.setCallback(function(_cmd, ori, out, res) {
                self.callback(_cmd, ori, out, res);
            });
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
            if (!ori.player.isOP()) {
                ori.player.tell(MENU_CONFIG.prefix + "your are not op!");
            } else {
                MenuAdminHandler.showMainSettings(ori.player);
            }
        }
    }
}

// ==================== 管理员设置界面 ====================
class MenuAdminHandler {
    static showMainSettings(player) {
        var form = mc.newSimpleForm();
        form.setTitle(info+"菜单设置");
        form.setContent("选择:");
        form.addButton("经济设置");
        form.addButton("添加菜单");
        form.addButton("删除菜单");
        form.addButton("修改菜单");
        form.addButton("修改其他");

        var self = this;
        player.sendForm(form, function(pl, id) {
            switch (id) {
                case 0: self.showMoneySettings(player); break;
                case 1: self.showAddMenu(player); break;
                case 2: self.showDeleteMenu(player); break;
                case 3: self.showEditMenu(player); break;
                case 4: self.showOtherSettings(player); break;
            }
        });
    }

    static showMoneySettings(player, error, moneyType, scoreName) {
        var currentMoneyType = menuConfig.getMoney();
        var currentScore = menuConfig.getScore();
        var moneyTypeText = currentMoneyType ? "LLMoney" : "计分板";

        var form = mc.newCustomForm();
        form.setTitle("设置经济参数");
        form.addDropdown("选择经济模式---当前: " + moneyTypeText, ["计分板", "LLMoney"], moneyType != null ? moneyType : currentMoneyType);
        form.addInput("输入计分板项--当前: " + currentScore, "例如: money", scoreName != null ? scoreName : "");
        
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
            form.addButton("添加二级菜单");
            form.addButton("添加菜单按钮");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id === 0) self.showAddMenu(player, "add_menu");
                else if (id === 1) self.showAddMenu(player, "add_button");
                else self.showMainSettings(player);
            });
            return;
        }
        if (type === "add_menu") this.showAddSubMenu(player);
        else if (type === "add_button") this.showAddButton(player);
    }

    static showAddSubMenu(player, error, formData) {
        formData = formData || {};
        var menuFiles = MenuUtils.getMenuFiles();
        var fileOptions = menuFiles.map(file => MenuDataManager.getMenu(file).title + " | " + file);

        var form = mc.newCustomForm();
        form.setTitle("添加二级菜单");
        form.addDropdown("选择上级菜单", fileOptions, formData.parentIndex || 0);
        form.addInput("二级菜单文件名称", "例如: aaa", formData.fileName || "");
        form.addInput("二级菜单标题", "例如: 二级菜单", formData.title || "");
        form.addInput("二级菜单提示", "例如: 选择:/选项:", formData.content || "");
        
        if (error) form.addLabel(error);

        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            var [parentIndex, fileName, title, content] = data;

            if (!MenuUtils.isEnglish(fileName) || fileName.length === 0 || fileName.length > 20) {
                self.showAddSubMenu(player, "§l§c文件名称不合法(必须英文且1-20字)", { parentIndex, fileName, title, content });
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
                title: title, content: content || "选择:", buttons: MenuDataManager.getDefaultSubMenu().buttons
            });
            self.showAddMenu(player, "add_menu");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showAddButton(player, error, formData) {
        formData = formData || {};
        var menuFiles = MenuUtils.getMenuFiles();
        var fileOptions = menuFiles.map(f => MenuDataManager.getMenu(f).title + " | " + f);
        var buttonTypes = ["玩家二级菜单", "会员二级菜单", "管理员二级菜单", "玩家执行指令", "会员执行指令", "管理员执行指令"];

        var form = mc.newCustomForm();
        form.setTitle("添加菜单按钮");
        form.addDropdown("选择菜单文件", fileOptions, formData.fileIndex || 0);
        form.addDropdown("选择按钮类型", buttonTypes, formData.buttonType || 0);
        form.addSwitch("是否开启按钮贴图", formData.enableImage || false);
        form.addInput("[选填]按钮贴图地址", "textures/items/apple", formData.imagePath || "");
        form.addInput("[必填]按钮标题", "例如: 说你好", formData.buttonText || "");
        form.addInput("[必填]按钮执行的结果", "例如: say @a 你好", formData.command || "");
        form.addInput("[选填]按钮所需金币", "例如:999", formData.money || "");
        form.addInput("[选填]按钮位置(0为首)", "例如: 0", formData.position ?? "");
        if (error) form.addLabel(error);

        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showAddMenu(player); return; }
            var [fileIndex, typeIndex, enableImage, imagePath, buttonText, command, money, position] = data;
            
            if (!buttonText || !command) {
                self.showAddButton(player, "§c标题和指令必填", { fileIndex, buttonType: typeIndex, enableImage, imagePath, buttonText, command, money, position });
                return;
            }

            var typeMap = ["form", "vipfm", "opfm", "comm", "vipcm", "opcm"];
            var newButton = {
                images: enableImage,
                image: enableImage ? (imagePath || "textures/items/apple") : "",
                money: parseInt(money) || 0,
                text: buttonText,
                command: command,
                type: typeMap[typeIndex]
            };
            if (typeMap[typeIndex].includes("op")) newButton.oplist = [];

            MenuDataManager.addButton(menuFiles[fileIndex], newButton, position !== "" ? parseInt(position) : null);
            self.showAddMenu(player, "add_button");
            player.tell(MENU_CONFIG.prefix + "§2添加成功");
        });
    }

    static showDeleteMenu(player, type) {
        if (!type) {
            var form = mc.newSimpleForm();
            form.setTitle("删除菜单");
            form.addButton("删除二级菜单");
            form.addButton("删除菜单按钮");
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id === 0) self.showDeleteMenu(player, "del_menu");
                else if (id === 1) self.showDeleteMenu(player, "del_button");
                else self.showMainSettings(player);
            });
            return;
        }

        if (type === "del_menu") {
            var files = MenuUtils.getMenuFiles(true);
            if (!files.length) { player.tell("无菜单可删"); return; }
            var form = mc.newSimpleForm();
            files.forEach(f => form.addButton(MenuDataManager.getMenu(f).title + " | " + f));
            var self = this;
            player.sendForm(form, function(pl, id) {
                if (id != null) {
                    MenuDataManager.deleteMenu(files[id]);
                    player.tell("删除成功");
                }
                self.showDeleteMenu(player, type);
            });
        } else {
            // del_button 逻辑省略以简化代码，建议使用配置界面操作
            player.tell("请使用配置文件删除按钮");
            this.showMainSettings(player);
        }
    }

    static showEditMenu(player) {
        player.tell(MENU_CONFIG.prefix + "§e该功能正在开发中");
        this.showMainSettings(player);
    }

    static showOtherSettings(player, error) {
        var files = MenuUtils.getMenuFiles();
        var form = mc.newCustomForm();
        form.setTitle("其他设置");
        form.addLabel("更多设置请直接修改配置文件");
        form.addDropdown("主菜单文件", ["不修改", ...files], 0);
        
        if (error) form.addLabel(error);

        var self = this;
        player.sendForm(form, function(pl, data) {
            if (!data) { self.showMainSettings(player); return; }
            if (data[1] > 0) menuConfig.set({ main: files[data[1]-1].replace(".json","") });
            self.showOtherSettings(player, "§2修改成功");
        });
    }
}

// ==================== 事件与初始化 ====================
class MenuEventListeners {
    // 启动入口
    static register() {

        this.initializeResources();

        // 2. 注册运行时监听器
        this.onUseItem();
        this.onUseItemOn();
        //this.onPlayerCommand();
        this.onJoin();
    }

    static initializeResources() {
        // 注册命令
        MenuCommandHandler.register();
        // 初始化数据
        MenuDataManager.initializeAdminMenu();
        menuConfig.validate();

        if (!File.exists(`${MENU_CONFIG.menusPath}main.json`)) {
            MenuDataManager.setMenu("main", MenuDataManager.getDefaultMainMenu());
        }

        if (menuConfig.getIntercept()) {
            interceptCommands = false;
        }
    }

    static onUseItem() {
        mc.listen("onUseItem", (player, item) => {
            if (item.type === menuConfig.getItem()) {
                MenuPlayerHandler.showMenu(player, menuConfig.getMain());
            }
        });
    }

    static onUseItemOn() {
        mc.listen("onUseItemOn", (player, item, block) => {
            if (item.type !== menuConfig.getItem()) return;
            var device = player.getDevice();
            if (!MENU_CONFIG.mobileOS.includes(device.os)) return;
            if (block.hasContainer()) return;

            if (!clickCooldown[player.xuid]) {
                clickCooldown[player.xuid] = true;
                MenuPlayerHandler.showMenu(player, menuConfig.getMain());
                setTimeout(() => clickCooldown[player.xuid] = false, 1000);
            }
        });
    }

    static onJoin() {
        mc.listen("onJoin", (player) => {
            MenuEconomyManager.add(player, 0);
        });
    }
}

// ==================== 模块导出与启动 ====================
const menuConfig = new MenuConfigManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        MenuConfigManager, 
        MenuEventListeners, 
        MenuUtils,
        MenuEconomyManager,
        MenuDataManager,
        MenuPlayerHandler,
        MenuCommandHandler,
        MenuAdminHandler 
    };
}


MenuEventListeners.register();