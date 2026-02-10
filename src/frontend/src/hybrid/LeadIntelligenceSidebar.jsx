import React from 'react';
import { useCopilot } from '../context/CopilotContext';

export function LeadIntelligenceSidebar({ lead, loading }) {
    const { triggerAction, sendMessage, setContext } = useCopilot();
    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full text-slate-500">
                <span className="material-symbols-outlined ds-icon-w300 text-[20px] text-solar animate-spin mb-2" aria-hidden="true">progress_activity</span>
                <p className="text-[13px] font-medium">Carregando inteligência...</p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full text-slate-500 text-center">
                <span className="material-symbols-outlined ds-icon-w300 text-4xl mb-2" aria-hidden="true">analytics</span>
                <p className="text-[13px] font-medium">Sem dados de contexto</p>
            </div>
        );
    }

    const consumption = Number(lead.consumption || 0);

    return (
        <div className="flex flex-col h-full bg-canvas border-l border-slate-100 font-sans overflow-hidden font-geist">
            {/* 1. Cabeçalho de Inteligência */}
            <div className="h-16 px-5 border-b border-slate-100 bg-white shrink-0 z-10 flex items-center">
                <h3 className="ds-label text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                    <span className="material-symbols-outlined ds-icon-w300 text-[20px] text-slate-700" aria-hidden="true">psychology</span>
                    Contexto & IA
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                {/* 1.5. Ações Sugeridas pela IA — DS: card border-slate-200, zero sombra */}
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                    <h4 className="ds-label mb-4 flex items-center gap-1.5 text-slate-500">
                        <span className="material-symbols-outlined ds-icon-w300 text-[16px] text-solar" aria-hidden="true">auto_awesome</span>
                        Ações Sugeridas
                    </h4>
                    <div className="space-y-2">
                        {lead.status === 'NEW' && (
                            <ActionSuggestion
                                icon="waving_hand"
                                label="Iniciar Conversa"
                                desc="Lead novo, envie uma saudação."
                                onClick={() => {
                                    const ctx = { type: 'lead', leadId: lead.id, lead };
                                    setContext(ctx);
                                    sendMessage("Me ajude a iniciar uma conversa com esse lead novo.", undefined, ctx);
                                }}
                            />
                        )}
                        {consumption > 400 && lead.status !== 'PROPOSAL' && (
                            <ActionSuggestion
                                icon="description"
                                label="Gerar Proposta"
                                desc={`Consumo alto (${consumption} kWh).`}
                                onClick={() => {
                                    setContext({ type: 'lead', leadId: lead.id, lead });
                                    triggerAction("generate_proposal", { leadId: lead.id });
                                }}
                            />
                        )}
                        <ActionSuggestion
                            icon="calendar_today"
                            label="Agendar Reunião"
                            desc="Aumente o engajamento."
                            onClick={() => {
                                const ctx = { type: 'lead', leadId: lead.id, lead };
                                setContext(ctx);
                                sendMessage("Gostaria de agendar uma reunião com este lead. Quais os próximos passos?", undefined, ctx);
                            }}
                        />
                    </div>
                </div>

                {/* 2. Círculo de Pontuação BANT — DS: card border-slate-200, zero sombra, valores semânticos em outline */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="relative size-36 mb-6 mt-2">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                            <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                            <circle
                                className="text-petroleum transition-[stroke-dashoffset] duration-500 ease-out"
                                strokeWidth="12"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 * (1 - (lead.score ?? 82) / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="ds-display-l text-slate-700 leading-none tabular-nums">{lead.score ?? 82}<span className="text-sm align-top ml-0.5">%</span></span>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Score</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                        <ScoreItem label="Budget" value="Alto" variant="positive" />
                        <ScoreItem label="Authority" value="Decisor" variant="positive" />
                        <ScoreItem label="Need" value="Técnico" variant="neutral" />
                        <ScoreItem label="Timeline" value="30 dias" variant="neutral" />
                    </div>
                </div>

                {/* 3. Kit Recomendado — DS: petroleum sólido, badge outline, tipografia tokens, zero sombra, moeda R$ 0,00 */}
                <div className="relative rounded-lg bg-petroleum overflow-hidden text-white border border-petroleum cursor-pointer active:scale-[0.98] transition-transform duration-200">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined ds-icon-w300 text-[20px] text-white" aria-hidden="true">solar_power</span>
                            </div>
                            <span className="rounded-full border border-white/30 bg-transparent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                Sugestão IA
                            </span>
                        </div>

                        <h4 className="ds-title-section text-white font-medium mb-1">Kit {consumption > 500 ? 'Premium' : 'Standard'}</h4>
                        <p className="text-[13px] font-medium text-white/90 mb-5 leading-tight">Ideal para consumo de <span className="font-semibold border-b border-white/30">{consumption} kWh</span>.</p>

                        <div className="rounded-lg border border-white/10 bg-white/5 p-3 flex justify-between items-center gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-0.5">Potência</p>
                                <p className="text-sm font-semibold text-white tabular-nums">{(consumption * 0.012).toFixed(1)} kWp</p>
                            </div>
                            <div className="w-px h-6 bg-white/10 shrink-0" aria-hidden="true" />
                            <div className="text-right min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-0.5">Economia</p>
                                <p className="text-sm font-semibold text-solar tabular-nums">R$ {(consumption * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Linha do Tempo — DS: bordas slate-100, petroleum ativo, tipografia tokens, zero sombra */}
                <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Linha do Tempo</h5>
                    <div className="relative space-y-6 pl-2">
                        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-100" aria-hidden="true" />
                        <TimelineItem
                            icon="chat"
                            title="Conversa Inbox"
                            desc="Pendente resposta"
                            time="2 min"
                            active
                        />
                        <TimelineItem
                            icon="assignment_turned_in"
                            title="Kyc Concluído"
                            desc="Dados técnicos validados"
                            time="1h atrás"
                        />
                        <TimelineItem
                            icon="person_add"
                            title="Lead Criado"
                            desc="Origem: WhatsApp Ad"
                            time="2 dias"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionSuggestion({ icon, label, desc, onClick }) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
            className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-200 cursor-pointer group focus:outline-none focus-visible:border-petroleum active:scale-95 transition-colors duration-200"
        >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-white transition-colors duration-200">
                <span className="material-symbols-outlined ds-icon-w300 text-[18px] text-slate-500" aria-hidden="true">{icon}</span>
            </div>
            <div className="flex flex-col min-w-0">
                <h5 className="text-[11px] font-bold leading-none text-slate-700">{label}</h5>
                <p className="text-[11px] text-slate-500 leading-none mt-0.5 truncate font-medium">{desc}</p>
            </div>
            <span className="material-symbols-outlined ds-icon-w300 text-[14px] ml-auto text-slate-400 group-hover:text-petroleum transition-colors duration-200" aria-hidden="true">arrow_forward</span>
        </div>
    );
}

function ScoreItem({ label, value, variant }) {
    const isPositive = variant === 'positive';
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            {isPositive ? (
                <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {value}
                </span>
            ) : (
                <span className="text-[12px] font-semibold text-slate-700">{value}</span>
            )}
        </div>
    );
}

function TimelineItem({ icon, title, desc, time, active }) {
    return (
        <div className="relative flex gap-3 items-start z-10">
            {/* Marcador: ativo = petroleum preenchido + núcleo branco; inativo = outline slate-100 */}
            <div
                className={`shrink-0 mt-0.5 size-4 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                    active ? 'bg-petroleum border-petroleum' : 'bg-white border border-slate-100'
                }`}
                aria-hidden="true"
            >
                {active && <div className="size-1.5 rounded-full bg-white" />}
            </div>
            <div className="min-w-0 flex-1 pt-px">
                <div className="flex justify-between gap-2 items-baseline">
                    <div className="flex items-center gap-2 min-w-0">
                        <span
                            className={`material-symbols-outlined text-[14px] shrink-0 ds-icon-w300 ${active ? 'text-petroleum' : 'text-slate-400'}`}
                            aria-hidden="true"
                        >
                            {icon}
                        </span>
                        <p className={`text-[13px] font-semibold truncate leading-none ${active ? 'text-slate-700' : 'text-slate-600'}`}>
                            {title}
                        </p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">{time}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-1 leading-snug">{desc}</p>
            </div>
        </div>
    );
}
