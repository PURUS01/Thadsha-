/**
 * Usage: SERVICE_ACCOUNT_PATH=./serviceAccount.json node tools/set-admin-claim.js <USER_UID>
 * This script sets a custom claim { admin: true } for the provided UID.
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

const uid = process.argv[2]
if (!uid) {
  console.error('Usage: SERVICE_ACCOUNT_PATH=./serviceAccount.json node tools/set-admin-claim.js <USER_UID>')
  process.exit(1)
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Set admin claim for ${uid}`)
    process.exit(0)
  })
  .catch(err => {
    console.error('Failed to set claim', err)
    process.exit(1)
  })
