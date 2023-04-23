const CronJob = require('cron').CronJob;

function foo() {
  console.log('cron job ran at', new Date().getHours(), new Date().getMinutes());
}

const jobNews = new CronJob('0 9,12,15,17 * * *', function() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  if ((hour === 9 || hour === 12 || hour === 15 || hour === 17) && minute === 0) {
    foo();
    console.log('cron job ran at', hour, minute);
  }
}, null, true, 'UTC');

// cronjob for heroku which is in UTC time and executes every 1 minute
const jobHeroku = new CronJob('* * * * *', function() {
  foo();
}, null, true, 'UTC');

jobHeroku.start();
console.log('cron job started at ', new Date().getHours(), new Date().getMinutes());
