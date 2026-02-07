import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { AdaptiveHeader } from '../components/dashboard/AdaptiveHeader';
import { StandardAvatar } from '../components/ui/StandardAvatar';

// Configuration based on Stitch "Outline Badge" design (ID e9296f...)
const STATUS_CONFIG = {
    DRAFT: { label: 'Rascunho', color: 'border-slate-300 text-slate-500 bg-transparent' },
    SENT: { label: 'Enviada', color: 'border-blue-500 text-blue-600 bg-transparent' },
    VIEWED: { label: 'Visualizada', color: 'border-amber-500 text-amber-600 bg-transparent' },
    ACCEPTED: { label: 'Aceita', color: 'border-emerald-500 text-emerald-600 bg-transparent' },
    REJECTED: { label: 'Rejeitada', color: 'border-red-500 text-red-600 bg-transparent' },
    EXPIRED: { label: 'Expirada', color: 'border-slate-300 text-slate-400 bg-transparent' }
};

export default function ProposalsListPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    // ... (omitting lines for brevity in search context if needed, but here replacing the top block mainly)

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
        let cancelled = false;
        api.get(`/leads/${leadIdFromUrl}`)
            .then((res) => {
                if (!cancelled && res.data?.name) setLeadName(res.data.name);
            })
            .catch(() => {
                if (!cancelled) setLeadName('');
            });
        return () => { cancelled = true; };
    }, [leadIdFromUrl]);

    const clearLeadFilter = () => {
        const next = new URLSearchParams(searchParams);
        next.delete('leadId');
        setSearchParams(next, { replace: true });
    };

    const filteredProposals = useMemo(() => {
        return proposals.filter(p => {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = (p.title || '').toLowerCase().includes(searchLower);
            const leadMatch = (p.lead?.name || '').toLowerCase().includes(searchLower);
            return titleMatch || leadMatch;
        });
    }, [proposals, searchTerm]);

    const moduleActions = (
        <div className="flex items-center gap-3">
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                    type="text"
                    placeholder="Search proposals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-petroleum/60 w-64 transition-all"
                />
            </div>
            <Link
                to="/proposals/new"
                className="bg-solar hover:bg-yellow-500 text-slate-900 rounded-lg px-4 py-2 flex items-center gap-2 font-bold text-sm transition-all shadow-sm hover:shadow active:scale-95"
            >
                <span className="material-symbols-outlined text-lg">add</span>
                New Proposal
            </Link>
        </div>
    );

    return (
        <DashboardShell
            title="Proposals"
            subtitle="Manage your quotes and contracts"
            headerIcon="description"
            loading={loading}
            headerRight={moduleActions}
            breadcrumbs={[{ label: 'Sales', path: '/proposals' }, { label: 'Proposals' }]}
        >
            <div className="flex flex-col h-full bg-white">

                <main className="flex-1 overflow-y-auto p-10">
                    {leadIdFromUrl && (
                        <div className="max-w-[1280px] mx-auto mb-4 flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-slate-600">
                                Filtrando por lead: <strong>{leadName || `ID ${leadIdFromUrl}`}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={clearLeadFilter}
                                className="inline-flex items-center gap-1 text-sm font-medium text-petroleum-600 hover:text-petroleum-700"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_alt_off</span>
                                Ver todas as propostas
                            </button>
                        </div>
                    )}
                    <div className="max-w-[1280px] mx-auto border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-white">
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Proposal Name</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Lead</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Value (R$)</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-slate-500">Date</th>
                                        <th className="py-4 px-6 text-end text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredProposals.map((p) => {
                                        const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT;
                                        return (
                                            <tr key={p.id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/proposals/${p.id}`)}>
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-slate-900">{p.title || 'Untitled Proposal'}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5 font-medium">{p.kit?.name || 'Custom System'}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <StandardAvatar
                                                            name={p.lead?.name}
                                                            src={p.lead?.avatar_url || p.lead?.avatarUrl}
                                                            size="sm"
                                                            className="!w-8 !h-8 !text-[10px]"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{p.lead?.name || 'Unknown Lead'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-slate-900 tracking-tight">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.totalPrice || 0)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-lg text-[11px] font-bold border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                                                    {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="py-4 px-6 text-end">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                        <button className="flex items-center justify-center p-2 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                                            <span className="material-symbols-outlined text-lg">more_vert</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredProposals.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                                                No proposals found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Footer / Pagination Placeholder matching Stitch design */}
                        {filteredProposals.length > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500 font-medium pl-2">Showing {filteredProposals.length} results</p>
                                <div className="flex items-center gap-1">
                                    <button className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50" disabled><span className="material-symbols-outlined text-lg text-slate-600">chevron_left</span></button>
                                    <button className="px-3 py-1 text-xs font-bold rounded-lg bg-solar text-slate-900">1</button>
                                    <button className="p-1 rounded-lg hover:bg-slate-100"><span className="material-symbols-outlined text-lg text-slate-600">chevron_right</span></button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </DashboardShell>
    );
}
