import { initializeApp } from 'firebase/app'
import { getAuth as fbGetAuth } from 'firebase/auth'
import { getFirestore as fbGetFirestore } from 'firebase/firestore'
import { getStorage as fbGetStorage } from 'firebase/storage'

let app = null
let auth = null
let db = null
let storage = null

export function isFirebaseConfigured() {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && import.meta.env.VITE_FIREBASE_PROJECT_ID)
}

function createConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
}

export function initFirebase() {
  if (app) return { app, auth, db }
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Set VITE_FIREBASE_* env vars to enable Firebase features.')
    return null
  }
  try {
    const cfg = createConfig()
    app = initializeApp(cfg)
    auth = fbGetAuth(app)
    db = fbGetFirestore(app)
    storage = fbGetStorage(app)
    return { app, auth, db }
  } catch (err) {
    console.error('Failed to initialize Firebase', err)
    return null
  }
}

export function getAuthInstance() {
  if (!auth) initFirebase()
  return auth
}

export function getDbInstance() {
  if (!db) initFirebase()
  return db
}

export function getStorageInstance() {
  if (!storage) initFirebase()
  return storage
}
