/**
 * 异步更新检查器
 * 负责检查插件更新并自动下载安装
 */

// ══════════════════════════════════════════════════════════════════════════
// 防篡改校验（纯 JS，零依赖）
//   - 哈希规则：SHA-256( UTF-8( 去掉 \r 后的内容 ) )
//     这与 downloadSpecificFiles 里的 data.replace(/\r/g, '') 一致，
//     发布侧必须按同样规则（LF 归一化后）计算，否则永远对不上。
//   - 签名：ed25519（RFC 8032），对 update-manifest.json 的原文签名。
//   - 全部为公开标准算法的移植，已用 NIST / RFC 8032 测试向量验证。
//   - 运行环境：QuickJS（LSE）。只用 Uint8Array / BigInt / Date，无 Node API。
// ══════════════════════════════════════════════════════════════════════════

// 信任锚：ed25519 公钥（32 字节 hex）。只能在这里硬编码，绝不从网络取。
// 由发布流程生成，私钥存放在发布机，永不进入仓库。
const UPDATE_PUBKEY_HEX = "682febeec922090e2ce76cee17d31b97e62795401950c9dddbc5b2b5f03fc2a6";

function _utf8Encode(str) {
    const out = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
            const c2 = str.charCodeAt(++i);
            const cp = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
            out.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
        } else {
            out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        }
    }
    return new Uint8Array(out);
}
function _bytesToHex(b) {
    let s = "";
    for (let i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return s;
}
function _hexToBytes(s) {
    const out = new Uint8Array(s.length >> 1);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16);
    return out;
}

const _K256 = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
]);
function _sha256(msg) {
    const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const l = msg.length;
    const k = (56 - (l + 1) % 64 + 64) % 64;
    const total = l + 1 + k + 8;
    const buf = new Uint8Array(total);
    buf.set(msg); buf[l] = 0x80;
    const dv = new DataView(buf.buffer);
    const bits = l * 8;
    dv.setUint32(total - 8, Math.floor(bits / 0x100000000));
    dv.setUint32(total - 4, bits >>> 0);
    const w = new Uint32Array(64);
    for (let off = 0; off < total; off += 64) {
        for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
        for (let i = 16; i < 64; i++) {
            const x = w[i - 15], y = w[i - 2];
            const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
            const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let i = 0; i < 64; i++) {
            const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + _K256[i] + w[i]) >>> 0;
            const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + t1) >>> 0;
            d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    const out = new Uint8Array(32);
    const odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) odv.setUint32(i * 4, H[i]);
    return out;
}
function _sha256HexOfStr(s) { return _bytesToHex(_sha256(_utf8Encode(s))); }

