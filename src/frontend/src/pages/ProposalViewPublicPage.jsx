import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export default function ProposalViewPublicPage() {
    const { slug } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState(null); // 'accept' | 'reject'
    const [rejectReason, setRejectReason] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }
        fetch(`${API_BASE}/api/proposals/public/${slug}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => {
                setProposal(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [slug]);

    const markViewed = () => {
        if (!slug || proposal?.status !== 'SENT') return;
        fetch(`${API_BASE}/api/proposals/public/${slug}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(() => setProposal((p) => (p ? { ...p, status: 'VIEWED' } : null)))
            .catch(() => {});
    };

    useEffect(() => {
        if (proposal && proposal.status === 'SENT') markViewed();
    }, [proposal?.id]);

    const handleAccept = () => {
        setAction('accept');
        fetch(`${API_BASE}/api/proposals/public/${slug}/accept`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then((r) => r.json())
            .then((data) => {
                setProposal(data.proposal || proposal);
                setDone(true);
            })
            .catch(() => setAction(null))
            .finally(() => setAction(null));
    };

    const handleReject = () => {
        setAction('reject');
        fetch(`${API_BASE}/api/proposals/public/${slug}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: rejectReason })
        })
            .then((r) => r.json())
            .then((data) => {
                setProposal(data.proposal || proposal);
                setDone(true);
            })
            .catch(() => setAction(null))
            .finally(() => setAction(null));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-slate-500">Carregando proposta...</div>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-md">
                    <p className="text-slate-600">Proposta não encontrada ou link inválido.</p>
                </div>
            </div>
        );
    }

    const canRespond = proposal.status === 'SENT' || proposal.status === 'VIEWED';
    const isAccepted = proposal.status === 'ACCEPTED';
    const isRejected = proposal.status === 'REJECTED';

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                    <h1 className="text-xl font-bold text-petroleum-900 mb-1">{proposal.title}</h1>
                    <p className="text-sm text-slate-500 mb-6">
                        {proposal.lead?.name} {proposal.lead?.location && ` • ${proposal.lead.location}`}
                    </p>

                    <dl className="space-y-3 text-sm mb-8">
                        <div className="flex justify-between"><dt className="text-slate-500">Potência</dt><dd className="font-medium">{proposal.systemSizeKwp} kWp</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Valor total</dt><dd className="font-medium text-petroleum-700">R$ {(proposal.totalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Economia mensal</dt><dd className="font-medium">R$ {(proposal.savingsMonthly || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</dd></div>
                        <div className="flex justify-between"><dt className="text-slate-500">Payback</dt><dd className="font-medium">{proposal.paybackYears} anos</dd></div>
                    </dl>

                    {done || isAccepted ? (
                        <div className="rounded-lg border border-emerald-200 text-emerald-800 px-4 py-3 text-center bg-white">
                            Proposta aceita. Obrigado! Entraremos em contato em breve.
                        </div>
                    ) : isRejected ? (
                        <div className="rounded-lg border border-slate-200 text-slate-700 px-4 py-3 text-center bg-white">
                            Proposta recusada.
                        </div>
                    ) : canRespond ? (
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleAccept}
                                disabled={action !== null}
                                className="w-full rounded-xl bg-solar hover:bg-amber-500 text-slate-900 font-bold py-3 disabled:opacity-70 transition-colors shadow-sm"
                            >
                                {action === 'accept' ? 'Aceitando...' : 'Aceitar proposta'}
                            </button>
                            <div>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Motivo da recusa (opcional)"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mb-2"
                                />
                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={action !== null}
                                    className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 disabled:opacity-70 transition-colors"
                                >
                                    {action === 'reject' ? 'Enviando...' : 'Recusar proposta'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm text-center">Esta proposta já foi respondida.</p>
                    )}
                </div>
                <p className="text-center text-xs text-slate-400 mt-6" aria-label="Marca">Quarks Solar</p>
            </div>
        </div>
    );
}
