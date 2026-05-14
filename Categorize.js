function categorizeBatch_(merchants) {
  const prompt = `Categorize the following list of merchants into one of the categories provided below.
      Return the result as a strict JSON object where keys are the merchant names and values are the categories.
      Do not include any other text, explanations, or Markdown formatting. 
      All responses should match the order of the input values.

      Categories:
      1. ${GROCERY}
      2. ${RESTAURANTS_FOOD_DRINK}
      3. ${ONLINE_RETAIL_MARKETPLACE}
      4. ${RETAIL_SHOPPING}
      5. ${GAS_AUTOMOTIVE}
      6. ${RENT_UTILITIES_PHONE_INTERNET}
      7. ${ENTERTAINMENT_EVENTS}
      8. ${INSURANCE_FINANCIAL}
      9. ${TRANSPORTATION_TRAVEL}
      10. ${BAKERY_COFFEE_SHOPS}
      11. ${HOME_IMPROVEMENT_HARDWARE}
      12. ${MEDICAL_PHARMACY}
      13. ${DONATIONS_CHARITY}
      14. ${SPORTS_RECREATION}
      15. ${CAREER_GROWTH}
      16. ${OTHER}

      Merchants:
      ${JSON.stringify(merchants, null, 2)}

      Example format:
      {
        "Starbucks": {
          "Category": "${BAKERY_COFFEE_SHOPS}",
          "ExpandedCategory": "Bakery and coffee shops, eatables"
        },
        "Amazon": {
          "Category": "${ONLINE_RETAIL_MARKETPLACE}",
          "ExpandedCategory": "amazon online marketplace"
        },
        "INTERVIEWDB": {
          "Category": "${CAREER_GROWTH}",
          "ExpandedCategory": "interview prep"
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
      row[CATEGORYINDEX] = categorizedResults[merchant] || OTHER;

      Logger.log(merchant + " --> " + row[CATEGORYINDEX]);

      if (oldSheet.appendRow(row) != null) {
        highlightSpreadsheetRow_(oldSheet, row, INDIVIDUAL_CATEGORY_LIMITS);
        outputRows.push(row);
      }
    }
  }
}