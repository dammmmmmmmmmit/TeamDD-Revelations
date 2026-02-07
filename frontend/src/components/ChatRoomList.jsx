import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ChatRoomList Component
 * Shows all chat rooms the user has access to based on their role.
 * - Students: events they're registered for
 * - Organizers: events they organize
 * - Admins: all events
 */
const ChatRoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            console.log('Fetching rooms from:', `${apiUrl}/chat/my-rooms`);

            const response = await fetch(`${apiUrl}/chat/my-rooms`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Rooms data:', data);
                setRooms(data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                setError(errorData.message || `Failed to load chat rooms (${response.status})`);
            }
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
            setError(`Network error: ${err.message}`);
        } finally {
            setLoading(false);
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

    // Styles
    const containerStyle = {
        padding: '24px'
    };

    const headerStyle = {
        marginBottom: '24px'
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '8px'
    };

    const subtitleStyle = {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
    };

    const cardStyle = {
        background: 'rgba(21, 21, 21, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    };

    const cardTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: 'white',
        marginBottom: '8px'
    };

    const cardMetaStyle = {
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: '4px'
    };

    const badgeStyle = {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        backgroundColor: 'rgba(255, 10, 84, 0.2)',
        color: '#ff0a54',
        marginTop: '12px'
    };

    const emptyStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        color: 'rgba(255, 255, 255, 0.5)'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
                    Loading chat rooms...
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>💬 Chat Rooms</h2>
                <p style={subtitleStyle}>
                    {user?.role === 'admin' ? 'All event chat rooms' :
                        user?.role === 'organizer' ? 'Chat rooms for your events' :
                            'Chat rooms for events you\'ve joined'}
                </p>
            </div>

            {error && (
                <div style={{ padding: '12px', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: '8px', color: '#ff6666', marginBottom: '16px' }}>
                    {error}
                </div>
            )}

            {rooms.length === 0 ? (
                <div style={emptyStyle}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <h3 style={{ marginBottom: '8px', color: 'white' }}>No chat rooms yet</h3>
                    <p>
                        {user?.role === 'student'
                            ? 'Register for events to join their chat rooms!'
                            : 'Create events to start chatting with participants!'}
                    </p>
                </div>
            ) : (
                <div style={gridStyle}>
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            style={cardStyle}
                            onClick={() => navigate(`/chat/${room._id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 10, 84, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={cardTitleStyle}>{room.title}</div>
                            <div style={cardMetaStyle}>📅 {formatDate(room.dateTime)}</div>
                            <div style={cardMetaStyle}>👤 {room.organizer}</div>
                            <span style={badgeStyle}>{room.category}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatRoomList;
