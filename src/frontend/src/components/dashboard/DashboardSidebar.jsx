import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * DASHBOARD SIDEBAR - Command Center v1.4
 * Primary Navigation for Quarks OS Solar Edition.
 * Theme: Petroleum (#0F4C5C) | Material Symbols Outlined (w300)
 */
const getNavConfig = () => {
    return [
        {
            section: 'Operacional',
            items: [
                { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
                { path: '/workspace', icon: 'layers', label: 'Workspace' },
                { path: '/leads', icon: 'filter_alt', label: 'Leads' },
                { path: '/clients', icon: 'groups', label: 'Clientes' },
                { path: '/proposals', icon: 'description', label: 'Propostas' },
                { path: '/chat', icon: 'forum', label: 'Chat IA' },
            ]
        },
        {
            section: 'Gestão',
            items: [
                { path: '/services', icon: 'settings_suggest', label: 'Serviços' },
                { path: '/pricing-rules', icon: 'attach_money', label: 'Tabelas de Preço' },
                { path: '/settings', icon: 'settings', label: 'Configurações' },
            ]
        },
        {
            section: 'Engenharia',
            items: [
                { path: '/projetos', icon: 'folder_open', label: 'Projetos' },
                { path: '/cronograma', icon: 'calendar_today', label: 'Cronograma' },
                { path: '/dimensionamento', icon: 'psychology', label: 'I.A. Dimension' },
                { path: '/products', icon: 'bolt', label: 'Produtos' },
                { path: '/kits', icon: 'inventory_2', label: 'Kits' },
            ]
        }
    ];
};

export const DashboardSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
    const location = useLocation();
    const navConfig = useMemo(() => getNavConfig(), []);

    const NavLinkItem = ({ path, icon, label, collapsed }) => {
        const isExact = location.pathname === path;
        const isParent = ['/leads', '/clients', '/proposals', '/projetos'].includes(path) && location.pathname.startsWith(path + '/');
        const isActive = isExact || isParent || (path === '/' && location.pathname === '/dashboard');

        return (
            <Link
                to={path}
                onClick={onMobileClose}
                className={`
                    flex items-center gap-3 px-4 py-1.5 rounded-lg transition-all duration-200 ease-in-out group relative active:scale-95
                    ${isActive
                        ? 'bg-white/10 text-white border border-white/5 shadow-none'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'}
                    ${collapsed ? 'justify-center px-0 w-10 mx-auto' : ''}
                `}
            >
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-solar' : 'text-slate-400 group-hover:text-white'}`}>
                    {icon}
                </span>
                {!collapsed && <span className="text-sm font-semibold truncate tracking-tight">{label}</span>}

                {collapsed && (
                    <div className="absolute left-14 bg-petroleum-950 border border-white/10 text-white text-[10px] font-semibold uppercase py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
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
                <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden transition-opacity" onClick={onMobileClose} />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 md:static
                    ${collapsed ? 'w-16' : 'w-64'} 
                    bg-petroleum border-r border-white/5 flex flex-col justify-between
                    transition-all duration-300 ease-in-out shrink-0
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="flex flex-col p-4 gap-8">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-solar shrink-0">
                            <span className="material-symbols-outlined text-[26px]">solar_power</span>
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col animate-in fade-in duration-500">
                                <h1 className="text-white text-base font-semibold tracking-tight uppercase">Quarks OS</h1>
                                <span className="text-white/40 text-[9px] font-semibold tracking-widest uppercase">Solar Edition</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-5" aria-label="Menu principal">
                        {navConfig.map(({ section, items }) => (
                            <div key={section} className="flex flex-col gap-1">
                                {!collapsed && (
                                    <h3 className="px-4 ds-label text-white/20 mb-1">
                                        {section}
                                    </h3>
                                )}
                                {collapsed && <div className="h-px bg-white/5 mx-4 my-2" />}
                                <div className="flex flex-col gap-1">
                                    {items.map((item) => (
                                        <NavLinkItem key={item.path} {...item} collapsed={collapsed} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Profile Switcher */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all active:scale-95 group ${collapsed ? 'justify-center' : ''}`}>
                        <div className="size-9 rounded-full bg-solar flex items-center justify-center text-white font-semibold text-xs border border-white/10 shrink-0 shadow-none">
                            JD
                        </div>
                        {!collapsed && (
                            <>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-white text-[13px] font-semibold truncate tracking-tight">João Dias</p>
                                    <p className="text-white/40 text-[10px] truncate uppercase font-medium">Administrador</p>
                                </div>
                                <span className="material-symbols-outlined text-white/20 ml-auto text-[18px] group-hover:text-white transition-colors">expand_more</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Toggle Button */}
                {!mobileOpen && (
                    <button
                        onClick={onToggle}
                        className="absolute -right-3 top-20 size-6 bg-petroleum border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all shadow-none z-50 hidden md:flex"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {collapsed ? 'chevron_right' : 'chevron_left'}
                        </span>
                    </button>
                )}
            </aside>
        </>
    );
};
