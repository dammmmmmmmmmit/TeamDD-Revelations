import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import EventCard from '../../components/EventCard';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const response = await eventAPI.getMy();
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (eventId, newStatus) => {
        try {
            await eventAPI.updateStatus(eventId, newStatus);
            setEvents(prev => prev.map(e =>
                e._id === eventId ? { ...e, status: newStatus } : e
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'draft': return 'published';
            case 'published': return 'closed';
            default: return null;
        }
    };

    const getStatusAction = (status) => {
        switch (status) {
            case 'draft': return '🚀 Publish';
            case 'published': return '🔒 Close';
            default: return null;
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className={`page-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    🎭 Organizer Dashboard
                </h1>
                <p className="page-subtitle">Manage your events</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/organizer/create')}
                >
                    + Create New Event
                </button>
            </header>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your events...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <h3>No events created yet</h3>
                    <p>Start by creating your first event!</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/organizer/create')}
                    >
                        Create Event
                    </button>
                </div>
            ) : (
                <div className="events-table">
                    <div className="table-header">
                        <span>Event</span>
                        <span>Date</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>
                    {events.map(event => (
                        <div key={event._id} className={`table-row ${theme.upsideDown ? 'glitch-row' : ''}`}>
                            <div className="event-info">
                                <h4>{event.title}</h4>
                                <span className="event-category">{event.category}</span>
                            </div>
                            <div className="event-date">
                                {new Date(event.dateTime).toLocaleDateString()}
                            </div>
                            <div className={`event-status status-${event.status}`}>
                                {event.status}
                            </div>
                            <div className="event-actions">
                                {getNextStatus(event.status) && (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleStatusChange(event._id, getNextStatus(event.status))}
                                    >
                                        {getStatusAction(event.status)}
                                    </button>
                                )}
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => navigate(`/organizer/participants/${event._id}`)}
                                >
                                    👥 Participants
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
