import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useCopilot } from '../context/CopilotContext';
import api from '../services/api';

const DISTRIBUTORS = [
    { value: 'CPFL_PAULISTA', label: 'CPFL Paulista' },
    { value: 'ENEL_SP', label: 'Enel SP' },
    { value: 'CEMIG', label: 'Cemig' },
    { value: 'LIGHT', label: 'Light' },
    { value: 'NEOENERGIA_PE', label: 'Neoenergia PE' }
];

const STATES = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

export default function DimensionamentoPage() {
    const [consumption, setConsumption] = useState('');
    const [distributor, setDistributor] = useState('CEMIG');
    const [state, setState] = useState('SP');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { openSidebar, sendMessage } = useCopilot();

    const handleCalculate = async (e) => {
        e.preventDefault();
        const kWh = parseFloat(consumption);
        if (!consumption || isNaN(kWh) || kWh <= 0) {
            setError('Informe o consumo médio em kWh.');
            return;
        }
        setError(null);
        setResult(null);
        setLoading(true);
        try {
            const res = await api.post('/dimensionamento', { consumption: kWh, distributor, state });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Erro ao calcular dimensionamento.');
        } finally {
            setLoading(false);
        }
    };

    const askCopilot = () => {
        openSidebar?.();
        const msg = result
            ? `Para consumo de ${result.consumption} kWh e distribuidora ${result.distributor}, o dimensionamento indica ${result.systemSizeKwp} kWp com payback de ${result.paybackYears} anos. Pode explicar melhor e sugerir próximos passos?`
            : `Preciso dimensionar um sistema solar. Consumo médio: ${consumption || '?'} kWh. Distribuidora: ${distributor}. Estado: ${state}. Pode ajudar?`;
        setTimeout(() => sendMessage(msg), 300);
    };

    const fmt = (v) => (v != null ? Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '-');
    const fmtCurrency = (v) => (v != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v) : '-');

    return (
        <DashboardShell
            title="Dimensionamento IA"
            subtitle="Cálculo Automático de Sistemas"
            headerIcon="psychology"
        >
            <div className="p-8 max-w-[900px] mx-auto h-full overflow-y-auto">
                <h2 className="ds-title-section">Dimensionamento Solar</h2>
                <p className="ds-body mt-1 text-slate-600">Informe consumo e distribuidora para calcular tamanho do sistema, payback e economia.</p>

                <form onSubmit={handleCalculate} className="mt-6 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Consumo médio (kWh/mês)</label>
                        <input
                            type="number"
                            min="50"
                            max="5000"
                            step="10"
                            value={consumption}
                            onChange={(e) => setConsumption(e.target.value)}
                            placeholder="Ex: 350"
                            className="w-40 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-petroleum/30 focus:border-petroleum"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Distribuidora</label>
                        <select
                            value={distributor}
                            onChange={(e) => setDistributor(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-petroleum/30 focus:border-petroleum"
                        >
                            {DISTRIBUTORS.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-petroleum/30 focus:border-petroleum"
                        >
                            {STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-petroleum text-white rounded-lg hover:bg-petroleum-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Calculando...' : 'Calcular'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="mt-8 technical-card p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Resultado do dimensionamento</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Potência (kWp)</span>
                                <p className="ds-display-s text-petroleum font-semibold">{fmt(result.systemSizeKwp)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Painéis</span>
                                <p className="ds-display-s text-slate-800">{fmt(result.panelsCount)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Área (m²)</span>
                                <p className="ds-display-s text-slate-800">{fmt(result.areaRequired)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Investimento</span>
                                <p className="ds-display-s text-slate-800">{fmtCurrency(result.totalPrice)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Economia/mês</span>
                                <p className="ds-display-s text-emerald-600">{fmtCurrency(result.monthlySavings)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase tracking-wide">Payback</span>
                                <p className="ds-display-s text-slate-800">{fmt(result.paybackYears)} anos</p>
                            </div>
                        </div>
                        {result.kitName && <p className="mt-2 text-sm text-slate-600">Kit sugerido: {result.kitName}</p>}
                        <button
                            type="button"
                            onClick={askCopilot}
                            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                        >
                            Perguntar ao Copilot
                        </button>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
