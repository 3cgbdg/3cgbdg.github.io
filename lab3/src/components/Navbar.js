import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/lessons', label: 'Lessons', icon: '📚', end: false },
    { to: '/gallery', label: 'Gallery', icon: '🖼️', end: false },
    { to: '/progress', label: 'My Progress', icon: '📊', end: false },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">
            <div className="navbar__inner container">
                {/* Logo */}
                <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
                    <span className="navbar__logo-icon">📸</span>
                    <span className="navbar__logo-text">
                        Photo<span className="navbar__logo-accent">Master</span>
                    </span>
                </NavLink>

                {/* Desktop nav */}
                <nav className="navbar__links" aria-label="Main navigation">
                    {NAV_LINKS.map(({ to, label, icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                            }
                        >
                            <span className="navbar__link-icon">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Hamburger */}
                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Mobile drawer */}
            <nav
                className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
                aria-label="Mobile navigation"
            >
                {NAV_LINKS.map(({ to, label, icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                        }
                        onClick={closeMenu}
                    >
                        <span>{icon}</span> {label}
                    </NavLink>
                ))}
            </nav>
        </header>
    );
}

export default Navbar;
