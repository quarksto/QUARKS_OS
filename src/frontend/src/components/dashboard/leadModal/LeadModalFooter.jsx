import React from 'react';

export const LeadModalFooter = ({ lead, onNewProposal, onTriggerAction }) => {
    const phone = lead?.phone?.replace(/\D/g, '') || '';
    const whatsappUrl = phone ? `https://wa.me/55${phone}` : '#';

    return (
        <div className="flex-none px-6 py-5 border-t border-slate-200 bg-slate-50 shrink-0">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-between">
                <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex gap-1.5 items-center px-2 py-1 rounded-lg bg-white border border-slate-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petroleum opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-petroleum" />
                        </span>
                        <span className="font-medium text-slate-600">Copilot ativo</span>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto justify-center">
                    <a
                        href={`tel:${lead?.phone || ''}`}
                        className="btn-pill flex-1 md:flex-none flex items-center justify-center h-11 px-6 bg-slate-800 border-slate-700 text-white hover:bg-slate-700 gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">call</span>
                        <span className="hidden sm:inline">Ligar</span>
                    </a>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill flex-1 md:flex-none flex items-center justify-center h-11 px-6 bg-[#25D366] border-[#20bd5a] text-white hover:bg-[#20bd5a] gap-2"
                    >
                        <span className="font-bold text-lg">WA</span>
                        <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                    <button
                        type="button"
                        onClick={() => onTriggerAction?.('GENERATE_PROPOSAL', { leadId: lead?.id })}
                        className="btn-pill flex-1 md:flex-none flex items-center justify-center h-11 px-8 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_notes</span>
                        <span className="whitespace-nowrap">Nova Proposta</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
