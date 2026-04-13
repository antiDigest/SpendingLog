function categorize_(merchant, day, month, year, time) {
  gptPromptStatement = "A credit card payment was made at the merchant \"" + merchant + "\" on " + 
    day + " " + month + " " + year + " around " +  time + ".\n\n"+
    "Categorize this card payment merchant using the categories listed below.\n" + 
    "Here's a list of categories to pick from:\n" + 
    "1. Grocery: (Includes grocery stores, supermarkets, and related food stores)\n" + 
    "2. Restaurants/Food & Drink: (Encompasses all types of restaurants, cafes, fast food, food delivery, and related services)\n" + 
    "3. Online Retail/Marketplace: (Covers all online purchases, including Amazon, eBay, and general online retail)\n" + 
    "4. Retail/Shopping: (Includes physical retail stores, department stores, and general shopping)\n" +
    "5. Gas/Automotive: (Covers gas stations, auto parts, car services, and related expenses)\n" + 
    "6. Rent/Utilities/Phone/Internet: (Includes all rent and utility payments, phone services, and internet/cable providers)\n" + 
    "7. Entertainment/Events: (Encompasses movies, concerts, sporting events, and other entertainment activities)\n" + 
    "8. Insurance/Financial: (Covers insurance payments, financial services, and related transactions)\n" +
    "9. Transportation/Travel: (Includes ride-sharing, parking, gas, airline travel, and other travel-related expenses)\n" +
    "10. Bakery/Coffee Shops: (Although a subset of food, it is a very prevalent category in the list)\n\n" + 
    "11. Home Improvement/Hardware\n" + 
    "12. Medical/Pharmacy\n" + 
    "13. Donations/Charities\n" + 
    "14. Sports/Recreation\n" + 
    "15. Temporary Holds/Uncategorized\n" + 
    "If none of these categories make sense for this payment, use the category \"Other\".\n\n" + 
    "Return just the category, I do not need the description/explanation of why you picked a category."

  return sendPromptToGeminiAI_(gptPromptStatement)
  // return sendPromptToChatGPT_(gptPromptStatement)
}

function getExpandedCategory_(merchant, day, month, year, time) {
  gptPromptStatement = "A credit card payment was made at the merchant \"" + merchant + "\" on " + 
    day + " " + month + " " + year + " around " +  time + ".\n\n"+
    "Categorize this card payment merchant and the given data with the best of your ability.\n\n" + 
    "Return just the category, I do not need the description/explanation of why you picked a category."

  return sendPromptToGeminiAI_(gptPromptStatement)
  // return sendPromptToChatGPT_(gptPromptStatement)
}

function categorizeOLD_(sheet, oldSheet) {
  var data = getSpreadsheetData_(sheet)
  var categorizedData = getSpreadsheetData_(oldSheet)

  var date = new Date();
  date = new Date(date.getTime());

  outputRows = []
  startCount = 0
  if (categorizedData.length != 0){
    startCount = categorizedData.length + 1
  }

  runtime = 0;
  for (var d=startCount; d<data.length; d++) {
    var row = data[d];

    category = categorize_(row[MERCHANTINDEX], row[DATEDAYOFWEEKINDEX], row[DATEMONTHINDEX], row[DATEYEARINDEX], row[TIMESTAMPINDEX])
    Logger.log(row[MERCHANTINDEX] + " --> " + category)
    row[CATEGORYINDEX] = category
    Logger.log(row)

    outputRows.push(row)

    if (oldSheet.appendRow(row) == null) {
      // sheet.deleteRow(d);
    }

    if (runtime > 30000 * 10) break;
    Utilities.sleep(30000);
    runtime += 30000;
  }

  return
}