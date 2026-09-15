/**
 * RadomTeleportSystem.js —— RTP 模块（A 方案架构合并版）
 * ============================================================
 * 内核替换为「RtpSession 状态机 + 单调度器分片推进」架构：
 *   - 两段式地表扫描（粗扫 8 格 + 精扫 7 格），hintY 链式提示
 *   - 未加载区块返回哨兵 {chunkNotLoaded}，绝不把未加载当空气
 *   - 近环 225 点 + 远射线 48 点，分片搜索（16 点/片）
 *   - 全局调度器 50ms/tick、6ms 预算，多人并发互不阻塞
 *   - 区块等待改为轮询探测（每 tick 1 次 getBlock），不再固定睡 3000ms
 *
 * 对外契约（YEssential.js 依赖，保持不变）：
 *   globalThis.RadomTeleportSystem
 *   RadomTeleportSystem.performRTPAsync(player)   —— /rtp 入口
 *   RadomTeleportSystem.cooltime                  —— /rtpreset 用
 *
 * 配置来源：CachePool.conf("RTP")（默认值由 ConfigManager.js 释放）
 * 仅使用已核对的 LSE API（lse.levimc.org）：
 *   mc.getBlock(x,y,z,dimid)→Block|null  bl.isAir/bl.type
 *   pl.teleport(pos)/pl.teleport(x,y,z,dimid)  pl.tell/pl.setTitle/pl.sendText
 *   pl.pos/pl.feetPos/pl.blockPos/pl.realName/pl.xuid/pl.direction/pl.getBiomeName()
 *   mc.runcmdEx  logger  setInterval/clearInterval/setTimeout
 */

"use strict";

// ── 维度常量 ──────────────────────────────────────────────────
const RTP_DIM_NAMES = { 0: "主世界", 1: "下界", 2: "末地" };

// 水方块（浅水判定用：浅水能站，深水不行）
const RTP_WATER_TYPES = new Set(["minecraft:water", "minecraft:flowing_water"]);

// 默认危险方块表（ConfigManager 未配置 dangerBlocks 时的兜底）
const RTP_DEFAULT_DANGER_BLOCKS = [
    "minecraft:lava", "minecraft:flowing_lava",
    "minecraft:fire", "minecraft:soul_fire",
    "minecraft:cactus", "minecraft:sweet_berry_bush",
    "minecraft:wither_rose", "minecraft:powder_snow"
];

// 调度参数
const RTP_TICK_MS = 50;                // 调度间隔
const RTP_SLICE_BUDGET_MS = 6;         // 每 tick 总时间预算
const RTP_RING_POINTS_PER_SLICE = 16;  // 每片查多少个候选点
const RTP_HOVER_Y_OVERWORLD = 799;     // 主世界悬停高度（最终会传到安全点，不会摔）

// ── 配置读取（每次会话开始读一次，走 CachePool 的 5s TTL 缓存）──
function rtpConf() {
    return (typeof CachePool !== "undefined" && CachePool.conf("RTP")) || {};
}

// ── 危险方块 Set 缓存（配置内容指纹变化才重建，避免每次扫描重组数组）──
let _dangerBlocksSet = null;
let _dangerBlocksKey = null;
function getDangerBlocksSet() {
    const cfg = rtpConf();
    // safeCheck=false：不做危险方块判定（等价旧配置语义"关闭安全检查"）
    const list = (cfg.safeCheck === false) ? [] : (cfg.dangerBlocks || RTP_DEFAULT_DANGER_BLOCKS);
    const key = list.join("|");
    if (_dangerBlocksKey !== key) {
        _dangerBlocksSet = new Set(list);
        _dangerBlocksKey = key;
    }
    return _dangerBlocksSet;
}

