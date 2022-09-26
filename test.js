const antiqueRepository = require('./api/antiques-repository');
const mongoose = require('mongoose');
const bot = require('./bot/bot');
const connectionString = 'mongodb+srv://admin:admin@cluster0.ic1zc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

bot.sendMessage(`Виталя привет`)
    .then();

// (async () => {
//     await mongoose.connect(connectionString);
//
//     mongoose.connection.on('error', (err) => {
//         console.error(`Mongoose connection error: ${err}`);
//         process.exit(1);
//     });
//
//     const item = {
//         _id: '123',
//         title: 'title 2',
//         description: 'description',
//         price: '29(€)',
//     }
//     try {
//         const res = await antiqueRepository.addItem(item);
//         const res1 = await antiqueRepository.findById('123');
//         console.log(res)
//         console.log(res1)
//     } catch (e) {
//         console.log(e);
//     }
//
//     process.exit(0);
// })();
