#!/usr/bin/env node
/**
 * 生成并签名「更新清单」
 *
 * 产物：
 *   update-manifest.json   { version, files: { 路径: sha256hex } }
 *   manifest.sig           对 update-manifest.json 原文的 ed25519 签名（hex）
 *
 * 哈希规则（必须与插件端 hashUpdateContent 一致）：
 *   SHA-256( UTF-8( 去掉 \r 后的内容 ) )
 *   因为插件下载后会执行 data.replace(/\r/g, '')，发布侧必须按同样规则计算。
 *
 * 用法：
 *   UPDATE_SIGNING_KEY=<base64 PKCS8 私钥> node tools/sign-update.mjs [--dir .]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash, sign as edSign, generateKeyPairSync, createPrivateKey } from "node:crypto";

const args = process.argv.slice(2);
const dirIdx = args.indexOf("--dir");
const ROOT = dirIdx >= 0 ? args[dirIdx + 1] : ".";

// 与插件端 AsyncUpdateChecker.KNOWN_FILES 保持一致（干净路径，无 ./ 前缀）
const FILES = [
    "YEssential.js",
    "manifest.json",
    "modules/I18n.js",
    "modules/Cleanmgr.js",
    "modules/ConfigManager.js",
    "modules/AsyncUpdateChecker.js",
    "modules/RadomTeleportSystem.js",
    "modules/Bstats.js",
    "modules/Cd.js",
    "modules/PVP.js",
    "modules/Fcam.js",
    "modules/Redpacket.js",
    "modules/Home.js",
    "modules/Warp.js",
    "modules/Sign.js",
    "modules/PluginInfo.js",
    "modules/CachePool.js",
    "modules/Crash.js",
    "modules/WriteBackStore.js"
];

function hashContent(buf) {
    // 关键：去掉 \r 再哈希，与插件端规则一致
    const normalized = Buffer.from(buf.toString("utf8").replace(/\r/g, ""), "utf8");
    return createHash("sha256").update(normalized).digest("hex");
}

const manifest = { version: "", files: {} };
const verRaw = readFileSync(join(ROOT, "manifest.json"), "utf8");
manifest.version = JSON.parse(verRaw).version;

for (const rel of FILES) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) {
        console.error(`!! 缺少文件: ${rel}`);
        process.exit(1);
    }
    manifest.files[rel] = hashContent(readFileSync(p));
    console.log(`  ${rel}  ${manifest.files[rel].slice(0, 16)}…`);
}

const manifestText = JSON.stringify(manifest, null, 2);
writeFileSync(join(ROOT, "update-manifest.json"), manifestText);
console.log(`\n已写 update-manifest.json（版本 ${manifest.version}，${FILES.length} 个文件）`);

// ---- 签名 ----
const keyB64 = process.env.UPDATE_SIGNING_KEY;
if (!keyB64) {
    console.log("\n未提供 UPDATE_SIGNING_KEY，跳过签名（仅生成清单）");
    process.exit(0);
}
const priv = createPrivateKey(Buffer.from(keyB64, "base64"));
const sig = edSign(null, Buffer.from(manifestText, "utf8"), priv);
writeFileSync(join(ROOT, "manifest.sig"), sig.toString("hex"));
console.log(`已写 manifest.sig（${sig.length} 字节 ed25519 签名）`);
