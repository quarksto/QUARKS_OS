import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { StandardAvatar } from '../components/ui/StandardAvatar';

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClient();
    }, [id]);

    const loadClient = async () => {
        try {
            const res = await api.get(`/clients/${id}`);
            setClient(res.data);
        } catch (error) {
            console.error("Error fetching client:", error);
            // Mock
            if (id === '1') {
                setClient({
                    id: '1', name: 'João Silva', type: 'PF', email: 'joao@email.com', phone: '(11) 99999-9999', address: 'São Paulo, SP',
                    projects: [
                        { id: 'p1', name: 'Residência João - 5kWp', status: 'INSTALLING', value: 25000 }
                    ],
                    leads: [
                        { id: 'l1', createdAt: '2023-10-01', status: 'CLOSED_WON' }
                    ]
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const headerRight = (
        <button className="h-8 px-4 rounded-full border border-petroleum text-petroleum hover:bg-petroleum hover:text-white font-bold text-[11px] transition-all active:scale-95 uppercase tracking-wider">
            Editar Perfil
        </button>
    );

    if (loading) return <DashboardShell loading title="Carregando..." />;
    if (!client) return <DashboardShell title="Erro" subtitle="Cliente não encontrado" />;

    return (
        <DashboardShell
            title={client.name}
            subtitle={`Perfil do Cliente - ${client.type}`}
            headerIcon="person"
            headerRight={headerRight}
            breadcrumbs={[
                { label: 'Clientes', path: '/clients' },
                { label: client.name, active: true }
            ]}
        >
            <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-y-auto p-4 md:p-6 lg:p-8 gap-8 text-slate-800">
                <div className="max-w-[1600px] mx-auto w-full space-y-8">
                    {/* Profile Summary Card */}
                    <div className="bg-white rounded-lg border border-slate-100 p-6 flex items-start gap-8 shadow-none">
                        <StandardAvatar name={client.name} size="xl" />
                        <div className="flex-1">
                            <h1 className="ds-title-page text-petroleum mb-4">{client.name}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {client.email && (
                                    <div className="flex items-center gap-3 text-slate-600 text-[13px]">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px] ds-icon-w300">mail</span>
                                        {client.email}
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center gap-3 text-slate-600 text-[13px]">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px] ds-icon-w300">call</span>
                                        {client.phone}
                                    </div>
                                )}
                                {client.address && (
                                    <div className="flex items-center gap-3 text-slate-600 text-[13px]">
                                        <span className="material-symbols-outlined text-slate-400 text-[20px] ds-icon-w300">location_on</span>
                                        {client.address}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Projects & History */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Active Projects */}
                            <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-none">
                                <h2 className="ds-title-section text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-solar ds-icon-w300">inventory_2</span>
                                    Projetos Ativos
                                </h2>
                                <div className="space-y-4">
                                    {client.projects && client.projects.map(p => (
                                        <div key={p.id} className="p-4 border border-slate-50 rounded-lg hover:bg-slate-50/50 transition-colors cursor-pointer flex justify-between items-center group">
                                            <div>
                                                <h3 className="font-semibold text-slate-800 text-[13px]">{p.name}</h3>
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                                                    {p.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-slate-700 text-[13px]">
                                                    {p.value ? `R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-petroleum transition-colors text-[20px] ds-icon-w300">chevron_right</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!client.projects || client.projects.length === 0) && (
                                        <div className="py-8 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-4xl block mb-2 font-light">folder_off</span>
                                            <p className="text-[13px]">Nenhum projeto ativo</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Lead History */}
                            <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-none">
                                <h2 className="ds-title-section text-slate-700 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400 ds-icon-w300">history</span>
                                    Histórico de Oportunidades
                                </h2>
                                <div className="space-y-3">
                                    {client.leads && client.leads.map(l => (
                                        <div key={l.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 text-[13px]">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-300 text-[18px] ds-icon-w300">ads_click</span>
                                                <span className="text-slate-600">Lead criado em {new Date(l.createdAt).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${l.status === 'CLOSED_WON'
                                                ? 'border-emerald-100 text-emerald-700 bg-emerald-50/20'
                                                : 'border-slate-100 text-slate-500'
                                                }`}>
                                                {l.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary Side Card */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-none h-fit">
                                <h2 className="ds-title-section text-slate-700 mb-6">Resumo Financeiro</h2>
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Total Investido</span>
                                        <span className="text-[24px] font-bold text-petroleum tabular-nums">
                                            R$ {client.projects?.reduce((acc, p) => acc + (p.value || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Economia Mensal Est.</span>
                                        <span className="text-[18px] font-bold text-emerald-600 tabular-nums">R$ 1.250,00</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <div className="flex justify-between items-center text-[12px]">
                                            <span className="text-slate-500">Projetos Ativos</span>
                                            <span className="font-bold text-slate-700">{client.projects?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};

export default ClientDetailPage;
