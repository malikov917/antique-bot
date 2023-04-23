class PageScraper {
  constructor(puppeteer, cheerio, puppeteerOptions) {
    if (this.constructor === PageScraper) {
      throw new TypeError('Cannot instantiate abstract class');
    }
    this.puppeteer = puppeteer;
    this.cheerio = cheerio;
    this.puppeteerOptions = puppeteerOptions;
  }

  async scrape(url) {
    throw new Error('scrape method must be implemented in a subclass');
  }

  async getItemsFromPage(page) {
    // implementation details
  }

  async getImageFromPage(page) {
    // implementation details
  }
}

module.exports = PageScraper;
