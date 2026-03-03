import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
    return useContext(AuthContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // true until Firebase resolves auth state

    // Register a new user with email + password
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Sign in an existing user
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Sign out the current user
    function logout() {
        return signOut(auth);
    }

    // Subscribe to Firebase auth state changes on mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        // Cleanup on unmount
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading,
    };

    // Don't render children until auth state is determined (avoids flash)
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
