/*--------------------------------
    YEssential Data Manager
    负责初始化和管理所有数据文件
----------------------------------*/

const ctx = require("./GlobalContext");

const DataManager = {
    init() {
        const datapath = ctx.datapath;
        const pluginpath = ctx.pluginpath;

        // 初始化 JsonConfigFile 对象
        ctx.homedata = new JsonConfigFile(datapath + "homedata.json", JSON.stringify({}));
        ctx.warpdata = new JsonConfigFile(datapath + "warpdata.json", JSON.stringify({}));
        ctx.rtpdata = new JsonConfigFile(datapath + "/RTPData/Rtpdata.json", JSON.stringify({}));
        ctx.noticeconf = new JsonConfigFile(datapath + "/NoticeSettingsData/playersettingdata.json", JSON.stringify({}));
        ctx.pvpConfig = new JsonConfigFile(datapath + "/PVPSettingsData/pvp_data.json", JSON.stringify({}));
        ctx.MoneyHistory = new JsonConfigFile(datapath + "/Money/MoneyHistory.json", JSON.stringify({}));
        ctx.moneyranking = new JsonConfigFile(datapath + "/Money/Moneyranking.json", "{}");
        ctx.tpacfg = new JsonConfigFile(datapath + "/TpaSettingsData/tpaAutoRejectConfig.json", JSON.stringify({}));
        
        const defaultServerConfig = JSON.stringify({
            servers: [
                { server_name: "生存服", server_ip: "127.0.0.1", server_port: 19132 }
            ]
        });
        ctx.servertp = new JsonConfigFile(datapath + "/TrSeverData/server.json", defaultServerConfig);

        // 特殊处理 offlineMoney
        const offlineMoneyPath = datapath + "/Money/offlineMoney.json";
        ctx.offlineMoney = new JsonConfigFile(offlineMoneyPath, "{}");

        logger.info("DataManager: All data files initialized.");
    }
};

module.exports = DataManager;
