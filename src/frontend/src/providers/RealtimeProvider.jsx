import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const RealtimeContext = createContext(null);

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
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

        const newSocket = io(wsUrl, {
            auth: { token },
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        newSocket.on('connect', () => {
            console.log('[WS] Connected to server');
            setConnected(true);
            setError(null);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('[WS] Disconnected:', reason);
            setConnected(false);
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });

        newSocket.on('connect_error', (err) => {
            console.error('[WS] Connection error:', err.message);
            setError(err.message);
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [token]); // Re-conecta se o token mudar

    const notificationSound = useRef(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'));

    useEffect(() => {
        if (socket && connected) {
            // Ouvir novas mensagens globalmente para notificações
            socket.on('message:new', (msg) => {
                // Só notifica se não for o próprio usuário que enviou (ROLE LEAD ou SYSTEM)
                // Ou se for USER mas em outra sessão? Por enquanto simplificamos:
                if (msg.role !== 'USER') {
                    playNotification();
                    showBrowserNotification(msg);
                }
            });

            // Ouvir criação de lead
            socket.on('lead:created', ({ lead }) => {
                playNotification();
                showBrowserNotification({
                    content: `Novo lead registrado: ${lead.name}`,
                    role: 'SYSTEM'
                });
            });

            return () => {
                socket.off('message:new');
                socket.off('lead:created');
            };
        }
    }, [socket, connected]);

    const playNotification = () => {
        notificationSound.current.play().catch(e => console.log('Audio play blocked:', e));
    };

    const showBrowserNotification = (msg) => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "granted") {
            new Notification("Quarks Solar", {
                body: msg.content,
                icon: '/favicon.ico' // TODO: check actual icon
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    };

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

    const value = {
        socket,
        connected,
        error,
        subscribeToLead,
        unsubscribeFromLead,
        playNotification
    };

    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
};
