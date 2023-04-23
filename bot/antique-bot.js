const { Bot } = require('./bot');

class AntiqueBot extends Bot {
  constructor() {
    super(process.env.ANTIQUE_TG_CHANNEL, process.env.ANTIQUE_TG_BOT_TOKEN);
  }
}

exports.AntiqueBot = AntiqueBot;

const bot = new AntiqueBot();