const _K512 = [
    0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,
    0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,
    0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,
    0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,
    0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,
    0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,
    0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,
    0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,
    0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,
    0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,
    0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,
    0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,
    0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,
    0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,
    0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,
    0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,
    0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,
    0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,
    0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,
    0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n
];
const _M64 = (1n << 64n) - 1n;
function _rotr64(x, n) { return ((x >> n) | (x << (64n - n))) & _M64; }
function _sha512(msg) {
    let H = [0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,
             0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n];
    const l = msg.length;
    const k = (112 - (l + 1) % 128 + 128) % 128;
    const total = l + 1 + k + 16;
    const buf = new Uint8Array(total);
    buf.set(msg); buf[l] = 0x80;
    const dv = new DataView(buf.buffer);
    const bits = BigInt(l) * 8n;
    dv.setUint32(total - 8, Number((bits >> 32n) & 0xffffffffn));
    dv.setUint32(total - 4, Number(bits & 0xffffffffn));
    const w = new Array(80);
    for (let off = 0; off < total; off += 128) {
        for (let i = 0; i < 16; i++) w[i] = (BigInt(dv.getUint32(off + i * 8)) << 32n) | BigInt(dv.getUint32(off + i * 8 + 4));
        for (let i = 16; i < 80; i++) {
            const s0 = _rotr64(w[i - 15], 1n) ^ _rotr64(w[i - 15], 8n) ^ (w[i - 15] >> 7n);
            const s1 = _rotr64(w[i - 2], 19n) ^ _rotr64(w[i - 2], 61n) ^ (w[i - 2] >> 6n);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & _M64;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let i = 0; i < 80; i++) {
            const S1 = _rotr64(e, 14n) ^ _rotr64(e, 18n) ^ _rotr64(e, 41n);
            const ch = (e & f) ^ ((~e & _M64) & g);
            const t1 = (h + S1 + ch + _K512[i] + w[i]) & _M64;
            const S0 = _rotr64(a, 28n) ^ _rotr64(a, 34n) ^ _rotr64(a, 39n);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) & _M64;
            h = g; g = f; f = e; e = (d + t1) & _M64;
            d = c; c = b; b = a; a = (t1 + t2) & _M64;
        }
        H[0] = (H[0] + a) & _M64; H[1] = (H[1] + b) & _M64; H[2] = (H[2] + c) & _M64; H[3] = (H[3] + d) & _M64;
        H[4] = (H[4] + e) & _M64; H[5] = (H[5] + f) & _M64; H[6] = (H[6] + g) & _M64; H[7] = (H[7] + h) & _M64;
    }
    const out = new Uint8Array(64);
    const odv = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) { odv.setUint32(i * 8, Number(H[i] >> 32n)); odv.setUint32(i * 8 + 4, Number(H[i] & 0xffffffffn)); }
    return out;
}

const _P = (1n << 255n) - 19n;
function _mod(a, m) { const r = a % m; return r >= 0n ? r : r + m; }
function _modPow(b, e, m) { let r = 1n; b = _mod(b, m); while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; } return r; }
function _modInv(a) { return _modPow(_mod(a, _P), _P - 2n, _P); }
const _D = _mod(-121665n * _modInv(121666n), _P);
const _L = (1n << 252n) + 27742317777372353535851937790883648493n;

function _extAdd(p, q) {
    const A = _mod((p[1] - p[0]) * (q[1] - q[0]), _P);
    const B = _mod((p[1] + p[0]) * (q[1] + q[0]), _P);
    const C = _mod(2n * p[3] * q[3] * _D, _P);
    const Dd = _mod(2n * p[2] * q[2], _P);
    const E = B - A, F = Dd - C, G = Dd + C, Hh = B + A;
    return [_mod(E * F, _P), _mod(G * Hh, _P), _mod(F * G, _P), _mod(E * Hh, _P)];
}
function _extScalarMult(p, e) {
    let q = [0n, 1n, 1n, 0n];
    while (e > 0n) { if (e & 1n) q = _extAdd(q, p); p = _extAdd(p, p); e >>= 1n; }
    return q;
}
function _extEqual(a, b) {
    return _mod(a[0] * b[2] - b[0] * a[2], _P) === 0n && _mod(a[1] * b[2] - b[1] * a[2], _P) === 0n;
}
function _recoverX(y, sign) {
    const y2 = _mod(y * y, _P);
    const u = _mod(y2 - 1n, _P);
    const v = _mod(_D * y2 + 1n, _P);
    let x = _mod(_mod(u * _modPow(v, 3n, _P), _P) * _modPow(_mod(u * _modPow(v, 7n, _P), _P), (_P - 5n) / 8n, _P), _P);
    let vxx = _mod(v * x * x, _P);
    if (_mod(vxx - u, _P) !== 0n) { x = _mod(x * _modPow(2n, (_P - 1n) / 4n, _P), _P); vxx = _mod(v * x * x, _P); }
    if (_mod(vxx - u, _P) !== 0n) return null;
    if ((x & 1n) !== BigInt(sign)) x = _P - x;
    return x;
}
const _BASE = (() => { const y = 4n * _modInv(5n); const x = _recoverX(y, 0); return [x, y, 1n, _mod(x * y, _P)]; })();
function _bytesToBigIntLE(b) { let r = 0n; for (let i = b.length - 1; i >= 0; i--) r = (r << 8n) | BigInt(b[i]); return r; }
function _decodePoint(b) {
    if (!b || b.length !== 32) return null;
    const sign = b[31] >> 7;
    const t = new Uint8Array(b); t[31] &= 0x7f;
    const y = _bytesToBigIntLE(t);
    if (y >= _P) return null;
    const x = _recoverX(y, sign);
    if (x === null) return null;
    return [x, y, 1n, _mod(x * y, _P)];
}
function _concatBytes(a, b, c) {
    const out = new Uint8Array(a.length + b.length + c.length);
    out.set(a, 0); out.set(b, a.length); out.set(c, a.length + b.length);
    return out;
}

