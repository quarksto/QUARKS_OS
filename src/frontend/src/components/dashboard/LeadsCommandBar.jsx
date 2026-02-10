import React from 'react';
// Removed react-icons as per DS v1.4
import { LeadPipelineFilters } from './LeadPipelineFilters';

/**
 * Barra única compacta: busca + filtros + alternador Lista/Painel (+ opcional rightSection).
 * Reduz ocupação de espaço em uma única linha.
 */
export function LeadsCommandBar({
    searchTerm,
    onSearchChange,
    searchPlaceholder = 'Buscar por nome, email ou telefone...',
    tempFilter,
    onToggleTemp,
    onClearTemp,
    sourceFilter,
    onSourceChange,
    sourceOptions,
    scoreMin,
    scoreMax,
    onScoreMinChange,
    onScoreMaxChange,
    view,
    onChangeView,
    rightSection = null,
    className = '',
}) {
    const showViewToggle = view != null && typeof onChangeView === 'function';

    return (
        <div
            className={`flex flex-wrap items-center gap-2 py-2 px-1 min-h-0 ${className}`}
            data-cursor-element-id="leads-command-bar"
        >
            <div className="relative flex-1 min-w-[200px] max-w-md group">
                <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-petroleum transition-colors pointer-events-none ds-icon-w300"
                    aria-hidden
                >
                    search
                </span>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 h-9 bg-transparent border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-petroleum/60 transition-colors duration-200"
                    aria-label="Buscar leads"
                />
            </div>

            <LeadPipelineFilters
                tempFilter={tempFilter}
                onToggleTemp={onToggleTemp}
                onClearTemp={onClearTemp}
                sourceFilter={sourceFilter}
                onSourceChange={onSourceChange}
                sourceOptions={sourceOptions}
                scoreMin={scoreMin}
                scoreMax={scoreMax}
                onScoreMinChange={onScoreMinChange}
                onScoreMaxChange={onScoreMaxChange}
            />

            {
                (showViewToggle || rightSection) && (
                    <>
                        <span className="w-px h-6 bg-slate-100 hidden sm:block shrink-0" aria-hidden />
                        <div className="flex items-center gap-2 shrink-0">
                            {showViewToggle && (
                                <div className="flex bg-slate-100 rounded-full p-0.5" role="tablist" aria-label="Visualização">
                                    <button
                                        type="button"
                                        onClick={() => onChangeView('board')}
                                        role="tab"
                                        aria-selected={view === 'board'}
                                        className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition-colors duration-200 focus:outline-none focus-visible:border-petroleum/60 ${view === 'board' ? 'bg-white text-slate-700 border border-slate-100' : 'text-slate-500 font-medium hover:bg-white/50 border border-transparent'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px] ds-icon-w300" aria-hidden>dashboard</span> Painel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onChangeView('list')}
                                        role="tab"
                                        aria-selected={view === 'list'}
                                        className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition-colors duration-200 focus:outline-none focus-visible:border-petroleum/60 ${view === 'list' ? 'bg-white text-slate-700 border border-slate-100' : 'text-slate-500 font-medium hover:bg-white/50 border border-transparent'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px] ds-icon-w300" aria-hidden>format_list_bulleted</span> Lista
                                    </button>
                                </div>
                            )}
                            {rightSection}
                        </div>
                    </>
                )
            }
        </div >
    );
}

export default LeadsCommandBar;
