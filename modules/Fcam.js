/**
 * YEssential - FCAM（灵魂出窍）模块
 * 负责 /fcam 命令、BossBar 倒计时、身体标记
 * 依赖全局变量: info, mc, logger, smartMoneyCheck, CachePool
 *
 * 身体标记用纯数据包假玩家实现：不生成实体、不写存档、零 AI 开销，
 * 只往客户端发包让客户端自己"看见"一个玩家。
 * 因此不需要 mc.spawnSimulatedPlayer（依赖 BDS GameTest 子系统，装 addon 会残废，LSE #254），
 * 也不需要盔甲架假实体（会进存档、被 Cleanmgr 清理、死亡留孤儿、会推挤玩家）。
 *
 * 包层移植自 MeowFakePlayer v1.0.0（MIT，作者 MeowTeam），
 * 包体字段顺序逐字保留 —— 那是全文件唯一版本相关的地方。
 */

module.exports = { init: initFcamModule };

// plname -> { pos, rot, gameMode, anchor, timer, bossId, remain, total }
const state = new Map();

function conf() { return CachePool.conf("Fcam") || {}; }
function K(key) { return CachePool.lang(key); }
function barText(remain) { return "§e灵魂出窍剩余 §c" + remain + " §e秒"; }

// 实测（jsdebug）旁观者返回 6；Player.md 属性表写的「3 = 旁观者」是文档错误
function isSpec(gm) { return gm === 6; }
// 只保留 0/1/2 三种真实模式，异常值一律按生存，杜绝把普通玩家还原成创造
function safeMode(gm) { return (gm === 1 || gm === 2) ? gm : 0; }

// 身体假玩家的名字：客户端按这个名字渲染头顶名牌
function bodyName(plname) { return plname + "_Fakeplayer"; }

// ══════════════════════════════════════════════════════════════════════════
// §A 工具 —— 不碰 LSE 对象
// ══════════════════════════════════════════════════════════════════════════

const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_LOOKUP = (() => {
    const t = new Int16Array(256).fill(-1);
    for (let i = 0; i < B64_ALPHABET.length; i++) t[B64_ALPHABET.charCodeAt(i)] = i;
    return t;
})();

function bytesToBase64(bytes) {
    let out = '';
    const n = bytes.length;
    for (let i = 0; i < n; i += 3) {
        const b0 = bytes[i];
        const b1 = i + 1 < n ? bytes[i + 1] : 0;
        const b2 = i + 2 < n ? bytes[i + 2] : 0;
        out += B64_ALPHABET[b0 >> 2];
        out += B64_ALPHABET[((b0 & 3) << 4) | (b1 >> 4)];
        out += i + 1 < n ? B64_ALPHABET[((b1 & 15) << 2) | (b2 >> 6)] : '=';
        out += i + 2 < n ? B64_ALPHABET[b2 & 63] : '=';
    }
    return out;
}

function base64ToBytes(text) {
    const clean = String(text).replace(/[^A-Za-z0-9+/=]/g, '');
    const out = [];
    let acc = 0;
    let bits = 0;
    for (let i = 0; i < clean.length; i++) {
        const c = clean.charCodeAt(i);
        if (c === 61 /* = */) break;
        const v = B64_LOOKUP[c];
        if (v < 0) continue;
        acc = (acc << 6) | v;
        bits += 6;
        if (bits >= 8) {
            bits -= 8;
            out.push((acc >> bits) & 0xFF);
        }
    }
    return out;
}

// 由 base64 长度反推原始字节数。写包体时要先写 varint 长度再写裸字节，
// 长度算错整张皮肤就废 —— 所以按 base64 反推，不依赖 ByteBuffer。
function base64ByteLength(text) {
    const clean = String(text).replace(/[^A-Za-z0-9+/=]/g, '');
    const pad = clean.endsWith('==') ? 2 : (clean.endsWith('=') ? 1 : 0);
    return Math.max(0, Math.floor((clean.length * 3) / 4) - pad);
}

const CRC32_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return t;
})();

function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC32_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function adler32(bytes) {
    let a = 1;
    let b = 0;
    for (let i = 0; i < bytes.length; i++) {
        a = (a + bytes[i]) % 65521;
        b = (b + a) % 65521;
    }
    return ((b << 16) | a) >>> 0;
}

function u32be(v) {
    return [(v >>> 24) & 0xFF, (v >>> 16) & 0xFF, (v >>> 8) & 0xFF, v & 0xFF];
}

function pngSize(bytes) {
    const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    if (bytes.length < 24) return null;
    for (let i = 0; i < 8; i++) if (bytes[i] !== sig[i]) return null;
    const w = ((bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19]) >>> 0;
    const h = ((bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23]) >>> 0;
    if (w === 0 || h === 0) return null;
    return { width: w, height: h };
}

