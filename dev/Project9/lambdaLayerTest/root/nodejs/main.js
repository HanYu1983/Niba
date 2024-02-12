const axios = require("axios")
const playwright = require('playwright-aws-lambda');
const { firefox, chromium } = require("playwright-core")

async function handler(event) {
    console.log(process.env.NODE_PATH)
    await testGoogleAdsApi(event).catch(console.log)

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}
exports.handler = handler

async function tryLoginWithGoogleAccount() {
    let browser = null;
    try {
        //browser = await playwright.launchChromium();
        browser = await chromium.launch({
            headless: false,
        });
        const context = await browser.newContext();

        const page = await context.newPage();
        // await page.goto(event.url || 'https://example.com');

        // console.log('Page title: ', await page.title());

        await loginWithGoogleAccount(page, "google-ads-manager@hitokuse.com", "zjETA6lVNW8H1KT2")
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function loginWithGoogleAccount(page, email, password) {
    console.log("Go to: https://accounts.google.com/ServiceLogin")
    await page.goto("https://accounts.google.com/ServiceLogin");

    console.log("Waiting for email input");
    const userNameInput = await page.waitForSelector('[autocomplete="username"]');
    console.log("Typing email");
    await userNameInput.click();
    await userNameInput.fill(email);
    console.log("Pressing ENTER");
    await userNameInput.press("Enter");
    // await page.waitForNavigation();

    console.log("Waiting for password input");
    const passwordInput = await page.waitForSelector('[type="password"]');
    console.log("Typing password");
    await passwordInput.click();
    await passwordInput.fill(password);
    console.log("Pressing ENTER");
    await passwordInput.press("Enter");
    // await page.waitForNavigation();
    console.log("Login completed");
}


// const axios = require('axios');

async function try2() {
    const clientId = "2e90183712ae951577fc716884c9f53635935725f071d44febd931ab594cec8e"
    const clientSecret = "eb6c8a8285e6645c3c70c47d719b8dd5b3453c89312b08b8e73cab6975963492"
    const refreshToken = "8f0fb777aa95f7737c7ab9ec650c9d70376886bb03530afe18f71927e2654397"
    const ret = await getAccessToken(clientId, clientSecret, refreshToken)
    console.log(ret)
    const token = ret.access_token

    const ret2 = await getBaseAccountData(token)
    console.log(ret2)

}



async function getAccessToken(clientId, clientSecret, refreshToken) {
    const url = `https://biz-oauth.yahoo.co.jp/oauth/v1/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`;
    const resp = await axios.post(url);
    return resp.data;
}

async function getBaseAccountData(token) {
    const url = "https://ads-display.yahooapis.jp/api/v12/BaseAccountService/get";
    const headers = {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    const data = {};
    const resp = await axios.post(url, data, { headers });
    return resp.data;
}


async function getCampaignData(token, accountId) {
    const url = "https://ads-display.yahooapis.jp/api/v12/CampaignService/get";
    const headers = {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-z-base-account-id": accountId
    };
    const data = {
        "accountId": accountId
    };
    const resp = await axios.post(url, data, { headers });
    return resp.data;
}


async function testGoogleAdsApi(event) {
    console.log(event)
    const { GoogleAdsApi } = require("google-ads-api")

    // client_customer_id: '602-776-2534'
    // client_id: "190464749637-59nfhl39kc86jafrn5080jc112oefjp5.apps.googleusercontent.com"
    // client_secret: kkVPdkyWYR7hdorlrJYxv3pI
    // developer_token: N5a_YxfZcEgwSGbDSfEhgQ
    const client = new GoogleAdsApi({
        client_id: "190464749637-59nfhl39kc86jafrn5080jc112oefjp5.apps.googleusercontent.com",
        client_secret: "kkVPdkyWYR7hdorlrJYxv3pI",
        developer_token: "N5a_YxfZcEgwSGbDSfEhgQ",
    });
    const refreshToken = "1/3Bp6kOTqCG73YD-XtSGiz4RwR8OGGyCCF7JGmmDHL6E";
    // const customers = await client.listAccessibleCustomers(refreshToken);
    // console.log(customers)

    const customer = client.Customer({
        customer_id: "6027762534",
        refresh_token: refreshToken,
    });
    const campaigns = await customer.query(`
    SELECT 
        customer_client.id,customer_client.descriptive_name
    FROM 
        customer_client
    LIMIT 20
    `);
    console.log(campaigns)
}