/**
 * ed25519 验签（RFC 8032 §5.1.7）
 * @returns {boolean}
 */
function ed25519Verify(sig, msg, pub) {
    if (!sig || sig.length !== 64 || !pub || pub.length !== 32) return false;
    const A = _decodePoint(pub);
    if (!A) return false;
    const R = _decodePoint(sig.subarray(0, 32));
    if (!R) return false;
    const S = _bytesToBigIntLE(sig.subarray(32, 64));
    if (S >= _L) return false;
    const h = _bytesToBigIntLE(_sha512(_concatBytes(sig.subarray(0, 32), pub, msg)));
    const hInt = _mod(h, _L);
    return _extEqual(_extScalarMult(_BASE, S), _extAdd(R, _extScalarMult(A, hInt)));
}

/**
 * 校验已签名的更新清单
 * @param {string} manifestText  update-manifest.json 的原文（字符串）
 * @param {string} sigHex        manifest.sig 的内容（hex 或 base64，这里用 hex）
 * @returns {object|null} 校验通过返回 {version, files}，否则 null
 */
function verifyUpdateManifest(manifestText, sigHex) {
    try {
        if (!UPDATE_PUBKEY_HEX || UPDATE_PUBKEY_HEX.length !== 64) {
            logError("[防篡改] 公钥未配置，拒绝更新");
            return null;
        }
        const pub = _hexToBytes(UPDATE_PUBKEY_HEX);
        const sig = _hexToBytes(String(sigHex).trim());
        const msg = _utf8Encode(manifestText);
        if (!ed25519Verify(sig, msg, pub)) {
            logError("[防篡改] 清单签名校验失败，拒绝更新（疑似被篡改）");
            return null;
        }
        const man = JSON.parse(manifestText);
        if (!man || typeof man !== "object" || !man.files) {
            logError("[防篡改] 清单结构不合法");
            return null;
        }
        return man;
    } catch (e) {
        logError("[防篡改] 清单解析失败: " + e.message);
        return null;
    }
}

/**
 * 计算待写盘内容的哈希（与写盘前的 \r 归一化规则一致）
 */
function hashUpdateContent(content) {
    return _sha256HexOfStr(String(content).replace(/\r/g, ""));
}

// ══════════════════════════════════════════════════════════════════════════

// 异步网络请求管理器
class AsyncNetworkManager {
    static async httpGet(url, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`请求超时: ${url}`));
            }, timeout);

            network.httpGet(url, (status, result) => {
                //clearTimeout(timer);
                if (status === 200) {
                    resolve(result);
                } else {
                    reject(new Error(`请求失败,状态码: ${status}`));
                }
            });
        });
    }

    static async httpPost(url, data, contentType = 'application/json', timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`请求超时: ${url}`));
            }, timeout);

            network.httpPost(url, data, contentType, (status, result) => {
                clearInterval(timer);   // LSE 没有 clearTimeout；clearInterval 可取消延迟任务
                if (status === 200) {
                    resolve(result);
                } else {
                    reject(new Error(`请求失败,状态码: ${status}`));
                }
            });
        });
    }
}

