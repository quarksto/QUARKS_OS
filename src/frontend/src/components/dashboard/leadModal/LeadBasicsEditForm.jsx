import React from 'react';

export const LeadBasicsEditForm = ({ lead, onChange }) => {
    return (
        <div className="space-y-6 animate-fadeInScale">
            <section className="technical-card p-6">
                <h3 className="ds-title text-slate-900 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">person_edit</span>
                    Editar Informações de Perfil
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">Nome Completo</label>
                        <input
                            type="text"
                            value={lead.name || ''}
                            onChange={(e) => onChange('name', e.target.value)}
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum transition-all"
                            placeholder="Nome do Lead"
                        />
                    </div>

                    <div>
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">Celular / WhatsApp</label>
                        <input
                            type="text"
                            value={lead.phone || ''}
                            onChange={(e) => onChange('phone', e.target.value)}
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum transition-all"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div>
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">E-mail</label>
                        <input
                            type="email"
                            value={lead.email || ''}
                            onChange={(e) => onChange('email', e.target.value)}
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum transition-all"
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">Localização (Cidade/UF)</label>
                        <input
                            type="text"
                            value={lead.location || ''}
                            onChange={(e) => onChange('location', e.target.value)}
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum transition-all"
                            placeholder="Ex: Campinas/SP"
                        />
                    </div>

                    <div>
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">Origem</label>
                        <select
                            value={lead.origin || ''}
                            onChange={(e) => onChange('origin', e.target.value)}
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-petroleum focus:ring-1 focus:ring-petroleum transition-all appearance-none cursor-pointer"
                        >
                            <option value="INDICACAO">Indicação</option>
                            <option value="FACEBOOK">Facebook</option>
                            <option value="GOOGLE">Google Ads</option>
                            <option value="SITE">Site</option>
                            <option value="OUTRO">Outro</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="technical-card p-6 border-solar-500/10 bg-solar-50/5">
                <h3 className="ds-title text-slate-900 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-solar-500 text-[18px]">bolt</span>
                    Parâmetros Energéticos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block ds-label mb-1.5 uppercase tracking-wider">Consumo Médio (kWh/mês)</label>
                        <input
                            type="number"
                            value={lead.consumption || ''}
                            onChange={(e) => onChange('consumption', parseFloat(e.target.value) || 0)}
                            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-solar-500 focus:ring-1 focus:ring-solar-500 transition-all"
                            placeholder="650"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
