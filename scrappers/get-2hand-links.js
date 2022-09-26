const puppeteer = require('puppeteer');
const { getParsedLink } = require('../services/parse-links');
const websiteUrl = 'https://www.2dehands.be/l/antiek-en-kunst/#q:stokke|Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true';

// todo сделать возможность принимать ссылку с фильтрами, давать ей название и это будет новый список, который будет постоянно обновляться
// todo сделать все управление ботом через бота, а не через сайт

const get2HandLinks = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 250, devtools: true });
    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#gdpr-consent-banner-accept-button');
    await page.click('#gdpr-consent-banner-accept-button');
    await page.waitForSelector('ul.mp-Listings');
    // скоуп page.evaluate оооочень трики, функции и переменные туда не пробрасывать
    // дебаг невозможен, использовать только для парсинга
    const links = await page.evaluate(() => {
      let rawList = document.querySelector('ul.mp-Listings');
      if (rawList?.childNodes?.length) {
        const childNodes = rawList.childNodes;
        const liList = Array.from(childNodes).filter(el => el.tagName === 'LI');
        return liList.map(li => li.firstChild.href);
      } else return [];
    });
    await browser.close();
    return links.map(link => getParsedLink(link));
  } catch (error) {
    console.log(error)
  }
};

exports.get2HandLinks = get2HandLinks;
