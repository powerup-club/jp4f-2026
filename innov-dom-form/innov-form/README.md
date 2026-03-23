# 🏆 Innov'Dom Challenge · Formulaire d'inscription · ENSA Fès

Formulaire d'inscription bilingue (FR/EN) multi-étapes pour la compétition technologique **Innov'Dom Challenge — Connecter à l'Avenir**, organisée dans le cadre des Journées Pédagogiques JESI · ENSA Fès.

---

## 📋 Données collectées

| Catégorie | Champs |
|-----------|--------|
| **Type** | Individuel / Équipe |
| **Participant** | Nom, Email, Téléphone, Université, Filière, Niveau, LinkedIn |
| **Équipe** | Nom de l'équipe, Membres 2/3/4 (nom + email) |
| **Projet** | Titre, Domaine, Description, Innovation, Format de présentation |
| **Extra** | Comment entendu parler, Fichier CV/résumé (→ Google Drive) |

---

## 🚀 Déploiement — 3 étapes

### Étape 1 — Google Sheet + Drive + Apps Script

**1a. Crée le dossier Google Drive :**
1. Va sur [drive.google.com](https://drive.google.com)
2. Crée un dossier : **"Candidatures Innov'Dom 2025"**
3. Ouvre-le → copie l'ID dans l'URL : `drive.google.com/drive/folders/**CE_CODE_ICI**`

**1b. Crée la Google Sheet :**
1. [sheets.google.com](https://sheets.google.com) → Nouvelle feuille → **"Innov'Dom 2025"**
2. **Extensions → Apps Script** → supprime tout → colle `google-apps-script.js`
3. En haut du fichier, remplace `YOUR_GOOGLE_DRIVE_FOLDER_ID` par l'ID de l'étape 1a
4. **Enregistrer** → exécute `testConnection()` pour vérifier
5. **Déployer → Nouveau déploiement** :
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Accès : **Tout le monde**
6. **Déployer** → autorise → **copie l'URL** (`https://script.google.com/macros/s/.../exec`)

---

### Étape 2 — GitHub

```bash
git init
git add .
git commit -m "Innov'Dom Challenge — Registration Form"
git remote add origin https://github.com/TON_USERNAME/innov-dom-form.git
git push -u origin main
```

---

### Étape 3 — Vercel

1. [vercel.com](https://vercel.com) → **New Project** → importe le repo
2. **Environment Variables** :

| Name | Value |
|------|-------|
| `GOOGLE_SCRIPT_URL` | URL Apps Script (étape 1) |

3. **Deploy** ✅

---

## 🌐 Intégration dans le site de l'événement

```html
<iframe
  src="https://ton-form.vercel.app"
  width="100%"
  height="900px"
  style="border:none; border-radius:20px;"
  title="Inscription Innov'Dom Challenge">
</iframe>
```

---

## 💻 Test local

```bash
npm install
cp .env.local.example .env.local
# Remplis GOOGLE_SCRIPT_URL
npm run dev
# → http://localhost:3000
```

---

## ✨ Fonctionnalités

- ✅ Formulaire multi-étapes (5 étapes) avec barre de progression
- ✅ Mode individuel **ou** équipe (jusqu'à 4 membres)
- ✅ Validation en temps réel par étape
- ✅ Upload de fichier (PDF/DOC/PPT) → sauvegardé dans Google Drive
- ✅ Lien Drive automatiquement enregistré dans la Sheet
- ✅ Couleurs par type (individuel vert / équipe bleu)
- ✅ Bilingue FR/EN avec toggle
- ✅ Design dark neon cohérent avec le quiz d'orientation
- ✅ 100% gratuit — Vercel + Google Apps Script + Google Drive

---

*Département Génie Industriel · ENSA Fès · JESI 2025*
