import React, { useState } from 'react';
import GalleryItem from '../components/GalleryItem';
import galleryData from '../data/gallery';
import './Gallery.css';

const CATEGORIES = ['all', 'portrait', 'landscape', 'macro', 'street'];

const CATEGORY_LABELS = {
    all: '🌐 All',
    portrait: '🤳 Portraits',
    landscape: '🌄 Landscapes',
    macro: '🔬 Macro',
    street: '🏙️ Street',
};

function Gallery() {
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered =
        activeFilter === 'all'
            ? galleryData
            : galleryData.filter(item => item.category === activeFilter);

    return (
        <main className="gallery page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="gallery__header fade-in-up">
                    <h1>
                        🖼️ <span className="gradient-text">Gallery</span>
                    </h1>
                    <p className="gallery__subtitle">
                        Explore stunning photography across every style and subject.
                    </p>
                </div>

                {/* Filter bar */}
                <div className="gallery__filters fade-in-up" role="group" aria-label="Gallery category filters">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            id={`filter-${cat}`}
                            className={`gallery__filter-btn ${activeFilter === cat ? 'gallery__filter-btn--active' : ''}`}
                            onClick={() => setActiveFilter(cat)}
                            aria-pressed={activeFilter === cat}
                        >
                            {CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <p className="gallery__count fade-in-up">
                    Showing <strong>{filtered.length}</strong> photo{filtered.length !== 1 ? 's' : ''}
                    {activeFilter !== 'all' ? ` in "${CATEGORY_LABELS[activeFilter]}"` : ''}
                </p>

                {/* Grid */}
                <div className="gallery__grid" id="gallery-grid">
                    {filtered.map(item => (
                        <GalleryItem key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Gallery;
