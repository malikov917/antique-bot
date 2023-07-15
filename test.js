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


async function sendToTelegram(news) {
  this.newsBot = new NewsBot();
  if (news.image) {
    try {
      await this.newsBot.sendPhoto(news.image, buildNewsHTMLMessage(news));
    } catch (e) {
      await this.newsBot.sendHTMLMessage(buildNewsHTMLMessage(news));
    }
  } else {
    await this.newsBot.sendHTMLMessage(buildNewsHTMLMessage(news));
  }
}

try {
  let news = {
    headline: 'test headline',
    description: 'test description',
    image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    href: 'https://www.google.com'
  }
  sendToTelegram(news);
} catch (e) {
  console.log(e);
}
