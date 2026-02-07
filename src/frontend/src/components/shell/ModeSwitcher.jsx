import React from 'react';
import { SegmentedControl, Group, Center, Box, rem, Text } from '@mantine/core';
import { IconPhone, IconChartBar, IconTool, IconBriefcase } from '@tabler/icons-react';
import { useMode, MODES } from '../../providers/ModeProvider';

import { useNavigate } from 'react-router-dom';

export const ModeSwitcher = () => {
    const { mode, setMode } = useMode();
    const navigate = useNavigate();

    const handleModeChange = (newMode) => {
        setMode(newMode);

        // Navegação inteligente baseada no modo
        if (newMode === MODES.SALES) {
            navigate('/workspace');
        } else if (newMode === MODES.MANAGE) {
            navigate('/dashboard');
        } else if (newMode === MODES.PROJECTS) {
            navigate('/projetos');
        }
    };

    return (
        <SegmentedControl
            value={mode}
            onChange={handleModeChange}
            transitionDuration={500}
            transitionTimingFunction="linear"
            radius="lg"
            size="sm"
            bg="transparent"
            styles={{
                root: {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
                indicator: {
                    backgroundColor: 'var(--mantine-color-white)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
                control: {
                    border: '0 !important',
                }
            }}
            data={[
                {
                    value: MODES.SALES,
                    label: (
                        <Center style={{ gap: 10 }}>
                            <IconPhone style={{ width: rem(16), height: rem(16) }} />
                            <Text size="xs" fw={mode === MODES.SALES ? 600 : 400}>Vendas</Text>
                        </Center>
                    ),
                },
                {
                    value: MODES.MANAGE,
                    label: (
                        <Center style={{ gap: 10 }}>
                            <IconChartBar style={{ width: rem(16), height: rem(16) }} />
                            <Text size="xs" fw={mode === MODES.MANAGE ? 600 : 400}>Gestão</Text>
                        </Center>
                    ),
                },
                {
                    value: MODES.PROJECTS,
                    label: (
                        <Center style={{ gap: 10 }}>
                            <IconBriefcase style={{ width: rem(16), height: rem(16) }} />
                            <Text size="xs" fw={mode === MODES.PROJECTS ? 600 : 400}>Projetos</Text>
                        </Center>
                    ),
                },
            ]}
        />
    );
};
