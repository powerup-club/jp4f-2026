var CONTACT_SHEET_NAME = "ContactRequests";

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, service: "contact-responsible" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = getContactSheet_();
    ensureContactHeader_(sheet);

    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.accountEmail || "",
      data.accountName || "",
      data.fullName || "",
      data.email || "",
      data.phone || "",
      data.teamId || "",
      data.message || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getContactSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(CONTACT_SHEET_NAME) || spreadsheet.insertSheet(CONTACT_SHEET_NAME);
}

function ensureContactHeader_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    "Timestamp",
    "Account Email",
    "Account Name",
    "Full Name",
    "Email",
    "Phone",
    "Team ID",
    "Message"
  ]);
}
