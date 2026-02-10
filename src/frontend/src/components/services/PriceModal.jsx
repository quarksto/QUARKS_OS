import React from 'react';
import { CustomSelect } from '../shared/CustomSelect';
import { ModalOverlay, ModalPanel, ModalHeader, ModalContent, ModalFooter } from '../shared/ModalPrimitives';

/**
 * PriceModal — Refatorado para Design System v1.4 (DS v1.4) usando Primitivos.
 * Estética "Super Flat", zero sombras, h-8 padrão interativo, tokens semânticos.
 */
const PriceModal = ({ isOpen, onClose, onSave, formData, setFormData, serviceName, loading }) => {
    const PRICE_TYPE_OPTIONS = [
        { value: 'FIXED', label: 'Valor Fixo (R$)' },
        { value: 'PERCENT', label: 'Percentual (%)' },
        { value: 'POWER_UNIT', label: 'Por kWp (R$/kWp)' },
    ];

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <ModalPanel maxWidth="max-w-lg">
                <ModalHeader
                    title="Regra de Preço"
                    subtitle={serviceName || 'Serviço'}
                    icon="payments"
                    onClose={onClose}
                />

                <form onSubmit={onSave}>
                    <ModalContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <CustomSelect
                                    label="Tipo de Cálculo"
                                    options={PRICE_TYPE_OPTIONS}
                                    value={formData.priceType || 'FIXED'}
                                    onChange={val => setFormData({ ...formData, priceType: val })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Valor</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-bold">
                                        {formData.priceType === 'PERCENT' ? '%' : 'R$'}
                                    </span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="ds-input h-8 pl-8 font-mono text-[13px]"
                                        value={formData.priceValue || ''}
                                        onChange={e => setFormData({ ...formData, priceValue: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Potência Mín (kWp)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="ds-input h-8 font-mono text-[13px]"
                                    value={formData.minPower || ''}
                                    onChange={e => setFormData({ ...formData, minPower: e.target.value })}
                                    placeholder="0.0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="ds-label text-slate-500 px-1">Potência Máx (kWp)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="ds-input h-8 font-mono text-[13px]"
                                    value={formData.maxPower || ''}
                                    onChange={e => setFormData({ ...formData, maxPower: e.target.value })}
                                    placeholder="99.9"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="ds-label text-slate-500 px-1">Estado / UF (Opcional)</label>
                            <input
                                className="ds-input h-8 uppercase text-[13px]"
                                maxLength={2}
                                value={formData.state || ''}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                placeholder="Ex: SP (Deixe vazio para Nacional)"
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
                                <span className="material-symbols-outlined text-[16px] ds-icon-w300">add</span>
                            )}
                            Adicionar Preço
                        </button>
                    </ModalFooter>
                </form>
            </ModalPanel>
        </ModalOverlay>
    );
};

export default PriceModal;