// 组一个 PNG。用 stored（未压缩）deflate 块，所以不需要 zlib 实现：
//   zlib 头 0x78 0x01 + BFINAL/BTYPE=00 的存储块 + adler32
function pngBuild(width, height, rgba) {
    const stride = width * 4;
    const raw = new Uint8Array(height * (1 + stride));
    for (let y = 0; y < height; y++) {
        raw[y * (1 + stride)] = 0; // filter type 0
        for (let x = 0; x < stride; x++) raw[y * (1 + stride) + 1 + x] = rgba[y * stride + x];
    }

    const z = [];
    z.push(0x78, 0x01);
    let off = 0;
    do {
        const chunk = Math.min(65535, raw.length - off);
        const final = off + chunk >= raw.length ? 1 : 0;
        z.push(final, chunk & 0xFF, (chunk >>> 8) & 0xFF, (~chunk) & 0xFF, ((~chunk) >>> 8) & 0xFF);
        for (let i = 0; i < chunk; i++) z.push(raw[off + i]);
        off += chunk;
    } while (off < raw.length || raw.length === 0);
    const ad = adler32(raw);
    z.push((ad >>> 24) & 0xFF, (ad >>> 16) & 0xFF, (ad >>> 8) & 0xFF, ad & 0xFF);

    function chunk(type, data) {
        const body = [];
        for (let i = 0; i < 4; i++) body.push(type.charCodeAt(i));
        for (let i = 0; i < data.length; i++) body.push(data[i]);
        const crc = crc32(body);
        return [].concat(u32be(data.length), body, u32be(crc));
    }

    const ihdr = [].concat(u32be(width), u32be(height), [8 /* bit depth */, 6 /* RGBA */, 0, 0, 0]);
    const out = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    return Uint8Array.from([].concat(out, chunk('IHDR', ihdr), chunk('IDAT', z), chunk('IEND', [])));
}

function paintRect(rgba, w, x0, y0, x1, y1, r, g, b, a) {
    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            const i = (y * w + x) * 4;
            rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
        }
    }
}

// 占位皮肤：必须整张不透明，否则客户端渲染成"空空的人影"。
// LSE 拿不到在线玩家的 SerializedSkin（没有 getSkin 这类导出），所以身体只能是通用皮肤。
function makePlaceholderSkin() {
    const S = 64;
    const rgba = new Uint8Array(S * S * 4);
    const SKIN = [232, 185, 142];
    const HAIR = [60, 42, 32];
    const SHIRT = [58, 118, 190];
    const PANTS = [56, 62, 84];

    paintRect(rgba, S, 0, 0, S, S, SKIN[0], SKIN[1], SKIN[2], 255);
    paintRect(rgba, S, 0, 0, 32, 16, HAIR[0], HAIR[1], HAIR[2], 255);
    paintRect(rgba, S, 8, 8, 16, 16, SKIN[0], SKIN[1], SKIN[2], 255);
    paintRect(rgba, S, 16, 16, 40, 32, SHIRT[0], SHIRT[1], SHIRT[2], 255);
    paintRect(rgba, S, 40, 16, 56, 32, SHIRT[0], SHIRT[1], SHIRT[2], 255);
    paintRect(rgba, S, 32, 48, 48, 64, SHIRT[0], SHIRT[1], SHIRT[2], 255);
    paintRect(rgba, S, 0, 16, 16, 32, PANTS[0], PANTS[1], PANTS[2], 255);
    paintRect(rgba, S, 16, 48, 32, 64, PANTS[0], PANTS[1], PANTS[2], 255);
    return pngBuild(S, S, rgba);
}

// 必须 8-4-4-4-12 标准写法：LSE 的 writeUuid 会先过 mce::UUID::canParse，
// 格式不对直接抛 "Invalid UUID"，包就发不出去。
function npcUuidString(id) {
    const n = (Math.floor(Math.abs(Number(id) || 0)) >>> 0).toString(16).padStart(8, '0');
    const hex = 'f0b34e5043008a00' + n + n;
    return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' +
        hex.slice(16, 20) + '-' + hex.slice(20, 32);
}

// 假玩家没有服务端实体，这两个号只要不和真实实体撞上就行。
// 40 位随机 + 计数器，避开 JS 双精度的 53 位上限。
let bumpCounter = 0;
function allocActorId() {
    bumpCounter = (bumpCounter + 1) & 0xFFFF;
    const rand = Math.floor(Math.random() * 0x1000000);
    return rand * 0x10000 + bumpCounter;
}

// ══════════════════════════════════════════════════════════════════════════
// §B 写入器 W —— 唯一直接碰 BinaryStream 的地方
// ══════════════════════════════════════════════════════════════════════════

class W {
    constructor(bs) { this.bs = bs; }

