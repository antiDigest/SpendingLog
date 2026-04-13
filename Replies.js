function processWhenAccountIsText_(sheet, message, sentences, row) {
  Logger.log(sentences)
  var sentence = sentences[1];
  var words = sentence.split(" ");

  var lastRow = getLastRowValues_(sheet);

  if (words[0].toLowerCase() == "add") {
    row = addToLastRow_(lastRow);
  } else if (words[0].toLowerCase() == "summary") {
    summary_(sheet);
  }

  return row;
}

function addToLastRow_(lastRow) {
  var additionalCost = parseFloat(words[1]);
  if (words[1].indexOf("%") > -1) {
    additionalCost = (parseFloat(lastRow[AMOUNTINDEX]) * additionalCost)/(100.0);
  } else if (words[1].indexOf("-") > -1) {
    additionalCost = -1 * additionalCost;
  }

  lastRow[AMOUNTINDEX] = parseFloat(lastRow[AMOUNTINDEX]) + additionalCost;
  updateLastRowAmount_(sheet, lastRow[AMOUNTINDEX]);

  return lastRow;
}
