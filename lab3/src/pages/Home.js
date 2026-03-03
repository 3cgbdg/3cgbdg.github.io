import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
    {
        icon: '🎓',
        title: 'Expert Lessons',
        desc: '8 in-depth lessons crafted by professional photographers to guide you from beginner to pro.',
    },
    {
        icon: '🖼️',
        title: 'Inspiration Gallery',
        desc: 'Explore curated photos across portraits, landscapes, macro, and street categories.',
    },
    {
        icon: '📊',
        title: 'Track Your Progress',
        desc: 'See exactly where you stand. Mark lessons done and watch your progress bar grow.',
    },
];

function Home() {
    return (
        <main className="home page-wrapper">
            {/* Hero */}
            <section className="home__hero container">
                <div className="home__hero-badge fade-in-up">✨ Your Photography Journey Starts Here</div>
                <h1 className="home__hero-title fade-in-up">
                    Master the Art of<br />
                    <span className="gradient-text">Photography</span>
                </h1>
                <p className="home__hero-sub fade-in-up">
                    From composition rules to post-processing magic — learn professional techniques
                    at your own pace with structured lessons and a vibrant gallery.
                </p>
                <div className="home__hero-cta fade-in-up">
                    <Link to="/lessons" className="btn btn-primary" id="cta-start-learning">
                        📚 Start Learning
                    </Link>
                    <Link to="/gallery" className="btn btn-outline" id="cta-view-gallery">
                        🖼️ View Gallery
                    </Link>
                </div>

                {/* Floating decorations */}
                <div className="home__hero-deco home__hero-deco--1">📷</div>
                <div className="home__hero-deco home__hero-deco--2">🌅</div>
                <div className="home__hero-deco home__hero-deco--3">🔭</div>
            </section>

            {/* Stats bar */}
            <section className="home__stats container fade-in-up">
                <div className="home__stat">
                    <span className="home__stat-num">8</span>
                    <span className="home__stat-label">Lessons</span>
                </div>
                <div className="home__stat-divider" />
                <div className="home__stat">
                    <span className="home__stat-num">4</span>
                    <span className="home__stat-label">Categories</span>
                </div>
                <div className="home__stat-divider" />
                <div className="home__stat">
                    <span className="home__stat-num">12+</span>
                    <span className="home__stat-label">Gallery Photos</span>
                </div>
                <div className="home__stat-divider" />
                <div className="home__stat">
                    <span className="home__stat-num">100%</span>
                    <span className="home__stat-label">Free</span>
                </div>
            </section>

            {/* Features */}
            <section className="home__features container">
                <h2 className="section-title fade-in-up">Everything You Need</h2>
                <p className="section-subtitle fade-in-up">
                    A complete platform built to make you a better photographer.
                </p>

                <div className="home__features-grid">
                    {FEATURES.map((f, i) => (
                        <div
                            key={f.title}
                            className="home__feature-card glass-card fade-in-up"
                            id={`feature-card-${i + 1}`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="home__feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA band */}
            <section className="home__cta-band container fade-in-up">
                <div className="home__cta-band-inner glass-card">
                    <h2>Ready to pick up your camera?</h2>
                    <p>Jump into your first lesson — it only takes 25 minutes.</p>
                    <Link to="/lessons" className="btn btn-primary" id="cta-band-start">
                        🚀 Get Started Now
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default Home;
