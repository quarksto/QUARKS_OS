import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { StandardAvatar } from '../components/ui/StandardAvatar';

/**
 * Propostas Comercial — refatorado conforme docs/dsoficial.md (DS v1.4).
 * Design minimalista, zero sombras (exceto hover sutil), tokens semânticos, badge outline.
 */

const STATUS_CONFIG = {
    DRAFT: { label: 'Rascunho', class: 'border-slate-200 text-slate-500' },
    SENT: { label: 'Enviada', class: 'border-amber-200 text-amber-700' },
    VIEWED: { label: 'Visualizada', class: 'border-amber-200 text-amber-600' },
    ACCEPTED: { label: 'Aceita', class: 'border-emerald-200 text-emerald-700' },
    REJECTED: { label: 'Rejeitada', class: 'border-red-200 text-red-700' },
    EXPIRED: { label: 'Expirada', class: 'border-slate-200 text-slate-400' }
};

export default function ProposalsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const leadIdFromUrl = searchParams.get('leadId') || '';

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [leadName, setLeadName] = useState('');

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (leadIdFromUrl) params.set('leadId', leadIdFromUrl);
            const res = await api.get(`/proposals?${params.toString()}`);
            setProposals(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching proposals:', e);
            setProposals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [statusFilter, leadIdFromUrl]);

    useEffect(() => {
        if (!leadIdFromUrl) {
            setLeadName('');
            return;
        }
        api.get(`/leads/${leadIdFromUrl}`)
            .then((res) => {
                if (res.data?.name) setLeadName(res.data.name);
            })
            .catch(() => setLeadName(''));
    }, [leadIdFromUrl]);

    const clearLeadFilter = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('leadId');
        setSearchParams(next, { replace: true });
    };

    const stats = useMemo(() => ({
        total: proposals.length,
        value: proposals.reduce((acc, p) => acc + (p.totalPrice || 0), 0),
        accepted: proposals.filter(p => p.status === 'ACCEPTED').length,
        pending: proposals.filter(p => p.status === 'SENT' || p.status === 'VIEWED').length
    }), [proposals]);

    const filteredProposals = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return proposals.filter(p => {
            const titleMatch = (p.title || '').toLowerCase().includes(searchLower);
            const leadMatch = (p.lead?.name || '').toLowerCase().includes(searchLower);
            return titleMatch || leadMatch;
        });
    }, [proposals, searchTerm]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(val);

    const formatCurrencyFull = (val) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const moduleActions = (
        <div className="flex items-center gap-3">
            <Link
                to="/proposals/new"
                className="h-8 rounded-full bg-solar hover:bg-amber-600 text-white px-4 flex items-center gap-2 font-bold text-[11px] transition-colors duration-200 active:scale-95 uppercase tracking-wider focus:outline-none focus:border-petroleum"
            >
                <span className="material-symbols-outlined text-[18px] ds-icon-w300" aria-hidden>add</span>
                Nova Proposta
            </Link>
        </div>
    );

    return (
        <DashboardShell
            title="Propostas Comercial"
            subtitle="Central de Orçamentos e Contratos"
            headerIcon="description"
            loading={loading}
            headerRight={moduleActions}
            breadcrumbs={[{ label: 'Vendas', path: '/proposals' }, { label: 'Visão Geral', active: true }]}
        >
            <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8 flex flex-col h-full bg-canvas">
                <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col gap-6">

                    {/* Tabs (DS: 1 CTA = Nova Proposta; abas secundárias) */}
                    <div className="flex items-center gap-6 border-b border-slate-100">
                        <button
                            type="button"
                            className="pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-[#F59E0B] -mb-px"
                        >
                            Vendas
                        </button>
                        <button
                            type="button"
                            className="pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors -mb-px"
                        >
                            Gestão
                        </button>
                        <button
                            type="button"
                            className="pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors -mb-px"
                        >
                            Projetos
                        </button>
                    </div>

                    {/* KPI Grid — DS: rounded-lg, border-slate-200, shadow apenas hover:shadow-sm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <KPICard
                            label="Total de Propostas"
                            value={stats.total}
                            sublabel="Volume global"
                            icon="description"
                        />
                        <KPICard
                            label="Valor em Aberto"
                            value={formatCurrency(stats.value)}
                            sublabel="Potencial de fechamento"
                            icon="payments"
                            valueClass="text-slate-800"
                        />
                        <KPICard
                            label="Aguardando Aceite"
                            value={stats.pending}
                            sublabel="Follow-up necessário"
                            icon="visibility"
                            valueClass="text-slate-800"
                        />
                        <KPICard
                            label="Contratos Aceitos"
                            value={stats.accepted}
                            sublabel="Conversão efetivada"
                            icon="check_circle"
                            valueClass="text-emerald-600"
                        />
                    </div>

                    {leadIdFromUrl && (
                        <div className="flex items-center gap-2">
                            <span className="ds-meta text-slate-500">
                                Filtrando por lead: <strong className="text-petroleum">{leadName || leadIdFromUrl}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={clearLeadFilter}
                                className="bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg px-3 py-2 text-[11px] font-medium transition-colors duration-200 focus:outline-none focus:border-petroleum flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[14px]" aria-hidden>close</span>
                                Remover filtro
                            </button>
                        </div>
                    )}

                    {/* Barra de pesquisa — DS: border-slate-200 rounded-lg h-9 */}
                    <div className="flex items-center gap-4">
                        <input
                            type="search"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-slate-200 rounded-lg bg-white h-9 px-3 text-[13px] w-full max-w-xs focus:border-petroleum/60 focus:outline-none placeholder:text-slate-400"
                            aria-label="Pesquisar propostas"
                        />
                    </div>

                    {/* Tabela — DS: header bg-slate-50 text-slate-500 uppercase text-[10px], linhas border-b border-slate-100 hover:bg-slate-50/50 */}
                    <div className="bg-white border border-slate-200 rounded-lg flex-1 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-sm">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Proposta</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Lead / Cliente</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Valor Total</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                                        <th className="py-3 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">Data</th>
                                        <th className="py-3 px-6 text-end text-[10px] font-bold uppercase tracking-wider text-slate-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProposals.map((p) => {
                                        const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT;
                                        return (
                                            <tr
                                                key={p.id}
                                                className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer"
                                                onClick={() => navigate(`/proposals/${p.id}`)}
                                            >
                                                <td className="py-3 px-6">
                                                    <div className="font-semibold text-slate-800 text-[13px]">{p.title || 'Proposta sem título'}</div>
                                                    <div className="ds-label mt-0.5">{p.kit?.name || 'Sistema personalizado'}</div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <StandardAvatar
                                                            name={p.lead?.name}
                                                            src={p.lead?.avatar_url || p.lead?.avatarUrl}
                                                            size="sm"
                                                            className="!w-8 !h-8"
                                                        />
                                                        <span className="text-[13px] font-medium text-slate-700">{p.lead?.name || 'Lead s/ nome'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <span className="font-semibold text-slate-800 text-[13px] tabular-nums">
                                                        {formatCurrencyFull(p.totalPrice || 0)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span className={`badge-kanban ${status.class}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-[13px] text-slate-500">
                                                    {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="py-3 px-6 text-end">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            type="button"
                                                            className="size-8 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors duration-200 focus:outline-none focus:border-petroleum"
                                                            aria-label="Ver proposta"
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/proposals/${p.id}`); }}
                                                        >
                                                            <span className="material-symbols-outlined text-[18px] ds-icon-w300">visibility</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="size-8 rounded-full flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors duration-200 focus:outline-none focus:border-petroleum"
                                                            aria-label="Mais ações"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <span className="material-symbols-outlined text-[18px] ds-icon-w300">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredProposals.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 ds-icon-w300" aria-hidden>description</span>
                                                    <p className="text-[13px] text-slate-500">Nenhuma proposta encontrada</p>
                                                    <Link
                                                        to="/proposals/new"
                                                        className="text-[11px] font-bold text-[#F59E0B] hover:text-amber-600 transition-colors"
                                                    >
                                                        Criar primeira proposta
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

/**
 * KPI Card — DS: bg-white border border-slate-200 rounded-lg, shadow apenas hover:shadow-sm.
 * Valor: .ds-display-xl ou .ds-display-l, font-semibold (KPI Weight).
 */
function KPICard({ label, value, sublabel, icon, valueClass = 'text-slate-800' }) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start justify-between transition-shadow duration-200 hover:shadow-sm">
            <div className="min-w-0">
                <p className="ds-meta text-slate-500 mb-2">{label}</p>
                <div className={`ds-display-l ${valueClass} truncate`}>{value}</div>
                {sublabel && (
                    <p className="ds-label mt-2 text-slate-400">{sublabel}</p>
                )}
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 ml-3">
                <span className="material-symbols-outlined text-slate-600 text-[20px] ds-icon-w300" aria-hidden>{icon}</span>
            </div>
        </div>
    );
}
