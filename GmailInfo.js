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
  var allMessages = [];
  var threadStatusMap = {};

  // Collect all unread messages + initialize tracking per thread
  for (var t = threads.length - 1; t >= 0; t--) {
    var thread = threads[t];

    if (!thread.isUnread()) {
      continue;
    }

    var threadId = thread.getId();
    var messages = thread.getMessages();

    allMessages = allMessages.concat(messages);

    threadStatusMap[threadId] = {
      status: "OK",
      reasons: [],
      rowCount: 0
    };
  }

  // Process everything
  var result = processAllMessages_(allMessages, sheet, reply, threadStatusMap);

  var finalProcessedRows = result.rows;

  // Write + send
  fillSpreadsheet_(finalProcessedRows, sheet);
  sendText(finalProcessedRows, columns);

  // SAFE DELETE LOGIC
  if (deleteForever) {
    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i];
      var threadId = thread.getId();
      var status = threadStatusMap[threadId];

      if (status && status.status === "OK") {
        Logger.log("DELETING THREAD: " + threadId);
        // thread.moveToTrash(); // safer than permanent delete
        deleteForever_(thread);
      } else {
        Logger.log(
          "SKIPPING DELETE THREAD: " +
          threadId +
          " | status: " +
          (status ? status.status : "UNKNOWN") +
          " | reasons: " +
          JSON.stringify(status ? status.reasons : [])
        );
      }
    }
  }

  return result;
}
// New function to process all messages in batch
function processAllMessages_(allMessages, sheet, reply, threadStatusMap) {
  var allRowData = [];
  var allMerchantsToCategorize = [];
  var merchantRowMapping = {};

  for (var i = 0; i < allMessages.length; i++) {
    var message = allMessages[i];

    var threadId = message.getThread().getId();
    var threadStatus = threadStatusMap[threadId];

    var paymentMethod = defineSender_(message, reply);

    Logger.log("DEBUG: Processing message " + i + " from " + paymentMethod);

    var row = {};
    var config = BANK_CONFIG[paymentMethod];

    // ---------------------------
    // PARSING
    // ---------------------------
    if (config) {
      var sentences = askParserToParseBody_(
        message.getBody(),
        config.stoppingPhrase,
        config.tags
      );

      row = GenericParser.parse(paymentMethod, message, sentences, row);
    }
    else if (paymentMethod == "Reply") {
      var sentences = askParserToParseBody_(message.getBody(), "*****", true);
      row = processWhenAccountIsText_(sheet, message, sentences, row);
    }
    else {
      Logger.log("DEBUG: No config found for: " + paymentMethod);

      if (threadStatus) {
        threadStatus.status = "NEEDS_ATTENTION";
        threadStatus.reasons.push("No config for paymentMethod: " + paymentMethod);
      }
    }

    // ---------------------------
    // VALIDATION FLAGS
    // ---------------------------
    var isValid = true;

    if (!row["amount"]) {
      isValid = false;
      if (threadStatus) threadStatus.reasons.push("Missing amount");
    }

    var merchant = row["merchant"] || "Unknown";
    if (!merchant || merchant === "Unknown") {
      isValid = false;
      if (threadStatus) threadStatus.reasons.push("Missing merchant");
    }

    // ---------------------------
    // MERCHANT COLLECTION (only if valid-ish)
    // ---------------------------
    if (merchant && merchant !== "Unknown" && merchant !== "AI call pending" && merchant !== "Other") {
      allMerchantsToCategorize.push(merchant);

      if (!merchantRowMapping[merchant]) {
        merchantRowMapping[merchant] = [];
      }
      merchantRowMapping[merchant].push(allRowData.length);
    }

    // ---------------------------
    // TEMP PLACEHOLDERS
    // ---------------------------
    row["category"] = "Uncategorized";
    row["body"] = "AI call pending";

    var finalRow = [
      row["year"],
      row["month"],
      row["day"],
      row["dayOfWeek"],
      row["date"],
      row["time"],
      row["amount"],
      merchant,
      row["category"],
      "",
      paymentMethod,
      row["last4"],
      row["From"],
      row["To"],
      row["body"]
    ];

    allRowData.push(finalRow);

    // ---------------------------
    // THREAD STATUS UPDATE
    // ---------------------------
    if (threadStatus && isValid) {
      threadStatus.rowCount++;
    }

    if (threadStatus && !isValid) {
      threadStatus.status = "NEEDS_ATTENTION";
    }

    Logger.log("DEBUG: Final row: " + JSON.stringify(finalRow));
  }

  // ---------------------------
  // BATCH CATEGORIZATION
  // ---------------------------
  if (allMerchantsToCategorize.length > 0) {
    var uniqueMerchants = [...new Set(allMerchantsToCategorize)];
    var categorizedResults = categorizeBatch_(uniqueMerchants);

    for (var merchant in categorizedResults) {
      if (categorizedResults.hasOwnProperty(merchant)) {
        var categoryData = categorizedResults[merchant];

        var category = categoryData.Category || "Other";
        var expandedCategory =
          categoryData.ExpandedCategory ||
          "Categorized by Gemini AI (Batch).";

        var rowIndices = merchantRowMapping[merchant];

        if (rowIndices) {
          for (var j = 0; j < rowIndices.length; j++) {
            var rowIndex = rowIndices[j];

            if (allRowData[rowIndex]) {
              allRowData[rowIndex][CATEGORYINDEX] = category;
              allRowData[rowIndex][allRowData[rowIndex].length - 1] =
                expandedCategory;
            }
          }
        }
      }
    }
  }

  Logger.log("DEBUG: All row data: " + JSON.stringify(allRowData));

  return {
    rows: allRowData,
    threadStatusMap: threadStatusMap
  };
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
  else if (mailFrom.indexOf("Antriksh") > -1 || mailFrom.indexOf("antriksh") > -1) sender = "Citi";

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





