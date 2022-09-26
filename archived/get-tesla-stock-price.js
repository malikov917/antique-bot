const puppeteer = require('puppeteer');

const getTeslaStockPrice = async () => {
  try {
    // const browser = await puppeteer.launch({ headless: true, args: ['--headless', '--disable-gpu'] });
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1280 })
    await page.goto('https://www.marketwatch.com/investing/stock/tsla', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.kv__item');

    let status, infoElements, stockOpenPrice, stockClosePrice, stockDayRange;

    status = await page.evaluate(() => document.querySelector('.status').innerText);

    infoElements = await page.evaluate(() => document.querySelectorAll('.list--kv .kv__item'));

    // if (status === 'AFTER HOURS') {
    //   stockClosePrice = await page.evaluate(() => document.querySelectorAll('.intraday__close .table__cell.u-semi').innerText);
    //   infoElements.forEach(x => { if (x.innerText.includes('DAY RANGE')) { stockDayRange = x.querySelector('.primary').innerText } });
    // } else {
    //   infoElements.forEach(x => { if (x.innerText.includes('OPEN')) { stockOpenPrice = x.querySelector('.primary').innerText } });
    // }

    await browser.close();

    return { status, infoElements, stockOpenPrice, stockClosePrice, stockDayRange };

  } catch (error) {
    console.log(error)
  }
};

exports.getTeslaStockPrice = getTeslaStockPrice;