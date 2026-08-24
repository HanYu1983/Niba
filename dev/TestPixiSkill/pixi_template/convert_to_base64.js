const fs = require('fs');
const path = require('path');

// 讀取 HTML 文件
function readHTMLFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// 將文件轉換為 base64
function fileToBase64(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    } catch (error) {
        console.error(`無法讀取文件: ${filePath}`, error.message);
        return null;
    }
}

// 獲取 MIME 類型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

// 替換 src 屬性為 base64
function replaceSrcWithBase64(html, baseDir) {
    // 處理 script 標籤 - 將 JS 代碼直接內聯寫入 HTML
    html = html.replace(
        /<script\s+src="([^"]+)"[^>]*>/gi,
        (match, src) => {
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                return match; // 跳過外部 URL 和已經是 data URI 的內容
            }
            
            const filePath = path.join(baseDir, src);
            
            try {
                const jsContent = fs.readFileSync(filePath, 'utf8');
                console.log(`內聯 JS 代碼: ${src}`);
                return `<script>\n${jsContent}\n</script>`;
            } catch (error) {
                console.warn(`無法讀取 JS 文件: ${src}`, error.message);
                return match;
            }
        }
    );

    // 處理 img 標籤
    html = html.replace(
        /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi,
        (match, before, src, after) => {
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                return match; // 跳過外部 URL 和已經是 base64 的內容
            }
            
            const filePath = path.join(baseDir, src);
            const base64 = fileToBase64(filePath);
            
            if (base64) {
                const mimeType = getMimeType(filePath);
                console.log(`轉換 img: ${src} -> base64`);
                return `<img ${before}src="data:${mimeType};base64,${base64}"${after}>`;
            } else {
                console.warn(`無法轉換 img: ${src}`);
                return match;
            }
        }
    );

    // 處理 video source 標籤
    html = html.replace(
        /<source\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi,
        (match, before, src, after) => {
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                return match; // 跳過外部 URL 和已經是 base64 的內容
            }
            
            const filePath = path.join(baseDir, src);
            const base64 = fileToBase64(filePath);
            
            if (base64) {
                const mimeType = getMimeType(filePath);
                console.log(`轉換 video source: ${src} -> base64`);
                return `<source ${before}src="data:${mimeType};base64,${base64}"${after}>`;
            } else {
                console.warn(`無法轉換 video source: ${src}`);
                return match;
            }
        }
    );

    return html;
}

// 主函數
function convertHTMLToBase64(inputFile, outputFile) {
    try {
        console.log(`開始轉換: ${inputFile} -> ${outputFile}`);
        
        // 讀取原始 HTML 文件
        const html = readHTMLFile(inputFile);
        
        // 獲取基礎目錄
        const baseDir = path.dirname(inputFile);
        
        // 替換所有外部資源為 base64
        const convertedHTML = replaceSrcWithBase64(html, baseDir);
        
        // 寫入輸出文件
        fs.writeFileSync(outputFile, convertedHTML, 'utf8');
        
        console.log(`轉換完成！輸出文件: ${outputFile}`);
        
    } catch (error) {
        console.error('轉換過程中發生錯誤:', error.message);
    }
}

// 如果直接運行此腳本
if (require.main === module) {
    const inputFile = path.join(__dirname, 'dist/index.html');
    const outputFile = path.join(__dirname, 'deploy/index.html');
    // create deploy folder if not exists
    if (!fs.existsSync(path.join(__dirname, 'deploy'))) {
        fs.mkdirSync(path.join(__dirname, 'deploy'));
    }
    convertHTMLToBase64(inputFile, outputFile);
}

module.exports = { convertHTMLToBase64 }; 