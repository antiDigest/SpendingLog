function processWhenAccountIsVenmo_(message, sentences, row) {
  Logger.log(sentences);
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("Venmo") > -1) {
      row["From"] = sentences[i+1];
      row["To"] = sentences[i+3];
      row["merchant"] = sentences[i+4];
    } else if (sentences[i].indexOf("Like") > -1) {
      if (sentences[i-1].indexOf("+") > -1) {
        row["amount"] = -1 * parseFloat(sentences[i-1].split("$")[1]);
      } else {
        row["amount"] = parseFloat(sentences[i-1].split("$")[1]);
      }
    }
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  row["body"] = sentences.join(" :: ");

  Logger.log(row);

  return row;
}
