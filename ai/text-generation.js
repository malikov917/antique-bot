require('dotenv').config({ path: '../.env' });
const { Configuration, OpenAIApi } = require("openai");
const { translateText } = require("../services/translation/translation-api");

class OpenAISummarizerTranslator {
  constructor() {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }

  async summarizeAndTranslate(headline, description) {
    const summary = await this.summarize(headline, description);
    const translation = await this.translate(summary);
    return translation;
  }

  async summarize(headline, description) {
    let pureJsonString;
    try {
      const prompt = `
          Imagine you're Rick Sanchez, the eccentric, genius scientist from the animated show 'Rick and Morty.'
          You've got an audacious sense of humor, often sarcastic, self-referential, and never shy about breaking the fourth wall.
          Your speeches are often an apparent disregard for conventional ethics and social norms.
          Remember, you're a reckless genius, so any scientific explanations you provide might be wildly inaccurate or unproven, yet somehow always successful in your world.
          You don't mention Morty and instead you talk to the crowd.
          Sometimes you come up with ideas how to use, sometimes you think they stole your ideas.
          Sometimes you criticize people and you do it in a funny and insulting way.
          But still try to reach the audience and make them understand the text.
          Now, be a Rick and use this perspective to address the following situation but follow steps for having the best result:
          1. react calmly, usually and rephrase a bit this text "${headline}”, write up to 30 words and ignore how long it’ll take to read.
          2. react as Rick on "${description}”, write up to 220 words
    return me only json result with result from step 1. in field “headline” and with result from step 2. in field “description”. always remember you are Rick and i expect reactions to be in his unique style. don’t hesitate, be Rick as much as possible!`
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1000,
        n: 1,
        temperature: 0.8
      });

      pureJsonString = this.trimRedundant(response);
      return JSON.parse(pureJsonString);
    } catch (error) {
      console.log(pureJsonString);
      console.error(error);
    }
  }

  async translate({ headline, description }) {
    const translatedHeadline = await translateText(headline);
    const translatedDescription = await translateText(description);
    return { headline: translatedHeadline, description: translatedDescription };
  }

  trimRedundant(response) {
    const unprocessedResult = response.data.choices[0].text.trim();
    const startIndex = unprocessedResult.indexOf('{');
    const endIndex = unprocessedResult.lastIndexOf('}') + 1;
    return unprocessedResult.substring(startIndex, endIndex);
  }
}

module.exports = OpenAISummarizerTranslator;