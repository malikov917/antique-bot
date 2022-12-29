const puppeteer = require('puppeteer');
const { getParsedLink, waitMilliseconds } = require('../services/utils');
const { autoScroll } = require('../services/puppeteer/scroll-page.service')

const defaultWebsiteUrl = 'https://www.2dehands.be/l/antiek-en-kunst/#q:stokke|Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true';
const puppeteerOptions = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
const productList = 'ul.hz-Listings';
const acceptCookieButton = '#gdpr-consent-banner-accept-button';

async function getItemsFromPage(page) {
  // скоуп page.evaluate оооочень трики, функции и переменные туда не пробрасывать, дебаг невозможен, использовать только для парсинга
  return await page.evaluate(() => {
    let rawList = document.querySelector(productList);
    if (rawList?.childNodes?.length) {
      const childNodes = rawList.childNodes;
      const liList = Array.from(childNodes).filter(el => el.tagName === 'LI');
      return liList.map((li, index) => ({
        orderOnPage: index,
        href: li.firstChild.href,
        title: li.firstChild.querySelector('.hz-Listing-title').innerText,
        price: li.firstChild.querySelector('.hz-Listing-price').innerText
      }));
    } else return [];
  });
}

function filterReverseAndMapItems(items) {
  return items
      .filter(x => x)
      .map(item => ({ ...item, href: getParsedLink(item.href) }));
}

const scrapItems = async (url) => {
  url = url ? url : defaultWebsiteUrl;
  try {
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 2000 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(acceptCookieButton);
    await page.click(acceptCookieButton);
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
