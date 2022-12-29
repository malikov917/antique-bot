// scroll page functionalities
// 1. scroll to the bottom
// 2. scroll until pagination
// 3. scroll until item

async function autoScroll(page) {
    await page.mouse.move(700, 400);
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}

exports.autoScroll = autoScroll;
