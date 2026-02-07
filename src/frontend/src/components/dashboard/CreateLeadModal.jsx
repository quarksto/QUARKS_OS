import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';

export const CreateLeadModal = ({ isOpen, onClose, onSuccess, defaultStatus = 'NEW' }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const ORIGIN_OPTIONS = [
        { value: '', label: 'Selecione' },
        { value: 'INDICACAO', label: 'Indicação' },
        { value: 'FACEBOOK', label: 'Facebook' },
        { value: 'GOOGLE', label: 'Google' },
        { value: 'SITE', label: 'Site' },
        { value: 'OUTRO', label: 'Outro' },
    ];

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        consumption: '',
        email: '',
        phone: '',
        origin: '',
        status: defaultStatus,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                location: '',
                consumption: '',
                email: '',
                phone: '',
                origin: '',
                status: defaultStatus,
            });
        }
    }, [isOpen, defaultStatus]);

    const stageLabel = useMemo(() => {
        const map = {
            NEW: 'Triagem',
            CONTACTED: 'Qualificação',
            PROPOSAL_SENT: 'Proposta',
            NEGOTIATION: 'Negociação',
            CLOSED_WON: 'Fechados',
            CLOSED_LOST: 'Perdidos',
        };
        return map[formData.status] || formData.status;
    }, [formData.status]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/leads', {
                name: formData.name,
                location: formData.location,
                consumption: formData.consumption ? Number(formData.consumption) : 0,
                email: formData.email || null,
                phone: formData.phone || null,
                origin: formData.origin || null,
                status: formData.status || defaultStatus || 'NEW',
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to create lead", error);
            alert("Erro ao criar lead via API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Panel - Flat Design */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fadeInScale border border-slate-200 font-sans">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Novo Lead</h2>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                        <span className="material-symbols-outlined text-[16px] text-solar-500">flag</span>
                        Etapa inicial: <strong className="text-slate-700">{stageLabel}</strong>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Nome do Cliente</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Ex: Condomínio Solar Ville"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Origem</label>
                        <select
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                        >
                            {ORIGIN_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Localização</label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="São Paulo, SP"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Consumo (kWh)</label>
                            <input
                                type="number"
                                name="consumption"
                                required
                                placeholder="450"
                                value={formData.consumption}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="cliente@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="(11) 99999-9999"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum-500 focus:ring-1 focus:ring-petroleum-500 transition-all font-sans"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-petroleum text-white text-sm font-bold hover:bg-petroleum-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>}
                            Adicionar Lead
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};
