import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

/**
 * Funil de vendas por estágio — dados de GET /api/analytics/funnel.
 * DS: technical-card, petroleum/solar palette.
 */
export function FunnelWidget({ data = [], loading }) {
    if (loading) {
        return (
            <div className="technical-card p-6 h-[300px] flex items-center justify-center">
                <p className="ds-meta text-slate-400">Carregando funil...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="technical-card p-6 h-[300px] flex items-center justify-center">
                <p className="ds-meta text-slate-400">Sem dados para o funil.</p>
            </div>
        );
    }

    return (
        <div className="technical-card p-6 h-full flex flex-col">
            <h3 className="ds-title-section mb-6">Funil de Vendas</h3>
            <div className="flex-1 min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#475569' }} />
                        <Tooltip
                            contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                            labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                            formatter={(value) => [value, 'Leads']}
                        />
                        <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]} maxBarSize={28}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill || '#0F4C5C'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
