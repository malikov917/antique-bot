require('dotenv').config();
const mongoose = require('mongoose');
const { mapTldrNewsBeforeSaving } = require('./services/utils')
const { connectionSettings } = require('./configs/mongodb-connection-settings');
const newsRepository = require('./api/tldr-news-repository');
const NewsScraperClass = require("./scrappers/tldr-news");
const newsScraper = new NewsScraperClass(process.argv[2]);

async function runWebScrapper() {
  try {
    console.log('[tldr] start scrap');
    const items = await collectNews();
    await saveItemsInDB(items);
    console.log('[tldr] finish scrap');
  } catch (e) {
    throw e;
  } finally {
    process.exit(0);
  }
}

async function collectNews() {
  const link = newsScraper.buildTldrLink();
  const news = await scrapLink(link);
  console.log('[tldr] items collected: ', news.length);
  return news;
}

async function scrapLink(link) {
  console.log('[tldr] scrap link: ', link);
  return await newsScraper.scrape(link);
}

async function saveItemsInDB(items) {
  const mappedItems = items.map(x => mapTldrNewsBeforeSaving(x));
  const savedInDb = await newsRepository.saveBulk(mappedItems)
  console.log('[tldr] new items saved in mongodb: ', savedInDb.result.upserted.length);
}

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));
