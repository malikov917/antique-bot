const axios = require('axios');

async function translateText(text) {
  const apiUrl = 'https://api-free.deepl.com/v2/translate';
  const apiKey = process.env.DEEPL_API_KEY;

  const formality = 'less';
  const sourceLanguage = 'EN';
  const targetLanguage = 'RU';

  const params = {
    auth_key: apiKey,
    text: text,
    source_lang: sourceLanguage,
    target_lang: targetLanguage,
    formality: formality,
  };

  try {
    const response = await axios.post(apiUrl, null, { params });
    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error translating text:', error.message);
  }
}

exports.translateText = translateText;