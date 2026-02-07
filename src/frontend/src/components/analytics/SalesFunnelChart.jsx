import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { Paper, Text, Title } from '@mantine/core';

const SalesFunnelChart = ({ data }) => {
    // Expect formatted data: [{ name: 'Novos', value: 10, fill: '#3b82f6' }, ...]

    if (!data || data.length === 0) {
        return <Text size="sm" c="dimmed">Sem dados para o funil.</Text>;
    }

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Title order={4} mb="md">Funil de Vendas</Title>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
};

export default SalesFunnelChart;
