import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api, { API_BASE } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';

const ProposalPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const leadId = searchParams.get('leadId') || location.state?.leadId;

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);

    // Real data from API
    const [availableKits, setAvailableKits] = useState([]);
    const [pricingRules, setPricingRules] = useState({ baseCost: 2.50, margin: 20, tax: 15 });
    const [kitsLoading, setKitsLoading] = useState(true);

    const [selectedKitId, setSelectedKitId] = useState(null);

    const [formData, setFormData] = useState({
        customer: { name: '', city: '', state: 'SP' },
        generation: { system_size_kwp: 5.5, estimated_generation_monthly: 500, panels_count: 10 },
        financials: { system_cost: 0, monthly_savings: 550, tariff: 0.92 },
        distributor: 'CPFL_PAULISTA'
    });

    // Custom Kit State
    const [activeTab, setActiveTab] = useState('PRESET'); // 'PRESET' | 'CUSTOM'
    const [products, setProducts] = useState({ modules: [], inverters: [], structures: [] });
    const [customKit, setCustomKit] = useState({
        module: null,
        moduleCount: 10,
        inverter: null,
        structure: null,
        powerKwp: 0,
        costPrice: 0
    });

    // Fetch kits, projects and pricing rules on mount
    useEffect(() => {
        const fetchData = async () => {
            setKitsLoading(true);
            try {
                // Fetch Kits
                const kitsRes = await api.get('/inventory/kits?active=true');
                const kits = kitsRes.data || [];
                setAvailableKits(kits);

                // Fetch Products for Custom Kit
                const [modulesRes, invertersRes, structuresRes] = await Promise.all([
                    api.get('/inventory/products?type=MODULE&active=true'),
                    api.get('/inventory/products?type=INVERTER&active=true'),
                    api.get('/inventory/products?type=STRUCTURE&active=true')
                ]);
                setProducts({
                    modules: modulesRes.data || [],
                    inverters: invertersRes.data || [],
                    structures: structuresRes.data || []
                });

                // Set default kit if available
                if (kits.length > 0) {
                    setSelectedKitId(kits[0].id);
                    const firstKit = kits[0];
                    setFormData(prev => ({
                        ...prev,
                        generation: {
                            ...prev.generation,
                            system_size_kwp: firstKit.size_kwp || 5.5,
                            panels_count: Math.ceil((firstKit.size_kwp || 5.5) / 0.55)
                        },
                        financials: {
                            ...prev.financials,
                            // System cost will now be calculated by backend
                            system_cost: 0
                        }
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Fallback to mock data if API fails
                setAvailableKits([
                    { id: 1, name: 'Kit 3kWp Econômico', inverter: 'Growatt 3000TL', panels: '6x Jinko 550W', price: 9500, size_kwp: 3.3 },
                    { id: 2, name: 'Kit 5kWp Standard', inverter: 'Growatt 5000TL', panels: '10x Jinko 550W', price: 14500, size_kwp: 5.5 },
                    { id: 3, name: 'Kit 10kWp Premium', inverter: 'Deye 10kW Híbrido', panels: '18x Canadian 550W', price: 32000, size_kwp: 10.0 },
                ]);
                setSelectedKitId(2);
            } finally {
                setKitsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Effect to update Custom Kit calculations
    useEffect(() => {
        if (activeTab === 'CUSTOM') {
            const mod = products.modules.find(m => m.id === customKit.module) || {};
            const inv = products.inverters.find(i => i.id === customKit.inverter) || {};
            const str = products.structures.find(s => s.id === customKit.structure) || {};

            const modPower = (mod.specs?.power || 550);
            const totalPower = (modPower * customKit.moduleCount) / 1000; // kWp

            const totalCost =
                ((mod.costPrice || 0) * customKit.moduleCount) +
                (inv.costPrice || 0) +
                (str.costPrice || 0);

            setCustomKit(prev => ({
                ...prev,
                powerKwp: totalPower,
                costPrice: totalCost
            }));

            // Sync with main form for preview
            setFormData(prev => ({
                ...prev,
                generation: {
                    ...prev.generation,
                    system_size_kwp: totalPower,
                    panels_count: customKit.moduleCount,
                    estimated_generation_monthly: totalPower * 130
                }
            }));
            setHtmlContent(null);
        }
    }, [customKit.module, customKit.moduleCount, customKit.inverter, customKit.structure, activeTab, products]);

    // Fetch lead data if leadId provided
    useEffect(() => {
        if (!leadId) return;
        api.get(`/leads/${leadId}`)
            .then((res) => {
                const l = res.data;
                setLead(l);
                const loc = (l.location || '').split(',').map(s => s.trim());
                const city = loc[0] || '';
                const state = (loc[1] || 'SP').slice(-2);
                setFormData(prev => ({
                    ...prev,
                    customer: {
                        name: l.name || prev.customer.name,
                        city: city || prev.customer.city,
                        state: state || prev.customer.state
                    },
                    generation: {
                        ...prev.generation,
                        estimated_generation_monthly: l.consumption ?? prev.generation.estimated_generation_monthly
                    }
                }));
            })
            .catch(() => setLead(null));
    }, [leadId]);

    const handleKitChange = (kitId) => {
        const id = kitId; // Keep as string if UUID
        setSelectedKitId(id);
        const kit = availableKits.find(k => k.id === id || String(k.id) === String(id));
        if (kit) {
            // Only update system info, Price is calculated by backend
            const sizeKwp = kit.size_kwp || kit.size || 5.5;
            setFormData(prev => ({
                ...prev,
                generation: {
                    ...prev.generation,
                    system_size_kwp: sizeKwp,
                    panels_count: Math.ceil(sizeKwp / 0.55), // approx
                    estimated_generation_monthly: sizeKwp * 130 // approx 130kWh/kWp
                }
            }));
            // Clear previous html content to force regeneration
            setHtmlContent(null);
        }
    };

    // State for visual breakdown
    const [pricingBreakdown, setPricingBreakdown] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setPricingBreakdown(null);
        try {
            let payloadKit;

            if (activeTab === 'PRESET') {
                const kit = availableKits.find(k => k.id === selectedKitId);
                payloadKit = {
                    name: kit ? kit.name : 'Kit Padrão',
                    price: kit ? kit.price : 0, // Backend checks this
                    powerKwp: kit ? kit.size_kwp : 0,
                    id: kit ? kit.id : null
                };
            } else {
                payloadKit = {
                    name: 'Kit Personalizado',
                    price: customKit.costPrice,
                    powerKwp: customKit.powerKwp,
                    isCustom: true
                };
            }

            const payload = {
                customer: formData.customer,
                consumption: formData.generation.estimated_generation_monthly,
                distributor: formData.distributor,
                kit: payloadKit, // Send Full Object
                kit_name: payloadKit.name, // Fallback
                system_size: formData.generation.system_size_kwp,
                kit_name: payloadKit.name, // Fallback
                system_size: formData.generation.system_size_kwp,
                // price: No longer sending price, backend calculates it
                introduction: formData.introduction,
                notes: formData.notes,
                paymentTerms: formData.paymentTerms
            };

            const response = await api.post('/orchestrate/preview-proposal', payload);

            if (response.data.html_content) {
                setHtmlContent(response.data.html_content);
            }

            if (response.data.pricing) {
                setPricingBreakdown(response.data.pricing);
                setFormData(prev => ({
                    ...prev,
                    financials: {
                        ...prev.financials,
                        system_cost: response.data.pricing.total
                    }
                }));
            } else if (response.data.error) {
                throw new Error(response.data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao gerar proposta: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAndSave = async () => {
        if (!leadId) {
            alert('Abra esta página a partir de um lead (botão "Criar proposta" na ficha do lead).');
            return;
        }
        setCreating(true);
        try {
            const consumption = formData.generation?.estimated_generation_monthly || lead?.consumption || 500;
            const payload = {
                leadId,
                consumption,
                introduction: formData.introduction,
                notes: formData.notes,
                paymentTerms: formData.paymentTerms
            };
            const response = await api.post('/orchestrate/create-proposal', payload);
            if (response.data?.proposal?.id) {
                setHtmlContent(null);
                navigate(`/proposals/${response.data.proposal.id}`);
            } else if (response.data?.proposal) {
                alert(`Proposta criada. ID: ${response.data.proposal.id || 'N/A'}`);
                setHtmlContent(null);
            } else {
                throw new Error(response.data?.error || 'Resposta inválida');
            }
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.status === 403
                ? 'Sem permissão (apenas COMERCIAL/ADMIN).'
                : (error.response?.data?.error || error.message);
            alert('Erro ao criar proposta: ' + msg);
        } finally {
            setCreating(false);
        }
    };

    return (
        <DashboardShell
            title="Gerador de Proposta"
            subtitle="Engine Python Solar"
            headerIcon="description"
        >
            <div className="p-8 max-w-[1600px] mx-auto overflow-y-auto h-full">
                {leadId && (
                    <p className="ds-body mb-4 text-petroleum-700 bg-petroleum/10 border border-petroleum/20 rounded-lg px-4 py-2 inline-block">
                        Proposta para o lead selecionado. Preencha os dados e use &quot;Gerar Proposta&quot; para prévia ou &quot;Criar e salvar&quot; para persistir.
                    </p>
                )}
                <p className="ds-body mb-8 text-slate-500">Selecione o Kit e gere a proposta com precificação real.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="technical-card p-6 h-fit">
                        <h3 className="ds-title-section mb-6 text-petroleum-800">1. Seleção do Kit</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'PRESET' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('PRESET')}
                                >
                                    Kits Prontos
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'CUSTOM' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setActiveTab('CUSTOM')}
                                >
                                    Montar Kit
                                </button>
                            </div>

                            {activeTab === 'PRESET' ? (
                                <div>
                                    <label className="ds-label block mb-1.5">Modelo do Kit</label>
                                    {kitsLoading ? (
                                        <div className="w-full px-3 py-2 border border-slate-100 rounded-md text-sm text-slate-400 bg-slate-50">
                                            Carregando kits...
                                        </div>
                                    ) : availableKits.length === 0 ? (
                                        <div className="w-full px-3 py-2 border border-orange-200 rounded-md text-sm text-orange-600 bg-orange-50">
                                            Nenhum kit cadastrado. Use a página Catálogo para adicionar.
                                        </div>
                                    ) : (
                                        <select
                                            value={selectedKitId || ''}
                                            onChange={(e) => handleKitChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all"
                                        >
                                            {availableKits.map(kit => (
                                                <option key={kit.id} value={kit.id}>
                                                    {kit.name} - R$ {(kit.price || 0).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    {/* Inverter */}
                                    <div>
                                        <label className="ds-label block mb-1">Inversor</label>
                                        <select
                                            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                            value={customKit.inverter || ''}
                                            onChange={e => setCustomKit(prev => ({ ...prev, inverter: e.target.value }))}
                                        >
                                            <option value="">Selecione um inversor...</option>
                                            {products.inverters.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Modules */}
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="ds-label block mb-1">Módulo</label>
                                            <select
                                                className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                value={customKit.module || ''}
                                                onChange={e => setCustomKit(prev => ({ ...prev, module: e.target.value }))}
                                            >
                                                <option value="">Selecione um módulo...</option>
                                                {products.modules.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.specs?.power || '?'}W)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="ds-label block mb-1">Qtd</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                value={customKit.moduleCount}
                                                onChange={e => setCustomKit(prev => ({ ...prev, moduleCount: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Structure */}
                                    <div>
                                        <label className="ds-label block mb-1">Estrutura</label>
                                        <select
                                            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                            value={customKit.structure || ''}
                                            onChange={e => setCustomKit(prev => ({ ...prev, structure: e.target.value }))}
                                        >
                                            <option value="">Selecione uma estrutura...</option>
                                            {products.structures.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-sm text-slate-500">Potência Total:</span>
                                        <span className="text-lg font-bold text-blue-700">{customKit.powerKwp.toFixed(2)} kWp</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div>
                                    <span className="text-xs text-slate-500 block">Potência</span>
                                    <span className="font-bold text-petroleum-800">{formData.generation.system_size_kwp.toFixed(2)} kWp</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 block">Preço Final</span>
                                    <span className="font-bold text-solar-600">R$ {formData.financials.system_cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="ds-title-section mb-6 text-petroleum-800 border-t pt-6 border-slate-100">2. Dados do Cliente</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="ds-label block mb-1.5">Nome do Cliente</label>
                                <input
                                    type="text"
                                    value={formData.customer.name}
                                    onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, name: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all placeholder:text-slate-300"
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="ds-label block mb-1.5">Cidade</label>
                                <input
                                    type="text"
                                    value={formData.customer.city}
                                    onChange={(e) => setFormData({ ...formData, customer: { ...formData.customer, city: e.target.value } })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all"
                                />
                            </div>
                        </div>

                        <h3 className="ds-title-section mb-6 text-petroleum-800 border-t pt-6 border-slate-100">3. Personalização da Proposta (Opcional)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="ds-label block mb-1.5 has-tooltip" data-tooltip="Texto de apresentação que aparece no início da proposta">Apresentação / Introdução</label>
                                <textarea
                                    rows={3}
                                    value={formData.introduction}
                                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all placeholder:text-slate-300 resize-y"
                                    placeholder="Ex: É com satisfação que apresentamos esta proposta..."
                                />
                            </div>
                            <div>
                                <label className="ds-label block mb-1.5 has-tooltip" data-tooltip="Condições comerciais e formas de pagamento">Condições de Pagamento</label>
                                <textarea
                                    rows={2}
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all placeholder:text-slate-300 resize-y"
                                    placeholder="Ex: 30% sinal + 70% na entrega ou Financiamento em até 60x"
                                />
                            </div>
                            <div>
                                <label className="ds-label block mb-1.5 has-tooltip" data-tooltip="Observações gerais para o cliente">Observações</label>
                                <textarea
                                    rows={2}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-petroleum focus:ring-1 focus:ring-petroleum outline-none transition-all placeholder:text-slate-300 resize-y"
                                    placeholder="Ex: Validade da proposta: 5 dias."
                                />
                            </div>
                        </div>

                        {leadId && (
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleCreateAndSave}
                                    disabled={creating || !leadId}
                                    className="w-full rounded-lg bg-petroleum hover:bg-petroleum-600 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed border border-petroleum"
                                >
                                    {creating ? (
                                        <>
                                            <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar e salvar proposta'
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full rounded-lg bg-solar-500 hover:bg-solar-600 active:bg-solar-700 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                                        Gerando...
                                    </>
                                ) : (
                                    'Gerar Proposta (prévia)'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 technical-card p-0 min-h-[600px] relative overflow-hidden bg-slate-50 flex flex-col">
                    {loading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
                            <div className="animate-spin rounded-lg h-8 w-8 border-4 border-solar-500 border-t-transparent mb-4"></div>
                            <span className="ds-label text-slate-500">Gerando proposta personalizada...</span>
                        </div>
                    )}
                    {htmlContent ? (
                        <iframe
                            srcDoc={htmlContent}
                            className="w-full flex-1 border-0"
                            title="Proposta Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-4">
                            <span className="material-symbols-outlined text-4xl opacity-20">description</span>
                            <p className="ds-body text-center max-w-xs">Preencha os dados ao lado e clique em <strong className="text-solar-600">Gerar Proposta</strong> para visualizar a prévia.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </DashboardShell >
    );
};

export default ProposalPage;
