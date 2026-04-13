var columns = ["Year", "Month", "Day", "DayOfWeek", "DateTime", "Time", "Amount", "Merchant", "Category", "Timeline", "Card", "Last4", "From", "To"]

function fillSpreadsheet() {
  getGmailData_(getGmails_("label:expenses"), getSpreadsheet_(), true, false);
}

function fillSpreadsheetWithReplies() {
  getGmailData_(getGmails_("label:expenses-replies"), getSpreadsheet_(), true, true);
}

function getGmailData_(threads, sheet, deleteForever, reply) {
  for(var t=threads.length-1; t>=0; t--) {
    var thread = threads[t];
    if (!thread.isUnread()) {
      continue;
    }
    var rows = extractMoreInfo_(sheet, thread);
    if (!reply) {
      fillSpreadsheet_(rows, sheet);
    }
    sendText(rows, columns);
    // thread.markRead();
    if (deleteForever) {
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
  
  var start = binarySearch_(threads, 0, threads.length-1);
  if (start+5 < threads.length) {
    start = start+5;
  }

  return threads.slice(0, start+1);
}

function extractMoreInfo_(sheet, thread) {
  var messages = thread.getMessages();
  var rows = [];
  
  for(var m=0; m<messages.length; m++) {
    var message = messages[m];
    var paymentMethod = defineSender_(message);

    var row = {};
    if (paymentMethod == "Discover") {
      var sentences = askParserToParseBody_(message.getBody(), "1-800-DISCOVER", true);
      row = processWhenAccountIsDiscover_(message, sentences, row);
    } else if (paymentMethod == "CitiDoubleCash") {
      var sentences = askParserToParseBody_(message.getBody(), "Your Citi Team", true);
      row = processWhenAccountIsCiti_(message, sentences, row);
    } else if (paymentMethod == "Chase") {
      var sentences = askParserToParseBody_(message.getBody(), "Do not reply to this Alert.", false);
      row = processWhenAccountIsChase_(message, sentences, row);
    } else if (paymentMethod == "AmericanExpress") {
      var sentences = askParserToParseBody_(message.getBody(), "*The amount above may not", false);
      row = processWhenAccountIsAmex_(message, sentences, row);
    } else if (paymentMethod == "Venmo") {
      var sentences = askParserToParseBody_(message.getBody(), "Like", false);
      row = processWhenAccountIsVenmo_(message, sentences, row);
    } else if (paymentMethod == "Zelle") {
      var sentences = askParserToParseBody_(message.getBody(), "Wells Fargo Online Customer Service", false);
      row = processWhenAccountIsWellsFargo_(message, sentences, row);
    } else if (paymentMethod == "Reply") {
      var sentences = askParserToParseBody_(message.getBody(), "*****", true);
      row = processWhenAccountIsText_(sheet, message, sentences, row);
    }
    
    if (paymentMethod == "Reply") {
      rows.push(row); 
    } else {
      rows.push([row["year"], row["month"], row["day"], row["dayOfWeek"], row["date"], row["time"], row["amount"], row["merchant"], row["category"], "", paymentMethod, row["last4"], row["From"], row["To"], row["body"]]);
    }
  }
  
  return rows;
}

function defineSender_(message) {
  var mailFrom = message.getFrom();
  if (mailFrom.indexOf("discover") > -1) {
    mailFrom = "Discover";
  } else if (mailFrom.indexOf("citi") > -1) {
    mailFrom = "CitiDoubleCash";
  } else if (mailFrom.indexOf("chase") > -1) {
    mailFrom = "Chase";
  } else if (mailFrom.indexOf("AmericanExpress") > -1) {
    mailFrom = "AmericanExpress";
  } else if (mailFrom.indexOf("venmo") > -1) {
    mailFrom = "Venmo";
  } else if (mailFrom.indexOf("wellsfargo") > -1) {
    mailFrom = "Zelle";
  } else if (mailFrom.indexOf("4698793964") > -1) {
    mailFrom = "Reply";
  }
  return mailFrom;
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

function binarySearch_(threads, start, end){
  var veryEnd = end;
  var mid = 0;
  while (start <= end) {
    mid = parseInt((start+end)/2);
    if (mid == veryEnd) {
      return mid;
    }
    if (threads[mid].isUnread() && !threads[mid+1].isUnread()) {
      return mid;
    } else if (threads[mid].isUnread() && threads[mid+1].isUnread()) {
      start = mid+1;
    } else {
      end = mid;
    }
  }
  return end;
}





