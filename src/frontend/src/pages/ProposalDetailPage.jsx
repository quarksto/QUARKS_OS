import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { openProposalDocument } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { AdaptiveHeader } from '../components/dashboard/AdaptiveHeader';
import { StandardAvatar } from '../components/ui/StandardAvatar';
import ProposalDetailCanvas from '../components/dashboard/ProposalDetailCanvas';

const STATUS_CONFIG = {
    DRAFT: 'Rascunho',
    SENT: 'Enviada',
    VIEWED: 'Visualizada',
    ACCEPTED: 'Aceita',
    REJECTED: 'Rejeitada',
    EXPIRED: 'Expirada'
};

const TABS = [
    { id: 'visao_geral', label: 'Visão Geral', icon: 'hub' },
    { id: 'configuracoes', label: 'Configurações', icon: 'settings_suggest' },
];

export default function ProposalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('visao_geral');
    const [actionLoading, setActionLoading] = useState(null); // 'send' | 'pdf' | 'save'
    const [editData, setEditData] = useState({ status: '', discountPercent: '', discountAbsolute: '' });

    useEffect(() => {
        if (!id) return;
        const fetchOne = async () => {
            try {
                const res = await api.get(`/proposals/${id}`);
                setProposal(res.data);
                setEditData({
                    status: res.data.status || 'DRAFT',
                    discountPercent: res.data.discountPercent != null ? String(res.data.discountPercent) : '',
                    discountAbsolute: res.data.discountAbsolute != null ? String(res.data.discountAbsolute) : ''
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOne();
    }, [id]);

    const handleSave = async () => {
        if (!proposal) return;
        setActionLoading('save');
        try {
            const payload = {
                status: editData.status,
                discountPercent: editData.discountPercent !== '' ? parseFloat(editData.discountPercent) : undefined,
                discountAbsolute: editData.discountAbsolute !== '' ? parseFloat(editData.discountAbsolute) : undefined
            };
            const res = await api.patch(`/proposals/${id}`, payload);
            setProposal(res.data);
            setActiveTab('visao_geral');
        } catch (e) {
            alert('Erro ao salvar: ' + (e.response?.data?.error || e.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleSend = async () => {
        setActionLoading('send');
        try {
            const sendRes = await api.post(`/proposals/${id}/send`);
            const res = await api.get(`/proposals/${id}`);
            setProposal({ ...res.data, clientLinkSlug: sendRes.data?.clientLinkSlug || res.data.publicSlug });
            setEditData(prev => ({ ...prev, status: res.data.status }));
        } catch (e) {
            alert('Erro ao enviar: ' + (e.response?.data?.error || e.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleGeneratePdf = async () => {
        setActionLoading('pdf');
        try {
            const res = await api.post(`/proposals/${id}/generate-pdf`);
            if (res.data.pdfUrl) await openProposalDocument(id);
        } catch (e) {
            alert('Erro ao gerar PDF: ' + (e.response?.data?.error || e.message));
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <DashboardShell loading={true} />;

    if (!proposal) return (
        <DashboardShell>
            <div className="p-10 text-center">Proposta não encontrada</div>
        </DashboardShell>
    );

    const headerRight = (
        <div className="flex items-center gap-2">
            <button
                onClick={handleGeneratePdf}
                disabled={actionLoading !== null}
                className="h-8 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 rounded-full flex items-center gap-2 font-bold text-[11px] transition-all shadow-none uppercase tracking-wider focus:border-petroleum/60 focus:outline-none focus:ring-0 disabled:opacity-50"
            >
                {actionLoading === 'pdf' ? <span className="animate-spin size-4 rounded-full border-2 border-slate-300 border-t-slate-600"></span> : <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>}
                PDF
            </button>
            <button
                onClick={handleSend}
                disabled={actionLoading !== null}
                className="h-8 bg-petroleum text-white hover:bg-petroleum-600 px-4 rounded-full flex items-center gap-2 font-bold text-[11px] transition-all shadow-none uppercase tracking-wider focus:border-petroleum focus:outline-none focus:ring-0 disabled:opacity-50"
            >
                {actionLoading === 'send' ? <span className="animate-spin size-4 rounded-full border-2 border-white/30 border-t-white"></span> : <span className="material-symbols-outlined text-[18px]">send</span>}
                Enviar
            </button>
        </div>
    );

    return (
        <DashboardShell
            title={proposal.title || 'Ficha da Proposta'}
            subtitle={`Lead: ${proposal.lead?.name || 'Cliente'}`}
            loading={loading}
            headerIcon="description"
            headerRight={headerRight}
            breadcrumbs={[
                { label: 'Propostas', path: '/proposals' },
                { label: proposal.title || 'Visualização', active: true }
            ]}
        >
            <div className="flex flex-col h-full bg-slate-50">
                {/* Tabs Navigation */}
                <div className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8">
                    <div className="max-w-[1600px] mx-auto flex gap-6">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 border-b-2 transition-all text-xs font-bold uppercase tracking-widest ${activeTab === tab.id
                                    ? 'border-solar text-petroleum'
                                    : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">

                        {activeTab === 'visao_geral' && (
                            <ProposalDetailCanvas proposal={proposal} />
                        )}

                        {activeTab === 'configuracoes' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-lg border border-slate-200 p-8">
                                        <h3 className="text-sm font-bold text-petroleum uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-solar">edit_note</span>
                                            Editor de Proposta
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Status Comercial</label>
                                                <select
                                                    value={editData.status}
                                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-petroleum focus:border-petroleum/60 focus:outline-none focus:ring-0 transition-all"
                                                >
                                                    {Object.entries(STATUS_CONFIG).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Desconto (%)</label>
                                                    <input
                                                        type="number"
                                                        value={editData.discountPercent}
                                                        onChange={(e) => setEditData({ ...editData, discountPercent: e.target.value })}
                                                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-petroleum focus:border-petroleum/60 focus:outline-none focus:ring-0 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Desconto (R$)</label>
                                                    <input
                                                        type="number"
                                                        value={editData.discountAbsolute}
                                                        onChange={(e) => setEditData({ ...editData, discountAbsolute: e.target.value })}
                                                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-petroleum focus:border-petroleum/60 focus:outline-none focus:ring-0 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                                            <button
                                                onClick={() => setActiveTab('visao_geral')}
                                                className="h-10 px-6 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-wider"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={actionLoading === 'save'}
                                                className="h-10 px-6 bg-solar text-petroleum hover:bg-amber-600 rounded-lg text-xs font-bold transition-all shadow-none uppercase tracking-wider focus:border-petroleum focus:outline-none focus:ring-0 disabled:opacity-50"
                                            >
                                                {actionLoading === 'save' ? 'Salvando...' : 'Salvar Alterações'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                                        <h3 className="text-sm font-bold text-petroleum uppercase tracking-wider mb-4">Dados do Cliente</h3>
                                        <div className="flex items-center gap-4">
                                            <StandardAvatar
                                                name={proposal.lead?.name || '?'}
                                                src={proposal.lead?.avatar_url || proposal.lead?.avatarUrl}
                                                size="lg"
                                            />
                                            <div>
                                                <p className="text-sm font-black text-petroleum leading-tight">{proposal.lead?.name || 'Cliente'}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{proposal.lead?.email || 'Sem email'}</p>
                                                <Link to={`/leads/${proposal.leadId}`} className="text-[10px] font-bold text-solar hover:underline mt-2 flex items-center gap-1 uppercase tracking-widest">
                                                    Perfil do Lead
                                                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
