import { useEffect } from 'react';
import { useRealtime } from '../providers/RealtimeProvider';
import { notifications } from '@mantine/notifications';

/**
 * Hook para ouvir atualizações de leads em tempo real
 * @param {string} leadId - ID do lead específico para ouvir (opcional)
 * @param {Function} onUpdate - Callback disparado quando o lead é atualizado
 */
export const useLeadRealtime = (leadId, onUpdate) => {
    const { socket, connected, subscribeToLead, unsubscribeFromLead } = useRealtime();

    useEffect(() => {
        if (!socket || !connected) return;

        if (leadId) {
            subscribeToLead(leadId);

            socket.on('lead:updated', (data) => {
                if (data.leadId === leadId) {
                    onUpdate?.(data.changes);
                }
            });

            return () => {
                unsubscribeFromLead(leadId);
                socket.off('lead:updated');
            };
        } else {
            // Ouvir todos os leads (Global)
            socket.emit('subscribe:all_leads');

            socket.on('lead:created', (data) => {
                notifications.show({
                    title: 'Novo Lead!',
                    message: `${data.lead.name} acabou de chegar.`,
                    color: 'blue',
                    autoClose: 10000,
                });
                onUpdate?.({ type: 'created', lead: data.lead });
            });

            socket.on('lead:updated', (data) => {
                onUpdate?.({ type: 'updated', ...data });
            });

            socket.on('message:new', (msg) => {
                onUpdate?.({ type: 'message_new', leadId: msg.leadId, message: msg });
            });

            socket.on('lead:unread_reset', (data) => {
                onUpdate?.({ type: 'unread_reset', leadId: data.leadId });
            });

            return () => {
                socket.emit('unsubscribe:all_leads');
                socket.off('lead:created');
                socket.off('lead:updated');
                socket.off('message:new');
                socket.off('lead:unread_reset');
            };
        }
    }, [socket, connected, leadId]);
};

/**
 * Hook para eventos globais do sistema
 */
export const useGlobalRealtime = (onEvent) => {
    const { socket, connected } = useRealtime();

    useEffect(() => {
        if (!socket || !connected) return;

        socket.on('app:mode_switch', (data) => {
            onEvent?.({ type: 'mode_switch', mode: data.mode });
        });

        return () => {
            socket.off('app:mode_switch');
        };
    }, [socket, connected, onEvent]);
};
