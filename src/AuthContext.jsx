// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { setAuthToken, getAuthToken, authService } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    //const navigate = useNavigate(); // Get the navigate function

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            // In a production app, you'd send this token to a backend endpoint
            // (e.g., /api/auth/validate) to verify its validity and expiration
            // For now, we'll assume a stored token means authenticated.
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            await authService.login(username, password);
            setIsAuthenticated(true);
           // navigate('/'); // Redirect to home on successful login
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        //navigate('/login'); // Redirect to login page on logout
        // The PrivateRoute or other components will handle redirecting to /login
        // after isAuthenticated becomes false.
    };

    const value = {
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};