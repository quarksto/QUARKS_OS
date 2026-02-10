import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { StandardAvatar } from '../components/ui/StandardAvatar';

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
            const response = await api.get('/clients');
            setClients(response.data);
        } catch (error) {
            console.error('Error loading clients:', error);
            // Mock data for dev with more realistic fields
            setClients([
                { id: '1', name: 'João Silva', type: 'PF', email: 'joao@email.com', phone: '(11) 99999-9999', address: 'São Paulo, SP', projectCount: 2 },
                { id: '2', name: 'Empresa Solar Ltda', type: 'PJ', email: 'contato@solar.com', phone: '(11) 3333-3333', address: 'Campinas, SP', projectCount: 1 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = useMemo(() => {
        return clients.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    const headerRight = (
        <button
            onClick={() => navigate('/clients/new')}
            className="h-8 px-4 rounded-full bg-solar hover:bg-amber-600 text-white flex items-center gap-2 font-bold text-[11px] transition-all active:scale-95 uppercase tracking-wider shadow-none"
        >
            <span className="material-symbols-outlined text-[18px] ds-icon-w300">add</span>
            Novo Cliente
        </button>
    );

    return (
        <DashboardShell
            title="Clientes"
            subtitle="Gerencie sua base de clientes e histórico de projetos"
            headerIcon="group"
            headerRight={headerRight}
            loading={loading}
        >
            <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-hidden p-6 gap-6">
                {/* Search / Filters Bar - DS §4 Inputs */}
                <div className="shrink-0 max-w-[1600px] mx-auto w-full text-slate-800">
                    <div className="flex gap-4 items-center bg-white p-2 rounded-lg border border-slate-100 shadow-none">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] ds-icon-w300">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por nome, email ou documento..."
                                className="w-full h-8 pl-10 pr-4 bg-transparent border border-slate-200 rounded-lg text-[13px] focus:border-petroleum/60 focus:outline-none transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="h-8 px-4 rounded-lg border border-slate-200 text-slate-600 flex items-center gap-2 text-[11px] font-bold hover:bg-slate-50 transition-all uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px] ds-icon-w300">filter_list</span>
                            Filtros
                        </button>
                    </div>
                </div>

                {/* Clients Table - DS §4 Tabela */}
                <div className="flex-1 overflow-hidden max-w-[1600px] mx-auto w-full text-slate-800">
                    <div className="h-full bg-white border border-slate-100 rounded-lg overflow-hidden flex flex-col shadow-none">
                        <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest sticky top-0 z-10 border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 px-6">Cliente</th>
                                        <th className="py-3 px-6">Contato</th>
                                        <th className="py-3 px-6">Localização</th>
                                        <th className="py-3 px-6">Projetos</th>
                                        <th className="py-3 px-6 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <StandardAvatar name={client.name} size="md" />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[13px] font-semibold text-slate-700 truncate">
                                                            {client.name}
                                                        </span>
                                                        <span className="inline-flex items-center w-fit px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                            {client.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1.5">
                                                    {client.email && (
                                                        <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                                                            <span className="material-symbols-outlined text-[14px] ds-icon-w300">mail</span>
                                                            {client.email}
                                                        </div>
                                                    )}
                                                    {client.phone && (
                                                        <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                                                            <span className="material-symbols-outlined text-[14px] ds-icon-w300">call</span>
                                                            {client.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-slate-500 text-[12px]">
                                                    <span className="material-symbols-outlined text-[14px] ds-icon-w300">location_on</span>
                                                    <span className="truncate">{client.address || 'Não informado'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                                    {client.projectCount || 0} Ativos
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-petroleum transition-colors opacity-0 group-hover:opacity-100">
                                                    <span className="material-symbols-outlined text-[18px] ds-icon-w300">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredClients.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-300 text-5xl ds-icon-w300">search_off</span>
                                                    <p className="text-slate-500 text-[13px]">Nenhum cliente encontrado</p>
                                                    <p className="text-slate-400 text-[11px]">Tente outros termos de busca.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Footer / Pagination Placeholder */}
                        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                Total: <span className="text-slate-700 font-semibold tabular-nums">{filteredClients.length}</span> clientes
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};

export default ClientsPage;
