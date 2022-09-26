const { Telegraf } = require('telegraf')
const channel = '-1001794163567';
const botToken = '5792214658:AAHvy-xh8GKy1LAppTpDnlFi1B7jusqcGP4';

const sendMessage = (textMessage) => {
    const bot = new Telegraf(botToken);
    return bot.telegram.sendMessage(channel, textMessage, { parse_mode: 'MarkdownV2' });
}
const sendPhoto = (uri, message) => {
    const bot = new Telegraf(botToken);
    return bot.telegram.sendPhoto(channel, uri, { caption: message });
}

exports.sendMessage = sendMessage;
exports.sendPhoto = sendPhoto;
