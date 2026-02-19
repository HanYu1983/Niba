const fs = require('fs');
const path = require('path');

/**
 * 獲取檔案的MIME類型
 * @param {string} filePath - 檔案路徑
 * @returns {string} MIME類型
 */
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.txt': 'text/plain',
        '.xml': 'application/xml',
        '.pdf': 'application/pdf'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * 將指定目錄下的所有檔案轉換為dataUrl並存儲到JSON檔案中
 * @param {string} targetDir - 目標目錄路徑
 * @param {string} outputFile - 輸出JSON檔案路徑
 * @param {Array} excludeDirs - 要排除的目錄名稱陣列
 * @param {Array} excludeFiles - 要排除的檔案名稱陣列
 */
function convertDirectoryToDataUrlJSON(targetDir, outputFile, excludeDirs = [], excludeFiles = []) {
    const result = {};
    
    /**
     * 遞歸遍歷目錄
     * @param {string} dir - 當前目錄
     * @param {string} relativePath - 相對路徑
     */
    function traverseDirectory(dir, relativePath = '') {
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const relativeItemPath = relativePath ? path.join(relativePath, item) : item;
                
                // 檢查是否為目錄
                if (fs.statSync(itemPath).isDirectory()) {
                    // 跳過排除的目錄
                    if (!excludeDirs.includes(item)) {
                        traverseDirectory(itemPath, relativeItemPath);
                    }
                } else {
                    // 跳過排除的檔案
                    if (!excludeFiles.includes(item)) {
                        try {
                            // 讀取檔案並轉換為dataUrl
                            const fileBuffer = fs.readFileSync(itemPath);
                            const base64 = fileBuffer.toString('base64');
                            const mimeType = getMimeType(itemPath);
                            const dataUrl = `data:${mimeType};base64,${base64}`;
                            
                            // 使用相對路徑作為key
                            result[relativeItemPath] = dataUrl;
                            console.log(`已轉換: ${relativeItemPath} (${mimeType})`);
                        } catch (error) {
                            console.error(`無法讀取檔案: ${relativeItemPath}`, error.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`無法讀取目錄: ${dir}`, error.message);
        }
    }
    
    // 開始遍歷
    console.log(`開始轉換目錄: ${targetDir}`);
    traverseDirectory(targetDir);
    
    // 寫入JSON檔案
    try {
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
        console.log(`轉換完成！共轉換 ${Object.keys(result).length} 個檔案`);
        console.log(`輸出檔案: ${outputFile}`);
        
        // 計算並顯示輸出檔案大小
        const outputStats = fs.statSync(outputFile);
        const outputSizeBytes = outputStats.size;
        const outputSizeKB = (outputSizeBytes / 1024).toFixed(2);
        const outputSizeMB = (outputSizeBytes / (1024 * 1024)).toFixed(2);
        
        console.log(`輸出檔案大小: ${outputSizeBytes} bytes (${outputSizeKB} KB / ${outputSizeMB} MB)`);
    } catch (error) {
        console.error('寫入JSON檔案時發生錯誤:', error.message);
    }
}

/**
 * 將指定目錄下的所有檔案轉換為base64並存儲到JSON檔案中（向後兼容函數）
 * @param {string} targetDir - 目標目錄路徑
 * @param {string} outputFile - 輸出JSON檔案路徑
 * @param {Array} excludeDirs - 要排除的目錄名稱陣列
 * @param {Array} excludeFiles - 要排除的檔案名稱陣列
 */
function convertDirectoryToBase64JSON(targetDir, outputFile, excludeDirs = [], excludeFiles = []) {
    const result = {};
    
    /**
     * 遞歸遍歷目錄
     * @param {string} dir - 當前目錄
     * @param {string} relativePath - 相對路徑
     */
    function traverseDirectory(dir, relativePath = '') {
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const relativeItemPath = relativePath ? path.join(relativePath, item) : item;
                
                // 檢查是否為目錄
                if (fs.statSync(itemPath).isDirectory()) {
                    // 跳過排除的目錄
                    if (!excludeDirs.includes(item)) {
                        traverseDirectory(itemPath, relativeItemPath);
                    }
                } else {
                    // 跳過排除的檔案
                    if (!excludeFiles.includes(item)) {
                        try {
                            // 讀取檔案並轉換為base64
                            const fileBuffer = fs.readFileSync(itemPath);
                            const base64 = fileBuffer.toString('base64');
                            
                            // 使用相對路徑作為key
                            result[relativeItemPath] = base64;
                            console.log(`已轉換: ${relativeItemPath}`);
                        } catch (error) {
                            console.error(`無法讀取檔案: ${relativeItemPath}`, error.message);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`無法讀取目錄: ${dir}`, error.message);
        }
    }
    
    // 開始遍歷
    console.log(`開始轉換目錄: ${targetDir}`);
    traverseDirectory(targetDir);
    
    // 寫入JSON檔案
    try {
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
        console.log(`轉換完成！共轉換 ${Object.keys(result).length} 個檔案`);
        console.log(`輸出檔案: ${outputFile}`);
        
        // 計算並顯示輸出檔案大小
        const outputStats = fs.statSync(outputFile);
        const outputSizeBytes = outputStats.size;
        const outputSizeKB = (outputSizeBytes / 1024).toFixed(2);
        const outputSizeMB = (outputSizeBytes / (1024 * 1024)).toFixed(2);
        
        console.log(`輸出檔案大小: ${outputSizeBytes} bytes (${outputSizeKB} KB / ${outputSizeMB} MB)`);
    } catch (error) {
        console.error('寫入JSON檔案時發生錯誤:', error.message);
    }
}

/**
 * 獲取檔案大小（以MB為單位）
 * @param {string} filePath - 檔案路徑
 * @returns {number} 檔案大小（MB）
 */
function getFileSizeMB(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size / (1024 * 1024);
    } catch (error) {
        return 0;
    }
}

/**
 * 計算目錄總大小
 * @param {string} targetDir - 目標目錄
 * @returns {number} 總大小（MB）
 */
function calculateDirectorySize(targetDir) {
    let totalSize = 0;
    
    function calculateSize(dir) {
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const itemPath = path.join(dir, item);
                const stats = fs.statSync(itemPath);
                
                if (stats.isDirectory()) {
                    calculateSize(itemPath);
                } else {
                    totalSize += stats.size;
                }
            }
        } catch (error) {
            console.error(`無法讀取目錄: ${dir}`, error.message);
        }
    }
    
    calculateSize(targetDir);
    return totalSize / (1024 * 1024);
}

// 如果直接運行此腳本
if (require.main === module) {
    // 設定參數
    const targetDir = process.argv[2] || path.join(__dirname, 'dist');
    const outputFile = process.argv[3] || path.join(__dirname, 'files_base64.json');
    
    // 預設排除的目錄和檔案
    const excludeDirs = ['node_modules', '.git', '.vscode', '.idea'];
    const excludeFiles = ['.DS_Store', 'Thumbs.db'];
    
    console.log(`目標目錄: ${targetDir}`);
    console.log(`輸出檔案: ${outputFile}`);
    
    // 計算目錄大小
    const dirSize = calculateDirectorySize(targetDir);
    console.log(`目錄總大小: ${dirSize.toFixed(2)} MB`);
    
    // 執行轉換
    convertDirectoryToDataUrlJSON(targetDir, outputFile, excludeDirs, excludeFiles);
}

module.exports = { 
    convertDirectoryToDataUrlJSON, 
    convertDirectoryToBase64JSON, // 保留舊函數以向後兼容
    getMimeType,
    getFileSizeMB, 
    calculateDirectorySize 
};