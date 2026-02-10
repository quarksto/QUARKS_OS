import React from 'react';
import { formatCurrencyCompact } from '../../../utils/pipeline';

const statusLabels = {
    DRAFT: 'Rascunho',
    SENT: 'Enviada',
    VIEWED: 'Visualizada',
    ACCEPTED: 'Aceita',
    REJECTED: 'Rejeitada',
    EXPIRED: 'Expirada',
};

export const LeadModalProposal = ({ proposal, onViewDetails }) => {
    if (!proposal) {
        return (
            <div className="technical-card p-5 border-dashed border-slate-200">
                <p className="ds-meta text-slate-500 mb-4">Nenhuma proposta ainda. Crie a primeira para enviar ao lead.</p>
                <button
                    type="button"
                    onClick={onViewDetails}
                    aria-label="Criar primeira proposta"
                    className="w-full h-8 rounded-full bg-[#F59E0B] hover:bg-amber-600 text-white font-bold text-[11px] px-4 py-2 flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:border-2 focus-visible:border-petroleum border border-transparent"
                >
                    <span className="material-symbols-outlined text-[16px] ds-icon-w300" aria-hidden="true">add</span>
                    Criar proposta
                </button>
            </div>
        );
    }

    const shortId = proposal.id ? `#${proposal.id.slice(-6).toUpperCase()}` : '';
    const status = statusLabels[proposal.status] || proposal.status;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onViewDetails}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onViewDetails())}
            className="technical-card p-5 cursor-pointer transition-all hover:border-petroleum/30 hover:shadow-sm focus:outline-none focus-visible:border-petroleum border border-transparent"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="ds-meta text-slate-500 uppercase tracking-wider mb-1">Proposta Ativa</p>
                    <h3 className="ds-display-l text-slate-900">{shortId}</h3>
                </div>
                <span className="badge-kanban-origin text-[10px]">{status}</span>
            </div>
            <div className="space-y-2 mb-5">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                    <span className="ds-meta text-slate-500">Potência</span>
                    <span className="ds-data font-semibold">{proposal.systemSizeKwp} kWp</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="ds-meta text-slate-500">Valor Total</span>
                    <span className="ds-display-l text-slate-900">{formatCurrencyCompact(proposal.totalPrice)}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                className="w-full py-2.5 bg-petroleum text-white text-sm font-bold rounded-lg hover:bg-petroleum-600 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:border-2 focus-visible:border-petroleum border border-transparent"
            >
                Ver Detalhes <span className="material-symbols-outlined text-[16px] ds-icon-w300" aria-hidden="true">arrow_forward</span>
            </button>
        </div>
    );
};
