import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import ServiceModal from '../components/services/ServiceModal';
import PriceModal from '../components/services/PriceModal';

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
    const [modalLoading, setModalLoading] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Forms
    const [serviceForm, setServiceForm] = useState({
        name: '',
        type: 'INSTALLATION',
        code: '',
        baseCost: '',
        description: ''
    });

    const [priceForm, setPriceForm] = useState({
        serviceId: '',
        priceType: 'FIXED',
        priceValue: '',
        minPower: 0,
        maxPower: 99999,
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
        setModalLoading(true);
        try {
            await api.post('/services', serviceForm);
            setShowServiceModal(false);
            loadServices();
            setServiceForm({ name: '', type: 'INSTALLATION', code: '', baseCost: '', description: '' });
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            // DS §13.1 Suggestion: Generic error state could be added here
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddPrice = (service) => {
        setSelectedService(service);
        setPriceForm({
            serviceId: service.id,
            priceType: 'FIXED',
            priceValue: '',
            minPower: 0,
            maxPower: 99999,
            state: ''
        });
        setShowPriceModal(true);
    };

    const handleSavePrice = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            await api.post('/services/prices', priceForm);
            setShowPriceModal(false);
            loadServices();
        } catch (error) {
            console.error('Erro ao salvar preço:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeletePrice = async (priceId) => {
        if (!window.confirm('Excluir esta regra de preço?')) return;
        try {
            await api.delete(`/services/prices/${priceId}`);
            loadServices();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    return (
        <DashboardShell
            title="Serviços e Custos"
            subtitle="Gerencie o catálogo de serviços, SKUs e regras de precificação regionais"
            headerIcon="settings"
            headerRight={
                <button
                    onClick={() => setShowServiceModal(true)}
                    className="h-8 rounded-full bg-solar hover:bg-amber-600 text-white font-bold text-[11px] px-4 flex items-center gap-2 transition-all shadow-none active:scale-95"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    NOVO SERVIÇO
                </button>
            }
        >
            <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-y-auto p-6 gap-6">
                <div className="max-w-[1600px] mx-auto w-full">
                    <div className="grid gap-6">
                        {loading ? (
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white border border-slate-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center p-12 bg-white rounded-lg border border-slate-200">
                                <span className="material-symbols-outlined text-slate-300 text-[48px] mb-4 font-light">inventory_2</span>
                                <p className="text-slate-500 ds-label">Nenhum serviço cadastrado no catálogo.</p>
                            </div>
                        ) : (
                            services.map(service => (
                                <div key={service.id} className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-none hover:border-slate-200 transition-all group">
                                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-white rounded-full border border-slate-100 flex items-center justify-center text-petroleum shrink-0 shadow-none">
                                                <span className="material-symbols-outlined text-[20px] font-light">
                                                    {service.type === 'INSTALLATION' ? 'home_repair_service' :
                                                        service.type === 'ENGINEERING' ? 'architecture' :
                                                            service.type === 'HOMOLOGATION' ? 'description' : 'settings_suggest'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="ds-title-section text-petroleum leading-tight">{service.name}</h3>
                                                    {service.code && (
                                                        <span className="text-[10px] font-mono bg-slate-200 text-slate-500 px-1.5 rounded uppercase">
                                                            {service.code}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="badge-kanban px-2 py-0.5 text-slate-500">
                                                        {SERVICE_TYPES[service.type]}
                                                    </span>
                                                    {service.baseCost > 0 && (
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            Custo Base: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.baseCost)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddPrice(service)}
                                            className="h-8 rounded-full border border-slate-200 text-slate-600 hover:border-solar hover:text-solar font-bold text-[11px] px-3 flex items-center gap-1 transition-all active:scale-95 bg-white"
                                        >
                                            <span className="material-symbols-outlined text-[16px] font-light">add_circle</span>
                                            ADICIONAR PREÇO
                                        </button>
                                    </div>

                                    <div className="p-0">
                                        {service.prices && service.prices.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-[13px]">
                                                    <thead className="bg-slate-50/30 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-50">
                                                        <tr>
                                                            <th className="text-left py-3 px-6 font-bold">Regra de Preço</th>
                                                            <th className="text-left py-3 px-6 font-bold">Valor</th>
                                                            <th className="text-left py-3 px-6 font-bold">Condição (Potência)</th>
                                                            <th className="text-left py-3 px-6 font-bold">Estado</th>
                                                            <th className="text-right py-3 px-6 font-bold">Ações</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {service.prices.map(price => (
                                                            <tr key={price.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-3 px-6 text-slate-700 font-medium">{PRICE_TYPES[price.priceType]}</td>
                                                                <td className="py-3 px-6 font-mono font-semibold text-petroleum text-[14px]">
                                                                    {price.priceType === 'PERCENT'
                                                                        ? `${price.priceValue}%`
                                                                        : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price.priceValue)}
                                                                </td>
                                                                <td className="py-3 px-6 text-slate-500">
                                                                    {price.minPower}kW - {price.maxPower >= 9999 ? '∞' : `${price.maxPower}kW`}
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <span className={`badge-kanban px-2 py-0.5 ${price.state ? 'text-solar' : 'text-slate-500'}`}>
                                                                        {price.state || 'Nacional'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-6 text-right">
                                                                    <button
                                                                        onClick={() => handleDeletePrice(price.id)}
                                                                        className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                                        title="Excluir regra"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px] font-light">delete</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center bg-white">
                                                <p className="text-slate-400 text-[12px] italic">
                                                    Nenhuma regra de preço cadastrada para este serviço.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ServiceModal
                isOpen={showServiceModal}
                onClose={() => setShowServiceModal(false)}
                onSave={handleSaveService}
                formData={serviceForm}
                setFormData={setServiceForm}
                loading={modalLoading}
            />

            <PriceModal
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                onSave={handleSavePrice}
                formData={priceForm}
                setFormData={setPriceForm}
                serviceName={selectedService?.name}
                loading={modalLoading}
            />
        </DashboardShell>
    );
};

export default ServicesPage;
