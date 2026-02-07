import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { AdaptiveHeader } from './AdaptiveHeader';
import { useLayout } from '../../contexts/LayoutContext';

/**
 * Shell reutilizável: Sidebar + Header adaptativo + conteúdo.
 * Header adaptativo: Copilot e Notificações sempre visíveis; título/ícone/ações por módulo.
 */
export const DashboardShell = ({
    title = 'Dashboard',
    subtitle = 'Solar Integrator 4.0',
    loading = false,
    headerIcon = 'grid_view',
    headerRight = null,
    breadcrumbs = [],
    children,
}) => {
    const { isSidebarCollapsed, toggleSidebar } = useLayout();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex h-screen w-screen bg-[#F1F5F9] overflow-hidden font-sans text-slate-900 selection:bg-solar-100 selection:text-solar-900">
            <DashboardSidebar
                collapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
                mobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <AdaptiveHeader
                    title={title}
                    subtitle={subtitle}
                    loading={loading}
                    headerIcon={headerIcon}
                    moduleActions={headerRight}
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    breadcrumbs={breadcrumbs}
                />

                <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
};
