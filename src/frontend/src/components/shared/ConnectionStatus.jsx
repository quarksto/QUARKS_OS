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
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'var(--mantine-color-green-6)',
                        boxShadow: '0 0 8px var(--mantine-color-green-4)'
                    }} />
                    <Text size="xs" c="dimmed" fw={500}>Live</Text>
                </Group>
            </Tooltip>
        );
    }

    return (
        <Tooltip label={error ? `Erro: ${error}` : 'Desconectado'}>
            <Group gap={4} style={{ cursor: 'pointer' }} onClick={handleReconnect}>
                <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--mantine-color-red-6)',
                    animation: 'pulse 2s infinite'
                }} />
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
