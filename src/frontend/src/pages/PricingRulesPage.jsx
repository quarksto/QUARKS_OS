import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Plus, Edit2, Trash2, TrendingUp, Percent } from 'lucide-react';

const PricingRulesPage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        minPower: 0,
        maxPower: 1000,
        targetMargin: 0.20,
        taxRate: 0.12,
        active: true
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const res = await api.get('/pricing-rules');
            setRules(res.data);
        } catch (error) {
            console.error('Error loading rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (rule) => {
        setFormData({
            name: rule.name,
            minPower: rule.minPower,
            maxPower: rule.maxPower,
            targetMargin: rule.targetMargin,
            taxRate: rule.taxRate,
            active: rule.active
        });
        setEditingId(rule.id);
        setShowModal(true);
    };

    const handleNew = () => {
        setFormData({
            name: '',
            minPower: 0,
            maxPower: 1000,
            targetMargin: 0.20,
            taxRate: 0.12,
            active: true
        });
        setEditingId(null);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.patch(`/pricing-rules/${editingId}`, formData);
            } else {
                await api.post('/pricing-rules', formData);
            }
            setShowModal(false);
            loadRules();
        } catch (error) {
            alert('Erro ao salvar regra: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Excluir esta regra de preço?')) return;
        try {
            await api.delete(`/pricing-rules/${id}`);
            loadRules();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    return (
        <DashboardShell>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="ds-display-l text-petroleum mb-1">Regras de Preço</h1>
                    <p className="ds-body-m text-slate-500">Defina margens e impostos baseados na potência do sistema.</p>
                </div>
                <button
                    onClick={handleNew}
                    className="ds-button-primary bg-solar hover:bg-solar-600 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nova Regra
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left py-3 px-6 ds-label text-slate-500">Regra</th>
                            <th className="text-left py-3 px-6 ds-label text-slate-500">Potência (kWp)</th>
                            <th className="text-right py-3 px-6 ds-label text-slate-500">Margem Alvo</th>
                            <th className="text-right py-3 px-6 ds-label text-slate-500">Imposto Estimado</th>
                            <th className="text-right py-3 px-6 ds-label text-slate-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rules.map(rule => (
                            <tr key={rule.id} className="hover:bg-slate-50">
                                <td className="py-3 px-6 font-medium text-petroleum">{rule.name}</td>
                                <td className="py-3 px-6 text-slate-600">
                                    {rule.minPower} kWp - {rule.maxPower >= 999 ? '∞' : `${rule.maxPower} kWp`}
                                </td>
                                <td className="py-3 px-6 text-right font-mono text-green-600">
                                    {(rule.targetMargin * 100).toFixed(1)}%
                                </td>
                                <td className="py-3 px-6 text-right font-mono text-slate-600">
                                    {(rule.taxRate * 100).toFixed(1)}%
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <button onClick={() => handleEdit(rule)} className="p-2 text-slate-400 hover:text-petroleum">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {rules.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">
                                    Nenhuma regra definida. O sistema usará os padrões globais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="ds-title-card mb-4">{editingId ? 'Editar Regra' : 'Nova Regra'}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="ds-label mb-1 block">Nome da Regra</label>
                                <input
                                    required
                                    className="ds-input w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Padrão Residencial"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ds-label mb-1 block">Min kWp</label>
                                    <input
                                        type="number"
                                        className="ds-input w-full"
                                        value={formData.minPower}
                                        onChange={e => setFormData({ ...formData, minPower: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="ds-label mb-1 block">Max kWp</label>
                                    <input
                                        type="number"
                                        className="ds-input w-full"
                                        value={formData.maxPower}
                                        onChange={e => setFormData({ ...formData, maxPower: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ds-label mb-1 block">Margem (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="ds-input w-full pr-8"
                                            value={formData.targetMargin * 100}
                                            onChange={e => setFormData({ ...formData, targetMargin: e.target.value / 100 })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="ds-label mb-1 block">Imposto (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="ds-input w-full pr-8"
                                            value={formData.taxRate * 100}
                                            onChange={e => setFormData({ ...formData, taxRate: e.target.value / 100 })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="ds-button-secondary">Cancelar</button>
                                <button type="submit" className="ds-button-primary bg-solar text-white">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardShell>
    );
};

export default PricingRulesPage;
