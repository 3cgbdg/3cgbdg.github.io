/**
 * server.js
 *
 * PhotoMaster — Node.js/Express backend
 *
 * Routes:
 *   GET  /api/message    → health check (public)
 *   GET  /api/protected  → demo protected route (requires auth token)
 *   GET  /api/profile    → authenticated user profile (requires auth token)
 *   GET  /api/progress   → get user lesson progress sorted by date (protected)
 *   POST /api/progress   → save lesson completion with date (protected)
 *   *                    → serve built React app (static files from /public)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// CORS_ORIGIN can be a comma-separated list, e.g.:
//   https://sixsevenbro.netlify.app,http://localhost:3000
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim().replace(/\/+$/, '')); // trim spaces + trailing slashes

console.log('✅  CORS allowed origins:', ALLOWED_ORIGINS);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
        console.warn(`⛔  CORS blocked: ${origin}`);
        callback(new Error(`CORS policy: origin ${origin} not allowed.`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());

// ─── Health check / test route ────────────────────────────────────────────────
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// ─── Auth middleware ──────────────────────────────────────────────────────────
const authenticate = require('./middleware/auth');

// ─── API routes ───────────────────────────────────────────────────────────────
const progressRouter = require('./routes/progress');
app.use('/api/progress', progressRouter);

// GET /api/protected — Task 3: demo protected route
// Only authenticated users get a response (401 otherwise)
app.get('/api/protected', authenticate, (req, res) => {
    res.json({
        message: 'Access granted to protected route.',
        user: {
            uid: req.user.uid,
            email: req.user.email,
        },
    });
});

// GET /api/profile — Task 1, Step 4: return authenticated user's profile
app.get('/api/profile', authenticate, async (req, res) => {
    try {
        const { admin } = require('./firebaseConfig');
        const userRecord = await admin.auth().getUser(req.user.uid);
        res.json({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName || null,
            createdAt: userRecord.metadata.creationTime,
            lastLogin: userRecord.metadata.lastSignInTime,
        });
    } catch (err) {
        console.error('GET /api/profile error:', err.message);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

// ─── Static file hosting (serve built React app) ──────────────────────────────
// In production, run `npm run build` in client folder and copy build/ here as public/
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Catch-all: return index.html for any non-API route (React Router support)
app.get('*', (req, res) => {
    const indexFile = path.join(publicDir, 'index.html');
    res.sendFile(indexFile, (err) => {
        if (err) {
            res.status(404).json({ error: 'Client build not found. Run npm run build in client folder.' });
        }
    });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Server running at http://localhost:${PORT}`);
    console.log(`    API test: http://localhost:${PORT}/api/message`);
});
