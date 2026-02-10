import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { StandardAvatar } from '../ui/StandardAvatar';
import { useNavigate } from 'react-router-dom';

/**
 * SALES DASHBOARD SOLAR - Command Center v1.4 (BENTO VERSION)
 * High-fidelity dashboard based on the Bento-Grid layout and Quarks DS v1.4 standards.
 */

export const SalesDashboardSolar = ({ metrics, funnel, activity, loading }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-canvas min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solar"></div>
                    <p className="ds-meta text-slate-400 uppercase">Calculando Fluxos Solar...</p>
                </div>
            </div>
        );
    }

    const formatCurrency = (val) => {
        if (typeof val === 'string' && val.includes('R$')) return val;
        const num = parseFloat(val) || 0;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(num);
    };

    // Simulated data for the Production Hub
    const productionData = [
        { name: '01', solar: 60, grid: 40 },
        { name: '05', solar: 40, grid: 50 },
        { name: '10', solar: 80, grid: 60 },
        { name: '15', solar: 55, grid: 45 },
        { name: '20', solar: 90, grid: 70 },
        { name: '25', solar: 45, grid: 55 },
        { name: '30', solar: 75, grid: 65 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-canvas p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto auto-rows-max">

                {/* KPI TILES (Row 1) */}
                <KPITile
                    label="Novos Leads"
                    value={metrics?.activeLeads || 0}
                    icon="person_add"
                    trend="+12%"
                    trendUp={true}
                    color="emerald"
                    onClick={() => navigate('/leads')}
                />
                <KPITile
                    label="Propostas"
                    value={metrics?.proposalsSent || 0}
                    icon="description"
                    trend="+5%"
                    trendUp={true}
                    color="slate"
                    onClick={() => navigate('/proposals')}
                />
                <KPITile label="Conversão" value={metrics?.conversionRate || '0%'} icon="percent" trend="-2%" trendUp={false} color="red" />
                <KPITile label="Receita" value={formatCurrency(metrics?.revenue || 0)} icon="payments" trend="+18%" trendUp={true} color="slate" isCurrency />

                {/* HUB DE PRODUÇÃO (2x2) */}
                <div className="md:col-span-2 lg:col-span-2 row-span-2 ds-card p-6 flex flex-col transition-all hover:border-slate-300 group">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Hub de Produção</h3>
                            <p className="ds-label text-slate-400 uppercase">Geração Total vs. Consumo (30 dias)</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LegendItem color="bg-solar" label="Solar" />
                            <LegendItem color="bg-petroleum" label="Rede" />
                        </div>
                    </div>
                    <div className="flex-1 w-full min-w-0 h-64 min-h-64 rounded-lg overflow-hidden border border-slate-50">
                        <ResponsiveContainer width="100%" height="100%" debounce={1}>
                            <BarChart data={productionData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }} barGap={0}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: 'none', fontSize: '11px', fontWeight: '600' }}
                                />
                                <Bar dataKey="solar" fill="#f59f0a" radius={[2, 2, 0, 0]} barSize={20} />
                                <Bar dataKey="grid" fill="#0F4C5C" radius={[2, 2, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* EFICIÊNCIA ATUAL (1x1) */}
                <div className="col-span-1 ds-card p-6 flex flex-col items-center justify-center relative transition-all hover:border-slate-300">
                    <h3 className="text-lg font-semibold text-slate-800 absolute top-6 left-6">Eficiência Atual</h3>
                    <div className="relative size-44 flex items-center justify-center mt-4">
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle className="text-slate-50" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="6"></circle>
                            <circle className="text-solar" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="70.336" strokeLinecap="round" strokeWidth="6"></circle>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="ds-display-xl text-slate-800 font-semibold tracking-tighter">72%</span>
                            <span className="ds-label text-slate-400 uppercase">Output</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-white rounded-full border border-emerald-200">
                        <span className="material-symbols-outlined ds-icon-w300 text-emerald-600 text-[16px]" aria-hidden>check_circle</span>
                        <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-widest">Sistema Operacional</span>
                    </div>
                </div>

                {/* ROI FINANCEIRO (1x1) */}
                <div className="col-span-1 ds-card p-6 flex flex-col transition-all hover:border-slate-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">ROI Financeiro</h3>
                        <span className="material-symbols-outlined text-slate-300">more_horiz</span>
                    </div>
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg group transition-colors hover:border-slate-200">
                            <p className="ds-label mb-1">Payback Estimado</p>
                            <div className="flex items-center justify-between">
                                <span className="ds-display-l text-[26px] text-slate-800 tracking-tight">3.5 Anos</span>
                                <span className="material-symbols-outlined ds-icon-w300 text-slate-300 text-[20px] group-hover:text-petroleum transition-colors">calendar_month</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg group transition-colors hover:border-slate-200">
                                <p className="ds-label mb-1">TIR (a.m.)</p>
                                <span className="ds-display-l text-[26px] text-slate-800 tracking-tight">2.4%</span>
                            </div>
                            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg group transition-colors hover:border-slate-200">
                                <p className="ds-label mb-1">VPL</p>
                                <span className="ds-display-l text-[26px] text-slate-800 tracking-tight">R$ 45k</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FUNIL DE VENDAS (3-col span) */}
                <div className="md:col-span-3 ds-card p-6 flex flex-col transition-all hover:border-slate-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Funil de Vendas</h3>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">Atualizado agora</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest px-2">
                            <div>Leads</div>
                            <div>Visita</div>
                            <div>Proposta</div>
                            <div>Contrato</div>
                            <div>Instalação</div>
                        </div>
                        <div className="flex w-full h-12 gap-1 overflow-hidden rounded-lg bg-slate-50">
                            <div className="h-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm relative group hover:bg-slate-200 transition-colors" style={{ width: '32%' }}>{funnel?.leads || 0}</div>
                            <div className="h-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm relative group hover:bg-slate-300 transition-colors" style={{ width: '22%' }}>{funnel?.visita || 0}</div>
                            <div className="h-full bg-solar flex items-center justify-center text-white font-semibold text-sm relative group hover:bg-amber-600 transition-colors" style={{ width: '18%' }}>{funnel?.proposta || 0}</div>
                            <div className="h-full bg-petroleum flex items-center justify-center text-white font-semibold text-sm relative group hover:bg-petroleum/90 transition-colors" style={{ width: '14%' }}>{funnel?.contrato || 0}</div>
                            <div className="h-full bg-petroleum flex items-center justify-center text-white font-semibold text-sm relative group hover:bg-petroleum/90 transition-colors" style={{ width: '14%' }}>{funnel?.instalacao || 0}</div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-center text-[9px] text-slate-400 font-medium uppercase tracking-tighter opacity-70">
                            <div>Qualificação</div>
                            <div>Técnica</div>
                            <div>Comercial</div>
                            <div>Fechamento</div>
                            <div>Finalizada</div>
                        </div>
                    </div>
                </div>

                {/* ATIVIDADE RECENTE (1x1) */}
                <div className="ds-card p-6 flex flex-col transition-all hover:border-slate-300">
                    <h3 className="text-lg font-semibold text-slate-800 tracking-tight mb-4">Atividade Recente</h3>
                    <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin scrollbar-thumb-slate-100">
                        {activity && activity.length > 0 ? (
                            activity.map((item) => (
                                <TimelineItem
                                    key={item.id}
                                    dotColor={item.type === 'NEW' ? 'bg-slate-400' : item.type === 'CLOSED_WON' ? 'bg-emerald-500' : 'bg-solar'}
                                    text={item.text}
                                    time={item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                />
                            ))
                        ) : (
                            <p className="text-center text-xs text-slate-400 mt-10">Nenhuma atividade recente.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// BENTO SUB-COMPONENTS

function KPITile({ label, value, icon, trend, trendUp, color, isCurrency, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`ds-card p-6 flex flex-col justify-between h-auto min-h-[120px] hover:border-slate-300 transition-all duration-200 group shadow-none active:scale-[0.98] ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
        >
            <div className="flex justify-between items-start mb-6">
                <p className="ds-label text-slate-400">{label}</p>
                <div className="size-8 flex items-center justify-center text-slate-300 group-hover:text-petroleum transition-colors rounded-full bg-slate-50/50 border border-transparent group-hover:border-slate-100">
                    <span className="material-symbols-outlined ds-icon-w300 text-[20px]">{icon}</span>
                </div>
            </div>

            <div className="flex items-baseline gap-3">
                <h4 className="text-[36px] font-semibold text-slate-800 leading-none tracking-tight tabular-nums">{value}</h4>

                {!isCurrency && trend && (
                    <span className={`${trendUp ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'} text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center uppercase tracking-tighter`}>
                        <span className="material-symbols-outlined ds-icon-w300 text-[12px] mr-1">{trendUp ? 'trending_up' : 'trending_down'}</span>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${color}`}></span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function TimelineItem({ dotColor, text, time }) {
    return (
        <div className="flex gap-3 items-start group cursor-default">
            <div className={`mt-1.5 size-2 rounded-full ${dotColor} shrink-0 group-hover:scale-125 transition-transform`}></div>
            <div className="flex flex-col min-w-0">
                <p className="text-[12px] font-medium text-slate-700 leading-tight truncate">{text}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{time}</p>
            </div>
        </div>
    );
}
