// 配置文件路径
const configPath = './plugins/YEssential/config.json';
const MainPluginPath = './plugins/YEssential/YEssential.js';
// 备份文件夹路径
const backupDir = './plugins/YEssential/backup/';

// 创建默认配置
function createDefaultConfig() {
    const defaultConfig = {
        AutoUpdate: 1,
        PVPModeEnabled: 1,
        HubEnabled: 1,
        TpaEnabled: 1,
        NoticeEnabled: 1,
        CrastModuleEnabled: 0,
        TRServersEnabled: 0,
        RTPEnabled: 1,
        RedPacketEnabled: 1,
        LLMoney: 0,
        Scoreboard: "money",
        PayTaxRate: 0,
        Back: 0,
        Warp: 0,
        RTP: {
            cost: 50,
            minRadius: 100,
            maxRadius: 5000,
            cooldown: 300,
            maxAttempts: 50,
            safeCheck: true,
            enableParticle: true,
            enableSound: true
        },
        Home: {
            MaxHome: 10,
            add: 0,
            del: 0,
            tp: 0
        },
        RedPacket: {
            maxAmount: 10000,
            maxCount: 50,
            minAmount: 1,
            expireTime: 300
        },
        AutoCleanItem: -1,
        KeepInventory: 0,
        suicide: 0,
        OptimizeXporb: 1,
        forceNotice: 0
    };
    
    try {
        createConfigDir();
        file.writeTo(configPath, JSON.stringify(defaultConfig, null, 4));
        logger.info('已创建默认配置文件');
        return defaultConfig;
    } catch (e) {
        logger.error('创建默认配置文件失败: ' + e);
        return defaultConfig;
    }
}

// 创建配置目录
function createConfigDir() {
    const configDir = './plugins/YEssential/';
    if (!File.exists(configDir)) {
        File.mkdir(configDir);
    }
}

// 创建备份目录
function createBackupDir() {
    if (!File.exists(backupDir)) {
        File.mkdir(backupDir);
    }
}

// 备份配置文件
function backupConfig() {
    try {
        createBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                         new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        const backupPath = backupDir + `config_backup_${timestamp}.json`;
        
        if (File.exists(configPath)) {
            const configContent = file.readFrom(configPath);
            file.writeTo(backupPath, configContent);
            logger.info(`配置文件已备份到: ${backupPath}`);
            return true;
        }
        return false;
    } catch (e) {
        logger.error('备份配置文件失败: ' + e);
        return false;
    }
}

// 重载主插件
function reloadMainPlugin() {
    try {
        const result = mc.runcmdEx('ll reload YEssential');
        if (result.success) {
            logger.info('YEssential 主插件重载成功');
            return true;
        } else {
            logger.error('YEssential 主插件重载失败: ' + result.output);
            return false;
        }
    } catch (e) {
        logger.error('重载主插件时发生错误: ' + e);
        return false;
    }
}

// 读取配置 - 修复版本
function loadConfig() {
    try {
        // 检查配置文件是否存在
        if (!File.exists(configPath)) {
            logger.warn('配置文件不存在，正在创建默认配置...');
            return createDefaultConfig();
        }
        
        const configContent = file.readFrom(configPath);
        
        // 检查文件内容是否为空
        if (!configContent || configContent.trim() === '') {
            logger.warn('配置文件为空，正在创建默认配置...');
            return createDefaultConfig();
        }
        
        const config = JSON.parse(configContent);
        
        // 检查配置是否有效
        if (typeof config !== 'object' || config === null) {
            logger.warn('配置文件格式无效，正在创建默认配置...');
            return createDefaultConfig();
        }
        
        return config;
    } catch (e) {
        logger.error('读取配置文件失败: ' + e);
        logger.warn('正在创建默认配置...');
        return createDefaultConfig();
    }
}

mc.listen("onServerStarted", () => {
   if(File.exists(MainPluginPath)){
     colorLog("green", `服务器已安装YEssential插件，插件将继续运行！`);

   } else {
     colorLog("red", `服务器未安装YEssential插件，插件将卸载！！！！`);
     colorLog("blue", `YEssential插件下载地址：https://www.minebbs.com/resources/yessential-lse.10332/`);
     mc.runcmdEx("ll unload YEssentialGUISettings")
   }
})

// 保存配置
function saveConfig(config) {
    try {
        // 保存前先备份
        backupConfig();
        
        // 确保配置目录存在
        createConfigDir();
        
        file.writeTo(configPath, JSON.stringify(config, null, 4));
        
        // 保存成功后重载主插件
        setTimeout(() => {
            if (reloadMainPlugin()) {
                logger.info('配置保存并重载完成');
            }
        }, 1000);
        
        return true;
    } catch (e) {
        logger.error('保存配置文件失败: ' + e);
        return false;
    }
}

// 主配置命令
mc.regPlayerCmd('yeconfig', 'YEssential插件配置', (pl) => {
    if (!pl || !pl.isOP()) {
        pl.tell("§c你没有权限使用此命令！");
        return false;
    }
    showMainConfig(pl);
    return false;
});

