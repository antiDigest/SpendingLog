
function addMonthlyCarPayment() {
  var sheet = getSpreadsheet_();
  var today = new Date();

  // Only proceed if today is the 20th
  if (today.getDate() !== 20) return;

  var month = today.getMonth();
  var year = today.getFullYear();

  // Check if payment already exists for this month/year
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][DATEINDEX]);
    if (rowDate.getMonth() === month && rowDate.getFullYear() === year && data[i][MERCHANTINDEX] === "Honda Financial") {
      return; // Already added
    }
  }

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var monthText = months[month];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var dayOfWeek = days[today.getDay()];
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  // Add the row
  var row = [
    year,
    monthText, // Use 1-indexed month for consistency if needed, adjust if your system expects 0-indexed
    today.getDate(),
    dayOfWeek,
    today, // Date
    time, // Time
    1117.00,
    "Honda Financial",
    "Insurance/Financial",
    "",
    "WellsFargo",
    "2263",
    "",
    "",
    "Scheduled Honda-CRV payment"
  ];
  appendRows([row], sheet);
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
    highlightSpreadsheetRow_(sheet, row);
  }
  return filled;
}

function setBackgroundForRow_(sheet, row, color) {
  var sheetRow = sheet.getLastRow();
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
    applyMonthlyCategoryHeatmap_(row)
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
  var lastRow = sheet.getLastRow();
  sheet.getRange(
    lastRow + 1,
    1,
    rows.length,
    rows[0].length
  ).setValues(rows);

  for (var i = 0; i < rows.length; i++) {
    highlightSpreadsheetRowAtIndex_(sheet, rows[i], lastRow + 1 + i);
    highlightMonthlyPacingRows_(sheet, rows[i], lastRow + 1 + i);
  }

  return filled;
}