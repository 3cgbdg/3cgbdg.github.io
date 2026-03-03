import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/lessons', label: 'Lessons', icon: '📚', end: false },
    // Gallery and Progress are protected — shown only when logged in (see below)
];

const PROTECTED_LINKS = [
    { to: '/gallery', label: 'Gallery', icon: '🖼️', end: false },
    { to: '/progress', label: 'My Progress', icon: '📊', end: false },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(prev => !prev);
    const closeMenu = () => setMenuOpen(false);

    async function handleLogout() {
        closeMenu();
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    // All nav links visible when logged in; only public ones when not
    const visibleLinks = currentUser
        ? [...NAV_LINKS, ...PROTECTED_LINKS]
        : NAV_LINKS;

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
                    {visibleLinks.map(({ to, label, icon, end }) => (
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

                {/* Auth section (desktop) */}
                <div className="navbar__auth">
                    {currentUser ? (
                        <>
                            <span className="navbar__user-email" id="navbar-user-email" title={currentUser.email}>
                                👤 {currentUser.email}
                            </span>
                            <button
                                id="navbar-logout-btn"
                                className="btn btn-outline navbar__logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/auth"
                            id="nav-login"
                            className="btn btn-primary navbar__login-btn"
                        >
                            🔑 Login
                        </NavLink>
                    )}
                </div>

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
                {visibleLinks.map(({ to, label, icon, end }) => (
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

                {/* Auth in mobile drawer */}
                <div className="navbar__mobile-auth">
                    {currentUser ? (
                        <>
                            <span className="navbar__mobile-user">{currentUser.email}</span>
                            <button
                                id="navbar-mobile-logout"
                                className="btn btn-outline navbar__mobile-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink
                            to="/auth"
                            id="nav-mobile-login"
                            className="btn btn-primary"
                            onClick={closeMenu}
                        >
                            🔑 Login
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
