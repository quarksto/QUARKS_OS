import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Check } from 'lucide-react';
import PricingBreakdown from '../../PricingBreakdown';
import api from '../../../services/api';

const StepFinancials = ({ data, updateFormData, onSave, loading }) => {
    // We need to generate the preview when entering this step
    const [previewLoading, setPreviewLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Trigger generation if not already generated or if data changed?
        // Ideally we generate on mount of this step.
        generateProposalPreview();
    }, []);

    const generateProposalPreview = async () => {
        setPreviewLoading(true);
        setError(null);
        try {
            const { energy, location, kit, customer, proposal, financials } = data;

            let payloadKit;
            if (kit.type === 'PRESET') {
                const selectedKit = (availableKits || []).find(k => k.id === kit.selectedKitId);
                payloadKit = {
                    id: kit.selectedKitId,
                    type: 'PRESET',
                    name: selectedKit?.name,
                    price: selectedKit?.price,
                    powerKwp: selectedKit?.size_kwp
                };
            } else {
                payloadKit = {
                    isCustom: true,
                    ...kit.custom
                };
            }

            const payload = {
                customer,
                consumption: energy.consumption,
                distributor: energy.distributor,
                location: location,
                kit: payloadKit,
                proposal: {
                    ...proposal,
                    discount: financials.discount || 0,
                    markup: financials.markup || 0
                }
            };

            const response = await api.post('/orchestrate/preview-proposal', payload);

            if (response.data.html_content) {
                setHtmlContent(response.data.html_content);
            }
            if (response.data.pricing) {
                // Map backend keys to what PricingBreakdown expects
                const b = response.data.pricing.breakdown;
                const mappedPricing = {
                    ...response.data.pricing,
                    breakdown: {
                        equipment: b.hardware,
                        services: b.services,
                        margin: b.grossMargin,
                        taxes: b.estimatedTaxes
                    }
                };
                updateFormData('financials', { pricingBreakdown: mappedPricing });
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao gerar prévia da proposta. Verifique os dados.');
        } finally {
            setPreviewLoading(false);
        }
    };

    const breakdown = data.financials?.pricingBreakdown?.breakdown;
    const total = data.financials?.pricingBreakdown?.total || 0;

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left: Financial Config & Breakdown */}
            <div className="space-y-6 overflow-y-auto pr-2">
                <div>
                    <h3 className="text-2xl font-bold text-petroleum-800 mb-2">Revisão Financeira</h3>
                    <p className="text-slate-500">Confira os custos e a margem antes de finalizar.</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                        {error}
                        <button onClick={generateProposalPreview} className="ml-4 underline font-bold">Tentar Novamente</button>
                    </div>
                )}

                {/* Loading State */}
                {previewLoading && (
                    <div className="p-8 text-center text-slate-500">
                        Calculando viabilidade e custos...
                    </div>
                )}

                {/* Breakdown */}
                {!previewLoading && breakdown && (
                    <PricingBreakdown breakdown={breakdown} total={total} />
                )}

                {/* Additional Inputs */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="font-semibold text-petroleum-700 flex items-center gap-2">
                        <FileText size={18} />
                        Personalizar Proposta
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Margem Adicional (%)</label>
                            <input
                                type="number"
                                value={data.financials?.markup || 0}
                                onChange={(e) => updateFormData('financials', { markup: parseFloat(e.target.value) || 0 })}
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-petroleum/60 focus:ring-0 outline-none"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-slate-400">Desconto (R$)</label>
                            <input
                                type="number"
                                value={data.financials?.discount || 0}
                                onChange={(e) => updateFormData('financials', { discount: parseFloat(e.target.value) || 0 })}
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-petroleum/60 focus:ring-0 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generateProposalPreview}
                        className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                    >
                        Recalcular com Ajustes
                    </button>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Introdução</label>
                        <textarea
                            value={data.proposal?.introduction || ''}
                            onChange={(e) => updateFormData('proposal', { introduction: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 focus:border-petroleum/60 focus:ring-0 outline-none"
                            placeholder="Texto introdutório para o cliente..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-slate-400">Condições de Pagamento</label>
                        <textarea
                            value={data.proposal?.paymentTerms || ''}
                            onChange={(e) => updateFormData('proposal', { paymentTerms: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-lg text-sm h-24 focus:border-petroleum/60 focus:ring-0 outline-none"
                            placeholder="Ex: 30% sinal + 70% na entrega..."
                        />
                    </div>
                </div>
            </div>

            {/* Right: Document Preview */}
            <div className="bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex flex-col h-[600px] lg:h-auto shadow-inner">
                <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pré-visualização do PDF</span>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                {previewLoading ? (
                    <div className="flex items-center justify-center flex-1">
                        <div className="animate-pulse text-slate-400 text-sm">Gerando documento...</div>
                    </div>
                ) : htmlContent ? (
                    <iframe
                        srcDoc={htmlContent}
                        className="w-full flex-1 border-0"
                        title="Preview"
                    />
                ) : (
                    <div className="flex items-center justify-center flex-1 text-slate-400 text-sm">
                        Aguardando dados...
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepFinancials;
