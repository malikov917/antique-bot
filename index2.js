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
  console.log('example of console.log()')
  const items = await scrapItems();
  const oldIds = await antiqueRepository.getSavedIds();
  const newItems = items
      .filter(item => !oldIds.includes(item.href))
      .reverse();
  for (const item of newItems) {
    await bot.sendMessage(`[link](${item.href})`);
  }
  const mappedItems = newItems.map(x => mapBeforeSaving(x))
  await antiqueRepository.saveBulk(mappedItems);

  process.exit(0);
}

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));
