const { get2HandLinks } = require('./scrappers/get-2hand-links');
const bot = require('./bot/bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./api/antique-repository');



function mapToPost(rawItem) {
  return {
    _id: rawItem,
    title: '',
    description: '',
    price: '',
    status: 'POSTED'
  }
}

async function runWebScrapper() {
  // await bot.sendMessage(`Bot started scrapping at: ${(new Date()).toUTCString()}`);
  const links = await get2HandLinks(); // better scrap full posts instead of just links
  const antiqueIds = await antiqueRepository.getSavedIds();
  const filteredNewLinks = links
      .filter(link => !antiqueIds.includes(link));
  for (const link of filteredNewLinks) {
    await bot.sendMessage(`[link](${link})`);
  }
  filteredNewPosts = filteredNewLinks.map(x => mapToPost(x))
  await antiqueRepository.saveBulk(filteredNewPosts);

  process.exit(0);
}

// dotenv config string (as doc says: 'As early as possible in your application, import and configure dotenv')
require('dotenv').config();

mongoose.connect(process.env.ANTIQUE_DB_STRING)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));
