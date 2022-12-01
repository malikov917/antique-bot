// dotenv config string (as doc says: 'As early as possible in your application, import and configure dotenv')
require('dotenv').config();
const { scrapItems } = require('./scrappers/get-2hand-links');
const bot = require('./bot/bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./api/antique-repository');

const connectionSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

function mapBeforeSaving(rawItem) {
  return {
    _id: rawItem.href,
    title: rawItem.title,
    description: '',
    price: rawItem.price,
    status: 'POSTED'
  }
}

const mock = ['https://www.2dehands.be/v/antiek-en-kunst/antiek-meubels-stoelen-en-sofa-s/a110845522-peter-opsvik-stokke-stoel-tripp-trapp'];

async function runWebScrapper() {
  const items = await scrapItems();
  const oldIds =  await antiqueRepository.getSavedIds(); // или mock;
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
