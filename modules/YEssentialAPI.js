/*--------------------------------
    YEssential API 导出模块
    提供完整的插件功能接口供其他插件调用
----------------------------------*/

const YEssentialAPI = {
    // ================== 版本信息 ==================
    version: "2.7.3",
    name: "YEssential",
    
    // ================== 经济系统 API ==================
    Economy: {
        /**
         * 获取玩家余额
         * @param {Player|string} player - 玩家对象或玩家名
         * @returns {number} 玩家余额
         */
        get: (player) => {
            const pl = typeof player === 'string' ? mc.getPlayer(player) : player;
            if (!pl) return 0;
            
            return conf.get("LLMoney") == 0 
                ? pl.getScore(conf.get("Scoreboard"))
                : pl.getMoney();
        },
        
        /**
         * 设置玩家余额
         * @param {Player|string} player - 玩家对象或玩家名
         * @param {number} amount - 设置的金额
         * @returns {boolean} 是否成功
         */
        set: (player, amount) => {
            return Economy.execute(player, 'set', amount);
        },
        
        /**
         * 增加玩家余额
         * @param {Player|string} player - 玩家对象或玩家名
         * @param {number} amount - 增加的金额
         * @returns {boolean} 是否成功
         */
        add: (player, amount) => {
            return Economy.execute(player, 'add', amount);
        },
        
        /**
         * 减少玩家余额
         * @param {Player|string} player - 玩家对象或玩家名
         * @param {number} amount - 减少的金额
         * @returns {boolean} 是否成功
         */
        reduce: (player, amount) => {
            return Economy.execute(player, 'reduce', amount);
        },
        
        /**
         * 检查玩家余额是否足够
         * @param {Player|string} player - 玩家对象或玩家名
         * @param {number} amount - 需要的金额
         * @returns {boolean} 是否足够
         */
        has: (player, amount) => {
            const balance = YEssentialAPI.Economy.get(player);
            return balance >= amount;
        },
        
        /**
         * 转账
         * @param {Player|string} from - 转出玩家
         * @param {Player|string} to - 转入玩家
         * @param {number} amount - 转账金额
         * @param {number} taxRate - 税率(可选,默认使用配置)
         * @returns {Object} {success: boolean, received: number, tax: number, message: string}
         */
        transfer: (from, to, amount, taxRate = null) => {
            const fromPl = typeof from === 'string' ? mc.getPlayer(from) : from;
            const toPl = typeof to === 'string' ? mc.getPlayer(to) : to;
            
            if (!fromPl || !toPl) {
                return {success: false, message: "玩家不在线"};
            }
            
            const rate = taxRate !== null ? taxRate : conf.get("PayTaxRate");
            const tax = Math.floor(amount * (rate / 100));
            const received = amount - tax;
            
            if (received <= 0) {
                return {success: false, message: "转账金额不足以支付手续费"};
            }
            
            if (!YEssentialAPI.Economy.has(fromPl, amount)) {
                return {success: false, message: "余额不足"};
            }
            
            Economy.execute(fromPl, 'reduce', amount);
            Economy.execute(toPl, 'add', received);
            
            return {
                success: true,
                received: received,
                tax: tax,
                message: "转账成功"
            };
        },
        
        /**
         * 获取货币名称
         * @returns {string} 货币名称
         */
        getCoinName: () => {
            return lang.get("CoinName");
        },
        
        /**
         * 获取玩家排行榜
         * @param {number} limit - 返回前N名(默认50)
         * @returns {Array} [{name: string, money: number}]
         */
        getRanking: (limit = 50) => {
            const data = JSON.parse(moneyranking.read());
            return Object.keys(data)
                .map(name => ({name, money: data[name]}))
                .sort((a, b) => b.money - a.money)
                .slice(0, limit);
        }
    },
    
    // ================== 家园系统 API ==================
    Home: {
        /**
         * 获取玩家所有家
         * @param {string} playerName - 玩家名
         * @returns {Object} {homeName: {x, y, z, dimid}}
         */
        getAll: (playerName) => {
            return homedata.get(playerName) || {};
        },
        
        /**
         * 添加家
         * @param {string} playerName - 玩家名
         * @param {string} homeName - 家名称
         * @param {Object} pos - 位置 {x, y, z, dimid}
         * @returns {boolean} 是否成功
         */
        add: (playerName, homeName, pos) => {
            const homes = homedata.get(playerName) || {};
            
            if (homes[homeName]) {
                return false; // 家名已存在
            }
            
            homes[homeName] = {
                x: pos.x.toFixed(1),
                y: pos.y.toFixed(1),
                z: pos.z.toFixed(1),
                dimid: pos.dimid
            };
            
            homedata.set(playerName, homes);
            return true;
        },
        
        /**
         * 删除家
         * @param {string} playerName - 玩家名
         * @param {string} homeName - 家名称
         * @returns {boolean} 是否成功
         */
        delete: (playerName, homeName) => {
            const homes = homedata.get(playerName) || {};
            
            if (!homes[homeName]) {
                return false; // 家不存在
            }
            
            delete homes[homeName];
            homedata.set(playerName, homes);
            return true;
        },
        
        /**
         * 传送到家
         * @param {Player} player - 玩家对象
         * @param {string} homeName - 家名称
         * @returns {boolean} 是否成功
         */
        teleport: (player, homeName) => {
            const homes = homedata.get(player.realName) || {};
            const home = homes[homeName];
            
            if (!home) return false;
            
            return player.teleport(
                parseFloat(home.x),
                parseFloat(home.y),
                parseFloat(home.z),
                parseInt(home.dimid)
            );
        }
    },
    
    // ================== 传送点系统 API ==================
    Warp: {
        /**
         * 获取所有公共传送点
         * @returns {Object} {warpName: {x, y, z, dimid}}
         */
        getAll: () => {
            return JSON.parse(warpdata.read());
        },
        
        /**
         * 添加传送点
         * @param {string} warpName - 传送点名称
         * @param {Object} pos - 位置 {x, y, z, dimid}
         * @returns {boolean} 是否成功
         */
        add: (warpName, pos) => {
            if (warpdata.get(warpName)) {
                return false; // 传送点已存在
            }
            
            warpdata.set(warpName, {
                x: pos.x.toFixed(1),
                y: pos.y.toFixed(1),
                z: pos.z.toFixed(1),
                dimid: pos.dimid
            });
            return true;
        },
        
        /**
         * 删除传送点
         * @param {string} warpName - 传送点名称
         * @returns {boolean} 是否成功
         */
        delete: (warpName) => {
            if (!warpdata.get(warpName)) {
                return false; // 传送点不存在
            }
            
            warpdata.delete(warpName);
            return true;
        },
        
        /**
         * 传送到传送点
         * @param {Player} player - 玩家对象
         * @param {string} warpName - 传送点名称
         * @returns {boolean} 是否成功
         */
        teleport: (player, warpName) => {
            const warp = warpdata.get(warpName);
            if (!warp) return false;
            
            return player.teleport(
                parseFloat(warp.x),
                parseFloat(warp.y),
                parseFloat(warp.z),
                parseInt(warp.dimid)
            );
        }
    },
    
    // ================== 红包系统 API ==================
    RedPacket: {
        /**
         * 发送红包
         * @param {Player} sender - 发送者
         * @param {number} amount - 总金额
         * @param {number} count - 红包个数
         * @param {string} type - 类型: "random" 或 "average"
         * @param {string} targetPlayer - 目标玩家(可选)
         * @param {string} message - 祝福语(可选)
         * @returns {Object} {success: boolean, packetId: number, message: string}
         */
        send: (sender, amount, count, type = "random", targetPlayer = "", message = "") => {
            if (!conf.get("RedPacket").EnabledModule) {
                return {success: false, message: "红包功能未开启"};
            }
            
            const config = conf.get("RedPacket");
            
            // 验证参数
            if (amount < config.minAmount || amount > config.maxAmount) {
                return {success: false, message: `金额必须在${config.minAmount}-${config.maxAmount}之间`};
            }
            
            if (count < 1 || count > config.maxCount) {
                return {success: false, message: `个数必须在1-${config.maxCount}之间`};
            }
            
            // 检查余额
            const balance = YEssentialAPI.Economy.get(sender);
            if (balance < amount) {
                return {success: false, message: "余额不足"};
            }
            
            // 扣除资金
            Economy.execute(sender, 'reduce', amount);
            
            // 创建红包
            const packetId = redpacketData.get("nextId");
            const packet = {
                id: packetId,
                sender: sender.realName,
                amount: amount,
                count: count,
                remaining: count,
                remainingAmount: amount,
                recipients: [],
                targetType: targetPlayer ? "specific" : "all",
                targetPlayer: targetPlayer,
                message: message || `${sender.realName}的红包`,
                packetType: type,
                createdAt: Date.now(),
                expireAt: Date.now() + (config.expireTime * 1000)
            };
            
            redpacketData.set(`packets.${packetId}`, packet);
            redpacketData.set("nextId", packetId + 1);
            
            return {
                success: true,
                packetId: packetId,
                message: "红包发送成功"
            };
        },
        
        /**
         * 领取红包
         * @param {Player} player - 玩家对象
         * @returns {Object} {success: boolean, amount: number, message: string}
         */
        open: (player) => {
            const packets = redpacketData.get("packets") || {};
            const now = Date.now();
            let availablePackets = [];
            
            for (const id in packets) {
                const packet = packets[id];
                
                if (packet.expireAt < now) continue;
                if (packet.remaining <= 0) continue;
                if (packet.recipients.includes(player.realName)) continue;
                
                const canClaim = packet.targetType === "all" || 
                    (packet.targetType === "specific" && 
                     packet.targetPlayer.toLowerCase() === player.realName.toLowerCase());
                
                if (canClaim) {
                    availablePackets.push(packet);
                }
            }
            
            if (availablePackets.length === 0) {
                return {success: false, message: "当前没有可领取的红包"};
            }
            
            // 按时间排序,领取最早的红包
            availablePackets.sort((a, b) => a.createdAt - b.createdAt);
            const packet = availablePackets[0];
            
            // 计算红包金额
            let amount;
            if (packet.remaining === 1) {
                amount = packet.remainingAmount;
            } else {
                if (packet.packetType === "random") {
                    const maxAmount = Math.min(
                        packet.remainingAmount - packet.remaining + 1,
                        Math.floor(packet.remainingAmount / packet.remaining * 2)
                    );
                    amount = Math.floor(Math.random() * maxAmount) + 1;
                    amount = Math.max(amount, 1);
                } else {
                    amount = Math.floor(packet.remainingAmount / packet.remaining);
                    amount = Math.max(amount, 1);
                }
            }
            
            // 更新红包数据
            packet.remaining--;
            packet.remainingAmount -= amount;
            packet.recipients.push(player.realName);
            redpacketData.set(`packets.${packet.id}`, packet);
            
            // 给玩家发放资金
            Economy.execute(player, 'add', amount);
            
            return {
                success: true,
                amount: amount,
                sender: packet.sender,
                message: "领取成功"
            };
        },
        
        /**
         * 获取可领取的红包列表
         * @param {string} playerName - 玩家名
         * @returns {Array} 红包列表
         */
        getAvailable: (playerName) => {
            const packets = redpacketData.get("packets") || {};
            const now = Date.now();
            let available = [];
            
            for (const id in packets) {
                const packet = packets[id];
                
                if (packet.expireAt < now) continue;
                if (packet.remaining <= 0) continue;
                if (packet.recipients.includes(playerName)) continue;
                
                const canClaim = packet.targetType === "all" || 
                    (packet.targetType === "specific" && 
                     packet.targetPlayer.toLowerCase() === playerName.toLowerCase());
                
                if (canClaim) {
                    available.push({
                        id: packet.id,
                        sender: packet.sender,
                        amount: packet.amount,
                        remaining: packet.remaining,
                        count: packet.count,
                        type: packet.packetType,
                        message: packet.message,
                        expireAt: packet.expireAt
                    });
                }
            }
            
            return available;
        }
    },
    
    // ================== TPA系统 API ==================
    TPA: {
        /**
         * 发送TPA请求
         * @param {Player} from - 发起玩家
         * @param {string} toName - 目标玩家名
         * @param {string} direction - "to" 或 "here"
         * @param {number} delay - 延迟秒数(可选)
         * @returns {boolean} 是否成功发送
         */
        sendRequest: (from, toName, direction = "to", delay = 0) => {
            const to = mc.getPlayer(toName);
            if (!to) return false;
            
            sendTpaRequest(from, toName, direction, delay);
            return true;
        },
        
        /**
         * 接受TPA请求
         * @param {string} playerName - 玩家名
         * @returns {boolean} 是否成功
         */
        accept: (playerName) => {
            if (!pendingTpaRequests[playerName]) return false;
            acceptTpaRequest(playerName);
            return true;
        },
        
        /**
         * 拒绝TPA请求
         * @param {string} playerName - 玩家名
         * @returns {boolean} 是否成功
         */
        deny: (playerName) => {
            if (!pendingTpaRequests[playerName]) return false;
            denyTpaRequest(playerName);
            return true;
        },
        
        /**
         * 设置玩家TPA接受状态
         * @param {string} playerName - 玩家名
         * @param {boolean} accept - 是否接受
         */
        setAcceptStatus: (playerName, accept) => {
            tpacfg.set(playerName, {acceptTpaRequests: accept});
        }
    },
    
    // ================== RTP系统 API ==================
    RTP: {
        /**
         * 执行随机传送
         * @param {Player} player - 玩家对象
         * @returns {Promise<boolean>} 是否成功
         */
        execute: async (player) => {
            if (!conf.get("RTP").EnabledModule) return false;
            
            try {
                await RadomTeleportSystem.performRTPAsync(player);
                return true;
            } catch (error) {
                logger.error(`RTP执行失败: ${error.message}`);
                return false;
            }
        },
        
        /**
         * 重置玩家RTP冷却
         * @param {string} playerName - 玩家名
         */
        resetCooldown: (playerName) => {
            cooltime.set(playerName, 0);
        },
        
        /**
         * 获取玩家RTP冷却时间
         * @param {string} playerName - 玩家名
         * @returns {number} 剩余冷却秒数
         */
        getCooldown: (playerName) => {
            return cooltime.get(playerName) || 0;
        }
    },
    
    // ================== PVP系统 API ==================
    PVP: {
        /**
         * 获取玩家PVP状态
         * @param {string} playerName - 玩家名
         * @returns {boolean} PVP是否开启
         */
        getStatus: (playerName) => {
            return pvpConfig.get(playerName) || false;
        },
        
        /**
         * 设置玩家PVP状态
         * @param {string} playerName - 玩家名
         * @param {boolean} enabled - 是否开启
         */
        setStatus: (playerName, enabled) => {
            pvpConfig.set(playerName, enabled);
        }
    },
    
    // ================== 配置系统 API ==================
    Config: {
        /**
         * 获取配置项
         * @param {string} key - 配置键
         * @returns {*} 配置值
         */
        get: (key) => {
            return conf.get(key);
        },
        
        /**
         * 设置配置项
         * @param {string} key - 配置键
         * @param {*} value - 配置值
         */
        set: (key, value) => {
            conf.set(key, value);
        },
        
        /**
         * 获取语言文本
         * @param {string} key - 语言键
         * @returns {string} 语言文本
         */
        getLang: (key) => {
            return lang.get(key);
        }
    },
    
    // ================== 工具函数 API ==================
    Utils: {
        /**
         * 获取维度名称
         * @param {number} dimid - 维度ID
         * @returns {string} 维度名称
         */
        getDimensionName: (dimid) => {
            const dims = {0: "主世界", 1: "下界", 2: "末地"};
            return dims[dimid] || `未知维度(ID: ${dimid})`;
        },
        
        /**
         * 格式化货币显示
         * @param {number} amount - 金额
         * @returns {string} 格式化后的字符串
         */
        formatMoney: (amount) => {
            if (amount >= 1e6) return (amount / 1e6).toFixed(1) + "M";
            if (amount >= 1e3) return (amount / 1e3).toFixed(1) + "K";
            return amount.toLocaleString();
        },
        
        /**
         * 彩色日志输出
         * @param {string} color - 颜色
         * @param {string} text - 文本
         */
        colorLog: (color, text) => {
            colorLog(color, text);
        }
    },
    
    // ================== 事件监听 API ==================
    Events: {
        /**
         * 注册经济变动监听
         * @param {Function} callback - 回调函数 (playerName, type, amount)
         */
        onMoneyChange: (callback) => {
            // 需要修改Economy类以支持事件
            if (!YEssentialAPI._moneyChangeListeners) {
                YEssentialAPI._moneyChangeListeners = [];
            }
            YEssentialAPI._moneyChangeListeners.push(callback);
        },
        
        /**
         * 注册红包领取监听
         * @param {Function} callback - 回调函数 (player, packetId, amount)
         */
        onRedPacketOpen: (callback) => {
            if (!YEssentialAPI._redPacketOpenListeners) {
                YEssentialAPI._redPacketOpenListeners = [];
            }
            YEssentialAPI._redPacketOpenListeners.push(callback);
        }
    }
};

