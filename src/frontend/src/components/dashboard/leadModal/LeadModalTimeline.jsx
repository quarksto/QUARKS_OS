import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const activityLabels = {
    LEAD_CREATED: 'Lead Criado',
    PROPOSAL_CREATED: 'Proposta Gerada',
    PROPOSAL_SENT: 'Proposta Enviada',
    PROPOSAL_UPDATE: 'Atualização de Proposta',
};

const activityColors = {
    gray: 'bg-slate-400',
    blue: 'bg-blue-500',
    solar: 'bg-solar',
    green: 'bg-emerald-500',
};

export const LeadModalTimeline = ({ activities = [], loading }) => {
    return (
        <div className="technical-card p-5 flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-5 shrink-0">
                <h3 className="ds-title flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-slate-400 text-[18px] ds-icon-w300">history</span>
                    Histórico
                </h3>
            </div>
            <div className="relative pl-2 flex-1 overflow-y-auto min-h-[200px] scrollbar-custom">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />
                {loading ? (
                    <div className="pl-8 flex items-center gap-2 text-slate-500 ds-body">
                        <span className="w-4 h-4 border-2 border-slate-200 border-t-petroleum rounded-full animate-spin" />
                        Carregando histórico...
                    </div>
                ) : activities.length === 0 ? (
                    <div className="pl-8 ds-body text-slate-500">Nenhuma atividade recente.</div>
                ) : (
                    <div className="space-y-6 relative">
                        {activities.map((activity, i) => {
                            const label = activityLabels[activity.type] || activity.title || activity.type;
                            const dotColor = activityColors[activity.color] || 'bg-slate-400';
                            const isFirst = i === 0;

                            return (
                                <div key={activity.id || i} className="relative pl-8">
                                    <div className={`absolute left-[15px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${dotColor} ${isFirst ? 'bg-petroleum' : ''}`} />
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-xs font-bold text-slate-800">{label}</span>
                                            <span className="ds-meta text-slate-500 shrink-0">
                                                {format(new Date(activity.date), "d 'de' MMM, HH:mm", { locale: ptBR })}
                                            </span>
                                        </div>
                                        <p className="ds-body text-slate-600 mt-0.5">{activity.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
