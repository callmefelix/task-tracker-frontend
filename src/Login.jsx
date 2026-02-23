// src/Login.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Use useEffect to handle navigation after isAuthenticated state changes
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]); // Depend on isAuthenticated and navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            // isAuthenticated will become true, and the useEffect above will navigate
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            console.error("Login component error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h2>Login</h2>
            {error && (
                <div style={{
                    padding: 12,
                    marginBottom: 15,
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: 4,
                    color: '#721c24'
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: 10,
                        borderRadius: 4,
                        border: 'none',
                        background: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ marginTop: 15, textAlign: 'center' }}>
                Don't have an account? <Link to="/register" style={{ color: '#007bff' }}>Register here</Link>
            </p>
        </div>
    );
}

export default Login;