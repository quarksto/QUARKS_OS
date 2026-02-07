import React from 'react';
import { getStageLabel } from '../../../utils/pipeline';

export const LeadModalHeader = ({ lead, onClose, onOpenCopilot, onNewProposal }) => {
    const shortId = lead?.id ? `#${lead.id.slice(-6).toUpperCase()}` : '';
    const created = lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

    return (
        <header className="flex-none flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white shrink-0 z-20">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
                >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                </button>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="ds-title-section text-slate-900">Ficha do Lead</h2>
                        <span className="badge-kanban-origin text-[10px] uppercase">
                            {getStageLabel(lead?.status)}
                        </span>
                    </div>
                    <p className="ds-meta text-slate-500 truncate">
                        {shortId && created ? `ID: ${shortId} • Criado em ${created}` : ''}
                    </p>
                </div>
            </div>
            <div className="flex gap-2 shrink-0">
                <button
                    type="button"
                    onClick={onOpenCopilot}
                    className="btn-pill bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 h-10 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">smart_toy</span>
                    Copilot
                </button>
                <button
                    type="button"
                    onClick={onNewProposal}
                    className="btn-pill bg-petroleum text-white hover:bg-petroleum-600 border-petroleum-700 px-5 py-2 h-10 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Nova proposta
                </button>
            </div>
        </header>
    );
};
