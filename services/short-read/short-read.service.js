const { NewsBot } = require('../../bot/news-bot');
const { getLatestNotPosted, updateById } = require('../../api/tldr-news-repository');

class ShortReadService {
  constructor() {
    this.newsBot = new NewsBot();
  }
  async postLatestNews() {
    const news = await this.getLatestNotPosted();
    if (!news) return;
    await this.newsBot.sendMessage(news.headline);
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
