/**
 * Google Ads API 查詢腳本
 * 1. 從 .env 讀取變量
 * 2. 取得 access_token
 * 3. 呼叫 googleAds:search 查詢廣告
 *
 * 用法: node query-ads.js [GAQL查詢字串]
 * 若未傳入 GAQL，則使用預設查詢（campaign 列表）。
 * 例: node query-ads.js "SELECT campaign.id, campaign.name FROM campaign LIMIT 5"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');


function post(url, body, headers = {}) {
  const u = new URL(url);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

function get(url, headers = {}) {
  const u = new URL(url);
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('找不到 .env，路徑:', envPath);
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
  const required = ['client_id', 'client_secret', 'refresh_token', 'developer_token', 'login-customer-id'];
  const missing = required.filter(k => !env[k]);
  if (missing.length) {
    console.error('env 缺少變量:', missing.join(', '), '目前:', JSON.stringify(env));
    process.exit(1);
  }
  const { client_id, client_secret, refresh_token, developer_token } = env;
  const loginCustomerId = env['login-customer-id'];
  const customerId = env['customer-id'] || loginCustomerId;

  console.log('=== 步驟 1: 取得 access_token ===');
  const tokenUrl = 'https://www.googleapis.com/oauth2/v3/token';
  const tokenBody = [
    'grant_type=refresh_token',
    `client_id=${encodeURIComponent(client_id)}`,
    `client_secret=${encodeURIComponent(client_secret)}`,
    `refresh_token=${encodeURIComponent(refresh_token)}`
  ].join('&');
  const tokenRes = await post(tokenUrl, tokenBody, { 'Content-Type': 'application/x-www-form-urlencoded' });
  const access_token = tokenRes.access_token;
  if (!access_token) {
    console.error('取得 token 失敗:', tokenRes);
    process.exit(1);
  }
  console.log('已取得 access_token:', access_token.substring(0, 20) + '...');

  const defaultQuery = [
    'SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type',
    'FROM campaign WHERE campaign.status != \'REMOVED\' LIMIT 10'
  ].join(' ');
  const queryArg = process.argv[2];
  const query = (typeof queryArg === 'string' && queryArg.trim())
    ? queryArg.trim().replace(/\s+/g, ' ')
    : defaultQuery;

  console.log('\n=== 步驟 2: 查詢 Google Ads ===');
  console.log('GAQL:', query);
  const searchUrl = `https://googleads.googleapis.com/v21/customers/${customerId}/googleAds:search`;

  const searchBody = { query };
  const searchRes = await post(searchUrl, searchBody, {
    'Authorization': `Bearer ${access_token}`,
    'developer-token': developer_token,
    'login-customer-id': loginCustomerId
  });

  if (searchRes.error) {
    console.error('查詢失敗:', JSON.stringify(searchRes, null, 2));
    process.exit(1);
  }

  const results = searchRes.results || [];
  console.log('查詢結果: 共', results.length, '筆');
  if (results.length) {
    results.forEach((row, i) => console.log(`  [${i + 1}]`, JSON.stringify(row)));
  }
  console.log('\n完整回應:', JSON.stringify(searchRes, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
