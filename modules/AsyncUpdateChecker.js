/**
 * 异步更新检查器
 * 负责检查插件更新并自动下载安装
 */
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
                clearTimeout(timer);
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
    // 更新配置
    static UPDATE_CONFIG = {
        versionUrl: 'https://dl.mcmcc.cc/file/Version.json',
        baseUrl: 'https://dl.mcmcc.cc/file/',
        files: [
            { url: 'YEssential.js', path: 'YEssential.js' },
            { url: 'modules/Cleanmgr.js', path: './modules/Cleanmgr.js' },
            { url: 'modules/ConfigManager.js', path: './modules/ConfigManager.js' },
            { url: 'modules/AsyncUpdateChecker.js', path: './modules/AsyncUpdateChecker.js' },
            { url: 'modules/RadomTeleportSystem.js', path: './modules/RadomTeleportSystem.js' },
            { url: 'modules/Cd.js', path: './modules/Cd.js' }
        ],
        reloadDelay: 1000,
        timeout: 30000, // 30秒超时
        checkMissingFilesOnStart: true // 启动时检查缺失文件
    };

    /**
     * 初始化更新检查器
     * 在插件加载时调用
     */
    static async init() {
        try {
            // 检查缺失文件
            if (this.UPDATE_CONFIG.checkMissingFilesOnStart) {
                const missingFiles = await this.checkMissingFiles();
                
                if (missingFiles.length > 0) {
                    logger.warn(`检测到 ${missingFiles.length} 个核心文件缺失:`);
                    missingFiles.forEach(file => {
                        logger.warn(`  - ${file.path}`);
                    });
                    
                    // 自动触发更新以修复缺失文件
                    logger.warn("正在尝试自动修复缺失文件...");
                    await this.repairMissingFiles(missingFiles);
                }
            }
        } catch (error) {
            logger.error(`初始化更新检查器失败: ${error.message}`);
        }
    }

    /**
     * 检查缺失的文件
     * @returns {Array} 缺失文件列表
     */
    static async checkMissingFiles() {
        const missingFiles = [];
        
        for (const file of this.UPDATE_CONFIG.files) {
            const fullPath = pluginpath + file.path;
            
            try {
                if (!File.exists(fullPath)) {
                    missingFiles.push(file);
                    logger.warn(`文件缺失: ${file.path}`);
                }
            } catch (error) {
                logger.error(`检查文件 ${file.path} 时出错: ${error.message}`);
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
            logger.info("开始下载缺失文件...");
            
            // 下载缺失的文件
            const downloadResults = await this.downloadSpecificFiles(missingFiles);
            
            // 检查下载结果
            const failedDownloads = downloadResults.filter(r => !r.success);
            if (failedDownloads.length > 0) {
                logger.error(`${failedDownloads.length} 个文件下载失败:`);
                failedDownloads.forEach(r => {
                    logger.error(`  - ${r.file.path}: ${r.error}`);
                });
                throw new Error(`${failedDownloads.length} 个文件下载失败`);
            }

            // 写入所有文件
            await this.writeAllFiles(downloadResults);
            
            colorLog("green", `成功修复 ${downloadResults.length} 个缺失文件`);
            logger.info("文件修复完成,插件将在稍后重载");
            
            // 延迟重载插件
            await this.reloadPlugin();
            
        } catch (error) {
            logger.error(`修复缺失文件失败: ${error.message}`);
            logger.warn("请手动重新下载插件或联系开发者");
        }
    }

    /**
     * 下载指定的文件列表
     * @param {Array} fileList 要下载的文件列表
     */
    static async downloadSpecificFiles(fileList) {
        const downloadPromises = fileList.map(async (file) => {
            try {
                logger.info(`下载文件: ${file.url}`);
                
                const data = await AsyncNetworkManager.httpGet(
                    this.UPDATE_CONFIG.baseUrl + file.url,
                    this.UPDATE_CONFIG.timeout
                );
                
                // 移除回车符,统一换行符
                const processedData = data.replace(/\r/g, '');
                
                return {
                    success: true,
                    file: file,
                    data: processedData
                };
            } catch (error) {
                logger.error(`下载 ${file.url} 失败: ${error.message}`);
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
            logger.warn(lang.get("Upd.check"));
            
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
                logger.warn(`发现新版本! ${currentVersion} → ${remoteVersion}`);
                if (changelog) {
                    logger.info(`更新内容: ${changelog}`);
                }
                await this.downloadUpdate(remoteVersion);
            } else if (comparison < 0) {
                // 本地版本更新
                colorLog("red", `您的本地版本比远程版本更新! (${currentVersion} > ${remoteVersion})`);
            } else {
                // 已是最新版本
                colorLog("green", `您已是最新版本 (${currentVersion})`);
                
                // 即使是最新版本,也检查文件完整性
                const missingFiles = await this.checkMissingFiles();
                if (missingFiles.length > 0) {
                    logger.warn("检测到文件缺失,正在修复...");
                    await this.repairMissingFiles(missingFiles);
                }
            }
        } catch (error) {
            logger.error(`更新检查失败: ${error.message}`);
            this.handleUpdateError(error);
        }
    }

    /**
     * 获取远程版本信息
     */
    static async fetchRemoteVersion() {
        try {
            const result = await AsyncNetworkManager.httpGet(
                this.UPDATE_CONFIG.versionUrl,
                this.UPDATE_CONFIG.timeout
            );
            
            const jsonData = JSON.parse(result);
            
            // 验证版本信息格式
            if (!jsonData.version) {
                throw new Error('版本信息格式错误: 缺少 version 字段');
            }
            
            return jsonData;
        } catch (error) {
            if (error.message.includes('timeout')) {
                logger.error(lang.get('Upd.timeout'));
            } else if (error.message.includes('parse')) {
                logger.error(lang.get('Upd.json.error'));
            }
            throw error;
        }
    }

    /**
     * 下载并安装更新
     */
    static async downloadUpdate(version) {
        try {
            logger.warn(`正在更新到 ${version} 中.....`);
            
            // 创建备份
            const backupSuccess = await this.createBackup();
            if (!backupSuccess) {
                logger.warn('备份失败,但继续更新...');
            }

            // 下载所有文件
            const downloadResults = await this.downloadAllFiles();
            
            // 检查下载结果
            const failedDownloads = downloadResults.filter(r => !r.success);
            if (failedDownloads.length > 0) {
                throw new Error(`${failedDownloads.length} 个文件下载失败`);
            }

            // 写入所有文件
            await this.writeAllFiles(downloadResults);
            
            colorLog("green", lang.get("Upd.success"));
            logger.info(`成功下载 ${downloadResults.length} 个文件`);
            
            // 延迟重载插件
            await this.reloadPlugin();
            
        } catch (error) {
            logger.error(`${lang.get("Upd.fail")}: ${error.message}`);
            
            // 尝试恢复备份
            await this.restoreBackup();
            throw error;
        }
    }

    /**
     * 下载所有更新文件
     */
    static async downloadAllFiles() {
        return await this.downloadSpecificFiles(this.UPDATE_CONFIG.files);
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
                    logger.info(`写入文件成功: ${result.file.path}`);
                    return true;
                } catch (error) {
                    logger.error(`写入 ${result.file.path} 失败: ${error.message}`);
                    throw error;
                }
            });

        await Promise.all(writePromises);
    }

    /**
     * 创建备份
     */
    static async createBackup() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupDir = pluginpath + `./backups/backup_${timestamp}/`;
            
            logger.info(lang.get("Upd.backup.now"));
            
            // 确保备份目录存在(使用原生方法)
            if (!File.exists(backupDir)) {
                File.createDir(backupDir);
            }
            
            // 备份所有文件
            for (const file of this.UPDATE_CONFIG.files) {
                const sourcePath = pluginpath + file.path;
                const backupPath = backupDir + file.path;
                
                try {
                    // 检查源文件是否存在
                    if (!File.exists(sourcePath)) {
                        logger.warn(`源文件不存在: ${file.path}`);
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
                        logger.info(`备份文件: ${file.path}`);
                    }
                } catch (error) {
                    logger.warn(`备份 ${file.path} 失败: ${error.message}`);
                }
            }
            
            logger.info(`备份完成: ${backupDir}`);
            
            // 保存备份路径以便恢复
            this._lastBackupPath = backupDir;
            
            return true;
        } catch (error) {
            logger.error(`创建备份失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 恢复备份
     */
    static async restoreBackup() {
        if (!this._lastBackupPath) {
            logger.warn(lang.get("No.backup.canuse"));
            return false;
        }

        try {
            logger.warn(lang.get("Upd.fail.backing"));
            
            for (const file of this.UPDATE_CONFIG.files) {
                const backupPath = this._lastBackupPath + file.path;
                const targetPath = pluginpath + file.path;
                
                try {
                    // 检查备份文件是否存在
                    if (!File.exists(backupPath)) {
                        logger.warn(`备份文件不存在: ${file.path}`);
                        continue;
                    }
                    
                    const content = File.readFrom(backupPath);
                    if (content !== null) {
                        File.writeTo(targetPath, content);
                        logger.info(`恢复文件: ${file.path}`);
                    }
                } catch (error) {
                    logger.error(`恢复 ${file.path} 失败: ${error.message}`);
                }
            }
            
            colorLog("yellow", lang.get("Upd.back.success"));
            return true;
        } catch (error) {
            logger.error(`恢复备份失败: ${error.message}`);
            return false;
        }
    }

    /**
     * 重载插件
     */
    static async reloadPlugin() {
        return new Promise((resolve) => {
            logger.info(`${this.UPDATE_CONFIG.reloadDelay / 1000} 秒后重载插件...`);
            
            setTimeout(() => {
                try {
                    mc.runcmdEx("ll reload YEssential");
                    resolve(true);
                } catch (error) {
                    logger.error(`重载插件失败: ${error.message}`);
                    logger.warn('请手动执行: ll reload YEssential');
                    resolve(false);
                }
            }, this.UPDATE_CONFIG.reloadDelay);
        });
    }

    /**
     * 处理更新错误
     */
    static handleUpdateError(error) {
        if (error.message.includes('network') || error.message.includes('timeout')) {
            logger.warn(lang.get('network.error.1'));
        } else if (error.message.includes('permission')) {
            logger.warn(lang.get('file.permission.error'));
        } else if (error.message.includes('parse')) {
            logger.warn(lang.get('file.parse.error'));
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
                    logger.info(`删除旧备份: ${backup}`);
                } catch (error) {
                    logger.warn(`删除备份 ${backup} 失败: ${error.message}`);
                }
            }
        } catch (error) {
            logger.warn(`清理备份失败: ${error.message}`);
        }
    }

    /**
     * 检查网络连接
     */
    static async checkNetworkConnection() {
        try {
            await AsyncNetworkManager.httpGet(
                this.UPDATE_CONFIG.versionUrl,
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
        logger.info("开始检查文件完整性...");
        
        const missingFiles = await this.checkMissingFiles();
        
        if (missingFiles.length === 0) {
            colorLog("green", "所有核心文件完整!");
            return true;
        } else {
            logger.warn(`发现 ${missingFiles.length} 个文件缺失`);
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