function compareVersions(v1, v2) {
    // 将版本号拆分成数字数组 ("2.3.9" => [2, 3, 9])
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    // 比较每个分段
    const maxLength = Math.max(parts1.length, parts2.length);
    for (let i = 0; i < maxLength; i++) {
        // 处理长度不一致的情况(缺失的部分视为0)
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;
        
        if (num1 > num2) return 1;   // v1 > v2
        if (num1 < num2) return -1;  // v1 < v2
    }
    return 0;  // 版本相同
}

class AsyncUpdateChecker {
    /**
     * 所有已知模块的完整列表（硬编码兜底）
     * 用于在 config.json 尚未迁移时补全缺失条目
     */
    static get KNOWN_FILES() {
        return [
            { url: 'YEssential.js',                    path: 'YEssential.js' },  //1
            { url: 'modules/I18n.js',                  path: './modules/I18n.js' },  //2
            { url: 'modules/Cleanmgr.js',              path: './modules/Cleanmgr.js' },  //3
            { url: 'modules/ConfigManager.js',         path: './modules/ConfigManager.js' },  //4
            { url: 'modules/AsyncUpdateChecker.js',    path: './modules/AsyncUpdateChecker.js' },  //5
            { url: 'modules/RadomTeleportSystem.js',   path: './modules/RadomTeleportSystem.js' },
            { url: 'modules/Bstats.js',                path: './modules/Bstats.js' },
            { url: 'modules/Cd.js',                    path: './modules/Cd.js' },
            { url: 'modules/PVP.js',                   path: './modules/PVP.js' },
            { url: 'modules/Fcam.js',                  path: './modules/Fcam.js' },  //10
            { url: "modules/Redpacket.js",             path: "./modules/Redpacket.js"},
            { url: 'modules/Notice.js',                path: './modules/Notice.js' },
            { url: 'modules/Sign.js',                  path: './modules/Sign.js' },
            { url: 'modules/Crash.js',                 path: './modules/Crash.js' },
            { url: 'modules/Home.js',                  path: './modules/Home.js'},
            { url: 'modules/PluginInfo.js',            path: './modules/PluginInfo.js'},
            { url: 'modules/Warp.js',                  path: './modules/Warp.js'},
            { url: 'modules/CachePool.js',             path: './modules/CachePool.js'},
            { url: 'modules/WriteBackStore.js',        path: './modules/WriteBackStore.js'},
            { url: 'modules/WebConsole.js', path: './modules/WebConsole.js' },
            { url: 'web/index.html', path: './web/index.html' },
            { url: 'web/assets/app.js', path: './web/assets/app.js' },
            { url: 'web/assets/index.js', path: './web/assets/index.js' },
            { url: 'web/assets/index.css', path: './web/assets/index.css' }
        ];
    }

    /**
     * 获取更新配置
     * 从 ConfigManager 读取，如果不存在则使用默认配置。
     * ★ 不再强制 merge KNOWN_FILES，尊重服主对 config 的修改。
     *   新模块缺失检测由 checkMissingFiles() 的第二阶段负责。
     */
    static getConfig() {
        try {
            // Update 配置已迁移至独立的 Updateconfig.json
            // 优先从 globalThis.updateConf 读取，回退到旧的 conf（兼容迁移期）
            const src = globalThis.updateConf || conf;
            const updateConfig = src.get("Update");

            if (updateConfig && typeof updateConfig === 'object') {
                return {
                    versionUrl: updateConfig.versionUrl || 'https://plugin.tobecraft.xyz/file/manifest.json',
                    baseUrl:    updateConfig.baseUrl    || 'https://plugin.tobecraft.xyz/file/',
                    files:      Array.isArray(updateConfig.files) ? updateConfig.files : [],
                    reloadDelay: updateConfig.reloadDelay || 1000,
                    timeout:     updateConfig.timeout     || 30000,
                    checkMissingFilesOnStart: updateConfig.checkMissingFilesOnStart !== undefined
                        ? updateConfig.checkMissingFilesOnStart
                        : true
                };
            }
        } catch (error) {
            logWarn(`读取更新配置失败: ${error.message}，使用默认配置`);
        }

        // config.json 完全不存在时的后备方案
        return {
            versionUrl: 'https://plugin.tobecraft.xyz/file/manifest.json',
            baseUrl:    'https://plugin.tobecraft.xyz/file/',
            files:      this.KNOWN_FILES,
            reloadDelay: 1000,
            timeout:     30000,
            checkMissingFilesOnStart: true
        };
    }

