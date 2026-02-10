import React from 'react';
import { DollarSign, Package, Wrench, Percent } from 'lucide-react';

export const PricingBreakdown = ({ breakdown, totalPrice, baseCost, margin, taxRate }) => {
    if (!breakdown) return null;

    const formatCurrency = (val) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Package size={16} />
                        <span className="text-sm font-medium">Equipamentos</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(breakdown.hardware)}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Wrench size={16} />
                        <span className="text-sm font-medium">Serviços</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(breakdown.services)}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <DollarSign size={16} />
                        <span className="text-sm font-medium">Impostos Estimados</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(breakdown.estimatedTaxes)}</p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <Percent size={16} />
                        <span className="text-sm font-medium">Margem Estimada</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-700">{formatCurrency(breakdown.grossMargin)}</p>
                    <p className="text-xs text-emerald-600 mt-1">Margem configurada: {(margin * 100).toFixed(1)}%</p>
                </div>
            </div>

            <div className="p-6 bg-petroleum text-white rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm font-medium opacity-80 uppercase tracking-wider mb-2">Preço Final Sugerido</span>
                <p className="text-4xl font-black">{formatCurrency(totalPrice)}</p>
            </div>
        </div>
    );
};

export default PricingBreakdown;
