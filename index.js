const { get2HandLinks } = require('./scrappers/get-2hand-links');
const bot = require('./bot/bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./api/antiques-repository');
const connectionString = 'mongodb+srv://admin:admin@cluster0.ic1zc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function runWebScrapper() {
  await bot.sendMessage(`Bot started scrapping: ${(new Date()).toUTCString()}`);
  const links = await get2HandLinks(); // better scrap full posts instead of just links
  const antiqueIds = await antiqueRepository.getSavedIds();
  const newPosts = links.filter(link => !antiqueIds.includes(link));
  // send new posts to bot
  // save these posts with status "new"

  process.exit(0)
}


mongoose.connect(connectionString).then(() => runWebScrapper());
