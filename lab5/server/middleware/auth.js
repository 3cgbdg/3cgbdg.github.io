/**
 * middleware/auth.js
 *
 * Express middleware that verifies Firebase Auth JWT tokens.
 * The client sends: Authorization: Bearer <idToken>
 *
 * On success, attaches req.user = { uid, email } and calls next().
 * On failure, returns 401 Unauthorized.
 */

const { admin } = require('../firebaseConfig');

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.user = { uid: decoded.uid, email: decoded.email };
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authenticate;
