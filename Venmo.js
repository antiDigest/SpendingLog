function processWhenAccountIsVenmo_(message, sentences, row) {
  row["merchant"] = ""
  // Logger.log(sentences)
  transactionMetadataComplete = false;
  amountComplete = false;
  for (var i=0; i<sentences.length; i++) {
    Logger.log(sentences[i])
    if (sentences[i].indexOf("$") > -1 && !amountComplete) {
      amount = 0.00
      if (sentences[i].length == 1) {
        amount = parseFloat(sentences[i+1]) + parseFloat(sentences[i+3] * 0.01)
      } else {
        amount = sentences[i].split("$")[1].split("*")[0]
      }

      if (sentences[i].indexOf("+") > -1 || row["To"] == "You" || row["To"] == "you") {
        row["amount"] = -1 * amount;
      } else {
        row["amount"] = amount;
      }
      amountComplete = true;
    } else if (sentences[i].indexOf(" paid ") > -1 && !transactionMetadataComplete) {
      paymentMetadata = sentences[i].split(" paid ")
      // Logger.log("Logging payment metadata")
      // Logger.log(paymentMetadata)

      if (paymentMetadata == null) {
        continue
      } else if (paymentMetadata.length == 0 || paymentMetadata[0] == "" || paymentMetadata[1] == "") {
        prevInfoIndex = i-1
        while (prevInfoIndex > 0 && 
          (sentences[prevInfoIndex] == "&nbsp" || sentences[prevInfoIndex] == "")) {
          prevInfoIndex--;
        }
        row["From"] = sentences[prevInfoIndex];
        nextInfoIndex = i+1;
        while (nextInfoIndex <sentences.length && 
          (sentences[nextInfoIndex] == "&nbsp" || sentences[nextInfoIndex] == "paid")) {
          nextInfoIndex++;
        }
        row["To"] = sentences[nextInfoIndex];
      } else if (paymentMetadata[1].indexOf("$") > -1) {
        continue
      } else {
        row["From"] = paymentMetadata[0]
        row["To"] = paymentMetadata[1]
      }

      if (row["To"] == "antriksh.don@gmail.com" || 
        row["To"] == "you") { // edge case
        row["To"] = "You"
        if (row["amount"] != null) {
          row["amount"] = -1 * row["amount"]
        }
      }
      transactionMetadataComplete = true;
    } else if (sentences[i].indexOf("$") > -1 && sentences[i].length == 1) {
      row["merchant"] = sentences[i+4]
    } 
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  // row["body"] = sentences.join(" :: ");

  // Logger.log(row);

  return row;
}
