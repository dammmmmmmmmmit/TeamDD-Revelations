import { motion } from 'framer-motion';

/**
 * EyeTracker Component
 * Renders animated "eyes" that follow the mouse cursor horizontally.
 * Used on the login page for a Stranger Things-like immersive effect.
 */
const EyeTracker = ({ mouseX }) => {
    // Calculate pupil movement based on mouse position (-5 to +5 range)
    const eyeMove = typeof window !== 'undefined'
        ? (mouseX / window.innerWidth) * 10 - 5
        : 0;

    const eyeStyle = {
        width: '48px',
        height: '16px',
        backgroundColor: 'white',
        borderRadius: '9999px',
        filter: 'blur(1px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
    };

    const pupilStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '16px',
        height: '16px',
        backgroundColor: 'black',
        borderRadius: '9999px',
        transform: 'translate(-50%, -50%)'
    };

    const containerStyle = {
        position: 'absolute',
        top: '-96px',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0.6,
        transition: 'opacity 0.5s ease',
        display: 'flex',
        gap: '16px'
    };

    return (
        <div
            style={containerStyle}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
            {/* Left Eye */}
            <motion.div style={eyeStyle} animate={{ x: eyeMove }}>
                <div style={pupilStyle} />
            </motion.div>

            {/* Right Eye */}
            <motion.div style={eyeStyle} animate={{ x: eyeMove }}>
                <div style={pupilStyle} />
            </motion.div>
        </div>
    );
};

export default EyeTracker;
