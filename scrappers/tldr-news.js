const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { puppeteerOptions } = require('../configs/puppeteer-options');
const PageScraper = require('./page-scraper');
const { buildTldrLink } = require('../services/utils')

class NewsScraper extends PageScraper {
  constructor(newsType) {
    super(puppeteer, cheerio, puppeteerOptions);
    this.newsType = newsType || 'tech'; // possible values: tech, ai, crypto
  }

  async scrape(url) {
    let items = [];
    let browser;
    try {
      browser = await puppeteer.launch({ ...puppeteerOptions, headless: true });
      const page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 2000 });
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      items = await this.getItemsFromPage(page);
      items = await this.getImageAndUpdateNews(items, page);
    } catch (error) {
      throw new Error(`Error scraping news: ${error}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
    return items;
  }

  async getItemsFromPage(page) {
    try {
      const newsItems = await this.scrapeNews(page);
      const filteredItems = this.removeTrashFromResults(newsItems);
      return filteredItems;
    } catch (error) {
      throw new Error(`Error getting items from page: ${error}`);
    }
  }

  async getImageAndUpdateNews(items, page) {
    const itemsWithImages = [];

    for (let item of items) {
      const image = await this.getImageFromPage(page, item);
      itemsWithImages.push({ ...item, image });
    }

    return itemsWithImages;
  }

  async scrapeNews(page) {
    const pageHtml = await page.content();
    const $ = cheerio.load(pageHtml);
    const h6 = this.newsType === 'tech' ? 'Big Tech & Startups' : 'Headlines & Launches';
    const res = $(`h6:contains(${h6})`);
    const newsBlock = res.parent().parent();
    const newsEls = newsBlock.find('div:not(.text-center.text-3xl.mt-3) > div.mt-3');

    return newsEls.map((index, element) => {
      try {
        const block = $(element);
        const headline = block.find('a').text();
        const url = block.find('a').attr('href').replace('?utm_source=tldrnewsletter', '');
        const description = block.find('div').text();

        return { headline, url, description };
      } catch (error) {
        return false;
      }
    }).get();
  }

  removeTrashFromResults(newsItems) {
    return newsItems.filter(Boolean);
  }

  async getImageFromPage(page, item) {
    try {
      await page.goto(item.url, {waitUntil: 'domcontentloaded'});
      const pageHtml = await page.content();
      const $ = cheerio.load(pageHtml);
      const image = $('meta[property="og:image"]').attr('content');
      return image || '';
    } catch (error) {
      console.error(`Error getting image from page: ${error}`);
      throw error;
    }
  }

  buildTldrLink() {
    return buildTldrLink(this.newsType);
  }
}

module.exports = NewsScraper;
