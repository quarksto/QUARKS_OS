import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { openProposalDocument } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { AdaptiveHeader } from '../components/dashboard/AdaptiveHeader';
import { StandardAvatar } from '../components/ui/StandardAvatar';

const STATUS_CONFIG = {
    DRAFT: 'Rascunho',
    SENT: 'Enviada',
    VIEWED: 'Visualizada',
    ACCEPTED: 'Aceita',
    REJECTED: 'Rejeitada',
    EXPIRED: 'Expirada'
};

const MetricCard = ({ icon, label, value, subtext }) => (
    <div className="flex-1 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
        <div className="size-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-petroleum-600 flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
    </div>
);

export default function ProposalDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    return (
        <DashboardShell breadcrumbs={[{ label: 'Propostas', href: '/proposals' }, { label: proposal.title || 'Detalhe', active: true }]}>
            <div className="flex flex-col h-full bg-[#F8F8F5]">
                <AdaptiveHeader
                    title={proposal.title || 'Detalhe da Proposta'}
                    subtitle={`Lead: ${proposal.lead?.name || 'Cliente'}`} // Fixed: subtitle prop was missing in some examples
                    headerIcon="description"
                    loading={loading}
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN (Wide) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Proposal Info Card */}
                            <div className="bg-white rounded-2xl border border-[#e8e2ce] p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-petroleum-600">info_spark</span>
                                    Informações do Sistema
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    <MetricCard
                                        icon="solar_power"
                                        label="Potência do Sistema"
                                        value={`${proposal.systemSizeKwp || 0} kWp`}
                                        subtext="Capacidade total instalada"
                                    />
                                    <MetricCard
                                        icon="bolt"
                                        label="Geração Estimada"
                                        value={`${proposal.generationKwh || 0} kWh`}
                                        subtext="Produção mensal média"
                                    />
                                    <MetricCard
                                        icon="price_check"
                                        label="Investimento Total"
                                        value={formatCurrency(proposal.totalPrice)}
                                        subtext="Valor final para o cliente"
                                    />
                                    <MetricCard
                                        icon="savings"
                                        label="Economia Mensal"
                                        value={formatCurrency(proposal.savingsMonthly)}
                                        subtext="Redução na conta de luz"
                                    />
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-amber-500">light_mode</span>
                                        <div>
                                            <p className="font-bold text-slate-900">{proposal.kit?.name || 'Kit Personalizado'}</p>
                                            <p className="text-xs text-slate-500">Inversores de alta eficiência</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lead Info Card (Reusing Stitch style) */}
                            <div className="bg-white rounded-2xl border border-[#e8e2ce] p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-petroleum-600">person</span>
                                    Dados do Cliente
                                </h3>
                                <div className="flex items-center gap-6">
                                    <StandardAvatar
                                        name={proposal.lead?.name || '?'}
                                        src={proposal.lead?.avatar_url || proposal.lead?.avatarUrl}
                                        size="xl"
                                        className="!w-20 !h-20 !text-2xl"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900">{proposal.lead?.name || 'Cliente Desconhecido'}</h2>
                                        <p className="text-slate-500 mb-2">{proposal.lead?.email || 'Sem email'}</p>
                                        <Link to={`/leads/${proposal.leadId}`} className="text-sm font-bold text-petroleum-600 hover:underline flex items-center gap-1">
                                            Ver Perfil Completo
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Narrow) */}
                        <div className="space-y-6">

                            {/* Actions Card */}
                            <div className="bg-white rounded-2xl border border-[#e8e2ce] p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Ações Rápidas</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSend}
                                        disabled={actionLoading !== null}
                                        className="w-full flex items-center justify-center gap-3 bg-petroleum hover:bg-petroleum-900 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-70"
                                    >
                                        {actionLoading === 'send' ? <span className="animate-spin size-5 rounded-full border-2 border-white/30 border-t-white"></span> : <span className="material-symbols-outlined">send</span>}
                                        Enviar por Email
                                    </button>
                                    <button
                                        onClick={handleGeneratePdf}
                                        disabled={actionLoading !== null}
                                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all disabled:opacity-70"
                                    >
                                        {actionLoading === 'pdf' ? <span className="animate-spin size-5 rounded-full border-2 border-slate-300 border-t-slate-600"></span> : <span className="material-symbols-outlined">picture_as_pdf</span>}
                                        Gerar PDF
                                    </button>
                                </div>
                                {(proposal.publicSlug || proposal.clientLinkSlug) && (
                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="text-xs font-bold text-slate-500 mb-1 uppercase">Link Público</p>
                                        <div className="flex items-center gap-2">
                                            <input readOnly value={`${window.location.origin}/view-proposal/${proposal.clientLinkSlug || proposal.publicSlug}`} className="bg-white border text-xs border-slate-200 rounded px-2 py-1 w-full text-slate-600" />
                                            <button
                                                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/view-proposal/${proposal.clientLinkSlug || proposal.publicSlug}`)}
                                                className="p-1 hovered:bg-slate-200 rounded text-slate-500"
                                            >
                                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Edit Config Card */}
                            <div className="bg-white rounded-2xl border border-[#e8e2ce] p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Configurações</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status</label>
                                        <select
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-petroleum"
                                        >
                                            {Object.entries(STATUS_CONFIG).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Desconto (%)</label>
                                            <input
                                                type="number"
                                                value={editData.discountPercent}
                                                onChange={(e) => setEditData({ ...editData, discountPercent: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-petroleum"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Desconto (R$)</label>
                                            <input
                                                type="number"
                                                value={editData.discountAbsolute}
                                                onChange={(e) => setEditData({ ...editData, discountAbsolute: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-petroleum"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={actionLoading === 'save'}
                                        className="w-full mt-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold py-2 rounded-lg transition-colors text-sm"
                                    >
                                        {actionLoading === 'save' ? 'Salvando...' : 'Salvar Alterações'}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </DashboardShell>
    );
}
