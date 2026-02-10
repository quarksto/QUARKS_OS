import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { StandardAvatar } from '../ui/StandardAvatar';

/**
 * SALES DASHBOARD V2 - Advanced Command Center
 * Symmetrical Bento Grid with high-fidelity functional widgets.
 */

export const SalesDashboardV2 = ({ metrics, funnel, activity, loading }) => {

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-canvas min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solar"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculando Fluxos V2...</p>
                </div>
            </div>
        );
    }

    const formatCurrency = (val) => {
        if (typeof val === 'string' && val.includes('R$')) return val;
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(num);
    };

    // Dummy data for sparklines
    const sparkData = [
        { v: 30 }, { v: 45 }, { v: 35 }, { v: 50 }, { v: 40 }, { v: 60 }, { v: 55 }
    ];

    const performanceData = [
        { name: 'Jan', real: 400000, meta: 350000 },
        { name: 'Fev', real: 550000, meta: 500000 },
        { name: 'Mar', real: 480000, meta: 600000 },
        { name: 'Abr', real: 750000, meta: 650000 },
        { name: 'Mai', real: 900000, meta: 750000 },
        { name: 'Jun', real: 850000, meta: 800000 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-canvas p-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-12 gap-4 max-w-[1600px] mx-auto auto-rows-min">

                {/* 1. KPI HUB - TOP LEFT (SPANS 8) */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-lg p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-petroleum">monitoring</span>
                            Visão Geral - KPIs
                        </h2>
                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.4% WoW
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AdvancedKPICell label="Leads Ativos" value={metrics?.activeLeads || 0} trend="+12%" data={sparkData} color="#0F4C5C" />
                        <AdvancedKPICell label="Propostas" value={metrics?.proposalsSent || 0} trend="+5%" data={sparkData} color="#F59E0B" />
                        <AdvancedKPICell label="Conversão" value={metrics?.conversionRate || '0%'} trend="-2.4%" data={sparkData} color="#0F4C5C" />
                        <AdvancedKPICell label="Receita" value={formatCurrency(metrics?.revenue)} trend="+18%" data={sparkData} color="#059669" />
                    </div>
                </div>

                {/* 2. LEAD HEALTH HEATMAP - TOP RIGHT (SPANS 4) */}
                <div className="col-span-12 lg:col-span-4 bg-white border border-slate-100 rounded-lg p-5 flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-solar">grid_view</span>
                            Saúde Comercial
                        </h2>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Atividade nos últimos 30 dias</p>
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className={`aspect-square rounded-sm ${i % 5 === 0 ? 'bg-slate-100' : 'bg-petroleum'} opacity-${[10, 30, 50, 70, 90][i % 5]}`}></div>
                        ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>Menos Ativo</span>
                        <div className="flex gap-1">
                            {[20, 40, 60, 80, 100].map(op => <div key={op} className={`size-2.5 rounded-sm bg-petroleum opacity-${op}`}></div>)}
                        </div>
                        <span>Mais Ativo</span>
                    </div>
                </div>

                {/* 3. PERFORMANCE HUB - CENTER (SPANS 8) */}
                <div className="col-span-12 lg:col-span-8 bg-white border border-slate-100 rounded-lg p-5 flex flex-col gap-6 min-h-[350px]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px] text-petroleum">area_chart</span>
                                Performance Financeira
                            </h2>
                            <p className="text-[11px] text-slate-400 font-medium mt-1">Real (Petroleum) vs Meta (Solar)</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <LegendDot color="bg-petroleum" label="Real" />
                            <LegendDot color="bg-solar" label="Meta" />
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `R$${val / 1000}k`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: 'none' }} />
                                <Area type="monotone" dataKey="real" stroke="#0F4C5C" strokeWidth={3} fill="#0F4C5C" fillOpacity={0.03} />
                                <Area type="monotone" dataKey="meta" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. SMART FEED - BOTTOM LEFT (SPANS 6) */}
                <div className="col-span-12 lg:col-span-6 bg-white border border-slate-100 rounded-lg p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-petroleum">history</span>
                            Atividade Recente
                        </h2>
                        <button className="text-[10px] font-bold text-petroleum hover:underline uppercase tracking-widest">Ver Tudo</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {activity?.slice(0, 3).map((item, idx) => (
                            <ActivityItem key={idx} item={item} />
                        )) || (
                                <>
                                    <ActivityItemPlaceholder name="Ana Souza" detail="Criou nova proposta" time="12 min" />
                                    <ActivityItemPlaceholder name="Sistema" detail="Contrato assinado" time="1h atrás" />
                                    <ActivityItemPlaceholder name="Carlos Mendes" detail="Lead atualizado" time="3h atrás" />
                                </>
                            )}
                    </div>
                </div>

                {/* 5. QUICK ACTIONS - BOTTOM RIGHT (SPANS 6) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                    <div className="bg-white border border-slate-100 rounded-lg p-5 flex flex-col gap-6 h-full">
                        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px] text-solar">bolt</span>
                            Ações Rápidas
                        </h2>
                        <div className="flex justify-around items-center">
                            <ActionButton icon="add" label="Novo Lead" primary />
                            <ActionButton icon="post_add" label="Enviar Proposta" />
                            <ActionButton icon="calendar_month" label="Agendar" />
                            <ActionButton icon="download" label="Exportar" />
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100/50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <span className="material-symbols-outlined text-[20px]">dns</span>
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-emerald-900">Status do Sistema</p>
                                <p className="text-[11px] text-emerald-600 font-medium">Todos os serviços operacionais</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const AdvancedKPICell = ({ label, value, trend, data, color }) => (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-transparent hover:border-slate-100 transition-all group">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-[26px] font-semibold text-slate-700 tracking-tight leading-none">{value}</p>
        <div className="flex items-center justify-between mt-auto">
            <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
            <div className="h-6 w-16">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const ActivityItem = ({ item }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
        <StandardAvatar name={item.user} size="sm" />
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <p className="text-[12px] font-bold text-slate-700">{item.user}</p>
                <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{item.action}</p>
        </div>
    </div>
);

const ActivityItemPlaceholder = ({ name, detail, time }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
            {name.charAt(0)}
        </div>
        <div className="flex-1">
            <div className="flex justify-between">
                <p className="text-[12px] font-bold text-slate-700">{name}</p>
                <span className="text-[10px] text-slate-400 font-medium">{time}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{detail}</p>
        </div>
    </div>
);

const ActionButton = ({ icon, label, primary }) => (
    <button className="flex flex-col items-center gap-2 group">
        <div className={`size-12 rounded-full flex items-center justify-center transition-all shadow-none group-hover:scale-105 group-active:scale-95 border
            ${primary ? 'bg-petroleum border-petroleum text-white' : 'bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-slate-100'}`}>
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-700 transition-colors">{label}</span>
    </button>
);

const LegendDot = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${color}`}></span>
        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{label}</span>
    </div>
);
