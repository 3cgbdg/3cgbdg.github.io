import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

function Auth() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, login } = useAuth();
    const navigate = useNavigate();

    const isRegister = mode === 'register';

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (isRegister && password !== confirm) {
            return setError('Passwords do not match.');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters.');
        }

        setLoading(true);
        try {
            if (isRegister) {
                await signup(email, password);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err) {
            // Friendly error messages for common Firebase codes
            const code = err.code || '';
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (code === 'auth/email-already-in-use') {
                setError('That email is already registered. Try logging in.');
            } else if (code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    function toggleMode() {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError('');
        setPassword('');
        setConfirm('');
    }

    return (
        <main className="auth-page page-wrapper">
            <div className="auth-page__bg-deco auth-page__bg-deco--1">📸</div>
            <div className="auth-page__bg-deco auth-page__bg-deco--2">🌅</div>
            <div className="auth-page__bg-deco auth-page__bg-deco--3">🔭</div>

            <div className="container auth-page__container">
                <div className="auth-card glass-card fade-in-up">
                    {/* Logo / Title */}
                    <div className="auth-card__header">
                        <span className="auth-card__logo-icon">📸</span>
                        <h1 className="auth-card__title">
                            Photo<span className="gradient-text">Master</span>
                        </h1>
                        <p className="auth-card__subtitle">
                            {isRegister
                                ? 'Create an account to start your photography journey.'
                                : 'Welcome back! Sign in to continue learning.'}
                        </p>
                    </div>

                    {/* Mode toggle tabs */}
                    <div className="auth-card__tabs" role="tablist">
                        <button
                            id="tab-login"
                            role="tab"
                            aria-selected={!isRegister}
                            className={`auth-card__tab ${!isRegister ? 'auth-card__tab--active' : ''}`}
                            onClick={() => setMode('login')}
                        >
                            Login
                        </button>
                        <button
                            id="tab-register"
                            role="tab"
                            aria-selected={isRegister}
                            className={`auth-card__tab ${isRegister ? 'auth-card__tab--active' : ''}`}
                            onClick={() => setMode('register')}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form
                        id={isRegister ? 'form-register' : 'form-login'}
                        className="auth-card__form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/* Email */}
                        <div className="auth-field">
                            <label htmlFor="auth-email" className="auth-field__label">Email</label>
                            <input
                                id="auth-email"
                                type="email"
                                className="auth-field__input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label htmlFor="auth-password" className="auth-field__label">Password</label>
                            <input
                                id="auth-password"
                                type="password"
                                className="auth-field__input"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                        </div>

                        {/* Confirm password (register mode only) */}
                        {isRegister && (
                            <div className="auth-field fade-in-up">
                                <label htmlFor="auth-confirm" className="auth-field__label">Confirm Password</label>
                                <input
                                    id="auth-confirm"
                                    type="password"
                                    className="auth-field__input"
                                    placeholder="Repeat your password"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div id="auth-error" className="auth-card__error" role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="auth-submit"
                            type="submit"
                            className="btn btn-primary auth-card__submit"
                            disabled={loading}
                        >
                            {loading
                                ? '⏳ Please wait…'
                                : isRegister
                                    ? '🚀 Create Account'
                                    : '🔑 Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="auth-card__footer">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            id="auth-mode-toggle"
                            className="auth-card__toggle-btn"
                            onClick={toggleMode}
                            type="button"
                        >
                            {isRegister ? 'Sign in' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Auth;
