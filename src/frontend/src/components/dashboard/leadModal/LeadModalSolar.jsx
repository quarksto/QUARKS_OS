import React from 'react';
import { formatCurrencyCompact } from '../../../utils/pipeline';

export const LeadModalSolar = ({ lead }) => {
    const consumption = lead?.consumption ?? 0;
    const kwp = consumption ? (consumption / 120).toFixed(1) : '0.0';
    const faturaMensal = consumption ? consumption * 0.95 : 0;

    return (
        <section className="technical-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="ds-title flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-slate-400 text-[18px] ds-icon-w300">wb_sunny</span>
                    Dados Solares
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Consumo Médio</label>
                    <div className="flex items-end gap-1">
                        <span className="ds-display-l text-slate-900 tabular-nums">{consumption}</span>
                        <span className="ds-meta mb-1">kWh/mês</span>
                    </div>
                </div>
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Valor Fatura</label>
                    <div className="flex items-end gap-1">
                        <span className="ds-display-l text-slate-900 tabular-nums">{formatCurrencyCompact(faturaMensal)}</span>
                        <span className="ds-meta mb-1">/mês</span>
                    </div>
                </div>
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Potência Estimada</label>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px] ds-icon-w300">electric_bolt</span>
                        <span className="ds-data text-slate-800">{kwp} kWp</span>
                    </div>
                </div>
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Economia Anual</label>
                    <div className="flex items-end gap-1">
                        <span className="ds-display-l text-emerald-600 tabular-nums">{formatCurrencyCompact(faturaMensal * 12 * 0.85)}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
