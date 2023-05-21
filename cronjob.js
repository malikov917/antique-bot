require('dotenv').config();
const ShortReadService = require("./services/short-read/short-read.service");
const mongoose = require("mongoose");
const {connectionSettings} = require("./configs/mongodb-connection-settings");
const CronJob = require('cron').CronJob;
const shortReadService = new ShortReadService();
const axios = require('axios');
const HEROKU_APP_URL = 'https://antique-node-bot.herokuapp.com/';


async function foo() {
  console.log('[cron] post latest news ran at: ', new Date().getHours(), new Date().getMinutes());
  await shortReadService.postLatestNews();
}

const jobNews = new CronJob('0 9,12,15,17,19,21 * * *', function() {
  foo();
}, null, true, 'UTC');

const keepAwakeJob = new CronJob('0,20,40 * * * *', async function () {
  console.log('[cron] keep awake: ', new Date().getHours(), new Date().getMinutes());
  const res = await axios.get(HEROKU_APP_URL);
  if (res.status === 200) {
    console.log('app is running, req status 200');
  } else {
    console.log('app is not running, req status: ', res.status)
  }
}, null, true, 'UTC');

mongoose.connect(process.env.ANTIQUE_DB_STRING, connectionSettings)
    .then(() => {
      jobNews.start();
      keepAwakeJob.start()
      console.log('[cron] job started at: ', new Date().getHours(), new Date().getMinutes());
    })
    .catch(errors => console.error(errors));