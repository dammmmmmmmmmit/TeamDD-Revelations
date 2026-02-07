import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import EventChat from '../../components/EventChat';

/**
 * ChatRoom Page
 * Dedicated page for a single event's chatroom.
 */
const ChatRoom = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/events/${eventId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvent(data);
            }
        } catch (err) {
            console.error('Failed to fetch event:', err);
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        padding: '24px',
        maxWidth: '900px',
        margin: '0 auto'
    };

    const backBtnStyle = {
        background: 'transparent',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        padding: '8px 0',
        marginBottom: '16px',
        fontSize: '14px'
    };

    const headerStyle = {
        marginBottom: '20px'
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '8px'
    };

    const metaStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <button onClick={() => navigate(-1)} style={backBtnStyle}>
                ← Back
            </button>

            {event && (
                <div style={headerStyle}>
                    <h1 style={titleStyle}>{event.title}</h1>
                    <p style={metaStyle}>
                        📅 {new Date(event.dateTime).toLocaleDateString()} • 📍 {event.venue}
                    </p>
                </div>
            )}

            <EventChat eventId={eventId} />
        </div>
    );
};

export default ChatRoom;
