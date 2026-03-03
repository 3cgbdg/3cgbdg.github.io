import React from 'react';
import ProgressBar from '../components/ProgressBar';
import './Progress.css';

const MESSAGES = [
    { threshold: 100, emoji: '🏆', text: "You've completed the entire course! Outstanding work!" },
    { threshold: 75, emoji: '🔥', text: "Amazing progress! You're almost there — keep going!" },
    { threshold: 50, emoji: '💪', text: "Great work! You've reached the halfway point!" },
    { threshold: 25, emoji: '🌱', text: "Good start! Keep building that momentum!" },
    { threshold: 0, emoji: '📸', text: "Your journey begins! Start with the first lesson." },
];

// Format ISO date string to readable format, e.g. "03.03.2026 22:00"
function formatDate(isoString) {
    if (!isoString) return null;
    const d = new Date(isoString);
    const date = d.toLocaleDateString('uk-UA');        // e.g. 03.03.2026
    const time = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }); // 22:00
    return `${date} ${time}`;
}

function Progress({ lessons }) {
    const total = lessons.length;
    const completed = lessons.filter(l => l.completed).length;
    const remaining = total - completed;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const { emoji, text } =
        MESSAGES.find(m => pct >= m.threshold) || MESSAGES[MESSAGES.length - 1];

    // Completed lessons sorted by completedAt (most recent first)
    const completedLessons = lessons
        .filter(l => l.completed)
        .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    const pendingLessons = lessons.filter(l => !l.completed);

    return (
        <main className="progress-page page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="progress-page__header fade-in-up">
                    <h1>
                        📊 <span className="gradient-text">My Progress</span>
                    </h1>
                    <p className="progress-page__subtitle">
                        Track your learning journey through the photography course.
                    </p>
                </div>

                {/* Main progress bar */}
                <div className="progress-page__bar fade-in-up">
                    <ProgressBar completed={completed} total={total} />
                </div>

                {/* Motivational message */}
                <div className="progress-page__message glass-card fade-in-up">
                    <span className="progress-page__message-emoji">{emoji}</span>
                    <p>{text}</p>
                </div>

                {/* Stats row */}
                <div className="progress-page__stats fade-in-up">
                    <div className="progress-page__stat glass-card" id="stat-total">
                        <span className="progress-page__stat-num">{total}</span>
                        <span className="progress-page__stat-label">Total Lessons</span>
                    </div>
                    <div className="progress-page__stat glass-card" id="stat-completed">
                        <span className="progress-page__stat-num progress-page__stat-num--done">{completed}</span>
                        <span className="progress-page__stat-label">Completed</span>
                    </div>
                    <div className="progress-page__stat glass-card" id="stat-remaining">
                        <span className="progress-page__stat-num progress-page__stat-num--rem">{remaining}</span>
                        <span className="progress-page__stat-label">Remaining</span>
                    </div>
                </div>

                {/* Completed lessons — sorted by completedAt (from server) */}
                {completedLessons.length > 0 && (
                    <section className="progress-page__list fade-in-up">
                        <h2>✅ Completed Lessons</h2>
                        <ul className="progress-page__items" id="progress-lesson-list">
                            {completedLessons.map(lesson => (
                                <li
                                    key={lesson.id}
                                    className="progress-page__item glass-card progress-page__item--done"
                                    id={`progress-lesson-${lesson.id}`}
                                >
                                    <span className="progress-page__item-emoji">{lesson.emoji}</span>
                                    <div className="progress-page__item-info">
                                        <span className="progress-page__item-title">{lesson.title}</span>
                                        <span className="progress-page__item-duration">⏱ {lesson.duration}</span>
                                        {/* Completion date from server */}
                                        {lesson.completedAt && (
                                            <span className="progress-page__item-date">
                                                📅 Completed: {formatDate(lesson.completedAt)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="progress-page__item-badge progress-page__item-badge--done">
                                        ✓ Done
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Pending lessons */}
                {pendingLessons.length > 0 && (
                    <section className="progress-page__list fade-in-up">
                        <h2>⏳ Pending Lessons</h2>
                        <ul className="progress-page__items" id="progress-pending-list">
                            {pendingLessons.map(lesson => (
                                <li
                                    key={lesson.id}
                                    className="progress-page__item glass-card"
                                    id={`progress-lesson-${lesson.id}`}
                                >
                                    <span className="progress-page__item-emoji">{lesson.emoji}</span>
                                    <div className="progress-page__item-info">
                                        <span className="progress-page__item-title">{lesson.title}</span>
                                        <span className="progress-page__item-duration">⏱ {lesson.duration}</span>
                                    </div>
                                    <span className="progress-page__item-badge">Pending</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </main>
    );
}

export default Progress;
