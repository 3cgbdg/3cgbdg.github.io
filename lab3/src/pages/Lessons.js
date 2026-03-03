import React from 'react';
import LessonCard from '../components/LessonCard';
import ProgressBar from '../components/ProgressBar';
import './Lessons.css';

function Lessons({ lessons, onToggle }) {
    const completedCount = lessons.filter(l => l.completed).length;

    return (
        <main className="lessons page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="lessons__header fade-in-up">
                    <div>
                        <h1>
                            📚 <span className="gradient-text">Lessons</span>
                        </h1>
                        <p className="lessons__subtitle">
                            Learn at your own pace. Mark each lesson as completed to track your progress.
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="lessons__progress fade-in-up">
                    <ProgressBar completed={completedCount} total={lessons.length} />
                </div>

                {/* Cards grid */}
                <div className="lessons__grid" id="lessons-grid">
                    {lessons.map((lesson, index) => (
                        <LessonCard
                            key={lesson.id}
                            {...lesson}
                            onToggle={onToggle}
                            style={{ animationDelay: `${index * 0.07}s` }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Lessons;
