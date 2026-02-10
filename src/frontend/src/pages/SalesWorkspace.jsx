import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCopilot } from '../context/CopilotContext';
import { ConversationList } from '../hybrid/ConversationList';
import { LeadContextPanel } from '../hybrid/LeadContextPanel';
import { LeadDetailDrawer } from '../hybrid/LeadDetailDrawer';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { usePipelineData } from '../hooks/usePipelineData';
import { LeadIntelligenceSidebar } from '../hybrid/LeadIntelligenceSidebar';
import { SalesDashboardSolar } from '../components/dashboard/SalesDashboardSolar';
import { SalesDashboardTechnical } from '../components/dashboard/SalesDashboardTechnical';
import { AdaptiveHeader } from '../components/dashboard/AdaptiveHeader';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';

import { useLayout } from '../contexts/LayoutContext';


function flattenPipeline(pipeline) {
    if (!pipeline || typeof pipeline !== 'object') return [];
    const statuses = ['NEW', 'CONTACTED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const list = [];
    for (const status of statuses) {
        const arr = pipeline[status];
        if (Array.isArray(arr)) list.push(...arr);
    }
    return list;
}

export default function SalesWorkspace() {
    const { setContext, openSidebar } = useCopilot();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const leadIdFromUrl = searchParams.get('leadId') || '';

    // Core State (via Hook)
    const { pipeline, loading, error: pipelineError, refresh } = usePipelineData();

    const [selectedLead, setSelectedLead] = useState(null);
    const { isSidebarCollapsed, toggleSidebar } = useLayout();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Detail State
    const [leadDetailLoading, setLeadDetailLoading] = useState(false);
    const [leadDetail, setLeadDetail] = useState(null);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [createLeadOpen, setCreateLeadOpen] = useState(false);
    const [showCreatedMessage, setShowCreatedMessage] = useState(false);

    // View State (Geral | Técnico)
    const [activeView, setActiveView] = useState('geral');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (!showCreatedMessage) return;
        const t = setTimeout(() => setShowCreatedMessage(false), 3000);
        return () => clearTimeout(t);
    }, [showCreatedMessage]);

    const leads = flattenPipeline(pipeline);

    const filteredLeads = React.useMemo(() => {
        if (!leads.length) return [];
        let list = leads;
        if (statusFilter === '__NEW__') {
            const cutoff = Date.now() - 48 * 60 * 60 * 1000;
            list = list.filter((l) => l.createdAt && new Date(l.createdAt).getTime() > cutoff);
        } else if (statusFilter) {
            list = list.filter((l) => l.status === statusFilter);
        }
        if (searchQuery?.trim()) {
            const q = searchQuery.trim().toLowerCase();
            const qNorm = q.replace(/\D/g, '');
            list = list.filter((lead) => {
                const name = (lead.name || '').toLowerCase();
                const email = (lead.email || '').toLowerCase();
                const phone = (lead.phone || '').replace(/\D/g, '');
                return name.includes(q) || email.includes(q) || (qNorm && phone.includes(qNorm));
            });
        }
        return list;
    }, [leads, searchQuery, statusFilter]);

    const currentLead = leadDetail ?? selectedLead;
    const isHomeState = !selectedLead;

    useEffect(() => {
        if (loading) return;
        if (!leads.length) return;

        if (leadIdFromUrl) {
            const found = leads.find((l) => String(l.id) === String(leadIdFromUrl));
            if (found && (!selectedLead || String(selectedLead.id) !== String(leadIdFromUrl))) {
                setSelectedLead(found);
            }
        } else if (!selectedLead) {
            const first = leads[0];
            setSelectedLead(first);
        }
    }, [leadIdFromUrl, leads, loading]);

    useEffect(() => {
        if (leadIdFromUrl && selectedLead == null) return;
        const id = selectedLead?.id;
        const current = searchParams.get('leadId') || '';
        if (String(id) === String(current)) return;
        const next = new URLSearchParams(searchParams);
        if (id != null && id !== '') {
            next.set('leadId', String(id));
        } else {
            next.delete('leadId');
        }
        setSearchParams(next, { replace: true });
    }, [selectedLead?.id]);


    useEffect(() => {
        const handleKeyDown = (e) => {
            const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
            if (inInput) return;
            if (filteredLeads.length === 0) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const idx = selectedLead ? filteredLeads.findIndex((l) => l.id === selectedLead.id) : -1;
                const next = idx < filteredLeads.length - 1 ? filteredLeads[idx + 1] : filteredLeads[0];
                setSelectedLead(next);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const idx = selectedLead ? filteredLeads.findIndex((l) => l.id === selectedLead.id) : 0;
                const next = idx > 0 ? filteredLeads[idx - 1] : filteredLeads[filteredLeads.length - 1];
                setSelectedLead(next);
                return;
            }
            if (e.key === 'Enter' && selectedLead) {
                e.preventDefault();
                setDetailDrawerOpen(true);
                return;
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                if (selectedLead?.id) navigate('/proposals/new', { state: { leadId: selectedLead.id } });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredLeads, selectedLead?.id, navigate]);

    useEffect(() => {
        const base = 'Quarks OS';
        const title = currentLead ? `${currentLead.name || 'Lead'} - Workspace - ${base}` : `Workspace - ${base}`;
        document.title = title;
        return () => { document.title = base; };
    }, [currentLead?.id, currentLead?.name]);

    useEffect(() => {
        if (!selectedLead) {
            setLeadDetail(null);
            return;
        }
        let cancelled = false;
        setLeadDetailLoading(true);
        api.get(`/leads/${selectedLead.id}`)
            .then((res) => {
                if (!cancelled && res.data) setLeadDetail(res.data);
            })
            .catch((e) => {
                if (!cancelled) setLeadDetail(selectedLead);
                console.error('Lead detail load error:', e);
            })
            .finally(() => {
                if (!cancelled) setLeadDetailLoading(false);
            });
        return () => { cancelled = true; };
    }, [selectedLead?.id]);

    const handleStatusChange = (leadId, newStatus, onDone) => {
        api.patch(`/leads/${leadId}/status`, { status: newStatus })
            .then(() => refresh())
            .then(() => {
                if (selectedLead?.id === leadId) {
                    return api.get(`/leads/${leadId}`).then((res) => { if (res.data) setLeadDetail(res.data); });
                }
            })
            .catch((e) => console.error('Status update error:', e))
            .finally(() => onDone?.());
    };

    const handleLeadUpdate = async (leadId, data) => {
        try {
            const res = await api.patch(`/leads/${leadId}`, data);
            if (res.data) {
                setLeadDetail(res.data);
                refresh();
            }
            return res.data;
        } catch (e) {
            console.error('Lead update error:', e);
            throw e;
        }
    };

    const headerActions = (
        <div className="flex items-center gap-4">
            <button
                onClick={() => setCreateLeadOpen(true)}
                className="group relative h-8 px-4 rounded-full bg-solar text-white font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <span className="material-symbols-outlined ds-icon-w300 text-[18px]">add</span>
                <span>Novo Lead</span>
            </button>
        </div>
    );

    return (
        <div className="flex h-screen bg-canvas overflow-hidden font-sans">
            <DashboardSidebar
                collapsed={isSidebarCollapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AdaptiveHeader
                    title="Dashboard"
                    subtitle="Workspace de Vendas Inteligente"
                    headerIcon="hub"
                    loading={loading}
                    moduleActions={headerActions}
                    onMenuClick={() => setMobileMenuOpen(true)}
                    breadcrumbs={[
                        { label: 'Gestão' },
                        { label: 'Workspace' }
                    ]}
                />

                <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center gap-3 shadow-none z-20">
                    <span className="material-symbols-outlined text-solar ds-icon-w300 text-[20px]">auto_awesome</span>
                    <p className="text-slate-700 text-sm font-medium">
                        <span className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">Quarks IA Insights:</span> Detectada anomalia de eficiência no Inversor B-04. <a className="underline hover:text-solar ml-1 decoration-slate-200 underline-offset-2" href="#">Ver detalhes</a>
                    </p>
                </div>

                <div className="flex flex-1 min-w-0 overflow-hidden h-full bg-slate-50 relative p-6 gap-6">
                    <div className="absolute inset-0 bg-slate-50 pointer-events-none z-0" />

                    <aside
                        className={`
                            shrink-0 flex flex-col bg-white border border-slate-100 rounded-lg overflow-hidden transition-all duration-300 z-20 
                            ${isHomeState ? 'w-full md:w-[360px] flex' : 'hidden md:flex md:w-[360px]'}
                        `}
                    >
                        <ConversationList
                            leads={leads}
                            selectedId={selectedLead?.id}
                            onSelectLead={(lead) => {
                                setSelectedLead(lead);
                                setDetailDrawerOpen(true);
                            }}
                            loading={loading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            onRequestCreateLead={() => setCreateLeadOpen(true)}
                            error={pipelineError}
                            onRetry={refresh}
                        />
                    </aside>

                    <main
                        className={`
                            flex-1 min-w-0 flex flex-col bg-white border border-slate-100 rounded-lg overflow-hidden relative z-10 transition-all duration-300 
                            ${!isHomeState ? 'flex' : 'hidden md:flex'}
                        `}
                    >
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {currentLead ? (
                                <LeadContextPanel
                                    lead={currentLead}
                                    loading={leadDetailLoading && !!selectedLead}
                                    onOpenDetail={() => setDetailDrawerOpen(true)}
                                    onStatusChange={handleStatusChange}
                                    onOpenCopilot={() => {
                                        setContext({ type: 'LEAD', leadId: currentLead.id, lead: currentLead });
                                        openSidebar();
                                    }}
                                />
                            ) : (
                                <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50/50">
                                    <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="ds-title-page text-slate-800">
                                                {activeView === 'tecnico' ? 'Visão Técnica' : 'Visão Geral'}
                                            </h2>
                                            <p className="ds-label text-slate-400">
                                                {activeView === 'tecnico'
                                                    ? 'Monitoramento de engenharia e performance dos inversores.'
                                                    : 'Monitoramento em tempo real da operação comercial.'}
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-slate-100 bg-white overflow-hidden shadow-none">
                                            {activeView === 'tecnico' ? (
                                                <SalesDashboardTechnical
                                                    metrics={pipeline.metrics}
                                                    loading={loading}
                                                />
                                            ) : (
                                                <SalesDashboardSolar
                                                    metrics={pipeline.metrics}
                                                    funnel={pipeline.funnel}
                                                    activity={pipeline.activity}
                                                    loading={loading}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    <aside className={`hidden xl:flex w-[320px] shrink-0 flex-col bg-white border border-slate-100 rounded-lg overflow-hidden z-20 ${isHomeState ? 'hidden xl:hidden' : ''}`}>
                        <LeadIntelligenceSidebar lead={currentLead} loading={leadDetailLoading && !!selectedLead} />
                    </aside>
                </div>
            </div>

            <LeadDetailDrawer
                open={detailDrawerOpen}
                onClose={() => setDetailDrawerOpen(false)}
                lead={currentLead}
                loading={leadDetailLoading && !!selectedLead}
                onUpdate={handleLeadUpdate}
            />
            <CreateLeadModal
                isOpen={createLeadOpen}
                onClose={() => setCreateLeadOpen(false)}
                onSuccess={() => {
                    refresh();
                    setShowCreatedMessage(true);
                }}
                defaultStatus="NEW"
            />
            {showCreatedMessage && (
                <div className="fixed bottom-6 right-6 z-[100] px-6 py-4 bg-slate-800 text-white rounded-lg border border-slate-700 flex items-center gap-3 shadow-none animate-in slide-in-from-bottom duration-300" role="status" aria-live="polite">
                    <span className="material-symbols-outlined text-2xl ds-icon-w300" aria-hidden>check_circle</span>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-semibold">Lead criado com sucesso</span>
                        <span className="text-[11px] text-slate-400">Você já pode iniciar o atendimento.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
