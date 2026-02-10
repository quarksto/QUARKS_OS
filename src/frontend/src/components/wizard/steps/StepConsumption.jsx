import React from 'react';
import { Zap, MapPin } from 'lucide-react';

const DISTRIBUTORS = ['CEMIG', 'ENEL_SP', 'CPFL_PAULISTA', 'LIGHT', 'COPEL'];

const StepConsumption = ({ data, updateFormData, lead }) => {

    const handleChange = (field, value) => {
        updateFormData('energy', { [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-petroleum-800">Consumo de Energia</h3>
                <p className="text-slate-500 mt-2">Informe o consumo médio mensal e a distribuidora para calcularmos a geração necessária.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-petroleum-700">Média Mensal (kWh)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={data.energy?.consumption || ''}
                            onChange={(e) => handleChange('consumption', parseFloat(e.target.value) || 0)}
                            className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-lg focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                            placeholder="Ex: 500"
                            min="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kWh</span>
                    </div>
                    <p className="text-xs text-slate-400">Pode ser encontrado na conta de luz.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-petroleum-700">Distribuidora</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={data.energy?.distributor || ''}
                            onChange={(e) => handleChange('distributor', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:border-petroleum/60 focus:ring-0 outline-none transition-all appearance-none bg-white"
                        >
                            {DISTRIBUTORS.map(d => (
                                <option key={d} value={d}>{d.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional: Add Upload Bill later */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500">
                    <Zap size={20} />
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Dica de Especialista</h4>
                    <p className="text-sm text-blue-700 mt-1">Considere a média dos últimos 12 meses para evitar surpresas com a sazonalidade.</p>
                </div>
            </div>
        </div>
    );
};

export default StepConsumption;
