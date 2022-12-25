require('dotenv').config();
const { join } = require('path');

const isHeroku = process.env.BOT_ENVIRONMENT === 'heroku';

console.log(process.env.BOT_ENVIRONMENT, 'config file: process.env.BOT_ENVIRONMENT')
console.log(isHeroku, 'config file: isHeroku')

// module.exports = { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }

const res = isHeroku
    ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
    : { };

module.exports = isHeroku
    ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
    : { };

console.log(res, 'config file: res')
