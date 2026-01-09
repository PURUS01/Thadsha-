# Thadsha Admin (Vite + React + Tailwind + Firebase)

Admin dashboard to manage portfolio content (profile, skills, projects) and theme settings.

Getting started

1. Copy `.env.example` to `.env` and fill your Firebase credentials.

2. Install dependencies:

```bash
npm install
```

3. Run the dev server:

```bash
npm run dev
```
 
Firebase admin helper scripts

- Seed theme palettes into Firestore (needs a service account JSON):

```bash
SERVICE_ACCOUNT_PATH=./serviceAccount.json node tools/seed-themes.js
```

- Set an admin custom claim on a user (needs service account):

```bash
SERVICE_ACCOUNT_PATH=./serviceAccount.json node tools/set-admin-claim.js <USER_UID>
```

Security rules files are included: `firestore.rules` and `storage.rules`. Replace `ADMIN_UID` or use custom claims in those files before deploying rules.

To deploy rules using Firebase CLI:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```


Project structure

- src/ — source files
- src/services/firebase.js — firebase init
- src/context/AuthContext.jsx — auth provider
- src/pages — Login, Dashboard, Managers
- src/components — UI components

Notes

- This scaffold uses Tailwind CSS and react-hot-toast for notifications.
- Secure production rules should be configured in Firebase console.
