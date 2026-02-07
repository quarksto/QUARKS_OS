import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCopilot } from '../../context/CopilotContext';
import { useLayout } from '../../contexts/LayoutContext';
import { useMode } from '../../providers/ModeProvider';
import {
    MdGridView,
    MdForum,
    MdViewKanban,
    MdPersonSearch,
    MdGroup,
    MdDescription,
    MdFolderOpen,
    MdPsychology,
    MdCalendarToday,
    MdSolarPower,
    MdSettings,
    MdBolt,
    MdSearch,
    MdUnfoldMore,
    MdChevronRight,
    MdChevronLeft,
    MdClose
} from 'react-icons/md';

const getNavConfig = (mode) => {
    const isSales = mode === 'SALES';

    const operationalItems = [
        { path: '/dashboard', icon: MdGridView, label: 'Dashboard' },
        { path: '/workspace', icon: MdForum, label: 'Workspace' },
        { path: '/funnel', icon: MdViewKanban, label: 'Funil de Vendas' },
        { path: '/leads', icon: MdPersonSearch, label: 'Leads' },
        { path: '/clients', icon: MdGroup, label: 'Clientes' },
        { path: '/proposals', icon: MdDescription, label: 'Propostas' },
    ];

    // Favor Workspace if in Sales mode
    if (isSales) {
        operationalItems.sort((a, b) => {
            if (a.path === '/workspace') return -1;
            if (b.path === '/workspace') return 1;
            return 0;
        });
    }

    return [
        { section: 'Operacional', items: operationalItems },
        {
            section: 'Engenharia', items: [
                { path: '/projetos', icon: MdFolderOpen, label: 'Projetos' },
                { path: '/dimensionamento', icon: MdPsychology, label: 'Dimensionamento IA' },
                { path: '/cronograma', icon: MdCalendarToday, label: 'Cronograma' },
                { path: '/kits', icon: MdSolarPower, label: 'Kits' },
            ]
        },
        {
            section: 'Admin', items: [
                { path: '/settings', icon: MdSettings, label: 'Configurações' },
            ]
        },
    ];
};

export const DashboardSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
    const { mode } = useMode();
    const location = useLocation();
    const { isOpen: isCopilotOpen, toggleSidebar: toggleCopilot } = useCopilot();
    const navConfig = useMemo(() => getNavConfig(mode), [mode]);

    const NavLinkItem = ({ path, icon: Icon, label, collapsed }) => {
        const isActive = location.pathname === path
            || (path === '/' && location.pathname === '/dashboard')
            || (path === '/proposals' && (location.pathname.startsWith('/proposals')));

        const handleClick = (e) => {
            if (onMobileClose) onMobileClose();
        };

        return (
            <Link
                to={path}
                onClick={handleClick}
                className={`w-full flex items-center gap-3 px-3 py-3 text-[14px] font-medium transition-all duration-200 group relative ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/10 text-white rounded-md' : 'text-white/80 hover:text-white hover:bg-white/5 rounded-md'}`}
            >
                <Icon
                    size={20}
                    className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                    <div className="absolute left-[68px] bg-petroleum-900 border border-white/10 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                        {label}
                    </div>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-petroleum-950/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={onMobileClose}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 md:static
                    ${collapsed ? 'w-[72px]' : 'w-80'} 
                    bg-petroleum border-r border-slate-200/40 flex flex-col 
                    transition-all duration-300 ease-in-out shrink-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="h-16 flex items-center px-4 border-b border-white/5 shrink-0">
                    <Link to="/" className="flex items-center gap-3" onClick={onMobileClose}>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <MdBolt size={20} className="text-solar-500" />
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col animate-fadeIn">
                                <span className="text-white font-bold text-sm tracking-wide">QUARKS OS</span>
                                <span className="text-[10px] text-white/40 font-sans tracking-wider">SOLAR EDITION</span>
                            </div>
                        )}
                    </Link>
                </div>

                {!collapsed && (
                    <div className="px-4 py-4 shrink-0">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <MdSearch size={18} className="text-white/30 group-focus-within:text-white/60 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar (Ctrl+K)"
                                className="w-full h-10 bg-petroleum-950/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-petroleum-950/50 transition-all font-sans"
                                aria-label="Busca global"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded font-sans">/</span>
                            </div>
                        </div>
                    </div>
                )}

                {collapsed && (
                    <div className="px-2 py-4 flex justify-center shrink-0">
                        <button type="button" className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors" aria-label="Busca">
                            <MdSearch size={20} />
                        </button>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-hide" aria-label="Menu principal">
                    {navConfig.map(({ section, items }) => (
                        <div key={section}>
                            {collapsed ? (
                                <div className="h-px w-8 bg-white/10 mx-auto my-4" />
                            ) : (
                                <div className="px-4 py-3 mt-4">
                                    <h3 className="text-[11px] font-bold text-white/30 font-sans">{section}</h3>
                                </div>
                            )}
                            {items.map((item) => (
                                <NavLinkItem key={item.path} path={item.path} icon={item.icon} label={item.label} collapsed={collapsed} />
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="p-3 border-t border-white/5 bg-petroleum-950/20 shrink-0">
                    <button type="button" className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/5 text-left transition-colors group ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-solar-500 flex items-center justify-center shrink-0 ring-2 ring-petroleum">
                            <span className="text-[10px] font-bold text-white">JD</span>
                        </div>
                        {!collapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate group-hover:text-solar-400 transition-colors">John Doe</div>
                                    <div className="text-[10px] text-white/40 font-sans truncate">john@quarks.solar</div>
                                </div>
                                <MdUnfoldMore size={18} className="text-white/30 group-hover:text-white/60 shrink-0" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute -right-3 top-20 w-6 h-6 bg-petroleum border border-slate-200/20 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-petroleum-600 transition-all shadow-sm z-50 hidden md:flex"
                        aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
                    >
                        {collapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
                    </button>
                    {/* Close button for mobile */}
                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="absolute right-4 top-4 text-white md:hidden"
                    >
                        <MdClose size={24} />
                    </button>
                </div>
            </aside>
        </>
    );
};
