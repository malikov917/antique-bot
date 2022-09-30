const antiqueRepository = require('./api/antique-repository');
const mongoose = require('mongoose');
const bot = require('./bot/bot');
const connectionString = 'mongodb+srv://admin:admin@cluster0.ic1zc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

(async () => {
    const connectionSettings = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    
    await mongoose.connect(connectionString, connectionSettings);

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    });

    try {
        const res = await antiqueRepository.getAll();
        const message = `In our DB we have ${res.length} saved items!`;
        console.log(message)
        bot.sendMessage(message).then();
    } catch (e) {
        console.log(e);
    }

    process.exit(0);
})();
