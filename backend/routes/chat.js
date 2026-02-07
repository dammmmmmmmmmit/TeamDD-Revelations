const express = require('express');
const Message = require('../models/Message');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/my-rooms - Get all chat rooms for the current user
// IMPORTANT: This must be defined BEFORE /:eventId routes to avoid matching issues
router.get('/my-rooms', auth, async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';

        let events;
        if (isAdmin) {
            // Admin can see all events
            events = await Event.find({ status: 'published' })
                .populate('organizerId', 'name email')
                .sort({ dateTime: -1 });
        } else if (req.user.role === 'organizer') {
            // Organizer sees their events
            events = await Event.find({ organizerId: req.user._id })
                .populate('organizerId', 'name email')
                .sort({ dateTime: -1 });
        } else {
            // Student sees events they're registered for (not banned)
            const registrations = await Registration.find({
                userId: req.user._id,
                isBanned: false
            });
            const eventIds = registrations.map(r => r.eventId);
            events = await Event.find({ _id: { $in: eventIds } })
                .populate('organizerId', 'name email')
                .sort({ dateTime: -1 });
        }

        res.json(events.map(e => ({
            _id: e._id,
            title: e.title,
            category: e.category,
            dateTime: e.dateTime,
            organizer: e.organizerId?.name
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/chat/:eventId/messages - Get message history for an event
router.get('/:eventId/messages', auth, async (req, res) => {
    try {
        const { eventId } = req.params;
        const { limit = 50, before } = req.query;

        // Verify user has access to this event's chat
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizerId.toString() === req.user._id.toString();
        const registration = await Registration.findOne({
            userId: req.user._id,
            eventId: eventId
        });

        const isRegistered = registration && !registration.isBanned;

        if (!isAdmin && !isOrganizer && !isRegistered) {
            return res.status(403).json({ message: 'Not registered for this event' });
        }

        // Build query
        const query = { eventId, isDeleted: false };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        // Return messages in chronological order
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/chat/:eventId/access - Check if user has access to chat
router.get('/:eventId/access', auth, async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizerId.toString() === req.user._id.toString();
        const registration = await Registration.findOne({
            userId: req.user._id,
            eventId: eventId
        });

        const isRegistered = registration && !registration.isBanned;
        const isBanned = registration && registration.isBanned;

        res.json({
            hasAccess: isAdmin || isOrganizer || isRegistered,
            isOrganizer,
            isAdmin,
            isBanned,
            canModerate: isAdmin || isOrganizer
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/chat/:eventId/participants - Get all participants for a chat room
router.get('/:eventId/participants', auth, async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizerId.toString() === req.user._id.toString();

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ message: 'Only organizers and admins can view participants' });
        }

        const registrations = await Registration.find({ eventId })
            .populate('userId', 'name email')
            .populate('bannedBy', 'name');

        res.json(registrations.map(r => ({
            userId: r.userId._id,
            name: r.userId.name,
            email: r.userId.email,
            isBanned: r.isBanned,
            bannedAt: r.bannedAt,
            bannedBy: r.bannedBy?.name
        })));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/chat/:eventId/ban/:userId - Ban a user from the chatroom
router.post('/:eventId/ban/:userId', auth, async (req, res) => {
    try {
        const { eventId, userId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizerId.toString() === req.user._id.toString();

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ message: 'Only organizers and admins can ban users' });
        }

        // Cannot ban the organizer
        if (event.organizerId.toString() === userId) {
            return res.status(400).json({ message: 'Cannot ban the event organizer' });
        }

        const registration = await Registration.findOneAndUpdate(
            { userId, eventId },
            {
                isBanned: true,
                bannedAt: new Date(),
                bannedBy: req.user._id
            },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ message: 'User is not registered for this event' });
        }

        res.json({ message: 'User banned successfully', registration });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/chat/:eventId/ban/:userId - Unban a user from the chatroom
router.delete('/:eventId/ban/:userId', auth, async (req, res) => {
    try {
        const { eventId, userId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizerId.toString() === req.user._id.toString();

        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ message: 'Only organizers and admins can unban users' });
        }

        const registration = await Registration.findOneAndUpdate(
            { userId, eventId },
            { isBanned: false, bannedAt: null, bannedBy: null },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ message: 'User is not registered for this event' });
        }

        res.json({ message: 'User unbanned successfully', registration });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

