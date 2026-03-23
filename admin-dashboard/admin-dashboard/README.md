# 🔐 Admin Dashboard · JESI 2026 · ENSA Fès

Dashboard admin protégé par Google OAuth pour visualiser les inscriptions et résultats quiz en temps réel.

---

## 🚀 Setup — 4 étapes

### Étape 1 — Google OAuth (Google Cloud Console)

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. Crée un nouveau projet (ex: "JESI Admin")
3. **APIs & Services → OAuth consent screen**
   - User Type: External → Create
   - App name: "JESI 2026 Admin"
   - Remplis les champs requis → Save
4. **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://ton-site.vercel.app/api/auth/callback/google` (prod)
5. Copie **Client ID** et **Client Secret**

---

### Étape 2 — Variables d'environnement Vercel

Ajoute ces variables dans Vercel → Settings → Environment Variables :

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | Client ID de l'étape 1 |
| `GOOGLE_CLIENT_SECRET` | Client Secret de l'étape 1 |
| `NEXTAUTH_SECRET` | Un string aléatoire fort (ex: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://ton-site.vercel.app` |
| `ADMIN_EMAILS` | `email1@gmail.com,email2@gmail.com` (emails autorisés) |
| `ADMIN_DATA_SECRET` | Un secret fort pour sécuriser l'accès aux sheets |

---

### Étape 3 — Mettre à jour les Apps Scripts

Dans **chaque** Google Apps Script (quiz + inscriptions) :
1. Ouvre le script
2. **Ajoute le contenu de `google-apps-script-addon.js`** en haut du fichier
3. Change `YOUR_ADMIN_SECRET_HERE` par la même valeur que `ADMIN_DATA_SECRET`
4. **Nouveau déploiement** → copie la nouvelle URL → mets à jour sur Vercel

---

### Étape 4 — Ajouter les fichiers au projet

Copie dans ton projet principal :
- `app/api/auth/nextauth/route.ts`
- `app/api/admin/data/route.ts`
- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `middleware.ts` (merge avec ton middleware existant si tu en as un)

Installe les dépendances :
```bash
npm install next-auth recharts
```

Push et déploie :
```bash
git add .
git commit -m "Add admin dashboard"
git push
```

---

## ☁️ Cloudflare (gratuit) — Protection DDoS + SSL

Cloudflare free plan te donne : DDoS protection, SSL auto, cache, firewall basique.

### Setup (5 minutes) :
1. Va sur [cloudflare.com](https://cloudflare.com) → crée un compte gratuit
2. **Add a Site** → entre ton domaine
3. Choisis le plan **Free**
4. Cloudflare scan tes DNS existants → confirme
5. **Change tes nameservers** chez ton registrar (ex: Namecheap, GoDaddy) vers ceux de Cloudflare
6. Attends 5-30 min que ça se propage

### Config recommandée pour Vercel + Cloudflare :
- SSL/TLS mode : **Full (strict)**
- Dans les DNS records : ton domaine doit pointer vers Vercel avec le proxy ☁️ activé
- **Page Rules** (optionnel) : force HTTPS sur tout le site

⚠️ Si tu utilises un sous-domaine Vercel (`.vercel.app`), Cloudflare ne peut pas le protéger directement — tu as besoin d'un domaine custom.

---

## 🌐 Accès

Le dashboard est accessible sur : `https://ton-site.vercel.app/admin`

Seuls les emails listés dans `ADMIN_EMAILS` peuvent se connecter.

---

*Département Génie Industriel · ENSA Fès · JESI 2026*