// ── 维度 Y 范围 / 扫描起始高度 ────────────────────────────────
function getDimensionYRange(dimid) {
    switch (dimid) {
        case 0: return { maxY: 318, minY: -64 };  // 主世界
        case 1: return { maxY: 125, minY: 0 };    // 下界
        case 2: return { maxY: 254, minY: 0 };    // 末地
        default: return { maxY: 318, minY: -64 };
    }
}
function getScanStartHeight(dimid) {
    // 取舍：主世界超过 200 的山峰顶会被判负，换来查询量降约 90%
    switch (dimid) {
        case 0: return 200;
        case 1: return 120;
        case 2: return 200;
        default: return 200;
    }
}

/**
 * 找一列方块的地表安全站位（两段式扫描）
 * 返回 安全位置 / null（不安全）/ {chunkNotLoaded:true}（区块未加载）
 */
function findSurfaceSafePosition(blockX, blockZ, dimid, yRange, scanStartY, dangerSet, hintY, heightOut) {
    const tpX = blockX < 0 ? blockX - 0.5 : blockX + 0.5;
    const tpZ = blockZ < 0 ? blockZ - 0.5 : blockZ + 0.5;

    // 第一步：大步（8 格）向下找地表；hintY 是上一列地表高度，从它附近开始省查询
    let phase1Start = scanStartY;
    if (hintY !== undefined && hintY + 8 < scanStartY) {
        phase1Start = Math.max(yRange.minY, hintY + 8);
    }
    let coarseSolidY = -1;
    for (let y = phase1Start; y >= yRange.minY; y -= 8) {
        const b = mc.getBlock(blockX, y, blockZ, dimid);
        if (b == null) return { chunkNotLoaded: true };
        if (!b.isAir) { coarseSolidY = y; break; }
    }
    if (coarseSolidY === -1) {
        // 提示高度下面是空的（断崖），从头再扫一遍兜底
        if (phase1Start < scanStartY) {
            for (let y = scanStartY; y > phase1Start; y -= 8) {
                const b = mc.getBlock(blockX, y, blockZ, dimid);
                if (b == null) return { chunkNotLoaded: true };
                if (!b.isAir) { coarseSolidY = y; break; }
            }
        }
        if (coarseSolidY === -1) return null;  // 整列空气（末地虚空上方等）
    }

    // 第二步：小步精扫，找准地表
    let surfaceY = coarseSolidY;
    const fineTop = Math.min(coarseSolidY + 7, scanStartY);
    for (let y = fineTop; y > coarseSolidY; y--) {
        const b = mc.getBlock(blockX, y, blockZ, dimid);
        if (b == null) return { chunkNotLoaded: true };
        if (!b.isAir) { surfaceY = y; break; }
    }

    const surfaceBlock = mc.getBlock(blockX, surfaceY, blockZ, dimid);
    if (surfaceBlock == null) return { chunkNotLoaded: true };
    if (heightOut) heightOut.y = surfaceY;

    // 地表是水：逐格离散判定。只允许 1 格深（水刚没过脚），2 格及以上放弃
    if (RTP_WATER_TYPES.has(surfaceBlock.type)) {
        if (rtpConf().safeCheck === false) return null;  // 关闭安全检查时也不往水里传
        let depth = 1;
        let floorY = surfaceY - 1;
        let floor = mc.getBlock(blockX, floorY, blockZ, dimid);
        while (floor != null && RTP_WATER_TYPES.has(floor.type) && depth < 2) {
            depth++; floorY--;
            floor = mc.getBlock(blockX, floorY, blockZ, dimid);
        }
        if (floor == null) return { chunkNotLoaded: true };
        if (depth > 1) return null;                       // 水深 2 格头就进水了
        if (floor.isAir || dangerSet.has(floor.type)) return null;
        const h1 = mc.getBlock(blockX, surfaceY + 1, blockZ, dimid);
        const h2 = mc.getBlock(blockX, surfaceY + 2, blockZ, dimid);
        if (h1 == null || h2 == null) return { chunkNotLoaded: true };
        if (!h1.isAir || !h2.isAir) return null;
        return { x: tpX, y: floorY + 1, z: tpZ, dimid };  // 站水底，水刚没过脚
    }

    if (dangerSet.has(surfaceBlock.type)) return null;

    // 第三步：从地表往下找能站人的地方（最多 32 格）
    const minCheckY = Math.max(surfaceY - 32, yRange.minY);
    for (let y = surfaceY; y >= minCheckY; y--) {
        const bot = mc.getBlock(blockX, y, blockZ, dimid);
        if (bot == null) return { chunkNotLoaded: true };
        if (bot.isAir) continue;
        if (RTP_WATER_TYPES.has(bot.type)) continue;
        if (dangerSet.has(bot.type)) continue;

        const mid = mc.getBlock(blockX, y + 1, blockZ, dimid);
        const top = mc.getBlock(blockX, y + 2, blockZ, dimid);
        if (mid == null || top == null) return { chunkNotLoaded: true };
        if (mid.isAir && top.isAir) {
            return { x: tpX, y: y + 1, z: tpZ, dimid };
        }
    }
    return null;
}

