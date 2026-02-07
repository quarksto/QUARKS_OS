import React from 'react';
import { Paper, Title, Text, Group, Badge, ThemeIcon, Stack } from '@mantine/core';
import { IconFileInvoice, IconUserPlus } from '@tabler/icons-react';

const RecentActivity = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <Paper shadow="sm" p="md" radius="md" withBorder h="100%">
                <Title order={4} mb="md">Atividade Recente</Title>
                <Text size="sm" c="dimmed">Nenhuma atividade recente.</Text>
            </Paper>
        );
    }

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder h="100%">
            <Title order={4} mb="md">Atividade Recente</Title>
            <Stack gap="sm">
                {data.map((item) => (
                    <Group key={item.id} wrap="nowrap" align="flex-start">
                        <ThemeIcon
                            size="md"
                            radius="xl"
                            color={item.type === 'PROPOSAL' ? 'blue' : 'green'}
                            variant="light"
                        >
                            {item.type === 'PROPOSAL' ? <IconFileInvoice size={16} /> : <IconUserPlus size={16} />}
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                            <Group justify="space-between" mb={2}>
                                <Text size="sm" fw={500}>{item.title}</Text>
                                <Text size="xs" c="dimmed">
                                    {new Date(item.date).toLocaleDateString('pt-BR')}
                                </Text>
                            </Group>
                            <Text size="xs" c="dimmed" lineClamp={1}>
                                {item.description}
                            </Text>
                            <Group mt={4}>
                                <Badge size="xs" variant="outline" color="gray">
                                    {item.status}
                                </Badge>
                            </Group>
                        </div>
                    </Group>
                ))}
            </Stack>
        </Paper>
    );
};

export default RecentActivity;
