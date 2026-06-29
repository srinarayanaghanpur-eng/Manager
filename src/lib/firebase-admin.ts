import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import serviceAccount from "../../manager-630e3-firebase-adminsdk-fbsvc-342f27b647.json";

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount as Record<string, string>),
    projectId: "manager-630e3",
  });
} else {
  adminApp = getApps()[0]!;
}
adminAuth = getAuth(adminApp);
adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
