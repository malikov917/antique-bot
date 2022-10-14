
const antiqueRepository = require('./api/antique-repository');
const mongoose = require('mongoose');
const bot = require('./bot/bot');

(async () => {
    
    // dotenv config string (as doc says: 'As early as possible in your application, import and configure dotenv')
    require('dotenv').config();

    const connectionSettings = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    
    await mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings);

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
