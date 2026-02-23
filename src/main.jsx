// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Import router components
import App from './App.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx'; // Import AuthProvider and useAuth

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>; // Or a spinner
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter> {/* Wrap your app with BrowserRouter */}
            <AuthProvider>
                <Routes> {/* Define your routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <App />
                            </PrivateRoute>
                        }
                    />
                    {/* Add other potential routes here if needed */}
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);