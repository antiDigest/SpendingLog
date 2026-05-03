function recolorAllRows() {
    var sheet = getOLDSpreadsheet_();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    if (lastRow <= 1) return; // no data

    // Get all rows except header
    var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var rowIndex = i + 2; // since data starts at row 2

        highlightSpreadsheetRowAtIndex_(sheet, row, rowIndex, INDIVIDUAL_CATEGORY_LIMITS);
        highlightMonthlyPacingRows_(sheet, row, rowIndex);
    }
}

function recolorAllMonthlyRows() {
    const sheet = getMonthSummarySpreadsheet_();

    const startRow = 2;
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow < startRow) return;

    for (let r = startRow; r <= lastRow; r++) {
        const rowRange = sheet.getRange(r, 1, 1, lastCol);
        applyMonthlyCategoryHeatmap_(rowRange, MONTHLY_CATEGORY_LIMITS);
    }
}