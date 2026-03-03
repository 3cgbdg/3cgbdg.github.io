import React from 'react';
import './ProgressBar.css';

function ProgressBar({ completed, total }) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Colour shifts red → yellow → green
    const hue = Math.round((pct / 100) * 120); // 0° red → 120° green
    const barColor = `hsl(${hue}, 80%, 55%)`;

    return (
        <div className="progress-bar-wrapper" id="progress-bar">
            <div className="progress-bar-header">
                <span className="progress-bar-label">Course Progress</span>
                <span className="progress-bar-pct" style={{ color: barColor }}>
                    {pct}%
                </span>
            </div>

            {/* Track */}
            <div className="progress-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, hsl(${hue - 20},80%,50%), ${barColor})`,
                        boxShadow: `0 0 12px ${barColor}66`,
                    }}
                />
            </div>

            <p className="progress-bar-sub">
                {completed} of {total} lessons completed
            </p>
        </div>
    );
}

export default ProgressBar;
