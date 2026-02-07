import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ROOF_OPTIONS = [
    { value: '', label: 'Selecione' },
    { value: 'CERAMICA', label: 'Cerâmica' },
    { value: 'METALICO', label: 'Metálico' },
    { value: 'LAJE', label: 'Laje' },
    { value: 'FIBROCIMENTO', label: 'Fibrocimento' },
    { value: 'OUTRO', label: 'Outro' },
];

const CONNECTION_OPTIONS = [
    { value: '', label: 'Selecione' },
    { value: 'MONOFASICO', label: 'Monofásico' },
    { value: 'BIFASICO', label: 'Bifásico' },
    { value: 'TRIFASICO', label: 'Trifásico' },
];

const DISTRIBUTOR_OPTIONS = [
    { value: '', label: 'Selecione' },
    { value: 'CEMIG', label: 'Cemig' },
    { value: 'CPFL_PAULISTA', label: 'CPFL Paulista' },
    { value: 'ENEL', label: 'Enel' },
    { value: 'LIGHT', label: 'Light' },
    { value: 'OUTRO', label: 'Outro' },
];

export const LeadQualificationForm = ({ lead, onSave }) => {
    const [form, setForm] = useState({
        cep: '',
        fullAddress: '',
        roofType: '',
        connectionType: '',
        distributor: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (lead) {
            setForm({
                cep: lead.cep || '',
                fullAddress: lead.fullAddress || '',
                roofType: lead.roofType || '',
                connectionType: lead.connectionType || '',
                distributor: lead.distributor || '',
            });
        }
    }, [lead?.id, lead?.cep, lead?.fullAddress, lead?.roofType, lead?.connectionType, lead?.distributor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/leads/${lead.id}`, form);
            onSave?.();
        } catch (err) {
            console.error('Erro ao salvar qualificação:', err);
            alert('Erro ao salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">CEP</label>
                <input
                    type="text"
                    name="cep"
                    placeholder="00000-000"
                    value={form.cep}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum"
                />
            </div>
            <div>
                <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Endereço completo</label>
                <input
                    type="text"
                    name="fullAddress"
                    placeholder="Rua, número, bairro"
                    value={form.fullAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum"
                />
            </div>
            <div>
                <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Tipo de telhado</label>
                <select
                    name="roofType"
                    value={form.roofType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum"
                >
                    {ROOF_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Tipo de ligação</label>
                <select
                    name="connectionType"
                    value={form.connectionType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum"
                >
                    {CONNECTION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block ds-meta text-slate-500 uppercase tracking-wider mb-1">Distribuidora</label>
                <select
                    name="distributor"
                    value={form.distributor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum"
                >
                    {DISTRIBUTOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                disabled={saving}
                className="btn-pill bg-petroleum text-white hover:bg-petroleum-600 px-4 py-2 flex items-center gap-2"
            >
                {saving && <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>}
                Salvar qualificação
            </button>
        </form>
    );
};
