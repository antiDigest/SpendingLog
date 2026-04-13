// CHASE

function processWhenAccountIsChase_(message, sentences, row) {
  row["merchant"] = ""
  for (var i = 0; i < sentences.length; i++) {
    if (sentences[i].indexOf("Merchant") > -1) {
      row["merchant"] = sentences[i + 1];
    } else if (sentences[i].indexOf("Amount") > -1) {
      row["amount"] = parseFloat(sentences[i + 1].split("$")[1]);
    } else if (sentences[i].indexOf("Account") > -1) {
      var last4 = sentences[i + 1].split("...")[1];
      try {
        last4 = last4.split(")")[0];
      } catch (TypeError) {
        last4 = last4;
      }
      row["last4"] = last4;
    }

    sentences[i] = sentences[i].split("\n").join("\\n");
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);

  return row;
}