import React, { createContext, useContext, useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'quarks-sidebar-collapsed';
const COPILOT_STORAGE_KEY = 'quarks-copilot-open';

const readSidebarCollapsed = () => {
    try {
        const v = localStorage.getItem(SIDEBAR_STORAGE_KEY);
        return v === 'true';
    } catch {
        return false;
    }
};

const readCopilotOpen = () => {
    try {
        const v = localStorage.getItem(COPILOT_STORAGE_KEY);
        return v === null ? true : v === 'true';
    } catch {
        return true;
    }
};

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readSidebarCollapsed);

    useEffect(() => {
        try {
            localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarCollapsed));
        } catch (_) { }
    }, [isSidebarCollapsed]);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <LayoutContext.Provider value={{
            isSidebarCollapsed,
            toggleSidebar,
        }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
