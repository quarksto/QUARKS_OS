import { createTheme, rem } from '@mantine/core';

// Quarks OS Design System v1.0
// Primary: Solar Blue #1E3A8A
// Accent: Solar Gold #F59E0B
// Status Colors: Success #16A34A, Warning #D97706, Danger #DC2626

const theme = createTheme({
    primaryColor: 'solarBlue',
    colors: {
        // Custom Solar Blue Palette (Primary)
        // 0-9 scale generated based on #1E3A8A
        solarBlue: [
            '#E6F0FF', // 0 (Lightest)
            '#CCE0FF', // 1
            '#99C2FF', // 2
            '#66A3FF', // 3
            '#3385FF', // 4
            '#1E3A8A', // 5 (Base - Primary)
            '#172E6E', // 6
            '#102252', // 7
            '#0A1536', // 8
            '#03091A', // 9 (Darkest)
        ],
        // Custom Solar Gold Palette (Accent)
        solarGold: [
            '#FFF9E6',
            '#FFEDCC',
            '#FFE099',
            '#FFD466',
            '#FFC733',
            '#F59E0B', // Base - Accent
            '#C47E09',
            '#935E07',
            '#623F04',
            '#311F02',
        ],
    },
    fontFamily: 'Geist, system-ui, sans-serif',
    headings: {
        fontFamily: 'Geist, system-ui, sans-serif',
        sizes: {
            h1: { fontSize: rem(28), fontWeight: '700' },
            h2: { fontSize: rem(22), fontWeight: '600' },
            h3: { fontSize: rem(18), fontWeight: '600' },
        },
    },
    defaultRadius: 'md',
    components: {
        Card: {
            defaultProps: {
                shadow: 'sm',
                padding: 'md', // >= 16px as per spec
                radius: 'md', // 16px approx
                withBorder: true,
            },
            styles: (theme) => ({
                root: {
                    backgroundColor: theme.white,
                },
            }),
        },
        Button: {
            defaultProps: {
                radius: 'md', // 12px approx
                h: 44, // 44px height rule
            },
        },
        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm'
            }
        }
    },
});

export default theme;