    /**
     * 初始化更新检查器
     * 在插件加载时调用
     */
    static async init() {
        try {
            const config = this.getConfig();
            
            // 检查缺失文件
            if (config.checkMissingFilesOnStart) {
                const missingFiles = await this.checkMissingFiles();
                
                if (missingFiles.length > 0) {
                    logWarn(`检测到 ${missingFiles.length} 个核心文件缺失:`);
                    missingFiles.forEach(file => {
                        logWarn(`  - ${file.path}`);
                    });
                    
                    // 自动触发更新以修复缺失文件
                    logWarn("正在尝试自动修复缺失文件...");
                    await this.repairMissingFiles(missingFiles);
                }
            }
        } catch (error) {
            logError(`初始化更新检查器失败: ${error.message}`);
        }
    }

    /**
     * 检查缺失的文件
     *
     * 分两个阶段：
     *   阶段一：检查 config.Update.files 列出的文件是否存在于磁盘
     *           → 服主自己管理的列表，缺了就修复
     *   阶段二：检查 KNOWN_FILES 中不在 config 列表里且磁盘上也不存在的文件
     *           → 这是新版本新增的模块，旧 config 还没有记录，需要自动补全下载
     *           → 如果磁盘上已存在则跳过（说明服主自行放置或故意保留），不重复下载
     *
     * 这样服主从 config 里删掉某个模块条目后，只要磁盘上还有那个文件，
     * 就不会被强制重新下载，完全尊重服主的配置意图。
     *
     * @returns {Array} 缺失文件列表
     */
    static async checkMissingFiles() {
        const config = this.getConfig();
        const missingFiles = [];

    for (const file of config.files) {
        const fullPath = pluginpath + file.path;
        try {
            if (!File.exists(fullPath)) {
                missingFiles.push(file);
                logWarn(`文件缺失 [config]: ${file.path}`);
            }
        } catch (error) {
            logError(`检查文件 ${file.path} 时出错: ${error.message}`);
        }
    }
    return missingFiles;
    }

    /**
     * 修复缺失的文件
     * @param {Array} missingFiles 缺失文件列表
     */
    static async repairMissingFiles(missingFiles) {
        try {
            randomGradientLog("开始下载缺失文件...");

            // 防篡改：修复路径同样先验签清单
            const hashMap = await this.fetchVerifiedHashMap();

            // 下载缺失的文件
            const downloadResults = await this.downloadSpecificFiles(missingFiles, hashMap);
            
            // 检查下载结果
            const failedDownloads = downloadResults.filter(r => !r.success);
            if (failedDownloads.length > 0) {
                logError(`${failedDownloads.length} 个文件下载失败:`);
                failedDownloads.forEach(r => {
                    logError(`  - ${r.file.path}: ${r.error}`);
                });
                throw new Error(`${failedDownloads.length} 个文件下载失败`);
            }

            // 写入所有文件
            await this.writeAllFiles(downloadResults);
            
            colorLog("green", `成功修复 ${downloadResults.length} 个缺失文件`);
            randomGradientLog("文件修复完成,插件将在稍后重载");
            
            // 延迟重载插件
            await this.reloadPlugin();
            
        } catch (error) {
            logError(`修复缺失文件失败: ${error.message}`);
            logWarn("请手动重新下载插件或联系开发者");
        }
    }

