const OpenAI = require('openai');
const puppeteer = require('puppeteer');
const url = require('url');

class EmailBuilder {
    constructor() {
        // console.log("starting builder");
        this.tones = ["formal", "informal"];
        this.goals = ["convince people to buy your product", "recover churned customers", "teach a new concept", "onboard new users", "share product updates"];
        this.llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.webText = "";
    }

    withGoal(index) {
        this.goal = this.goals[index] || this.goals[0];
        return this;
    }

    withTone(index) {
        this.tone = this.tones[index] || this.tones[0];
        return this;
    }

    withIndustry(industry) {
        this.industry = industry;
        return this;
    }

    withDetails(details) {
        this.details = details;
        return this;
    }

    withWebsite(web) {
        // Check if the protocol is missing, and if so, prepend 'http://'
        if (!web.match(/^[a-zA-Z]+:\/\//)) {
            web = 'http://' + web;
        }

        try {
            // Parse and rebuild URL to sanitize it
            const parsedUrl = new url.URL(web);
            parsedUrl.protocol = parsedUrl.protocol.toLowerCase();
            parsedUrl.hostname = parsedUrl.hostname.toLowerCase();
            this.web = parsedUrl.href;
            // console.log("web", this.web);
        } catch (e) {
            console.error('Invalid URL:', e);
            this.web = null;
        }
        
        return this; // To make it chainable
    }

    withTwitter(twitter) {
        this.twitter = twitter;
        return this;
    }

    withTemperature(temperature) {
        this.temperature = temperature || 0.7
        return this
    }

    async build() {
        this.web && await this.scrapeWebsite();
        this.generatePrompt();
        const completion = await this.llm.chat.completions.create({
            messages: [{ role: 'system', content: "You are a world-class email marketer. Always respond in Markdown" },
            { role: 'user', content: this.prompt }],
            model: 'gpt-3.5-turbo',
            temperature: this.temperature
        });
        this.response = completion.choices[0].message.content;
        return this.response;
    }

    generatePrompt() {
        this.prompt = `Write a ${this.tone} email to ${this.goal} for the ${this.industry} industry.\n\n Here are some details about the marketing campaign to include: ${this.details} ${this.web ?`\n\n Write the email in the following style: ${this.webText}` : ""}`;
        // console.warn("Prompt", this.prompt);
    }

    async scrapeTwitter() {
        //too difficult to implement without api key, see test.js
    }

    async scrapeWebsite() {
        if (!this.web) return;

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.goto(this.web, { waitUntil: 'domcontentloaded' });

        const scrapedData = await page.evaluate(() => {
            // This will grab all text content from the body of the webpage
            const bodyText = document.body.innerText;
            return bodyText;
        });

        // Close the browser
        await browser.close();

        // Limit to 1000 words
        const words = scrapedData.split(/\s/).slice(0, 1000).join(' ');

        // console.log("webText", words);
        this.webText = words;
    }
}

module.exports = EmailBuilder;
