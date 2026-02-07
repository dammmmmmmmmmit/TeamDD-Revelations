const express = require('express');
const Theme = require('../models/Theme');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Initialize default theme if not exists
const initializeTheme = async () => {
    const existingTheme = await Theme.findOne();
    if (!existingTheme) {
        await Theme.create({
            name: 'stranger-things',
            primaryColor: '#8B0000',
            secondaryColor: '#FF6B6B',
            background: '#0a0a0a',
            font: 'pixel',
            effects: ['glitch', 'flicker'],
            upsideDown: false
        });
    }
};

// GET /api/theme - Get current theme (public)
router.get('/', async (req, res) => {
    try {
        await initializeTheme();
        const theme = await Theme.findOne();
        res.json(theme);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/theme - Update theme (admin only)
router.patch('/', auth, roleCheck('admin'), async (req, res) => {
    try {
        const { primaryColor, secondaryColor, background, font, effects, upsideDown } = req.body;

        let theme = await Theme.findOne();

        if (!theme) {
            theme = new Theme();
        }

        if (primaryColor !== undefined) theme.primaryColor = primaryColor;
        if (secondaryColor !== undefined) theme.secondaryColor = secondaryColor;
        if (background !== undefined) theme.background = background;
        if (font !== undefined) theme.font = font;
        if (effects !== undefined) theme.effects = effects;
        if (upsideDown !== undefined) theme.upsideDown = upsideDown;

        await theme.save();

        res.json({
            message: 'Theme updated successfully',
            theme
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
