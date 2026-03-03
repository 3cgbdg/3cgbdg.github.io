import React from 'react';
import './LessonCard.css';

function LessonCard({ id, title, description, category, duration, emoji, completed, onToggle }) {
    return (
        <article
            className={`lesson-card glass-card ${completed ? 'lesson-card--done' : ''}`}
            id={`lesson-card-${id}`}
        >
            {/* Emoji thumbnail */}
            <div className="lesson-card__thumb">
                <span className="lesson-card__emoji">{emoji}</span>
                {completed && (
                    <div className="lesson-card__done-badge">✓</div>
                )}
            </div>

            {/* Meta */}
            <div className="lesson-card__meta">
                <span className="lesson-card__category">{category}</span>
                <span className="lesson-card__duration">⏱ {duration}</span>
            </div>

            {/* Content */}
            <h3 className="lesson-card__title">{title}</h3>
            <p className="lesson-card__desc">{description}</p>

            {/* Toggle button */}
            <button
                id={`lesson-toggle-${id}`}
                className={`btn lesson-card__btn ${completed ? 'lesson-card__btn--done' : 'btn-primary'}`}
                onClick={() => onToggle(id)}
                aria-pressed={completed}
            >
                {completed ? '✓ Completed' : 'Mark as Completed'}
            </button>
        </article>
    );
}

export default LessonCard;
