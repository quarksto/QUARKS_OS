import React, { useState, useEffect } from 'react';
import { formatCurrencyCompact } from '../../../utils/pipeline';
import api from '../../../services/api';

/**
 * Card de insights da Google Solar API.
 * Exibe potencial do telhado quando backend retorna dados.
 * Placeholder com CTA "Dimensionar" quando não houver API configurada.
 */
export const LeadModalSolarInsights = ({ lead, onDimensionar }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lead?.id || !lead?.location) return;

        // setLoading(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(null);
        api.get(`/leads/${lead.id}/solar`)
            .then((res) => setInsights(res.data))
            .catch((err) => {
                if (err?.response?.status !== 404) setError(err?.message);
            })
            .finally(() => setLoading(false));
    }, [lead?.id, lead?.location]);

    const hasInsights = insights && (insights.roofArea || insights.yearlyEnergy || insights.recommendedCapacity);

    if (loading) {
        return (
            <section className="technical-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="ds-title flex items-center gap-2 text-slate-900">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">wb_twilight</span>
                        Potencial Solar (Google)
                    </h3>
                </div>
                <div className="h-24 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-slate-200 border-t-petroleum rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (hasInsights) {
        return (
            <section className="technical-card p-5 border-l-4 border-l-solar-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="ds-title flex items-center gap-2 text-slate-900">
                        <span className="material-symbols-outlined text-solar-500 text-[18px]">wb_twilight</span>
                        Potencial Solar (Google)
                    </h3>
                    <span className="badge-kanban-origin text-[10px]">Solar API</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    {insights.roofArea != null && (
                        <div>
                            <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Área útil telhado</label>
                            <span className="ds-display-l text-slate-900 tabular-nums">{insights.roofArea}</span>
                            <span className="ds-meta ml-1">m²</span>
                        </div>
                    )}
                    {insights.yearlyEnergy != null && (
                        <div>
                            <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Energia anual</label>
                            <span className="ds-display-l text-emerald-600 tabular-nums">{insights.yearlyEnergy?.toLocaleString('pt-BR')}</span>
                            <span className="ds-meta ml-1">kWh</span>
                        </div>
                    )}
                    {insights.recommendedCapacity != null && (
                        <div>
                            <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Potência recomendada</label>
                            <span className="ds-display-l text-slate-900 tabular-nums">{insights.recommendedCapacity}</span>
                            <span className="ds-meta ml-1">kWp</span>
                        </div>
                    )}
                    {insights.savingsAnnual != null && (
                        <div>
                            <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Economia anual</label>
                            <span className="ds-display-l text-emerald-600 tabular-nums">{formatCurrencyCompact(insights.savingsAnnual)}</span>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="technical-card p-5 border border-dashed border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="ds-title flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">wb_twilight</span>
                    Potencial Solar (Google)
                </h3>
            </div>
            <p className="ds-body text-slate-500 mb-4">
                Configure a Google Solar API no backend para exibir o potencial do telhado (área útil, energia anual e recomendação de sistema).
            </p>
            <button
                type="button"
                onClick={() => onDimensionar?.()}
                className="btn-pill text-petroleum hover:bg-petroleum/5 hover:border-petroleum/40 px-4 py-2 flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[18px]">sunny</span>
                Dimensionar via Engenharia
            </button>
        </section>
    );
};
