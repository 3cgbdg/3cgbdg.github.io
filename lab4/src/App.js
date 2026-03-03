import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Gallery from './pages/Gallery';
import Progress from './pages/Progress';
import Auth from './pages/Auth';

// Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Firestore
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

// Seed utility
import { seedLessons } from './utils/seedFirestore';

import './App.css';

// ─────────────────────────────────────────────────────────────────────────────
// AppRoutes — inner component so it can call useAuth() (must be inside Provider)
// ─────────────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { currentUser } = useAuth();

  const [lessons, setLessons] = useState([]);       // lesson metadata from Firestore
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);

  // ── 1. Load lesson metadata from Firestore "lessons" collection ────────
  useEffect(() => {
    async function fetchLessons() {
      try {
        const colRef = collection(db, 'lessons');
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
          // First run — seed, then re-fetch
          console.log('Seeding Firestore with lesson data…');
          await seedLessons();
          const seeded = await getDocs(colRef);
          const rows = seeded.docs
            .map(d => d.data())
            .sort((a, b) => a.id - b.id)
            .map(l => ({ ...l, completed: false }));
          setLessons(rows);
        } else {
          const rows = snapshot.docs
            .map(d => d.data())
            .sort((a, b) => a.id - b.id)
            .map(l => ({ ...l, completed: false }));
          setLessons(rows);
        }
        setLessonsLoaded(true);
      } catch (err) {
        console.error('Firestore error:', err.message);
        setDbError(
          'Could not connect to the database. ' +
          'Please fill in your Firebase credentials in the .env file and restart.'
        );
      } finally {
        setDbLoading(false);
      }
    }
    fetchLessons();
  }, []);

  // ── 2. Load / reset user progress whenever auth or lessons change ──────
  // Stored as: userProgress/{uid}  →  { "1": true, "3": false, … }
  const applyUserProgress = useCallback(async () => {
    if (!currentUser || !lessonsLoaded) return;
    try {
      const progressRef = doc(db, 'userProgress', currentUser.uid);
      const progressSnap = await getDoc(progressRef);
      if (progressSnap.exists()) {
        const data = progressSnap.data(); // e.g. { "1": true, "3": true }
        setLessons(prev =>
          prev.map(l => ({ ...l, completed: data[String(l.id)] ?? false }))
        );
      } else {
        // New user — no progress yet, reset everything to false
        setLessons(prev => prev.map(l => ({ ...l, completed: false })));
      }
    } catch (err) {
      console.error('Failed to load user progress:', err.message);
    }
  }, [currentUser, lessonsLoaded]);

  useEffect(() => {
    if (!lessonsLoaded) return;

    if (!currentUser) {
      // Logged out — reset completed state
      setLessons(prev => prev.map(l => ({ ...l, completed: false })));
      return;
    }

    applyUserProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, lessonsLoaded]);

  // ── 3. Toggle completion — update React state + persist to Firestore ───
  const handleToggle = async (id) => {
    // Find current state
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    const newCompleted = !lesson.completed;

    // Optimistic UI update
    setLessons(prev =>
      prev.map(l => l.id === id ? { ...l, completed: newCompleted } : l)
    );

    // Persist to Firestore under this user's progress document
    if (currentUser) {
      try {
        await setDoc(
          doc(db, 'userProgress', currentUser.uid),
          { [String(id)]: newCompleted },  // merge so other lessons stay intact
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to save progress to Firestore:', err.message);
        // Revert optimistic update on failure
        setLessons(prev =>
          prev.map(l => l.id === id ? { ...l, completed: !newCompleted } : l)
        );
      }
    }
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* ── Public routes ──────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/lessons"
          element={
            <Lessons
              lessons={lessons}
              onToggle={handleToggle}
              loading={dbLoading}
              error={dbError}
            />
          }
        />

        {/* ── Protected routes (authentication required) ─────────── */}
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress lessons={lessons} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App — sets up Router + AuthProvider, then delegates to AppRoutes
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
