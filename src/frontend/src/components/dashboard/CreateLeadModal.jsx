import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CustomSelect } from '../shared/CustomSelect';
import { ModalOverlay, ModalPanel, ModalHeader, ModalContent, ModalFooter } from '../shared/ModalPrimitives';

/**
 * CreateLeadModal — Refatorado para Design System v1.4 (DS v1.4) usando Primitivos.
 * Estética "Super Flat", zero sombras, h-8 padrão interativo, tokens semânticos.
 */
export const CreateLeadModal = ({ isOpen, onClose, onSuccess, defaultStatus = 'NEW' }) => {
    const [loading, setLoading] = useState(false);

    const ORIGIN_OPTIONS = [
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
            setLoading(false);
        }
    }, [isOpen, defaultStatus]);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <ModalPanel maxWidth="max-w-lg">
                <ModalHeader
                    title="Novo Lead"
                    subtitle="Entrada de novo cliente no funil"
                    icon="person_add"
                    onClose={onClose}
                />

                <form onSubmit={handleSubmit}>
                    <ModalContent className="space-y-4">
                        <div className="space-y-1">
                            <label className="ds-label text-slate-400">Nome do Cliente</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Ex: Condomínio Solar Ville"
                                value={formData.name}
                                onChange={handleChange}
                                className="ds-input h-8"
                            />
                        </div>

                        <div className="space-y-1">
                            <CustomSelect
                                label="Origem"
                                options={ORIGIN_OPTIONS}
                                value={formData.origin}
                                onChange={(val) => setFormData(prev => ({ ...prev, origin: val }))}
                                placeholder="Selecione a origem"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="ds-label text-slate-400">Localização</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="São Paulo, SP"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="ds-input h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="ds-label text-slate-400">Consumo (kWh)</label>
                                <input
                                    type="number"
                                    name="consumption"
                                    required
                                    placeholder="450"
                                    value={formData.consumption}
                                    onChange={handleChange}
                                    className="ds-input h-8"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="ds-label text-slate-400">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="cliente@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="ds-input h-8"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="ds-label text-slate-400">Telefone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="(11) 99999-9999"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="ds-input h-8"
                                />
                            </div>
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all duration-200 active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-8 px-6 rounded-full bg-solar hover:bg-amber-600 text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-200 shadow-none disabled:opacity-50 flex items-center gap-2 active:scale-95"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-[16px] ds-icon-w300">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px] ds-icon-w300">add</span>
                            )}
                            Adicionar Lead
                        </button>
                    </ModalFooter>
                </form>
            </ModalPanel>
        </ModalOverlay>
    );
};
