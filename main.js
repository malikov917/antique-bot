// dotenv config string (as doc says: 'As early as possible in your application, import and configure dotenv')
require('dotenv').config();
const { scrapItems } = require('./scrappers/get-2hand-links');
const bot = require('./bot/bot');
const { mapBeforeSaving } = require('./services/utils')
const mongoose = require('mongoose');
let antiqueRepository = require('./api/antique-repository');
const mockAntiqueRepository = require('./api/mock-antique-repository');
// antiqueRepository = mockAntiqueRepository;

const connectionSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const linkList = [
    'https://www.2dehands.be/l/antiek-en-kunst/#q:stokke|Language:all-languages|sortBy:SORT_INDEX|sortOrder:DECREASING|searchInTitleAndDescription:true'
]

async function runWebScrapper(linkList) {
  console.log('start scrap');

  for (let link of linkList) {
    const items = await scrapItems(link);
    const filteredItems = await filterItems(items);
    await publishItemsInBot(filteredItems);
    await saveItemsInDB(filteredItems);
  }

  console.log('finish scrap');
  process.exit(0);
}

async function saveItemsInDB(filteredItems) {
  const mappedItems = filteredItems.map(x => mapBeforeSaving(x))
  await antiqueRepository.saveBulk(mappedItems);
}

async function filterItems(items) {
  const antiques = await antiqueRepository.getAll();
  const oldIds = antiques.map(item => item._id);
  return items.filter(item => !oldIds.includes(item.href));
}

async function publishItemsInBot(filteredItems) {
  for (const item of filteredItems) {
    const titleWithLink = `<a href="${item.href}">${item.title}</a> <b>${item.price}</b>`;
    await bot.sendHTMLMessage(titleWithLink);
  }
}

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper(linkList))
    .catch(errors => console.error(errors));
