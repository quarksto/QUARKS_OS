import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCopilot } from '../context/CopilotContext';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { LeadDetailCanvas } from '../components/dashboard/LeadDetailCanvas';
import { LeadModalProfile } from '../components/dashboard/leadModal/LeadModalProfile';
import { LeadModalContact } from '../components/dashboard/leadModal/LeadModalContact';
import { LeadModalSolar } from '../components/dashboard/leadModal/LeadModalSolar';
import { LeadModalAddress } from '../components/dashboard/leadModal/LeadModalAddress';
import { LeadModalSolarInsights } from '../components/dashboard/leadModal/LeadModalSolarInsights';
import { LeadModalProposal } from '../components/dashboard/leadModal/LeadModalProposal';
import { LeadDetailDrawer } from '../components/dashboard/leadModal/LeadDetailDrawer';
import { LeadModalTimeline } from '../components/dashboard/leadModal/LeadModalTimeline';
import { LeadQualificationForm } from '../components/dashboard/LeadQualificationForm';
import { LeadDocumentsTab } from '../components/dashboard/LeadDocumentsTab';
import { LeadTechnicalSheet } from '../components/dashboard/LeadTechnicalSheet';
import { PageContent } from '../components/dashboard/PageContent';
import { getNextAction, stageLabels, getTemperature, getTemperatureClass } from '../utils/pipeline';

const PIPELINE_STEPS = [
    { id: 'NEW' },
    { id: 'CONTACTED' },
    { id: 'PROPOSAL_SENT' },
    { id: 'NEGOTIATION' },
    { id: 'CLOSED_WON' },
    { id: 'CLOSED_LOST' },
];

const TABS = [
    { id: 'perfil', label: 'Executive Profile', icon: 'assignment_ind' },
    { id: 'visao_geral', label: 'Command Center', icon: 'dashboard' },
    { id: 'basicos', label: 'Data Hub', icon: 'database' },
    { id: 'qualificacao', label: 'Qualificação', icon: 'home_work' },
    { id: 'documentos', label: 'Documentos', icon: 'folder' },
    { id: 'historico', label: 'Histórico', icon: 'history' },
];

/**
 * LeadDetailPage — Refatorado para Design System v1.4 + Side Drawer Flow.
 * Foco em h-8, Super Flat, Data-First, e conformidade rigorosa com dsoficial.md.
 */
