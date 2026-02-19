/**
 * 2.7.2 优化的异步传送系统
 * 修复了原代码的逻辑问题和重复定义以及动画问题
 */
class RadomTeleportSystem {
    // 冷却时间 Map，key: playerName, value: 剩余秒数
    static cooltime = new Map();

    /**
     * 生成随机坐标（在最小和最大半径之间）
     */
    static generateRandomCoordinate() {
        const config = conf.get("RTP") || {};
        const maxRadius = config.maxRadius || 5000;
        const minRadius = config.minRadius || 100;
        
        const angle = Math.random() * 2 * Math.PI;
        const minRadiusSquared = minRadius * minRadius;
        const maxRadiusSquared = maxRadius * maxRadius;
        const radiusSquared = minRadiusSquared + Math.random() * (maxRadiusSquared - minRadiusSquared);
        const radius = Math.sqrt(radiusSquared);
        
        const x = Math.floor(radius * Math.cos(angle));
        const z = Math.floor(radius * Math.sin(angle));
        
        return { x, z };
    }

    /**
     * 验证坐标是否在有效范围内
     */
    static isCoordinateValid(x, z) {
        const config = conf.get("RTP") || {};
        const maxRadius = config.maxRadius || 5000;
        const minRadius = config.minRadius || 100;
        
        const distance = Math.sqrt(x * x + z * z);
        return distance >= minRadius && distance <= maxRadius;
    }

