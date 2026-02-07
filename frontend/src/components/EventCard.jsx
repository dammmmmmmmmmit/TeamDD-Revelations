import { useTheme } from '../context/ThemeContext';

// SVG Icons
const Icons = {
    calendar: (
        <svg className="meta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    location: (
        <svg className="meta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    user: (
        <svg className="meta-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    arrow: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12,5 19,12 12,19" />
        </svg>
    )
};

// Category Icons with SVG
const CategoryIcons = {
    tech: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    ),
    cultural: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="5" />
            <path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    sports: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    ),
    workshop: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    ),
    seminar: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
    ),
    other: (
        <svg className="category-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    )
};

const EventCard = ({ event, onAction, actionLabel, showStatus = false }) => {
    const { theme } = useTheme();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'published': return 'status-published';
            case 'draft': return 'status-draft';
            case 'closed': return 'status-closed';
            default: return '';
        }
    };

    const getCategoryIcon = (category) => {
        return CategoryIcons[category] || CategoryIcons.other;
    };

    return (
        <div className={`event-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
            <div className="event-category">
                {getCategoryIcon(event.category)}
                <span className="category-name">{event.category}</span>
            </div>

            <h3 className={`event-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                {event.title}
            </h3>

            <p className="event-description">{event.description}</p>

            <div className="event-meta">
                <div className="meta-item">
                    {Icons.calendar}
                    <span>{formatDate(event.dateTime)}</span>
                </div>
                <div className="meta-item">
                    {Icons.location}
                    <span>{event.venue}</span>
                </div>
                {event.organizerId && (
                    <div className="meta-item">
                        {Icons.user}
                        <span>{event.organizerId.name}</span>
                    </div>
                )}
            </div>

            {showStatus && (
                <div className={`event-status ${getStatusClass(event.status)}`}>
                    <span className="status-dot"></span>
                    {event.status}
                </div>
            )}

            {onAction && (
                <button
                    onClick={() => onAction(event)}
                    className={`btn btn-primary btn-action ${theme.upsideDown ? 'btn-glitch' : ''}`}
                >
                    {actionLabel || 'View'}
                    {Icons.arrow}
                </button>
            )}
        </div>
    );
};

export default EventCard;
