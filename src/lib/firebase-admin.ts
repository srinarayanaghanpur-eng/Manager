import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

function loadServiceAccount(): Record<string, string> | null {
  // 1. Environment variable (Vercel / production)
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (envJson) {
    try {
      return JSON.parse(envJson);
    } catch {
      console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
  }

  // 2. Local JSON file (development, gitignored)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sa = require("../../manager-630e3-firebase-adminsdk-fbsvc-342f27b647.json");
    if (sa && sa.project_id) return sa as Record<string, string>;
  } catch {
    // file missing — not an error, skip
  }

  return null;
}

const serviceAccount = loadServiceAccount();
const isConfigured = serviceAccount !== null;

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

if (serviceAccount && !getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: "manager-630e3",
  });
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
}

export { adminApp, adminAuth, adminDb, isConfigured };
