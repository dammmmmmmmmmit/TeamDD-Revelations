import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

// SVG Icons
const Icons = {
    upsideDown: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
        </svg>
    ),
    palette: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    font: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4,7 4,4 20,4 20,7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
    ),
    effects: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
        </svg>
    ),
    config: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
        </svg>
    ),
    warning: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    )
};

// Animated Portal for Upside Down
const UpsideDownPortal = ({ active }) => (
    <svg width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom: '1rem' }}>
        <defs>
            <linearGradient id="upsideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={active ? "#ff006e" : "#ff0a54"} />
                <stop offset="50%" stopColor={active ? "#00ffff" : "#00f5d4"} />
                <stop offset="100%" stopColor={active ? "#ff00ff" : "#9b5de5"} />
            </linearGradient>
            <filter id="upsideGlow">
                <feGaussianBlur stdDeviation={active ? "5" : "2"} result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#upsideGrad)" strokeWidth="3" filter="url(#upsideGlow)" opacity={active ? 1 : 0.5}>
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to={active ? "-360 50 50" : "360 50 50"} dur={active ? "3s" : "10s"} repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="30" fill="none" stroke="url(#upsideGrad)" strokeWidth="2" opacity={active ? 0.9 : 0.4}>
            <animateTransform attributeName="transform" type="rotate" from={active ? "360 50 50" : "0 50 50"} to={active ? "0 50 50" : "360 50 50"} dur={active ? "2s" : "8s"} repeatCount="indefinite" />
        </circle>
        {active && (
            <circle cx="50" cy="50" r="15" fill="url(#upsideGrad)" opacity="0.8">
                <animate attributeName="r" values="15;25;15" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1s" repeatCount="indefinite" />
            </circle>
        )}
        {!active && (
            <circle cx="50" cy="50" r="10" fill="url(#upsideGrad)" opacity="0.6" />
        )}
    </svg>
);

const AdminPanel = () => {
    const { theme, updateTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleToggleUpsideDown = async () => {
        setLoading(true);
        try {
            await updateTheme({ upsideDown: !theme.upsideDown });
            setMessage({
                type: 'success',
                text: `Upside Down mode ${!theme.upsideDown ? 'ACTIVATED' : 'deactivated'}!`
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update theme' });
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = async (colorType, value) => {
        try {
            await updateTheme({ [colorType]: value });
        } catch (error) {
            console.error('Failed to update color:', error);
        }
    };

    const handleFontChange = async (font) => {
        try {
            await updateTheme({ font });
        } catch (error) {
            console.error('Failed to update font:', error);
        }
    };

    const handleEffectToggle = async (effect) => {
        const newEffects = theme.effects?.includes(effect)
            ? theme.effects.filter(e => e !== effect)
            : [...(theme.effects || []), effect];

        try {
            await updateTheme({ effects: newEffects });
        } catch (error) {
            console.error('Failed to update effects:', error);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className={`page-title ${theme.upsideDown ? 'glitch-text' : ''}`}>
                    ⚡ Control Center
                </h1>
                <p className="page-subtitle">Manipulate the dimensions of Campus Flow</p>
            </header>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="admin-grid">
                {/* Upside Down Toggle - Main Feature */}
                <div className={`control-card ${theme.upsideDown ? 'active-upside-down' : ''}`} style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <UpsideDownPortal active={theme.upsideDown} />
                        <div style={{ flex: 1 }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                {Icons.upsideDown}
                                Upside Down Mode
                            </h3>
                            <p>Enter the alternate dimension where everything becomes stranger. Colors invert, reality glitches, and chaos reigns.</p>
                            <button
                                className={`btn ${theme.upsideDown ? 'btn-danger' : 'btn-primary'} btn-large`}
                                onClick={handleToggleUpsideDown}
                                disabled={loading}
                                style={{ marginTop: '1rem' }}
                            >
                                {loading ? 'Shifting Dimensions...' : theme.upsideDown ? '⬆️ Return to Normal' : '⬇️ Enter Upside Down'}
                            </button>
                        </div>
                    </div>
                    {theme.upsideDown && (
                        <div className="warning-banner">
                            {Icons.warning}
                            <span style={{ marginLeft: '0.5rem' }}>WARNING: You are currently in the Upside Down dimension!</span>
                        </div>
                    )}
                </div>

                {/* Color Controls */}
                <div className="control-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {Icons.palette}
                        Theme Colors
                    </h3>

                    <div className="color-control">
                        <label>Primary</label>
                        <input
                            type="color"
                            value={theme.primaryColor || '#ff0a54'}
                            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        />
                        <span>{theme.primaryColor || '#ff0a54'}</span>
                    </div>

                    <div className="color-control">
                        <label>Secondary</label>
                        <input
                            type="color"
                            value={theme.secondaryColor || '#00f5d4'}
                            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        />
                        <span>{theme.secondaryColor || '#00f5d4'}</span>
                    </div>

                    <div className="color-control">
                        <label>Background</label>
                        <input
                            type="color"
                            value={theme.background || '#0d0d0d'}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                        />
                        <span>{theme.background || '#0d0d0d'}</span>
                    </div>
                </div>

                {/* Font Control */}
                <div className="control-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {Icons.font}
                        Typography
                    </h3>
                    <p>Select the font style for the interface.</p>
                    <div className="font-options">
                        {[
                            { value: 'pixel', label: 'ORBITRON' },
                            { value: 'retro', label: 'RAJDHANI' },
                            { value: 'modern', label: 'INTER' }
                        ].map(font => (
                            <button
                                key={font.value}
                                className={`btn ${theme.font === font.value ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handleFontChange(font.value)}
                            >
                                {font.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Effects Control */}
                <div className="control-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {Icons.effects}
                        Visual Effects
                    </h3>
                    <p>Toggle special visual effects.</p>
                    <div className="effects-grid">
                        <label className="effect-toggle">
                            <input
                                type="checkbox"
                                checked={theme.effects?.includes('glitch')}
                                onChange={() => handleEffectToggle('glitch')}
                            />
                            <span>⚡ Glitch Effect</span>
                        </label>
                        <label className="effect-toggle">
                            <input
                                type="checkbox"
                                checked={theme.effects?.includes('flicker')}
                                onChange={() => handleEffectToggle('flicker')}
                            />
                            <span>💡 Flicker Effect</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Current Config Display */}
            <div className="config-display">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {Icons.config}
                    Current Configuration
                </h3>
                <pre>{JSON.stringify(theme, null, 2)}</pre>
            </div>
        </div>
    );
};

export default AdminPanel;
