import React from 'react';
import { LeadModalMap } from './LeadModalMap';

/**
 * Seção Endereço e Instalação — MCP Ficha do Lead.
 * Inclui mapa (Google Maps Embed ou fallback) e texto do endereço.
 */
export const LeadModalAddress = ({ lead }) => {
    const address = lead?.fullAddress || lead?.location || '';
    const displayAddress = typeof address === 'string' ? address : '';

    return (
        <section className="technical-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="ds-title flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-slate-400 text-[18px] ds-icon-w300">map</span>
                    Endereço e Instalação
                </h3>
            </div>
            <div className="flex flex-col gap-3">
                <LeadModalMap address={displayAddress} />
                <div>
                    <p className="ds-data text-slate-800">
                        {displayAddress || '—'}
                    </p>
                    {displayAddress && (
                        <p className="ds-meta text-slate-500 mt-0.5">
                            Consulte o mapa para rota e satélite
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};
