import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { User, Phone, Mail, MapPin, ArrowLeft, Briefcase, FileText } from 'lucide-react';

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
            // Need API endpoint: GET /api/clients/:id
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

    if (loading) return <DashboardShell>Loading...</DashboardShell>;
    if (!client) return <DashboardShell>Cliente não encontrado.</DashboardShell>;

    return (
        <DashboardShell>
            <button onClick={() => navigate('/clients')} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-petroleum transition-colors">
                <ArrowLeft size={18} /> Voltar para Clientes
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${client.type === 'PJ' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                            {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="ds-display-l text-petroleum mb-2">{client.name}</h1>
                            <div className="flex flex-wrap gap-4 text-slate-600">
                                {client.email && (
                                    <div className="flex items-center gap-2 ds-body-s">
                                        <Mail size={16} className="text-slate-400" /> {client.email}
                                    </div>
                                )}
                                {client.phone && (
                                    <div className="flex items-center gap-2 ds-body-s">
                                        <Phone size={16} className="text-slate-400" /> {client.phone}
                                    </div>
                                )}
                                {client.address && (
                                    <div className="flex items-center gap-2 ds-body-s">
                                        <MapPin size={16} className="text-slate-400" /> {client.address}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="ds-button-secondary">Editar Perfil</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Projects & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Projects Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="ds-title-card mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-solar-500" />
                            Projetos Ativos
                        </h2>
                        <div className="space-y-4">
                            {client.projects && client.projects.map(p => (
                                <div key={p.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-petroleum">{p.name}</h3>
                                        <span className="text-sm text-slate-500">Status: {p.status}</span>
                                    </div>
                                    <span className="font-mono font-medium text-slate-700">
                                        {p.value ? `R$ ${p.value.toLocaleString()}` : '-'}
                                    </span>
                                </div>
                            ))}
                            {(!client.projects || client.projects.length === 0) && (
                                <p className="text-slate-400 text-sm">Nenhum projeto ativo.</p>
                            )}
                        </div>
                    </div>

                    {/* Histórico de Leads */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="ds-title-card mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-slate-400" />
                            Histórico de Oportunidades
                        </h2>
                        <div className="space-y-2">
                            {client.leads && client.leads.map(l => (
                                <div key={l.id} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                                    <span>Lead criado em {new Date(l.createdAt).toLocaleDateString()}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${l.status === 'CLOSED_WON' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats / Notes */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                    <h2 className="ds-title-card mb-4">Resumo</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Total Investido</span>
                            <span className="font-bold text-petroleum">R$ {client.projects?.reduce((acc, p) => acc + (p.value || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Economy Mensal Est.</span>
                            <span className="font-bold text-emerald-600">R$ 1.250,00</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};

export default ClientDetailPage;
