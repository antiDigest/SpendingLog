function processWhenAccountIsWellsFargo_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("Zelle") > -1) {
      var sentence = sentences[i+2].split(" sent ");
      row["From"] = sentence[0];
      if (row["From"] == "You") {
        row["To"] = sentence[1].split(". ")[0].split("money to ")[1];
      } else {
        row["To"] = sentence[1].split(" money")[0];
      }
    } else if (sentences[i].indexOf("Amount") > -1) {
      row["amount"] = parseFloat(sentences[i+1].split("$")[1]);
    } else if (sentences[i].indexOf("Mobile Deposit confirmation") > -1) {
      row["category"] = "MobileDeposit"
    } else if (sentences[i].indexOf("From account") > -1) {
      row["last4"] = sentences[i+1]; 
    } else if (sentences[i].indexOf("deposited in your Wells Fargo account") > -1) {
      var sentence = sentences[i].split(" account ");
      row["last4"] = sentence[1].split(".")[0];
    } else if (sentences[i].indexOf("Deposit to") > -1) {
      row["last4"] = sentences[i+1]; 
    } 
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  row["body"] = sentences.join(" :: ");

  return row;
}
