function categorizeBatch_(merchants) {
  const prompt = `Categorize the following list of merchants into one of the categories provided below.
      Return the result as a strict JSON object where keys are the merchant names and values are the categories.
      Do not include any other text, explanations, or Markdown formatting. 
      All responses should match the order of the input values.

      Categories:
      1. Grocery
      2. Restaurants/Food & Drink
      3. Online Retail/Marketplace
      4. Retail/Shopping
      5. Gas/Automotive
      6. Rent/Utilities/Phone/Internet
      7. Entertainment/Events
      8. Insurance/Financial
      9. Transportation/Travel
      10. Bakery/Coffee Shops
      11. Home Improvement/Hardware
      12. Medical/Pharmacy
      13. Donations/Charities
      14. Sports/Recreation
      15. Other

      Merchants:
      ${JSON.stringify(merchants, null, 2)}

      Example format:
      {
        "Starbucks": {
          "Category": "Bakery/Coffee Shops",
          "ExpandedCategory": "Bakery and coffee shops, eatables"
        },
        "Amazon": {
          "Category": "Online Retails/Marketplace",
          "ExpandedCategory": "amazon online marketplace"
        },
      }`;

  const response = sendPromptToGeminiAI_(prompt);
  try {
    return JSON.parse(response);
  } catch (e) {
    Logger.log("Failed to parse JSON response from Gemini: " + response);
    return {};
  }
}

function categorizeOLD_(sheet, oldSheet) {
  var data = getSpreadsheetData_(sheet);
  var categorizedData = getSpreadsheetData_(oldSheet);

  var outputRows = [];
  var startCount = (categorizedData.length != 0) ? categorizedData.length + 1 : 0;
  var batchSize = 20; // Number of items to process in one batch

  for (var i = startCount; i < data.length; i += batchSize) {
    var batch = data.slice(i, Math.min(i + batchSize, data.length));
    var merchants = batch.map(row => row[MERCHANTINDEX]);

    var categorizedResults = categorizeBatch_(merchants);

    for (var j = 0; j < batch.length; j++) {
      var row = batch[j];
      var merchant = row[MERCHANTINDEX];
      row[CATEGORYINDEX] = categorizedResults[merchant] || "Other";

      Logger.log(merchant + " --> " + row[CATEGORYINDEX]);

      if (oldSheet.appendRow(row) != null) {
        highlightSpreadsheetRow_(oldSheet, row);
        outputRows.push(row);
      }
    }
  }
}