// ================== 导出API ==================
// 定义一个获取API对象的函数
function getYEssentialAPI() {
    return YEssentialAPI;
}

// 导出这个函数
if (typeof ll !== 'undefined' && ll.exports) {
    // 参数1是函数，参数2是命名空间，参数3是导出名
    const success = ll.exports(getYEssentialAPI, "YEssential", "getApi");
    if (success) {
        logger.info("API 导出成功");
    }
}
// 全局导出(兼容性)
if (typeof globalThis !== 'undefined') {
    globalThis.YEssentialAPI = YEssentialAPI;
}

logger.info("使用方法: const api = ll.imports('YEssentialAPI', 'YEssentialAPI');");

// ================== 使用示例 ==================
/*
// 在其他插件中调用示例:

// 1. 导入API
const YEssentialAPI = ll.imports("YEssentialAPI", "YEssentialAPI");
const api = ll.imports('YEssentialAPI', 'YEssentialAPI');

// 2. 使用经济系统
const balance = YEssentialAPI.Economy.get(player);
YEssentialAPI.Economy.add(player, 1000);

// 3. 转账
const result = YEssentialAPI.Economy.transfer(player1, player2, 500);
if (result.success) {
    logger.info(`转账成功,实际到账:${result.received}`);
}

// 4. 发送红包
const rpResult = YEssentialAPI.RedPacket.send(
    player, 
    1000,  // 总金额
    5,     // 个数
    "random",  // 类型
    "",    // 目标玩家(空表示全服)
    "新年快乐"  // 祝福语
);

// 5. 家园系统
YEssentialAPI.Home.add(player.realName, "我的家", player.pos);
YEssentialAPI.Home.teleport(player, "我的家");

// 6. 传送点系统
YEssentialAPI.Warp.add("主城", player.pos);
YEssentialAPI.Warp.teleport(player, "主城");

// 7. TPA系统
YEssentialAPI.TPA.sendRequest(player, "目标玩家", "to", 3);

// 8. RTP系统
await YEssentialAPI.RTP.execute(player);

// 9. 配置系统
const rtpConfig = YEssentialAPI.Config.get("RTP");
YEssentialAPI.Config.set("RTP", {...rtpConfig, EnabledModule: true});

// 10. 监听事件
YEssentialAPI.Events.onMoneyChange((playerName, type, amount) => {
    logger.info(`玩家${playerName}的金币${type}了${amount}`);
});
*/