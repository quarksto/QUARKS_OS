import React from 'react';

export function LeadIntelligenceSidebar({ lead, loading }) {
    if (loading) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full text-slate-400">
                <span className="material-symbols-outlined animate-spin mb-2">progress_activity</span>
                <p className="text-xs">Carregando inteligência...</p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full text-slate-300 text-center">
                <span className="material-symbols-outlined text-4xl mb-2">analytics</span>
                <p className="text-xs font-medium">Sem dados de contexto</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            <div className="p-5 border-b border-slate-200">
                <h3 className="text-[13px] font-bold text-petroleum-900 flex items-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-solar-500 text-[18px]">satellite_alt</span>
                    Inteligência Solar
                </h3>
            </div>

            <div className="p-5 flex-1 space-y-6">
                {/* Map Placeholder */}
                <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 transition-all hover:border-petroleum/20 shadow-sm">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-3xl mb-1">map</span>
                        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Visualização de Mapa</span>
                    </div>
                    {/* Overlay info - Solid block instead of gradient */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-petroleum/80 backdrop-blur-sm">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-white/70 leading-none">Potencial Solar</p>
                                <p className="text-sm font-bold text-white">Excelente</p>
                            </div>
                            <div className="bg-solar-500 p-1 rounded backdrop-blur-sm">
                                <span className="material-symbols-outlined text-white text-[14px]">sunny</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Specs */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[12px] border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Área Sugerida</span>
                        <span className="font-semibold text-petroleum-900">~142 m²</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] border-b border-slate-50 pb-2">
                        <span className="text-slate-500">Orientação</span>
                        <span className="font-semibold text-petroleum-900">Norte (Ideal)</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-slate-500">Sombreamento</span>
                        <span className="font-semibold text-green-600">Mínimo (&lt; 5%)</span>
                    </div>
                </div>

                {/* Timeline */}
                <div className="pt-4">
                    <h3 className="text-[11px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest mb-4">
                        Histórico de Atividade
                    </h3>
                    <div className="relative pl-3 space-y-6">
                        <div className="absolute top-1 bottom-1 left-[14px] w-px bg-slate-200"></div>

                        <div className="relative flex gap-3">
                            <div className="z-10 size-7 rounded-full bg-white border border-solar-500 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-solar-500 text-[14px]">bolt</span>
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold text-petroleum-900">Geração de Proposta</p>
                                <p className="text-[10px] text-slate-500">IA detectou viabilidade alta.</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">Hoje, 14:20</p>
                            </div>
                        </div>

                        <div className="relative flex gap-3">
                            <div className="z-10 size-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-[14px]">call</span>
                            </div>
                            <div>
                                <p className="text-[12px] font-medium text-slate-700">Call Qualificação</p>
                                <p className="text-[10px] text-slate-500">Interesse em financiamento.</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">Ontem, 09:15</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
