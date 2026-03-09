# 🎓 Quiz d'Orientation Ingénieur · ENSA Fès

Quiz interactif IA bilingue (FR/EN) pour orienter les étudiants CP vers les **4 filières du département Génie Industriel** de l'ENSA Fès.

| Filière | Icône | Couleur |
|---------|-------|---------|
| Génie Énergétique & Systèmes Intelligents | ⚡ | Vert |
| Génie Mécanique | ⚙️ | Orange |
| Mécatronique | 🤖 | Violet |
| Génie Industriel | 📊 | Bleu |

---

## 🏗️ Architecture (100% gratuit)

```
Étudiant → Next.js (Vercel) → Groq AI llama-3.3-70b-versatile → questions adaptatives
                             → Google Apps Script → Google Sheets (données collectées)
```

---

## 🚀 Déploiement — 4 étapes

### Étape 1 — Google Sheet + Apps Script

1. [sheets.google.com](https://sheets.google.com) → Nouvelle feuille → nomme-la **"Quiz ENSA Fès"**
2. **Extensions → Apps Script** → supprime tout → colle le contenu de `google-apps-script.js`
3. **Enregistrer** → **Déployer → Nouveau déploiement**
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Accès : **Tout le monde**
4. **Déployer** → autorise → **copie l'URL** (`https://script.google.com/macros/s/.../exec`)

---

### Étape 2 — Clé Groq gratuite

1. [console.groq.com](https://console.groq.com) → compte gratuit (pas de CB)
2. **API Keys → Create API Key** → copie (`gsk_...`)

---

### Étape 3 — GitHub

```bash
git init
git add .
git commit -m "Quiz ENSA Fès v1"
git remote add origin https://github.com/TON_USERNAME/quiz-ensa-fes.git
git push -u origin main
```

---

### Étape 4 — Vercel

1. [vercel.com](https://vercel.com) → connecte GitHub → **New Project** → importe le repo
2. **Environment Variables** :

| Name | Value |
|------|-------|
| `GROQ_API_KEY` | `gsk_...` |
| `GOOGLE_SCRIPT_URL` | URL Apps Script |

3. **Deploy** ✅ → ton quiz est en ligne sur `quiz-ensa-fes.vercel.app`

---

## 🌐 Intégration dans ton site existant

```html
<!-- Option iframe — une seule ligne -->
<iframe
  src="https://ton-quiz.vercel.app"
  width="100%" height="820px"
  style="border:none; border-radius:20px;"
  title="Quiz Orientation ENSA Fès">
</iframe>
```

---

## 💻 Test local

```bash
npm install
cp .env.local.example .env.local
# Remplis GROQ_API_KEY et GOOGLE_SCRIPT_URL
npm run dev
# → http://localhost:3000
```

---

## 📊 Données collectées (Google Sheets)

| Colonne | Contenu |
|---------|---------|
| Horodatage | Date + heure ISO |
| Prénom / Nom | Identité |
| Langue | Français / English |
| Filière | GESI / MECA / MECATRONIQUE / GI |
| Profil | Nom du profil personnalisé |
| Q1–R1 … Q5–R5 | Toutes les questions et réponses |
| Note | Étoiles 1–5 |
| Commentaire | Texte libre |

---

## ✨ Fonctionnalités

- ✅ Modèle `llama-3.3-70b-versatile` via Groq (gratuit)
- ✅ Prompt enrichi avec les vrais modules ENSA Fès
- ✅ Biais psychologique anti-"je veux l'info" intégré
- ✅ 4 filières avec couleur, icône et profil personnalisé
- ✅ Explication "pourquoi cette filière" dans le résultat
- ✅ Bilingue FR/EN avec toggle
- ✅ Collecte prénom + nom + Q&A + note + commentaire
- ✅ Sauvegarde automatique Google Sheets
- ✅ Clé API sécurisée côté serveur (jamais exposée)
- ✅ Intégrable en iframe dans tout site existant

---

*Département Génie Industriel · ENSA Fès · Journées Pédagogiques*
