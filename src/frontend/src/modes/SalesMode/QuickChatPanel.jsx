import React, { useState, useEffect, useRef } from 'react';
import { Box, ScrollArea, TextInput, ActionIcon, Group, Text, Avatar, Paper, Transition, Stack } from '@mantine/core';
import { IconSend, IconPlus, IconDotsVertical, IconCheck, IconChecks } from '@tabler/icons-react';
import { useRealtime } from '../../providers/RealtimeProvider';
import api from '../../services/api';

export function QuickChatPanel({ leadId }) {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const { socket, connected } = useRealtime();

    useEffect(() => {
        if (!leadId) return;

        // Carregar histórico
        // setLoading(true);
        api.get(`/messages/lead/${leadId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error('Load messages error:', err))
            .finally(() => setLoading(false));

        // Marcar como lidas
        api.patch(`/messages/read/${leadId}`).catch(() => { });

        // Listen for events
        if (socket && connected) {
            const handleNewMessage = (msg) => {
                if (msg.leadId === leadId) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === msg.id)) return prev;
                        return [...prev, msg];
                    });
                    // Se estamos com o chat aberto, marca como lida
                    api.patch(`/messages/read/${leadId}`).catch(() => { });
                }
            };

            const handleTyping = (data) => {
                if (data.leadId === leadId) {
                    setIsOtherTyping(data.isTyping);
                }
            };

            socket.on('message:new', handleNewMessage);
            socket.on('chat:typing', handleTyping);

            return () => {
                socket.off('message:new', handleNewMessage);
                socket.off('chat:typing', handleTyping);
            };
        }
    }, [leadId, socket, connected]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isOtherTyping]);

    const handleInputChange = (val) => {
        setChatInput(val);

        // Emitir typing start
        if (socket && connected && leadId) {
            socket.emit('chat:typing', { leadId, isTyping: true });

            // Cleanup timeout anterior
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            // Definir timeout para parar o typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('chat:typing', { leadId, isTyping: false });
            }, 2000);
        }
    };

    const handleSend = async () => {
        if (!chatInput.trim() || !leadId) return;

        const content = chatInput;
        setChatInput('');

        // Optimistic Update
        const tempId = 'temp-' + Date.now();
        const optimisticMsg = {
            id: tempId,
            content,
            role: 'USER',
            createdAt: new Date().toISOString(),
            isOptimistic: true
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            await api.post('/messages', { leadId, content });
            // A mensagem real virá via WebSocket
        } catch (err) {
            console.error('Send message error:', err);
            // Remover a otimista se falhar
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    if (!leadId) return null;

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
            {/* Header do Chat (Opcional, se o LeadContextPanel já não tiver) */}

            {/* Messages Area */}
            <ScrollArea viewportRef={scrollRef} style={{ flex: 1, padding: 16 }}>
                <Stack gap="xs">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    {loading && <Text size="xs" c="dimmed" ta="center">Carregando mensagens...</Text>}

                    {isOtherTyping && (
                        <Box style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px' }}>
                            <Text size="xs" c="dimmed">Digitando</Text>
                            <Group gap={4}>
                                <Box className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                                <Box className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#CBD5E1', animationDelay: '0.2s' }} />
                                <Box className="animate-bounce" style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#CBD5E1', animationDelay: '0.4s' }} />
                            </Group>
                        </Box>
                    )}
                </Stack>
            </ScrollArea>

            {/* Input Area */}
            <Box p="md" style={{ borderTop: '1px solid #E2E8F0', backgroundColor: 'white' }}>
                <Group gap="xs">
                    <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
                        <IconPlus size={20} />
                    </ActionIcon>
                    <TextInput
                        placeholder="Digite uma mensagem..."
                        style={{ flex: 1 }}
                        value={chatInput}
                        onChange={(e) => handleInputChange(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        radius="xl"
                        size="md"
                        variant="filled"
                        styles={{ input: { backgroundColor: '#F1F5F9' } }}
                    />
                    <ActionIcon
                        color="solar"
                        radius="xl"
                        size="lg"
                        variant="filled"
                        onClick={handleSend}
                        disabled={!chatInput.trim()}
                    >
                        <IconSend size={20} />
                    </ActionIcon>
                </Group>
            </Box>
        </Box>
    );
}

function MessageBubble({ msg }) {
    const isUser = msg.role === 'USER';
    const isLead = msg.role === 'LEAD';
    const isSystem = msg.role === 'SYSTEM';

    if (isSystem) {
        return (
            <Text size="xs" c="dimmed" ta="center" my="xs" fs="italic">
                {msg.content}
            </Text>
        );
    }

    return (
        <Box style={{
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start'
        }}>
            <Paper
                px="sm"
                py={6}
                radius="lg"
                shadow="xs"
                style={{
                    backgroundColor: isUser ? 'var(--mantine-color-solar-6)' : 'white',
                    color: isUser ? 'white' : 'var(--mantine-color-slate-9)',
                    borderBottomRightRadius: isUser ? 4 : 16,
                    borderBottomLeftRadius: isLead ? 4 : 16,
                }}
            >
                <Text size="sm">{msg.content}</Text>
                <Group gap={4} justify="flex-end" mt={2} style={{ opacity: 0.7 }}>
                    <Text size="10px" c={isUser ? 'white' : 'dimmed'}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {isUser && (
                        msg.isOptimistic ? (
                            <IconCheck size={12} stroke={1.5} />
                        ) : (
                            <IconChecks
                                size={12}
                                stroke={2}
                                color={msg.isRead ? '#FCD34D' : 'rgba(255,255,255,0.7)'}
                            />
                        )
                    )}
                </Group>
            </Paper>
        </Box>
    );
}
