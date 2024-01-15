const axios = require("axios")
const playwright = require('playwright-aws-lambda');

async function main(event) {
    console.log(process.env.NODE_PATH)
    let browser = null;
    try {
        browser = await playwright.launchChromium();
        const context = await browser.newContext();

        const page = await context.newPage();
        await page.goto(event.url || 'https://example.com');

        console.log('Page title: ', await page.title());
    } catch (error) {
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
}



exports.handler = main