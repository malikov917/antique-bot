require('dotenv').config();

if (process.env.BOT_ENVIRONMENT == 'heroku') {
    const {join} = require('path');
    module.exports = {
        cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
    };
}
