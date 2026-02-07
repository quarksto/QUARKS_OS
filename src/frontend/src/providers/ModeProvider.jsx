import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext(null);

export const MODES = {
    SALES: 'sales',
    MANAGE: 'manage',
    PROJECTS: 'projects'
};

export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};

import { useGlobalRealtime } from '../hooks/useRealtime';

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('quarks_mode') || MODES.MANAGE;
    });

    // Sincronizar mudança de modo via Real-time (Ex: Copilot Tool)
    useGlobalRealtime((event) => {
        if (event.type === 'mode_switch' && event.mode) {
            setMode(event.mode);
        }
    });

    useEffect(() => {
        localStorage.setItem('quarks_mode', mode);
    }, [mode]);

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
};
