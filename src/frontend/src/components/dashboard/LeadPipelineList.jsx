import React from 'react';
import {
    formatCurrencyCompact,
    getLeadPotential,
    getLeadScore,
    getTemperature,
    getTemperatureClass,
    getSourceLabel,
    getNextAction,
    getStageLabel,
} from '../../utils/pipeline';

export const LeadPipelineList = ({ rows = [], onLeadClick }) => {
    if (!rows.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Nenhum lead encontrado com os filtros atuais.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="max-h-[520px] overflow-y-auto">
                <table className="min-w-full border-collapse text-left text-sm text-slate-600">
                    <thead className="sticky top-0 bg-slate-50 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-3">Lead</th>
                            <th className="px-4 py-3">Etapa</th>
                            <th className="px-4 py-3">Origem</th>
                            <th className="px-4 py-3">Temperatura</th>
                            <th className="px-4 py-3 text-center">Score</th>
                            <th className="px-4 py-3 text-right">Potencial</th>
                            <th className="px-4 py-3">Próxima ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((lead) => {
                            const temperature = getTemperature(lead);
                            const score = getLeadScore(lead);
                            const potential = getLeadPotential(lead);
                            const source = getSourceLabel(lead);
                            const nextAction = getNextAction(lead);

                            return (
                                <tr
                                    key={lead.id}
                                    className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                                    onClick={() => onLeadClick?.(lead)}
                                >
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-slate-800">{lead.name}</span>
                                            <span className="text-[12px] text-slate-400">{lead.location || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[12px] font-medium text-slate-500">
                                        {getStageLabel(lead.stage)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge-kanban-origin">
                                            {source}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="badge-kanban-temp">
                                            <span className={`badge-kanban-dot ${getTemperatureClass(temperature.color)}`} />
                                            {temperature.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-[12px] font-semibold text-slate-700">
                                        {score}
                                    </td>
                                    <td className="px-4 py-3 text-right text-[12px] font-semibold text-slate-700">
                                        {formatCurrencyCompact(potential)}
                                    </td>
                                    <td className="px-4 py-3 text-[12px] text-slate-500 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-400">{nextAction.icon}</span>
                                        {nextAction.label}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
