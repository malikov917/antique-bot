const { Telegraf } = require('telegraf');

const channel = process.env.ANTIQUE_TG_CHANNEL;
const botToken = process.env.ANTIQUE_TG_BOT_TOKEN;

const charactersToEscape = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!']

// HOW TO USE:
//
// await bot.sendMessage(`Bot started scrapping: ${(new Date()).toUTCString()}`);
// for sending links you can use [Link](example.com) pattern

const sendMessage = (textMessage) => {
    const bot = new Telegraf(botToken);
    return bot.telegram.sendMessage(channel, textMessage, { parse_mode: 'MarkdownV2' });
}

const sendHTMLMessage = (textMessage) => {
    const bot = new Telegraf(botToken);
    return bot.telegram.sendMessage(channel, textMessage, { parse_mode: 'HTML' });
}

const sendPhoto = (uri, message) => {
    const bot = new Telegraf(botToken);
    return bot.telegram.sendPhoto(channel, uri, { caption: message });
}

exports.sendMessage = sendMessage;
exports.sendPhoto = sendPhoto;
exports.sendHTMLMessage = sendHTMLMessage;
