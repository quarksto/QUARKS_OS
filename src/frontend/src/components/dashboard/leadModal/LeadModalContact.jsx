import React from 'react';
import { getSourceLabel } from '../../../utils/pipeline';

export const LeadModalContact = ({ lead }) => {
    const source = getSourceLabel(lead);
    const phone = lead?.phone || '—';
    const email = lead?.email || '—';

    return (
        <section className="technical-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="ds-title flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                    Dados de Contato
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Celular / WhatsApp</label>
                    <div className="flex items-center gap-2 group">
                        <span className="ds-data text-slate-800">{phone}</span>
                        {lead?.phone && (
                            <a href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors">
                                <span className="material-symbols-outlined text-[14px]">chat</span>
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Email</label>
                    <div className="flex items-center gap-2">
                        <span className="ds-data text-slate-800 truncate">{email}</span>
                        {lead?.email && (
                            <a href={`mailto:${lead.email}`} className="text-slate-400 hover:text-petroleum transition-colors shrink-0">
                                <span className="material-symbols-outlined text-[14px]">mail</span>
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Origem</label>
                    <span className="badge-kanban-origin">{source}</span>
                </div>
            </div>
        </section>
    );
};
