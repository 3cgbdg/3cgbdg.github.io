import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Gallery from './pages/Gallery';
import Progress from './pages/Progress';
import lessonsData from './data/lessons';
import './App.css';

// Initialise lessons state: add completed: false to each lesson
const initialLessons = lessonsData.map(lesson => ({ ...lesson, completed: false }));

function App() {
  // Lifted state — shared by Lessons and Progress pages
  const [lessons, setLessons] = useState(initialLessons);
  
  // Toggle completion for a lesson by id
  const handleToggle = (id) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
      )
    );
  };

  return (
    <BrowserRouter>
      {/* Navbar is always visible */}
      <Navbar />

      {/* Route-based page rendering */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<Lessons lessons={lessons} onToggle={handleToggle} />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/progress" element={<Progress lessons={lessons} />} />
        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
