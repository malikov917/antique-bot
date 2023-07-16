require('dotenv').config({ path: '../.env' });
const { Configuration, OpenAIApi } = require("openai");

class OpenAISummarizer {
  constructor() {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }

  async summarize(headline, description) {
    const summary = await this.summarizeAsRick(headline, description);
    return summary;
  }

  async summarizeAsRick(headline, description) {
    let pureJsonString;
    try {
      const prompt = `
          Imagine you're Rick Sanchez, the eccentric, genius scientist from the animated show 'Rick and Morty.'
          You've got an audacious sense of humor, often sarcastic, self-referential, and never shy about breaking the fourth wall.
          Your speeches are often an apparent disregard for conventional ethics and social norms.
          Remember, you're a reckless genius, so any scientific explanations you provide might be wildly inaccurate or unproven,
          yet somehow always successful in your world.
          You don't mention Morty and instead you talk to me directly.
          Sometimes you come up with ideas how to use, sometimes you think they stole your ideas.
          Sometimes you criticize people and you do it in a funny and insulting way.
          But still try to reach the audience and make them understand the text.
          Now, be a Rick and use this perspective to address the following situation and follow steps for having the best result:
          Step 1:  write up to 30 words , ignore how long it’ll take to read, react calmly, usually and rephrase a bit this text "${headline}”.
          Step 2: now react as a bit drunk and overreacting Rick and write up to 250 words about "${description}”.
          Return me only correct json result with result from Step 1 in field “headline” and with result from Step 2 in field “description”.
          Remember you are Rick, you talk from his person and I expect crazy scientist comments in Rick's unique style.
          Don’t hesitate, be Rick as much as possible!`
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 1000,
        n: 1,
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      pureJsonString = this.trimRedundant(response);
      return JSON.parse(pureJsonString);
    } catch (error) {
      console.log(pureJsonString);
      console.error(error);
    }
  }

  async marketingAiHelper(prompt) {
    try {
      const response = await this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 500,
        n: 1,
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error(error);
    }
  }

  async generateExercise(requestBody) {

    const prompt = ({ favoriteTopics, exerciseType, language, knowledgeLevel }) => `
You are an intelligent assistant tasked with creating an English exercise for a language learner.
The exercise type is '${exerciseType}'.
The learner's favorite topics are ${(favoriteTopics || []).join(', ')}, and they are at an ${knowledgeLevel} level of ${language} proficiency.
Return me 5 examples in JSON format only, no text before or after, pure JSON. JSON format example is:
{
 "exercises": [
   {
     "sentence": "I __________ to a concert last night.",
     "options": ["went", "go", "gone"],
     "answer": "went"
   }
 ]
}`
    const messages = (prompt) => [
      {
        "role": "system",
        "content": prompt
      }
    ]

    const { favoriteTopics, exerciseType, language, knowledgeLevel } = requestBody;

    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages(prompt({ favoriteTopics, exerciseType, language, knowledgeLevel })),
      temperature: 1,
      max_tokens: 2047,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response.data.choices[0].message.content.trim());
    const isJson = (str) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    if (!isJson(response.data.choices[0].message.content.trim())) {
      throw new Error('Invalid JSON response from OpenAI');
    }
    return JSON.parse(response.data.choices[0].message.content.trim());
  }

  trimRedundant(response) {
    const unprocessedResult = response.data.choices[0].text.trim();
    const startIndex = unprocessedResult.indexOf('{');
    const endIndex = unprocessedResult.lastIndexOf('}') + 1;
    return unprocessedResult.substring(startIndex, endIndex);
  }
}

module.exports = OpenAISummarizer;
