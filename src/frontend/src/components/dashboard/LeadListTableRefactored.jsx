import React, { useState } from 'react';

/**
 * Status badge following DS 1.4 .ds-meta style.
 * Uses outline approach: border + text, no solid background.
 */
const StatusBadge = ({ status }) => {
    const config = {
        NEW: { label: 'Novo', class: 'border-slate-200 !text-slate-500' },
        CONTACTED: { label: 'Em Contato', class: 'border-solar/40 !text-solar' },
        PROPOSAL_SENT: { label: 'Proposta', class: 'border-cyan-200 !text-cyan-600' },
        NEGOTIATION: { label: 'Negociação', class: 'border-orange-200 !text-orange-600' },
        CLOSED_WON: { label: 'Vendido', class: 'border-emerald-200 !text-emerald-600' },
        CLOSED_LOST: { label: 'Perdido', class: 'border-slate-200 !text-slate-400' },
    };
    const { label, class: colorClass } = config[status] || config.NEW;
    return (
        <span
            className={`ds-meta inline-flex items-center rounded-full border bg-white font-bold uppercase tracking-widest ${colorClass}`}
            style={{ padding: '2px 10px' }}
        >
            {label}
        </span>
    );
};

export const LeadListTableRefactored = ({
    leads,
    loading,
    onLeadClick,
    selectedLeadId,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredLeads = leads || [];
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const displayedLeads = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col h-full bg-white border border-slate-100 rounded-lg overflow-hidden shadow-none">
            <div className="overflow-x-auto flex-1 scrollbar-hide">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100">
                        <tr>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Lead</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Status</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Consumo</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Localização</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Responsável</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold">Criado em</th>
                            <th className="py-4 px-6 ds-meta !text-slate-400 uppercase tracking-widest font-bold text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            Array(8)
                                .fill(0)
                                .map((_, i) => (
                                    <tr key={i}>
                                        <td className="py-4 px-6" colSpan="7">
                                            <div className="h-10 bg-slate-50 animate-pulse rounded-lg w-full" />
                                        </td>
                                    </tr>
                                ))
                        ) : displayedLeads.length > 0 ? (
                            displayedLeads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => onLeadClick?.(lead)}
                                    className={`group cursor-pointer transition-colors duration-200 hover:bg-slate-50/50 ${selectedLeadId === lead.id ? 'bg-slate-50' : ''
                                        }`}
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-petroleum/5 flex items-center justify-center ds-label !text-petroleum/60 shrink-0 font-black">
                                                {lead.name?.charAt(0) || 'L'}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="ds-label !text-petroleum normal-case font-bold truncate">
                                                    {lead.name}
                                                </span>
                                                <span className="ds-meta !text-slate-400 truncate mt-0.5">
                                                    {lead.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="ds-label !text-petroleum normal-case font-bold tabular-nums">
                                                {lead.consumption ?? 0} kWh
                                            </span>
                                            <span className="ds-meta !text-solar font-bold uppercase tabular-nums">
                                                R$ {(((lead.consumption ?? 0) * 0.9)).toFixed(0)} est.
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-slate-300 ds-icon-w300">location_on</span>
                                            <span className="ds-body !text-slate-500 !text-[13px] truncate">{lead.city || 'Não inf.'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-petroleum flex items-center justify-center ds-meta !text-solar font-black">
                                                QM
                                            </div>
                                            <span className="ds-body !text-slate-600 !text-[13px]">Quarks Manager</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="ds-body !text-slate-400 !text-[13px] tabular-nums">
                                            {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                type="button"
                                                className="size-8 rounded-full flex items-center justify-center hover:bg-white border border-transparent hover:border-slate-100 text-slate-400 hover:text-solar transition-all shadow-none"
                                            >
                                                <span className="material-symbols-outlined text-[18px] ds-icon-w300">chat</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="size-8 rounded-full flex items-center justify-center hover:bg-white border border-transparent hover:border-slate-100 text-slate-400 hover:text-petroleum transition-all shadow-none"
                                            >
                                                <span className="material-symbols-outlined text-[18px] ds-icon-w300">mail</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="size-8 rounded-full flex items-center justify-center hover:bg-white border border-transparent hover:border-slate-100 text-slate-400 hover:text-petroleum transition-all shadow-none"
                                            >
                                                <span className="material-symbols-outlined text-[18px] ds-icon-w300">open_in_new</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-slate-200 text-5xl ds-icon-w300">search_off</span>
                                        <p className="ds-label !text-slate-400 mb-1">Nenhum lead encontrado</p>
                                        <p className="ds-body !text-slate-300 !text-xs">Ajuste os filtros ou a busca.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
                <span className="ds-meta !text-slate-400 font-bold uppercase tracking-widest">
                    Total: <span className="!text-petroleum">{filteredLeads.length}</span> leads
                </span>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 disabled:opacity-20 transition-all border border-transparent hover:border-slate-200"
                    >
                        <span className="material-symbols-outlined text-[20px] ds-icon-w300">chevron_left</span>
                    </button>
                    <span className="ds-meta !text-petroleum font-bold tabular-nums">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 disabled:opacity-20 transition-all border border-transparent hover:border-slate-200"
                    >
                        <span className="material-symbols-outlined text-[20px] ds-icon-w300">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
