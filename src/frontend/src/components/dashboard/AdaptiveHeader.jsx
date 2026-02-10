import React from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { ModeSwitcher } from '../shell/ModeSwitcher';
import { ConnectionStatus } from '../shared/ConnectionStatus';

/**
 * ADAPTIVE HEADER - Command Hub v1.4
 * Standard header for all Quarks OS modules.
 * Focus: High-density info, flat aesthetics, h-9 interactive elements.
 */
export const AdaptiveHeader = ({
    title = 'Dashboard',
    subtitle = 'Solar Integrator 4.0',
    loading = false,
    headerIcon = 'grid_view',
    moduleActions = null,
    onMobileMenuToggle,
    breadcrumbs = [],
}) => {
    const { isOpen, toggleSidebar, isThinking } = useCopilot();

    return (
        <header className="h-20 bg-canvas border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-30 sticky top-0 shadow-none">

            {/* Left Section: Title & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuToggle}
                    className="md:hidden size-8 -ml-2 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                >
                    <span className="material-symbols-outlined ds-icon-w300">menu</span>
                </button>

                <div className="size-10 bg-petroleum rounded-full flex items-center justify-center shrink-0 hidden md:flex shadow-none">
                    <span className="material-symbols-outlined text-white text-[22px] ds-icon-w300">{headerIcon}</span>
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                    </div>
                    <div className="flex items-center gap-3 leading-none">
                        <h1 className="font-semibold text-lg text-slate-800 tracking-tight">{title}</h1>
                    </div>
                </div>
            </div>

            {/* Center Section: Mode Switcher */}
            <div className="hidden lg:block">
                <ModeSwitcher />
            </div>

            {/* Right Section: Global Actions */}
            <div className="flex items-center gap-3">

                {/* Global Search Bar (Minimalist) */}
                <div className="hidden xl:flex items-center bg-white border border-slate-100 rounded-full h-8 px-3 w-64 mr-2 group transition-all shadow-none">
                    <span className="material-symbols-outlined text-[18px] text-slate-400 ds-icon-w300">search</span>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="bg-transparent border-none outline-none ring-0 focus:ring-0 w-full placeholder:text-slate-300 text-[13px]"
                    />
                    <kbd className="text-[10px] font-semibold text-slate-300 bg-slate-50 px-1.5 rounded-full border border-slate-100">⌘K</kbd>
                </div>

                <div className="h-6 w-px bg-slate-100 mx-2 hidden xl:block"></div>

                {/* Notifications */}
                <button
                    className="size-8 rounded-full flex items-center justify-center bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all relative shadow-none"
                    aria-label="Notificações"
                >
                    <span className="material-symbols-outlined text-[20px] ds-icon-w300">notifications</span>
                    <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>

                {/* AI Copilot Toggle */}
                <button
                    onClick={toggleSidebar}
                    className={`
                        flex items-center justify-center size-8 rounded-full transition-all border
                        ${isOpen
                            ? 'bg-petroleum text-white border-petroleum'
                            : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                        ${isThinking ? 'animate-pulse' : ''}
                    `}
                    aria-label="AI Copilot"
                >
                    <span className={`material-symbols-outlined text-[18px] ds-icon-w300 ${isThinking ? 'animate-spin' : ''}`}>
                        {isThinking ? 'autorenew' : 'smart_toy'}
                    </span>
                </button>

                {/* Module Actions Slot */}
                {moduleActions && (
                    <>
                        <div className="h-6 w-px bg-slate-100 mx-1"></div>
                        {moduleActions}
                    </>
                )}
            </div>
        </header>
    );
};
