const { NewsBot } = require('../../bot/news-bot');
const { getLatestNotPosted, updateById } = require('../../api/tldr-news-repository');
const { buildNewsHTMLMessage } = require("../utils");

class ShortReadService {
  constructor() {
    this.newsBot = new NewsBot();
  }
  async postLatestNews() {
    const news = await this.getLatestNotPosted();
    if (!news) return;
    if (news.image) {
      await this.newsBot.sendPhoto(news.image, buildNewsHTMLMessage(news));
    } else {
      await this.newsBot.sendHTMLMessage(buildNewsHTMLMessage(news));
    }
    await this.setAsPosted(news._id);
  }

  async getLatestNotPosted() {
    return getLatestNotPosted();
  }

  async setAsPosted(_id) {
    return updateById(_id, { status: 'POSTED' })
  }
}

module.exports = ShortReadService;
