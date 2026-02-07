import React from 'react';
import { StandardAvatar } from '../../ui/StandardAvatar';

import {
    getTemperature,
    getTemperatureClass,
    getSourceLabel,
    getLeadScore,
    getLeadPotential,
    formatCurrencyCompact,
    getTemperatureOutlineClass,
} from '../../../utils/pipeline';

export const LeadModalProfile = ({ lead }) => {
    const temperature = getTemperature(lead);
    const source = getSourceLabel(lead);
    const score = getLeadScore(lead);
    const potential = getLeadPotential(lead);

    return (
        <section className="technical-card p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative shrink-0 mx-auto sm:mx-0">
                    <StandardAvatar
                        name={lead?.name}
                        src={lead?.avatar_url || lead?.avatar}
                        size="xl"
                        className="!w-20 !h-20 !text-xl shadow-sm"
                    />
                </div>
                <div className="flex-1 w-full min-w-0 text-center sm:text-left">
                    <h1 className="font-sans font-bold text-[20px] text-slate-900 mb-1 truncate leading-tight">{lead?.name || '—'}</h1>
                    <p className="ds-body text-slate-500 mb-4 flex items-center justify-center sm:justify-start gap-1 truncate">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0">location_on</span>
                        {lead?.location || 'Local não informado'}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
                        <span className="ds-meta text-slate-400 mr-1 flex items-center gap-1 shrink-0 uppercase tracking-tighter font-bold text-[9px]">
                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                            Insights de IA
                        </span>
                        <span className={`badge-kanban-temp ${getTemperatureOutlineClass(temperature.color)}`} title="Temperatura">
                            <span className={`badge-kanban-dot ${getTemperatureClass(temperature.color)}`} />
                            {temperature.label}
                        </span>
                        <span className="badge-kanban-origin" title="Origem">
                            {source}
                        </span>
                        <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-center sm:justify-start mt-1 sm:mt-0">
                            <span className="badge-kanban-consumption">
                                Pontuação {score}/100
                            </span>
                            <span className="badge-kanban-consumption">
                                Potencial {formatCurrencyCompact(potential)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
