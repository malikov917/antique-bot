require('dotenv').config();
const mongoose = require('mongoose');
const { mapTldrNewsBeforeSaving, buildTldrLink } = require('./services/utils')
const { connectionSettings } = require('./configs/mongodb-connection-settings');
const newsRepository = require('./api/tldr-news-repository');
const NewsScraperClass = require("./scrappers/tldr-news");
const ShortReadServiceClass = require("./services/short-read/short-read.service");
const newsScraper = new NewsScraperClass();
const shortReadService = new ShortReadServiceClass();

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
  const link = buildTldrLink();
  let news = await scrapLink(link);
  console.log('[tldr] items collected: ', news.length);
  return news;
}

async function scrapLink(link) {
  console.log('[tldr] scrap link: ', link)
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
