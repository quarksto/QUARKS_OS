import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const StepKit = ({ initialData, setFormData, availableKits }) => {
    const { kit } = initialData;
    const [tab, setTab] = useState(kit.type || 'PRESET'); // PRESET | CUSTOM
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (tab === 'CUSTOM' && products.length === 0) {
            loadProducts();
        }
    }, [tab]);

    const loadProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await api.get('/inventory/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSelectKit = (kitId) => {
        setFormData(prev => ({
            ...prev,
            kit: {
                ...prev.kit,
                type: 'PRESET',
                selectedKitId: kitId
            }
        }));
    };

    const handleSelectProduct = (product, type) => {
        const field = type === 'MODULE' ? 'module' : 'inverter';
        setFormData(prev => {
            const newCustom = {
                ...prev.kit.custom,
                [field]: product,
                [`${field}Id`]: product.id
            };

            // Auto-calculate cost price if both selected
            const modulePrice = (newCustom.module?.costPrice || 0) * (newCustom.modulesCount || 0);
            const inverterPrice = (newCustom.inverter?.costPrice || 0) * 1; // Assuming 1 inverter for now
            const totalCost = modulePrice + inverterPrice;

            return {
                ...prev,
                kit: {
                    ...prev.kit,
                    type: 'CUSTOM',
                    custom: {
                        ...newCustom,
                        costPrice: totalCost
                    }
                }
            };
        });
    };

    const handleCustomChange = (field, value) => {
        setFormData(prev => {
            const val = parseFloat(value) || 0;
            const newCustom = {
                ...prev.kit.custom,
                [field]: val
            };

            // Recalculate cost if modules count changed
            if (field === 'modulesCount') {
                const modulePrice = (newCustom.module?.costPrice || 0) * val;
                const inverterPrice = (newCustom.inverter?.costPrice || 0) * 1;
                newCustom.costPrice = modulePrice + inverterPrice;
            }

            return {
                ...prev,
                kit: {
                    ...prev.kit,
                    type: 'CUSTOM',
                    custom: newCustom
                }
            };
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <span className="material-symbols-outlined text-petroleum text-3xl ds-icon-w300">inventory_2</span>
                </div>
                <h3 className="ds-display-l text-petroleum mb-1.5 uppercase">Seleção de Equipamentos</h3>
                <p className="ds-body !text-slate-500 max-w-lg mx-auto">Escolha um kit pré-definido ou monte uma solução personalizada com transparência total.</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-10">
                <div className="bg-slate-100 p-1 rounded-full inline-flex border border-slate-200">
                    <button
                        onClick={() => { setTab('PRESET'); }}
                        className={`px-8 py-2 rounded-full ds-meta transition-all ${tab === 'PRESET'
                            ? 'bg-white text-petroleum font-bold border border-slate-200 shadow-none'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        KITS DISPONÍVEIS
                    </button>
                    <button
                        onClick={() => { setTab('CUSTOM'); setFormData(prev => ({ ...prev, kit: { ...prev.kit, type: 'CUSTOM' } })) }}
                        className={`px-8 py-2 rounded-full ds-meta transition-all ${tab === 'CUSTOM'
                            ? 'bg-white text-petroleum font-bold border border-slate-200 shadow-none'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        BOM PERSONALIZADO
                    </button>
                </div>
            </div>

            {tab === 'PRESET' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableKits.map((k) => {
                        const isSelected = kit.selectedKitId === k.id && kit.type === 'PRESET';
                        return (
                            <div
                                key={k.id}
                                onClick={() => handleSelectKit(k.id)}
                                className={`relative cursor-pointer group rounded-lg border transition-all duration-200 overflow-hidden shadow-none ${isSelected
                                    ? 'border-solar bg-solar-50/20'
                                    : 'border-slate-200 bg-white hover:border-solar/40'
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-solar bg-white rounded-full p-0.5 border border-solar/20">
                                        <span className="material-symbols-outlined text-xl ds-icon-w300">check_circle</span>
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`material-symbols-outlined text-lg ds-icon-w300 ${isSelected ? 'text-solar' : 'text-slate-400'}`}>bolt</span>
                                        <span className="ds-meta !text-slate-400 uppercase tracking-widest font-bold">
                                            {k.size_kwp} kWp
                                        </span>
                                    </div>
                                    <h4 className="ds-display-s text-petroleum mb-2 group-hover:text-solar transition-colors">
                                        {k.name}
                                    </h4>
                                    <p className="ds-body !text-slate-400 line-clamp-2 min-h-[40px] text-[13px]">
                                        {k.description || 'Kit completo com inversor e módulos de alta eficiência.'}
                                    </p>
                                </div>
                                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center group-hover:bg-solar-50/30 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="ds-meta !text-slate-400 uppercase font-bold tracking-tighter">Preço Sugerido</span>
                                        <span className="ds-display-s !text-petroleum !text-lg">
                                            R$ {(k.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-none border ${isSelected ? 'bg-solar text-petroleum border-solar' : 'bg-white text-slate-300 border-slate-200'
                                        }`}>
                                        <span className="material-symbols-outlined text-lg ds-icon-w300">{isSelected ? 'check' : 'add'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Configuration Header & Selection */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-none">
                            <h4 className="ds-label mb-6 flex items-center gap-2 text-slate-800">
                                <span className="material-symbols-outlined text-solar text-xl ds-icon-w300">search</span>
                                ESCOLHA OS COMPONENTES
                            </h4>

                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg ds-icon-w300">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome ou SKU..."
                                        className="ds-input pl-10 h-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                                    {loadingProducts ? (
                                        <div className="py-12 text-center ds-meta !text-slate-400 animate-pulse">CARREGANDO CATÁLOGO...</div>
                                    ) : products
                                        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(product => {
                                            const isSelected = kit.custom?.moduleId === product.id || kit.custom?.inverterId === product.id;
                                            return (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleSelectProduct(product, product.type)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between shadow-none ${isSelected
                                                        ? 'border-solar bg-solar-50/30'
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="ds-label normal-case font-bold text-petroleum">{product.name}</div>
                                                        <div className="ds-meta !text-slate-400 font-bold uppercase tracking-tight">{product.type === 'MODULE' ? 'Módulo' : 'Inversor'} • {product.sku}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="ds-label !text-solar font-black">
                                                            R$ {product.costPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </div>
                                                        {isSelected && <span className="material-symbols-outlined text-solar text-lg ds-icon-w300">check_circle</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary and Quantity */}
                    <div className="space-y-6">
                        <div className="bg-petroleum/95 rounded-lg p-6 text-white shadow-none border border-petroleum">
                            <h4 className="ds-label !text-white mb-6 flex items-center gap-2 opacity-90">
                                <span className="material-symbols-outlined text-solar text-xl ds-icon-w300">list_alt</span>
                                RESUMO DO SISTEMA (BOM)
                            </h4>

                            <div className="space-y-4">
                                {/* Module Selection */}
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="ds-meta !text-slate-400 mb-3 tracking-widest opacity-60">MÓDULO FOTOVOLTAICO</div>
                                    {kit.custom?.module ? (
                                        <div className="space-y-4">
                                            <div className="ds-label !text-white !normal-case">{kit.custom.module.name}</div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="ds-meta !text-slate-500 mb-1 font-bold">QUANTIDADE</label>
                                                    <input
                                                        type="number"
                                                        value={kit.custom?.modulesCount || ''}
                                                        onChange={(e) => handleCustomChange('modulesCount', e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white ds-body outline-none focus:border-solar/40"
                                                        placeholder="Ex: 12"
                                                    />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <div className="ds-meta !text-slate-500 mb-1 font-bold">SUBTOTAL</div>
                                                    <div className="ds-display-s !text-solar !text-lg">
                                                        R$ {((kit.custom.module.costPrice || 0) * (kit.custom.modulesCount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="ds-body !text-slate-500 italic opacity-50">Nenhum módulo selecionado</div>
                                    )}
                                </div>

                                {/* Inverter Selection */}
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="ds-meta !text-slate-400 mb-3 tracking-widest opacity-60">INVERSOR</div>
                                    {kit.custom?.inverter ? (
                                        <div className="space-y-1">
                                            <div className="ds-label !text-white !normal-case">{kit.custom.inverter.name}</div>
                                            <div className="flex items-center justify-between">
                                                <span className="ds-meta !text-slate-500 font-bold">UNIDADES: 1</span>
                                                <div className="ds-display-s !text-solar !text-lg">
                                                    R$ {kit.custom.inverter.costPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="ds-body !text-slate-500 italic opacity-50">Nenhum inversor selecionado</div>
                                    )}
                                </div>

                                {/* Total Cost Card */}
                                <div className="pt-6 mt-2 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="ds-meta !text-slate-400 mb-1 tracking-wider opacity-60">VALOR TOTAL DO BOM</div>
                                            <div className="ds-display-l !text-solar font-black !text-3xl">
                                                R$ {(kit.custom?.costPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, kit: { ...prev.kit, type: 'CUSTOM' } }))}
                                            className="px-6 h-10 bg-solar hover:bg-amber-600 text-petroleum rounded-full ds-meta font-black transition-all shadow-none"
                                        >
                                            CONFIRMAR BOM
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepKit;
