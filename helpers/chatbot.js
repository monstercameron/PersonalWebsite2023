const OpenAI = require('openai');

class EmailBuilder {
    constructor() {
        console.log("starting builder");
        this.tones = ["formal", "informal"];
        this.goals = ["convince people to buy your product", "recover churned customers", "teach a new concept", "onboard new users", "share product updates"];
        this.llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
        this.web = web;
        return this;
    }

    withTwitter(twitter) {
        this.twitter = twitter;
        return this;
    }

    async build() {
        this.generatePrompt();
        const completion = await this.llm.chat.completions.create({
            messages: [{ role: 'user', content: this.prompt }],
            model: 'gpt-3.5-turbo',
        });
        this.response = completion.choices[0].message.content;
        return this.response;
    }

    generatePrompt() {
        this.prompt = `You are a world-class email marketer. Using Markdown, Write a ${this.tone} email to ${this.goal} for the ${this.industry} industry. Here are some details about the marketing campaign to include: ${this.details}`;
    }
}

module.exports = EmailBuilder;
