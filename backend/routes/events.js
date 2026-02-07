const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// GET /api/events - Get all published events (public)
router.get('/', async (req, res) => {
    try {
        const { category, date } = req.query;
        const query = { status: 'published' };

        if (category) {
            query.category = category;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.dateTime = { $gte: startDate, $lt: endDate };
        }

        const events = await Event.find(query)
            .populate('organizerId', 'name email')
            .sort({ dateTime: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/events/my - Get organizer's events
router.get('/my', auth, roleCheck('organizer', 'admin'), async (req, res) => {
    try {
        const events = await Event.find({ organizerId: req.user._id })
            .populate('organizerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/events/:id - Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizerId', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/events - Create event (organizer only)
router.post('/', auth, roleCheck('organizer', 'admin'), async (req, res) => {
    try {
        const { title, description, dateTime, venue, category } = req.body;

        const event = new Event({
            title,
            description,
            dateTime,
            venue,
            category,
            status: 'draft',
            organizerId: req.user._id
        });

        await event.save();
        await event.populate('organizerId', 'name email');

        res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/events/:id/status - Update event status
router.patch('/:id/status', auth, roleCheck('organizer', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user owns the event (unless admin)
        if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this event' });
        }

        // Validate status transitions
        const validTransitions = {
            'draft': ['published'],
            'published': ['closed'],
            'closed': []
        };

        if (!validTransitions[event.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${event.status} to ${status}`
            });
        }

        event.status = status;
        await event.save();

        res.json({
            message: 'Event status updated',
            event
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/events/:id/participants - Get event participants
router.get('/:id/participants', auth, roleCheck('organizer', 'admin'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user owns the event (unless admin)
        if (req.user.role !== 'admin' && event.organizerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view participants' });
        }

        const registrations = await Registration.find({ eventId: req.params.id })
            .populate('userId', 'name email')
            .sort({ registeredAt: -1 });

        const participants = registrations.map(reg => ({
            id: reg.userId._id,
            name: reg.userId.name,
            email: reg.userId.email,
            registeredAt: reg.registeredAt
        }));

        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