// ── 近环偏移：半径 4~56 格一圈圈往外（共 225 点）──────────────
const RING_OFFSETS = (() => {
    const list = [];
    for (let r = 4; r <= 56; r += 4) {
        const steps = Math.max(6, Math.round((Math.PI * 2 * r) / 12));
        const twist = ((r / 4) % 2 === 1) ? (Math.PI / steps) : 0;
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2 + twist;
            list.push({ dx: Math.round(Math.cos(angle) * r), dz: Math.round(Math.sin(angle) * r) });
        }
    }
    return list;
})();

// ── 远射线偏移：8 方向 × 6 档距离（64~384 格，共 48 点）────────
const RAY_OFFSETS = (() => {
    const list = [];
    const dists = [64, 96, 144, 208, 288, 384];
    for (let d = 0; d < dists.length; d++) {
        const r = dists[d];
        const twist = d * (Math.PI / 8);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + twist + (Math.PI / 8);
            list.push({ dx: Math.round(Math.cos(angle) * r), dz: Math.round(Math.sin(angle) * r) });
        }
    }
    return list;
})();

/**
 * 按偏移序列分批找安全位置（近环/远射线共用）
 * 返回 { spot, nextIdx, hintY, exhausted }
 */
function findSafePositionNearPaged(centerX, centerZ, dimid, yRange, scanStartY, dangerSet, startIdx, maxPoints, hintYIn, offsetsArr) {
    const offsets = offsetsArr || RING_OFFSETS;
    const cap = offsets.length;
    let hintY = hintYIn;
    const heightOut = {};
    const limit = Math.min(startIdx + maxPoints, cap);
    let i = startIdx;
    for (; i < limit; i++) {
        const off = offsets[i];
        heightOut.y = undefined;
        const result = findSurfaceSafePosition(
            centerX + off.dx, centerZ + off.dz,
            dimid, yRange, scanStartY, dangerSet, hintY, heightOut
        );
        if (heightOut.y !== undefined) hintY = heightOut.y;
        if (result === null) continue;
        if (result.chunkNotLoaded) continue;  // 未加载：跳过不干等
        return { spot: result, nextIdx: i + 1, hintY, exhausted: false };
    }
    return { spot: null, nextIdx: i, hintY, exhausted: i >= cap };
}