// 显示主配置界面
function showMainConfig(pl) {
    let config = loadConfig();
    let fm = mc.newCustomForm();
    
    fm.setTitle("§e§lYEssential 插件配置");
    fm.addLabel("§6基本功能开关");
    
    // 基本功能开关
    fm.addSwitch("自动更新", !!(config.AutoUpdate));
    fm.addSwitch("PVP模式", !!(config.PVPModeEnabled));
    fm.addSwitch("大厅功能", !!(config.HubEnabled));
    fm.addSwitch("传送功能", !!(config.TpaEnabled));
    fm.addSwitch("公告系统", !!(config.NoticeEnabled));
    fm.addSwitch("Crast模块", !!(config.CrastModuleEnabled));
    fm.addSwitch("TR服务器", !!(config.TRServersEnabled));
    fm.addSwitch("随机传送", !!(config.RTPEnabled));
    fm.addSwitch("红包功能", !!(config.RedPacketEnabled));
    
    fm.addLabel("§6经济系统设置");
    fm.addDropdown("经济系统", ["传统经济", "LLMoney"], config.LLMoney || 0);
    fm.addDropdown("计分板显示", ["money", "level", "kill"], getScoreboardIndex(config.Scoreboard));
    fm.addInput("税收比例", "请输入税收比例(0-100)", (config.PayTaxRate || 0).toString());
    
    fm.addLabel("§6传送相关费用");
    fm.addInput("死亡返回费用", "死亡返回back命令费用", (config.Back || 0).toString());
    fm.addInput("传送点费用", "传送点使用费用", (config.Warp || 0).toString());
    fm.addInput("随机传送费用", "随机传送费用", ((config.RTP && config.RTP.cost) || 50).toString());
    
    fm.addLabel("§6家园设置");
    fm.addInput("最大家园数量", "玩家最大家园数量", ((config.Home && config.Home.MaxHome) || 10).toString());
    fm.addInput("添加家园费用", "添加家园费用", ((config.Home && config.Home.add) || 0).toString());
    fm.addInput("删除家园费用", "删除家园费用", ((config.Home && config.Home.del) || 0).toString());
    fm.addInput("传送家园费用", "传送家园费用", ((config.Home && config.Home.tp) || 0).toString());
    
    pl.sendForm(fm, function(pl, data) {
        // 检查数据是否有效
        if (data === null || data === undefined) {
            pl.tell("§a配置已取消");
            return;
        }
        
        try {
            // 更新配置
            config.AutoUpdate = data[1] ? 1 : 0;
            config.PVPModeEnabled = data[2] ? 1 : 0;
            config.HubEnabled = data[3] ? 1 : 0;
            config.TpaEnabled = data[4] ? 1 : 0;
            config.NoticeEnabled = data[5] ? 1 : 0;
            config.CrastModuleEnabled = data[6] ? 1 : 0;
            config.TRServersEnabled = data[7] ? 1 : 0;
            config.RTPEnabled = data[8] ? 1 : 0;
            config.RedPacketEnabled = data[9] ? 1 : 0;
            
            config.LLMoney = data[10] || 0;
            config.Scoreboard = ["money", "level", "kill"][data[11] || 0] || "money";
            config.PayTaxRate = parseInt(data[12]) || 0;
            
            config.Back = parseInt(data[13]) || 0;
            config.Warp = parseInt(data[14]) || 0;
            
            if (!config.RTP) config.RTP = {};
            config.RTP.cost = parseInt(data[15]) || 50;
            
            if (!config.Home) config.Home = {};
            config.Home.MaxHome = parseInt(data[16]) || 10;
            config.Home.add = parseInt(data[17]) || 0;
            config.Home.del = parseInt(data[18]) || 0;
            config.Home.tp = parseInt(data[19]) || 0;
            
            if (saveConfig(config)) {
                pl.tell("§a配置保存成功！正在备份并重载插件...");
                setTimeout(() => {
                    showAdvancedConfig(pl, config); // 显示高级配置
                }, 500);
            } else {
                pl.tell("§c配置保存失败！");
            }
        } catch (e) {
            logger.error('处理表单数据时出错: ' + e);
            pl.tell("§c处理配置时发生错误，请检查控制台日志");
        }
    });
}

