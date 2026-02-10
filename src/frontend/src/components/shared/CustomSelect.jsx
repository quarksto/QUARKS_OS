import React, { useState, useRef, useEffect } from 'react';

/**
 * CustomSelect — Componente de seleção customizado para o Design System v1.4.
 * Foco em h-8, Super Flat (zero sombras), e estética minimalista (Slate/Petroleum).
 */
export const CustomSelect = ({
    options = [],
    value,
    onChange,
    placeholder = 'Selecione',
    label,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        if (disabled) return;
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {label && <label className="ds-label mb-1.5 block px-1">{label}</label>}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex h-8 w-full items-center justify-between rounded-lg border px-3 text-[13px] transition-all duration-200 focus:outline-none focus:border-petroleum/60 ${isOpen ? 'border-petroleum/60 bg-white' : 'border-slate-100 bg-transparent'
                    } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:border-slate-200'}`}
            >
                <span className={!selectedOption ? 'text-slate-300' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ds-icon-w300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[110] overflow-hidden rounded-lg border border-slate-100 bg-white shadow-none animate-fade-in">
                    <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-100 scrollbar-track-transparent py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`flex w-full items-center px-4 py-2 text-left text-[13px] transition-colors ${value === option.value
                                    ? 'bg-petroleum text-white font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {option.label}
                                {value === option.value && (
                                    <span className="material-symbols-outlined ml-auto text-[18px] ds-icon-w300">check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
