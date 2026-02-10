import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

/**
 * LeadDetailCanvas
 * 
 * "Command Center" view for a specific lead.
 * Implements the "Canvas de Alta Fidelidade" design from Stitch.
 * 
 * Props:
 * - lead: The lead data object.
 * - loading: Boolean.
 */
export function LeadDetailCanvas({ lead, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="w-10 h-10 border-2 border-slate-200 border-t-petroleum rounded-full animate-spin" />
            </div>
        );
    }

    if (!lead) return null;

    // --- Mock Data Generators (Replace with real data mappings) ---

    // BANT Scores (0-100) - Mocked based on completeness or status
    const bant = {
        budget: 80,
        authority: 100,
        need: 60,
        timeline: 40,
        score: 88, // Overall
    };

    // Energy Data Mock
    const energyData = [
        { month: 'JAN', current: 40, projected: 60 },
        { month: 'MAR', current: 50, projected: 75 },
        { month: 'MAI', current: 45, projected: 80 },
        { month: 'JUL', current: 60, projected: 95 },
        { month: 'SET', current: 55, projected: 90 },
        { month: 'NOV', current: 65, projected: 100 },
    ];

    return (
        <div className="w-full bg-canvas min-h-screen font-sans text-petroleum-900">

            {/* Main Grid Canvas */}
            <main className="grid grid-cols-1 xl:grid-cols-12 gap-px bg-slate-100 border-t border-slate-100">

                {/* Col 1: BANT & Tech Specs (4 cols) */}
                <div className="col-span-12 xl:col-span-4 bg-canvas flex flex-col gap-px">

                    {/* BANT Matrix */}
                    <div className="bg-white p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="ds-label">Matriz BANT</h3>
                            <span className="text-meta">SCORE: {bant.score}/100</span>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                            {/* Budget */}
                            <div className="bg-white p-4">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Orçamento</p>
                                <div className="flex gap-0.5 h-1.5 w-full">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`flex-1 ${i < 3 ? 'bg-petroleum-600' : 'bg-petroleum-600/20'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono mt-2 text-petroleum-900">R$ 250k - 500k</p>
                            </div>

                            {/* Authority */}
                            <div className="bg-white p-4">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Autoridade</p>
                                <div className="flex gap-0.5 h-1.5 w-full">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex-1 bg-petroleum-600" />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono mt-2 text-petroleum-900">Decisor C-Level</p>
                            </div>

                            {/* Need */}
                            <div className="bg-white p-4">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Necessidade</p>
                                <div className="flex gap-0.5 h-1.5 w-full">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`flex-1 ${i < 2 ? 'bg-petroleum-600' : 'bg-petroleum-600/20'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono mt-2 text-petroleum-900">Redução de Custo</p>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white p-4">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Cronograma</p>
                                <div className="flex gap-0.5 h-1.5 w-full">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className={`flex-1 ${i < 3 ? 'bg-petroleum-600' : 'bg-petroleum-600/20'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono mt-2 text-petroleum-900">Imediato (Q1)</p>
                            </div>
                        </div>
                    </div>

                    {/* Tech Specs */}
                    <div className="bg-white p-6 grow">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Especificações Técnicas</h3>
                        <div className="space-y-4">
                            <SpecRow label="Área de Telhado" value="1.240,00 m²" />
                            <SpecRow label="Coordenadas GPS" value="-23.5505, -46.6333" />
                            <SpecRow label="Compatibilidade" value="Trifásico 220V" />
                            <SpecRow label="Material" value="Metálico Sandwich" />
                            <SpecRow label="Inclinação" value="12.5° SUL" />
                            <SpecRow label="Concessionária" value="ENEL SP" />
                        </div>

                        <div className="mt-8 p-4 bg-petroleum-50 rounded border border-petroleum-100">
                            <p className="text-[10px] font-bold text-petroleum-700 uppercase mb-1">Nota de Engenharia</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Estrutura requer reforço no quadrante norte devido à fadiga térmica detectada na visita técnica prévia.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Col 2: Energy Charts (5 cols) */}
                <div className="col-span-12 xl:col-span-5 bg-white p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="ds-label">Espectro de Energia</h3>
                            <p className="ds-title-section mt-1">Consumo Histórico x Projeção</p>
                        </div>
                        <div className="flex gap-4">
                            <LegendItem color="bg-petroleum-600" label="Atual" />
                            <LegendItem color="bg-petroleum-200" label="Projetado" />
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                                <defs>
                                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#23576C" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#23576C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: 'none' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}
                                />
                                <Area type="step" dataKey="projected" stroke="#94a3b8" fill="url(#colorProjected)" strokeDasharray="4 4" />
                                <Area type="step" dataKey="current" stroke="#23576C" fill="#23576C" fillOpacity={0.8} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Metrics Grid */}
                    <div className="mt-16 grid grid-cols-3 gap-8">
                        <MetricBox label="Pico de Demanda" value="84.2" unit="kW" />
                        <MetricBox label="Consumo Mensal" value={lead.consumption || "0"} unit="kWh" />
                        <MetricBox label="Eficiência Sistêmica" value="94" unit="%" color="text-emerald-600" />
                    </div>

                    {/* Comparative Analysis */}
                    <div className="mt-12 border-t border-slate-100 pt-8">
                        <h3 className="ds-label mb-4">Análise Comparativa</h3>
                        <div className="space-y-3">
                            <AnalysisBar label="PAYBACK" value="3.2 ANOS" percentage={45} />
                            <AnalysisBar label="ROI (25A)" value="412%" percentage={82} />
                        </div>
                    </div>
                </div>

                {/* Col 3: Stakeholders & Timeline (3 cols) */}
                <div className="col-span-12 xl:col-span-3 bg-canvas flex flex-col gap-px">
                    {/* Stakeholders */}
                    <div className="bg-white p-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Stakeholders</h3>
                        <div className="space-y-4">
                            <Stakeholder name="Ricardo Mendes" role="Diretor de Operações" />
                            <Stakeholder name="Ana Paula Silveira" role="Gestora Financeira" />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-6 grow">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Atividade Recente</h3>
                        <div className="relative border-l border-slate-100 pl-6 space-y-8">
                            {(lead.activity || []).slice(0, 3).map((act, idx) => (
                                <TimelineItem
                                    key={idx}
                                    date={act.created_at ? new Date(act.created_at).toLocaleDateString() : 'Hoje'}
                                    title={act.type || 'Atualização'}
                                    desc={act.description || 'Sem descrição'}
                                    isFirst={idx === 0}
                                />
                            ))}
                            {(!lead.activity || lead.activity.length === 0) && (
                                <p className="text-xs text-slate-400">Nenhuma atividade recente.</p>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white p-6 border-t border-slate-100">
                        <button className="w-full flex items-center justify-center gap-2 px-4 h-10 bg-petroleum hover:bg-petroleum/90 text-white text-[11px] font-bold rounded-full uppercase tracking-wider transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Criar Nova Tarefa
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}

// --- Sub-components ---

function SpecRow({ label, value }) {
    return (
        <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className="text-xs font-mono font-bold text-petroleum-900">{value}</span>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${color}`}></div>
            <span className="text-[10px] font-bold uppercase text-slate-500">{label}</span>
        </div>
    );
}