    u8(v) { this.bs.writeByte(v & 0xFF); return this; }
    bool(v) { this.bs.writeBool(!!v); return this; }
    i16(v) { this.bs.writeSignedShort(v | 0); return this; }
    u16(v) { this.bs.writeUnsignedShort(v & 0xFFFF); return this; }
    i32(v) { this.bs.writeSignedInt(v | 0); return this; }
    u32(v) { this.bs.writeUnsignedInt(v >>> 0); return this; }
    i64(v) { this.bs.writeSignedInt64(v); return this; }
    u64(v) { this.bs.writeUnsignedInt64(v); return this; }
    f32(v) { this.bs.writeFloat(v); return this; }
    uvi(v) { this.bs.writeUnsignedVarInt(v >>> 0); return this; }
    uvi64(v) { this.bs.writeUnsignedVarInt64(v); return this; }
    vi(v) { this.bs.writeVarInt(v | 0); return this; }
    vi64(v) { this.bs.writeVarInt64(v); return this; }
    str(s) { this.bs.writeString(String(s == null ? '' : s)); return this; }
    uuid(s) { this.bs.writeUuid(String(s)); return this; }
    blob(byteBuffer) { this.bs.writeBytes(byteBuffer); return this; }
    vec3(x, y, z) { this.f32(x); this.f32(y); this.f32(z); return this; }
    // 长度 + 裸字节：长度按 base64 反推，避免各家解码器理解不一致导致错位
    sizedBlob(base64) {
        this.uvi(base64ByteLength(base64));
        this.blob(data.fromBase64(base64, true));
        return this;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// §C 包 ID：向 BDS 现问，不写死
// ══════════════════════════════════════════════════════════════════════════

// 兜底表只在"按名字探不到"时用。这张表随版本失效，升级 BDS 后需核对。
const FALLBACK_IDS = {
    AddPlayer: 12,
    RemoveActor: 14,
    PlayerList: 63
};

const PacketIds = {
    map: {},

    // 同一个包，BDS 的 getName() 可能带也可能不带 "Packet" 后缀，
    // 两种写法都登记成别名，免得白跑兜底表。
    addName(name, id) {
        const aliases = [name];
        if (name.length > 6 && name.slice(-6) === 'Packet') aliases.push(name.slice(0, -6));
        else aliases.push(name + 'Packet');
        for (const a of aliases) {
            if (this.map[a] === undefined) this.map[a] = id;
        }
    },

    // 挨个 id 建包问名字 —— 包 ID 表因此天然跟着版本走
    scan() {
        this.map = {};

        if (typeof Packet === 'undefined' || typeof Packet.createPacket !== 'function') {
            this.map = Object.assign({}, FALLBACK_IDS);
            return;
        }

        let probed = 0;
        for (let id = 0; id <= 400; id++) {
            let name = null;
            try {
                const pkt = Packet.createPacket(id);
                if (pkt) name = pkt.getName();
            } catch (e) {
                // 该 id 没有对应包，BDS 会拒绝，继续扫
            }
            if (name) {
                probed++;
                this.addName(String(name), id);
            }
        }

        if (probed === 0) {
            this.map = Object.assign({}, FALLBACK_IDS);
            return;
        }
        for (const k of Object.keys(FALLBACK_IDS)) {
            if (this.map[k] === undefined) this.map[k] = FALLBACK_IDS[k];
        }
    },

    get(name) {
        const id = this.map[name];
        return typeof id === 'number' ? id : -1;
    }
};

// ══════════════════════════════════════════════════════════════════════════
// §D ★ 唯一需要跟着版本看的代码：包体字段顺序
//
// 对齐 BDS 1.26.40 / 协议 2168 的 Packet::write() 顺序，
// 与 HologramLib（原生插件）逐字段一致。换大版本时只可能动这一节 ——
// 字段错位的表现是客户端渲染异常，不是干净报错，所以升级 BDS 必须实测 /fcam。
//
// 术语：uvi = 无符号 varint，vi = zigzag varint，u32/i32 = 定长小端
// ══════════════════════════════════════════════════════════════════════════

const META = {
    RESERVED0: 0,            // 客户端要求打包的第一个条目，值 0
    NAME: 4,                 // 名字牌文本
    RESERVED38: 38,          // 模型缩放
    RESERVED53: 53,          // 碰撞箱宽
    RESERVED54: 54,          // 碰撞箱高
    NAMETAG_ALWAYS_SHOW: 81
};

const META_TYPE = {
    BYTE: 0, SHORT: 1, INT: 2, FLOAT: 3, STRING: 4,
    COMPOUND: 5, BLOCKPOS: 6, INT64: 7, VEC3: 8
};

// 一条元数据：{id, 类型} 之后，BDS 26.40 的 cereal 序列化会**把类型再写一遍**。
// 少写这一遍，客户端会丢弃整个包。
function writeMetaItem(w, id, typeIdx, writeValue) {
    w.uvi(id);
    w.uvi(typeIdx);
    w.uvi(typeIdx);
    writeValue();
}

const GEOMETRY_MIN_ENGINE_VERSION = '1.12.0';
const RESOURCE_PATCH = '{"geometry":{"default":"geometry.humanoid.custom"}}';

// 标准人形模型。客户端只认"数组式"几何，所以用 minecraft:geometry:[...] 这种写法。
const STANDARD_HUMANOID_GEOMETRY = '{"format_version":"1.12.0","minecraft:geometry":[{"description":{"identifier":"geometry.humanoid.custom","texture_width":64,"texture_height":64,"visible_bounds_width":2,"visible_bounds_height":4,"visible_bounds_offset":[0,1.5,0]},"bones":[{"name":"body","pivot":[0,24,0],"cubes":[{"origin":[-4,12,-2],"size":[8,12,4],"uv":[16,16]}]},{"name":"waist","pivot":[0,12,0]},{"name":"head","pivot":[0,24,0],"cubes":[{"origin":[-4,24,-4],"size":[8,8,8],"uv":[0,0]}]},{"name":"rightArm","pivot":[-5,22,0],"cubes":[{"origin":[-8,12,-2],"size":[4,12,4],"uv":[40,16]}]},{"name":"leftArm","pivot":[5,22,0],"cubes":[{"origin":[4,12,-2],"size":[4,12,4],"uv":[32,48]}]},{"name":"rightLeg","pivot":[-1.9,12,0],"cubes":[{"origin":[-3.9,0,-2],"size":[4,12,4],"uv":[0,16]}]},{"name":"leftLeg","pivot":[1.9,12,0],"cubes":[{"origin":[-0.1,0,-2],"size":[4,12,4],"uv":[16,48]}]}]}]}';

/**
 * SerializedSkin
 * skin: { id, pngBase64, width, height, geometry, geometryVersion, slim, skinColor, profileHash }
 */
function writeSkin(w, skin) {
    const geom = skin.geometry && skin.geometry.length ? skin.geometry : STANDARD_HUMANOID_GEOMETRY;
    const geomVer = skin.geometryVersion || GEOMETRY_MIN_ENGINE_VERSION;

    w.str(skin.id);                                  // skinId
    w.str('');                                       // playFabId
    w.str(RESOURCE_PATCH);                           // 几何选择（原样 JSON，实测这样客户端能认）
    w.u32(skin.width);                               // 皮肤图宽
    w.u32(skin.height);                              // 皮肤图高
    w.sizedBlob(skin.pngBase64);                     // 皮肤 PNG（长度 + 裸字节）
    w.uvi(0);                                        // 动画帧数组：0 条
    w.u32(0);                                        // 披风宽
    w.u32(0);                                        // 披风高
    w.str('');                                       // 披风 PNG：空
    w.str(geom);                                     // 几何 JSON
    w.str(geomVer);                                  // 几何引擎版本
    w.str('');                                       // 动画数据
    w.str('');                                       // 披风 id
    w.str(skin.id);                                  // fullId 与 skinId 同源
    w.u8(skin.slim ? 0 : 1);                         // 臂型：slim=0，其余=1
    w.i32(skin.skinColor || 0);                      // 皮肤底色（0xAARRGGBB）
    w.uvi(0);                                        // persona 部件：0 条
    w.uvi(0);                                        // persona 染色：0 条
    w.bool(false);                                   // isPremiumSkin
    w.bool(false);                                   // isPersonaSkin
    w.bool(false);                                   // isPersonaCapeOnClassicSkin
    w.bool(false);                                   // isPrimaryUser
    w.bool(false);                                   // overridesPlayerAppearance
    w.str('true');                                   // 可信标记：26.40 起是皮肤内的三态字符串
    w.str(skin.profileHash || '');                   // 26.40 新增 profileHash
}

// PlayerList(Add) —— 必须早于 AddPlayer，客户端要先有皮肤条目才能渲染
function buildPlayerListAdd(w, npc, skin) {
    w.uvi(1);                       // 条目数
    w.uvi(1);                       // 变体下标：Add 条目 = 1
    w.u8(0);                        // action：Add = 0
    w.uuid(npc.uuid);
    w.vi64(npc.uniqueId);
    w.str(npc.name);
    w.str('0');                     // xuid 占位
    w.str('');                      // platformChatId
    w.i32(1);                       // buildPlatform
    writeSkin(w, skin);
    w.bool(false);                  // isTeacher
    w.bool(false);                  // isHost
    w.bool(false);                  // isSubClient
    w.i32(0);                       // color
}

// AddPlayer —— 把实体"立"起来
function buildAddPlayer(w, npc) {
    w.uuid(npc.uuid);
    w.str(npc.name);
    w.uvi64(npc.runtimeId);         // 运行时 id（无符号 varint64）
    w.str('');                      // platformOnlineId
    w.vec3(npc.x, npc.y, npc.z);
    w.vec3(0, 0, 0);                // 速度
    w.f32(0); w.f32(npc.yaw);       // 俯仰 / 水平朝向
    w.f32(npc.yaw);                 // 头部朝向

    // 主手物品（cereal 模式：空物品也要把字段全写出来）
    w.i16(0);                       // 物品 id
    w.u16(0);                       // 数量
    w.uvi(0);                       // aux
    w.bool(false);                  // netId 可选字段：不存在
    w.uvi(0);                       // blockRuntimeId
    w.str('');                      // userData

    w.vi(0);                        // 游戏模式：Survival = 0（zigzag 后仍是 0）

    // 元数据
    w.uvi(6);
    writeMetaItem(w, META.RESERVED0, META_TYPE.INT64, () => w.vi64(0));
    writeMetaItem(w, META.NAME, META_TYPE.STRING, () => w.str(npc.name));
    writeMetaItem(w, META.NAMETAG_ALWAYS_SHOW, META_TYPE.INT, () => w.vi(1));
    writeMetaItem(w, META.RESERVED38, META_TYPE.FLOAT, () => w.f32(1));
    writeMetaItem(w, META.RESERVED53, META_TYPE.FLOAT, () => w.f32(0.6));
    writeMetaItem(w, META.RESERVED54, META_TYPE.FLOAT, () => w.f32(1.8));

    w.uvi(0);                       // 同步属性：空
    w.uvi(0);

    // 能力表
    w.i64(npc.uniqueId);            // 8 字节定长
    w.u8(1);                        // 玩家权限：Member
    w.u8(0);                        // 命令权限
    w.uvi(1);                       // 层数
    w.u16(0);                       // 层号
    w.u32(0);                       // abilitiesSet
    w.u32(0);                       // abilitiesValue
    w.f32(0.05);                    // 飞行速度
    w.f32(0.1);                     // 垂直飞行速度
    w.f32(0.1);                     // 行走速度

    w.uvi(0);                       // ActorLink：0 条
    w.str('');                      // deviceId
    w.u32(1);                       // buildPlatform
}

// RemoveActor —— 只按 uniqueId 移除。
// 刻意**不发** PlayerList(Remove)：26.40 客户端在皮肤条目还活跃时移除玩家列表条目会崩，
// 实体照常消失（HologramLib 的实测结论）。
function buildRemoveActor(w, npc) {
    w.vi64(npc.uniqueId);
}

// ══════════════════════════════════════════════════════════════════════════
// §E 包体缓存与发送
//
// 一个身体的包体只序列化一次，发给 N 个观看者时复用同一份 stream。
// 尤其 PlayerList 里带整张皮肤的 base64 → 二进制解码，每多一个观看者就重做一次纯属白费；
// tick 每 500ms 扫一遍「在线玩家 × 身体」，这个开销是实打实的。
//
// 只走原始包通道：createPacket(id, true) = BDS 的 NetworkPacket，我们写的包体原样带着，
// 包头/压缩/加密仍由 BDS 出，脚本一个协议字节都不写。
// fcam 只用 PlayerList / AddPlayer，两者都是纯服务端→客户端的包，BDS 自己从不 read()
// 它们（它只负责写），所以"先让 BDS 读一遍再发"这条路对它们没有收益 —— 整条分级通道省掉。
// ══════════════════════════════════════════════════════════════════════════

const PktCache = {};   // 身体名 -> { [包名]: { id, bs } }

// 取（必要时构造）某身体某包的包体。包 ID 变了说明 BDS 包表重扫过，缓存作废重建。
function bake(npc, packetName) {
    const bucket = PktCache[npc.name] || (PktCache[npc.name] = {});
    const id = PacketIds.get(packetName);
    if (id < 0) return null;

    const hit = bucket[packetName];
    if (hit && hit.id === id) return hit;

    const bs = new BinaryStream();
    const w = new W(bs);
    if (packetName === 'PlayerList') buildPlayerListAdd(w, npc, Skin);
    else if (packetName === 'AddPlayer') buildAddPlayer(w, npc);
    else if (packetName === 'RemoveActor') buildRemoveActor(w, npc);
    else return null;

    bucket[packetName] = { id: id, bs: bs };
    return bucket[packetName];
}

function sendTo(player, npc, packetName) {
    const entry = bake(npc, packetName);
    if (!entry) return false;
    try {
        entry.bs.setReadPointer(0);
        const pkt = entry.bs.createPacket(entry.id, true);
        if (!pkt) return false;
        pkt.sendTo(player);
        return true;
    } catch (e) {
        // 这份包体发不出去（多半是字段顺序跟当前 BDS 对不上），丢掉缓存避免反复失败
        const bucket = PktCache[npc.name];
        if (bucket) delete bucket[packetName];
        return false;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// §F 皮肤 —— 一张内置占位皮肤，只生成一次
// ══════════════════════════════════════════════════════════════════════════

let Skin = null;

function initSkin() {
    try {
        const png = makePlaceholderSkin();
        // 规范化成"解码再编码"的标准 base64：写包体时先写 varint 长度再写裸字节，
        // base64 带换行或缺 padding 会让长度与实写字节数错位，整张皮肤直接废掉。
        const canonical = bytesToBase64(base64ToBytes(bytesToBase64(png)));
        const size = pngSize(Array.from(png));
        if (!size) return false;
        Skin = {
            id: '__fcam_default__',
            pngBase64: canonical,
            width: size.width,
            height: size.height,
            geometry: '', geometryVersion: '',
            slim: false, skinColor: 0, profileHash: ''
        };
        return true;
    } catch (e) {
        Skin = null;
        return false;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// §G 身体表 —— 每个玩家一个身体，生命周期跟着 /fcam
// ══════════════════════════════════════════════════════════════════════════

function playerName(player) {
    try {
        return String(player.realName || player.name);
    } catch (e) {
        return String(player.name);
    }
}

const Bodies = {
    npcs: {},       // name -> npc
    viewers: {},    // playerName -> { [npcName]: true }

    make(name, pos) {
        const npcId = (Date.now() % 0xFFFFFF) * 0x100 + (Object.keys(this.npcs).length & 0xFF);
        return {
            npcId: npcId,
            name: String(name),
            uuid: npcUuidString(npcId),
            uniqueId: allocActorId(),
            runtimeId: allocActorId(),
            x: Number(pos.x) || 0,
            y: Number(pos.y) || 0,
            z: Number(pos.z) || 0,
            yaw: Number(pos.yaw) || 0,
            dimid: Number(pos.dimid) || 0
        };
    },

    create(name, pos) {
        name = String(name || '').trim();
        if (!name) return null;
        if (this.npcs[name]) this.remove(name);   // 同名先收掉，避免残留

        const npc = this.make(name, pos);
        this.npcs[name] = npc;

        for (const pl of mc.getOnlinePlayers()) {
            if (this.inRange(pl, npc)) this.spawnTo(pl, npc);
        }
        return npc;
    },

    remove(name) {
        const npc = this.get(name);
        if (!npc) return false;
        for (const pl of mc.getOnlinePlayers()) {
            if (this.isShown(pl, npc)) this.despawnFrom(pl, npc);
        }
        delete this.npcs[npc.name];
        delete PktCache[npc.name];                 // 包体缓存随身体作废
        return true;
    },

    // 卸载/热重载：把还在线客户端里的身体收掉。
    // 本方案刻意不发 PlayerList(Remove)，不主动收就会留下"幽灵玩家"。
    removeAll() {
        for (const pl of mc.getOnlinePlayers()) {
            for (const npc of this.list()) {
                try { sendTo(pl, npc, 'RemoveActor'); } catch (e) {}
            }
            try { delete this.viewers[playerName(pl)]; } catch (e) {}
        }
        this.npcs = {};
        for (const k of Object.keys(PktCache)) delete PktCache[k];
    },

    get(name) { return this.npcs[String(name)] || null; },
    list() { return Object.keys(this.npcs).map((k) => this.npcs[k]); },

    // 发"出现"包：PlayerList(Add) → AddPlayer。顺序不能反
    spawnTo(player, npc) {
        const pn = playerName(player);
        if (!this.viewers[pn]) this.viewers[pn] = {};
        if (this.viewers[pn][npc.name]) return false;

        if (!sendTo(player, npc, 'PlayerList')) return false;
        if (!sendTo(player, npc, 'AddPlayer')) return false;
        this.viewers[pn][npc.name] = true;
        return true;
    },

    despawnFrom(player, npc) {
        if (!this.isShown(player, npc)) return false;
        sendTo(player, npc, 'RemoveActor');
        delete this.viewers[playerName(player)][npc.name];
        return true;
    },

    isShown(player, npc) {
        const pn = playerName(player);
        return !!(this.viewers[pn] && this.viewers[pn][npc.name]);
    },

    // 身体不按距离裁剪：灵魂出窍时身体就该在原地一直可见，与原来的盔甲架行为一致
    //（HUD 会持续显示距离）。跨维度不显示 —— 客户端也渲染不了。
    inRange(player, npc) {
        return Number(player.pos.dimid) === Number(npc.dimid);
    },

    // 掉线/重生后客户端实体缓存没了，丢掉观看状态让 tick 重新生成
    forgetViewer(player) {
        try { delete this.viewers[playerName(player)]; } catch (e) {}
    },

    tick() {
        const players = mc.getOnlinePlayers();
        const alive = {};
        for (const pl of players) alive[playerName(pl)] = true;
        // 掉线的观看者状态清掉（重连后按新玩家重新生成）
        for (const pn of Object.keys(this.viewers)) {
            if (!alive[pn]) delete this.viewers[pn];
        }
        for (const pl of players) {
            for (const npc of this.list()) {
                const shown = this.isShown(pl, npc);
                const inRange = this.inRange(pl, npc);
                if (!shown && inRange) this.spawnTo(pl, npc);
                else if (shown && !inRange) this.despawnFrom(pl, npc);
            }
        }
    }
};

// ══════════════════════════════════════════════════════════════════════════
// §H 加载期初始化：包 ID 探测 + 驱动轮询
//
// 必须放在加载期，不能等 onServerStarted —— QuickJS 引擎是在"启用模组"阶段
// 才挂自己的 ServerStarted 钩子，等它挂好事件早过去了，脚本层注册的
// onServerStarted 回调永远不触发。YEssential 主文件也是加载期 require 模块的。
// ══════════════════════════════════════════════════════════════════════════

let tickTimer = null;
let ready = false;

function initFakePlayerLayer() {
    if (ready) return true;
    try {
        if (!initSkin()) return false;
        PacketIds.scan();
        ready = true;
        return true;
    } catch (e) {
        return false;
    }
}

function startTicking() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(function () {
        try {
            if (ready) Bodies.tick();
        } catch (e) {}
    }, 500);
}

// ══════════════════════════════════════════════════════════════════════════
// §I FCAM 主体逻辑
// ══════════════════════════════════════════════════════════════════════════

// 身体朝向必须取玩家进屋那一刻的 yaw，写死会导致假人恒朝北。
// LSE 的 pl.direction 是 DirectionAngle，暴露 .pitch / .yaw 两个属性
//（源码：newAngle(vec.x, vec.y) → 第一参 pitch，第二参 yaw。
// 别用 .x/.y —— 那是内部 Vec2，JS 侧只有 pitch/yaw）
function specBody(plname, anchor, yaw) {
    try {
        return Bodies.create(bodyName(plname), {
            x: anchor.x, y: anchor.y, z: anchor.z, dimid: anchor.dimid, yaw: yaw
        });
    } catch (e) {
        return null;
    }
}

function clearBody(plname) {
    try { Bodies.remove(bodyName(plname)); } catch (e) {}
}

function stopTimer(pl, plname, st) {
    if (st.timer) { try { clearInterval(st.timer); } catch (e) {} st.timer = null; }
    const p = pl || mc.getPlayer(plname);
    if (p && st.bossId) {
        try { p.removeBossBar(st.bossId); } catch (e) { logger.error(K("fc.error.log5") + e); }
    }
    st.bossId = null;
}

// 只在玩家当前仍是旁观者时才还原模式：期间被管理员改过就说明有人接管了，不抢
function restoreMode(pl, st) {
    if (!pl || !isSpec(pl.gameMode)) return;
    try { pl.setGameMode(st.gameMode); } catch (e) { logger.error(K("fc.error.log1") + e); }
}

function enterFcam(pl, plname, anchor) {
    const rot = pl.direction;
    const st = {
        pos: pl.pos, rot: rot, gameMode: safeMode(pl.gameMode), anchor: anchor,
        timer: null, bossId: null, remain: 0, total: 0
    };
    state.set(plname, st);
    // 先切模式再放标记：旁观者不会被标记实体推挤
    try { pl.setGameMode(6); } catch (e) { logger.error(K("fc.error.log1") + e); }
    specBody(plname, anchor, rot.yaw);
    startTimer(pl, plname, st);
    return st;
}

function exitFcam(pl, plname) {
    const st = state.get(plname);
    if (!st) return false;
    stopTimer(pl, plname, st);
    clearBody(plname);
    restoreMode(pl, st);
    try { pl.teleport(st.pos, st.rot); } catch (e) { logger.error(K("fc.error.log2") + e); }
    // 删状态放在最后：中途抛错则状态仍在，玩家可再执行一次 /fcam 重试退出
    state.delete(plname);
    return true;
}

// 死亡中断：回收资源但不传送（死亡即新的现实）
function abortFcam(pl, plname) {
    const st = state.get(plname);
    if (!st) return false;
    stopTimer(pl, plname, st);
    clearBody(plname);
    restoreMode(pl, st);
    state.delete(plname);
    return true;
}

// 卸载/重载兜底：否则内存状态随模块作废，玩家卡在旁观者且 /fcam 只回 fc.error2。
// ll.onUnload 内部是 addUnloadCallback（追加注册），不会顶掉主文件的落盘回调。
function exitAllFcam() {
    try {
        const list = mc.getOnlinePlayers();
        for (let i = 0; i < list.length; i++) {
            try {
                if (state.has(list[i].realName)) exitFcam(list[i], list[i].realName);
            } catch (e) {}
        }
    } catch (e) { logger.error("FCAM: 卸载清理失败: " + e); }
    try { Bodies.removeAll(); } catch (e) {}
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    ready = false;
}

function distText(p, a) {
    const c = "(" + Math.round(a.x) + ", " + Math.round(a.y) + ", " + Math.round(a.z) + ")";
    // 跨维度时 distanceTo 会返回整数最大值，必须单独说明
    if (p.pos.dimid !== a.dimid) return "§e身体在 §c另一个维度 §7" + c;
    return "§e距离身体 §c" + Math.round(p.distanceTo(a)) + " §e米 §7" + c;
}

function startTimer(pl, plname, st) {
    const c = conf();
    const showHud = c.ShowHud !== false;
    const timeout = Number(c.TimeOut) || 0;

    st.total = timeout > 0 ? timeout : 0;
    st.remain = st.total;

    if (st.total > 0) {
        st.bossId = Number("10" + plname.length + Date.now());
        try {
            pl.setBossBar(st.bossId, barText(st.remain), 100, 3);
        } catch (e) {
            logger.error("FCAM: 创建 BossBar 失败: " + e);
            st.bossId = null;
        }
    }

    st.timer = setInterval(function () {
        const cur = state.get(plname);
        if (!cur) return;

        const p = mc.getPlayer(plname);
        // 人没了，或模式被外部改掉：回收资源，但不还原模式（不抢控制权）
        if (!p || !isSpec(p.gameMode)) { abortFcam(p, plname); return; }

        if (showHud) { try { p.tell(info + distText(p, cur.anchor), 5); } catch (e) {} }

        if (cur.total <= 0) return;
        cur.remain--;

        if (cur.remain <= 0) {
            try {
                exitFcam(p, plname);
                p.tell(info + K("fc.timeout"));
            } catch (e) {
                logger.error(K("fc.error.log4") + e);
            }
            return;
        }

        if (cur.bossId) {
            try {
                p.setBossBar(cur.bossId, barText(cur.remain), cur.remain / cur.total * 100,
                             cur.remain <= 5 ? 2 : (cur.remain <= 10 ? 4 : 3));
            } catch (e) {
                logger.error("FCAM: 更新 BossBar 失败: " + e);
                cur.bossId = null;
            }
        }
    }, 1000);
}

function initFcamModule() {
    initFakePlayerLayer();
    startTicking();

    const cmd = mc.newCommand("fcam", "灵魂出窍", PermType.Any);
    cmd.overload([]);

    cmd.setCallback(function (_c, ori, out, _r) {
        try {
            const pl = ori.player;
            if (!pl) return out.error(info + K("fc.error"));

            const plname = pl.realName;
            const c = conf();
            if (c.EnableModule == 0) return pl.tell(info + K("module.no.Enabled"));

            if (state.has(plname)) {
                exitFcam(pl, plname);
                return out.success(info + K("fc.success.quit"));
            }

            // 已是旁观者（非本模块所致）→ 只提示，不动模式。绝不能"救援"成其他模式：会覆盖管理员的合法状态
            if (isSpec(pl.gameMode)) return out.error(info + K("fc.error2"));

            const cost = c.CostMoney;
            if (!smartMoneyCheck(plname, cost, "灵魂出窍(Fcam)")) {
                return pl.tell(info + K("money.no.enough"));
            }

            enterFcam(pl, plname, pl.feetPos);
            return out.success(info + K("fc.success.getin").replace("${Fcam}", cost));
        } catch (e) {
            logger.error("FCAM: 执行 /fcam 异常: " + e);
            try { out.error(info + "灵魂出窍执行失败，请查看控制台日志。"); } catch (e2) {}
        }
    });

    cmd.setup();

    // 不注册则 reload 会留下卡在旁观者的玩家；每次加载都注册（回调随引擎销毁，幂等）
    ll.onUnload(exitAllFcam);

    mc.listen("onLeft", function (p) {
        // 必须在玩家数据落盘前还原模式，否则下次进服会以旁观者身份出现
        try { if (state.has(p.realName)) exitFcam(p, p.realName); }
        catch (e) { logger.error("FCAM: onLeft 清理失败: " + e); }
        Bodies.forgetViewer(p);
    });

    // 进服：客户端刚进世界缓存是空的，延迟补生成一遍（太早发包会被丢掉）
    mc.listen("onJoin", function (p) {
        setTimeout(function () {
            try { if (ready) Bodies.tick(); } catch (e) {}
        }, 1000);
    });

    // 重生：客户端侧实体缓存清空，丢掉观看状态让 tick 重新生成
    mc.listen("onRespawn", function (p) { Bodies.forgetViewer(p); });

    // 死亡兜底（/suicide、/kill 通用）：否则玩家重生后 /fcam 会被误判成"已在旁观者"
    mc.listen("onPlayerDie", function (p) {
        try { if (state.has(p.realName)) abortFcam(p, p.realName); }
        catch (e) { logger.error("FCAM: onPlayerDie 清理失败: " + e); }
    });
}
