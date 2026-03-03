import React from 'react';
import './GalleryItem.css';

function GalleryItem({ id, title, category, gradient, icon }) {
    return (
        <figure
            className="gallery-item"
            id={`gallery-item-${id}`}
            role="img"
            aria-label={title}
        >
            {/* Gradient image placeholder */}
            <div
                className="gallery-item__image"
                style={{ background: gradient }}
            >
                <span className="gallery-item__icon">{icon}</span>

                {/* Hover overlay */}
                <div className="gallery-item__overlay">
                    <span className="gallery-item__overlay-title">{title}</span>
                    <span className="gallery-item__overlay-cat">{category}</span>
                </div>
            </div>

            <figcaption className="gallery-item__caption">{title}</figcaption>
        </figure>
    );
}

export default GalleryItem;
