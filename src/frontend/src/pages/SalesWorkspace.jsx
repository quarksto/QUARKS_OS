import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCopilot } from '../context/CopilotContext';
import { ConversationList } from '../hybrid/ConversationList';
import { LeadContextPanel } from '../hybrid/LeadContextPanel';
import { LeadDetailDrawer } from '../hybrid/LeadDetailDrawer';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { useLeadRealtime } from '../hooks/useRealtime';
import { LeadIntelligenceSidebar } from '../hybrid/LeadIntelligenceSidebar';
import { DashboardShell } from '../components/dashboard/DashboardShell';

const SIDEBAR_COLLAPSED_KEY = 'quarks-hybrid-sidebar-collapsed'; // Legacy key, mostly unused now

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
    const [pipeline, setPipeline] = useState({});
    const [loading, setLoading] = useState(true);
    const [pipelineError, setPipelineError] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    // Sidebar collapsed state removed as we use the main DashboardSidebar
    const [leadDetailLoading, setLeadDetailLoading] = useState(false);
    const [leadDetail, setLeadDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [createLeadOpen, setCreateLeadOpen] = useState(false);
    const [showCreatedMessage, setShowCreatedMessage] = useState(false);

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

    useEffect(() => {
        if (!leadIdFromUrl || !leads.length) return;
        const id = leadIdFromUrl;
        const found = leads.find((l) => String(l.id) === String(id));
        if (found && (!selectedLead || String(selectedLead.id) !== String(id))) {
            setSelectedLead(found);
        }
    }, [leadIdFromUrl, leads]);

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

    const refreshPipeline = React.useCallback(() => {
        setPipelineError(null);
        setLoading(true);
        api
            .get('/leads/pipeline')
            .then((res) => {
                if (res.data) setPipeline(res.data);
            })
            .catch((e) => {
                console.error('SalesWorkspace pipeline load error:', e);
                setPipelineError(e?.message || 'Falha ao carregar');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await api.get('/leads/pipeline');
                if (!cancelled && res.data) {
                    setPipeline(res.data);
                    setPipelineError(null);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error('SalesWorkspace pipeline load error:', e);
                    setPipelineError(e?.message || 'Falha ao carregar');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Sync real-time optimized
    useLeadRealtime(null, (event) => {
        if (event.type === 'message_new') {
            setPipeline(prev => {
                const next = { ...prev };
                for (const status in next) {
                    next[status] = next[status].map(lead => {
                        if (lead.id === event.leadId) {
                            return { ...lead, unreadCount: (lead.unreadCount || 0) + 1 };
                        }
                        return lead;
                    });
                }
                return next;
            });
        } else if (event.type === 'unread_reset') {
            setPipeline(prev => {
                const next = { ...prev };
                for (const status in next) {
                    next[status] = next[status].map(lead => {
                        if (lead.id === event.leadId) {
                            return { ...lead, unreadCount: 0 };
                        }
                        return lead;
                    });
                }
                return next;
            });
        } else {
            refreshPipeline();
        }
    });

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

    const showList = !selectedLead;
    const showContext = !!selectedLead;

    const handleStatusChange = (leadId, newStatus, onDone) => {
        api
            .patch(`/leads/${leadId}/status`, { status: newStatus })
            .then(() => {
                return api.get('/leads/pipeline').then((res) => {
                    if (res.data) setPipeline(res.data);
                });
            })
            .then(() => {
                if (selectedLead?.id === leadId) {
                    return api.get(`/leads/${leadId}`).then((res) => {
                        if (res.data) setLeadDetail(res.data);
                    });
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
                const pipelineRes = await api.get('/leads/pipeline');
                if (pipelineRes.data) setPipeline(pipelineRes.data);
            }
            return res.data;
        } catch (e) {
            console.error('Lead update error:', e);
            throw e;
        }
    };

    const headerActions = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCreateLeadOpen(true)}
                className="rounded-full bg-solar-500 hover:bg-solar-600 text-white px-3 py-1.5 font-bold text-[10px] flex items-center gap-1 transition-all"
            >
                <span className="material-symbols-outlined text-[14px]">add</span>
                NOVO LEAD
            </button>
            <div className="badge-ultra-compact px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE
            </div>
        </div>
    );

    return (
        <DashboardShell
            title="Command Center"
            subtitle="Workspace de Vendas"
            headerIcon="forum"
            loading={loading}
            headerRight={headerActions}
        >
            <div className="flex flex-1 min-w-0 overflow-hidden h-full">
                {/* LEFTPANEL: Lead Inbox */}
                <div
                    className={`shrink-0 flex flex-col bg-white border-r border-slate-200 transition-[width] ${showList ? 'w-full md:w-80 flex' : 'hidden md:flex md:w-80'
                        }`}
                >
                    <div className="shrink-0">
                        {showCreatedMessage && (
                            <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3 text-[11px] font-bold text-emerald-700 uppercase tracking-widest animate-slideDown">
                                <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                Lead criado com sucesso
                            </div>
                        )}
                    </div>
                    <ConversationList
                        leads={leads}
                        selectedId={selectedLead?.id}
                        onSelectLead={setSelectedLead}
                        loading={loading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onRequestCreateLead={() => setCreateLeadOpen(true)}
                        error={pipelineError}
                        onRetry={refreshPipeline}
                    />
                </div>

                {/* CENTER PANEL: Command Center */}
                <div
                    className={`flex-1 min-w-0 flex flex-col bg-white overflow-hidden ${showContext ? 'flex' : 'hidden lg:flex'}`}
                >
                    {selectedLead && (
                        <div className="lg:hidden flex items-center gap-2 p-3 border-b border-slate-200 shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelectedLead(null)}
                                className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
                                aria-label="Voltar para lista"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <span className="text-sm font-medium text-slate-700 truncate">
                                {currentLead?.name || 'Lead'}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <LeadContextPanel
                            lead={currentLead}
                            loading={leadDetailLoading && !!selectedLead}
                            onOpenDetail={currentLead ? () => setDetailDrawerOpen(true) : undefined}
                            onStatusChange={currentLead ? handleStatusChange : undefined}
                            onOpenCopilot={currentLead ? () => {
                                setContext({ type: 'LEAD', leadId: currentLead.id, lead: currentLead });
                                openSidebar();
                            } : undefined}
                        />
                    </div>
                </div>

                {/* RIGHT PANEL: Intelligence Sidebar */}
                <div className="hidden xl:flex w-80 shrink-0 flex-col bg-white border-l border-slate-200 overflow-hidden">
                    <LeadIntelligenceSidebar lead={currentLead} loading={leadDetailLoading && !!selectedLead} />
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
                    refreshPipeline();
                    setShowCreatedMessage(true);
                }}
                defaultStatus="NEW"
            />
        </DashboardShell>
    );
}
