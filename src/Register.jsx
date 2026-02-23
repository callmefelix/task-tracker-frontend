import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from './api';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.register(username, password);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Registration failed. Username may already exist.');
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: 400,
            margin: '50px auto',
            padding: 20,
            border: '1px solid #ccc',
            borderRadius: 8
        }}>
            <h2>Register</h2>
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
            {success && (
                <div style={{
                    padding: 12,
                    marginBottom: 15,
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: 4,
                    color: '#155724'
                }}>
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
                <input
                    type="text"
                    placeholder="Username (min 3 characters)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        background: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p style={{ marginTop: 15, textAlign: 'center' }}>
                Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login here</Link>
            </p>
        </div>
    );
}

export default Register;
