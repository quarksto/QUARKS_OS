import React from 'react';
import { Home, Compass, MapPin } from 'lucide-react';

const ROOF_TYPES = [
    { id: 'CERAMIC', name: 'Cerâmico', icon: '🏠' },
    { id: 'METAL', name: 'Metálico', icon: '🏭' },
    { id: 'SLAB', name: 'Laje/Solo', icon: '🏢' },
    { id: 'GROUND', name: 'Solo', icon: '🌳' },
];

const ORIENTATIONS = [
    { id: 'NORTH', name: 'Norte' },
    { id: 'NORTH_EAST', name: 'Nordeste' },
    { id: 'NORTH_WEST', name: 'Noroeste' },
    { id: 'EAST', name: 'Leste' },
    { id: 'WEST', name: 'Oeste' },
    { id: 'SOUTH', name: 'Sul (Menor Geração)' }
];

const StepRoof = ({ data, updateFormData }) => {

    const handleChange = (field, value) => {
        updateFormData('location', { [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home size={32} className="text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-petroleum-800">Local de Instalação</h3>
                <p className="text-slate-500 mt-2">Características do telhado e localização para dimensionar a estrutura.</p>
            </div>

            <div className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-petroleum-700">Endereço da Instalação</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={data.location?.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:border-petroleum/60 focus:ring-0 outline-none transition-all"
                            placeholder="Rua, Número, Cidade - Estado"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Roof Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-petroleum-700">Tipo de Telhado</label>
                        <div className="grid grid-cols-2 gap-3">
                            {ROOF_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleChange('roofType', type.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${data.location?.roofType === type.id
                                            ? 'border-solar bg-solar-50 text-solar font-bold ring-1 ring-solar'
                                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <span className="text-2xl mb-1">{type.icon}</span>
                                    <span className="text-xs">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orientation */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-petroleum-700">Orientação do Telhado</label>
                        <div className="relative">
                            <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={data.location?.orientation || 'NORTH'}
                                onChange={(e) => handleChange('orientation', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:border-petroleum/60 focus:ring-0 outline-none transition-all appearance-none bg-white"
                            >
                                {ORIENTATIONS.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Impacta na eficiência da geração.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepRoof;
