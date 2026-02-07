const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// POST /api/registrations - Register for an event
router.post('/', auth, roleCheck('student'), async (req, res) => {
    try {
        const { eventId } = req.body;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event is published
        if (event.status !== 'published') {
            return res.status(400).json({
                message: event.status === 'closed'
                    ? 'Registration is closed for this event'
                    : 'Event is not available for registration'
            });
        }

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            userId: req.user._id,
            eventId
        });

        if (existingRegistration) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Create registration
        const registration = new Registration({
            userId: req.user._id,
            eventId
        });

        await registration.save();

        res.status(201).json({
            message: 'Successfully registered for event',
            registration
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/registrations/my - Get student's registered events
router.get('/my', auth, roleCheck('student'), async (req, res) => {
    try {
        const registrations = await Registration.find({ userId: req.user._id })
            .populate({
                path: 'eventId',
                populate: {
                    path: 'organizerId',
                    select: 'name email'
                }
            })
            .sort({ registeredAt: -1 });

        const events = registrations.map(reg => ({
            registrationId: reg._id,
            registeredAt: reg.registeredAt,
            event: reg.eventId
        }));

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/registrations/:eventId - Cancel registration
router.delete('/:eventId', auth, roleCheck('student'), async (req, res) => {
    try {
        const registration = await Registration.findOneAndDelete({
            userId: req.user._id,
            eventId: req.params.eventId
        });

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
