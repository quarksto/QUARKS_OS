import { AppShell, Burger, Group, NavLink, Text, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLayoutDashboard, IconUsers, IconFileDescription, IconSolarPanel, IconSettings, IconLogout } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    const [opened, { toggle }] = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();

    const data = [
        { link: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
        { link: '/leads', label: 'Leads', icon: IconUsers },
        { link: '/proposals', label: 'Propostas', icon: IconFileDescription },
        { link: '/kits', label: 'Kits & Tarifas', icon: IconSolarPanel },
        { link: '/settings', label: 'Configurações', icon: IconSettings },
    ];

    const links = data.map((item) => (
        <NavLink
            key={item.label}
            active={location.pathname === item.link}
            label={item.label}
            leftSection={<item.icon size="1rem" stroke={1.5} />}
            onClick={() => {
                navigate(item.link);
                if (opened) toggle();
            }}
        />
    ));

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
                            Quarks OS
                        </Text>
                    </Group>
                    <Group>
                        <Avatar radius="xl" />
                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>Usuário Demo</Text>
                            <Text c="dimmed" size="xs">Integrador</Text>
                        </div>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                {links}
                <div style={{ marginTop: 'auto' }}>
                    <NavLink
                        label="Logout"
                        leftSection={<IconLogout size="1rem" stroke={1.5} />}
                        color="red"
                        onClick={() => alert('Logout clicked')}
                    />
                </div>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
