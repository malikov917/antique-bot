const { Bot } = require('./bot');

class NewsBot extends Bot {
  constructor() {
    super(process.env.NEWS_TG_BOT_CHANNEL, process.env.NEWS_TG_BOT_TOKEN);
  }
}

exports.NewsBot = NewsBot;
