// ─────────────────────────────────────────────────────────────────────────────
// Innov'Dom Challenge · ENSA Fès — Google Apps Script
//
// SETUP :
//   1. Ouvre Google Sheets → Extensions → Apps Script → colle ce code
//   2. Change DRIVE_FOLDER_ID avec l'ID de ton dossier Google Drive
//      (crée un dossier "Candidatures Innov'Dom", ouvre-le,
//       l'ID est dans l'URL : drive.google.com/drive/folders/THIS_ID)
//   3. Déployer → Nouveau déploiement → Application Web
//      · Exécuter en tant que : Moi
//      · Accès : Tout le monde
//   4. Copie l'URL → colle dans GOOGLE_SCRIPT_URL sur Vercel
// ─────────────────────────────────────────────────────────────────────────────

var DRIVE_FOLDER_ID = "1KCJdj_Yg0aDOJ_9akDPRcH_V1OgQFAnx";
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create header row once
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Horodatage","Langue","Type (individuel/équipe)",
        // Participant
        "Nom complet","Email","Téléphone","Université / École","Filière","Niveau d'études","LinkedIn",
        // Team
        "Nom équipe","Membre 2 — Nom","Membre 2 — Email","Membre 3 — Nom","Membre 3 — Email","Membre 4 — Nom","Membre 4 — Email",
        // Project
        "Titre du projet","Domaine","Description du projet","Innovation / Valeur ajoutée","Format de présentation",
        // Extra
        "Comment entendu parler","Fichier (lien Drive)"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1,1,1,headers.length)
           .setFontWeight("bold")
           .setBackground("#c27800")
           .setFontColor("#ffffff")
           .setFontFamily("Arial");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    // Handle file upload to Google Drive
    var fileLink = "";
    if (data.fileBase64 && data.fileName) {
      try {
        var folder   = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        var decoded  = Utilities.base64Decode(data.fileBase64);
        var blob     = Utilities.newBlob(decoded, getMimeType(data.fileName), data.fileName);
        var driveFile = folder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileLink = driveFile.getUrl();
      } catch(fe) {
        fileLink = "Upload error: " + fe.toString();
      }
    }

    var row = [
      data.timestamp,
      data.lang === "en" ? "English" : "Français",
      data.type === "team" ? "Équipe" : "Individuel",
      // Participant
      data.fullName    || "",
      data.email       || "",
      data.phone       || "",
      data.university  || "",
      data.branch      || "",
      data.yearOfStudy || "",
      data.linkedin    || "",
      // Team
      data.teamName    || "",
      data.member2Name || "", data.member2Email || "",
      data.member3Name || "", data.member3Email || "",
      data.member4Name || "", data.member4Email || "",
      // Project
      data.projTitle   || "",
      data.projDomain  || "",
      data.projDesc    || "",
      data.innovation  || "",
      data.demoFormat  || "",
      // Extra
      data.heardFrom   || "",
      fileLink,
    ];

    sheet.appendRow(row);
    sheet.autoResizeColumns(1, row.length);

    // Color code by type
    var lastRow  = sheet.getLastRow();
    var typeCell = sheet.getRange(lastRow, 3);
    if (data.type === "team") {
      typeCell.setBackground("#1a1a40").setFontColor("#aaaaff");
    } else {
      typeCell.setBackground("#0a2a1a").setFontColor("#00cc88");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, fileLink: fileLink }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getMimeType(filename) {
  var ext = filename.split(".").pop().toLowerCase();
  var map = {
    "pdf"  : "application/pdf",
    "doc"  : "application/msword",
    "docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "ppt"  : "application/vnd.ms-powerpoint",
    "pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return map[ext] || "application/octet-stream";
}

function testConnection() {
  Logger.log("✅ Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getName());
  Logger.log("✅ Rows : " + SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getLastRow());
  try {
    DriveApp.getFolderById("1KCJdj_Yg0aDOJ_9akDPRcH_V1OgQFAnx");
    Logger.log("✅ Drive folder found");
  } catch(e) {
    Logger.log("❌ Drive folder NOT found — check DRIVE_FOLDER_ID");
  }
}
