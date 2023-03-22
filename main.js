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
  return array.splice(index, 1)[0];
}

async function scrapRandomLink() {
    const link = getRandomLinkAndRemoveIt(linkList);
    console.log('scrap link: ', link)
    return await scrapItems(link);
}

async function collectFresh15Items() {
    const items = [];
    while (items.length < 15 && linkList.length > 0) {
        const newItems = await scrapRandomLink();
        const filteredItems = await filterItems(newItems);
        console.log('new items: ', filteredItems.length)
        items.push(...filteredItems);
    }
    return items.slice(0, 15);
}

async function runWebScrapper() {
  console.log('start scrap');
  const items = await collectFresh15Items();
  await publishItemsInBot(items);
  console.log('items published in bot: ', items.length);
  await saveItemsInDB(items);
  console.log('items saved in mongodb: ', items.length);
  console.log('finish scrap');
  process.exit(0);
}

async function saveItemsInDB(antiques) {
  const mappedItems = antiques.map(x => mapBeforeSaving(x))
  await antiqueRepository.saveBulk(mappedItems);
}

async function filterItems(items) {
  const antiques = await antiqueRepository.getAll();
  const oldIds = antiques.map(item => item._id);
  const filteredItems = (items || []).filter(item => item.href && !oldIds.includes(item.href));
  const uniqueItems = {};
  filteredItems.forEach(item => {
    uniqueItems[item.href] = item;
  });
  return Object.values(uniqueItems);
}

async function publishItemsInBot(filteredItems) {
  for (const item of filteredItems) {
    const titleWithLink = `<a href="${item.href}">${item.title}</a> <b>${item.price}</b>`;
    await bot.sendHTMLMessage(titleWithLink);
  }
}

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));

