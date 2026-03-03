/**
 * firebaseConfig.js
 *
 * Initialises Firebase Admin SDK using a service account key.
 * The serviceAccountKey.json file is downloaded from:
 *   Firebase Console → Project Settings → Service Accounts → Generate new private key
 *
 * Place the downloaded JSON file at: lab5/server/serviceAccountKey.json
 * (It is excluded from git via .gitignore)
 */

const admin = require('firebase-admin');

let serviceAccount;
try {
    serviceAccount = require('./serviceAccountKey.json');
} catch (e) {
    console.error(
        '❌  serviceAccountKey.json not found.\n' +
        '    Download it from Firebase Console → Project Settings → Service Accounts\n' +
        '    and place it in the lab5/server/ directory.'
    );
    process.exit(1);
}

// Only initialise once (guard against hot-reload double init)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

module.exports = { admin, db };
