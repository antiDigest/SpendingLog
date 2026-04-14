// Gemini API key required in config


function sendPromptToGeminiAI_(q) {
  const apiKey = SECRETS_CONFIG['GEMINI_API_KEY'];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: q }] }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const jsonResponse = JSON.parse(response.getContentText());
  } catch (e) {
    Logger.log("Error returned from Gemini: " + e);
    return "{}";
  }

  if (jsonResponse.candidates && jsonResponse.candidates.length > 0) {
    return jsonResponse.candidates[0].content.parts.map(part => part.text).join('').trim();
  }
  return "{}";
}