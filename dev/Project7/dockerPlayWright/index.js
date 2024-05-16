const { firefox } = require("playwright")



async function main(){
    const email = ""
    const password = ""
    const browserHelper = await getBrowserHandler({pageDefaultTimeout: 300* 1000})
    await browserHelper.startPageAndLogin(email, password)
    console.log("SUCCESS")
    await browserHelper.close()
}

main().catch(console.log)

async function getBrowserHandler({ pageDefaultTimeout }) {
    let _browser, _ctx, _page;
    async function startPage() {
        // _browser = await playwright.launchChromium({ headless: false });
        _browser = await firefox.launch({
            headless: true,
        });
        _ctx = await _browser.newContext()
        _page = await _ctx.newPage()
        _page.setDefaultTimeout(pageDefaultTimeout)
        return _page
    }
    async function close() {
        await _page.close()
        await _ctx.close()
        await _browser.close()
    }
    function getPage() {
        return _page
    }

    async function startPageAndLogin(email, password) {
        const page = await startPage()
        await loginWithGoogleAccount(page, email, password)
    }

    async function setEnable(adwords_advertiser_link_id, campaign_id, ad_group_id, enabled) {
        const url = urlForGoogleAds(adwords_advertiser_link_id, campaign_id, ad_group_id)
        const page = getPage()
        await processAdGroup(page, url, enabled)
    }

    return {
        startPageAndLogin: startPageAndLogin,
        setEnable: setEnable,
        close: close
    }
}

//
// helper
//
function log(s) {
    console.log(s)
}
// 
// google ads helper
// 
async function loginWithGoogleAccount(page, email, password) {
    log("Go to: https://accounts.google.com/ServiceLogin")
    await page.goto("https://accounts.google.com/ServiceLogin");

    log("Waiting for email input");
    const userNameInput = await page.waitForSelector('[autocomplete="username"]');
    log("Typing email");
    await userNameInput.click();
    await userNameInput.fill(email);
    log("Pressing ENTER");
    await userNameInput.press("Enter");
    //await page.waitForNavigation();

    log("Waiting for password input");
    const passwordInput = await page.waitForSelector('[type="password"]');
    log("Typing password");
    await passwordInput.click();
    await passwordInput.fill(password);
    log("Pressing ENTER");
    // await passwordInput.press("Enter");
    //await page.waitForNavigation();
    await Promise.all([passwordInput.press("Enter"), page.waitForNavigation()]);
    log("Login completed");
}