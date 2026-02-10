import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CustomSelect } from '../shared/CustomSelect';

const ROOF_OPTIONS = [
    { value: '', label: 'Selecione o telhado' },
    { value: 'CERAMICA', label: 'Cerâmica' },
    { value: 'METALICO', label: 'Metálico' },
    { value: 'LAJE', label: 'Laje' },
    { value: 'FIBROCIMENTO', label: 'Fibrocimento' },
    { value: 'OUTRO', label: 'Outro' },
];

const CONNECTION_OPTIONS = [
    { value: '', label: 'Selecione a conexão' },
    { value: 'MONOFASICO', label: 'Monofásico' },
    { value: 'BIFASICO', label: 'Bifásico' },
    { value: 'TRIFASICO', label: 'Trifásico' },
];

const DISTRIBUTOR_OPTIONS = [
    { value: '', label: 'Selecione a distribuidora' },
    { value: 'CEMIG', label: 'Cemig' },
    { value: 'CPFL_PAULISTA', label: 'CPFL Paulista' },
    { value: 'ENEL', label: 'Enel' },
    { value: 'LIGHT', label: 'Light' },
    { value: 'OUTRO', label: 'Outro' },
];

/**
 * LeadQualificationForm — Refatorado para Design System v1.4.
 * Suporta modo isDrawer para integração fluida com LeadDetailDrawer e modo standalone para a aba.
 */
export const LeadQualificationForm = ({ lead, onSave, onChange, isDrawer = false }) => {
    const [localForm, setLocalForm] = useState({
        cep: '',
        fullAddress: '',
        roofType: '',
        connectionType: '',
        distributor: '',
    });
    const [saving, setSaving] = useState(false);

    // Se temos onChange (Drawer), usamos os dados do prop 'lead'.
    // Caso contrário (Tab), usamos o estado local sincronizado no início.
    const isControlled = typeof onChange === 'function';
    const formValues = isControlled ? {
        cep: lead?.cep || '',
        fullAddress: lead?.fullAddress || '',
        roofType: lead?.roofType || '',
        connectionType: lead?.connectionType || '',
        distributor: lead?.distributor || '',
    } : localForm;

    useEffect(() => {
        if (!isControlled && lead) {
            setLocalForm({
                cep: lead.cep || '',
                fullAddress: lead.fullAddress || '',
                roofType: lead.roofType || '',
                connectionType: lead.connectionType || '',
                distributor: lead.distributor || '',
            });
        }
    }, [lead, isControlled]);

    const handleFieldChange = (name, value) => {
        if (isControlled) {
            onChange(name, value);
        } else {
            setLocalForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (isControlled) return; // Se for controlado, o Drawer cuida do submit

        setSaving(true);
        try {
            const res = await api.patch(`/leads/${lead.id}`, formValues);
            onSave?.(res.data);
        } catch (err) {
            console.error('Erro ao salvar qualificação:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-1">
                    <label className="ds-label text-slate-400">CEP</label>
                    <input
                        type="text"
                        name="cep"
                        placeholder="00000-000"
                        value={formValues.cep}
                        onChange={(e) => handleFieldChange('cep', e.target.value)}
                        className="ds-input h-8"
                    />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="ds-label text-slate-400">Endereço completo</label>
                    <input
                        type="text"
                        name="fullAddress"
                        placeholder="Rua, número, bairro..."
                        value={formValues.fullAddress}
                        onChange={(e) => handleFieldChange('fullAddress', e.target.value)}
                        className="ds-input h-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <CustomSelect
                        label="Tipo de telhado"
                        options={ROOF_OPTIONS.filter(o => o.value !== '')}
                        value={formValues.roofType}
                        onChange={(val) => handleFieldChange('roofType', val)}
                        placeholder="Selecione o telhado"
                    />
                </div>
                <div className="space-y-1">
                    <CustomSelect
                        label="Tipo de ligação"
                        options={CONNECTION_OPTIONS.filter(o => o.value !== '')}
                        value={formValues.connectionType}
                        onChange={(val) => handleFieldChange('connectionType', val)}
                        placeholder="Selecione a ligação"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <CustomSelect
                    label="Distribuidora"
                    options={DISTRIBUTOR_OPTIONS.filter(o => o.value !== '')}
                    value={formValues.distributor}
                    onChange={(val) => handleFieldChange('distributor', val)}
                    placeholder="Selecione a distribuidora"
                />
            </div>

            {!isDrawer && (
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="h-8 px-6 rounded-full bg-petroleum text-white text-[11px] font-bold uppercase tracking-widest hover:bg-petroleum/90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="material-symbols-outlined animate-spin text-[18px] ds-icon-w300">sync</span>
                        ) : (
                            <span className="material-symbols-outlined text-[18px] ds-icon-w300">save</span>
                        )}
                        Salvar Qualificação
                    </button>
                </div>
            )}
        </form>
    );
};
