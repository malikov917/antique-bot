const { get2HandLinks } = require('./get-2hand-links');
const bot = require('./bot');
const mongoose = require('mongoose');
const antiqueRepository = require('./antiques-repository');
const connectionString = 'mongodb+srv://admin:admin@cluster0.ic1zc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

async function runWebScrapper() {
  await bot.sendMessage(`Bot started scrapping: ${(new Date()).toUTCString()}`);
  const links = await get2HandLinks();
  const antiqueIds = await antiqueRepository.getAntiqueIds();
  const filteredNewLinks = links.filter(link => !antiqueIds.includes(link))

  // if (!!links?.length) {
  //   await bot.sendMessage(`We have ${links.length} new links. That's first three most recent:`);
  //
  //   const topThreeLinks = links?.slice(0, 3);
  //
  //   for (const link of topThreeLinks) {
  //     await bot.sendMessage(`[link](${link})`);
  //   }
  // }

  process.exit(0)
}


mongoose.connect(connectionString).then(() => runWebScrapper());