// 显示高级配置界面
function showAdvancedConfig(pl, config) {
    let fm = mc.newCustomForm();
    
    fm.setTitle("§e§l高级功能配置");
    fm.addLabel("§6随机传送设置");
    
    if (!config.RTP) config.RTP = {};
    fm.addInput("最小半径", "随机传送最小半径", (config.RTP.minRadius || 100).toString());
    fm.addInput("最大半径", "随机传送最大半径", (config.RTP.maxRadius || 5000).toString());
    fm.addInput("冷却时间", "冷却时间(秒)", (config.RTP.cooldown || 300).toString());
    fm.addInput("最大尝试次数", "安全位置最大尝试次数", (config.RTP.maxAttempts || 50).toString());
    fm.addSwitch("安全检查", !!(config.RTP.safeCheck));
    fm.addSwitch("传送粒子", !!(config.RTP.enableParticle));
    fm.addSwitch("传送音效", !!(config.RTP.enableSound));
    
    fm.addLabel("§6红包设置");
    if (!config.RedPacket) config.RedPacket = {};
    fm.addInput("最大金额", "单个红包最大金额", (config.RedPacket.maxAmount || 10000).toString());
    fm.addInput("最大数量", "红包最大个数", (config.RedPacket.maxCount || 50).toString());
    fm.addInput("最小金额", "单个红包最小金额", (config.RedPacket.minAmount || 1).toString());
    fm.addInput("过期时间", "红包过期时间(秒)", (config.RedPacket.expireTime || 300).toString());
    
    fm.addLabel("§6其他设置");
    fm.addInput("自动清理物品", "自动清理时间(分钟,-1为关闭)", (config.AutoCleanItem || -1).toString());
    fm.addSwitch("死亡保留物品", !!(config.KeepInventory));
    fm.addInput("自杀费用", "自杀命令费用", (config.suicide || 0).toString());
    fm.addSwitch("经验优化", !!(config.OptimizeXporb));
    fm.addSwitch("强制公告", !!(config.forceNotice));
    
    pl.sendForm(fm, function(pl, data) {
        // 检查数据是否有效
        if (data === null || data === undefined) {
            pl.tell("§a高级配置已取消");
            return;
        }
        
        try {
            // 更新RTP设置
            config.RTP.minRadius = parseInt(data[1]) || 100;
            config.RTP.maxRadius = parseInt(data[2]) || 5000;
            config.RTP.cooldown = parseInt(data[3]) || 300;
            config.RTP.maxAttempts = parseInt(data[4]) || 50;
            config.RTP.safeCheck = !!data[5];
            config.RTP.enableParticle = !!data[6];
            config.RTP.enableSound = !!data[7];
            
            // 更新红包设置
            config.RedPacket.maxAmount = parseInt(data[8]) || 10000;
            config.RedPacket.maxCount = parseInt(data[9]) || 50;
            config.RedPacket.minAmount = parseInt(data[10]) || 1;
            config.RedPacket.expireTime = parseInt(data[11]) || 300;
            
            // 更新其他设置
            config.AutoCleanItem = parseInt(data[12]) || -1;
            config.KeepInventory = data[13] ? 1 : 0;
            config.suicide = parseInt(data[14]) || 0;
            config.OptimizeXporb = data[15] ? 1 : 0;
            config.forceNotice = data[16] ? 1 : 0;
            
            if (saveConfig(config)) {
                pl.tell("§a高级配置保存成功！正在备份并重载插件...");
            } else {
                pl.tell("§c高级配置保存失败！");
            }
        } catch (e) {
            logger.error('处理高级配置表单数据时出错: ' + e);
            pl.tell("§c处理高级配置时发生错误，请检查控制台日志");
        }
    });
}

// 辅助函数：获取计分板索引
function getScoreboardIndex(scoreboard) {
    const options = ["money", "level", "kill"];
    const index = options.indexOf(scoreboard);
    return index >= 0 ? index : 0;
}

// 显示当前配置命令
mc.regPlayerCmd('yeinfo', '显示当前配置', (pl) => {
    if (!pl || !pl.isOP()) {
        pl.tell("§c你没有权限使用此命令！");
        return false;
    }
    showPluginInfo(pl);
    return false;
});

function showPluginInfo(pl) {
    let config = loadConfig();
    let fm = mc.newSimpleForm();
    
    fm.setTitle("§e§lYEssential 插件信息");
    fm.setContent(
        `§6当前配置状态:\n\n` +
        `§a✓ 基本功能:\n` +
        `§7- PVP模式: ${config.PVPModeEnabled ? "§a开启" : "§c关闭"}\n` +
        `§7- 随机传送: ${config.RTPEnabled ? "§a开启" : "§c关闭"}\n` +
        `§7- 红包系统: ${config.RedPacketEnabled ? "§a开启" : "§c关闭"}\n\n` +
        `§a✓ 经济系统:\n` +
        `§7- 使用LLMoney: ${config.LLMoney ? "§a是" : "§c否"}\n` +
        `§7- 计分板: ${config.Scoreboard || "money"}\n` +
        `§7- 税收比例: ${config.PayTaxRate || 0}%\n\n` +
        `§a✓ 家园系统:\n` +
        `§7- 最大家园: ${(config.Home && config.Home.MaxHome) || 10}\n` +
        `§7- 传送费用: ${(config.Home && config.Home.tp) || 0}\n\n` +
        `§e输入 /yeconfig 修改配置`
    );
    
    fm.addButton("关闭");
    fm.addButton("打开配置");
    
    pl.sendForm(fm, function(pl, id) {
        if (id === null || id === undefined) return;
        
        if (id === 1) {
            showMainConfig(pl);
        }
    });
}

logger.info("YEssential GUI配置系统加载完成！");
logger.info("使用 /yeconfig 打开配置界面");
logger.info("使用 /yeinfo 查看插件信息");