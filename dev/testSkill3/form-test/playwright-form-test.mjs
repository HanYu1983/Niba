/**
 * 表單測試 - Playwright 腳本（依 TEST-PLAN 流程）
 * 執行：npx playwright install chromium && node playwright-form-test.mjs
 */
import { chromium } from 'playwright';

const baseUrl = 'http://localhost:3751';
const results = { ok: [], fail: [] };

function pass(msg) { results.ok.push(msg); console.log('✓', msg); }
function fail(msg) { results.fail.push(msg); console.log('✗', msg); }

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// 攔截 alert
page.on('dialog', async (dialog) => {
  const text = dialog.message();
  if (text.includes('表單已送出')) pass('送出後出現 alert：「表單已送出（測試用）」');
  else fail('預期 alert 為「表單已送出（測試用）」，實際：' + text);
  await dialog.accept();
});

try {
  await page.goto(baseUrl + '/');
  await page.waitForSelector('#mainForm', { timeout: 5000 });
  pass('頁面載入，表單存在');

  // === 步驟 1：不填資料點下一步 → 應出現錯誤 ===
  await page.click('#next1');
  const errName1 = await page.locator('#err-name.visible').isVisible();
  const errEmail1 = await page.locator('#err-email.visible').isVisible();
  if (errName1 && errEmail1) pass('不填資料點下一步 → 顯示姓名、Email 錯誤');
  else fail('不填資料點下一步 → 應顯示錯誤訊息');

  // 填錯誤範例
  await page.fill('#name', '王');
  await page.fill('#email', 'x');
  await page.click('#next1');
  const errEmail2 = await page.locator('#err-email.visible').textContent();
  if (errEmail2 && errEmail2.includes('有效的 Email')) pass('錯誤 Email 格式 → 顯示「請輸入有效的 Email 格式」');
  else fail('錯誤 Email 格式驗證');

  // 改為正確範例 → 進入步驟 2
  await page.fill('#name', '王小明');
  await page.fill('#email', 'test@example.com');
  await page.fill('#phone', '0912345678');
  await page.click('#next1');
  const panel2Visible = await page.locator('#panel2.active').isVisible();
  if (panel2Visible) pass('步驟 1 正確資料 → 進入步驟 2');
  else fail('應進入步驟 2');

  // === 步驟 2：不選方案點下一步 ===
  await page.click('#next2');
  const errPlan = await page.locator('#err-plan.visible').isVisible();
  if (errPlan) pass('未選方案點下一步 → 顯示「請選擇方案」');

  await page.selectOption('#plan', 'pro');
  await page.fill('#note', '測試備註');
  await page.click('#next2');
  const panel3Visible = await page.locator('#panel3.active').isVisible();
  if (panel3Visible) pass('選方案 + 備註 → 進入步驟 3');
  else fail('應進入步驟 3');

  // === 步驟 3：確認摘要與送出 ===
  const summary = await page.locator('#summary').textContent();
  if (summary && summary.includes('王小明') && summary.includes('test@example.com') && summary.includes('專業方案')) {
    pass('確認頁摘要顯示正確');
  } else {
    fail('確認頁摘要應含姓名、Email、方案');
  }

  await page.click('#submitBtn');
  await page.waitForTimeout(600);
  pass('點擊送出按鈕完成');
} catch (e) {
  fail('執行錯誤: ' + e.message);
} finally {
  await browser.close();
}

console.log('\n--- 結果 ---');
console.log('通過:', results.ok.length);
console.log('失敗:', results.fail.length);
if (results.fail.length) process.exit(1);
process.exit(0);
