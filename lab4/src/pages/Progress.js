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

function Progress({ lessons }) {
    const total = lessons.length;
    const completed = lessons.filter(l => l.completed).length;
    const remaining = total - completed;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const { emoji, text } =
        MESSAGES.find(m => pct >= m.threshold) || MESSAGES[MESSAGES.length - 1];

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

                {/* Lesson list */}
                <section className="progress-page__list fade-in-up">
                    <h2>Lesson Breakdown</h2>
                    <ul className="progress-page__items" id="progress-lesson-list">
                        {lessons.map(lesson => (
                            <li
                                key={lesson.id}
                                className={`progress-page__item glass-card ${lesson.completed ? 'progress-page__item--done' : ''}`}
                                id={`progress-lesson-${lesson.id}`}
                            >
                                <span className="progress-page__item-emoji">{lesson.emoji}</span>
                                <div className="progress-page__item-info">
                                    <span className="progress-page__item-title">{lesson.title}</span>
                                    <span className="progress-page__item-duration">⏱ {lesson.duration}</span>
                                </div>
                                <span className={`progress-page__item-badge ${lesson.completed ? 'progress-page__item-badge--done' : ''}`}>
                                    {lesson.completed ? '✓ Done' : 'Pending'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}

export default Progress;
