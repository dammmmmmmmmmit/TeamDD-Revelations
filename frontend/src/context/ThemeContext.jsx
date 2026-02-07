import { createContext, useContext, useState, useEffect } from 'react';
import { themeAPI } from '../services/api';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        name: 'stranger-things',
        primaryColor: '#8B0000',
        secondaryColor: '#FF6B6B',
        background: '#0a0a0a',
        font: 'pixel',
        effects: ['glitch', 'flicker'],
        upsideDown: false
    });
    const [loading, setLoading] = useState(true);

    const fetchTheme = async () => {
        try {
            const response = await themeAPI.get();
            setTheme(response.data);
            applyTheme(response.data);
        } catch (error) {
            console.error('Failed to fetch theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (themeData) => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', themeData.primaryColor);
        root.style.setProperty('--secondary-color', themeData.secondaryColor);
        root.style.setProperty('--background-color', themeData.background);

        // Apply font
        const fontFamily = themeData.font === 'pixel'
            ? "'VT323', monospace"
            : themeData.font === 'retro'
                ? "'Press Start 2P', cursive"
                : "'Inter', sans-serif";
        root.style.setProperty('--font-family', fontFamily);

        // Apply upside down mode
        document.body.classList.toggle('upside-down', themeData.upsideDown);

        // Apply effects
        document.body.classList.toggle('glitch-enabled', themeData.effects?.includes('glitch'));
        document.body.classList.toggle('flicker-enabled', themeData.effects?.includes('flicker'));
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    const updateTheme = async (updates) => {
        try {
            const response = await themeAPI.update(updates);
            setTheme(response.data.theme);
            applyTheme(response.data.theme);
            return response.data.theme;
        } catch (error) {
            console.error('Failed to update theme:', error);
            throw error;
        }
    };

    const value = {
        theme,
        loading,
        updateTheme,
        refreshTheme: fetchTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
