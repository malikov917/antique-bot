require('dotenv').config();
const { join } = require('path');

const isHeroku = process.env.BOT_ENVIRONMENT == 'heroku';

module.exports = isHeroku
    ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
    : { };
