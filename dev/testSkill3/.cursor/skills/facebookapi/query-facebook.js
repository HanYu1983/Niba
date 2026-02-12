/**
 * Facebook Graph API 查詢腳本
 * 1. 從 .env 讀取變數
 * 2. 呼叫 Graph API
 *
 * 用法:
 *   node query-facebook.js [GRAPH_PATH]
 * 例:
 *   node query-facebook.js "/me"
 *   node query-facebook.js "/me/adaccounts"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    });
    req.on('error', reject);
  });
}

async function main() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('找不到 .env，請先依照 .env.example 建立:', envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      env[key] = value;
    }
  });

  const accessToken = env['FB_ACCESS_TOKEN'];
  if (!accessToken) {
    console.error('env 缺少變數: FB_ACCESS_TOKEN');
    process.exit(1);
  }

  const version = env['FB_GRAPH_VERSION'] || 'v19.0';

  const pathArg = process.argv[2];
  let graphPath = (typeof pathArg === 'string' && pathArg.trim())
    ? pathArg.trim()
    : '/me';

  const hasFirstQuery = graphPath.includes('?');
  if (hasFirstQuery) {
    graphPath = graphPath + '&access_token=' + encodeURIComponent(accessToken);
  } else {
    graphPath = graphPath + '?access_token=' + encodeURIComponent(accessToken);
  }
  const url = `https://graph.facebook.com/${version}${graphPath}`;

  console.log('=== 呼叫 Facebook Graph API ===');
  console.log('版本(version):', version);
  console.log('路徑(path):   ', graphPath);
  console.log('URL:         ', url.replace(accessToken, accessToken.substring(0, 8) + '...'));

  const res = await get(url);

  if (res && res.error) {
    console.error('呼叫失敗:', JSON.stringify(res, null, 2));
    process.exit(1);
  }

  console.log('回應結果:');
  console.log(JSON.stringify(res, null, 2));
}

main().catch(err => {
  console.error('執行時發生錯誤:', err);
  process.exit(1);
});

