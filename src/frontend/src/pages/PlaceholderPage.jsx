import { Title, Text } from '@mantine/core';

export default function PlaceholderPage({ title = 'Em breve' }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Title order={1} mb="md">{title}</Title>
      <Text c="dimmed">Esta seção está em construção e estará disponível em breve.</Text>
    </div>
  );
}
