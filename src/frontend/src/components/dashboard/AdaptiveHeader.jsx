import React from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { ModeSwitcher } from '../shell/ModeSwitcher';
import { ConnectionStatus } from '../shared/ConnectionStatus';
import { MdMenu, MdNotifications, MdSmartToy, MdAutoAwesome, MdChevronRight } from 'react-icons/md';

/**
 * Header adaptativo para todos os módulos.
 * Sempre exibe: Notificações e Copilot.
 * O restante (título, ícone, subtítulo, loading e ações do módulo) é configurável por página.
 */
export const AdaptiveHeader = ({
    title = 'Dashboard',
    subtitle = 'Solar Integrator 4.0',
    loading = false,
    headerIcon = null,
    moduleActions = null,
    onMobileMenuToggle,
    breadcrumbs = [],
}) => {
    const { isOpen, toggleSidebar, isThinking } = useCopilot();

    // Render the icon, supporting both strings (legacy) and react elements
    const renderIcon = () => {
        if (!headerIcon) return <MdSmartToy size={20} className="text-white" />;
        if (typeof headerIcon === 'string') {
            return <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>{headerIcon}</span>;
        }
        return headerIcon;
    };

    return (
        <header className="h-20 border-b border-slate-200 bg-[#F8FAFC] px-6 flex items-center justify-between shrink-0 z-30 sticky top-0 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMobileMenuToggle}
                    className="md:hidden w-9 h-9 -ml-2 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                    aria-label="Abrir menu"
                >
                    <MdMenu size={24} />
                </button>
                <div className="w-9 h-9 bg-petroleum rounded-lg flex items-center justify-center shadow-sm shrink-0 hidden md:flex overflow-hidden">
                    {renderIcon()}
                </div>
                <div className="flex flex-col min-w-0">
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-1 mb-0.5" aria-label="Breadcrumbs">
                            {breadcrumbs.map((bc, idx) => (
                                <React.Fragment key={idx}>
                                    <span className="ds-meta text-slate-400 font-bold uppercase tracking-tighter hover:text-petroleum cursor-default transition-colors">
                                        {bc.label}
                                    </span>
                                    {idx < breadcrumbs.length - 1 && (
                                        <MdChevronRight size={14} className="text-slate-300" />
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                    <h1 className="font-sans font-bold text-[18px] text-slate-900 leading-none truncate">{title}</h1>
                    <div className="flex items-center gap-2">
                        <ConnectionStatus />
                    </div>
                </div>
            </div>

            <div className="hidden lg:block">
                <ModeSwitcher />
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* Notificações — sempre visível em todos os módulos */}
                <button
                    type="button"
                    className="w-10 h-10 rounded-lg border border-slate-200/40 flex items-center justify-center text-slate-400 hover:text-petroleum hover:bg-slate-50 transition-colors relative"
                    aria-label="Notificações"
                >
                    <MdNotifications size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" aria-hidden />
                </button>

                {/* Copilot — sempre visível em todos os módulos */}
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${isOpen ? 'border-petroleum bg-petroleum/10 text-petroleum shadow-inner' : 'border-slate-200/40 text-slate-400 hover:text-petroleum hover:bg-slate-50 shadow-sm'} ${isThinking ? 'animate-pulse' : ''}`}
                    aria-label={isOpen ? 'Ocultar Copilot' : 'Mostrar Copilot'}
                    title="Assistente Solar Copilot"
                >
                    {isThinking ? (
                        <MdAutoAwesome className="text-solar-500" size={20} />
                    ) : (
                        <MdSmartToy size={20} />
                    )}
                </button>

                {/* Ações específicas do módulo (ex.: NOVO NEGÓCIO, badges, etc.) */}
                {moduleActions != null && (
                    <>
                        <div className="h-5 w-px bg-slate-200" aria-hidden />
                        {moduleActions}
                    </>
                )}
            </div>
        </header>
    );
};
