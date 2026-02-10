import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';

// Layout alinhado ao Stitch "Quarks OS Sales Dashboard" (projeto listado via MCP).
// Ref.: docs/DASHBOARD_STITCH_MCP.md

const COLUMN_TITLES = {
    'NEW': { label: 'Triagem', color: 'slate' },
    'CONTACTED': { label: 'Qualificação', color: 'blue' },
    'PROPOSAL_SENT': { label: 'Proposta', color: 'violet' },
    'NEGOTIATION': { label: 'Negociação', color: 'pink' }
};

function Dashboard() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { metrics, pipeline, loading } = useDashboardData();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    const navItemClass = (path) =>
        location.pathname === path ? 'nav-item-active' : 'nav-item-inactive';

    return (
        <div className="h-screen overflow-hidden flex bg-white font-sans text-primary selection:bg-petroleum/10">
            {/* Sidebar */}
            <aside
                className={`bg-petroleum flex flex-col shrink-0 z-20 border-r border-slate-200/40 transition-all duration-200 ${sidebarCollapsed ? 'w-[72px]' : 'w-80'}`}
                id="sidebar"
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
                    <Link to="/" className={`flex items-center gap-3 ${sidebarCollapsed ? 'hidden' : ''}`} aria-label="Ir para início">
                        <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-solar" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <span className="text-white font-bold tracking-tight text-sm">SOLAR OS</span>
                    </Link>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        aria-label={sidebarCollapsed ? 'Expandir menu' : 'Colapsar menu'}
                    >
                        <span className={`material-symbols-outlined transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}>side_navigation</span>
                    </button>
                </div>

                <div className={`px-6 mt-6 ${sidebarCollapsed ? 'px-2' : ''}`}>
                    <button className={`search-container w-full flex items-center gap-2 bg-petroleum-950/30 hover:bg-petroleum-950/50 border border-white/10 rounded-md transition-all text-left group h-10 ${sidebarCollapsed ? 'justify-center px-0 border-none bg-transparent' : 'px-3 py-2'}`}>
                        <span className="material-symbols-outlined text-white/50 group-hover:text-white/80 shrink-0" style={{ fontSize: '18px' }}>search</span>
                        <span className={`search-text text-[13px] text-white/50 group-hover:text-white/80 flex-1 font-medium truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Busca Global</span>
                        <kbd className={`hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-sans text-white/40 ${sidebarCollapsed ? 'hidden' : ''}`}>
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                </div>

                <nav className="flex-1 py-10 px-6 space-y-10 overflow-y-auto overflow-x-hidden" aria-label="Menu principal">
                    <div className="space-y-4">
                        <h2 className={`px-3 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] transition-all ${sidebarCollapsed ? 'opacity-0 h-0 my-0 overflow-hidden' : ''}`}>Operacional</h2>
                        <div className="space-y-1">
                            <Link to="/" className={`flex items-center gap-4 px-3 py-3 ${navItemClass('/')} transition-all group`}>
                                <span className="material-symbols-outlined shrink-0">grid_view</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Dashboard</span>
                            </Link>
                            <Link to="/" className={`flex items-center gap-4 px-3 py-3 ${navItemClass('/')} transition-all group`} title="Funil exibido nesta página">
                                <span className="material-symbols-outlined shrink-0">view_kanban</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Funil de Vendas</span>
                            </Link>
                            <a className="flex items-center gap-4 px-3 py-3 nav-item-inactive transition-all group" href="#" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Em breve">
                                <span className="material-symbols-outlined shrink-0">person_search</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Leads</span>
                            </a>
                            <Link to="/chat" className={`flex items-center gap-4 px-3 py-3 ${navItemClass('/chat')} transition-all group`}>
                                <span className="material-symbols-outlined shrink-0">smart_toy</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Chat IA</span>
                            </Link>
                            <Link to="/proposals" className={`flex items-center gap-4 px-3 py-3 ${navItemClass('/proposals')} transition-all group`}>
                                <span className="material-symbols-outlined shrink-0">description</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Propostas</span>
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className={`px-3 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] transition-all ${sidebarCollapsed ? 'opacity-0 h-0 my-0 overflow-hidden' : ''}`}>Engenharia</h2>
                        <div className="space-y-1">
                            <a className="flex items-center gap-4 px-3 py-3 nav-item-inactive transition-all group" href="#" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Em breve">
                                <span className="material-symbols-outlined shrink-0">folder_open</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Projetos</span>
                            </a>
                            <a className="flex items-center gap-4 px-3 py-3 nav-item-inactive transition-all group" href="#" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Em breve">
                                <span className="material-symbols-outlined shrink-0">psychology</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Dimensionamento IA</span>
                            </a>
                            <a className="flex items-center gap-4 px-3 py-3 nav-item-inactive transition-all group" href="#" onClick={(e) => e.preventDefault()} aria-disabled="true" title="Em breve">
                                <span className="material-symbols-outlined shrink-0">calendar_today</span>
                                <span className={`text-[15px] truncate ${sidebarCollapsed ? 'hidden' : ''}`}>Cronograma</span>
                            </a>
                        </div>
                    </div>
                </nav>
                <div className="p-6 border-t border-white/5 bg-petroleum-950/20 space-y-6 shrink-0">
                    <button className={`w-full flex items-center gap-3 p-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors group text-left h-12 overflow-hidden ${sidebarCollapsed ? 'justify-center border-none bg-transparent' : ''}`}>
                        <div className="w-8 h-8 rounded-md bg-cover bg-center border border-white/10 shrink-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmkL7u8cr8ap5QhF616AaVZ99MKNzEiq9iCsemn7rRgrAl1WdmNXBp2Ux1MSosMLIta_Kwd0BpZqIflMzcZCDDbwVyY7k5hwLnW6cMv7-7Mjx74ZlCV4mM1GVIxTz79WfF6JgcRRt5UJ-461xHtef0Gxts9-vkrKaUeKgnD1scWaMBEKKH4jUcYkZg1iyYHe0ytzdPOmqS3gjIUlBLzHHg23_MmZ7Q8E03PXpZCJ363sf7NbJiytE84NKgVwxFg2IKLhcgJ_0-v2Zm')" }}></div>
                        <div className={`flex flex-col min-w-0 overflow-hidden ${sidebarCollapsed ? 'hidden' : ''}`}>
                            <span className="text-[13px] font-medium text-white truncate leading-tight">Solar Tech Ltda</span>
                            <span className="text-[10px] text-white/50 font-sans uppercase tracking-tighter">Enterprise Plan</span>
                        </div>
                        <span className={`material-symbols-outlined text-white/30 ml-auto group-hover:text-white/60 shrink-0 ${sidebarCollapsed ? 'hidden' : ''}`} style={{ fontSize: '16px' }}>unfold_more</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#FCFDFF]">
                <header className="h-20 border-b border-slate-200/40 flex items-center justify-between px-8 shrink-0 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-petroleum rounded-md flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="ds-title-page leading-none">Dashboard</h1>
                            <span className="ds-label-subtle mt-1 font-medium">Solar Integrator 4.0</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Copilot Button (Icon Only, Rounded Full) */}
                        <button
                            type="button"
                            className="w-10 h-10 rounded-lg border border-slate-200/40 flex items-center justify-center text-slate-400 hover:text-petroleum hover:bg-slate-50 transition-colors"
                            aria-label="Abrir Copiloto"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>smart_toy</span>
                        </button>

                        <div className="h-5 w-px bg-slate-200" aria-hidden="true"></div>

                        <div className="flex items-center gap-2 text-[12px] text-slate-500" aria-live="polite" aria-atomic="true">
                            <div className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${loading ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                {loading ? 'Sincronizando...' : 'Online'}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-slate-200" aria-hidden="true"></div>

                        {/* New Business Button (Rounded Full, No Shadow) */}
                        <button
                            type="button"
                            className="rounded-lg bg-solar hover:bg-amber-600 text-[#FFFFFF] px-6 py-2.5 flex items-center gap-2 font-bold text-[11px] transition-colors"
                            onClick={() => navigate('/chat')}
                            aria-label="Abrir Chat IA para novo negócio"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                            NOVO NEGÓCIO
                        </button>
                    </div>
                </header>

                <div className="bg-petroleum/[0.02] border-b border-slate-200/40 py-3 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200/40 flex items-center justify-center">
                            <span className="material-symbols-outlined text-petroleum" style={{ fontSize: '14px' }}>smart_toy</span>
                        </div>
                        <p className="text-[13px] font-medium text-petroleum-800 leading-none">
                            <span className="font-bold">IA Insight:</span> <span className="tabular-nums font-sans font-semibold">5</span> leads qualificados pelo Agente Hunter estão prontos para fechamento.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn-pill text-petroleum hover:text-petroleum-900 hover:bg-petroleum/5 px-4 py-2 flex items-center gap-1"
                        onClick={() => navigate('/chat')}
                        aria-label="Ver detalhes no Chat IA"
                    >
                        Ver detalhes <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>arrow_forward</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto space-y-6">
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1 */}
                            <div className="technical-card h-[200px] hover:border-petroleum/30 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="kpi-title">Leads Gerados</span>
                                    <span className="badge-ultra-compact border-emerald-100 text-emerald-600 bg-emerald-50 rounded-lg">+12.5%</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="ds-display-l tabular-nums">{metrics.activeLeads}</h3>
                                    <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-lg overflow-hidden">
                                        <div className="h-full bg-solar" style={{ width: '83.2%' }}></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-200/20 flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Meta</span>
                                        <span className="kpi-value text-[12px]">1.5k</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Restante</span>
                                        <span className="kpi-value text-[12px]">252</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 - Conversion */}
                            <div className="technical-card h-[200px] hover:border-petroleum/30 p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="kpi-title">Conversão</span>
                                    <span className="badge-ultra-compact border-emerald-100 text-emerald-600 bg-emerald-50 rounded-lg">Meta: 40%</span>
                                </div>
                                <div className="flex-1 flex items-center gap-6">
                                    <div className="relative w-16 h-16 shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle className="stroke-slate-100" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                            <circle className="stroke-solar" cx="18" cy="18" fill="none" r="16" strokeDasharray="38.2, 100" strokeLinecap="round" strokeWidth="3"></circle>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-[10px] font-sans font-medium text-solar">{metrics.conversionRate}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="ds-display-l tabular-nums">{metrics.conversionRate}</h3>
                                        <span className="support-text mt-1">Tx. de Sucesso</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-200/20 flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Anterior</span>
                                        <span className="kpi-value text-[12px]">34.0%</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Delta</span>
                                        <span className="kpi-value text-[12px] text-emerald-600">+4.2%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 - Pipeline */}
                            <div className="technical-card h-[200px] hover:border-petroleum/30 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="kpi-title">Pipeline Ativo</span>
                                    <span className="badge-ultra-compact rounded-lg">LIVE</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-4xl kpi-value text-petroleum-900 tabular-nums">{metrics.revenue}</h3>
                                    <div className="mt-4 flex gap-1 h-2">
                                        <div className="flex-[3] bg-petroleum-900 rounded-sm" title="Proposta"></div>
                                        <div className="flex-[2] bg-petroleum-700 rounded-sm" title="Qualificação"></div>
                                        <div className="flex-[1] bg-petroleum-400 rounded-sm" title="Triagem"></div>
                                        <div className="flex-[2] bg-slate-100 rounded-sm" title="Prospects"></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-200/20 flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Nº Leads</span>
                                        <span className="kpi-value text-[12px]">{metrics.activeLeads} Active</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Avg Ticket</span>
                                        <span className="kpi-value text-[12px]">R$ 37k</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 - Automation */}
                            <div className="technical-card h-[200px] hover:border-petroleum/30 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="kpi-title">Automações</span>
                                    <span className="badge-ultra-compact border-emerald-100 text-emerald-600 bg-emerald-50 rounded-lg">Eco: 24h</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="ds-display-xl tabular-nums">{metrics.automations}</h3>
                                        <span className="ds-label-subtle">ops</span>
                                    </div>
                                    <div className="mt-4 flex items-end gap-1 h-8">
                                        <div className="w-full bg-solar/20 h-[30%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar/20 h-[45%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar/20 h-[65%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar h-[85%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar/20 h-[50%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar/20 h-[40%] rounded-t-sm"></div>
                                        <div className="w-full bg-solar/20 h-[75%] rounded-t-sm"></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-200/20 flex justify-between">
                                    <div className="flex flex-col">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Agente Sync</span>
                                        <span className="kpi-value text-[12px]">0.02ms</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="kpi-title" style={{ fontSize: '9px' }}>Status</span>
                                        <span className="kpi-value text-[12px] text-emerald-500 uppercase">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-6 items-start">
                            <div className="col-span-12 xl:col-span-9 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h2 className="section-title">Fluxo Comercial</h2>
                                        <span className="badge-ultra-compact px-3 rounded-lg">
                                            <span className="tabular-nums font-bold">{metrics.activeLeads}</span>&nbsp;Negócios
                                        </span>
                                    </div>
                                    <button type="button" className="w-10 h-10 btn-pill bg-white border border-slate-200/40 text-slate-400 hover:bg-slate-50" aria-label="Filtrar fluxo (em breve)">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
                                    </button>
                                </div>

                                <div className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2">
                                    {/* Kanban Columns Dynamic */}
                                    {Object.entries(COLUMN_TITLES).map(([statusKey, config]) => (
                                        <div key={statusKey} className="kanban-column flex flex-col gap-5 min-w-[300px] max-w-[300px]">
                                            <div className="flex items-center justify-between px-1 mb-1 border-b border-slate-200/40 pb-4">
                                                <span className="kpi-title">{config.label}</span>
                                                <span className="badge-ultra-compact bg-slate-100 text-slate-500 border-none font-sans font-bold px-2.5 py-1 rounded-lg">
                                                    {pipeline[statusKey]?.length || 0}
                                                </span>
                                            </div>

                                            {/* Cards for this column */}
                                            {pipeline[statusKey]?.map(lead => (
                                                <div key={lead.id} className="technical-card p-6 space-y-4 hover:border-petroleum/40 cursor-pointer group">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-[15px] font-bold text-primary group-hover:text-petroleum transition-colors truncate max-w-[180px]">{lead.name}</h4>
                                                            <p className="support-text-sm flex items-center gap-1 mt-1">
                                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span> {lead.location || 'Local N/A'}
                                                            </p>
                                                        </div>
                                                        <span className="material-symbols-outlined text-petroleum/60" style={{ fontSize: '18px' }}>radar</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        {lead.consumption && (
                                                            <span className="badge-ultra-compact rounded-lg">
                                                                {lead.consumption} kWh
                                                            </span>
                                                        )}
                                                        <span className="badge-ultra-compact border-solar/20 text-solar bg-solar-50/50 tabular-nums rounded-lg">92% Match</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                        <span className="kpi-value text-[14px] tabular-nums text-slate-700">R$ --</span>
                                                        {/* Placeholder for Deal Value until we link Proposal to List View */}
                                                        <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200/40 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '14px' }}>person</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {(!pipeline[statusKey] || pipeline[statusKey].length === 0) && (
                                                <div className="h-24 border border-dashed border-slate-200 rounded-md flex items-center justify-center text-xs text-slate-400">
                                                    Vazio
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
