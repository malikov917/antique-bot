const { Telegraf } = require('telegraf');

const charactersToEscape = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];

class Bot {
  constructor(channel, botToken) {
    this.bot = new Telegraf(botToken);
    this.channel = channel;
  }

  async sendMessage(textMessage) {
    const escapedMessage = charactersToEscape.reduce((acc, char) => acc.replace(char, `\\${char}`), textMessage);
    return this.bot.telegram.sendMessage(this.channel, escapedMessage, { parse_mode: 'MarkdownV2' });
  }

  async sendHTMLMessage(textMessage) {
    return this.bot.telegram.sendMessage(this.channel, textMessage, { parse_mode: 'HTML' });
  }

  async sendPhoto(uri, message) {
    return this.bot.telegram.sendPhoto(this.channel, uri, { caption: message });
  }
}

exports.Bot = Bot;