function MetricBox({ label, value, unit, color = "text-petroleum" }) {
    return (
        <div>
            <p className="ds-label">{label}</p>
            <p className={`text-[24px] font-semibold tracking-tighter ${color} mt-1 tabular-nums`}>
                {value} <span className="text-[10px] uppercase font-bold text-slate-400">{unit}</span>
            </p>
        </div>
    );
}

function AnalysisBar({ label, value, percentage }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-24 text-[10px] font-bold text-slate-500">{label}</div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-petroleum-600 h-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="w-16 text-right text-[10px] font-mono font-bold text-petroleum-900">{value}</div>
        </div>
    );
}

function Stakeholder({ name, role }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-lg">person</span>
            </div>
            <div>
                <p className="text-xs font-bold text-petroleum-900">{name}</p>
                <p className="text-[10px] text-slate-500">{role}</p>
            </div>
        </div>
    );
}

function TimelineItem({ date, title, desc, isFirst }) {
    return (
        <div className="relative">
            <div className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full flex items-center justify-center border-2 ${isFirst ? 'bg-white border-petroleum-600' : 'bg-canvas border-slate-100'}`}>
                {isFirst && <div className="w-1 h-1 bg-petroleum-600 rounded-full"></div>}
            </div>
            <p className={`text-[10px] font-mono font-bold ${isFirst ? 'text-petroleum-600' : 'text-slate-400'}`}>{date}</p>
            <p className="text-xs font-bold text-petroleum-900 mt-1">{title}</p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{desc}</p>
        </div>
    );
}
