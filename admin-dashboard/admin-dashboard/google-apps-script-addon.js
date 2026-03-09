// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS doGet FUNCTION to BOTH your Apps Scripts
// (the registration one AND the quiz one)
// It allows the admin dashboard to read data from the sheet
// ─────────────────────────────────────────────────────────────────────────────

var ADMIN_SECRET = "YOUR_ADMIN_SECRET_HERE"; // ← set a strong secret, same as ADMIN_DATA_SECRET in Vercel

function doGet(e) {
  try {
    // Security check
    if (!e.parameter.secret || e.parameter.secret !== ADMIN_SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (e.parameter.action !== "getData") {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Unknown action" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet   = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data    = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var rows    = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        // Convert header to camelCase key
        var key = String(h)
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+(.)/g, function(_, c) { return c.toUpperCase(); });
        obj[key] = row[i] !== undefined ? String(row[i]) : "";
      });
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify({ rows: rows, total: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Keep all your existing doPost, getMimeType, testConnection functions below
// Just ADD this doGet function at the top
// ─────────────────────────────────────────────────────────────────────────────
