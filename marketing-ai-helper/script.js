// Get references to the required elements
const promptText = document.getElementById('prompt-text');
const postExampleText = document.getElementById('post-example-text');
const linkedinResult = document.getElementById('linkedin-result');
const twitterResult = document.getElementById('twitter-result');
const intranetResult = document.getElementById('intranet-result');
const generateForLinkedinBtn = document.getElementById('generate-for-linkedin');
const generateForTwitterBtn = document.getElementById('generate-for-twitter');
const generateForIntranetBtn = document.getElementById('generate-for-intranet');

// Event listeners for button clicks
generateForLinkedinBtn.addEventListener('click', () => {
  generate('linkedin');
});

generateForTwitterBtn.addEventListener('click', () => {
  generate('twitter');
});

generateForIntranetBtn.addEventListener('click', () => {
  generate('intranet');
});

// Function to generate the result based on the selected button
async function generate(id) {
  // Get the prompt text from the textarea
  let prompt = promptText.value + ` Write this post in ${id} style. `;
  prompt = postExampleText.value
      ? prompt + ' Try to write a post also similar to this style: ' + postExampleText.value
      : prompt;

  // Make a POST request to the 'localhost:2000/ai/completion' endpoint
  const response = await fetch('/ai/completion', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Parse the response as JSON
  const { completion } = await response.json();

  // Put the result in the corresponding textarea based on the selected button
  if (id === 'linkedin') {
    linkedinResult.value = completion;
  } else if (id === 'twitter') {
    twitterResult.value = completion;
  } else if (id === 'intranet') {
    intranetResult.value = completion;
  }
}
