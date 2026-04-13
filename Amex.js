function processWhenAccountIsAmex_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("large purchase notifications online.") > -1) {
      Logger.log(sentences[i+1]);
      Logger.log(sentences[i+2]);
      var sentence = sentences[i+1];
      row["merchant"] = sentence;
      sentence = sentence.split(" at ")[0]; 
      sentences[i+2] = sentences[i+2].replace("&#36;", "$");
      row["amount"] = sentences[i+2].split("$")[1].split("*")[0];
    } else if (sentences[i].indexOf("ACCOUNT ENDING") > -1) {
      var last4 = sentences[i+1];
      row["last4"] = last4;
    }
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  row["body"] = sentences.join(" :: ");

  Logger.log(row);

  return row;
}