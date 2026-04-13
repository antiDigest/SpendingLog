var columns = ["Year", "Month", "Day", "DayOfWeek", "DateTime", "Time", "Amount", "Merchant", "Category", "Timeline", "Card", "Last4", "From", "To"]

function fillSpreadsheet() {
  getMySecrets();
  getGmailData_(getGmails_("label:expenses"), getSpreadsheet_(), true, false);
}

function fillSpreadsheetWithReplies() {
  getGmailData_(getGmails_("label:expenses-replies"), getSpreadsheet_(), true, true);
}

function getLastMonthSummary() {
  var data = getPreviousMonthRowValues_(getSpreadsheet_());
  summary_(data, getMonthSummarySpreadsheet_());
  appendRows_(data, getOLDSpreadsheet_());
}

function getOLDMerchantCategories() {
  categorizeOLD_(getSpreadsheet_(), getOLDSpreadsheet_());
}

function cleanUpPastData() {
  summarizeAllPastMonths_(getSpreadsheet_(), getMonthSummarySpreadsheet_());
}

function getGmailData_(threads, sheet, deleteForever, reply) {
  for (var t = threads.length - 1; t >= 0; t--) {
    var thread = threads[t];
    if (!thread.isUnread()) {
      continue;
    }
    var rows = extractMoreInfo_(sheet, thread, reply);
    var filled = false;
    if (reply) {
      filled = true;
    } else {
      filled = fillSpreadsheet_(rows, sheet);
    }
    sendText(rows, columns);
    // thread.markRead();
    if (deleteForever && filled) {
      deleteForever_(thread);
    }
    // break;
  }
}

function deleteForever_(thread) {
  thread = thread.moveToTrash();
  Gmail.Users.Messages.remove("me", thread.getId());
}

function getGmails_(label) {
  var threads = GmailApp.search(label);

  var start = binarySearch_(threads, 0, threads.length - 1);
  if (start + 5 < threads.length) {
    start = start + 5;
  }

  return threads.slice(0, start + 1);
}

function extractMoreInfo_(sheet, thread, reply) {
  var messages = thread.getMessages();
  Logger.log("DEBUG: Thread has " + messages.length + " messages.");
  var rows = [];

  var count = 0;

  for (var m = 0; m < messages.length; m++) {
    var message = messages[m];
    var paymentMethod = defineSender_(message, reply);
    Logger.log("DEBUG: Processing message " + m + " from " + paymentMethod);
    Logger.log("DEBUG: Original sender header: " + message.getFrom());
    Logger.log("DEBUG: Full email body start: " + message.getBody().substring(0, 1000));

    var row = {};
    var config = BANK_CONFIG[paymentMethod];
    if (config) {
      Logger.log("DEBUG: Parsing with config: " + JSON.stringify(config));
      var sentences = askParserToParseBody_(message.getBody(), config.stoppingPhrase, config.tags);
      Logger.log("DEBUG: Parser extracted " + sentences.length + " sentences.");
      row = GenericParser.parse(paymentMethod, message, sentences, row);
    } else if (paymentMethod == "Reply") {
      var sentences = askParserToParseBody_(message.getBody(), "*****", true);
      row = processWhenAccountIsText_(sheet, message, sentences, row);
    } else {
      Logger.log("DEBUG: No config found for: " + paymentMethod);
      Logger.log("DEBUG: Full email body for debugging: " + message.getBody().substring(0, 500));
    }

    // AI Categorization commented out for testing
    // var aiData = getCategoryAndExpanded_(row["merchant"] || "Unknown", row["dayOfWeek"] || "N/A", row["month"] || "N/A", row["year"] || "N/A", row["time"] || "N/A");
    row["category"] = "Uncategorized";
    row["body"] = "AI call commented out";

    var finalRow = [row["year"], row["month"], row["day"], row["dayOfWeek"], row["date"], row["time"], row["amount"], row["merchant"], row["category"], "", paymentMethod, row["last4"], row["From"], row["To"], row["body"]];
    Logger.log("DEBUG: Final row for spreadsheet: " + JSON.stringify(finalRow));

    if (paymentMethod == "Reply") {
      rows.push(row);
    } else {
      rows.push(finalRow);
    }

    if (count > 10) break;
    // Utilities.sleep(30000);
    count++;
  }

  return rows;
}

function defineSender_(message, reply) {
  var mailFrom = message.getFrom();
  var sender = "Unknown";
  if (reply || mailFrom.indexOf("4698793964") > -1) sender = "Reply";
  else if (mailFrom.indexOf("discover") > -1) sender = "Discover";
  else if (mailFrom.indexOf("citi") > -1) sender = "Citi";
  else if (mailFrom.indexOf("chase") > -1) sender = "Chase";
  else if (mailFrom.indexOf("AmericanExpress") > -1) sender = "AmericanExpress";
  else if (mailFrom.indexOf("venmo") > -1) sender = "Venmo";
  else if (mailFrom.indexOf("wellsfargo") > -1) {
    if (message.getSubject().indexOf("Confirmation Code") > -1) sender = "Zelle";
    else if (message.getSubject().indexOf("credit card purchase") > -1) sender = "Bilt";
  } else if (mailFrom.indexOf("bankofamerica") > -1) sender = "BankOfAmerica";

  Logger.log("DEBUG: Sender identified as: " + sender);
  return sender;
}

function askParserToParseBody_(body, stoppingPhrase, thisOneWillHaveTags) {
  try {
    body = parseHtml_(body, thisOneWillHaveTags);
    body = getTextList_(body, stoppingPhrase);
    body = sentenceTokenizer_(body);
  } catch (Exception) {
    // If the above does not work, we have a very malfuctioning html
    // Time to go the messy route
    body = getSentencesFromHtml(body, stoppingPhrase);
  }

  return body;
}

function binarySearch_(threads, start, end) {
  var veryEnd = end;
  var mid = 0;
  while (start <= end) {
    mid = parseInt((start + end) / 2);
    if (mid == veryEnd) {
      return mid;
    }
    if (threads[mid].isUnread() && !threads[mid + 1].isUnread()) {
      return mid;
    } else if (threads[mid].isUnread() && threads[mid + 1].isUnread()) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  return end;
}





