/**
 * seedFirestore.js
 *
 * One-time seed utility: writes the initial lessons dataset to Firestore.
 * Called from App.js on mount when the "lessons" collection is empty.
 * This ensures the cloud database is populated before the client reads from it.
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ── Seed dataset ──────────────────────────────────────────────────────────────
// This is the ONLY place static lesson data lives.
// The rest of the app always reads lessons from Firestore.

const LESSONS_SEED = [
    {
        id: 1,
        title: 'Introduction to Photography',
        description: 'Learn the basics of photography — what a camera is, how it works, and the key concepts every beginner needs to know.',
        category: 'Basics',
        duration: '25 min',
        emoji: '📷',
    },
    {
        id: 2,
        title: 'Understanding Light',
        description: 'Discover how light shapes your photos. Explore natural light, artificial light, and the golden hour.',
        category: 'Technique',
        duration: '30 min',
        emoji: '💡',
    },
    {
        id: 3,
        title: 'Composition Rules',
        description: 'Master the rule of thirds, leading lines, framing, and other composition techniques to create stunning images.',
        category: 'Technique',
        duration: '35 min',
        emoji: '📐',
    },
    {
        id: 4,
        title: 'Portrait Photography',
        description: 'Capture emotion and personality. Learn lighting setups, posing guidance, and lens choices for portrait work.',
        category: 'Genre',
        duration: '40 min',
        emoji: '🤳',
    },
    {
        id: 5,
        title: 'Landscape Photography',
        description: 'Explore wide-angle techniques, tripod use, long exposures, and how to capture dramatic natural scenes.',
        category: 'Genre',
        duration: '40 min',
        emoji: '🌄',
    },
    {
        id: 6,
        title: 'Macro Photography',
        description: 'Get up close and personal with the world. Learn about macro lenses, depth of field, and focus stacking.',
        category: 'Genre',
        duration: '35 min',
        emoji: '🔬',
    },
    {
        id: 7,
        title: 'Street Photography',
        description: 'Capture candid moments in public spaces. Explore ethics, timing, and gear for street shooting.',
        category: 'Genre',
        duration: '30 min',
        emoji: '🏙️',
    },
    {
        id: 8,
        title: 'Post-Processing Basics',
        description: 'Learn how to edit your photos using Lightroom and Photoshop — from basic adjustments to creative effects.',
        category: 'Editing',
        duration: '45 min',
        emoji: '🎨',
    },
];

/**
 * Writes all seed lessons to the Firestore "lessons" collection.
 * Each lesson is stored as a document with its id as the document ID.
 * @returns {Promise<void>}
 */
export async function seedLessons() {
    const writes = LESSONS_SEED.map((lesson) =>
        setDoc(doc(db, 'lessons', String(lesson.id)), lesson)
    );
    await Promise.all(writes);
    console.log(`✅ Firestore seeded with ${LESSONS_SEED.length} lessons.`);
}
