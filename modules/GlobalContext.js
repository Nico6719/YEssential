/*--------------------------------
    YEssential Global Context
    存储全局变量和工具函数
----------------------------------*/

const GlobalContext = {
    info: "§l§6[-YEST-] §r",
    datapath: "./plugins/YEssential/data/",
    pluginpath: "./plugins/YEssential/",
    transdimid: ["主世界", "地狱", "末地"],
    version: "2.8.8",
    
    // 基础对象
    lang: null,
    conf: null,
    homedata: null,
    warpdata: null,
    rtpdata: null,
    noticeconf: null,
    pvpConfig: null,
    offlineMoney: null,
    MoneyHistory: null,
    moneyranking: null,
    servertp: null,
    tpacfg: null,

    // 状态变量
    isSending: false,
    deathPoints: {},

    init(data) {
        Object.assign(this, data);
    },

    // 通用工具函数
    colorLog(color, text) {
        const colors = {
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            reset: "\x1b[0m"
        };
        logger.info((colors[color] || "") + text + colors.reset);
    },

    showInsufficientMoneyGui(pl, cost, returnCmd) {
        const fm = mc.newSimpleForm();
        fm.setTitle(this.lang.get("gui.insufficient.money.title"));
        fm.setContent(this.lang.get("gui.insufficient.money.content")
            .replace("${cost}", cost)
            .replace("${coin}", this.lang.get("CoinName")));
        fm.addButton(this.lang.get("gui.button.confirm"));
        if (returnCmd) {
            fm.addButton(this.lang.get("gui.button.back"));
        }
        
        pl.sendForm(fm, (p, id) => {
            if (id === 1 && returnCmd) {
                p.runcmd(returnCmd);
            }
        });
    }
};

module.exports = GlobalContext;
