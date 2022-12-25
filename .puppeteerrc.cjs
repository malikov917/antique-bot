require('dotenv').config();
const { join } = require('path');

const isHeroku = process.env.BOT_ENVIRONMENT === 'heroku';

console.log(process.env.BOT_ENVIRONMENT, 'process.env.BOT_ENVIRONMENT')
console.log(isHeroku, 'isHeroku')

module.exports = { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }

const res = isHeroku
    ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
    : { };

console.log(res, 'res')
