const { NewsBot } = require('../../bot/news-bot');
const { getLatestNotPosted, updateById } = require('../../api/tldr-news-repository');
const { buildNewsHTMLMessage } = require("../utils");
const OpenAISummarizerTranslator = require("../../ai/text-generation");

class ShortReadService {
  constructor() {
    this.newsBot = new NewsBot();
    this.summarizerTranslator = new OpenAISummarizerTranslator();
  }

  async postLatestNews() {
    const news = await this.getLatestNotPosted();
    if (!news) return;

    await this.translate(news);
    await this.sendNews(news);
    await this.setAsPosted(news._id);
  }

  async translate(news) {
    const { headline, description } = news._doc;
    const translatedSummary = await this.summarizerTranslator.summarizeAndTranslate(headline, description);

    news.headline = translatedSummary.headline;
    news.description = translatedSummary.description;
  }

  async sendNews(news) {
    if (news.image) {
      await this.newsBot.sendPhoto(news.image, buildNewsHTMLMessage(news));
    } else {
      await this.newsBot.sendHTMLMessage(buildNewsHTMLMessage(news));
    }
  }

  async setAsPosted(newsId) {
    await this.updateNewsStatus(newsId, 'POSTED');
  }

  async updateNewsStatus(newsId, status) {
    await updateById(newsId, { status });
  }

  getLatestNotPosted() {
    return getLatestNotPosted();
  }
}

module.exports = ShortReadService;
