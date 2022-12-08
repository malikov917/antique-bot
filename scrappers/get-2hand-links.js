const puppeteer = require('puppeteer');
const { getParsedLink } = require('../services/utils');
const { autoScroll } = require('../services/puppeteer/scroll-page.service')
const websiteUrl = 'https://www.2dehands.be/l/antiek-en-kunst/#q:stokke|Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true';

// todo сделать возможность принимать ссылку с фильтрами, давать ей название и это будет новый список, который будет постоянно обновляться
// todo сделать все управление ботом через бота, а не через сайт

const scrapItems = async (url = websiteUrl) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 2000 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#gdpr-consent-banner-accept-button');
    await page.click('#gdpr-consent-banner-accept-button');
    await page.waitForSelector('ul.hz-Listings');
    await page.mouse.move(700, 400);
    await autoScroll(page);
    await page.waitForTimeout(1000);
    // скоуп page.evaluate оооочень трики, функции и переменные туда не пробрасывать, дебаг невозможен, использовать только для парсинга
    const items = await page.evaluate(() => {
      let rawList = document.querySelector('ul.hz-Listings');
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
    await browser.close();
    return items
        .filter(x => x)
        .map(item => ({...item, href: getParsedLink(item.href)}));
  } catch (error) {
    console.error(error);
  }
};

exports.scrapItems = scrapItems;
