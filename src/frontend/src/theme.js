import { createTheme, rem } from '@mantine/core';

// Quarks OS Design System v1.0
// Primary: Solar Blue #1E3A8A
// Accent: Solar Gold #F59E0B
// Status Colors: Success #16A34A, Warning #D97706, Danger #DC2626

const theme = createTheme({
    primaryColor: 'petroleum',
    colors: {
        petroleum: [
            '#f1f5f9', // 0: slate-100 (fallback light)
            '#e2e8f0', // 1: slate-200
            '#cbd5e1', // 2: slate-300
            '#94a3b8', // 3: slate-400
            '#64748b', // 4: slate-500
            '#475569', // 5: slate-600
            '#334155', // 6: slate-700
            '#1e293b', // 7: slate-800
            '#0F4C5C', // 8: Petroleum 900 (BASE)
            '#08323d', // 9: Petroleum 950
        ],
        solar: [
            '#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24',
            '#f59e0b', // 5: Solar 500 (BASE)
            '#d97706', '#b45309', '#92400e', '#78350f',
        ],
    },
    fontFamily: 'Geist, system-ui, sans-serif',
    fontFamilyMonospace: 'Geist Mono, ui-monospace, monospace',
    headings: {
        fontFamily: 'Geist, system-ui, sans-serif',
        sizes: {
            h1: { fontSize: rem(32), fontWeight: '700' },
            h2: { fontSize: rem(24), fontWeight: '700' },
            h3: { fontSize: rem(16), fontWeight: '600' },
        },
    },
    defaultRadius: 'md',
    components: {
        Card: {
            defaultProps: {
                shadow: 'none', // Super Flat rule
                padding: 'md',
                radius: 'lg', // 8px per DS v1.4
                withBorder: true,
            },
        },
        Button: {
            defaultProps: {
                radius: 'xl', // Pills rule
                h: 32, // h-8 base rule
            },
        },
        Paper: {
            defaultProps: {
                radius: 'lg',
                shadow: 'none'
            }
        }
    },
});

export default theme;
