import React from 'react';
import { Badge, Tooltip, ActionIcon, Group, Text } from '@mantine/core';
import { IconWifi, IconWifiOff, IconRefresh } from '@tabler/icons-react';
import { useRealtime } from '../../providers/RealtimeProvider';

export const ConnectionStatus = () => {
    const { connected, error, socket } = useRealtime();

    const handleReconnect = () => {
        if (socket) {
            socket.connect();
        }
    };

    if (connected) {
        return (
            <Tooltip label="Conectado ao Real-time Gateway">
                <Group gap={4}>
                    <div className="size-2 rounded-full bg-emerald-500" aria-hidden />
                    <Text size="xs" c="dimmed" fw={500}>Live</Text>
                </Group>
            </Tooltip>
        );
    }

    return (
        <Tooltip label={error ? `Erro: ${error}` : 'Desconectado'}>
            <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleReconnect}>
<div className="size-2 rounded-full bg-red-500 animate-pulse" aria-hidden />
                <Text size="xs" c="red" fw={500}>Offline</Text>
            </Group>
        </Tooltip>
    );
};

// Adicionar animação simples no CSS global ou via style tag se necessário
const styles = `
@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
`;
