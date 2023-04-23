const ShortReadService = require("./services/short-read/short-read.service");
const mongoose = require("mongoose");
const {connectionSettings} = require("./configs/mongodb-connection-settings");
require('dotenv').config();
const CronJob = require('cron').CronJob;
const shortReadService = new ShortReadService();


async function foo() {
  console.log('cron job ran at', new Date().getHours(), new Date().getMinutes());
  await shortReadService.postLatestNews();
}

const jobNews = new CronJob('0 9,12,15,17,19,21 * * *', function() {
  foo();
}, null, true, 'UTC');

// cronjob for heroku which is in UTC time and executes every 1 minute
const jobHeroku = new CronJob('* * * * *', function() {
  foo();
}, null, true, 'UTC');

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => {
      jobNews.start();
      console.log('cron job started at ', new Date().getHours(), new Date().getMinutes());
    })
    .catch(errors => console.error(errors));