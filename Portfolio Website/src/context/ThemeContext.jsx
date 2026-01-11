import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'themes', 'current'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                const palette = data.palette;
                setTheme(palette);

                if (palette) {
                    const root = document.documentElement;

                    // Apply ONLY accent colors from Firebase
                    // Background and text remain fixed for consistent dark theme
                    root.style.setProperty('--primary', palette.primary);
                    root.style.setProperty('--secondary', palette.secondary || palette.primary);
                    root.style.setProperty('--accent', palette.accent || palette.primary);

                }
            }
        });

        return () => unsub();
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