    /**
     * 预加载区块
     */
    static async preloadChunks(x, z, dimension, player) {
        try {
            // 传送到地图顶端确保不会卡进地形，同时给予缓降效果防止摔落
            const preloadY = dimension === 1 ? 125 : (dimension === 2 ? 130 : 320);
            mc.runcmdEx(`effect "${player.realName}" slow_falling 30 1 true`);
            mc.runcmdEx(`effect "${player.realName}" resistance 30 255 true`);
            player.teleport(x, preloadY, z, dimension);
            // 等待区块加载（复杂地形多等一点）
            await new Promise(resolve => setTimeout(resolve, 3000));
            return true;
        } catch (error) {
            logger.error(`[RTP] 预加载区块失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 获取地表高度
     */
    static getSurfaceHeight(x, z, dimension) {
        // 主世界支持 1.18+ 新地形（-64~320），下界扫 5~120，末地扫 0~128
        const startY = dimension === 1 ? 120 : (dimension === 2 ? 128 : 320);
        const endY   = dimension === 1 ? 5   : (dimension === 2 ? 0   : -62);

        const airBlocks = new Set([
            "minecraft:air", "minecraft:cave_air", "minecraft:void_air"
        ]);
        const liquidBlocks = new Set([
            "minecraft:water", "minecraft:lava",
            "minecraft:flowing_water", "minecraft:flowing_lava"
        ]);

        let hitLiquid = false;

        for (let y = startY; y >= endY; y--) {
            try {
                const block = mc.getBlock(x, y, z, dimension);
                if (!block) continue;

                const blockType = block.type;

                if (airBlocks.has(blockType)) continue;

                // 记录遇到液体，之后的固体因为上方是液体，所以不安全
                if (liquidBlocks.has(blockType)) {
                    hitLiquid = true;
                    continue;
                }

                // 找到固体块，如果上方曾经是液体则这里是水下，不安全
                if (hitLiquid) {
                    // 重置，继续向下找可能存在的洞穴出口
                    hitLiquid = false;
                    continue;
                }

                const up1 = mc.getBlock(x, y + 1, z, dimension);
                const up2 = mc.getBlock(x, y + 2, z, dimension);

                if (up1 && up2) {
                    const up1Type = up1.type;
                    const up2Type = up2.type;

                    if (airBlocks.has(up1Type) && airBlocks.has(up2Type)) {
                        return y + 1; // 站立点
                    }
                }
            } catch (error) {
                continue;
            }
        }

        return null;
    }

    /**
     * 检查位置是否安全
     */
    static isLocationSafe(x, y, z, dimension) {
        try {
            const feetBlock = mc.getBlock(x, y, z, dimension);
            const headBlock = mc.getBlock(x, y + 1, z, dimension);
            const groundBlock = mc.getBlock(x, y - 1, z, dimension);
            
            if (!feetBlock || !headBlock || !groundBlock) {
                return false;
            }

            const feetType = feetBlock.type;
            const headType = headBlock.type;
            const groundType = groundBlock.type;

            if (feetType !== "minecraft:air" && feetType !== "minecraft:cave_air") {
                return false;
            }
            
            if (headType !== "minecraft:air" && headType !== "minecraft:cave_air") {
                return false;
            }
            
            const veryDangerousBlocks = [
                "minecraft:air", 
                "minecraft:cave_air",
                "minecraft:void_air",
                "minecraft:lava", 
                "minecraft:flowing_lava"
            ];
            
            if (veryDangerousBlocks.includes(groundType)) {
                return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 查找安全位置
     */
    static async findSafeLocationAsync(centerX, centerZ, dimension, player) {
        // 预加载中心区块
        await this.preloadChunks(centerX, centerZ, dimension, player);
        
        // 检查中心点
        let y = this.getSurfaceHeight(centerX, centerZ, dimension);
        if (y !== null && this.isLocationSafe(centerX, y, centerZ, dimension)) {
            return { x: centerX, y, z: centerZ, dimid: dimension };
        }
        
        // 螺旋搜索（增大范围和次数以应对海洋/山地等复杂地形）
        const maxAttempts = 120;
        const maxRadius = 300;

        for (let attempt = 1; attempt < maxAttempts; attempt++) {
            const angle = attempt * 0.618 * Math.PI * 2; // 黄金角，均匀覆盖
            const distance = Math.min(attempt * 3, maxRadius);

            const offsetX = Math.floor(distance * Math.cos(angle));
            const offsetZ = Math.floor(distance * Math.sin(angle));

            const x = centerX + offsetX;
            const z = centerZ + offsetZ;

            try {
                y = this.getSurfaceHeight(x, z, dimension);

                if (y !== null && this.isLocationSafe(x, y, z, dimension)) {
                    return { x, y, z, dimid: dimension };
                }
            } catch (error) {
                continue;
            }

            // 每 20 次给事件循环一点呼吸，避免阻塞
            if (attempt % 20 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        return null;
    }

    /**
     * 动画：先上升->查找位置->继续动画
     */
    static async performGTA5AnimationAsync(player, searchX, searchZ, dimension) {
        return new Promise(async (resolve) => {
            const config = conf.get("RTP") || {};
            const playerName = player.realName;
            if (config.Animation == 1) {
               const playerPos = player.pos;
               mc.runcmdEx(`camera ${playerName} set minecraft:free ease 3 in_out_sine pos ${playerPos.x} ${playerPos.y + 75} ${playerPos.z} rot 90 ${player.direction.yaw}`);
               mc.runcmdEx(`hud ${playerName} hide all`);
            }
        
            if (config.Animation !== 1) {
                // 无动画模式
                player.setTitle(info + lang.get("rtp.search.chunks"), 4);
                const safeLocation = await this.findSafeLocationAsync(searchX, searchZ, dimension, player);
                
                if (safeLocation) {
                    player.teleport(safeLocation.x, safeLocation.y, safeLocation.z, safeLocation.dimid);
                }
                
                resolve(safeLocation);
                return;
            }

            try {
                
                // 阶段1：镜头上升75格 (2秒)
                mc.runcmdEx(`effect "${playerName}" resistance 30 255 true`);
                
                // 2秒后开始查找安全位置
                setTimeout(async () => {
                    //player.sendText(info + "§7§o正在查找安全位置...");
                    player.setTitle(info +lang.get("rtp.loading.chunks1"), 4);
                    setTimeout(() => {
                        player.setTitle(info +lang.get("rtp.loading.chunks2"), 4);
                    }, 1000);
                    setTimeout(() => {
                        player.setTitle(info +lang.get("rtp.loading.chunks3"), 4);
                    }, 2000);
                    // 异步查找安全位置
                    const safeLocation = await this.findSafeLocationAsync(searchX, searchZ, dimension, player);
                    
                    if (!safeLocation) {
                        // 未找到安全位置
                       // player.sendText(info + "§c未找到安全位置");
                        mc.runcmdEx(`camera "${playerName}" clear`);
                        resolve(null);
                        return;
                    }
                    // 找到安全位置，继续动画
                   player.setTitle(info + `§a找到安全位置！`,4);
                    
                    // 阶段2：镜头移动到目标上空 (3秒)
                    const skyY = safeLocation.y  + 100;
                    mc.runcmdEx(`camera "${playerName}" set minecraft:free ease 3 in_out_sine pos ${safeLocation.x} ${skyY} ${safeLocation.z} rot 90 ~`);
                    
                    // 2.5秒时传送玩家
                    setTimeout(() => {
                        player.teleport(safeLocation.x, safeLocation.y, safeLocation.z, safeLocation.dimid);
                        player.setTitle(info + `§a正在传送...`,4);
                    }, 1500);
                    
                    // 阶段3：镜头移动到玩家后方 (3秒)
                    setTimeout(() => {
                        const behindZ = safeLocation.z - 3;
                        mc.runcmdEx(`camera "${playerName}" set minecraft:free ease 3 in_out_sine pos ${safeLocation.x} ${safeLocation.y + 1.65} ${behindZ} rot 0 0`);
                    }, 3000);
                    
                    // 阶段4：镜头快速移动到第一人称 (1秒)
                    setTimeout(() => {
                        mc.runcmdEx(`camera "${playerName}" set minecraft:free ease 1 in_sine pos ${safeLocation.x -0.21 }  ${safeLocation.y + 1.65} ${safeLocation.z} rot 0 0`);
                    }, 6000);
                    
                    // 阶段5：清除镜头
                    setTimeout(() => {
                        mc.runcmdEx(`camera "${playerName}" clear`);
                        mc.runcmdEx(`hud ${playerName} reset all`)
                        try {
                            mc.runcmdEx(`playsound random.levelup "${playerName}"`);
                            mc.runcmdEx(`hud ${playerName} reset all`)
                        } catch (e) {
                            // 忽略音效错误
                        }
                        
                        resolve(safeLocation);
                    }, 7000);
                    
                }, 3000);
                
            } catch (error) {
                logger.error(`[RTP] 动画执行失败: ${error.message}`);
                mc.runcmdEx(`camera "${playerName}" clear`);
                mc.runcmdEx(`hud ${playerName} reset all`)
                resolve(null);
            }
        });
    }

    /**
     * 主要的RTP执行方法
     */
    static async performRTPAsync(player) {
        const config = conf.get("RTP") || {};
        const cost = config.cost || 0;
        const cooldown = config.cooldown || 0;
        const playerName = player.realName;
        try {
            // 1. 冷却检查
            if (RadomTeleportSystem.cooltime && RadomTeleportSystem.cooltime.has(player.realName)) {
                const remainingTime = RadomTeleportSystem.cooltime.get(player.realName);
                if (remainingTime > 0) {
                    player.sendText(info + `§c传送冷却中，剩余时间：${remainingTime}秒`);
                    return false;
                }
            }

            // 2. 金币检查
            if (cost > 0) {
                const balance = conf.get("LLMoney") 
                    ? player.getMoney() 
                    : player.getScore(conf.get("Scoreboard"));
                    
                if (balance < cost) {
                    player.sendText(info + `§c您需要 ${cost}${lang.get("CoinName")} 才能使用随机传送！`);
                    return false;
                }
            }

            // 3. 显示传送信息
            player.setTitle(info + lang.get("rtp.search.chunks"), 4);

            // 4. 设置冷却
            if (cooldown > 0 && RadomTeleportSystem.cooltime) {
                RadomTeleportSystem.cooltime.set(player.realName, cooldown);
            }

            // 5. 扣除费用
            if (cost > 0) {
                if (conf.get("LLMoney")) {
                    player.reduceMoney(cost);
                } else {
                    player.reduceScore(conf.get("Scoreboard"), cost);
                }
                player.sendText(info + `§e花费 ${cost}${lang.get("CoinName")}`);
            }

            // 6. 尝试找到合适的坐标并执行传送
            let safeLocation = null;
            const maxCoordinateAttempts = 8; // 增加外层重试次数

            for (let attempt = 1; attempt <= maxCoordinateAttempts; attempt++) {
                const { x, z } = this.generateRandomCoordinate();
                
                if (!this.isCoordinateValid(x, z)) {
                    continue;
                }
                
                const distance = Math.floor(Math.sqrt(x * x + z * z));
                player.setTitle(info + `§7尝试第 ${attempt} 次：坐标 X:${x}, Z:${z} (距离: ${distance}格)`, 4);

                // 执行GTA5动画（包含查找安全位置）
                safeLocation = await this.performGTA5AnimationAsync(player, x, z, player.pos.dimid);
                
                if (safeLocation) {
                    break;
                } else {     
                    if (attempt < maxCoordinateAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            // 7. 处理传送结果
            if (safeLocation) {
                const finalDistance = Math.floor(Math.sqrt(
                    safeLocation.x * safeLocation.x + 
                    safeLocation.z * safeLocation.z
                ));
                
                player.sendText(info + `§a传送成功！位置: ${safeLocation.x}, ${safeLocation.y}, ${safeLocation.z}`);
                player.sendText(info + `§e距离出生点: §f${finalDistance} 格`);

                return true;
            } else {
                // 所有尝试都失败，使用备用方案
                player.sendText(info + "§c无法找到安全位置，使用备用传送方案...");
                mc.runcmdEx(`hud ${playerName} reset all`)
                const fallbackResult = await this.fallbackTeleport(player);
                
                if (!fallbackResult) {
                    this.refundPlayer(player, cost, cooldown);
                    return false;
                }
                
                return true;
            }

        } catch (error) {
            logger.error(`[RTP] RTP传送失败: ${error.message}\n${error.stack}`);
            player.sendText(info + lang.get("rtp.error"));
            
            this.clearAnimation(player);
            this.refundPlayer(player, cost, cooldown);
            
            return false;
        }
    }

    /**
     * 备用传送方案
     */
    static async fallbackTeleport(player) {
        try {
            const { x, z } = this.generateRandomCoordinate();
            const y = 150;       
            mc.runcmdEx(`effect "${player.realName}" slow_falling 20 1`);
            mc.runcmdEx(`effect "${player.realName}" resistance 20 255 true`);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            player.teleport(x, y, z, player.pos.dimid);
            
            player.sendText(info + lang.get("rtp.tp.success2"));
            player.sendText(info+`§7坐标: X:${x}, Y:${y}, Z:${z}`);
            player.sendText(info+lang.get("rtp.tp.success2"));

            return true;
        } catch (error) {
            logger.error(`[RTP] 备用传送失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 清除动画效果
     */
    static clearAnimation(player) {
        try {
            mc.runcmdEx(`camera "${player.realName}" clear`);
        } catch (e) {
            // 忽略错误
        }
    }

    /**
     * 退还费用和重置冷却
     */
    static refundPlayer(player, cost, cooldown) {
        if (cost > 0) {
            try {
                if (conf.get("LLMoney")) {
                    player.addMoney(cost);
                } else {
                    player.addScore(conf.get("Scoreboard"), cost);
                }
                player.sendText(info + `§a已退还 ${cost}${lang.get("CoinName")}`);
            } catch (e) {
                logger.error(`退还费用失败: ${e.message}`);
            }
        }
        
        if (cooldown > 0 && RadomTeleportSystem.cooltime) {
            RadomTeleportSystem.cooltime.delete(player.realName);
        }
    }
}

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RadomTeleportSystem;
}

// 全局导出（用于直接在主文件中使用）
if (typeof globalThis !== 'undefined') {
    globalThis.RadomTeleportSystem = RadomTeleportSystem;
}

// 冷却倒计时，随模块加载一起启动，不依赖主文件执行顺序
setInterval(() => {
    RadomTeleportSystem.cooltime.forEach((v, k) => {
        if (v > 0) {
            RadomTeleportSystem.cooltime.set(k, v - 1);
        } else {
            RadomTeleportSystem.cooltime.delete(k);
        }
    });
}, 1000);
