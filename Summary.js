var summaryTypes = ["Discover", "Chase", "Citi", "AmericanExpress", "Venmo", "Zelle", "BankOfAmerica", "Bilt", "Total"];

var categorySummaryTypes = [BAKERY_COFFEE_SHOPS, DONATIONS_CHARITY, ENTERTAINMENT_EVENTS, GAS_AUTOMOTIVE, GROCERY, HOME_IMPROVEMENT_HARDWARE, INSURANCE_FINANCIAL, MEDICAL_PHARMACY, ONLINE_RETAIL_MARKETPLACE, OTHER, RESTAURANTS_FOOD_DRINK, RETAIL_SHOPPING, SPORTS_RECREATION, TEMPORARY_UNCATEGORIZED, TRANSPORTATION_TRAVEL, RENT_UTILITIES_PHONE_INTERNET]

SUMMARY_TYPE_TOTAL_INDEX = 8;

function summary_(data, monthSummarySheet) {
  var summary = {}
  for (var i=0; i<summaryTypes.length; i++) {
    summary[summaryTypes[i]] = 0;
  }
  for (var i=0; i<categorySummaryTypes.length; i++) {
    summary[categorySummaryTypes[i]] = 0;
  }

  summaryRows = []
  row = data[0]
  for (var d=0; d<data.length; d++) {
    summary[data[d][CARDINDEX]] = summary[data[d][CARDINDEX]] + parseFloat(data[d][AMOUNTINDEX]);
    summary[data[d][CATEGORYINDEX]] = summary[data[d][CATEGORYINDEX]] + parseFloat(data[d][AMOUNTINDEX]);
    summary[summaryTypes[SUMMARY_TYPE_TOTAL_INDEX]] = summary[summaryTypes[SUMMARY_TYPE_TOTAL_INDEX]] + parseFloat(data[d][AMOUNTINDEX]);
  }

  Logger.log(row[DATEYEARINDEX] + " :: " + row[DATEMONTHINDEX])
  Logger.log(summary)
  summaryRows.push([row[DATEYEARINDEX], row[DATEMONTHINDEX], summary["Discover"], summary["Chase"], summary["Citi"], summary["AmericanExpress"],
                      summary["Venmo"], summary["Zelle"], summary["BankOfAmerica"], summary["Bilt"], summary[BAKERY_COFFEE_SHOPS], summary[DONATIONS_CHARITY], summary[ENTERTAINMENT_EVENTS], 
                      summary[GAS_AUTOMOTIVE], summary[GROCERY], summary[HOME_IMPROVEMENT_HARDWARE], summary[INSURANCE_FINANCIAL], summary[MEDICAL_PHARMACY], 
                      summary[ONLINE_RETAIL_MARKETPLACE], summary[OTHER], summary[RESTAURANTS_FOOD_DRINK], summary[RETAIL_SHOPPING], summary[SPORTS_RECREATION], 
                      summary[TEMPORARY_UNCATEGORIZED], summary[TRANSPORTATION_TRAVEL], summary[RENT_UTILITIES_PHONE_INTERNET], summary["Total"]])

  if(!fillMonthlySummarySpreadsheet_(summaryRows, monthSummarySheet)) {
    throw "Error"
  }

}

function summarizeAllPastMonths_(sheet, monthSummarySheet) {
  var data = getSpreadsheetData_(sheet)

  var date = new Date();
  date = new Date(date.getTime());

  summaryRows = []
  for (var d=0; d<data.length; d++) {
    var row = data[d];

    var summary = {}
    for (var i=0; i<summaryTypes.length; i++) {
      summary[summaryTypes[i]] = 0;
    }
    for (var i=0; i<categorySummaryTypes.length; i++) {
      summary[categorySummaryTypes[i]] = 0;
    }

    if (d<data.length && (data[d][DATEYEARINDEX] == date.getFullYear() && 
            MONTH_MAP[data[d][DATEMONTHINDEX]] == date.getMonth())) {
              break;
            }

    while (d<data.length && 
            (data[d][DATEYEARINDEX] == row[DATEYEARINDEX] && 
            MONTH_MAP[data[d][DATEMONTHINDEX]] == MONTH_MAP[row[DATEMONTHINDEX]])) {
      summary[data[d][CARDINDEX]] = summary[data[d][CARDINDEX]] + parseFloat(data[d][AMOUNTINDEX]);
      summary[data[d][CATEGORYINDEX]] = summary[data[d][CATEGORYINDEX]] + parseFloat(data[d][AMOUNTINDEX]);
      summary[summaryTypes[SUMMARY_TYPE_TOTAL_INDEX]] = summary[summaryTypes[SUMMARY_TYPE_TOTAL_INDEX]] + parseFloat(data[d][AMOUNTINDEX]);
      d++;
    }

    Logger.log(row[DATEYEARINDEX] + " :: " + row[DATEMONTHINDEX])
    Logger.log(summary)

    summaryRows.push([row[DATEYEARINDEX], row[DATEMONTHINDEX], summary["Discover"], summary["Chase"], summary["Citi"], summary["AmericanExpress"],
                      summary["Venmo"], summary["Zelle"], summary["BankOfAmerica"], summary["Bilt"], summary[BAKERY_COFFEE_SHOPS], summary[DONATIONS_CHARITY], summary[ENTERTAINMENT_EVENTS], 
                      summary[GAS_AUTOMOTIVE], summary[GROCERY], summary[HOME_IMPROVEMENT_HARDWARE], summary[INSURANCE_FINANCIAL], summary[MEDICAL_PHARMACY], 
                      summary[ONLINE_RETAIL_MARKETPLACE], summary[OTHER], summary[RESTAURANTS_FOOD_DRINK], summary[RETAIL_SHOPPING], summary[SPORTS_RECREATION], 
                      summary[TEMPORARY_UNCATEGORIZED], summary[TRANSPORTATION_TRAVEL], summary[RENT_UTILITIES_PHONE_INTERNET], summary["Total"]])

    // break;
  }

  if(!fillMonthlySummarySpreadsheet_(summaryRows, monthSummarySheet)) {
    throw "Error"
  }

}