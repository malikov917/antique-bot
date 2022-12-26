const express = require("express");
const puppeteer = require("puppeteer");
const { join } = require('path');

const app = express();
app.set("port", process.env.PORT || 5000);

const uiLinks = `<a href="/">HOME</a>
                <a href="/check-puppeteer">check puppeteer</a>
                <a href="/test">test</a>`;

app.get("/", (req, res) => {
    res.send(`
        <p>You are on the HOME page. . Right now its ${Date()}</p>
        ${uiLinks}
    `);
});

app.get("/test", (req, res) => {
    const isHeroku = process.env.BOT_ENVIRONMENT === 'heroku';

    const result = isHeroku
        ? { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
        : { };

    res.send(`
        <p>You are on the TEST page. Right now its ${Date()}</p>
        ${uiLinks}
    `);
});

const browserP = puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

app.get("/check-puppeteer", (req, res) => {
    let page;



    (async () => {
        page = await (await browserP).newPage();
        await page.setContent(`<p>Puppeteer is working at ${Date()}</p>`);
        const contentFromPuppeteer = await page.content();
        res.send(`
            <p>You are on the CHECK-PUPPETEER page. Right now its ${Date()}</p>
            <div>${contentFromPuppeteer} Content From Puppeteer</div>
            ${uiLinks}
        `);
    })()
        .catch(err => res.sendStatus(500))
        .finally(() => page.close())
    ;
});

app.listen(app.get("port"), () =>
    console.log("app running on port", app.get("port"))
);
