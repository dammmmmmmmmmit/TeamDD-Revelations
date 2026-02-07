import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, registrationAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await eventAPI.getById(id);
            setEvent(response.data);
        } catch (error) {
            console.error('Failed to fetch event:', error);
            setMessage({ type: 'error', text: 'Event not found' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setRegistering(true);
        setMessage({ type: '', text: '' });

        try {
            await registrationAPI.register(id);
            setMessage({ type: 'success', text: '🎉 Successfully registered!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Registration failed'
            });
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading event...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <span className="empty-icon">😕</span>
                    <h3>Event not found</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/student')}>
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <button className="btn btn-back" onClick={() => navigate('/student')}>
                ← Back to Events
            </button>

            <div className={`event-details-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
                <div className="event-header">
                    <span className="event-category-badge">{event.category}</span>
                    <span className={`event-status-badge status-${event.status}`}>
                        {event.status}
                    </span>
                </div>

                <h1 className={`event-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    {event.title}
                </h1>

                <div className="event-info-grid">
                    <div className="info-item">
                        <span className="info-icon">📅</span>
                        <div>
                            <span className="info-label">Date & Time</span>
                            <span className="info-value">{formatDate(event.dateTime)}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="info-icon">📍</span>
                        <div>
                            <span className="info-label">Venue</span>
                            <span className="info-value">{event.venue}</span>
                        </div>
                    </div>

                    {event.organizerId && (
                        <div className="info-item">
                            <span className="info-icon">👤</span>
                            <div>
                                <span className="info-label">Organized by</span>
                                <span className="info-value">{event.organizerId.name}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="event-description-full">
                    <h3>About this event</h3>
                    <p>{event.description}</p>
                </div>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {event.status === 'published' && (
                    <button
                        className={`btn btn-primary btn-large ${registering ? 'loading' : ''}`}
                        onClick={handleRegister}
                        disabled={registering}
                    >
                        {registering ? 'Registering...' : '🎫 Register Now'}
                    </button>
                )}

                {event.status === 'closed' && (
                    <div className="closed-notice">
                        ⚠️ Registration for this event is closed
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
