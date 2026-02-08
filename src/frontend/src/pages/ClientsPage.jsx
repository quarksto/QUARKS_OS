import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Filter, MoreVertical, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { DashboardShell } from '../components/dashboard/DashboardShell';

const ClientsPage = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            // Pending: Create GET /api/clients endpoint
            // For now, mocking or empty
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error loading clients:', error);
            // Mock data for dev
            setClients([
                { id: '1', name: 'João Silva', type: 'PF', email: 'joao@email.com', phone: '(11) 99999-9999', address: 'São Paulo, SP' },
                { id: '2', name: 'Empresa Solar Ltda', type: 'PJ', email: 'contato@solar.com', phone: '(11) 3333-3333', address: 'Campinas, SP' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardShell>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="ds-display-l text-petroleum mb-1">Clientes</h1>
                    <p className="ds-body-m text-slate-500">Gerencie sua base de clientes e histórico de projetos.</p>
                </div>
                <button
                    onClick={() => navigate('/clients/new')} // Future implementation
                    className="ds-button-primary bg-solar hover:bg-solar-600 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Novo Cliente
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                {/* Filters Bar */}
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou documento..."
                            className="ds-input pl-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="ds-button-secondary flex items-center gap-2">
                        <Filter size={16} />
                        Filtros
                    </button>
                </div>

                {/* Clients Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Cliente</th>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Contato</th>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Localização</th>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Projetos</th>
                                <th className="text-right py-3 px-4 ds-label text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => navigate(`/clients/${client.id}`)}
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${client.type === 'PJ' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="ds-body-m font-medium text-petroleum">{client.name}</div>
                                                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{client.type}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col gap-1">
                                            {client.email && (
                                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <MapPin size={14} className="text-slate-400" />
                                            {client.address || 'Não informado'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="ds-badge bg-blue-50 text-blue-700">
                                            {client.projectCount || 0} Ativos
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-petroleum transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400">
                                        Nenhum cliente encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardShell>
    );
};

export default ClientsPage;
