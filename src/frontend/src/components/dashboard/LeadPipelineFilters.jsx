import React, { useMemo, useRef, useState, useEffect } from 'react';
import { MdTune } from 'react-icons/md';

export const LeadPipelineFilters = ({
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
}) => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const activeCount = useMemo(() => {
        return [
            tempFilter?.length > 0,
            Boolean(sourceFilter),
            scoreMin !== '',
            scoreMax !== '',
        ].filter(Boolean).length;
    }, [tempFilter, sourceFilter, scoreMin, scoreMax]);

    return (
        <div className="relative" ref={panelRef}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex h-9 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition-colors ${activeCount > 0
                    ? 'border-petroleum text-petroleum-700 bg-petroleum/5'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-petroleum/40'
                    }`}
            >
                <MdTune size={18} />
                Filtros
                {activeCount > 0 && (
                    <span className="min-w-[20px] h-[20px] rounded-full bg-petroleum text-white flex items-center justify-center text-[10px] font-bold">
                        {activeCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-50 p-5 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Temperatura</span>
                        {tempFilter?.length > 0 && (
                            <button
                                type="button"
                                onClick={onClearTemp}
                                className="text-[11px] text-petroleum-600 font-medium"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'quente', label: 'Quente', activeClass: 'border-emerald-500 text-emerald-700 bg-white ring-1 ring-emerald-500', baseClass: 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600' },
                            { id: 'morno', label: 'Morno', activeClass: 'border-orange-500 text-orange-700 bg-white ring-1 ring-orange-500', baseClass: 'border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600' },
                            { id: 'frio', label: 'Frio', activeClass: 'border-blue-500 text-blue-700 bg-white ring-1 ring-blue-500', baseClass: 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600' },
                        ].map((opt) => {
                            const active = tempFilter?.includes(opt.id);
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => onToggleTemp(opt.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${active ? opt.activeClass : `bg-white ${opt.baseClass}`
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Origem</label>
                        <select
                            value={sourceFilter}
                            onChange={(e) => onSourceChange(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[12px] focus:outline-none focus:border-petroleum-500"
                        >
                            <option value="">Todas</option>
                            {sourceOptions?.filter(Boolean).map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Score mín.</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={scoreMin}
                                onChange={(e) => onScoreMinChange(e.target.value)}
                                placeholder="0"
                                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:border-petroleum-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Score máx.</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={scoreMax}
                                onChange={(e) => onScoreMaxChange(e.target.value)}
                                placeholder="100"
                                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:border-petroleum-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
