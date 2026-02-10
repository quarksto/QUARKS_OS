import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Line
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export default function ProposalViewPublicPage() {
    const { slug } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState(null);
    const [action, setAction] = useState(null); // 'accept' | 'reject'
    const [rejectReason, setRejectReason] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!slug) return;

        fetch(`${API_BASE}/api/proposals/public/${slug}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(r)))
            .then((data) => {
                setProposal(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        fetch(`${API_BASE}/api/proposals/public/${slug}/document`)
            .then((r) => (r.ok ? r.text() : Promise.resolve(null)))
            .then((html) => {
                if (html && html.trim().startsWith('<')) {
                    setHtmlContent(html);
                }
            })
            .catch(() => console.log('No document found or error fetching document'));

    }, [slug]);

    const markViewed = () => {
        if (!slug || proposal?.status !== 'SENT') return;
        fetch(`${API_BASE}/api/proposals/public/${slug}/view`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(() => setProposal((p) => (p ? { ...p, status: 'VIEWED' } : null)))
            .catch(() => { });
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
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-solar/20 border-t-solar rounded-full animate-spin" />
                    <div className="ds-label normal-case text-slate-400">Carregando proposta...</div>
                </div>
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg border border-slate-200 p-8 text-center max-w-md">
                    <span className="material-symbols-outlined text-slate-300 text-[48px] mb-4">error_outline</span>
                    <p className="text-slate-600 ds-body">Proposta não encontrada ou link inválido.</p>
                </div>
            </div>
        );
    }

    const canRespond = proposal.status === 'SENT' || proposal.status === 'VIEWED';
    const isAccepted = proposal.status === 'ACCEPTED';
    const isRejected = proposal.status === 'REJECTED';

    const paybackData = useMemo(() => {
        const years = Array.from({ length: 25 }, (_, i) => i + 1);
        const annualGeneration = (proposal.generationKwh || 0) * 12;
        const tariff = 0.95;
        const systemCost = proposal.totalPrice || 0;

        let accumulatedSavings = 0;
        return years.map(year => {
            const annualSavings = annualGeneration * tariff * Math.pow(1.05, year - 1);
            accumulatedSavings += annualSavings;
            return {
                year: `Ano ${year}`,
                savings: accumulatedSavings,
                cost: systemCost,
                isPayback: accumulatedSavings >= systemCost
            };
        });
    }, [proposal]);

    if (done || isAccepted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-emerald-500 text-[40px]">check_circle</span>
                </div>
                <h1 className="ds-display-l mb-2">Proposta Aceita!</h1>
                <p className="ds-body max-w-md mb-8">
                    Excelente escolha! Nossa equipe já foi notificada e entrará em contato em breve para agendar a visita técnica e confirmar os próximos passos.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="h-10 px-8 bg-petroleum text-white rounded-full font-bold text-[13px] hover:bg-petroleum-800 transition-all active:scale-95"
                >
                    Voltar para a Proposta
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-canvas font-sans text-slate-800">
            {/* Top Navigation / Status Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-solar rounded-lg flex items-center justify-center font-bold text-petroleum-900">Q</div>
                        <span className="ds-title-section text-petroleum tracking-tight hidden sm:inline uppercase">QUARKS SOLAR</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`badge-kanban ${isAccepted ? 'border-emerald-200 text-emerald-700' :
                            isRejected ? 'border-red-200 text-red-700' :
                                'border-petroleum/20 text-petroleum'
                            }`}>
                            {isAccepted ? 'Aceita' : isRejected ? 'Recusada' : 'Aguardando Aprovação'}
                        </span>
                        {htmlContent && (
                            <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-petroleum transition-colors">
                                <span className="material-symbols-outlined text-[18px] ds-icon-w300">download</span>
                                <span className="hidden sm:inline">PDF</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-petroleum pt-16 pb-32 px-4 shadow-none">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-solar/5"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-solar text-[10px] font-bold tracking-widest uppercase border border-white/10">
                                <span className="material-symbols-outlined text-[14px] ds-icon-w300 font-variation-settings-fill-1">bolt</span>
                                Proposta Exclusiva
                            </div>
                            <h1 className="ds-display-xl text-white">
                                Sua Liberdade Energética em <br /><span className="text-solar">{proposal.lead?.location?.split('-')[0] || 'Sua Casa'}</span>
                            </h1>
                            <p className="text-[16px] text-slate-300 font-light max-w-lg leading-relaxed">
                                Olá, {proposal.lead?.name || 'Cliente'}. Projetamos um sistema sob medida para reduzir sua conta de energia em até 95%.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="p-2 bg-solar rounded-lg text-petroleum">
                                        <span className="material-symbols-outlined text-[24px] ds-icon-w300">trending_up</span>
                                    </div>
                                    <div>
                                        <div className="ds-label !text-slate-400 normal-case mb-1">Economia Total (25 anos)</div>
                                        <div className="text-xl font-semibold text-white tabular-nums">R$ {(proposal.savingsMonthly * 12 * 25).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="p-2 border border-emerald-500/20 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <span className="material-symbols-outlined text-[24px] ds-icon-w300">schedule</span>
                                    </div>
                                    <div>
                                        <div className="ds-label !text-slate-400 normal-case mb-1">Retorno do Investimento</div>
                                        <div className="text-xl font-semibold text-white tabular-nums">{proposal.paybackYears} anos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
                            <div className="text-center mb-8">
                                <div className="ds-label !text-slate-400 normal-case mb-2">Investimento Total do Sistema</div>
                                <div className="ds-display-xl text-solar">R$ {(proposal.totalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            </div>

                            <div className="space-y-4">
                                {canRespond && (
                                    <>
                                        <button
                                            onClick={handleAccept}
                                            disabled={action !== null}
                                            className="w-full bg-solar hover:bg-amber-600 text-petroleum font-bold py-4 rounded-full text-[15px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-none"
                                        >
                                            <span className="material-symbols-outlined font-variation-settings-fill-1">verified</span>
                                            {action === 'accept' ? 'Processando...' : 'ACEITAR PROPOSTA AGORA'}
                                        </button>
                                        <p className="text-center ds-meta !text-slate-500">Ao aceitar, agendaremos a visita técnica final.</p>
                                    </>
                                )}

                                {!canRespond && (
                                    <div className={`p-4 rounded-lg text-center ds-title-section border bg-white/5 ${isAccepted ? 'border-emerald-500/30 text-emerald-400' :
                                        'border-red-500/30 text-red-400'
                                        }`}>
                                        {isAccepted ? 'PROPOSTA ACEITA' : 'PROPOSTA RECUSADA'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4 -mt-16 pb-20 space-y-8">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Potência Total', val: `${proposal.systemSizeKwp} kWp`, icon: 'bolt', color: 'text-solar' },
                        { label: 'Geração Mensal', val: `${proposal.generationKwh} kWh`, icon: 'wb_sunny', color: 'text-emerald-500' },
                        { label: 'Economia Mensal', val: `R$ ${proposal.savingsMonthly.toLocaleString('pt-BR')}`, icon: 'payments', color: 'text-slate-600' },
                        { label: 'Payback (Fluxo)', val: `${proposal.paybackYears} anos`, icon: 'cyclone', color: 'text-petroleum' },
                    ].map((stat, i) => (
                        <div key={i} className="ds-card p-6 flex flex-col items-start">
                            <span className={`material-symbols-outlined ${stat.color} mb-3 text-[24px] ds-icon-w300`}>{stat.icon}</span>
                            <div className="ds-label mb-1">{stat.label}</div>
                            <div className="ds-title-page !text-[20px] tabular-nums">{stat.val}</div>
                        </div>
                    ))}
                </div>

                {/* Economic Analysis Section */}
                <section className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 ds-card p-8 bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="ds-title-section !text-[18px]">Análise de Viabilidade</h2>
                                <p className="ds-body !text-slate-400">Patrimônio acumulado com a economia gerada</p>
                            </div>
                            <div className="hidden sm:flex gap-4 ds-label normal-case">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-solar rounded-full"></div>
                                    <span>Economia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                                    <span>Investimento</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={paybackData}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FBBC04" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#FBBC04" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }}
                                        tickFormatter={(value) => `R$ ${value / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: 'none', fontSize: '11px' }}
                                        formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Acumulado']}
                                    />
                                    <Area type="monotone" dataKey="savings" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                                    <Line type="monotone" dataKey="cost" stroke="#E2E8F0" strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-petroleum rounded-lg p-8 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="ds-title-section !text-white mb-6">Resumo Executivo</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <span className="material-symbols-outlined text-solar text-[20px] ds-icon-w300">rocket_launch</span>
                                    </div>
                                    <div>
                                        <div className="ds-label !text-slate-400 normal-case mb-1">Taxa de Retorno</div>
                                        <div className="text-[15px] font-semibold text-white">~2.5% ao mês</div>
                                        <div className="text-[11px] text-slate-500 uppercase tracking-tight font-medium">Líquido de Impostos</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <span className="material-symbols-outlined text-emerald-400 text-[20px] ds-icon-w300">eco</span>
                                    </div>
                                    <div>
                                        <div className="ds-label !text-slate-400 normal-case mb-1">Impacto Ambiental</div>
                                        <div className="text-[15px] font-semibold text-white">120 Árvores Salvas</div>
                                        <div className="text-[11px] text-slate-500 uppercase tracking-tight font-medium">Ciclo de 25 Anos</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <span className="material-symbols-outlined text-amber-400 text-[20px] ds-icon-w300">verified_user</span>
                                    </div>
                                    <div>
                                        <div className="ds-label !text-slate-400 normal-case mb-1">Garantia Linear</div>
                                        <div className="text-[15px] font-semibold text-white">25 Anos</div>
                                        <div className="text-[11px] text-slate-500 uppercase tracking-tight font-medium">Performance Segurada</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined ds-icon-w300">person</span>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-white">{proposal.creator?.name || 'Equipe Quarks'}</div>
                                <div className="ds-label !text-slate-500 normal-case">Consultor Especialista</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Equipment Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-solar/10 rounded-lg text-solar">
                            <span className="material-symbols-outlined text-[24px]">settings_accessibility</span>
                        </div>
                        <h2 className="ds-title-section !text-[18px]">Tecnologia Selecionada</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                tag: 'PREMIUM',
                                title: 'Módulos Fotovoltaicos',
                                model: 'Tier 1 Monocristalino',
                                qty: `${Math.ceil(proposal.systemSizeKwp / 0.55)} Painéis`,
                                warranty: '25 Anos',
                                img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800'
                            },
                            {
                                tag: 'EFICIÊNCIA',
                                title: 'Inversor Inteligente',
                                model: 'On-Grid WiFi Ready',
                                qty: 'App Real-time',
                                warranty: '10 Anos',
                                img: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800'
                            },
                            {
                                tag: 'ENGENHARIA',
                                title: 'Instalação Padrão Q',
                                model: 'Homologação Inclusa',
                                qty: 'Mão de Obra Própria',
                                warranty: 'Garantia de 1 Ano',
                                img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800'
                            }
                        ].map((item, i) => (
                            <div key={i} className="ds-card group overflow-hidden bg-white">
                                <div className="h-40 bg-slate-100 relative overflow-hidden">
                                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-multiply" alt={item.title} />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] font-bold tracking-widest text-slate-500">{item.tag}</span>
                                    </div>
                                </div>
                                <div className="p-5 space-y-3">
                                    <h3 className="ds-title-section !text-[14px]">{item.title}</h3>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between ds-body !text-[11px]">
                                            <span className="text-slate-400 uppercase tracking-tighter">Modelo</span>
                                            <span className="font-semibold text-slate-700">{item.model}</span>
                                        </div>
                                        <div className="flex justify-between ds-body !text-[11px]">
                                            <span className="text-slate-400 uppercase tracking-tighter">Detalhe</span>
                                            <span className="font-semibold text-slate-700">{item.qty}</span>
                                        </div>
                                        <div className="flex justify-between ds-body !text-[11px]">
                                            <span className="text-slate-400 uppercase tracking-tighter">Garantia</span>
                                            <span className="font-bold text-emerald-600">{item.warranty}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technical Proposal (Iframe) */}
                {htmlContent && (
                    <section className="ds-card overflow-hidden bg-white">
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="ds-title-section flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-300 ds-icon-w300">description</span>
                                Documentação Técnica
                            </h2>
                            <button className="ds-label normal-case text-petroleum font-bold">Ver Anexo Completo</button>
                        </div>
                        <div className="w-full overflow-hidden bg-slate-50 p-4">
                            <div className="bg-white border border-slate-100 rounded shadow-none mx-auto max-w-[800px]">
                                <iframe
                                    srcDoc={htmlContent}
                                    className="w-full min-h-[600px] border-0"
                                    title="Anexo Técnico"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer/Contact Section */}
                <div className="bg-petroleum rounded-lg p-12 text-center text-white space-y-6">
                    <h2 className="ds-display-l !text-white">Pronto para começar?</h2>
                    <p className="ds-body !text-slate-400 max-w-xl mx-auto text-[15px]">
                        Nossos sistemas são dimensionados para durabilidade máxima. <br />Inicie sua jornada rumo à independência energética hoje.
                    </p>
                    {canRespond && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <button
                                onClick={handleAccept}
                                className="h-12 px-12 bg-solar text-petroleum font-bold rounded-full text-[17px] hover:bg-amber-600 transition-all active:scale-95"
                            >
                                ACEITAR PROPOSTA
                            </button>
                            <button
                                onClick={() => setAction('reject-modal')}
                                className="h-12 px-12 bg-white/5 border border-white/10 text-white font-bold rounded-full text-[15px] hover:bg-white/10 transition-all active:scale-95"
                            >
                                SOLICITAR AJUSTES
                            </button>
                        </div>
                    )}
                </div>

                {/* Reject Modal */}
                {action === 'reject-modal' && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full border border-slate-200 shadow-none">
                            <h3 className="ds-title-section !text-[20px] mb-2">Como podemos melhorar?</h3>
                            <p className="ds-body !text-slate-400 mb-6 !text-[12px]">Seu feedback é fundamental para ajustarmos a proposta ao seu perfil.</p>

                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Descreva o que gostaria de mudar..."
                                className="ds-input !h-32 p-4 mb-6"
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setAction(null)}
                                    className="flex-1 ds-label normal-case font-bold py-3 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    VOLTAR
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 py-3 bg-red-50 text-red-600 ds-label normal-case font-bold rounded-full border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                    ENVIAR FEEDBACK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-center ds-meta !text-slate-300">
                    Copyright © {new Date().getFullYear()} Quarks Solar • Uma solução QUARKS_OS
                </p>
            </div>
        </div>
    );
}
