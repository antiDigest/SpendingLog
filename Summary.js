var summaryTypes = ["Discover", "Chase", "Citi", "AmericanExpress", "Venmo", "Zelle", "BankOfAmerica", "Bilt", "Total"];

var categorySummaryTypes = ["Bakery/Coffee Shops","Donation/Charity","Entertainment/Events","Gas/Automotive","Grocery","Home Improvement/Hardware","Insurance/Financial","Medical/Pharmacy","Online Retail/Marketplace","Other","Restaurants/Food & Drink","Retail/Shopping","Sports/Recreation","Temporary Holds/Uncategorized","Transportation/Travel","Rent/Utilities/Phone/Internet"]

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
                      summary["Venmo"], summary["Zelle"], summary["BankOfAmerica"], summary["Bilt"], summary["Bakery/Coffee Shops"], summary["Donation/Charity"], summary["Entertainment/Events"], 
                      summary["Gas/Automotive"], summary["Grocery"], summary["Home Improvement/Hardware"], summary["Insurance/Financial"], summary["Medical/Pharmacy"], 
                      summary["Online Retail/Marketplace"], summary["Other"], summary["Restaurants/Food & Drink"], summary["Retail/Shopping"], summary["Sports/Recreation"], 
                      summary["Temporary Holds/Uncategorized"], summary["Transportation/Travel"], summary["Rent/Utilities/Phone/Internet"], summary["Total"]])

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
                      summary["Venmo"], summary["Zelle"], summary["BankOfAmerica"], summary["Bilt"], summary["Bakery/Coffee Shops"], summary["Donation/Charity"], summary["Entertainment/Events"], 
                      summary["Gas/Automotive"], summary["Grocery"], summary["Home Improvement/Hardware"], summary["Insurance/Financial"], summary["Medical/Pharmacy"], 
                      summary["Online Retail/Marketplace"], summary["Other"], summary["Restaurants/Food & Drink"], summary["Retail/Shopping"], summary["Sports/Recreation"], 
                      summary["Temporary Holds/Uncategorized"], summary["Transportation/Travel"], summary["Rent/Utilities/Phone/Internet"], summary["Total"]])

    // break;
  }

  if(!fillMonthlySummarySpreadsheet_(summaryRows, monthSummarySheet)) {
    throw "Error"
  }

}