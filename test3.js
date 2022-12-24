const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });
    console.log(await browser.version());
    process.exit(0)
}

run();
