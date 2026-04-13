var myPhone = "+14698793964@tmomail.net";

function sendText(rows, columns) {
  for(var r=0; r<rows.length; r++) {
    var row = rows[r];
    var body = generateBody_(row, columns);
    var subject = generateSubject_(row, columns);
    GmailApp.sendEmail(myPhone, subject, body);
  }
}

function sendText(subject, body) {
  GmailApp.sendEmail(myPhone, subject, body);
}

function generateBody_(row, columns) {
  var body = "";
  for (var i=0; i<columns.length; i++) {
    body = body + columns[i] + ": " + row[i] + "\n";
  }
  return body;
}

function generateSubject_(row, columns) {
  return "Spending @" + row[10];
}