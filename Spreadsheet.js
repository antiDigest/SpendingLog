var AMOUNTINDEX = 6;
var DATEINDEX = 4;
var DATEYEARINDEX = 0;
var DATEMONTHINDEX = 1;
var DATEDAYINDEX = 2;
var DATEDAYOFWEEKINDEX = 3;
var TIMESTAMPINDEX = 5;
var CARDINDEX = 10;
var MERCHANTINDEX = 7;
var TIMELINEINDEX = 9;
var CATEGORYINDEX = 8;
var ZERO = 0;

var MONTH_MAP = {
  "Jan": 0,
  "Feb": 1,
  "Mar": 2,
  "Apr": 3,
  "May": 4,
  "Jun": 5,
  "Jul": 6,
  "Aug": 7,
  "Sep": 8,
  "Oct": 9,
  "Nov": 10,
  "Dec": 11
}


function getSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Spend Email Log");
  return sheet;
}

function getOLDSpreadsheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("OLD Spend Email Log");
  return sheet;
}

function getMonthSummarySpreadsheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Monthly Spend Summaries");
  return sheet;
}

function fillSpreadsheet_(rows, sheet) {
  if (rows == null || rows.length == 0) {
    return false;
  }

  var filled = true;
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    if ((row[AMOUNTINDEX] == "" || row[AMOUNTINDEX] == null) || (row[DATEINDEX] == "" || row[DATEINDEX] == null)) {
      return false;
    } else if (sheet.appendRow(row) == null) {
      filled = false;
    }
    // highlightSpreadsheetRow_(sheet, row, "fc6e4e");
  }
  return filled;
}

function highlightSpreadsheetRow_(sheet, row) {
  if (row[3] == row[row.length - 1]) {
    highlightSpreadsheetRow_(sheet, row, "fc6e4e");
  } else if (row[4].indexOf("notification") > -1) {
    highlightSpreadsheetRow_(sheet, row, "fcc900");
  }
}

function highlightSpreadsheetRow_(sheet, row, color) {
  var sheetRow = sheet.getLastRow();
  var sheetCol = sheet.getLastColumn();
  var rowRange = sheet.getRange(sheetRow, 1, 1, row.length);
  rowRange.setBackground(color);
}

function getIndexedRowValues_(sheet, indexFromBottom) {
  var indexedRow = sheet.getLastRow() - indexFromBottom;
  return sheet.getRange(indexedRow, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function updateIndexedRowWithValueAtIndex_(sheet, index, value, indexFromBottom) {
  // Logger.log(value);
  var indexedRow = sheet.getLastRow() - indexFromBottom;
  var cell = sheet.getRange(indexedRow, index + 1, 1, 1);
  if (index == AMOUNTINDEX) {
    cell.setNumberFormat("$ 0.00");
    cell.setValue(value);
  }
}

function getCurrentMonthRowValues_(sheet) {
  var data = getSpreadsheetData_(sheet)
  var date = new Date();
  date = new Date(date.getTime());

  var filteredData = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][DATEYEARINDEX] == date.getFullYear() &&
      MONTH_MAP[data[i][DATEMONTHINDEX]] == date.getMonth()) {
      filteredData.push(data[i]);
    }
  }
  // Logger.log(filteredData);
  return filteredData;
}

function getPreviousMonthRowValues_(sheet) {
  var data = getSpreadsheetData_(sheet)
  var date = new Date();
  date = new Date(date.getTime());

  var previousMonth = date.getMonth() - 1;
  if (previousMonth <= 0) {
    previousMonth = 12;
  }

  var filteredData = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][DATEYEARINDEX] == date.getFullYear() &&
      MONTH_MAP[data[i][DATEMONTHINDEX]] == previousMonth) {
      filteredData.push(data[i]);
    }
  }
  Logger.log(filteredData);
  return filteredData;
}

function getSpreadsheetData_(sheet) {
  var lastRow = sheet.getLastRow();
  try {
    var range = sheet.getRange(2, 1, lastRow - 2, sheet.getLastColumn())
  } catch {
    return []
  }
  range.sort(DATEINDEX + 1);
  var data = range.getValues();
  return data
}

function fillMonthlySummarySpreadsheet_(rows, sheet) {
  if (rows == null || rows.length == 0) {
    return false;
  }

  var filled = true;
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    if (sheet.appendRow(row) == null) {
      filled = false;
    }
  }
  return filled;
}

function appendRows_(rows, sheet) {
  if (rows == null || rows.length == 0) {
    return false;
  }

  var filled = true;
  sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    rows.length,
    rows[0].length
  ).setValues(rows)
  return filled;
}














