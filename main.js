// dotenv config string (as doc says: 'As early as possible in your application, import and configure dotenv')
require('dotenv').config();
const { scrapItems } = require('./scrappers/get-2hand-links');
const { mapAntiqueBeforeSaving, createUniqueIdFromLink } = require('./services/utils');
const { connectionSettings } = require('./configs/mongodb-connection-settings');
const { AntiqueBot } = require('./bot/antique-bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./api/antique-repository');

let linkList = [
    'https://www.2dehands.be/l/antiek-en-kunst/#q:stokke|Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true',
    'https://www.2dehands.be/q/stokke+varier/#Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|postcode:3300|searchInTitleAndDescription:true',
    'https://www.2dehands.be/q/kniestoel/#Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|postcode:3300',
    'https://www.2dehands.be/q/oude+lamp/#Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|postcode:3300',
    'https://www.2dehands.be/q/antieke+luster/#Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|postcode:3300',
    'https://www.2dehands.be/q/weimar+porselein/#Language:all-languages|postcode:3300',
    'https://www.2dehands.be/q/stokke+move/',
    'https://www.marktplaats.nl/q/stokke+move/',
    'https://www.2dehands.be/q/stokke+balans/#Language:all-languages|postcode:1200',
    'https://www.marktplaats.nl/q/stokke+balans/',
    'https://www.marktplaats.nl/q/luster/',
    'https://www.2dehands.be/q/luster/#Language:all-languages',
]

function getRandomLinkAndRemoveIt(array) {
  const index = Math.floor(Math.random() * array.length);
  const removedItem = array.splice(index, 1);
  return removedItem[0];
}

async function scrapRandomLink() {
    const link = getRandomLinkAndRemoveIt(linkList);
    console.log('[antique] scrap link: ', link)
    return await scrapItems(link);
}

async function collectFresh15Items() {
    const items = await collectFreshItems(15);
    return items.slice(0, 15);
}

async function collectFreshItems(n) {
    const items = [];
    while (items.length < n && linkList.length > 0) {
        items.push(...await getFreshItems());
    }
    return items;
}

async function getFreshItems() {
    const newItems = await scrapRandomLink();
    const filteredItems = await filterItems(newItems);
    const itemsWithGeneratedIds = generateIdsForItems(filteredItems);
    return itemsWithGeneratedIds;
}

function generateIdsForItems(items) {
  return items.map(x => {
    x._id = createUniqueIdFromLink(x.url);
    return x;
  });
}

function filterFreshItems(items, upserted) {
  return items.filter(x => upserted.result.upserted.map(x => x._id).includes(x._id));
}

async function runWebScrapper() {
  console.log('[antique] start scrap');
  const items = await collectFresh15Items();
  const upserted = await saveItemsInDB(items);
  const filteredItems = filterFreshItems(items, upserted);
  console.log('[antique] saved new items in db', filteredItems.length);
  await publishItemsInBot(filteredItems);
  console.log('[antique] finish scrap');
  process.exit(0);
}

async function saveItemsInDB(antiques) {
  const mappedItems = antiques.map(x => mapAntiqueBeforeSaving(x))
  return await antiqueRepository.saveBulk(mappedItems);
}

async function filterItems(items) {
  const uniqueItems = filterUniqueItems(items);
  return uniqueItems;
}

function filterUniqueItems(items) {
  const uniqueItems = items.reduce((acc, item) => {
    acc[item.url] = item;
    return acc;
  }, {});
  return Object.values(uniqueItems);
}

async function publishItemsInBot(items) {
  const bot = new AntiqueBot();
  for (const item of items) {
    await bot.sendHTMLMessage(buildItemMessage(item));
  }
  console.log('[antique] publish items in bot', items.length);
}

function buildItemMessage(item) {
  return `<a href="${item.url}">${item.title}</a> <b>${item.price}</b>`;
}

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));

