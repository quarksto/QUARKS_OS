import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCopilot } from '../context/CopilotContext';
import api, { openProposalDocument } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { LeadModalProfile } from '../components/dashboard/leadModal/LeadModalProfile';
import { LeadModalContact } from '../components/dashboard/leadModal/LeadModalContact';
import { LeadModalSolar } from '../components/dashboard/leadModal/LeadModalSolar';
import { LeadModalAddress } from '../components/dashboard/leadModal/LeadModalAddress';
import { LeadModalSolarInsights } from '../components/dashboard/leadModal/LeadModalSolarInsights';
import { LeadModalProposal } from '../components/dashboard/leadModal/LeadModalProposal';
import { LeadBasicsEditForm } from '../components/dashboard/leadModal/LeadBasicsEditForm';
import { LeadModalTimeline } from '../components/dashboard/leadModal/LeadModalTimeline';
import { LeadQualificationForm } from '../components/dashboard/LeadQualificationForm';
import { getNextAction, getLeadCompleteness, stageLabels, getTemperature, getTemperatureClass } from '../utils/pipeline';

const PIPELINE_STEPS = [
    { id: 'NEW' },
    { id: 'CONTACTED' },
    { id: 'PROPOSAL_SENT' },
    { id: 'NEGOTIATION' },
    { id: 'CLOSED_WON' },
    { id: 'CLOSED_LOST' },
];

const TABS = [
    { id: 'basicos', label: 'Dados básicos', icon: 'person' },
    { id: 'qualificacao', label: 'Qualificação técnica', icon: 'home_work' },
    { id: 'proposta', label: 'Proposta', icon: 'description' },
    { id: 'documentos', label: 'Documentos', icon: 'folder' },
    { id: 'historico', label: 'Histórico', icon: 'history' },
];

