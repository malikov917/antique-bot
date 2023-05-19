const puppeteer = require('puppeteer');
const { getParsedLink, waitMilliseconds } = require('../services/utils');
const { autoScroll } = require('../services/puppeteer/scroll-page.service')

const puppeteerOptions = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
const productList = 'ul.hz-Listings';
const acceptCookieButton = '#gdpr-consent-banner-accept-button';

// write a function which uses puppeteer to scrape the 2hand.be website
function getItemsFromPage(page) {
  return page.evaluate(() => {
    const items = [];
    const products = document.querySelectorAll('ul.hz-Listings > li');
    products.forEach((product, index) => {
      const title = product.querySelector('h3.hz-Listing-title')?.innerText;
      const price = product.querySelector('.hz-Listing-price')?.innerText;
      const url = product.querySelector('a')?.href;
      items.push({ orderOnPage: index, title, price, url });
    });
    return items;
  });
}

function filterReverseAndMapItems(items) {
  return items
      .filter(x => x)
      .map(item => ({ ...item, url: getParsedLink(item.url) }));
}

const scrapItems = async (url) => {
  try {
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 2000 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(acceptCookieButton, { timeout: 5000 })
        .then(() => page.click(acceptCookieButton))
        .catch(() => {});
    await page.waitForSelector(productList);
    await autoScroll(page);
    await waitMilliseconds(1000);
    const items = await getItemsFromPage(page);
    await browser.close();
    return filterReverseAndMapItems(items)
  } catch (error) {
    console.error(error);
  }
};

exports.scrapItems = scrapItems;
