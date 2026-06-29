// ---------------------------------------------------------------------------
// Firebase client initialisation.
//
// Config sources (tried in order):
//   1. localStorage("edusocial-firebase-config") — set via Settings UI
//   2. NEXT_PUBLIC_FIREBASE_* environment variables
//
// The whole app is designed to RUN WITHOUT Firebase configured (it falls back
// to local mock/seed data). Firebase only initialises when required fields
// are present, so `npm run dev` works out of the box.
// ---------------------------------------------------------------------------
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function loadConfig(): FirebaseConfig | null {
  // 1. Check localStorage (set via Settings UI)
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("edusocial-firebase-config");
      if (stored) {
        const parsed = JSON.parse(stored) as FirebaseConfig;
        if (parsed.apiKey && parsed.projectId) return parsed;
      }
    } catch {}
  }

  // 2. Fall back to env vars
  const env: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };

  if (env.apiKey && env.projectId) return env;
  return null;
}

const firebaseConfig = loadConfig();
export const isFirebaseConfigured = firebaseConfig !== null;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (firebaseConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };

/** Save Firebase config to localStorage and reload to re-initialise. */
export function applyFirebaseConfig(config: FirebaseConfig): boolean {
  try {
    window.localStorage.setItem("edusocial-firebase-config", JSON.stringify(config));
    return true;
  } catch {
    return false;
  }
}

/** Remove saved Firebase config and reload. */
export function clearFirebaseConfig(): boolean {
  try {
    window.localStorage.removeItem("edusocial-firebase-config");
    return true;
  } catch {
    return false;
  }
}
