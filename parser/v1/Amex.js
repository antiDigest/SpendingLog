// AMEX

function processWhenAccountIsAmex_(message, sentences, row) {
  row["merchant"] = ""
  for (var i=0; i<sentences.length; i++) {
    if (sentences[i].indexOf("large purchase notifications online.") > -1) {
      merchantIndex = i+1
      while (merchantIndex < sentences.length && 
        (sentences[merchantIndex] == "" || sentences[merchantIndex] == "&Acirc;")) {
        merchantIndex++;
      }

      var sentence = sentences[merchantIndex];
      row["merchant"] = sentence;
      try{
        sentence = sentence.split(" at ")[0]; 
      } catch(TypeError) {
        continue
      }

      dollarAmountIndex = merchantIndex+1

      // To remove any sentences that are either empty or just have the "&Acirc;"
      while (dollarAmountIndex < sentences.length && 
        (sentences[dollarAmountIndex] == "" || sentences[dollarAmountIndex] == "&Acirc;" || sentences[dollarAmountIndex].indexOf("$") == -1)) {
        //Logger.log(sentences[dollarAmountIndex])
        dollarAmountIndex++;
      }
      sentences[dollarAmountIndex] = sentences[dollarAmountIndex].replace("&#36;", "$");
      row["amount"] = parseFloat(sentences[dollarAmountIndex].split("$")[1].split("*")[0]);

      i = dollarAmountIndex+1
    } else if (sentences[i].indexOf("Account Ending: ") > -1) {
      var last4 = sentences[i].split(": ");
      row["last4"] = last4[1];
    }

    sentences[i] = sentences[i].split("\n").join("\\n");
  }
  row = transactionDateFromEmailMessage_(message.getDate(), row);
  
  // row["body"] = sentences.join(" :: ");

  // Logger.log(row);

  return row;
}
