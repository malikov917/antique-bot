const { get2HandLinks } = require('./scrappers/get-2hand-links');
const bot = require('./bot/bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./api/antique-repository');
// I hope you understand not to share this link with anyone :D
const connectionString = 'mongodb+srv://admin:admin@cluster0.ic1zc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

async function runWebScrapper() {
  await bot.sendMessage(`Bot started scrapping at: ${(new Date()).toUTCString()}`);
  const links = await get2HandLinks(); // better scrap full posts instead of just links
  const antiqueIds = await antiqueRepository.getSavedIds();
  const filteredNewPosts = links.filter(link => !antiqueIds.includes(link));
  // send new posts to bot
  // save these posts with status "new"

  process.exit(0);
}


mongoose.connect(connectionString)
    .then(() => runWebScrapper())
    .catch(errors => console.error(errors));
