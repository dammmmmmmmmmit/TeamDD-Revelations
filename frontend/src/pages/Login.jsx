import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import vecnaImage from '../assets/vecna.jpg';

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
        <svg width="60" height="60" viewBox="0 0 100 100" style={{ marginBottom: '1rem' }}>
            <defs>
                <linearGradient id="loginPortalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B0000" />
                    <stop offset="50%" stopColor="#DC143C" />
                    <stop offset="100%" stopColor="#ff0a0a" />
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
            <circle cx="50" cy="50" r="12" fill="url(#loginPortalGrad)" opacity="0.9">
                <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
            </circle>
        </svg>
    )
};

// Animated Eyes Component for Vecna
const VecnaEyes = ({ mouseX, mouseY }) => {
    // Calculate eye movement based on mouse position
    const eyeMoveX = typeof window !== 'undefined'
        ? ((mouseX / window.innerWidth) - 0.5) * 8
        : 0;
    const eyeMoveY = typeof window !== 'undefined'
        ? ((mouseY / window.innerHeight) - 0.5) * 4
        : 0;

    const eyeContainerStyle = {
        position: 'absolute',
        top: '38%',
        left: '48%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '165px',
        zIndex: 10
    };

    const eyeSocketStyle = {
        width: '35px',
        height: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 15px rgba(185, 14, 10, 0.8), inset 0 0 10px rgba(0, 0, 0, 1)'
    };

    const pupilStyle = {
        width: '12px',
        height: '12px',
        backgroundColor: '#ff0a0a',
        borderRadius: '50%',
        boxShadow: '0 0 10px #ff0a0a, 0 0 20px #ff0a0a'
    };

    return (
        <div style={eyeContainerStyle}>
            <div style={eyeSocketStyle}>
                <motion.div
                    style={pupilStyle}
                    animate={{ x: eyeMoveX, y: eyeMoveY }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
            <div style={eyeSocketStyle}>
                <motion.div
                    style={pupilStyle}
                    animate={{ x: eyeMoveX, y: eyeMoveY }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>
        </div>
    );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    const handleMouseMove = (e) => {
        setMouseX(e.clientX);
        setMouseY(e.clientY);
    };

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

    // Styles
    const containerStyle = {
        display: 'flex',
        minHeight: '100vh',
        background: 'transparent'
    };

    const leftPanelStyle = {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: 'transparent'
    };

    const rightPanelStyle = {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    const vecnaContainerStyle = {
        position: 'relative',
        width: '100%',
        height: '100%'
    };

    const vecnaImageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.8) contrast(1.1)'
    };

    const cardStyle = {
        background: 'rgba(21, 21, 21, 0.9)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(185, 14, 10, 0.2)'
    };

    return (
        <div style={containerStyle} onMouseMove={handleMouseMove}>
            {/* Left Panel - Login Form */}
            <div style={leftPanelStyle}>
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center' }}>
                        {Icons.portal}
                    </div>

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

            {/* Right Panel - Vecna Image with Animated Eyes */}
            <div style={rightPanelStyle}>
                <div style={vecnaContainerStyle}>
                    <img src={vecnaImage} alt="Vecna" style={vecnaImageStyle} />
                    <VecnaEyes mouseX={mouseX} mouseY={mouseY} />
                </div>
            </div>
        </div>
    );
};

export default Login;
