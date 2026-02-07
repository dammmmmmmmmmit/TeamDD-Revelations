import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// SVG Icons
const Icons = {
    email: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    lock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    portal: (
        <svg width="80" height="80" viewBox="0 0 100 100" style={{ marginBottom: '1.5rem' }}>
            <defs>
                <linearGradient id="loginPortalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff0a54" />
                    <stop offset="50%" stopColor="#00f5d4" />
                    <stop offset="100%" stopColor="#9b5de5" />
                </linearGradient>
                <filter id="loginGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#loginPortalGrad)" strokeWidth="2" filter="url(#loginGlow)" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="15s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#loginPortalGrad)" strokeWidth="3" filter="url(#loginGlow)">
                <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="25" fill="none" stroke="url(#loginPortalGrad)" strokeWidth="2" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="12" fill="url(#loginPortalGrad)" opacity="0.9">
                <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
        </svg>
    )
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            const redirectPath = location.state?.from?.pathname ||
                (user.role === 'admin' ? '/admin' :
                    user.role === 'organizer' ? '/organizer' : '/student');

            navigate(redirectPath);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className={`auth-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
                {Icons.portal}

                <h1 className={`auth-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    ENTER PORTAL
                </h1>
                <p className="auth-subtitle">Access the Campus Flow dimension</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">EMAIL</label>
                        <div style={{ position: 'relative' }}>
                            {Icons.email}
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                style={{ paddingLeft: '3rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            {Icons.lock}
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ paddingLeft: '3rem' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-full btn-large ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Entering Portal...' : 'Enter'}
                    </button>
                </form>

                <p className="auth-switch">
                    New to the Flow? <Link to="/register">Create Portal Access</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
