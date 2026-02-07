import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';

export default function KitsPage() {
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedKit, setSelectedKit] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const fetchKits = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/inventory/kits');
                if (!cancelled) setKits(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.error || e.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchKits();
        return () => { cancelled = true; };
    }, []);

    const openDetail = async (kit) => {
        if (selectedKit?.id === kit.id) {
            setSelectedKit(null);
            return;
        }
        try {
            const res = await api.get(`/inventory/kits/${kit.id}`);
            setSelectedKit(res.data);
        } catch (e) {
            setSelectedKit({ ...kit, error: e.response?.data?.error || e.message });
        }
    };

    return (
        <DashboardShell
            title="Kits"
            subtitle="Catálogo de Kits Fotovoltaicos"
            headerIcon="solar_power"
        >
            <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto">
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <span className="animate-spin rounded-full h-10 w-10 border-2 border-petroleum border-t-transparent" />
                    </div>
                )}
                {error && (
                    <div className="technical-card p-4 mb-6 border border-amber-200 bg-amber-50 text-amber-800 ds-body">
                        Erro ao carregar catálogo: {error}
                    </div>
                )}
                {!loading && !error && kits.length === 0 && (
                    <div className="technical-card p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">solar_power</span>
                        <h2 className="ds-title-section text-slate-700 mb-2">Nenhum kit cadastrado</h2>
                        <p className="ds-body text-slate-500">Cadastre kits no inventário para exibição aqui.</p>
                    </div>
                )}
                {!loading && kits.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kits.map((kit) => (
                            <div
                                key={kit.id}
                                className="technical-card p-6 border border-slate-200 hover:border-petroleum/40 transition-colors cursor-pointer"
                                onClick={() => openDetail(kit)}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="ds-title text-petroleum font-semibold">{kit.name}</h3>
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                                </div>
                                {kit.description && (
                                    <p className="ds-body text-slate-600 text-sm line-clamp-2 mb-4">{kit.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {(kit.items || []).slice(0, 3).map((item, idx) => (
                                        <span
                                            key={item.id || idx}
                                            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs"
                                        >
                                            {item.product?.name || 'Produto'} × {item.quantity || 1}
                                        </span>
                                    ))}
                                    {(kit.items?.length || 0) > 3 && (
                                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs">
                                            +{(kit.items?.length || 0) - 3} itens
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedKit && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                        onClick={() => setSelectedKit(null)}
                    >
                        <div
                            className="technical-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 bg-white"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="ds-title-section text-slate-800">{selectedKit.name}</h2>
                                <button
                                    type="button"
                                    onClick={() => setSelectedKit(null)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            {selectedKit.error && (
                                <p className="ds-body text-amber-700 mb-4">{selectedKit.error}</p>
                            )}
                            {selectedKit.description && (
                                <p className="ds-body text-slate-600 mb-4">{selectedKit.description}</p>
                            )}
                            {selectedKit.totalCost != null && (
                                <p className="ds-body text-slate-700 mb-2">
                                    <strong>Custo total (referência):</strong> R$ {Number(selectedKit.totalCost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            )}
                            <h3 className="ds-title text-slate-700 mt-4 mb-2">Itens do kit</h3>
                            <ul className="space-y-2">
                                {(selectedKit.items || []).map((item, idx) => (
                                    <li key={item.id || idx} className="flex justify-between ds-body text-slate-600">
                                        <span>{item.product?.name || 'Produto'}</span>
                                        <span>× {item.quantity || 1}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
