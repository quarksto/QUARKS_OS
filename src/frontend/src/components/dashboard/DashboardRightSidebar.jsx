import React, { useState } from 'react';

/**
 * DashboardRightSidebar (Copilot)
 * 
 * Implements the "Copiloto Solar" right sidebar found in the Stitch design reference 
 * (Quarks OS Sales Dashboard).
 */
export const DashboardRightSidebar = ({ isOpen, onClose }) => {
    // If not open, we might want to render null or a collapsed state.
    // For this design, we'll assume it's always visible if "Chat IA" is active, 
    // or we can toggle it. For now, we'll make it fixed width.

    const [inputValue, setInputValue] = useState("");

    return (
        <aside className="w-80 border-l border-slate-200/40 bg-white flex flex-col flex-shrink-0 z-20 h-full transition-all">
            {/* Header */}
            <div className="h-16 border-b border-slate-200/40 flex items-center justify-between px-4 flex-shrink-0 bg-white">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-solar-500 text-[24px]">smart_toy</span>
                    <span className="font-semibold text-sm tracking-wide text-slate-900">Copiloto Solar</span>
                </div>
                <button className="text-slate-400 hover:text-petroleum-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">

                {/* Assistant Message (Simulated from Stitch Design) */}
                <div className="flex gap-3 animate-fadeIn">
                    <div className="w-8 h-8 rounded-full bg-solar-50 border border-solar-200 flex items-center justify-center flex-shrink-0 text-solar-600">
                        <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[90%]">
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm flex items-center gap-2">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Analisando oportunidades...</span>
                        </div>
                        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm">
                            Sua taxa de conversão em <strong>Industrial</strong> subiu 12%. Quer enviar uma campanha focada nesse setor?
                        </div>
                    </div>
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <button className="text-xs bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-all hover:border-solar-400 shadow-sm hover:shadow-md hover:text-solar-700">
                        Criar Campanha
                    </button>
                    <button className="text-xs bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 transition-all hover:border-solar-400 shadow-sm hover:shadow-md hover:text-solar-700">
                        Ver Leads Industriais
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200/40 bg-white">
                <div className="relative">
                    <div className="flex items-center gap-2 absolute left-3 top-2.5">
                        <button className="text-slate-400 hover:text-petroleum-600 transition-colors p-0.5 hover:bg-slate-100 rounded" title="Upload File">
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        </button>
                    </div>

                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-solar-500 focus:border-solar-500 transition-all shadow-inner focus:bg-white focus:outline-none font-sans"
                        placeholder="Perguntar ao Copiloto..."
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setInputValue('')}
                    />

                    <button
                        className={`absolute right-2 top-2 p-1 rounded-lg text-white transition-all duration-200 ${inputValue.trim() ? 'bg-solar-500 hover:bg-solar-600 shadow-sm' : 'bg-slate-300 cursor-not-allowed'
                            }`}
                        disabled={!inputValue.trim()}
                    >
                        <span className="material-symbols-outlined text-[16px] block">arrow_upward</span>
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2 font-sans">
                    IA pode cometer erros. Verifique dados críticos.
                </p>
            </div>
        </aside>
    );
};
