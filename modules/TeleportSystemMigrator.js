/**
 * TeleportSystem to YEssential Data Migrator
 * Author: MengHanLOVE1027
 */

const LTPS_DB_PATH = "./plugins/TeleportSystem/leveldb";
const LTPS_DB_BACKUP_PATH = "./plugins/YEssential/data/TeleportSystem_leveldb/";
const YEST_DATA_PATH = "./plugins/YEssential/data/";

let Migrateconf = new JsonConfigFile(YEST_DATA_PATH + "Migrate_TeleportSystem_to_YEssential.json", JSON.stringify({}));


function randomGradientLog(text) {
    const len = text.length;
    let out = '';
    for (let i = 0; i < len; i++) {
        const t = len <= 1 ? 0 : i / (len - 1);
        const [r, g, b] = globalLerpColor(t);
        out += `\x1b[38;2;${r};${g};${b}m` + text[i];
    }
    logger.log(out + '\x1b[0m');
}

/**
 * 安全解析数据
 * @param {any} data
 */
function safeParse(data) {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            randomGradientLog(`JSON 解析失败: ${e}`);
            return null;
        }
    }
    if (typeof data === 'object' && data !== null) {
        return data; // 已经是对象，直接返回
    }
    return null;
}

/**
 * 执行数据库迁移
 */
function runMigration() {
    if (!File.exists(LTPS_DB_PATH)) {
        randomGradientLog(`未检测到原 TeleportSystem 数据库目录，跳过迁移`);
        return;
    }

    if (!File.exists(LTPS_DB_BACKUP_PATH)) {
        File.copy(LTPS_DB_PATH, LTPS_DB_BACKUP_PATH)
    } else {
        randomGradientLog(`检测到之前拷贝的 TeleportSystem 数据库备份目录，跳过迁移操作`);
    }

    if (!File.exists(YEST_DATA_PATH + "Migrate_TeleportSystem_to_YEssential.json")) {
        Migrateconf.set("migration", "0");
    }

    if (Migrateconf.get("migration") == 1) return;

    randomGradientLog(`检测到原 TeleportSystem 数据库，正在读取...`);

    randomGradientLog(`已拷贝原数据库到: ${LTPS_DB_BACKUP_PATH}`);

    let db = null;
    try {
        db = new KVDatabase(LTPS_DB_BACKUP_PATH);

        // 1. 迁移 Home 数据
        const rawHome = db.get("home");
        const ltpsHome = safeParse(rawHome);

        if (ltpsHome) {
            randomGradientLog(`正在处理 Home 数据...`);
            const yHome = {};

            for (let playerName in ltpsHome) {
                yHome[playerName] = {};
                let homes = ltpsHome[playerName];

                if (Array.isArray(homes)) {
                    homes.forEach(home => {
                        let homeName = home.name || "default";
                        yHome[playerName][homeName] = {
                            "x": Number(home.x).toFixed(1),
                            "y": Number(home.y).toFixed(1),
                            "z": Number(home.z).toFixed(1),
                            "dimid": Number(home.dimid)
                        };
                    });
                }
            }

            if (!File.exists(YEST_DATA_PATH)) File.mkdir(YEST_DATA_PATH);
            File.writeTo(YEST_DATA_PATH + "homedata.json", JSON.stringify(yHome, null, 4));
            randomGradientLog(`Home 数据迁移成功！`);
        } else {
            randomGradientLog(`未在数据库中找到有效的 Home 数据`);
            return;
        }

        // 2. 迁移 Warp 数据
        const rawWarp = db.get("warp");
        const ltpsWarp = safeParse(rawWarp);

        if (ltpsWarp) {
            randomGradientLog(`正在处理 Warp 数据...`);
            const yWarp = {};

            if (Array.isArray(ltpsWarp)) {
                ltpsWarp.forEach(warp => {
                    let warpName = warp.name || "default";
                    yWarp[warpName] = {
                        "x": Number(warp.x).toFixed(1),
                        "y": Number(warp.y).toFixed(1),
                        "z": Number(warp.z).toFixed(1),
                        "dimid": Number(warp.dimid)
                    };
                });
            }

            if (!File.exists(YEST_DATA_PATH)) File.mkdir(YEST_DATA_PATH);
            File.writeTo(YEST_DATA_PATH + "warpdata.json", JSON.stringify(yWarp, null, 4));
            randomGradientLog(`Warp 数据迁移成功！`);
        } else {
            randomGradientLog(`未在数据库中找到有效的 Warp 数据`);
            return;
        }

        randomGradientLog(`迁移任务结束`);

        // 完成后给TeleportSystem上标志
        Migrateconf.set("migration", "1");

        setTimeout(() => {
            try {
                mc.runcmdEx("ll reload YEssential");
            } catch (error) {
                logger.error(`重载插件失败: ${error.message}`);
                logger.warn('请手动执行: ll reload YEssential');
            }
        }, 5000);

    } catch (err) {
        randomGradientLog(`迁移过程中发生严重错误: ${err}`);
    } finally {
        if (db) db.close();
    }

}

// 插件加载时自动执行
(function init() {
    setTimeout(() => {
        runMigration();
    }, 3000);
})();

module.exports = {
    runMigration: runMigration
};
