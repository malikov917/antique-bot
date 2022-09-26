const puppeteer = require('puppeteer');

const getElonTwitterLinks = async () => {
  try {
    // const browser = await puppeteer.launch({ headless: true, args: ['--headless', '--disable-gpu'] });
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://twitter.com/elonmusk');
    await page.waitForSelector('[data-testid="tweet"]');

    const links = await page.evaluate(() => {
      let elements = Array.from(document.querySelectorAll('[data-testid="tweet"]'));
      let links = elements.map(x => x.querySelectorAll('a')[2].href);
      return links;
    });

    console.log('links: ', links)

    await browser.close();

    return links;

  } catch (error) {
    console.log(error)
  }
};

exports.getElonTwitterLinks = getElonTwitterLinks;