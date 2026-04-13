var GenericParser = {
  parse: function(paymentMethod, message, sentences, row) {
    row["merchant"] = "";
    row["amount"] = 0.00;
    row["last4"] = "";

    // Route to specific parsing logic based on bank
    if (this[paymentMethod]) {
      this[paymentMethod](sentences, row);
    } else {
      // Fallback/Generic parsing
      var body = sentences.join(" :: ");
      row["merchant"] = "Unknown Merchant";
      row["amount"] = this.extractAmount(body);
      row["last4"] = this.extractLast4(body);
    }

    return transactionDateFromEmailMessage_(message.getDate(), row);
  },

  Discover: function(sentences, row) {
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("Merchant") > -1) {
        row["merchant"] = sentences[i].split("Merchant: ")[1] || "";
      } else if (sentences[i].indexOf("Last 4 #:") > -1) {
        row["last4"] = sentences[i].split("Last 4 #:")[1].split(" ")[0].split(";")[1];
      }
    }
    row["amount"] = this.extractAmount(sentences.join(" :: "));
  },

  Chase: function(sentences, row) {
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("Merchant") > -1) row["merchant"] = sentences[i+1];
      else if (sentences[i].indexOf("Amount") > -1) row["amount"] = parseFloat(sentences[i+1].split("$")[1]);
      else if (sentences[i].indexOf("Account") > -1) row["last4"] = sentences[i+1].split("...")[1].split(")")[0];
    }
  },

  Citi: function(sentences, row) {
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("Amount") > -1) row["amount"] = this.extractAmount(sentences[i]);
      else if (sentences[i].indexOf("Merchant") > -1) row["merchant"] = sentences[i+1].trim();
      else if (sentences[i].indexOf("Card Ending") > -1) row["last4"] = sentences[i+1];
    }
  },

  AmericanExpress: function(sentences, row) {
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("large purchase notifications online.") > -1) {
        var idx = i + 1;
        while (idx < sentences.length && (sentences[idx] == "" || sentences[idx] == "&Acirc;")) idx++;
        row["merchant"] = sentences[idx].split(" at ")[0];
        while (idx < sentences.length && sentences[idx].indexOf("$") == -1) idx++;
        row["amount"] = parseFloat(sentences[idx].replace("&#36;", "$").split("$")[1].split("*")[0]);
        i = idx + 1;
      } else if (sentences[i].indexOf("Account Ending: ") > -1) {
        row["last4"] = sentences[i].split(": ")[1];
      }
    }
  },

  Venmo: function(sentences, row) {
    var amountComplete = false;
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("$") > -1 && !amountComplete) {
        var amt = sentences[i].split("$")[1].split("*")[0];
        row["amount"] = (sentences[i].indexOf("+") > -1 || row["To"] == "You") ? -1 * amt : amt;
        amountComplete = true;
      } else if (sentences[i].indexOf(" paid ") > -1) {
        var parts = sentences[i].split(" paid ");
        row["From"] = parts[0];
        row["To"] = parts[1];
      }
    }
  },

  BankOfAmerica: function(sentences, row) {
    for (var i=0; i<sentences.length; i++) {
      if (sentences[i].indexOf("Where:") > -1) row["merchant"] = sentences[i+1];
      else if (sentences[i].indexOf("Amount") > -1) row["amount"] = parseFloat(sentences[i+1].split("$")[1]);
      else if (sentences[i].indexOf("ending in ") > -1) row["last4"] = sentences[i].split("ending in ")[1];
    }
  },

  extractAmount: function(body) {
    var match = body.match(/(?:[\£\$\€]{1}[,\d]+.?\d*)/);
    return match ? parseFloat(match[0].replace(/[$,]/g, '')) : 0.00;
  },

  extractLast4: function(body) {
    var match = body.match(/(?:ending in |last 4 #:|Card Ending)\s*[:.]?\s*(\d+)/i);
    return match ? match[1] : null;
  }
};
