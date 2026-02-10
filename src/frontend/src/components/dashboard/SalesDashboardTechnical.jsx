import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/**
 * SALES DASHBOARD TECHNICAL - Command Center v1.4 (High-Fidelity)
 * Focuses on engineering metrics, inverter efficiency, and predictive maintenance.
 */

export const SalesDashboardTechnical = ({ metrics, loading }) => {

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-canvas min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solar"></div>
                    <p className="ds-meta text-slate-400 font-semibold uppercase tracking-widest">Sincronizando Dados de Campo...</p>
                </div>
            </div>
        );
    }

    // High-fidelity energy balance data (Last 12h)
    const energyBalanceData = [
        { time: '06:00', solar: 15, grid: 45 },
        { time: '08:00', solar: 45, grid: 35 },
        { time: '10:00', solar: 75, grid: 15 },
        { time: '12:00', solar: 95, grid: 5 },
        { time: '14:00', solar: 85, grid: 10 },
        { time: '16:00', solar: 60, grid: 25 },
        { time: '18:00', solar: 20, grid: 55 },
    ];

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-canvas p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto auto-rows-max">

                {/* KPI TILES (Engineering Focus) */}
                <TechnicalKPI label="Eficiência Inversores" value="98.2%" icon="electric_bolt" trend="+0.4%" trendUp={true} color="emerald" />
                <TechnicalKPI label="Produção Diária" value="420" suffix="kWh" icon="solar_power" />
                <TechnicalKPI label="Módulos Ativos" value="1.240" suffix="/ 1.250" icon="settings_input_component" />
                <TechnicalKPI label="Payback Médio" value="3.2" suffix="anos" icon="history" />

                {/* BALANÇO ENERGÉTICO (3x2) */}
                <div className="md:col-span-3 row-span-2 ds-card p-6 flex flex-col duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="ds-title-section text-slate-800">Balanço Energético</h3>
                            <p className="ds-meta text-slate-400 mt-1 uppercase tracking-widest">Geração Solar vs Consumo da Rede (Últimas 12h)</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <LegendItem color="bg-slate-800" label="Geração Solar" />
                            <LegendItem color="bg-solar" label="Consumo Rede" />
                        </div>
                    </div>
                    <div className="flex-1 w-full h-80 rounded-lg overflow-hidden border border-slate-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={energyBalanceData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }} barGap={0}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: 'none', fontSize: '11px', fontWeight: '600' }}
                                />
                                <Bar dataKey="solar" fill="#1e293b" radius={[2, 2, 0, 0]} barSize={32} />
                                <Bar dataKey="grid" fill="#f59e0b" radius={[2, 2, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ALERTAS TÉCNICOS (1x2) */}
                <div className="col-span-1 row-span-2 ds-card flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex items-center gap-2">
                        <span className="material-symbols-outlined ds-icon-w300 text-solar text-[20px]">notifications_active</span>
                        <h3 className="ds-title-section text-slate-800">Alertas Técnicos</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <TechnicalAlert
                            type="critical"
                            title="Inversor 04: Sobrecarga"
                            meta="Detectado há 15 min • Zona Norte"
                            icon="warning"
                        />
                        <TechnicalAlert
                            type="warning"
                            title="Manutenção Preventiva"
                            meta="Módulo B • Amanhã, 08:00"
                            icon="build"
                        />
                        <TechnicalAlert
                            type="info"
                            title="Atualização de Firmware"
                            meta="3 inversores atualizados"
                            icon="cloud_sync"
                        />
                        <TechnicalAlert
                            type="predictive"
                            title="Queda de Eficiência Prevista"
                            meta="String 02 • Sombra provável"
                            icon="insights"
                        />
                    </div>
                </div>

                {/* STATUS DOS INVERSORES (4-col span) */}
                <div className="lg:col-span-4 ds-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="ds-title-section text-slate-800">Status dos Inversores</h3>
                        <button className="text-[10px] font-semibold text-solar uppercase tracking-widest flex items-center gap-1 hover:text-amber-600 transition-colors">
                            Ver todos registros
                            <span className="material-symbols-outlined ds-icon-w300 text-[14px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[13px]">
                            <thead className="bg-slate-50/50 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-50">
                                <tr>
                                    <th className="px-6 py-3 tracking-widest font-semibold">Inversor</th>
                                    <th className="px-6 py-3 tracking-widest font-semibold">Status</th>
                                    <th className="px-6 py-3 tracking-widest font-semibold">Geração (Hoje)</th>
                                    <th className="px-6 py-3 tracking-widest font-semibold">Eficiência</th>
                                    <th className="px-6 py-3 tracking-widest font-semibold text-right">Diagnóstico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <InverterRow id="INV-A01" status="Online" gen="142 kWh" eff={98.5} statusColor="emerald" />
                                <InverterRow id="INV-A02" status="Online" gen="138 kWh" eff={97.2} statusColor="emerald" />
                                <InverterRow id="INV-A04" status="Sobrecarga" gen="89 kWh" eff={65.0} statusColor="rose" isWarning />
                                <InverterRow id="INV-B01" status="Online" gen="151 kWh" eff={99.1} statusColor="emerald" />
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

// SUB-COMPONENTS

function TechnicalKPI({ label, value, suffix, icon, trend, trendUp }) {
    return (
        <div className="ds-card p-6 flex flex-col justify-between h-[160px] duration-300 group">
            <div className="flex justify-between items-start">
                <span className="ds-label">{label}</span>
                <span className="material-symbols-outlined ds-icon-w300 text-slate-300 group-hover:text-solar transition-colors text-[20px]">{icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <h4 className="ds-display-xl">{value}</h4>
                {suffix && <span className="text-[14px] font-semibold text-slate-400 mb-1.5">{suffix}</span>}
                {trend && (
                    <span className={`${trendUp ? 'text-emerald-500' : 'text-rose-500'} text-[11px] font-semibold mb-1.5 flex items-center`}>
                        <span className="material-symbols-outlined text-[14px] mr-1">{trendUp ? 'arrow_upward' : 'arrow_downward'}</span>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

function TechnicalAlert({ type, title, meta, icon }) {
    const configs = {
        critical: { border: 'border-red-200', text: 'text-red-600', bg: 'bg-white' },
        warning: { border: 'border-amber-200', text: 'text-amber-600', bg: 'bg-white' },
        info: { border: 'border-slate-200', text: 'text-slate-600', bg: 'bg-white' },
        predictive: { border: 'border-slate-200', text: 'text-slate-600', bg: 'bg-white' }
    };
    const c = configs[type];

    return (
        <div className={`p-3 rounded-lg border ${c.border} ${c.bg} transition-all hover:border-slate-300 group cursor-pointer`}>
            <div className="flex justify-between items-start mb-1.5">
                <span className={`material-symbols-outlined ds-icon-w300 text-[18px] ${c.text}`}>{icon}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider border ${c.border.replace('100', '200')} ${c.text}`}>
                    {type === 'predictive' ? 'IA' : type}
                </span>
            </div>
            <p className="text-[12px] font-semibold text-slate-700 leading-tight">{title}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{meta}</p>
        </div>
    );
}

function InverterRow({ id, status, gen, eff, statusColor, isWarning }) {
    return (
        <tr className={`group transition-colors ${isWarning ? 'border-l-2 border-rose-200' : ''} hover:bg-slate-50/50`}>
            <td className="px-6 py-4 font-semibold text-slate-700">{id}</td>
            <td className="px-6 py-4">
                <div className="badge-kanban py-1">
                    <span className={`badge-kanban-dot bg-${statusColor}-500`}></span>
                    <span className={`text-${statusColor}-700`}>{status}</span>
                </div>
            </td>
            <td className="px-6 py-4 font-mono text-slate-600 font-medium">{gen}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 bg-${statusColor}-500`} style={{ width: `${eff}%` }}></div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{eff}%</span>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="text-slate-300 hover:text-solar transition-colors">
                    <span className="material-symbols-outlined ds-icon-w300 text-[18px]">analytics</span>
                </button>
            </td>
        </tr>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`size-2 rounded-sm ${color}`}></span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}
