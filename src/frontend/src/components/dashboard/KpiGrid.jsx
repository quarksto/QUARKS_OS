import React from 'react';

const CardWrapper = ({ title, children, trend, period, meta, onClick }) => (
    <div
        onClick={onClick}
        className={`technical-card p-6 flex flex-col h-[160px] relative overflow-hidden group hover:border-petroleum/30 transition-colors duration-200 rounded-lg shadow-none hover:shadow-sm ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="flex justify-between items-start mb-2">
            <h3 className="ds-title-section text-slate-700">{title}</h3>
            {trend && (
                <span className={`text-meta px-2 py-0.5 rounded-full border flex items-center gap-1 ${trend.positive ? 'border-emerald-200 text-emerald-700 bg-white' : 'border-red-200 text-red-600 bg-white'
                    }`}>
                    {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
            )}
        </div>

        <div className="flex-1 flex flex-col justify-end relative z-10">
            {children}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
            </div>
        </div>
    </div>
);

// 1. Leads Card - Linear Progress
const LeadsCard = ({ value, target = 150, trend, onClick }) => {
    const progress = target > 0 ? Math.min((value / target) * 100, 100) : 0;
    const restante = Math.max(0, target - value);
    return (
        <CardWrapper
            title="Leads Gerados"
            trend={trend}
            meta={target != null ? `META: ${target}` : undefined}
            period={restante >= 0 ? `RESTANTE: ${restante}` : undefined}
            onClick={onClick}
        >
            <div className="mb-2">
                <span className="ds-display-xl tabular-nums">{value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-solar h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
        </CardWrapper>
    );
};

// 2. Conversion Card - Donut Chart
const ConversionCard = ({ value, target, trend, onClick }) => {
    const numValue = parseFloat(value);
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (numValue / 100) * circumference;

    return (
        <CardWrapper
            title="Conversão"
            trend={trend}
            meta={target != null ? `META: ${target}%` : undefined}
            period={trend ? `DELTA: ${trend.positive ? '+' : ''}${trend.value}` : undefined}
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r={radius} stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                        <circle
                            cx="28" cy="28" r={radius}
                            stroke="#F59E0B" strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-solar">
                        {Math.round(numValue)}%
                    </div>
                </div>
                <div>
                    <span className="ds-display-l tabular-nums">{value}</span>
                    <p className="text-[10px] text-slate-400">Tx. Sucesso</p>
                </div>
            </div>
        </CardWrapper>
    );
};

// 3. Pipeline Card - Segmented Bar
const PipelineCard = ({ value, target, trend, onClick }) => (
    <CardWrapper
        title="Pipeline Ativo"
        trend={trend}
        meta={target != null ? `META: R$ ${(target / 1e6).toFixed(1)}M` : undefined}
        period={undefined}
        onClick={onClick}
    >
        <div className="flex items-baseline gap-1 mb-2">
            <span className="ds-display-l tabular-nums">{value}</span>
        </div>
        <div className="flex gap-1 h-1.5 w-full">
            <div className="w-[40%] bg-petroleum rounded-l-full"></div>
            <div className="w-[30%] bg-petroleum-400"></div>
            <div className="w-[20%] bg-petroleum-300"></div>
            <div className="w-[10%] bg-slate-200 rounded-r-full"></div>
        </div>
    </CardWrapper>
);

// 4. Automations Card - Mini Histogram
const AutomationsCard = ({ value, trend, onClick }) => (
    <CardWrapper
        title="Automações"
        trend={trend}
        meta={undefined}
        period={undefined}
        onClick={onClick}
    >
        <div className="flex justify-between items-end h-[42px] mb-1 gap-1">
            <div className="flex flex-col justify-end gap-1 w-full h-full">
                <span className="ds-display-l leading-none tabular-nums">{value}</span>
                <span className="text-[10px] text-slate-400">ops</span>
            </div>
            <div className="flex items-end gap-1 h-full pb-1">
                {[40, 65, 45, 90, 30, 60, 40].map((h, i) => (
                    <div key={i} className={`w-2 rounded-t-sm ${i === 3 ? 'bg-solar-400' : 'bg-solar-100'}`} style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>
    </CardWrapper>
);

export const KpiGrid = ({ metrics, onNavigate }) => {
    const {
        activeLeads = 0,
        conversionRate = '0%',
        revenue = 'R$ 0',
        revenueRaw,
        automations = 0,
        goals = {},
        deltas = {}
    } = metrics || {};

    const formattedRevenue = typeof revenue === 'number'
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(revenue)
        : revenue;

    const leadTrend = deltas.leads != null ? { positive: Number(deltas.leads) >= 0, value: deltas.leads } : null;
    const convTrend = deltas.conversion != null ? { positive: Number(deltas.conversion) >= 0, value: deltas.conversion } : null;
    const revTrend = deltas.revenue != null ? { positive: Number(deltas.revenue) >= 0, value: deltas.revenue } : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <LeadsCard value={activeLeads} target={goals.leads} trend={leadTrend} onClick={() => onNavigate && onNavigate('leads')} />
            <ConversionCard value={String(conversionRate).replace('%', '')} target={goals.conversion} trend={convTrend} onClick={() => onNavigate && onNavigate('funnel')} />
            <PipelineCard value={formattedRevenue} target={goals.revenue} trend={revTrend} onClick={() => onNavigate && onNavigate('proposals')} />
            <AutomationsCard value={automations} trend={null} onClick={() => onNavigate && onNavigate('settings')} />
        </div>
    );
};