    /**
     * 下载指定的文件列表
     * @param {Array} fileList 要下载的文件列表
     */
    static async downloadSpecificFiles(fileList, hashMap) {
        const config = this.getConfig();

        const downloadPromises = fileList.map(async (file) => {
            try {
                randomGradientLog(`下载文件: ${file.url}`);

                const data = await AsyncNetworkManager.httpGet(
                    config.baseUrl + file.url,
                    config.timeout
                );

                // 移除回车符,统一换行符
                const processedData = data.replace(/\r/g, '');

                // 防篡改：比对清单里的 SHA-256（哈希规则与上面的 \r 归一化一致）
                if (hashMap) {
                    // 路径归一化：清单用干净路径（modules/X.js），本地可能写成 ./modules/X.js
                    const key = String(file.path || file.url).replace(/^\.\//, "");
                    const want = hashMap[key];
                    if (!want) {
                        logError(`[防篡改] 清单里没有 ${key}，拒绝使用`);
                        return { success: false, file: file, error: "清单缺少该文件" };
                    }
                    const got = hashUpdateContent(processedData);
                    if (got !== String(want).toLowerCase()) {
                        logError(`[防篡改] ${key} 哈希不匹配，拒绝写入`);
                        return { success: false, file: file, error: "哈希不匹配" };
                    }
                }

                return {
                    success: true,
                    file: file,
                    data: processedData
                };
            } catch (error) {
                logError(`下载 ${file.url} 失败: ${error.message}`);
                return {
                    success: false,
                    file: file,
                    error: error.message
                };
            }
        });

        return await Promise.all(downloadPromises);
    }

    /**
     * 检查更新
     */
    static async checkForUpdates(currentVersion) {
        try {
            randomGradientLog(lang.get("Upd.check"));
            
            // 获取远程版本信息
            const versionInfo = await this.fetchRemoteVersion();
            if (!versionInfo) {
                return;
            }

            const { version: remoteVersion, changelog } = versionInfo;
            
            // 比较版本
            const comparison = compareVersions(remoteVersion, currentVersion);
            
            if (comparison > 0) {
                // 有新版本
                logWarn(`发现新版本! ${currentVersion} → ${remoteVersion}`);
                if (changelog) {
                    logInfo(`更新内容: ${changelog}`);
                }
                await this.downloadUpdate(remoteVersion);
            } else if (comparison < 0) {
                // 本地版本更新
                logWarn(`您的本地版本比远程版本更新! (${currentVersion} > ${remoteVersion})`);
            } else {
                // 已是最新版本
                randomGradientLog(`您已是最新版本 (${currentVersion})`);
                
                // 即使是最新版本,也检查文件完整性
                const missingFiles = await this.checkMissingFiles();
                if (missingFiles.length > 0) {
                    logWarn("检测到文件缺失,正在修复...");
                    await this.repairMissingFiles(missingFiles);
                }
            }
        } catch (error) {
            logError(`更新检查失败: ${error.message}`);
            this.handleUpdateError(error);
        }
    }

    /**
     * 获取远程版本信息
     */
    static async fetchRemoteVersion() {
        const config = this.getConfig();
        
        try {
            const result = await AsyncNetworkManager.httpGet(
                config.versionUrl,
                config.timeout
            );
            
            const jsonData = JSON.parse(result);
            
            // 验证版本信息格式
            if (!jsonData.version) {
                throw new Error('版本信息格式错误: 缺少 version 字段');
            }
            
            return jsonData;
        } catch (error) {
            if (error.message.includes('timeout')) {
                logError(lang.get('Upd.timeout'));
            } else if (error.message.includes('parse')) {
                logError(lang.get('Upd.json.error'));
            }
            throw error;
        }
    }

    /**
     * 下载并安装更新
     */
    static async downloadUpdate(version) {
        try {
            logWarn(`正在更新到 ${version} 中.....`);
            
            // 创建备份
            const backupSuccess = await this.createBackup();
            if (!backupSuccess) {
                logWarn('备份失败,但继续更新...');
            }

            // 防篡改：先校验签名清单（失败则中止，不下载不写盘）
            const hashMap = await this.fetchVerifiedHashMap();

            // 下载所有文件
            const downloadResults = await this.downloadAllFiles(hashMap);
            
            // 检查下载结果
            const failedDownloads = downloadResults.filter(r => !r.success);
            if (failedDownloads.length > 0) {
                throw new Error(`${failedDownloads.length} 个文件下载失败`);
            }

            // 写入所有文件
            await this.writeAllFiles(downloadResults);
            
            randomGradientLog(lang.get("Upd.success"));
            randomGradientLog(`成功下载 ${downloadResults.length} 个文件`);
            
            // 延迟重载插件
            await this.reloadPlugin();
            
        } catch (error) {
            logError(`${lang.get("Upd.fail")}: ${error.message}`);
            
            // 尝试恢复备份
            await this.restoreBackup();
            throw error;
        }
    }

    /**
     * 下载并校验签名清单，返回 {路径: sha256} 映射
     * 校验失败会抛异常 —— 调用方必须中止更新（fail closed）
     */
    static async fetchVerifiedHashMap() {
        const config = this.getConfig();
        const manifestText = await AsyncNetworkManager.httpGet(
            config.baseUrl + "update-manifest.json", config.timeout);
        const sigText = await AsyncNetworkManager.httpGet(
            config.baseUrl + "manifest.sig", config.timeout);
        const man = verifyUpdateManifest(manifestText, sigText);
        if (!man) throw new Error("更新清单签名校验失败");
        return man.files;
    }

    /**
     * 下载所有更新文件
     */
    static async downloadAllFiles(hashMap) {
        const config = this.getConfig();
        return await this.downloadSpecificFiles(config.files, hashMap);
    }

    /**
     * 写入所有文件
     */
    static async writeAllFiles(downloadResults) {
        const writePromises = downloadResults
            .filter(result => result.success)
            .map(async (result) => {
                try {
                    const fullPath = pluginpath + result.file.path;
                    
                    // 确保目标目录存在
                    const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
                    if (!File.exists(dirPath)) {
                        File.createDir(dirPath);
                    }
                    
                    // 写入文件(使用原生方法)
                    File.writeTo(fullPath, result.data);
                    randomGradientLog(`写入文件成功: ${result.file.path}`);
                    return true;
                } catch (error) {
                    logError(`写入 ${result.file.path} 失败: ${error.message}`);
                    throw error;
                }
            });

        await Promise.all(writePromises);
    }

    /**
     * 创建备份
     */
    static async createBackup() {
        const config = this.getConfig();
        
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupDir = pluginpath + `./backups/backup_${timestamp}/`;
            
            randomGradientLog(lang.get("Upd.backup.now"));
            
            // 确保备份目录存在(使用原生方法)
            if (!File.exists(backupDir)) {
                File.createDir(backupDir);
            }
            
            // 备份所有文件
            for (const file of config.files) {
                const sourcePath = pluginpath + file.path;
                const backupPath = backupDir + file.path;
                
                try {
                    // 检查源文件是否存在
                    if (!File.exists(sourcePath)) {
                        logWarn(`源文件不存在: ${file.path}`);
                        continue;
                    }
                    
                    // 确保目标目录存在
                    const targetDir = backupPath.substring(0, backupPath.lastIndexOf('/'));
                    if (!File.exists(targetDir)) {
                        File.createDir(targetDir);
                    }
                    
                    // 读取并写入文件
                    const content = File.readFrom(sourcePath);
                    if (content !== null) {
                        File.writeTo(backupPath, content);
                        randomGradientLog(`备份文件: ${file.path}`);
                    }
                } catch (error) {
                    logWarn(`备份 ${file.path} 失败: ${error.message}`);
                }
            }
            
            logInfo(`备份完成: ${backupDir}`);
            
            // 保存备份路径以便恢复
            this._lastBackupPath = backupDir;
            
            return true;
        } catch (error) {
            logError(`创建备份失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 恢复备份
     */
    static async restoreBackup() {
        const config = this.getConfig();
        
        if (!this._lastBackupPath) {
            logWarn(lang.get("No.backup.canuse"));
            return false;
        }

        try {
            logWarn(lang.get("Upd.fail.backing"));
            
            for (const file of config.files) {
                const backupPath = this._lastBackupPath + file.path;
                const targetPath = pluginpath + file.path;
                
                try {
                    // 检查备份文件是否存在
                    if (!File.exists(backupPath)) {
                        logWarn(`备份文件不存在: ${file.path}`);
                        continue;
                    }
                    
                    const content = File.readFrom(backupPath);
                    if (content !== null) {
                        File.writeTo(targetPath, content);
                        randomGradientLog(`恢复文件: ${file.path}`);
                    }
                } catch (error) {
                    logError(`恢复 ${file.path} 失败: ${error.message}`);
                }
            }
            
            colorLog("yellow", lang.get("Upd.back.success"));
            return true;
        } catch (error) {
            logError(`恢复备份失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 重载插件
     */
    static async reloadPlugin() {
        const config = this.getConfig();
        
        return new Promise((resolve) => {
            logInfo(`${config.reloadDelay / 1000} 秒后重载插件...`);
            
            setTimeout(() => {
                try {
                    mc.runcmdEx("ll reload YEssential");
                    resolve(true);
                } catch (error) {
                    logError(`重载插件失败: ${error.message}`);
                    logWarn('请手动执行: ll reload YEssential');
                    resolve(false);
                }
            }, config.reloadDelay);
        });
    }

    /**
     * 处理更新错误
     */
    static handleUpdateError(error) {
        if (error.message.includes('network') || error.message.includes('timeout')) {
            logWarn(lang.get('network.error.1'));
        } else if (error.message.includes('permission')) {
            logWarn(lang.get('file.permission.error'));
        } else if (error.message.includes('parse')) {
            logWarn(lang.get('file.parse.error'));
        }
    }

    /**
     * 清理旧备份(可选功能)
     */
    static async cleanOldBackups(keepCount = 5) {
        try {
            const backupDir = pluginpath + './backups/';
            
            // 检查备份目录是否存在
            if (!File.exists(backupDir)) {
                return;
            }
            
            const backups = File.getFilesList(backupDir);
            if (!backups || backups.length <= keepCount) {
                return;
            }

            // 按时间排序,删除最旧的备份
            backups.sort().reverse();
            const toDelete = backups.slice(keepCount);
            
            for (const backup of toDelete) {
                try {
                    File.delete(backupDir + backup);
                    logInfo(`删除旧备份: ${backup}`);
                } catch (error) {
                    logWarn(`删除备份 ${backup} 失败: ${error.message}`);
                }
            }
        } catch (error) {
            logWarn(`清理备份失败: ${error.message}`);
        }
    }

    /**
     * 检查网络连接
     */
    static async checkNetworkConnection() {
        const config = this.getConfig();
        
        try {
            await AsyncNetworkManager.httpGet(
                config.versionUrl,
                5000 // 5秒超时
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取更新进度(用于UI显示)
     */
    static getUpdateProgress() {
        return this._updateProgress || {
            total: 0,
            completed: 0,
            currentFile: '',
            status: 'idle'
        };
    }

    /**
     * 手动触发文件完整性检查
     */
    static async checkIntegrity() {
        logInfo("开始检查文件完整性...");
        
        const missingFiles = await this.checkMissingFiles();
        
        if (missingFiles.length === 0) {
            colorLog("green", "所有核心文件完整!");
            return true;
        } else {
            logWarn(`发现 ${missingFiles.length} 个文件缺失`);
            const answer = await this.promptRepair(missingFiles);
            
            if (answer) {
                await this.repairMissingFiles(missingFiles);
            }
            return false;
        }
    }

    /**
     * 提示用户是否修复(可选实现)
     */
    static async promptRepair(missingFiles) {
        // 这里可以实现用户交互逻辑
        // 目前默认自动修复
        return true;
    }
}

// 导出类(如果使用模块系统)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsyncUpdateChecker;
}

// 全局导出(用于直接在主文件中使用)
if (typeof globalThis !== 'undefined') {
    globalThis.AsyncUpdateChecker = AsyncUpdateChecker;
}