/**
 * server.js
 *
 * PhotoMaster — Node.js/Express backend
 *
 * Routes:
 *   GET  /api/message   → health check
 *   GET  /api/progress  → get user lesson progress (protected)
 *   POST /api/progress  → save lesson completion (protected)
 *   *                   → serve built React app (static files from /public)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── Health check / test route ────────────────────────────────────────────────
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// ─── API routes ───────────────────────────────────────────────────────────────
const progressRouter = require('./routes/progress');
app.use('/api/progress', progressRouter);

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
