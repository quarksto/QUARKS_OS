import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMode, MODES } from '../../providers/ModeProvider';

export const ModeSwitcher = () => {
    const { mode, setMode } = useMode();
    const navigate = useNavigate();

    const handleModeChange = (newMode) => {
        if (newMode === mode) return;
        setMode(newMode);

        // Navegação inteligente baseada no modo
        if (newMode === MODES.SALES) {
            navigate('/workspace');
        } else if (newMode === MODES.MANAGE) {
            navigate('/dashboard');
        } else if (newMode === MODES.PROJECTS) {
            navigate('/projetos');
        }
    };

    const options = [
        { value: MODES.SALES, label: 'Vendas', icon: 'phone_in_talk' },
        { value: MODES.MANAGE, label: 'Gestão', icon: 'bar_chart' },
        { value: MODES.PROJECTS, label: 'Projetos', icon: 'business_center' },
    ];

    return (
        <div className="flex bg-slate-100/50 p-1 rounded-full border border-slate-200/50 h-9 items-center shadow-none">
            {options.map((option) => {
                const isActive = mode === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => handleModeChange(option.value)}
                        className={`
                            relative flex items-center gap-2 px-4 h-7 rounded-full transition-all duration-200 group
                            ${isActive
                                ? 'bg-white text-petroleum shadow-none border border-slate-200/50 font-bold'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}
                        `}
                    >
                        <span className={`material-symbols-outlined text-[18px] ds-icon-w300 ${isActive ? 'text-solar' : 'text-slate-400 group-hover:text-slate-500'}`}>
                            {option.icon}
                        </span>
                        <span className={`ds-meta ${isActive ? '!text-petroleum' : '!text-slate-400'} uppercase tracking-widest font-bold`}>
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
