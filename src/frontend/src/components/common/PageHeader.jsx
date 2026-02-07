import { Group, Title, Button } from '@mantine/core';
import PropTypes from 'prop-types';

export default function PageHeader({ title, actionButton }) {
    return (
        <Group justify="space-between" mb="lg">
            <Title order={2}>{title}</Title>
            {actionButton && (
                <Button onClick={actionButton.onClick} leftSection={actionButton.icon}>
                    {actionButton.label}
                </Button>
            )}
        </Group>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    actionButton: PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        icon: PropTypes.node,
    }),
};
