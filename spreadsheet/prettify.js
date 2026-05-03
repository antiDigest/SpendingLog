


function highlightSpreadsheetRow_(sheet, row, limits) {
    highlightSpreadsheetRowAtIndex_(sheet, row, sheet.getLastRow(), limits);
}

function highlightSpreadsheetRowAtIndex_(sheet, row, rowIndex, limits) {
    const headers = sheet.getRange(1, 1, 1, row.length).getValues()[0];
    const range = sheet.getRange(rowIndex, 1, 1, row.length);
    const values = row;

    const backgrounds = [[]];

    for (let i = 0; i < values.length; i++) {
        const category = normalizeHeader_(headers[i]);
        const value = parseAmount_(values[i]);

        let color = null;

        // skip non-category columns (including Amount, Total, Card fields, etc.)
        if (limits && limits[category] && !isNaN(value)) {
            const ratio = value / limits[category];
            color = getSpendColor_(ratio);
        }

        // fallback: keep neutral if not category
        backgrounds[0].push(color || "#FFFFFF");
    }

    range.setBackgrounds(backgrounds);
}

function highlightMonthlyPacingRows_(sheet, rowToAdd, rowIndex) {
    const startRow = 2;
    const lastRow = sheet.getLastRow();

    if (lastRow < startRow) return;

    const rowCount = lastRow - startRow + 1;

    const data = sheet.getRange(startRow, 1, rowCount, sheet.getLastColumn()).getValues();
    const dates = sheet.getRange(startRow, 1, rowCount, 1).getValues();

    applyPacingColors_(sheet, data, dates, startRow, rowIndex, rowToAdd);
}

function applyPacingColors_(sheet, data, dates, startRow, targetRowIndex, rowToAdd) {
    let runningTotal = 0;

    const targetDate = new Date(rowToAdd[DATEINDEX]);
    const targetAmount = parseAmount_(rowToAdd[AMOUNTINDEX]);

    if (isNaN(targetAmount) || isNaN(targetDate.getTime())) return;

    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    // 🚨 FIX: only include past transactions in SAME month AND BEFORE this date
    for (let i = 0; i < data.length; i++) {
        const dataMonth = data[i][DATEMONTHINDEX];
        const dataYear = data[i][DATEYEARINDEX];
        const dataDate = data[i][DATEINDEX];
        const amount = parseAmount_(data[i][AMOUNTINDEX]);

        if (isNaN(amount) || isNaN(data[i][TIMESTAMPINDEX])) continue;

        // ✅ STRICT month boundary
        if (MONTH_MAP[dataMonth] !== targetMonth || dataYear !== targetYear) continue;

        // ✅ ONLY include up to current transaction date
        if (dataDate > targetDate) continue;
        if (targetRowIndex == startRow + i) continue;

        runningTotal += amount;
    }
    // include current transaction
    runningTotal += targetAmount;

    const expected = getExpectedSpendForDate_(SPENDING_BUDGET_PER_MONTH, targetDate);
    const ratio = runningTotal / expected;
    const color = getPacingColor_(ratio);

    console.log("Expected: " + expected + " vs RunningTotal: " + runningTotal + " vs ratio: " + ratio + " FOR: " + rowToAdd[CATEGORYINDEX]);

    sheet
        .getRange(targetRowIndex, 1, 1, rowToAdd.length)
        .setBackground(color);
}

function getFixedSpendByDate_(date) {
    const day = date.getDate();
    let fixed = 0;

    // 🏠 Rent / utilities (assumed early month baseline)
    fixed += INDIVIDUAL_CATEGORY_LIMITS["Rent/Utilities/Phone/Internet"];

    // 🚗 Monthly travel charge on 19th
    if (day >= 19) {
        fixed += 200;
    }

    // 🛡️ Insurance on 20th
    if (day >= 20) {
        fixed += INDIVIDUAL_CATEGORY_LIMITS["Insurance/Financial"];
    }

    return fixed;
}

function getExpectedSpendForDate_(monthlyCap, date) {
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const fixedSpend = getFixedSpendByDate_(date);

    const variableBudget =
        monthlyCap -
        INDIVIDUAL_CATEGORY_LIMITS["Rent/Utilities/Phone/Internet"] -
        INDIVIDUAL_CATEGORY_LIMITS["Insurance/Financial"] -
        200; // SPOTHERO every month

    const variableProgress = variableBudget * (day / daysInMonth);

    return fixedSpend + variableProgress;
}


function parseAmount_(value) {
    if (value == null) return NaN;

    if (typeof value === "string") {
        value = value.replace(/[$,]/g, "");
    }

    return parseFloat(value);
}

function applyMonthlyCategoryHeatmap_(rowRange, limits) {
    const sheet = rowRange.getSheet();
    const values = rowRange.getValues()[0];
    const headers = sheet.getRange(1, 1, 1, rowRange.getWidth()).getValues()[0];

    const totalIndex = headers.indexOf("Total");

    applyCategoryColors_(rowRange, values, headers, limits);
    applyTotalColor_(rowRange, values, totalIndex);
}

function applyCategoryColors_(rowRange, values, headers, limits) {
    if (!limits) return;

    for (let i = 0; i < values.length; i++) {
        const category = normalizeHeader_(headers[i]);
        const amount = values[i];

        if (!limits.hasOwnProperty(category)) continue;
        if (amount == null || isNaN(amount)) continue;

        const ratio = amount / limits[category];
        const color = getSpendColor_(ratio);

        if (color) {
            rowRange.getCell(1, i + 1).setBackground(color);
        }
    }
}

function applyTotalColor_(rowRange, values, totalIndex) {
    if (totalIndex === -1) return;
    const totalValue = values[totalIndex];
    if (isNaN(totalValue)) return;

    const ratio = totalValue / SPENDING_BUDGET_PER_MONTH;
    const color = getSpendColor_(ratio);

    rowRange.getCell(1, totalIndex + 1).setBackground(color);
}

function getSpendColor_(ratio) {

    // 🟢 under budget/Healthy
    if (ratio <= 1) {
        return "#F8FFFA";
    }

    // 🟡 Very mild overspend (new band)
    if (ratio <= 1.20) {
        return "#FFF1D6";
    }

    // 🟠 Noticeable overspend
    if (ratio <= 1.50) {
        return "#FFBCA8";
    }

    // 🔴 High overspend (softened ~20%)
    if (ratio <= 1.75) {
        return "#F07A6A";
    }

    // 🔴 Very high overspend
    return "#EA5E4A";
}

function normalizeHeader_(h) {
    return (h || "").toString().trim();
}

function getPacingColor_(ratio) {
    // 🟢 On track / behind pace
    if (ratio <= 0.8) {
        return "#F8FFFA"; // barely visible green (consistent with your system)
    }

    // 🟡 Slightly ahead
    if (ratio <= 1.0) {
        return "#FFF1D6";
    }

    // 🟠 Moderately ahead
    if (ratio <= 1.25) {
        return "#FFD9C9";
    }

    // 🔶 Concerning acceleration
    if (ratio <= 1.5) {
        return "#FFBCA8";
    }

    // 🔴 Too fast early (high risk)
    if (ratio <= 1.75) {
        return "#F07A6A";
    }

    // 🔴 Very dangerous pacing
    return "#EA5E4A";
}