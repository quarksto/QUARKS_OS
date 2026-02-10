import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrencyCompact, getLeadPotential, getTemperature, getTemperatureClass } from '../../utils/pipeline';

/**
 * LeadTechnicalSheet — Perfil Executivo DS v1.4
 * Componente denso de dados, Super Flat, focado em diagnóstico técnico e propostas.
 * Ajustado para conformidade total: h-8, rounded-full, zero shadows, ds-icon-w300.
 * @param {boolean} hideNameHeader — quando true (ex.: dentro do LeadDetailDrawer), não repete o nome do lead no topo
 */
export function LeadTechnicalSheet({ lead, onUpdate, onNewProposal, onAIPress, hideNameHeader }) {
    if (!lead) return null;

    const potential = getLeadPotential(lead);
    const temperature = getTemperature(lead);
    const proposals = Array.isArray(lead.proposals) ? lead.proposals : [];

    const handleWhatsApp = () => {
        if (!lead.phone) return;
        const digits = lead.phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${digits}`, '_blank');
    };

    const handleEmail = () => {
        if (!lead.email) return;
        window.location.href = `mailto:${lead.email}`;
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-10">
            {/* 1. Cabeçalho compacto — nome omitido quando hideNameHeader (evita duplicidade no drawer) */}
            <section className="flex flex-col gap-1">
                {!hideNameHeader && (
                    <div className="flex items-center justify-between">
                        <h1 className="ds-title-section text-slate-700 truncate">
                            {lead.name || 'Sem nome'}
                        </h1>
                        <div className="flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-full shrink-0">
                            <span className={`w-2.5 h-2.5 rounded-full ${getTemperatureClass(temperature.color)} animate-pulse-subtle`} />
                            <span className="text-meta text-slate-500">{temperature.label}</span>
                        </div>
                    </div>
                )}
                <div className={`flex items-center gap-2 flex-wrap ${hideNameHeader ? '' : 'mt-0.5'}`}>
                    {hideNameHeader && (
                        <>
                            <div className="flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-full">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getTemperatureClass(temperature.color)} animate-pulse-subtle`} />
                                <span className="text-meta text-slate-500">{temperature.label}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0" aria-hidden="true" />
                        </>
                    )}
                    <span className="text-meta text-slate-500">ID: {lead.id?.substring(0, 8)}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0" aria-hidden="true" />
                    <div className="flex items-center text-slate-500 gap-1">
                        <span className="material-symbols-outlined text-[14px] ds-icon-w300" aria-hidden="true">place</span>
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{lead.location || 'Brasil'}</span>
                    </div>
                </div>
            </section>

            {/* 2. Botão Análise IA — DS §13.3: rounded-full, ícone auto_awesome, h-8 */}
            <button
                type="button"
                onClick={onAIPress}
                className="w-full h-8 flex items-center justify-center gap-2 border border-petroleum text-petroleum rounded-full hover:bg-petroleum hover:text-white transition-colors duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 shadow-none cursor-pointer"
            >
                <span className="material-symbols-outlined text-[20px] ds-icon-w300" aria-hidden="true">auto_awesome</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">Análise Inteligente (IA)</span>
            </button>

            {/* 3. Grid de Diagnóstico — DS §2.3: KPI font-semibold (600), No-Black max slate-800 */}
            <section>
                <h2 className="ds-label mb-3">Diagnóstico Financeiro</h2>
                <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                    <div className="bg-white p-4">
                        <p className="ds-label">Consumo Mensal</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[20px] font-semibold text-petroleum tracking-tight leading-none tabular-nums">{lead.consumption || '0'}</span>
                            <span className="text-meta text-slate-500">kWh</span>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <p className="ds-label">Potência Estimada</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[20px] font-semibold text-solar tracking-tight leading-none tabular-nums">7.2</span>
                            <span className="text-meta text-slate-500">kWp</span>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <p className="ds-label">Payback</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[20px] font-semibold text-petroleum tracking-tight leading-none tabular-nums">3.4</span>
                            <span className="text-meta text-slate-500">Anos</span>
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <p className="ds-label">ROI esperada</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-[20px] font-semibold text-solar tracking-tight leading-none tabular-nums">242</span>
                            <span className="text-meta text-slate-500">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Tabela de Propostas — DS §4: header bg-slate-50 text-slate-500, linhas border-slate-100 */}
            <section aria-label="Histórico de propostas">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="ds-label">Últimas Propostas</h2>
                    <span className="text-meta text-slate-500">{proposals.length} Registros</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-none">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th scope="col" className="p-3 text-meta">ID</th>
                                <th scope="col" className="p-3 text-meta text-center">Data</th>
                                <th scope="col" className="p-3 text-meta text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {proposals.length > 0 ? (
                                proposals.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3 ds-body font-medium text-slate-600">#{p.id?.substring(0, 4)}</td>
                                        <td className="p-3 ds-body text-slate-500 text-center">
                                            {p.createdAt ? format(new Date(p.createdAt), 'dd/MM', { locale: ptBR }) : '--/--'}
                                        </td>
                                        <td className="p-3 ds-body font-semibold text-slate-800 text-right tabular-nums">
                                            {formatCurrencyCompact(p.totalPrice)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center">
                                        <span className="block text-meta text-slate-500 mb-4">Nenhuma proposta encontrada</span>
                                        {typeof onNewProposal === 'function' && (
                                            <button
                                                type="button"
                                                onClick={onNewProposal}
                                                className="h-8 px-4 rounded-full border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer"
                                            >
                                                Gerar Nova Proposta
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 5. Nota Técnica — DS §14.2: ícone em rounded-lg bg-slate-50 border-slate-100 */}
            <section className="p-5 rounded-lg bg-canvas border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2" aria-hidden="true">
                        <span className="material-symbols-outlined text-[20px] text-petroleum ds-icon-w300">description</span>
                    </div>
                    <h3 className="ds-label">Observação Técnica</h3>
                </div>
                <p className="ds-body text-slate-600">
                    {lead.description || "Nenhuma observação técnica pendente para este lead. Infraestrutura padrão bifásica detectada via histórico."}
                </p>
            </section>

            {/* 6. Ações Rodapé — DS §4: CTA solar h-8 rounded-full, Secundário outline petroleum */}
            <section className="flex gap-3 mt-4 border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={!lead.phone}
                    className="flex-1 h-8 rounded-full bg-solar text-white hover:bg-amber-600 flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 disabled:opacity-50 text-[11px] font-bold uppercase tracking-widest shadow-none border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[20px] ds-icon-w300" aria-hidden="true">chat</span>
                    WhatsApp
                </button>
                <button
                    type="button"
                    onClick={handleEmail}
                    disabled={!lead.email}
                    className="flex-1 h-8 rounded-full border border-petroleum text-petroleum hover:bg-petroleum hover:text-white flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 disabled:opacity-50 text-[11px] font-bold uppercase tracking-widest shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[20px] ds-icon-w300" aria-hidden="true">mail</span>
                    E-mail
                </button>
            </section>
        </div>
    );
}
