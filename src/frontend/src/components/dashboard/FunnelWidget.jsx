import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from 'recharts';

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

    // Custom secondary label to show conversion
    const renderCustomLabel = (props) => {
        const { x, y, width, height, value, index } = props;
        const stage = data[index];
        if (!stage || stage.conversion === null) return null;

        return (
            <g>
                <text
                    x={x + width + 10}
                    y={y + height / 2 + 5}
                    fill="#64748b"
                    textAnchor="start"
                    fontSize={10}
                    fontWeight="bold"
                    className="font-sans"
                >
                    {`↓ ${stage.conversion}%`}
                </text>
            </g>
        );
    };

    return (
        <div className="technical-card p-6 h-full flex flex-col group">
            <div className="flex items-center justify-between mb-6">
                <h3 className="ds-title-section">Funil de Vendas</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversão p/ Etapa</span>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
                        barSize={32}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{
                                border: 'none',
                                borderRadius: 12,
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            labelStyle={{ color: '#0f172a', fontWeight: 700, marginBottom: '4px' }}
                            itemStyle={{ fontSize: '12px', padding: 0 }}
                            formatter={(value, name, props) => [
                                <span className="font-bold">{value} leads <span className="text-slate-400 font-normal ml-1">({props.payload.conversion ? `${props.payload.conversion}% conv.` : 'Início'})</span></span>,
                                'Volume'
                            ]}
                        />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill || '#0F4C5C'}
                                    fillOpacity={0.9}
                                />
                            ))}
                            <LabelList dataKey="value" position="right" offset={8} style={{ fontSize: 12, fontWeight: 700, fill: '#1e293b' }} />
                            <LabelList content={renderCustomLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[10px] font-bold text-slate-500">Topo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-slate-500">Conversão</span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 font-mediumitalic">Dados atualizados em tempo real</p>
            </div>
        </div>
    );
}
