import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * EventChat Component
 * Real-time chat for event participants with moderator controls.
 */
const EventChat = ({ eventId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState('');
    const [participants, setParticipants] = useState([]);
    const [showParticipants, setShowParticipants] = useState(false);
    const [access, setAccess] = useState({ hasAccess: false, isOrganizer: false, isAdmin: false, canModerate: false });
    const messagesEndRef = useRef(null);
    const { user, token } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check access and initialize socket
    useEffect(() => {
        if (!token || !eventId) return;

        checkAccess();

        const newSocket = io(SOCKET_URL, {
            auth: { token }
        });

        newSocket.on('connect', () => {
            setConnected(true);
            newSocket.emit('joinRoom', eventId);
        });

        newSocket.on('disconnect', () => setConnected(false));
        newSocket.on('error', (data) => setError(data.message));
        newSocket.on('newMessage', (message) => setMessages(prev => [...prev, message]));
        newSocket.on('messageDeleted', ({ messageId }) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        });
        newSocket.on('userBanned', ({ userId }) => {
            setMessages(prev => prev.map(m =>
                m.userId?._id === userId ? { ...m, userBanned: true } : m
            ));
        });
        newSocket.on('kicked', ({ message }) => {
            setError(message);
            setConnected(false);
        });

        setSocket(newSocket);
        fetchMessages();

        return () => {
            newSocket.emit('leaveRoom', eventId);
            newSocket.disconnect();
        };
    }, [token, eventId]);

    const checkAccess = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/chat/${eventId}/access`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAccess(data);
            }
        } catch (err) {
            console.error('Failed to check access:', err);
        }
    };

    const fetchMessages = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/chat/${eventId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/chat/${eventId}/participants`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setParticipants(data);
            }
        } catch (err) {
            console.error('Failed to fetch participants:', err);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !connected) return;
        socket.emit('sendMessage', { eventId, content: newMessage.trim() });
        setNewMessage('');
    };

    const handleDeleteMessage = (messageId) => {
        if (!socket || !connected || !access.canModerate) return;
        socket.emit('deleteMessage', { eventId, messageId });
    };

    const handleBanUser = (userId) => {
        if (!socket || !connected || !access.canModerate) return;
        if (window.confirm('Are you sure you want to ban this user from the chatroom?')) {
            socket.emit('banUser', { eventId, targetUserId: userId });
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await fetch(`${apiUrl}/chat/${eventId}/ban/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchParticipants();
        } catch (err) {
            console.error('Failed to unban user:', err);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
    };

    const headerStyle = {
        padding: '12px 16px',
        backgroundColor: 'rgba(139, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const statusDotStyle = {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: connected ? '#00ff88' : '#ff4444',
        marginRight: '8px'
    };

    const messagesContainerStyle = {
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    };

    const messageStyle = (isOwn) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        alignSelf: isOwn ? 'flex-end' : 'flex-start'
    });

    const messageBubbleStyle = (isOwn) => ({
        backgroundColor: isOwn ? 'rgba(139, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        padding: '10px 14px',
        borderRadius: '12px'
    });

    const inputContainerStyle = {
        padding: '12px 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '12px'
    };

    const inputStyle = {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '10px 16px',
        color: 'white',
        fontSize: '14px'
    };

    const btnStyle = {
        backgroundColor: '#8B0000',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    const participantsPanelStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '280px',
        height: '100%',
        backgroundColor: 'rgba(21, 21, 21, 0.98)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px',
        overflowY: 'auto',
        zIndex: 10
    };

    if (access.isBanned) {
        return (
            <div style={{ ...containerStyle, justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', color: '#ff6666' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                    <p>You have been banned from this chatroom</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ ...containerStyle, position: 'relative' }}>
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={statusDotStyle} />
                    <span style={{ fontWeight: 'bold', color: 'white' }}>Event Chat</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {access.canModerate && (
                        <span style={{ fontSize: '12px', color: '#00ff88' }}>
                            {access.isAdmin ? '👑 Admin' : '🛡️ Moderator'}
                        </span>
                    )}
                    {access.canModerate && (
                        <button
                            onClick={() => { setShowParticipants(!showParticipants); if (!showParticipants) fetchParticipants(); }}
                            style={{ ...btnStyle, padding: '6px 12px', fontSize: '12px' }}
                        >
                            👥 Participants
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div style={{ padding: '8px 16px', backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#ff6666' }}>
                    {error}
                </div>
            )}

            <div style={messagesContainerStyle}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', marginTop: '20px' }}>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.userId?._id === user?.id || msg.userId === user?.id;
                        return (
                            <div key={msg._id} style={messageStyle(isOwn)}>
                                <div style={messageBubbleStyle(isOwn)}>
                                    <div style={{ color: 'white' }}>{msg.content}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span>{msg.userId?.name || 'Unknown'}</span>
                                    <span>{formatTime(msg.createdAt)}</span>
                                    {access.canModerate && !isOwn && (
                                        <>
                                            <button onClick={() => handleDeleteMessage(msg._id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '11px' }}>
                                                Delete
                                            </button>
                                            <button onClick={() => handleBanUser(msg.userId?._id)} style={{ background: 'none', border: 'none', color: '#ff8800', cursor: 'pointer', fontSize: '11px' }}>
                                                Ban
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={inputContainerStyle}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={inputStyle}
                    disabled={!connected}
                />
                <button type="submit" style={btnStyle} disabled={!connected || !newMessage.trim()}>
                    Send
                </button>
            </form>

            {/* Participants Panel */}
            {showParticipants && (
                <div style={participantsPanelStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h4 style={{ color: 'white', margin: 0 }}>Participants</h4>
                        <button onClick={() => setShowParticipants(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                    </div>
                    {participants.map((p) => (
                        <div key={p.userId} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'white', fontSize: '14px' }}>{p.name}</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{p.email}</div>
                                {p.isBanned && <span style={{ color: '#ff4444', fontSize: '10px' }}>BANNED</span>}
                            </div>
                            {!p.isBanned ? (
                                <button onClick={() => handleBanUser(p.userId)} style={{ background: 'rgba(255,0,0,0.2)', border: 'none', color: '#ff4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                    Ban
                                </button>
                            ) : (
                                <button onClick={() => handleUnbanUser(p.userId)} style={{ background: 'rgba(0,255,0,0.2)', border: 'none', color: '#00ff88', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                    Unban
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventChat;
