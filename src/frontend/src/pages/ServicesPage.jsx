import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Plus, Search, Trash2, Edit2, Settings, DollarSign } from 'lucide-react';

const SERVICE_TYPES = {
    INSTALLATION: 'Instalação',
    ENGINEERING: 'Engenharia',
    HOMOLOGATION: 'Homologação',
    FREIGHT: 'Frete',
    INSURANCE: 'Seguro',
    OTHER: 'Outros'
};

const PRICE_TYPES = {
    FIXED: 'Valor Fixo (R$)',
    PER_WATT: 'Por Watt (R$/Wp)',
    PER_KM: 'Por Km (R$/km)',
    PERCENT: 'Percentual (%)'
};

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Forms
    const [serviceForm, setServiceForm] = useState({ name: '', type: 'INSTALLATION', description: '' });
    const [priceForm, setPriceForm] = useState({
        serviceId: '',
        priceType: 'FIXED',
        priceValue: '',
        minPower: 0,
        maxPower: 10000,
        state: ''
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services', serviceForm);
            setShowServiceModal(false);
            loadServices();
            setServiceForm({ name: '', type: 'INSTALLATION', description: '' });
        } catch (error) {
            alert('Erro ao salvar serviço: ' + error.message);
        }
    };

    const handleAddPrice = (service) => {
        setSelectedService(service);
        setPriceForm({ ...priceForm, serviceId: service.id });
        setShowPriceModal(true);
    };

    const handleSavePrice = async (e) => {
        e.preventDefault();
        try {
            await api.post('/services/prices', priceForm);
            setShowPriceModal(false);
            loadServices(); // Reload to see new prices nested
        } catch (error) {
            alert('Erro ao salvar preço: ' + error.message);
        }
    };

    const handleDeletePrice = async (priceId) => {
        if (!window.confirm('Excluir este preço?')) return;
        try {
            await api.delete(`/services/prices/${priceId}`);
            loadServices();
        } catch (error) {
            alert('Erro ao excluir: ' + error.message);
        }
    };

    return (
        <DashboardShell>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="ds-display-l text-petroleum mb-1">Serviços e Custos</h1>
                    <p className="ds-body-m text-slate-500">Gerencie custos de mão de obra, engenharia e outros serviços.</p>
                </div>
                <button
                    onClick={() => setShowServiceModal(true)}
                    className="ds-button-primary bg-solar hover:bg-solar-600 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Novo Serviço
                </button>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <p className="text-slate-500">Carregando...</p>
                ) : services.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-400">Nenhum serviço cadastrado.</p>
                    </div>
                ) : (
                    services.map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-petroleum">
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-petroleum">{service.name}</h3>
                                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                            {SERVICE_TYPES[service.type]}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddPrice(service)}
                                    className="text-sm text-solar hover:text-solar-700 font-medium flex items-center gap-1"
                                >
                                    <Plus size={16} /> Adicionar Preço
                                </button>
                            </div>

                            <div className="p-0">
                                {service.prices && service.prices.length > 0 ? (
                                    <table className="w-full text-sm">
                                        <thead className="bg-white text-slate-500 border-b border-slate-100">
                                            <tr>
                                                <th className="text-left py-2 px-4 font-normal">Regra de Preço</th>
                                                <th className="text-left py-2 px-4 font-normal">Valor</th>
                                                <th className="text-left py-2 px-4 font-normal">Condição (Potência)</th>
                                                <th className="text-left py-2 px-4 font-normal">Estado</th>
                                                <th className="text-right py-2 px-4 font-normal">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {service.prices.map(price => (
                                                <tr key={price.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                                    <td className="py-2 px-4 text-slate-700">{PRICE_TYPES[price.priceType]}</td>
                                                    <td className="py-2 px-4 font-mono font-medium text-petroleum">
                                                        {price.priceType === 'PERCENT'
                                                            ? `${price.priceValue}%`
                                                            : `R$ ${price.priceValue}`}
                                                    </td>
                                                    <td className="py-2 px-4 text-slate-500">
                                                        {price.minPower}kW - {price.maxPower >= 9999 ? '∞' : `${price.maxPower}kW`}
                                                    </td>
                                                    <td className="py-2 px-4 text-slate-500">
                                                        {price.state || 'Nacional'}
                                                    </td>
                                                    <td className="py-2 px-4 text-right">
                                                        <button
                                                            onClick={() => handleDeletePrice(price.id)}
                                                            className="text-slate-400 hover:text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-4 text-slate-400 text-sm italic">
                                        Nenhuma regra de preço definida. Este serviço não será cobrado automaticamente.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="ds-title-card mb-4">Novo Serviço</h2>
                        <form onSubmit={handleSaveService} className="space-y-4">
                            <div>
                                <label className="ds-label mb-1 block">Nome do Serviço</label>
                                <input
                                    required
                                    className="ds-input w-full"
                                    value={serviceForm.name}
                                    onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                                    placeholder="Ex: Instalação Padrão"
                                />
                            </div>
                            <div>
                                <label className="ds-label mb-1 block">Tipo</label>
                                <select
                                    className="ds-input w-full"
                                    value={serviceForm.type}
                                    onChange={e => setServiceForm({ ...serviceForm, type: e.target.value })}
                                >
                                    {Object.entries(SERVICE_TYPES).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="ds-label mb-1 block">Descrição</label>
                                <textarea
                                    className="ds-input w-full"
                                    rows="3"
                                    value={serviceForm.description}
                                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowServiceModal(false)} className="ds-button-secondary">Cancelar</button>
                                <button type="submit" className="ds-button-primary bg-solar text-white">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Price Modal */}
            {showPriceModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="ds-title-card mb-4">Adicionar Preço: {selectedService?.name}</h2>
                        <form onSubmit={handleSavePrice} className="space-y-4">
                            <div>
                                <label className="ds-label mb-1 block">Tipo de Cálculo</label>
                                <select
                                    className="ds-input w-full"
                                    value={priceForm.priceType}
                                    onChange={e => setPriceForm({ ...priceForm, priceType: e.target.value })}
                                >
                                    {Object.entries(PRICE_TYPES).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="ds-label mb-1 block">Valor</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="ds-input w-full"
                                    value={priceForm.priceValue}
                                    onChange={e => setPriceForm({ ...priceForm, priceValue: e.target.value })}
                                    placeholder={priceForm.priceType === 'PERCENT' ? 'Ex: 15 (para 15%)' : 'Ex: 0.80'}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ds-label mb-1 block">Potência Mín (kW)</label>
                                    <input
                                        type="number"
                                        className="ds-input w-full"
                                        value={priceForm.minPower}
                                        onChange={e => setPriceForm({ ...priceForm, minPower: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="ds-label mb-1 block">Potência Máx (kW)</label>
                                    <input
                                        type="number"
                                        className="ds-input w-full"
                                        value={priceForm.maxPower}
                                        onChange={e => setPriceForm({ ...priceForm, maxPower: e.target.value })}
                                        placeholder="Vazio = Infinito"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="ds-label mb-1 block">Estado (UF)</label>
                                <input
                                    className="ds-input w-full uppercase"
                                    maxLength="2"
                                    value={priceForm.state}
                                    onChange={e => setPriceForm({ ...priceForm, state: e.target.value.toUpperCase() })}
                                    placeholder="Ex: SP (Deixe vazio para Nacional)"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowPriceModal(false)} className="ds-button-secondary">Cancelar</button>
                                <button type="submit" className="ds-button-primary bg-solar text-white">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardShell>
    );
};

export default ServicesPage;
