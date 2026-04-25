
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