const puppeteer = require('puppeteer');

const scrapeTwitter = async (username) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.on('console', (msg) => {
        console.log('PAGE LOG:', msg.text());
    });

    await page.goto(`https://twitter.com/${username}`);
    console.log(`Navigated to https://twitter.com/${username}`);

    try {
        let tweetsArray = [];

        while (tweetsArray.length === 0) {
            tweetsArray = await page.evaluate(() => {
                console.log("Page evaluation function was called");
                const tweetNodes = document.querySelectorAll('div[data-testid="tweetText"]');
                console.log("tweetNodes length:", tweetNodes.length);

                if (tweetNodes.length === 0) {
                    return [];
                }

                const tweets = [];
                for (const node of tweetNodes) {
                    const text = node.innerText;
                    tweets.push(text);
                }
                return tweets;
            });

            if (tweetsArray.length === 0) {
                // Scroll and wait for lazy load
                await page.evaluate(() => {
                    window.scrollBy(0, 1000);
                });
                await page.waitForTimeout(5000); // wait for 5 seconds to load new tweets
            }
        }

        await browser.close();
        return tweetsArray;

    } catch (error) {
        console.error(`An error occurred: ${error}`);
        await browser.close();
        return null;
    }
};

// scrapeTwitter('monstercameron')
//     .then(tweets => {
//         if (tweets) {
//             console.log("Fetched tweets:", tweets);
//         } else {
//             console.log('Failed to fetch tweets.');
//         }
//     })
//     .catch(error => console.error(`An unexpected error occurred: ${error}`));


const scrapeWebsite = async (web) => {
    // if (!this.web) return;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(web, { waitUntil: 'domcontentloaded' });

    const scrapedData = await page.evaluate(() => {
        // This will grab all text content from the body of the webpage
        const bodyText = document.body.innerText;
        return bodyText;
    });

    // Close the browser
    await browser.close();

    // Limit to 1000 words
    const words = scrapedData.split(/\s/).slice(0, 1000).join(' ');

    return words;
}

(async () => {
    const scraper = await scrapeWebsite('https://www.earlcameron.com');
    console.log("Scraped Data:", scraper);
})();