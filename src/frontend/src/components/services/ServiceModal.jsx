import React from 'react';
import { CustomSelect } from '../shared/CustomSelect';
import { ModalOverlay, ModalPanel, ModalHeader, ModalContent, ModalFooter } from '../shared/ModalPrimitives';

/**
 * ServiceModal — Refatorado para Design System v1.4 (DS v1.4) usando Primitivos.
 * Estética "Super Flat", zero sombras, h-8 padrão interativo, tokens semânticos.
 */
const ServiceModal = ({ isOpen, onClose, onSave, formData, setFormData, loading }) => {
    const SERVICE_TYPES = [
        { value: 'INSTALLATION', label: 'Instalação' },
        { value: 'MAINTENANCE', label: 'Manutenção' },
        { value: 'CONSULTANCY', label: 'Consultoria' },
        { value: 'OTHER', label: 'Outro' },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'INSTALLATION': return 'engineering';
            case 'MAINTENANCE': return 'build';
            case 'CONSULTANCY': return 'analytics';
            default: return 'inventory_2';
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <ModalPanel maxWidth="max-w-lg">
                <ModalHeader
                    title="Novo Serviço"
                    subtitle="Defina as bases do catálogo"
                    icon={getIcon(formData.type)}
                    onClose={onClose}
                />

                <form onSubmit={onSave}>
                    <ModalContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Nome do Serviço</label>
                                <input
                                    required
                                    className="ds-input h-8 text-[13px]"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Instalação Padrão"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Código / SKU</label>
                                <input
                                    className="ds-input h-8 font-mono text-[13px]"
                                    value={formData.code || ''}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="SVC-INST-001"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <CustomSelect
                                    label="Tipo de Serviço"
                                    options={SERVICE_TYPES}
                                    value={formData.type || 'INSTALLATION'}
                                    onChange={val => setFormData({ ...formData, type: val })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Custo Base</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="ds-input h-8 pl-8 font-mono text-[13px]"
                                        value={formData.baseCost || ''}
                                        onChange={e => setFormData({ ...formData, baseCost: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ds-label text-slate-500 px-1">Descrição</label>
                            <textarea
                                className="ds-input min-h-[100px] py-3 text-[13px] leading-relaxed resize-none bg-slate-50/10"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Dê detalhes sobre este serviço..."
                            />
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-8 px-6 rounded-full bg-solar hover:bg-amber-600 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-none flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-[16px] ds-icon-w300">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px] ds-icon-w300">save</span>
                            )}
                            Salvar Serviço
                        </button>
                    </ModalFooter>
                </form>
            </ModalPanel>
        </ModalOverlay>
    );
};

export default ServiceModal;
