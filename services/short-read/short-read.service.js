const { NewsBot } = require('../../bot/news-bot');
const { getLatestNotPosted, updateById } = require('../../api/tldr-news-repository');
const { buildNewsHTMLMessage } = require("../utils");
const OpenAISummarizer = require("../../ai/text-generation");

class ShortReadService {
  constructor() {
    this.newsBot = new NewsBot();
    this.summarizer = new OpenAISummarizer();
  }

  async postLatestNews() {
    const news = await this.getLatestNotPosted();
    if (!news) return;

    console.log('[tldr] posting news: ', news.headline)
    await this.summarize(news);
    console.log('[tldr] translated news: ', news.headline)
    await this.sendNews(news);
    console.log('[tldr] sent news: ', news.headline)
    await this.setAsPosted(news._id);
    console.log('[tldr] saved news: ', news.headline)
  }

  async summarize(news) {
    const { headline, description } = news._doc;
    const translatedSummary = await this.summarizer.summarize(headline, description);

    news.headline = translatedSummary.headline;
    news.description = translatedSummary.description;
  }

  async sendNews(news) {
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
