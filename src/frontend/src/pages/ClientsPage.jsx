import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api.get('/leads?status=CLOSED_WON&limit=100')
            .then((res) => {
                if (!cancelled) setClients(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => { if (!cancelled) setClients([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <DashboardShell
            title="Clientes"
            subtitle="Leads convertidos (fechados ganhos)"
            headerIcon="group"
        >
            <div className="p-8 max-w-[1600px] mx-auto overflow-y-auto h-full">
                <p className="ds-body text-slate-600 mb-6">
                    Lista de leads com status <strong>Fechado ganho</strong>. Acesse o lead para ver detalhes e propostas aceitas.
                </p>
                <div className="technical-card overflow-hidden p-0">
                    {loading ? (
                        <div className="p-12 flex items-center justify-center text-slate-500">
                            <span className="animate-spin rounded-full h-8 w-8 border-4 border-petroleum border-t-transparent" />
                            <span className="ml-3">Carregando clientes...</span>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 ds-body">
                            Nenhum cliente (lead fechado ganho) no momento.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80">
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contato</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Local</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Consumo</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((c) => (
                                        <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-700">
                                                {c.email && <span className="block">{c.email}</span>}
                                                {c.phone && <span className="block text-slate-500">{c.phone}</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">{c.location || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-slate-700">{c.consumption != null ? `${c.consumption} kWh` : '—'}</td>
                                            <td className="px-4 py-3">
                                                <Link to={`/leads/${c.id}`} className="text-petroleum-600 hover:text-petroleum-800 text-sm font-medium">
                                                    Ver lead
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
