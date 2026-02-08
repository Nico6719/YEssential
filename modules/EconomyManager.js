/*--------------------------------
    YEssential Economy Manager
    处理经济系统逻辑
----------------------------------*/

const ctx = require("YEssential/modules/GlobalContext");

const EconomyManager = {
    init() {
        // 注册经济相关命令
        let moneyCmd = mc.newCommand("money", "经济系统", PermType.Any);
        moneyCmd.overload([]);
        moneyCmd.setCallback((cmd, ori, out, res) => {
            let pl = ori.player;
            if (!pl) return out.error("仅限玩家执行");
            this.mainGui(pl);
        });
        moneyCmd.setup();

        // 注册管理员经济命令
        let moneysCmd = mc.newCommand("moneys", "管理员经济系统", PermType.GameMasters);
        moneysCmd.setEnum("op", ["add", "del", "set", "get"]);
        moneysCmd.parameter("op", "op");
        moneysCmd.parameter("player", ParamType.Player);
        moneysCmd.parameter("amount", ParamType.Int, true);
        moneysCmd.overload(["op", "player", "amount"]);
        moneysCmd.setCallback((cmd, ori, out, res) => {
            this.handleAdminCommand(ori, res);
        });
        moneysCmd.setup();
    },

    get(pl) {
        if (ctx.conf.get("LLMoney") == 0) {
            return pl.getScore(ctx.conf.get("Scoreboard"));
        } else {
            return pl.getMoney();
        }
    },

    execute(pl, type, amount) {
        const playerName = typeof pl === 'string' ? pl : pl.realName;
        const playerObj = typeof pl === 'string' ? mc.getPlayer(pl) : pl;
        
        if (ctx.conf.get("LLMoney") == 0) {
            if (!playerObj) return false;
            switch (type) {
                case 'add': return playerObj.addScore(ctx.conf.get("Scoreboard"), amount);
                case 'reduce': return playerObj.reduceScore(ctx.conf.get("Scoreboard"), amount);
                case 'set': return playerObj.setScore(ctx.conf.get("Scoreboard"), amount);
            }
        } else {
            switch (type) {
                case 'add': return money.add(playerName, amount);
                case 'reduce': return money.reduce(playerName, amount);
                case 'set': return money.set(playerName, amount);
            }
        }
        return false;
    },

    checkAndReduce(playerName, amount) {
        const pl = mc.getPlayer(playerName);
        if (!pl) return false;
        if (this.get(pl) < amount) return false;
        return this.execute(pl, 'reduce', amount);
    },

    mainGui(pl) {
        // 这里可以实现经济主界面
        pl.tell(ctx.info + "您的余额: " + this.get(pl) + " " + ctx.lang.get("CoinName"));
    },

    handleAdminCommand(ori, res) {
        // 这里可以实现管理员命令逻辑
    }
};

module.exports = EconomyManager;
