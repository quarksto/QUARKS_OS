import { Paper, Group, Text, ThemeIcon, rem } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import PropTypes from 'prop-types';

export default function StatsCard({ title, value, diff, icon: Icon, description }) {
    const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;
    const diffColor = diff > 0 ? 'teal' : 'red';

    return (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                    {title}
                </Text>
                {Icon && (
                    <ThemeIcon color="gray" variant="light" size={38} radius="md">
                        <Icon style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
                    </ThemeIcon>
                )}
            </Group>

            <Group align="flex-end" gap="xs" mt={25}>
                <Text fw={700} size="xl" lh={1}>{value}</Text>
                {diff !== undefined && (
                    <Text c={diffColor} fz="sm" fw={700} style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{diff}%</span>
                        <DiffIcon size="1rem" stroke={1.5} />
                    </Text>
                )}
            </Group>

            {description && (
                <Text fz="xs" c="dimmed" mt={7}>
                    {description}
                </Text>
            )}
        </Paper>
    );
}

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    diff: PropTypes.number,
    icon: PropTypes.elementType,
    description: PropTypes.string
};