export default function LeadDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setContext, triggerAction, openSidebar } = useCopilot();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('perfil');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadLead();
    }, [id]);

    const loadLead = () => {
        setLoading(true);
        api.get(`/leads/${id}`)
            .then((res) => {
                setLead(res.data);
                setContext({
                    type: 'LEAD',
                    summary: `Lead: ${res.data.name} (${res.data.consumption} kWh, ${res.data.status})`,
                    data: res.data,
                });
            })
            .catch((err) => {
                setError(err?.response?.status === 404 ? 'Lead não encontrado' : 'Erro ao carregar');
            })
            .finally(() => setLoading(false));
    };

    const handleQualificationSave = () => {
        loadLead();
    };

    const handleNewProposal = () => {
        triggerAction?.('GENERATE_PROPOSAL', { leadId: lead?.id });
        openSidebar?.();
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (!lead?.id || !newStatus || newStatus === lead.status) return;
        setStatusUpdating(true);
        api.patch(`/leads/${lead.id}/status`, { status: newStatus })
            .then(() => setLead((prev) => (prev ? { ...prev, status: newStatus } : null)))
            .catch(() => { })
            .finally(() => setStatusUpdating(false));
    };

    const handleSaveLead = async (data) => {
        if (!data?.id) return;
        setSaving(true);
        try {
            const res = await api.patch(`/leads/${data.id}`, data);
            setLead(res.data);
            setIsDrawerOpen(false);
        } catch (err) {
            console.error('Erro ao salvar lead:', err);
        } finally {
            setSaving(false);
        }
    };

    const nextStep = lead ? getNextAction(lead) : null;
    const temperature = lead ? getTemperature(lead) : { color: 'gray', label: '—' };

    const headerRight = (
        <div className="flex items-center gap-3">
            {lead && (
                <>
                    <div className="hidden sm:flex items-center gap-2 px-3 h-8 bg-white border border-slate-100 rounded-full">
                        <span className={`w-2.5 h-2.5 rounded-full ${getTemperatureClass(temperature.color)} animate-pulse-subtle`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{temperature.label}</span>
                    </div>

                    <div className="flex items-center">
                        <select
                            id="lead-stage-header"
                            value={lead.status || ''}
                            onChange={handleStatusChange}
                            disabled={statusUpdating}
                            className="h-8 px-4 bg-white border border-slate-100 rounded-full text-[11px] font-bold text-slate-700 uppercase tracking-widest focus:outline-none focus:border-petroleum transition-all cursor-pointer hover:bg-slate-50 appearance-none bg-no-repeat bg-[right_0.8rem_center] pr-8"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='20' viewBox='0 96 960 960' width='20'%3E%3Cpath d='M480 711 240 471l43-43 197 197 197-197 43 43-240 240Z'/%3E%3C/svg%3E")`, backgroundSize: '14px' }}
                        >
                            {Object.entries(stageLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="h-8 px-4 bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 rounded-full flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 border-transparent"
                    >
                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">edit_square</span>
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/proposals/new?leadId=${lead.id}`)}
                        className="h-8 bg-solar text-white hover:bg-amber-600 px-4 rounded-full flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-none border border-transparent"
                    >
                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">add_circle</span>
                        Proposta
                    </button>
                </>
            )}
        </div>
    );

    return (
        <DashboardShell
            title={lead ? lead.name : 'Ficha do Lead'}
            subtitle={nextStep ? nextStep.label : ''}
            loading={loading}
            headerIcon="person"
            headerRight={headerRight}
            breadcrumbs={[
                { label: 'Leads', path: '/leads' },
                { label: 'Ficha do Lead', path: null }
            ]}
        >
            <PageContent className="flex flex-col">
                {error && (
                    <div className="p-8 bg-white border border-slate-100 rounded-lg max-w-xl animate-fade-in">
                        <div className="flex items-center gap-3 text-amber-600 mb-2">
                            <span className="material-symbols-outlined">warning</span>
                            <p className="font-bold uppercase text-[12px] tracking-widest">{error}</p>
                        </div>
                        <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                            Este lead pode não existir, ter sido removido ou o link está incorreto. Verifique a URL ou retorne à listagem.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/leads')}
                            className="h-8 px-4 rounded-full bg-petroleum text-white text-[11px] font-bold uppercase tracking-widest hover:bg-petroleum/90 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px] ds-icon-w300">list</span>
                            Ver lista de leads
                        </button>
                    </div>
                )}

                {lead && !error && (
                    <>
                        <div className="flex items-center gap-0 mb-6 overflow-x-auto py-2 scrollbar-none">
                            {PIPELINE_STEPS.map((step, index) => {
                                const activeIndex = PIPELINE_STEPS.findIndex((s) => s.id === lead.status);
                                const isDone = index < activeIndex;
                                const isActive = lead.status === step.id;
                                const label = stageLabels[step.id] || step.id;

                                return (
                                    <React.Fragment key={step.id}>
                                        {index > 0 && (
                                            <div className="flex-shrink-0 w-8 h-px mx-1 relative">
                                                <div className={`absolute inset-0 transition-colors duration-500 ${index <= activeIndex ? 'bg-petroleum' : 'bg-slate-100'}`} />
                                            </div>
                                        )}
                                        <div
                                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border ${isActive
                                                ? 'bg-white border-petroleum text-petroleum'
                                                : isDone
                                                    ? 'bg-petroleum/5 border-transparent text-petroleum/60'
                                                    : 'text-slate-300 border-transparent bg-transparent'
                                                }`}
                                        >
                                            {isDone ? (
                                                <span className="material-symbols-outlined text-[14px] text-petroleum ds-icon-w300">check_circle</span>
                                            ) : (
                                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-petroleum animate-pulse' : 'bg-slate-200'}`} />
                                            )}
                                            <span className="text-meta">{label}</span>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div role="tablist" aria-label="Seções da ficha do lead" className="flex gap-4 border-b border-slate-100 mb-6 overflow-x-auto scrollbar-none">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    id={`tab-${tab.id}`}
                                    aria-selected={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 pb-3 pt-1 transition-all relative whitespace-nowrap focus:outline-none ${activeTab === tab.id
                                        ? 'text-petroleum'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">{tab.icon}</span>
                                        <span className="ds-label">{tab.label}</span>
                                    </div>
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-petroleum rounded-full animate-scale-x" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-100">
                            {/* Perfil Executivo — max-w-2xl para foco */}
                            {activeTab === 'perfil' && (
                                <div id="panel-perfil" role="tabpanel" className="max-w-2xl animate-fade-in shadow-none pr-4">
                                    <LeadTechnicalSheet
                                        lead={lead}
                                        onUpdate={loadLead}
                                        onNewProposal={handleNewProposal}
                                        onAIPress={() => openSidebar?.()}
                                        hideNameHeader={true}
                                    />
                                </div>
                            )}

                            {/* Command Center — Full Bleed */}
                            {activeTab === 'visao_geral' && (
                                <div id="panel-visao_geral" role="tabpanel" className="animate-fade-in">
                                    <LeadDetailCanvas lead={lead} loading={false} />
                                </div>
                            )}

                            {/* Data Hub */}
                            {activeTab === 'basicos' && (
                                <div id="panel-basicos" role="tabpanel" className="animate-fade-in space-y-6">
                                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                                        <div className="xl:col-span-4 space-y-6">
                                            <LeadModalProfile lead={lead} />
                                            <LeadModalContact lead={lead} />
                                        </div>
                                        <div className="xl:col-span-8 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <LeadModalSolar lead={lead} />
                                                <LeadModalAddress lead={lead} />
                                            </div>
                                            <LeadModalSolarInsights lead={lead} onDimensionar={handleNewProposal} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Qualificação */}
                            {activeTab === 'qualificacao' && (
                                <div id="panel-qualificacao" role="tabpanel" className="max-w-2xl animate-fade-in">
                                    <div className="bg-white border border-slate-100 rounded-lg p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-slate-400 ds-icon-w300">home_work</span>
                                            <h3 className="ds-title-section">Qualificação Técnica</h3>
                                        </div>
                                        <p className="text-[13px] text-slate-500 mb-8 leading-relaxed font-medium">
                                            Preencha as informações estruturais e de rede para um dimensionamento preciso.
                                        </p>
                                        <LeadQualificationForm lead={lead} onSave={handleQualificationSave} />
                                    </div>
                                </div>
                            )}

                            {/* Documentos */}
                            {activeTab === 'documentos' && (
                                <div id="panel-documentos" role="tabpanel" className="animate-fade-in">
                                    <LeadDocumentsTab leadId={lead?.id} />
                                </div>
                            )}

                            {/* Histórico */}
                            {activeTab === 'historico' && (
                                <div id="panel-historico" role="tabpanel" className="max-w-2xl animate-fade-in">
                                    <LeadModalTimeline activities={lead?.activity || []} loading={false} />
                                </div>
                            )}
                        </div>

                        <LeadDetailDrawer
                            lead={lead}
                            isOpen={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}
                            onSave={handleSaveLead}
                            loading={saving}
                        />
                    </>
                )}

                {loading && !lead && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined animate-spin text-[32px] mb-4 ds-icon-w300">progress_activity</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Dados...</p>
                    </div>
                )}
            </PageContent>
        </DashboardShell>
    );
}
