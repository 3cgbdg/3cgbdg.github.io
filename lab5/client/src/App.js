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

// Firestore — only used for lesson metadata + seeding (not progress)
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { seedLessons } from './utils/seedFirestore';

import './App.css';

// The Express server base URL comes from .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// AppRoutes — inner component so it can call useAuth() (must be inside Provider)
// ─────────────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { currentUser } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [lessonsLoaded, setLessonsLoaded] = useState(false);

  // ── 1. Load lesson metadata from Firestore "lessons" collection ────────
  // (Lesson data stays in Firestore; only progress goes through the server)
  useEffect(() => {
    async function fetchLessons() {
      try {
        const colRef = collection(db, 'lessons');
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
          console.log('Seeding Firestore with lesson data…');
          await seedLessons();
          const seeded = await getDocs(colRef);
          const rows = seeded.docs
            .map(d => d.data())
            .sort((a, b) => a.id - b.id)
            .map(l => ({ ...l, completed: false, completedAt: null }));
          setLessons(rows);
        } else {
          const rows = snapshot.docs
            .map(d => d.data())
            .sort((a, b) => a.id - b.id)
            .map(l => ({ ...l, completed: false, completedAt: null }));
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

  // ── 2. Load user progress from the Express server (GET /api/progress) ─
  const applyUserProgress = useCallback(async () => {
    if (!currentUser || !lessonsLoaded) return;
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const { progress } = await res.json();

      // Merge server progress into local lesson list
      setLessons(prev =>
        prev.map(lesson => {
          const entry = progress.find(p => p.lessonId === lesson.id);
          return entry
            ? { ...lesson, completed: entry.completed, completedAt: entry.completedAt }
            : { ...lesson, completed: false, completedAt: null };
        })
      );
    } catch (err) {
      console.error('Failed to load progress from server:', err.message);
    }
  }, [currentUser, lessonsLoaded]);

  useEffect(() => {
    if (!lessonsLoaded) return;
    if (!currentUser) {
      setLessons(prev => prev.map(l => ({ ...l, completed: false, completedAt: null })));
      return;
    }
    applyUserProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, lessonsLoaded]);

  // ── 3. Toggle completion — optimistic UI + POST /api/progress ──────────
  const handleToggle = async (id) => {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    const newCompleted = !lesson.completed;
    const newCompletedAt = newCompleted ? new Date().toISOString() : null;

    // Optimistic UI update
    setLessons(prev =>
      prev.map(l =>
        l.id === id ? { ...l, completed: newCompleted, completedAt: newCompletedAt } : l
      )
    );

    // Persist via server API
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_URL}/api/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lessonId: id, completed: newCompleted }),
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        // Apply server-confirmed completedAt (source of truth)
        setLessons(prev =>
          prev.map(l =>
            l.id === id ? { ...l, completedAt: data.completedAt } : l
          )
        );
      } catch (err) {
        console.error('Failed to save progress to server:', err.message);
        // Revert optimistic update on failure
        setLessons(prev =>
          prev.map(l =>
            l.id === id ? { ...l, completed: !newCompleted, completedAt: lesson.completedAt } : l
          )
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
