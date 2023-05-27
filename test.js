require('dotenv').config({ path: '.env' });
const { Configuration, OpenAIApi } = require("openai");
const mongoose = require("mongoose");
const {connectionSettings} = require("./configs/mongodb-connection-settings");
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
const ShortReadServiceClass = require("./services/short-read/short-read.service");
const {buildNewsHTMLMessage} = require("./services/utils");
const {NewsBot} = require("./bot/news-bot");
const shortReadService = new ShortReadServiceClass();
const {translateText} = require("./services/translation/translation-api");


async function sendToTelegram() {
  const newsBot = new NewsBot();
  const news = {
    content: '<b>Приготовься, Windows скоро станет умнее!</b> \n' +
        '\n' +
        'Ах, наконец-то мир немного разгадывает свои тайны! Теперь, с появлением умных плагинов-копилотов, системы искусственного интеллекта могут запускать инструменты и взаимодействовать с цифровыми системами, и все это на твоем рабочем столе Windows! Поговорим о высокотехнологичной эффективности! Это может стать началом веселья следующего уровня. Только убедись, что ты не слишком увлекся; я уверен, что мои внуки в какой-то момент скажут мне за это спасибо. В любом случае, будет интересно посмотреть, какое будущее ждет персональные компьютеры!\n' +
        '\n' +
        '<a href="https://blogs.windows.com/windowsdeveloper/2023/05/23/bringing-the-power-of-ai-to-windows-11-unlocking-a-new-era-of-productivity-for-customers-and-developers-with-windows-copilot-and-dev-home/?utm_source=tldrai">К статье</a>',
    image: 'https://blogs.windows.com/wp-content/uploads/prod/sites/3/2023/05/Windows-Dev-Blog_Windows-Copilot.png'
  }
  try {
    await newsBot.sendPhoto(news.image, news.content);
  } catch (e) {
    await newsBot.sendMessage(news.content);
  }
}

try {
  sendToTelegram();
} catch (e) {
  console.log(e);
}
