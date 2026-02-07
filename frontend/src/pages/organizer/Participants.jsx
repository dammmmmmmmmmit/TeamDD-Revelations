import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const Participants = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [eventRes, participantsRes] = await Promise.all([
                eventAPI.getById(id),
                eventAPI.getParticipants(id)
            ]);
            setEvent(eventRes.data);
            setParticipants(participantsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading participants...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <button className="btn btn-back" onClick={() => navigate('/organizer')}>
                ← Back to Dashboard
            </button>

            <div className={`participants-card ${theme.upsideDown ? 'glitch-card' : ''}`}>
                <header className="participants-header">
                    <h1 className={theme.upsideDown ? 'glitch-text' : ''}>
                        👥 Participants
                    </h1>
                    {event && (
                        <div className="event-summary">
                            <h3>{event.title}</h3>
                            <span className={`status-badge status-${event.status}`}>
                                {event.status}
                            </span>
                        </div>
                    )}
                </header>

                <div className="participants-stats">
                    <div className="stat-card">
                        <span className="stat-value">{participants.length}</span>
                        <span className="stat-label">Total Registered</span>
                    </div>
                </div>

                {participants.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">👤</span>
                        <h3>No participants yet</h3>
                        <p>Share your event to get registrations!</p>
                    </div>
                ) : (
                    <div className="participants-table">
                        <div className="table-header">
                            <span>#</span>
                            <span>Name</span>
                            <span>Email</span>
                            <span>Registered At</span>
                        </div>
                        {participants.map((participant, index) => (
                            <div key={participant.id} className="table-row">
                                <span className="row-number">{index + 1}</span>
                                <span className="participant-name">{participant.name}</span>
                                <span className="participant-email">{participant.email}</span>
                                <span className="participant-date">
                                    {formatDate(participant.registeredAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Participants;
