import React from 'react';

export const InsightBar = ({ onViewDetails, insight }) => {
    return (
        <div className="w-full bg-petroleum/[0.02] border-b border-slate-200/40 px-6 py-3 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200/40 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-petroleum" style={{ fontSize: '14px' }}>smart_toy</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-petroleum-800">
                    <span className="font-bold">Insight IA:</span>
                    <span>
                        {insight != null && typeof insight === 'string'
                            ? insight
                            : 'Converta leads em propostas para impulsionar a receita!'}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onViewDetails?.()}
                className="text-[11px] font-bold uppercase tracking-wide text-petroleum-600 hover:text-petroleum-800 hover:underline flex items-center gap-1"
            >
                VER DETALHES
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
            </button>
        </div>
    );
};
