function getMonthFromString_(month){
  var d = Date.parse(month + " 1, 2012");
  if(!isNaN(d)){
    return new Date(d).getMonth();
  }
  return -1;
 }

function isNumeric(num){
  return !isNaN(num)
}

function transactionDateFromEmailMessage_(messageDate, row) {
  var date = String(messageDate).split(" ");
  row["year"] = date[3];
  row["day"] = date[2];
  row["month"] = date[1];
  row["date"] = messageDate;
  row["dayOfWeek"] = date[0];
  row["time"]= date[4];
  return row;
}

function getAmountFromBody_(body) {
  var amountRegex = new RegExp(/(?:[\£\$\€]{1}[,\d]+.?\d*)/);
  return body.match(amountRegex)[0];
}