// DISCOVER CARD

function processWhenAccountIsDiscover_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("Merchant") > -1) {
      row["merchant"] = row["merchant"] + sentences[i].split("Merchant: ")[1];
      if (row["merchant"] == "undefined" || row["merchant"] == null) {
        row["merchant"] = sentences[i+2];
      } else if (row["merchant"].trim() == "" || isNumeric(row["merchant"].trim().substring(0, 2))) {
        row["merchant"] = row["merchant"] + " " + sentences[i+2];
      }
    }

    if (sentences[i].indexOf("Last 4 #:") > -1) {
      row["last4"] = sentences[i].split("Last 4 #:")[1].split(" ")[0].split(";")[1];
    }
  }

  row["body"] = sentences.join(" :: ");
  row["amount"] = getAmountFromBody_(row["body"]);

  row = transactionDateFromEmailMessage_(message.getDate(), row);
  return row;
}