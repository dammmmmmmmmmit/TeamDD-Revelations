import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import EventCard from '../../components/EventCard';

const MyEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const fetchMyRegistrations = async () => {
        try {
            const response = await registrationAPI.getMy();
            setRegistrations(response.data);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRegistration = async (eventId) => {
        if (!confirm('Are you sure you want to cancel this registration?')) return;

        try {
            await registrationAPI.cancel(eventId);
            setRegistrations(prev => prev.filter(r => r.event._id !== eventId));
        } catch (error) {
            console.error('Failed to cancel registration:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className={`page-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    🎫 My Registrations
                </h1>
                <p className="page-subtitle">Events you've registered for</p>
            </header>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your events...</p>
                </div>
            ) : registrations.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <h3>No registrations yet</h3>
                    <p>Explore and register for events to see them here!</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/student')}
                    >
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="registrations-list">
                    {registrations.map(({ registrationId, registeredAt, event }) => (
                        <div key={registrationId} className={`registration-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
                            <div className="registration-info">
                                <span className="registered-at">
                                    Registered: {formatDate(registeredAt)}
                                </span>
                                <span className={`event-status status-${event.status}`}>
                                    {event.status}
                                </span>
                            </div>

                            <EventCard
                                event={event}
                                showStatus={false}
                            />

                            <div className="registration-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => navigate(`/student/event/${event._id}`)}
                                >
                                    View Details
                                </button>
                                {event.status !== 'closed' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleCancelRegistration(event._id)}
                                    >
                                        Cancel Registration
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
