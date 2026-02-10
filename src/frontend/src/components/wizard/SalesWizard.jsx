import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';

// Steps imports
import StepConsumption from './steps/StepConsumption';
import StepRoof from './steps/StepRoof';
import StepKit from './steps/StepKit';
import StepFinancials from './steps/StepFinancials';

const steps = [
    { id: 'consumption', title: 'Consumo' },
    { id: 'roof', title: 'Telhado & Local' },
    { id: 'kit', title: 'Equipamentos' },
    { id: 'financials', title: 'Revisão & Preço' }
];

const SalesWizard = ({ lead, availableKits, onSave, loadingResult }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        energy: {
            consumption: 0,
            distributor: '',
            averageBill: 0,
            tariffRate: 0
        },
        location: {
            address: '',
            coordinates: null,
            city: '',
            state: ''
        },
        roof: {
            type: 'CERAMIC',
            orientation: 'NORTH',
            area: 0,
            pitch: 0
        },
        kit: {
            type: 'PRESET', // PRESET | CUSTOM
            selectedKitId: null,
            custom: {
                modules: 0,
                power: 0,
                inverter: '',
                brand: ''
            }
        },
        financials: {
            pricingBreakdown: null,
            discount: 0,
            markup: 0
        },
        proposal: {
            title: '',
            introduction: '',
            notes: '',
            paymentTerms: ''
        },
        customer: {
            name: '',
            email: '',
            phone: ''
        }
    });

    // Initialize lead data
    useEffect(() => {
        if (!lead) return;

        const timer = setTimeout(() => {
            setFormData(prev => {
                // Only update if names changed to avoid loops/cascades
                if (prev.customer.name === lead.name && prev.customer.email === lead.email) return prev;

                return {
                    ...prev,
                    customer: {
                        name: lead.name || '',
                        email: lead.email || '',
                        phone: lead.phone || ''
                    },
                    location: {
                        ...prev.location,
                        address: lead.address || ''
                    }
                };
            });
        }, 0);

        return () => clearTimeout(timer);
    }, [lead]);

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data
            }
        }));
    };

    const setFullFormData = (newDataFn) => {
        setFormData(newDataFn);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <StepConsumption
                        data={formData}
                        updateFormData={updateFormData}
                        lead={lead}
                    />
                );
            case 1:
                return (
                    <StepRoof
                        data={formData}
                        updateFormData={updateFormData}
                    />
                );
            case 2:
                return (
                    <StepKit
                        initialData={formData}
                        setFormData={setFullFormData}
                        availableKits={availableKits}
                    />
                );
            case 3:
                return (
                    <StepFinancials
                        data={formData}
                        updateFormData={updateFormData}
                        availableKits={availableKits}
                        onSave={onSave}
                        loading={loadingResult}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
            {/* Header / Progress */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-lg text-petroleum-800">
                        {steps[currentStep].title}
                    </h2>
                    <span className="text-sm font-medium text-slate-500">
                        Passo {currentStep + 1} de {steps.length}
                    </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-solar transition-all duration-300 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {renderStep()}
            </div>

            {/* Footer / Navigation */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    <ChevronLeft size={20} />
                    Voltar
                </button>

                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2 bg-petroleum-600 hover:bg-petroleum-700 text-white rounded-lg shadow-sm transition-all font-bold group"
                    >
                        Próximo
                        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                ) : (
                    <button
                        onClick={() => onSave(formData)}
                        disabled={loadingResult}
                        className="flex items-center gap-2 px-6 py-2 bg-solar hover:bg-amber-600 text-slate-900 rounded-lg shadow-sm transition-all font-bold disabled:opacity-50"
                    >
                        {loadingResult ? (
                            <span className="animate-pulse">Salvando...</span>
                        ) : (
                            <>
                                <Check size={20} />
                                Publicar Proposta
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SalesWizard;
