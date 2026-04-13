// CITI Card

function processWhenAccountIsCiti_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("Amount") > -1) {
      row["amount"] = getAmountFromBody_(sentences[i]);
    } else if (sentences[i].indexOf("Merchant") > -1) {
      row["merchant"] = sentences[i+1].trim();
    } else if (sentences[i].indexOf("Card Ending") > -1) {
      row["last4"] = sentences[i+1];
    }
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);

  row["body"] = sentences.join(" :: ");

  return row;
}