// ── 全局调度器：所有会话共用一个定时器，分片推进 ──────────────
const rtpScheduler = {
    sessions: [],
    timer: null,

    post(session) {
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].player.xuid === session.player.xuid) {
                this.sessions.splice(i, 1);  // 同一玩家旧会话作废，防连点叠加
                break;
            }
        }
        this.sessions.push(session);
        if (this.timer === null) {
            this.timer = setInterval(() => this._tick(), RTP_TICK_MS);
        }
    },

    _tick() {
        const t0 = Date.now();
        const share = Math.max(1, RTP_SLICE_BUDGET_MS / Math.max(1, this.sessions.length));
        for (let i = 0; i < this.sessions.length;) {
            if ((Date.now() - t0) >= RTP_SLICE_BUDGET_MS) break;
            const s = this.sessions[i];
            const sStart = Date.now();
            let result = false;
            while ((Date.now() - t0) < RTP_SLICE_BUDGET_MS && (Date.now() - sStart) < share) {
                try {
                    result = s.step();
                } catch (err) {
                    logger.error(`[RTP] 会话异常中断: ${err}`);
                    s.abort(err);
                    result = true;
                }
                if (result !== false) break;  // 结束或等区块，换下一个
            }
            if (result === true) this.sessions.splice(i, 1);
            else i++;
        }
        if (this.sessions.length === 0 && this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
};

// ── 一次随机传送的完整状态机 ──────────────────────────────────
class RtpSession {
    /**
     * @param {Player} player
     * @param {Object} opts { dimid, minRadius, maxRadius, maxAttempts, rerollTimes, animation, enableSound, onFinish }
     */
    constructor(player, opts) {
        this.player = player;
        this.dimid = opts.dimid;
        this.originPos = player.feetPos;      // 失败回退用
        this.minRadius = opts.minRadius;
        this.maxRadius = opts.maxRadius;
        this.maxAttempts = opts.maxAttempts;  // 区块探测最大次数（≈100ms/次）
        this.reRandomLeft = opts.rerollTimes; // 剩余重随次数
        this.animation = opts.animation;      // 1 = GTA5 相机动画
        this.enableSound = opts.enableSound;
        this.onFinish = opts.onFinish;        // (success:boolean, spot|null) => void

        this.yRange = getDimensionYRange(this.dimid);
        this.scanStartY = Math.min(getScanStartHeight(this.dimid), this.yRange.maxY);
        this.hoverY = this.dimid === 0 ? RTP_HOVER_Y_OVERWORLD : this.scanStartY + 30;

        this.state = "WAIT_CHUNK";
        this.attempts = 0;
        this.triedTargets = [];
        this.graceTicks = 0;
        this.titleTick = 0;
        this.ringIdx = 0;
        this.ringHintY = undefined;
        this.rayIdx = 0;
        this.rayHintY = undefined;
        this.dangerSet = getDangerBlocksSet();
        this.safePositions = [];
        this.finished = false;

        // 相机动画：镜头先从玩家原位升起
        if (this.animation === 1) {
            try {
                const pp = player.pos;
                mc.runcmdEx(`camera "${player.realName}" set minecraft:free ease 3 in_out_sine pos ${pp.x} ${pp.y + 75} ${pp.z} rot 90 ${player.direction.yaw}`);
                mc.runcmdEx(`hud "${player.realName}" hide all`);
                mc.runcmdEx(`effect "${player.realName}" resistance 30 255 true`);
            } catch (e) { logger.warn(`[RTP] 相机动画启动失败: ${e.message}`); }
            // 关键：等 3 秒镜头 ease 到位后再传送悬停。
            // 同一 tick 传送会把 free 相机瞬间拽到 799 悬停点（"闪现到最顶上"）
            this.state = "ANIM_INTRO";
            const self = this;
            setTimeout(function () {
                if (self.finished) return;
                self._pickNewTarget();
                // 旧版节奏：搜索开始时连发三条加载提示（actionbar）
                try {
                    if (player.name == null) return;
                    player.setTitle(info + CachePool.lang("rtp.loading.chunks1"), 4);
                    setTimeout(function () {
                        if (player.name != null && !self.finished)
                            player.setTitle(info + CachePool.lang("rtp.loading.chunks2"), 4);
                    }, 1000);
                    setTimeout(function () {
                        if (player.name != null && !self.finished)
                            player.setTitle(info + CachePool.lang("rtp.loading.chunks3"), 4);
                    }, 2000);
                } catch (e) {}
            }, 3000);
        } else {
            this._pickNewTarget();
        }
    }

    /** 换一个新随机落点并传送悬停（圆环 minRadius~maxRadius 面积均匀） */
    _pickNewTarget() {
        const p = this.player;
        const minR2 = this.minRadius * this.minRadius;
        const maxR2 = this.maxRadius * this.maxRadius;
        const avoidDist = Math.min(640, Math.max(128, this.maxRadius / 4));

        let angle = 0, dist = 0;
        for (let tries = 0; tries < 12; tries++) {
            angle = Math.random() * Math.PI * 2;
            dist = Math.sqrt(minR2 + Math.random() * (maxR2 - minR2));
            const cx = Math.cos(angle) * dist;
            const cz = Math.sin(angle) * dist;
            const tooClose = this.triedTargets.some(t =>
                (t.x - cx) * (t.x - cx) + (t.z - cz) * (t.z - cz) < avoidDist * avoidDist
            );
            if (!tooClose) break;
        }
        this.randomX = Math.round(Math.cos(angle) * dist);
        this.randomZ = Math.round(Math.sin(angle) * dist);
        this.triedTargets.push({ x: this.randomX, z: this.randomZ });
        this.tpX = this.randomX < 0 ? this.randomX - 0.5 : this.randomX + 0.5;
        this.tpZ = this.randomZ < 0 ? this.randomZ - 0.5 : this.randomZ + 0.5;
        p.teleport(this.tpX, this.hoverY, this.tpZ, this.dimid);

        this.state = "WAIT_CHUNK";
        this.attempts = 0;
        this.graceTicks = 4;   // 200ms 宽限：等服务器执行跨区块传送
        this.ringIdx = 0;
        this.ringHintY = undefined;
        this.rayIdx = 0;
        this.rayHintY = undefined;
    }

    abort(err) {
        try {
            const p = this.player;
            if (p && p.name != null) {
                p.setTitle("§c传送异常", 4);
                p.teleport(this.originPos);
            }
        } catch (e) { logger.error(`[RTP] 异常中止清理失败: ${e}`); }
        this._clearCamera(this.player);
        this._finish(false, null);
    }

    _giveUp() {
        const p = this.player;
        if (p && p.name != null) {
            p.setTitle(info + "§c区块加载超时，传送取消", 4);
            p.teleport(this.originPos);
            this._clearCamera(p);
        }
        return this._finish(false, null);
    }

    /**
     * 推进一小步（调度器调用）
     * 返回 true=会话结束；false=有进展继续；"wait"=等区块下轮再说
     */
    step() {
        const p = this.player;
        if (!p || p.name == null) { this._finish(false, null); return true; }  // 玩家离线

        if (this.state === "ANIM_INTRO") return false;  // 镜头上升期，等 _pickNewTarget

        // 标题节流（动画模式下不刷标题，避免和镜头抢戏）
        if (this.animation !== 1) {
            if (this.titleTick <= 0) {
                p.setTitle(info + CachePool.lang("rtp.search.chunks"), 4);
                this.titleTick = 10;
            }
            this.titleTick--;
        }

        if (this.graceTicks > 0) {
            this.graceTicks--;
        } else if (Math.abs(p.pos.x - this.tpX) > 5 || Math.abs(p.pos.z - this.tpZ) > 5) {
            return this._finishSpot(null, "位置偏移中断");
        }

        if (this.state === "WAIT_CHUNK") {
            // 悬停期间会下落，掉多了拉回
            if (this.graceTicks === 0 && p.pos.y < this.hoverY - 10) {
                p.teleport(this.tpX, this.hoverY, this.tpZ, this.dimid);
            }
            this.attempts++;
            if (this.attempts > this.maxAttempts) {
                if (this.reRandomLeft > 0) {
                    this.reRandomLeft--;
                    this._pickNewTarget();
                    return false;
                }
                return this._giveUp();
            }
            // 1 次 getBlock 探测区块是否已加载
            if (mc.getBlock(this.randomX, this.scanStartY, this.randomZ, this.dimid) == null) {
                return "wait";
            }

            // 群系预检：海洋群系 + 水面双重确认才直接换点（海岛不受影响）
            const biomeName = String(p.getBiomeName ? p.getBiomeName() : "").toLowerCase();
            if (biomeName.includes("ocean")) {
                let sy = this.scanStartY, firstBlock = null;
                while (sy >= this.yRange.minY) {
                    const b = mc.getBlock(this.randomX, sy, this.randomZ, this.dimid);
                    if (b == null) break;
                    if (!b.isAir) { firstBlock = b; break; }
                    sy -= 8;
                }
                if (firstBlock != null && RTP_WATER_TYPES.has(firstBlock.type) && this.reRandomLeft > 0) {
                    this.reRandomLeft--;
                    this._pickNewTarget();
                    return false;
                }
            }

            this.state = "SCAN_ORIGIN";
            // 故意不 return：区块已就绪，同片内立即扫原点
        }

        if (this.state === "SCAN_ORIGIN") {
            const heightOut = {};
            const result = findSurfaceSafePosition(
                this.randomX, this.randomZ, this.dimid,
                this.yRange, this.scanStartY, this.dangerSet, undefined, heightOut
            );
            if (result && result.chunkNotLoaded) {
                this.state = "WAIT_CHUNK";  // 子区块未加载：退回等待
                return "wait";
            }
            if (result) {
                this.safePositions.push(result);
                return this._finishSpot(result, "原点扫描命中");
            }
            this.state = "RING";
            this.ringIdx = 0;
            this.ringHintY = undefined;
            return false;
        }

        if (this.state === "RING") {
            const page = findSafePositionNearPaged(
                this.randomX, this.randomZ, this.dimid,
                this.yRange, this.scanStartY, this.dangerSet,
                this.ringIdx, RTP_RING_POINTS_PER_SLICE, this.ringHintY
            );
            this.ringIdx = page.nextIdx;
            this.ringHintY = page.hintY;
            if (page.spot) {
                this.safePositions.push(page.spot);
                return this._finishSpot(page.spot, "近环搜索命中");
            }
            if (!page.exhausted) return false;
            this.state = "RAY";
            this.rayIdx = 0;
            this.rayHintY = undefined;
            return false;
        }

        if (this.state === "RAY") {
            const page = findSafePositionNearPaged(
                this.randomX, this.randomZ, this.dimid,
                this.yRange, this.scanStartY, this.dangerSet,
                this.rayIdx, 8, this.rayHintY, RAY_OFFSETS
            );
            this.rayIdx = page.nextIdx;
            this.rayHintY = page.hintY;
            if (page.spot) {
                this.safePositions.push(page.spot);
                return this._finishSpot(page.spot, "远射线命中");
            }
            if (!page.exhausted) return false;
            if (this.reRandomLeft > 0) {
                this.reRandomLeft--;
                this._pickNewTarget();
                return false;
            }
            return this._finishSpot(null, "无安全位置");
        }

        return true;
    }

    /** 搜索结束：spot 非空=成功；null=失败回原点 */
    _finishSpot(spot, reason) {
        const p = this.player;
        if (spot && p && p.name != null) {
            if (this.animation === 1) {
                this._playLandingAnimation(p, spot);  // 传送在动画时间线里执行
            } else {
                p.teleport(spot.x, spot.y, spot.z, spot.dimid);
                p.setTitle(info + "§a传送成功！", 4);
                if (this.enableSound) {
                    try { mc.runcmdEx(`playsound random.levelup "${p.realName}"`); } catch (e) {}
                }
            }
            return this._finish(true, spot);
        }
        if (p && p.name != null) {
            p.teleport(this.originPos);
            p.setTitle(info + "§c没有找到安全位置，已返回原点", 4);
            this._clearCamera(p);
        }
        return this._finish(false, null);
    }

    /** GTA5 落点动画：镜头移到落点上空 → 传送 → 身后 → 第一人称 → 清镜头 */
    _playLandingAnimation(p, spot) {
        const name = p.realName;
        try {
            p.setTitle(info + "§a找到安全位置！", 4);
            const skyY = spot.y + 100;
            mc.runcmdEx(`camera "${name}" set minecraft:free ease 3 in_out_sine pos ${spot.x} ${skyY} ${spot.z} rot 90 ~`);
            setTimeout(() => {
                try {
                    if (p.name == null) return;
                    p.teleport(spot.x, spot.y, spot.z, spot.dimid);
                    p.setTitle(info + "§a正在传送...", 4);
                } catch (e) {}
            }, 1500);
            setTimeout(() => {
                try {
                    if (p.name == null) return;
                    mc.runcmdEx(`camera "${name}" set minecraft:free ease 3 in_out_sine pos ${spot.x} ${spot.y + 1.65} ${spot.z - 3} rot 0 0`);
                } catch (e) {}
            }, 3000);
            setTimeout(() => {
                try {
                    if (p.name == null) return;
                    mc.runcmdEx(`camera "${name}" set minecraft:free ease 1 in_sine pos ${spot.x - 0.21} ${spot.y + 1.65} ${spot.z} rot 0 0`);
                } catch (e) {}
            }, 6000);
            setTimeout(() => {
                try {
                    this._clearCamera(p);
                    if (this.enableSound) mc.runcmdEx(`playsound random.levelup "${name}"`);
                } catch (e) {}
            }, 7000);
        } catch (e) {
            logger.warn(`[RTP] 落点动画失败: ${e.message}`);
            this._clearCamera(p);
        }
    }

    _clearCamera(p) {
        try { mc.runcmdEx(`camera "${p.realName}" clear`); } catch (e) {}
        try { mc.runcmdEx(`hud "${p.realName}" reset all`); } catch (e) {}
    }

    _finish(success, spot) {
        if (this.finished) return true;
        this.finished = true;
        try { this.onFinish(success, spot); } catch (e) { logger.error(`[RTP] onFinish 回调异常: ${e}`); }
        return true;
    }
}

// ── 对外主类 ──────────────────────────────────────────────────
class RadomTeleportSystem {
    // 冷却 Map：key=玩家名, value=剩余秒数（/rtpreset 依赖此结构）
    static cooltime = new Map();
    // 动画进行中的玩家（防动画期间重复发起）
    static _busy = new Set();

    static async performRTPAsync(player) {
        const cfg = rtpConf();
        const cost = Number(cfg.cost || 0);
        const cooldown = Number(cfg.cooldown || 0);
        const playerName = player.realName;

        try {
            // 0. 动画进行中：直接拒绝
            if (this._busy.has(player.xuid)) {
                player.tell(info + "§c传送进行中，请稍候");
                return false;
            }

            // 1. 冷却检查
            if (this.cooltime.has(playerName)) {
                const remaining = this.cooltime.get(playerName);
                if (remaining > 0) {
                    player.sendText(info + `§c传送冷却中，剩余时间：${remaining}秒`);
                    return false;
                }
            }

            // 2. 维度检查（接上原配置 allowDimensions，旧代码漏接）
            const dimid = player.pos.dimid;
            const allowDims = cfg.allowDimensions || [0, 1, 2];
            if (allowDims.indexOf(dimid) === -1) {
                player.tell(info + `§c当前维度（${RTP_DIM_NAMES[dimid] || dimid}）不允许随机传送`);
                return false;
            }

            // 3. 余额检查并扣费（smartMoneyCheck 由主文件注入，含扣费与记账）
            if (!smartMoneyCheck(playerName, cost, "RTP随机传送")) {
                return player.tell(info + CachePool.lang("money.no.enough"));
            }

            // 4. 设置冷却
            if (cooldown > 0) this.cooltime.set(playerName, cooldown);

            // 5. 创建会话交给调度器
            const animation = Number(cfg.Animation || 0);
            if (animation === 1) this._busy.add(player.xuid);
            const self = this;
            const session = new RtpSession(player, {
                dimid,
                minRadius: Number(cfg.minRadius || 100),
                maxRadius: Number(cfg.maxRadius || 5000),
                maxAttempts: Number(cfg.maxAttempts || 50),   // 区块探测次数（≈100ms/次）
                rerollTimes: Number(cfg.rerollTimes != null ? cfg.rerollTimes : 6),
                animation,
                enableSound: cfg.enableSound !== false,
                onFinish(success, spot) {
                    // 结算消息（动画成功时延迟到 7s 镜头播完再发，对齐旧版节奏）
                    const sendResult = () => {
                        try {
                            if (player.name == null) return;
                            if (success && spot) {
                                const dist = Math.floor(Math.sqrt(spot.x * spot.x + spot.z * spot.z));
                                player.sendText(info + `§a传送成功！位置: ${Math.floor(spot.x)}, ${spot.y}, ${Math.floor(spot.z)}`);
                                player.sendText(info + `§e距离出生点: §f${dist} 格`);
                            } else {
                                player.sendText(info + "§c未找到安全位置，费用已退还");
                            }
                        } catch (e) {}
                    };
                    if (animation === 1 && success) {
                        // 动画时间线 7s 结束后再结算：先播镜头，再发消息、解除占用
                        setTimeout(() => {
                            self._busy.delete(player.xuid);
                            sendResult();
                        }, 7000);
                    } else {
                        if (animation === 1) self._busy.delete(player.xuid);  // 失败：相机已清理，立即解除
                        sendResult();
                        if (!success) self.refundPlayer(player, cost, cooldown);
                    }
                    if (cfg.debug) {
                        logger.info(`[RTP] ${playerName} 传送结束: ${success ? `成功(${Math.floor(spot.x)},${spot.y},${Math.floor(spot.z)})` : "失败已退款"}`);
                    }
                }
            });
            rtpScheduler.post(session);
            return true;

        } catch (error) {
            logger.error(`[RTP] RTP传送异常: ${error.message}`);
            player.sendText(info + "§4传送发生未知错误，费用已退还。");
            this._busy.delete(player.xuid);
            try {
                mc.runcmdEx(`camera "${playerName}" clear`);
                mc.runcmdEx(`hud "${playerName}" reset all`);
            } catch (e) {}
            this.refundPlayer(player, cost, cooldown);
            return false;
        }
    }

    /** 退还费用并重置冷却（走 Economy.execute 统一记账） */
    static refundPlayer(player, cost, cooldown) {
        if (cost > 0) {
            try {
                Economy.execute(player, "add", cost, "RTP退款");
                player.sendText(info + `§a已退还 ${cost}${CachePool.lang("CoinName")}`);
            } catch (e) {
                logger.error(`退还费用失败: ${e.message}`);
            }
        }
        if (cooldown > 0) {
            RadomTeleportSystem.cooltime.delete(player.realName);
        }
    }
}

// ── 导出（loader 走 require + 可选 init；保持原契约）──────────
if (typeof module !== "undefined" && module.exports) {
    module.exports = RadomTeleportSystem;
}
if (typeof globalThis !== "undefined") {
    globalThis.RadomTeleportSystem = RadomTeleportSystem;
}

// 冷却倒计时，随模块加载启动（保持原逻辑）
setInterval(() => {
    RadomTeleportSystem.cooltime.forEach((v, k) => {
        if (v > 0) RadomTeleportSystem.cooltime.set(k, v - 1);
        else RadomTeleportSystem.cooltime.delete(k);
    });
}, 1000);
