const { chromium } = require('playwright');
const fs = require('node:fs/promises');

async function readEnv(filePath) {
  // 避免系統變量
  const envs = await fs.readFile(filePath, { encoding: 'utf8' })
  return envs.split("\n").map(row => row.split("=")).reduce((acc, [k, v]) => {
    return {
      ...acc,
      [k]: v
    }
  }, {})
}

async function appendNewEnv(page, k, v) {
  const addEnvButtonDescribe = 'button[class="awsui_add-button_n4qlp_bf4y1_177 awsui_button_vjswe_1wo5s_105 awsui_variant-normal_vjswe_1wo5s_156"]'
  const addEnvButton = page.locator(addEnvButtonDescribe)
  await addEnvButton.click()
  await page.waitForTimeout(10)
  const elems = await page.locator('div[class="awsui_row_n4qlp_bf4y1_165 awsui_root_18wu0_1ra3n_851 awsui_box_18wu0_1ra3n_108 awsui_m-bottom-s_18wu0_1ra3n_691 awsui_color-default_18wu0_1ra3n_108 awsui_font-size-default_18wu0_1ra3n_124 awsui_font-weight-default_18wu0_1ra3n_164"]').all()
  if (elems.length == 0) {
    throw new Error('elems.length must > 0')
  }
  const lastElem = elems[elems.length - 1]
  const kvElems = await lastElem.locator('div[class="awsui_grid-column_14yj0_ak6xz_141 awsui_colspan-6_14yj0_ak6xz_202"]').all()
  if (kvElems.length != 2) {
    throw new Error('kvElems.length must 2')
  }
  const kElem = kvElems[0].locator('input').first()
  await kElem.fill(k)
  const vElem = kvElems[1].locator('input').first()
  await vElem.fill(v)
}

async function addEnvToEBConfigSettings(url, accountId, username, password, envs, page) {
  await page.goto(url);
  await page.waitForSelector('//input[@id="iam_user_radio_button"]');
  await page.click('input[id="iam_user_radio_button"]')
  await page.fill('input[id="resolving_input"]', accountId)
  await page.click('button[id="next_button"]')
  await page.fill('input[id="username"]', username)
  await page.fill('input[id="password"]', password)
  await page.click('a[id="signin_button"]')
  await page.waitForTimeout(10000)
  for (const k in envs) {
    const v = envs[k]
    await appendNewEnv(page, k, v)
  }
}

async function main() {
  const { accountId, username, password, path, url } = process.env
  //const url="https://ap-northeast-1.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-1#/environment/configuration/updates-monitoring-logging?environmentId=e-yp3sc4mvaz"
  const envs = await readEnv(path)
  console.log(envs)
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await addEnvToEBConfigSettings(url, accountId, username, password, envs, page)
  console.log("Success")
}

main().catch(e => console.log(e))

