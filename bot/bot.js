const { Telegraf } = require('telegraf');

//Is a '-' sign necessary in "channel" string at the begining?
const channel = process.env.ANTIQUE_TG_CHANNEL;
const botToken = process.env.ANTIQUE_TG_BOT_TOKEN;

// example how to use
// await bot.sendMessage(`Bot started scrapping: ${(new Date()).toUTCString()}`);
// for sending links you can use [Link](example.com) pattern

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
