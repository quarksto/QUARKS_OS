import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const RealtimeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useRealtime must be used within a RealtimeProvider');
    }
    return context;
};

export const RealtimeProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(null);
            setConnected(false);
            return;
        }

        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';
        const newSocket = io(wsUrl, {
            auth: { token },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('[WS] Connected');
            setConnected(true);
            setError(null);
        });

        newSocket.on('disconnect', () => {
            setConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('[WS] Error:', err.message);
            setError(err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    const notificationSound = useRef(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'));

    // Hoisted functions
    const playNotification = () => {
        notificationSound.current.play().catch(e => console.log('Audio play blocked:', e));
    };

    const showBrowserNotification = (msg) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            new Notification("Nova mensagem", { body: msg.content });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Nova mensagem", { body: msg.content });
                }
            });
        }
    };

    useEffect(() => {
        if (!socket || !connected) return;

        socket.on('new_message', (msg) => {
            console.log('New message received:', msg);
            // Tocar som se não for mensagem do próprio usuário (ou se quisermos feedback sempre)
            // Ou se for USER mas em outra sessão? Por enquanto simplificamos:
            if (msg.role !== 'USER') {
                playNotification();
                showBrowserNotification(msg);
            }
        });

        socket.on('new_lead', (lead) => {
            console.log('New lead received:', lead);
            // Atualizar lista ou notificar
            playNotification();
        });

        return () => {
            socket.off('new_message');
            socket.off('new_lead');
        };
    }, [socket, connected]);

    const subscribeToLead = (leadId) => {
        if (socket && connected) {
            socket.emit('subscribe:lead', { leadId });
        }
    };

    const unsubscribeFromLead = (leadId) => {
        if (socket && connected) {
            socket.emit('unsubscribe:lead', { leadId });
        }
    };

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const value = React.useMemo(() => ({
        socket,
        connected,
        error,
        subscribeToLead,
        unsubscribeFromLead,
        playNotification
    }), [socket, connected, error]);

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
};
