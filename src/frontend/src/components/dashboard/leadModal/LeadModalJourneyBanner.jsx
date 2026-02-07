import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getNextAction, getLeadCompleteness } from '../../../utils/pipeline';

export const LeadModalJourneyBanner = ({ lead, onClose }) => {
    const navigate = useNavigate();
    const { percent, filled, total } = getLeadCompleteness(lead);
    const nextStep = getNextAction(lead);

    const handleVerFichaCompleta = () => {
        onClose?.();
        navigate(`/leads/${lead?.id}`);
    };

    return (
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="ds-meta text-slate-500">Dados</span>
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-petroleum rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span className="ds-meta font-medium text-slate-600">{percent}%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-symbols-outlined text-[18px] text-petroleum">{nextStep?.icon}</span>
                    <span className="ds-body">{nextStep?.label}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={handleVerFichaCompleta}
                className="btn-pill text-petroleum hover:bg-petroleum/5 hover:border-petroleum/40 px-4 py-2 flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Ver ficha completa
            </button>
        </div>
    );
};
