import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import EventCard from '../../components/EventCard';

const StudentHome = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', date: '' });
    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        try {
            const params = {};
            if (filter.category) params.category = filter.category;
            if (filter.date) params.date = filter.date;

            const response = await eventAPI.getAll(params);
            let eventData = response.data;

            // Shuffle events if upside down mode
            if (theme.upsideDown) {
                eventData = [...eventData].sort(() => Math.random() - 0.5);
            }

            setEvents(eventData);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewEvent = (event) => {
        navigate(`/student/event/${event._id}`);
    };

    const categories = ['tech', 'cultural', 'sports', 'workshop', 'seminar', 'other'];

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className={`page-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    {theme.upsideDown ? '🔮 THE UPSIDE DOWN 🔮' : '📅 Campus Events'}
                </h1>
                <p className="page-subtitle">
                    {theme.upsideDown
                        ? 'Things are not what they seem...'
                        : 'Discover and register for exciting events'}
                </p>
            </header>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={filter.date}
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                    />
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => setFilter({ category: '', date: '' })}
                >
                    Clear Filters
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No events found</h3>
                    <p>Check back later for new events!</p>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            onAction={handleViewEvent}
                            actionLabel="View Details"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentHome;
