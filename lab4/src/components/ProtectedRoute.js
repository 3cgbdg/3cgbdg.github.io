import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Wraps a route element so that only authenticated users can access it.
 * Unauthenticated visitors are redirected to /auth (login/register page).
 */
function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;
