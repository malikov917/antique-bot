const express = require("express");
const puppeteer = require("puppeteer");
const { join } = require('path');

const app = express();
app.set("port", process.env.PORT || 5000);

app.get("/", (req, res) => {
    res.send(`<p>Our simple UI is here. Right now its ${Date()}</p>`);
});

app.get("/test", (req, res) => {
    const isHeroku = process.env.BOT_ENVIRONMENT === 'heroku';

    console.log(process.env.BOT_ENVIRONMENT, 'process.env.BOT_ENVIRONMENT')
    console.log(isHeroku, 'isHeroku')

    console.log(process.env, 'process.env')

    const result = isHeroku
        ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
        : { };

    console.log(res, 'res')

    res.send(`
        <p>Our simple UI is here. Right now its ${Date()}</p>
        <div>${process.env.BOT_ENVIRONMENT} process.env.BOT_ENVIRONMENT</div>
        <div>${isHeroku} isHeroku</div>
        <div>${result} result</div>
        <div>${process.env} process.env</div>
    `);
});

app.get("/check-puppeteer", (req, res) => {
    let page;

    const browserP = puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    (async () => {
        page = await (await browserP).newPage();
        await page.setContent(`<p>Puppeteer is working at ${Date()}</p>`);
        res.send(await page.content());
    })()
        .catch(err => res.sendStatus(500))
        .finally(() => page.close())
    ;
});

app.listen(app.get("port"), () =>
    console.log("app running on port", app.get("port"))
);
