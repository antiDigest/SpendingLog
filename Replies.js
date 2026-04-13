function processWhenAccountIsText_(sheet, message, sentences, row) {
  var sentence = sentences[1];
  var words = sentence.split(" ");
  // Logger.log(words);

  if (words[0].toLowerCase() == "add") {
    if (words.length <= 1) {
      return row;
    }
    if (words.length == 2) {
      words.push("amount");
      words.push(words[1]);
      row = addToIndexedRow_(sheet, ZERO, words);
    } else {
      row = addToIndexedRow_(sheet, parseInt(words[1]), words);
    }
  } else if (words[0].toLowerCase() == "summary") {
    summary_(sheet);
  }

  return row;
}

function addToIndexedRow_(sheet, rowIndexFromBottom, words) {
  var indexedRow = getIndexedRowValues_(sheet, rowIndexFromBottom);
  if (words[2].toLowerCase() == "amount") {
    var additionalCost = 0.00;
    if (words[3].indexOf("%") > -1) {
      additionalCost = (parseFloat(lastRow[AMOUNTINDEX]) * additionalCost)/(100.0);
    } else {
      additionalCost = parseFloat(words[3]);
    }
    indexedRow[AMOUNTINDEX] = parseFloat(indexedRow[AMOUNTINDEX]) + additionalCost;
    updateIndexedRowWithValueAtIndex_(sheet, AMOUNTINDEX, indexedRow[AMOUNTINDEX], rowIndexFromBottom);
  } else if (words[2].toLowerCase() == "timeline") {
    indexedRow[TIMELINEINDEX] = words[2];
    updateIndexedRowWithValueAtIndex_(sheet, TIMELINEINDEX, indexedRow[TIMELINEINDEX], rowIndexFromBottom);
  } else if (words[2].toLowerCase() == "category") {
    indexedRow[CATEGORYINDEX] = words[2];
    updateIndexedRowWithValueAtIndex_(sheet, CATEGORYINDEX, indexedRow[CATEGORYINDEX], rowIndexFromBottom);
  }

  return indexedRow;
}
