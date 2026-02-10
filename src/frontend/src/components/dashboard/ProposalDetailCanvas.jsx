import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

export default function ProposalDetailCanvas({ proposal }) {
    if (!proposal) return null;

    const formatCurrency = (val) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    // Mock data for ROI Projection (normally would be calculated based on proposal data)
    const roiData = [
        { year: 'Ano 0', balance: -(proposal.totalPrice || 0) },
        { year: 'Ano 1', balance: -(proposal.totalPrice * 0.85) },
        { year: 'Ano 2', balance: -(proposal.totalPrice * 0.70) },
        { year: 'Ano 3', balance: -(proposal.totalPrice * 0.55) },
        { year: 'Ano 4', balance: -(proposal.totalPrice * 0.40) },
        { year: 'Ano 5', balance: -(proposal.totalPrice * 0.25) },
        { year: 'Ano 6', balance: 5000 },
        { year: 'Ano 7', balance: 15000 },
        { year: 'Ano 10', balance: 45000 },
        { year: 'Ano 15', balance: 95000 },
    ];

    const consumptionData = [
        { name: 'Jan', value: 400 },
        { name: 'Fev', value: 450 },
        { name: 'Mar', value: 380 },
        { name: 'Abr', value: 420 },
        { name: 'Mai', value: 500 },
        { name: 'Jun', value: 550 },
        { name: 'Jul', value: 520 },
        { name: 'Ago', value: 480 },
        { name: 'Set', value: 440 },
        { name: 'Out', value: 410 },
        { name: 'Nov', value: 430 },
        { name: 'Dez', value: 460 },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBlock
                    label="Investimento Total"
                    value={formatCurrency(proposal.totalPrice)}
                    icon="payments"
                    subtext="Valor com impostos inclusos"
                />
                <MetricBlock
                    label="Payback Estimado"
                    value="4.8 Anos"
                    icon="timer"
                    color="text-solar"
                    subtext="Retorno sobre investimento"
                />
                <MetricBlock
                    label="Geração Mensal"
                    value={`${proposal.generationKwh || 0} kWh`}
                    icon="bolt"
                    color="text-emerald-600"
                    subtext="Média de produção solar"
                />
                <MetricBlock
                    label="Economia 25 Anos"
                    value={formatCurrency((proposal.savingsMonthly || 0) * 12 * 25)}
                    icon="savings"
                    color="text-emerald-700"
                    subtext="Estimativa de longo prazo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ROI / Payback Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-petroleum uppercase tracking-wider">Projeção de Retorno (ROI)</h3>
                            <p className="text-[11px] text-slate-500">Equilíbrio financeiro e lucro acumulado ao longo do tempo</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-solar"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Cashflow</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={roiData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBBC04" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#FBBC04" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="year"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                    formatter={(val) => formatCurrency(val)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#FBBC04"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Technical Specs Card */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-petroleum uppercase tracking-wider mb-4">Especificações do Kit</h3>
                    <div className="space-y-4 flex-1">
                        <SpecItem label="Painéis" value="12x Jinko Solar 550W" icon="calendar_view_month" />
                        <SpecItem label="Inversor" value="Growatt 6000TL3-S" icon="developer_board" />
                        <SpecItem label="Estrutura" value="Alumínio Anodizado" icon="architecture" />
                        <SpecItem label="Área de Telhado" value="28m² Necessários" icon="home" />
                        <SpecItem label="Peso Estimado" value="240kg Total" icon="weight" />
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100 italic text-[11px] text-slate-500">
                        * Especificações sujeitas a alteração após visita técnica local.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Environmental Impact */}
                <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-6 flex flex-col items-center text-center justify-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-4xl">eco</span>
                    <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Impacto Ambiental</h3>
                    <div className="mt-2 space-y-1">
                        <p className="text-2xl font-black text-emerald-700">1.2 Ton</p>
                        <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest leading-tight">CO2 Evitado por Ano</p>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-emerald-500 text-xl">forest</span>
                            <span className="text-xs font-bold text-emerald-800">14 Árvores</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-emerald-500 text-xl">directions_car</span>
                            <span className="text-xs font-bold text-emerald-800">4.5k km</span>
                        </div>
                    </div>
                </div>

                {/* Small Consumption Chart */}
                <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-6 flex flex-col h-[280px]">
                    <h3 className="text-sm font-bold text-petroleum uppercase tracking-wider mb-4">Perfil de Consumo vs. Produção</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={consumptionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {consumptionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 11 ? '#FBBC04' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Os dados representam a média histórica informada pelo cliente.</p>
                </div>
            </div>
        </div>
    );
}

function MetricBlock({ label, value, icon, color = "text-petroleum-700", subtext }) {
    return (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-none hover:shadow-sm transition-all flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">{label}</p>
                <span className={`material-symbols-outlined ${color} text-[20px]`}>{icon}</span>
            </div>
            <div className={`text-2xl font-black ${color} tracking-tight leading-none`}>{value}</div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{subtext}</p>
        </div>
    );
}

function SpecItem({ label, value, icon }) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-petroleum/10 transition-colors">
                <span className="material-symbols-outlined text-petroleum-400 group-hover:text-petroleum-600 text-[18px]">{icon}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-petroleum-700 transition-colors">{value}</span>
            </div>
        </div>
    );
}
