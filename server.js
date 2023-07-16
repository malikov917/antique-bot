const express = require("express");
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');
const { join } = require('path');
const OpenAISummarizer = require("./ai/text-generation");

const app = express();
app.set("port", process.env.PORT || 5000);

const uiLinks = `<a href="/">HOME</a>
                <a href="/marketing-ai-helper">Marketing AI Helper</a>
                <a href="/check-puppeteer">check puppeteer</a>
                <a href="/test">test</a>`;

app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'lekai/lekai/dist/lekai')));
app.use(express.static(join(__dirname, 'marketing-ai-helper')));

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

app.get("/marketing-ai-helper", (req, res) => {
    const filePath = join(__dirname, './marketing-ai-helper/index.html');
    res.sendFile(filePath);
});

app.get("/lekai", (req, res) => {
    const filePath = join(__dirname, './lekai/lekai/dist/lekai/index.html');
    res.sendFile(filePath);
});

app.get("/check-puppeteer", (req, res) => {
    let page;

    const browserP = puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

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

app.post('/ai/completion', async (req, res) => {
    try {
        const { prompt } = req.body;

        const openaiApi = new OpenAISummarizer();

        const completion = await openaiApi.marketingAiHelper(prompt);

        res.json({ completion });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/ai/generate-exercise', async (req, res) => {
    try {
        const { prompt } = req.body;

        res.json({ completion: 'yo' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(app.get("port"), () =>
    console.log("app running on port", app.get("port"))
);
