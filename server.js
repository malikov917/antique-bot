const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.set("port", process.env.PORT || 5000);

const browserP = puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

app.get("/", (req, res) => {
    res.send(`<p>Our simple UI is here. Right now its ${Date()}</p>`);
});

app.get("/check-puppeteer", (req, res) => {
    let page;
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
