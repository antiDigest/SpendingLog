var summaryTypes = ["Discover", "Chase", "CitiDoubleCash", "AmericanExpress", "Venmo", "Zelle"];

function summary_(sheet) {
  var data = getLastMonthRowValues_(sheet);

  var summary = {}
  for (var i=0; i<summaryTypes.length; i++) {
    summary[summaryTypes[i]] = 0;
  }

  for (var d=0; d<data.length; d++) {
    var row = data[d];
    summary[row[CARDINDEX]] = summary[row[CARDINDEX]] + parseFloat(row[AMOUNTINDEX]);
  }

  Logger.log(summary);

  var subject = "SUMMARY\n";
  var body = "";
  for (var i=0; i<summaryTypes.length; i++) {
    body = body + summaryTypes[i] + ": " + summary[summaryTypes[i]] + "\n";
  }

  sendText(subject, body);
}
