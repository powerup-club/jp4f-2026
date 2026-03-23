// ─────────────────────────────────────────────────────────────────────────────
// ENSA Fès — Quiz d'Orientation · Google Apps Script
//
// Instructions :
//   1. Ouvre Google Sheets → crée une nouvelle feuille
//   2. Extensions → Apps Script → colle ce code → Enregistrer
//   3. Déployer → Nouveau déploiement → Application Web
//      · Exécuter en tant que : Moi
//      · Accès : Tout le monde
//   4. Copie l'URL de déploiement → colle dans GOOGLE_SCRIPT_URL sur Vercel
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Header row (created once)
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Horodatage","Prénom","Nom","Langue",
        "Filière","Profil",
        "Q1","R1","Q2","R2","Q3","R3","Q4","R4","Q5","R5",
        "Note (/5)","Commentaire"
      ];
      sheet.appendRow(headers);
      var hRange = sheet.getRange(1,1,1,headers.length);
      hRange.setFontWeight("bold")
            .setBackground("#0a5c3e")
            .setFontColor("#ffffff")
            .setFontFamily("Arial");
      sheet.setFrozenRows(1);
    }

    var data    = JSON.parse(e.postData.contents);
    var answers = data.answers ? JSON.parse(data.answers) : [];

    var row = [
      data.timestamp,
      data.firstName  || "",
      data.lastName   || "",
      data.language === "en" ? "English" : "Français",
      data.branch  || "",
      data.profile || "",
    ];

    for (var i = 0; i < 5; i++) {
      row.push(answers[i] ? answers[i].q : "");
      row.push(answers[i] ? answers[i].a : "");
    }
    row.push(data.rating  || "");
    row.push(data.comment || "");

    sheet.appendRow(row);

    // Auto-resize columns
    sheet.autoResizeColumns(1, row.length);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSheet() {
  Logger.log("Feuille : " + SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName());
  Logger.log("Lignes  : " + SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getLastRow());
}
