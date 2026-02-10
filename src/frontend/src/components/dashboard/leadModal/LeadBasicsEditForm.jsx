import React from 'react';
import { CustomSelect } from '../../shared/CustomSelect';

const ORIGIN_OPTIONS = [
    { value: 'INDICACAO', label: 'Indicação' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE', label: 'Google Ads' },
    { value: 'SITE', label: 'Site' },
    { value: 'OUTRO', label: 'Outro' },
];

/**
 * LeadBasicsEditForm — Refatorado para Design System v1.4.
 * Foco em h-8, Quiet Mode, e estética Super Flat.
 */
export const LeadBasicsEditForm = ({ lead, onChange }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Informações de Perfil */}
            <section className="bg-white border border-slate-100 rounded-lg p-6">
                <h3 className="text-slate-800 text-[14px] font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <span className="material-symbols-outlined text-slate-400 text-[18px] ds-icon-w300">person_edit</span>
                    Informações de Perfil
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1">
                        <label className="ds-label text-slate-400">Nome Completo</label>
                        <input
                            type="text"
                            value={lead.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="ds-input h-8"
                            placeholder="Nome do Lead"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="ds-label text-slate-400">Celular / WhatsApp</label>
                        <input
                            type="text"
                            value={lead.phone || ''}
                            onChange={(e) => onChange('phone', e.target.value)}
                            className="ds-input h-8"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="ds-label text-slate-400">E-mail</label>
                        <input
                            type="email"
                            value={lead.email || ''}
                            onChange={(e) => onChange('email', e.target.value)}
                            className="ds-input h-8"
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="ds-label text-slate-400">Localização (Cidade/UF)</label>
                        <input
                            type="text"
                            value={lead.location || ''}
                            onChange={(e) => onChange('location', e.target.value)}
                            className="ds-input h-8"
                            placeholder="Ex: Campinas/SP"
                        />
                    </div>

                    <div className="space-y-1">
                        <CustomSelect
                            label="Origem"
                            options={ORIGIN_OPTIONS}
                            value={lead.origin}
                            onChange={(val) => onChange('origin', val)}
                            placeholder="Selecione a origem"
                        />
                    </div>
                </div>
            </section>

            {/* Parâmetros Energéticos */}
            <section className="bg-slate-50/50 border border-slate-100 rounded-lg p-6">
                <h3 className="text-slate-800 text-[14px] font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
                    <span className="material-symbols-outlined text-solar text-[18px] ds-icon-w300">bolt</span>
                    Parâmetros Energéticos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="ds-label text-slate-400">Consumo Médio (kWh/mês)</label>
                        <input
                            type="number"
                            value={lead.consumption || ''}
                            onChange={(e) => onChange('consumption', parseFloat(e.target.value) || 0)}
                            className="ds-input h-8 font-bold text-slate-800"
                            placeholder="650"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
