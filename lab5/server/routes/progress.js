/**
 * routes/progress.js
 *
 * REST API routes for user lesson progress.
 *
 * Data model in Firestore (collection: userProgress, doc id: uid):
 * {
 *   "1": { completed: true,  completedAt: "2026-03-03T20:00:00.000Z" },
 *   "3": { completed: false, completedAt: null },
 *   ...
 * }
 *
 * GET  /api/progress   → returns completed lessons sorted by completedAt (asc)
 * POST /api/progress   → saves lesson completion status with date
 */

const express = require('express');
const router = express.Router();
const { db } = require('../firebaseConfig');
const authenticate = require('../middleware/auth');

// Apply auth middleware to all routes in this router
router.use(authenticate);

// ─── GET /api/progress ────────────────────────────────────────────────────────
// Returns all lessons with their completion status + date, sorted by completedAt
router.get('/', async (req, res) => {
    try {
        const { uid } = req.user;

        // 1. Fetch user progress document
        const progressRef = db.collection('userProgress').doc(uid);
        const progressSnap = await progressRef.get();

        // 2. Fetch all lesson metadata
        const lessonsSnap = await db.collection('lessons').get();
        const lessonsMap = {};
        lessonsSnap.docs.forEach(doc => {
            const data = doc.data();
            lessonsMap[String(data.id)] = data;
        });

        // 3. Build result array
        const progressData = progressSnap.exists ? progressSnap.data() : {};

        const result = Object.keys(lessonsMap).map(lessonId => {
            const entry = progressData[lessonId];
            const lesson = lessonsMap[lessonId];

            // Handle both old format (boolean) and new format (object)
            let completed = false;
            let completedAt = null;
            if (entry !== undefined) {
                if (typeof entry === 'boolean') {
                    completed = entry;
                } else if (typeof entry === 'object' && entry !== null) {
                    completed = entry.completed ?? false;
                    completedAt = entry.completedAt ?? null;
                }
            }

            return {
                lessonId: Number(lessonId),
                title: lesson?.title || '',
                emoji: lesson?.emoji || '📷',
                duration: lesson?.duration || '',
                category: lesson?.category || '',
                completed,
                completedAt,
            };
        });

        // 4. Sort: completed lessons by completedAt asc, then incomplete
        result.sort((a, b) => {
            if (a.completed && b.completed) {
                return new Date(a.completedAt) - new Date(b.completedAt);
            }
            if (a.completed) return -1;
            if (b.completed) return 1;
            return a.lessonId - b.lessonId;
        });

        res.json({ progress: result });
    } catch (err) {
        console.error('GET /api/progress error:', err.message);
        res.status(500).json({ error: 'Failed to fetch progress.' });
    }
});

// ─── POST /api/progress ───────────────────────────────────────────────────────
// Saves lesson completion status with timestamp
// Body: { lessonId: number, completed: boolean }
router.post('/', async (req, res) => {
    try {
        const { uid } = req.user;
        const { lessonId, completed } = req.body;

        if (lessonId === undefined || completed === undefined) {
            return res.status(400).json({ error: 'lessonId and completed are required.' });
        }

        const completedAt = completed ? new Date().toISOString() : null;

        const progressRef = db.collection('userProgress').doc(uid);
        await progressRef.set(
            {
                [String(lessonId)]: { completed, completedAt },
            },
            { merge: true }  // preserve other lessons
        );

        res.json({
            lessonId,
            completed,
            completedAt,
            message: `Lesson ${lessonId} marked as ${completed ? 'completed' : 'incomplete'}.`,
        });
    } catch (err) {
        console.error('POST /api/progress error:', err.message);
        res.status(500).json({ error: 'Failed to save progress.' });
    }
});

module.exports = router;
