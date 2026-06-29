// Run with: node scripts/create-users.js
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.join(
  __dirname,
  "..",
  "manager-630e3-firebase-adminsdk-fbsvc-342f27b647.json"
));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const auth = getAuth();
const db = getFirestore();

const users = [
  {
    email: "admin@snhs.edu",
    password: "Narayana@2026",
    displayName: "SNHS Admin",
    role: "super_admin",
  },
  {
    email: "raju@teacher.snhs.edu",
    password: "Snhs@2026",
    displayName: "RAJU",
    role: "social_manager",
  },
];

async function ensureFirestoreDoc(uid, data) {
  try {
    await db.collection("users").doc(uid).set(data);
    console.log(`  -> Firestore doc written`);
  } catch (e) {
    console.log(`  -> Firestore write failed: ${e.message}`);
  }
}

async function main() {
  for (const u of users) {
    try {
      const record = await auth.createUser({
        email: u.email,
        password: u.password,
        displayName: u.displayName,
      });
      await auth.setCustomUserClaims(record.uid, { role: u.role });
      console.log(`OK  ${u.displayName} (${u.email}) — uid: ${record.uid}`);
      await ensureFirestoreDoc(record.uid, {
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        console.log(`EXISTS  ${u.email} — fetching uid...`);
        const record = await auth.getUserByEmail(u.email);
        console.log(`  -> uid: ${record.uid}`);
        // Ensure claims are set
        if (record.customClaims?.role !== u.role) {
          await auth.setCustomUserClaims(record.uid, { role: u.role });
          console.log(`  -> claims updated to ${u.role}`);
        }
        await ensureFirestoreDoc(record.uid, {
          email: u.email,
          displayName: u.displayName,
          role: u.role,
          updatedAt: new Date().toISOString(),
        });
      } else {
        console.error(`FAIL  ${u.email}:`, err.message);
      }
    }
  }
  process.exit(0);
}

main();
