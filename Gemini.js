// Gemini API key required in config


function sendPromptToGeminiAI_(q) {
  const apiKey = SECRETS_CONFIG['GEMINI_API_KEY'];  // Replace with your actual API key from Google Cloud
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: q }] }]
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response.getContentText());

  if (jsonResponse.candidates && jsonResponse.candidates.length > 0) {
    return jsonResponse.candidates[0].content.parts.map(part => part.text).join('').trim();
  }
  return "No response received.";
}