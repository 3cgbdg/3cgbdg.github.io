import React from 'react';
import LessonCard from '../components/LessonCard';
import ProgressBar from '../components/ProgressBar';
import './Lessons.css';

function Lessons({ lessons, onToggle, loading, error }) {
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

                {/* Progress bar — shown only when data is loaded */}
                {!loading && !error && (
                    <div className="lessons__progress fade-in-up">
                        <ProgressBar completed={completedCount} total={lessons.length} />
                    </div>
                )}

                {/* Loading spinner — while Firestore is being fetched / seeded */}
                {loading && (
                    <div className="lessons__loading fade-in-up" id="lessons-loading">
                        <div className="lessons__spinner" />
                        <p>Loading lessons from the cloud database…</p>
                    </div>
                )}

                {/* Error state — Firestore not reachable (config missing, network, etc.) */}
                {!loading && error && (
                    <div className="lessons__error fade-in-up" id="lessons-error" role="alert">
                        <span className="lessons__error-icon">⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Lesson cards — data loaded successfully from Firestore */}
                {!loading && !error && (
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
                )}
            </div>
        </main>
    );
}

export default Lessons;
