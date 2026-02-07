require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

if (!process.env.JWT_SECRET) {
    console.warn('[config] JWT_SECRET is not set; using an insecure dev default.');
    console.warn('[config] Create backend/.env and set JWT_SECRET to a strong value.');
    process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
}

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const themeRoutes = require('./routes/theme');
const chatRoutes = require('./routes/chat');

// Import models for Socket.IO
const Message = require('./models/Message');
const Registration = require('./models/Registration');
const Event = require('./models/Event');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Campus Flow API is running' });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    // Join an event's chat room
    socket.on('joinRoom', async (eventId) => {
        try {
            const event = await Event.findById(eventId);
            if (!event) {
                socket.emit('error', { message: 'Event not found' });
                return;
            }

            // Admin can access any room
            const isAdmin = socket.userRole === 'admin';
            const isOrganizer = event.organizerId.toString() === socket.userId;

            // Check if user is registered (and not banned)
            const registration = await Registration.findOne({
                userId: socket.userId,
                eventId: eventId
            });

            const isRegistered = registration && !registration.isBanned;
            const isBanned = registration && registration.isBanned;

            if (isBanned && !isAdmin) {
                socket.emit('error', { message: 'You are banned from this event chatroom' });
                return;
            }

            if (!isAdmin && !isOrganizer && !isRegistered) {
                socket.emit('error', { message: 'Not registered for this event' });
                return;
            }

            socket.join(eventId);
            socket.currentRoom = eventId;
            socket.isOrganizer = isOrganizer;
            socket.isAdmin = isAdmin;
            console.log(`User ${socket.userId} joined room ${eventId} (admin: ${isAdmin}, organizer: ${isOrganizer})`);

            // Notify room of join
            socket.to(eventId).emit('userJoined', { userId: socket.userId });
        } catch (err) {
            console.error('Join room error:', err);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Leave a chat room
    socket.on('leaveRoom', (eventId) => {
        socket.leave(eventId);
        socket.currentRoom = null;
        socket.to(eventId).emit('userLeft', { userId: socket.userId });
        console.log(`User ${socket.userId} left room ${eventId}`);
    });

    // Send a message
    socket.on('sendMessage', async ({ eventId, content }) => {
        try {
            if (!socket.currentRoom || socket.currentRoom !== eventId) {
                socket.emit('error', { message: 'Join the room first' });
                return;
            }

            // Check if user is banned (unless admin)
            if (!socket.isAdmin) {
                const registration = await Registration.findOne({
                    userId: socket.userId,
                    eventId: eventId
                });

                if (registration && registration.isBanned) {
                    socket.emit('error', { message: 'You are banned from this chatroom' });
                    return;
                }
            }

            const message = new Message({
                eventId,
                userId: socket.userId,
                content
            });

            await message.save();
            await message.populate('userId', 'name email');

            io.to(eventId).emit('newMessage', {
                _id: message._id,
                eventId: message.eventId,
                userId: message.userId,
                content: message.content,
                createdAt: message.createdAt
            });
        } catch (err) {
            console.error('Send message error:', err);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Delete a message (organizer or admin only)
    socket.on('deleteMessage', async ({ eventId, messageId }) => {
        try {
            const event = await Event.findById(eventId);
            const isOrganizer = event && event.organizerId.toString() === socket.userId;
            const isAdmin = socket.userRole === 'admin';

            if (!isOrganizer && !isAdmin) {
                socket.emit('error', { message: 'Only organizers and admins can delete messages' });
                return;
            }

            await Message.findByIdAndUpdate(messageId, { isDeleted: true });
            io.to(eventId).emit('messageDeleted', { messageId });
        } catch (err) {
            console.error('Delete message error:', err);
            socket.emit('error', { message: 'Failed to delete message' });
        }
    });

    // Ban a user from chatroom (organizer or admin only)
    socket.on('banUser', async ({ eventId, targetUserId }) => {
        try {
            const event = await Event.findById(eventId);
            const isOrganizer = event && event.organizerId.toString() === socket.userId;
            const isAdmin = socket.userRole === 'admin';

            if (!isOrganizer && !isAdmin) {
                socket.emit('error', { message: 'Only organizers and admins can ban users' });
                return;
            }

            // Cannot ban the organizer
            if (event.organizerId.toString() === targetUserId) {
                socket.emit('error', { message: 'Cannot ban the event organizer' });
                return;
            }

            // Update the registration
            const registration = await Registration.findOneAndUpdate(
                { userId: targetUserId, eventId: eventId },
                {
                    isBanned: true,
                    bannedAt: new Date(),
                    bannedBy: socket.userId
                },
                { new: true }
            );

            if (!registration) {
                socket.emit('error', { message: 'User is not registered for this event' });
                return;
            }

            // Notify the room
            io.to(eventId).emit('userBanned', {
                userId: targetUserId,
                bannedBy: socket.userId
            });

            // Kick the banned user from the room
            const bannedSocket = [...io.sockets.sockets.values()].find(
                s => s.userId === targetUserId && s.currentRoom === eventId
            );
            if (bannedSocket) {
                bannedSocket.leave(eventId);
                bannedSocket.currentRoom = null;
                bannedSocket.emit('kicked', { message: 'You have been banned from this chatroom' });
            }

            console.log(`User ${targetUserId} banned from ${eventId} by ${socket.userId}`);
        } catch (err) {
            console.error('Ban user error:', err);
            socket.emit('error', { message: 'Failed to ban user' });
        }
    });

    // Unban a user (organizer or admin only)
    socket.on('unbanUser', async ({ eventId, targetUserId }) => {
        try {
            const event = await Event.findById(eventId);
            const isOrganizer = event && event.organizerId.toString() === socket.userId;
            const isAdmin = socket.userRole === 'admin';

            if (!isOrganizer && !isAdmin) {
                socket.emit('error', { message: 'Only organizers and admins can unban users' });
                return;
            }

            await Registration.findOneAndUpdate(
                { userId: targetUserId, eventId: eventId },
                { isBanned: false, bannedAt: null, bannedBy: null }
            );

            io.to(eventId).emit('userUnbanned', { userId: targetUserId });
            console.log(`User ${targetUserId} unbanned from ${eventId} by ${socket.userId}`);
        } catch (err) {
            console.error('Unban user error:', err);
            socket.emit('error', { message: 'Failed to unban user' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Campus Flow API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Socket.IO ready for connections`);
});
