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

async function runWebScrapper() {
  const items = await scrapItems();
  const filteredItems = await filterItems(items);
  await publishItemsInBot(filteredItems);
  await saveItemsInDB(filteredItems);

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
    await bot.sendMessage(`[link](${item.href})`);
  }
}

console.log('start scrap')
mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper())
    .then(() => console.log('finish scrap'))
    .catch(errors => console.error(errors));
