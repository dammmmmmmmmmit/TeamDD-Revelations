import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// SVG Icons for Stranger Things theme
const Icons = {
    events: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="12" cy="16" r="2" />
        </svg>
    ),
    myEvents: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            <path d="M12 7v4" />
            <path d="M10 9h4" />
        </svg>
    ),
    dashboard: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    create: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    admin: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    ),
    portal: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
        </svg>
    ),
    upsideDown: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    ),
    logout: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    chat: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
};

// Decorative Portal SVG
const PortalSVG = () => (
    <svg width="42" height="42" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <defs>
            <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0a54" />
                <stop offset="50%" stopColor="#00f5d4" />
                <stop offset="100%" stopColor="#9b5de5" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#portalGrad)" strokeWidth="3" filter="url(#glow)">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="35" fill="none" stroke="url(#portalGrad)" strokeWidth="2" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="25" fill="none" stroke="url(#portalGrad)" strokeWidth="1.5" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="8" fill="url(#portalGrad)" opacity="0.8">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        </circle>
    </svg>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/admin';
            case 'organizer': return '/organizer';
            default: return '/student';
        }
    };

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className="navbar">
            <Link to={getDashboardLink()} className="navbar-brand">
                <PortalSVG />
                <span className={`logo-text ${theme.upsideDown ? 'upside-down-text' : ''}`}>
                    CAMPUS FLOW
                </span>
                {theme.upsideDown && (
                    <span className="upside-indicator">
                        {Icons.upsideDown}
                        UPSIDE DOWN
                    </span>
                )}
            </Link>

            <div className="navbar-links">
                {user ? (
                    <>
                        {user.role === 'student' && (
                            <>
                                <Link to="/student" className={isActive('/student') && !location.pathname.includes('my-events') ? 'active' : ''}>
                                    {Icons.events}
                                    <span>Events</span>
                                </Link>
                                <Link to="/student/my-events" className={isActive('/student/my-events') ? 'active' : ''}>
                                    {Icons.myEvents}
                                    <span>My Events</span>
                                </Link>
                                <Link to="/student/chat" className={isActive('/student/chat') ? 'active' : ''}>
                                    {Icons.chat}
                                    <span>Chat Rooms</span>
                                </Link>
                            </>
                        )}
                        {user.role === 'organizer' && (
                            <>
                                <Link to="/organizer" className={isActive('/organizer') && !location.pathname.includes('create') ? 'active' : ''}>
                                    {Icons.dashboard}
                                    <span>Dashboard</span>
                                </Link>
                                <Link to="/organizer/create" className={isActive('/organizer/create') ? 'active' : ''}>
                                    {Icons.create}
                                    <span>Create Event</span>
                                </Link>
                                <Link to="/organizer/chat" className={isActive('/organizer/chat') ? 'active' : ''}>
                                    {Icons.chat}
                                    <span>Chat Rooms</span>
                                </Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
                                    {Icons.admin}
                                    <span>Control Panel</span>
                                </Link>
                                <Link to="/admin/chat" className={isActive('/admin/chat') ? 'active' : ''}>
                                    {Icons.chat}
                                    <span>All Chat Rooms</span>
                                </Link>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                            {Icons.portal}
                            <span>Enter Portal</span>
                        </Link>
                        <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                            {Icons.create}
                            <span>Join Flow</span>
                        </Link>
                    </>
                )}
            </div>

            {user && (
                <div className="user-info">
                    <div className="user-avatar">{getInitials(user.name)}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-logout">
                        {Icons.logout}
                        <span>Exit Portal</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