export default function LeadDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setContext, triggerAction, openSidebar } = useCopilot();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('basicos');
    const [isEditing, setIsEditing] = useState(false);
    const [editedLead, setEditedLead] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
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
    }, [id, setContext]);

    const handleQualificationSave = () => {
        api.get(`/leads/${id}`).then((res) => setLead(res.data));
    };

    const handleNewProposal = () => {
        triggerAction?.('GENERATE_PROPOSAL', { leadId: lead?.id });
        openSidebar?.();
    };

    const [statusUpdating, setStatusUpdating] = useState(false);
    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (!lead?.id || !newStatus || newStatus === lead.status) return;
        setStatusUpdating(true);
        api.patch(`/leads/${lead.id}/status`, { status: newStatus })
            .then(() => setLead((prev) => (prev ? { ...prev, status: newStatus } : null)))
            .catch(() => { })
            .finally(() => setStatusUpdating(false));
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditedLead({ ...lead });
        }
        setIsEditing(!isEditing);
    };

    const handleSaveLead = async () => {
        if (!editedLead?.id) return;
        setSaving(true);
        try {
            const res = await api.patch(`/leads/${editedLead.id}`, editedLead);
            setLead(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Erro ao salvar lead:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedLead(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = lead ? getNextAction(lead) : null;
    const { percent } = lead ? getLeadCompleteness(lead) : { percent: 0 };

    const temperature = lead ? getTemperature(lead) : { color: 'gray', label: '—' };

    const headerRight = (
        <div className="flex items-center gap-3">
            {!isEditing ? (
                <>
                    {/* Indicador de Temperatura do Lead */}
                    {lead && (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${getTemperatureClass(temperature.color)}`} />
                            <span className="ds-meta font-bold text-slate-700 uppercase tracking-tight">{temperature.label}</span>
                        </div>
                    )}

                    {/* Seletor de Estágio Integrado */}
                    <div className="flex items-center gap-2">
                        <select
                            id="lead-stage-header"
                            value={lead?.status || ''}
                            onChange={handleStatusChange}
                            disabled={statusUpdating}
                            className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 uppercase focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum disabled:opacity-60 transition-all cursor-pointer hover:bg-slate-50 shadow-sm"
                        >
                            {Object.entries(stageLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-1" />

                    <button
                        type="button"
                        onClick={handleEditToggle}
                        className="btn-pill h-10 px-4 bg-white text-slate-600 hover:bg-slate-50 border-slate-200 gap-2 uppercase tracking-wider"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Editar
                    </button>

                    {lead?.id && (
                        <button
                            type="button"
                            onClick={() => navigate(`/proposals/new?leadId=${lead.id}`)}
                            className="h-10 bg-solar-500 text-white hover:bg-solar-600 border-0 px-4 rounded-lg flex items-center gap-2 font-bold text-[11px] transition-all shadow-sm hover:shadow-md active:scale-95 uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            Proposta
                        </button>
                    )}
                </>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn-pill h-10 px-4 bg-white text-slate-500 hover:bg-slate-50 border-slate-200 gap-2 uppercase tracking-wider"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveLead}
                        disabled={saving}
                        className="h-10 bg-petroleum text-white hover:bg-petroleum-600 border-0 px-6 rounded-lg flex items-center gap-2 font-bold text-[11px] transition-all shadow-sm hover:shadow-md disabled:opacity-50 uppercase tracking-wider"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="material-symbols-outlined text-[18px]">check</span>
                        )}
                        Salvar Alterações
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
            <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 lg:p-10">
                {error && (
                    <div className="mb-4 p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 max-w-xl">
                        <p className="font-medium mb-1">{error}</p>
                        <p className="text-sm text-amber-700/90 mb-4">
                            Este lead pode não existir, ter sido removido ou o link está incorreto. Verifique o ID na URL ou use os botões abaixo.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/leads')}
                                className="btn-pill bg-petroleum text-white hover:bg-petroleum-600 px-4 py-2 text-sm inline-flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">list</span>
                                Ver lista de leads
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="btn-pill bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 text-sm inline-flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Voltar ao Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {lead && !error && (
                    <>
                        <div className="flex items-center gap-0 mb-8 overflow-x-auto py-2 scrollbar-hide">
                            {PIPELINE_STEPS.map((step, index) => {
                                const isActive = lead.status === step.id;
                                const label = stageLabels[step.id] || step.id;
                                return (
                                    <React.Fragment key={step.id}>
                                        {index > 0 && (
                                            <div className={`flex-shrink-0 w-6 h-0.5 mx-0.5 ${index <= PIPELINE_STEPS.findIndex((s) => s.id === lead.status) ? 'bg-petroleum' : 'bg-slate-200'}`} />
                                        )}
                                        <div
                                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${isActive
                                                ? 'bg-white border-petroleum text-petroleum shadow-sm'
                                                : 'text-slate-400 border-transparent bg-transparent'
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-petroleum' : 'bg-slate-300'}`} />
                                            {label}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-petroleum text-petroleum bg-white'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-custom pr-2">
                            {activeTab === 'basicos' && (
                                <>
                                    {!isEditing ? (
                                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fadeInScale">
                                            {/* Coluna da Esquerda: Perfil e Contato */}
                                            <div className="xl:col-span-4 space-y-6">
                                                <LeadModalProfile lead={lead} />
                                                <LeadModalContact lead={lead} />
                                            </div>

                                            {/* Coluna da Direita: Solar, Endereço e Insights */}
                                            <div className="xl:col-span-8 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LeadModalSolar lead={lead} />
                                                    <LeadModalAddress lead={lead} />
                                                </div>
                                                <LeadModalSolarInsights lead={lead} onDimensionar={handleNewProposal} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="max-w-3xl mx-auto py-4">
                                            <LeadBasicsEditForm
                                                lead={editedLead}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'qualificacao' && (
                                <div className="max-w-xl">
                                    <div className="technical-card p-6">
                                        <h3 className="ds-title text-slate-900 mb-4">Qualificação técnica</h3>
                                        <p className="ds-body text-slate-500 mb-6">
                                            Preencha os dados para gerar propostas precisas e dimensionar o sistema.
                                        </p>
                                        <LeadQualificationForm lead={lead} onSave={handleQualificationSave} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'proposta' && (
                                <div className="max-w-xl">
                                    <LeadModalProposal
                                        proposal={lead?.proposals?.[0] || null}
                                        onViewDetails={handleNewProposal}
                                    />
                                </div>
                            )}

                            {activeTab === 'documentos' && (
                                <div className="max-w-2xl space-y-6">
                                    <div className="technical-card p-6">
                                        <h3 className="ds-title text-slate-900 mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">description</span>
                                            Propostas (PDF)
                                        </h3>
                                        <p className="ds-body text-slate-500 mb-4">PDFs gerados das propostas deste lead.</p>
                                        <ul className="space-y-2">
                                            {(lead?.proposals || []).filter((p) => p?.pdfUrl).length === 0 ? (
                                                <li className="ds-body text-slate-500">Nenhum PDF de proposta ainda.</li>
                                            ) : (
                                                (lead?.proposals || []).filter((p) => p?.pdfUrl).map((p) => (
                                                    <li key={p.id} className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openProposalDocument(p.id)}
                                                            className="btn-pill text-petroleum hover:bg-petroleum/5 border-slate-200 px-3 py-2 text-sm inline-flex items-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                                            {p.title || 'Proposta'} — Ver documento
                                                        </button>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                    <div className="technical-card p-6 border border-dashed border-slate-200">
                                        <h3 className="ds-title text-slate-700 mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">photo_library</span>
                                            Documentos do imóvel / lead
                                        </h3>
                                        <p className="ds-body text-slate-500">Fotos do telhado, contrato e outros anexos — em breve.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'historico' && (
                                <div className="max-w-2xl">
                                    <LeadModalTimeline activities={lead?.activity || []} loading={false} />
                                </div>
                            )}
                        </div>
                    </>
                )}

                {loading && !lead && (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="w-10 h-10 border-2 border-slate-200 border-t-petroleum rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
