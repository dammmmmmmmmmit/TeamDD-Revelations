const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'stranger-things'
    },
    primaryColor: {
        type: String,
        default: '#8B0000'
    },
    secondaryColor: {
        type: String,
        default: '#FF6B6B'
    },
    background: {
        type: String,
        default: '#0a0a0a'
    },
    font: {
        type: String,
        enum: ['pixel', 'retro', 'modern'],
        default: 'pixel'
    },
    effects: {
        type: [String],
        default: ['glitch', 'flicker']
    },
    upsideDown: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
