/**
 * Usage: SERVICE_ACCOUNT_PATH=./serviceAccount.json node tools/seed-themes.js
 * Seeds the palettes into Firestore under `theme/palettes` and sets `theme/current`.
 */
const admin = require('firebase-admin')
const fs = require('fs')

const svcPath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS
if (!svcPath || !fs.existsSync(svcPath)) {
  console.error('Provide a valid service account JSON path via SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS')
  process.exit(1)
}

const svc = require(svcPath)
admin.initializeApp({ credential: admin.credential.cert(svc) })

const db = admin.firestore()

const PALETTES = [
  {
    id: 'soft-pastel',
    label: 'Soft Pastel + White',
    desc: 'Clean, elegant — recommended',
    background: '#F9FAFB',
    primary: '#6366F1',
    secondary: '#EC4899',
    text: '#111827',
    accent: '#22C55E'
  },
  {
    id: 'dark-neon',
    label: 'Dark + Neon Accent',
    desc: 'Bold tech look',
    background: '#0F172A',
    primary: '#38BDF8',
    accent: '#A855F7',
    text: '#E5E7EB'
  },
  {
    id: 'beige-rose',
    label: 'Beige + Rose',
    desc: 'Elegant & friendly',
    background: '#FAF7F2',
    primary: '#E11D48',
    secondary: '#374151',
    text: '#1F2937'
  },
  {
    id: 'fresh-minimal',
    label: 'Fresh & Minimal',
    desc: 'Green + White',
    background: '#FFFFFF',
    primary: '#10B981',
    secondary: '#6B7280',
    accent: '#F59E0B',
    text: '#111827'
  }
]

;(async ()=>{
  try {
    const batch = db.batch()
    PALETTES.forEach(p => {
      const ref = db.doc(`theme/palettes/${p.id}`)
      batch.set(ref, p)
    })
    // set current to soft-pastel
    batch.set(db.doc('theme/current'), { palette: 'soft-pastel' })
    await batch.commit()
    console.log('Seeded palettes and set current=soft-pastel')
    process.exit(0)
  } catch (err) {
    console.error('Failed to seed', err)
    process.exit(1)
  }
})()
