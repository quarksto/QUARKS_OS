import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Plus, Trash2, X, Package, Search } from 'lucide-react';

const KitsPage = () => {
    const [kits, setKits] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedKit, setSelectedKit] = useState(null);

    // Form Stats
    const [kitForm, setKitForm] = useState({ name: '', description: '', items: [] });
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedQty, setSelectedQty] = useState(1);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [kitsRes, prodsRes] = await Promise.all([
                api.get('/inventory/kits'),
                api.get('/inventory/products?active=true')
            ]);
            setKits(kitsRes.data);
            setProducts(prodsRes.data);
        } catch (e) {
            setError(e.response?.data?.error || e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        if (!selectedProduct) return;
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        const existing = kitForm.items.find(i => i.productId === selectedProduct);
        if (existing) {
            setKitForm({
                ...kitForm,
                items: kitForm.items.map(i => i.productId === selectedProduct ? { ...i, quantity: i.quantity + parseInt(selectedQty) } : i)
            });
        } else {
            setKitForm({
                ...kitForm,
                items: [...kitForm.items, { productId: selectedProduct, quantity: parseInt(selectedQty), product }]
            });
        }
        setSelectedProduct('');
        setSelectedQty(1);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...kitForm.items];
        newItems.splice(index, 1);
        setKitForm({ ...kitForm, items: newItems });
    };

    const handleSaveKit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory/kits', {
                name: kitForm.name,
                description: kitForm.description,
                items: kitForm.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
            });
            setShowCreateModal(false);
            setKitForm({ name: '', description: '', items: [] });
            loadData();
        } catch (e) {
            alert('Erro ao criar kit: ' + e.message);
        }
    };

    const calculateFormCost = () => {
        return kitForm.items.reduce((sum, item) => {
            const p = products.find(prod => prod.id === item.productId) || item.product;
            return sum + ((p?.costPrice || 0) * item.quantity);
        }, 0);
    };

    const calculateKitCost = (kit) => {
        if (!kit.items) return 0;
        return kit.items.reduce((sum, item) => {
            return sum + ((item.product?.costPrice || 0) * item.quantity);
        }, 0);
    };

    return (
        <DashboardShell>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="ds-display-l text-petroleum mb-1">Kits Fotovoltaicos</h1>
                    <p className="ds-body-m text-slate-500">Gerencie conjuntos de equipamentos.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="ds-button-primary bg-solar hover:bg-amber-600 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Novo Kit
                </button>
            </div>

            {loading && <p className="text-slate-500">Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && kits.length === 0 && (
                <div className="text-center p-12 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400">Nenhum kit cadastrado.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kits.map(kit => (
                    <div
                        key={kit.id}
                        onClick={() => setSelectedKit(kit)}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer hover:border-petroleum transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="ds-title-card text-petroleum group-hover:text-solar transition-colors">{kit.name}</h3>
                            <ProductCountBadge count={kit.items?.length || 0} />
                        </div>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{kit.description}</p>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs text-slate-400 uppercase font-semibold">Custo Estimado</span>
                            <div className="text-emerald-600 font-mono font-medium">
                                R$ {calculateKitCost(kit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-sm w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="ds-title-card">Novo Kit</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveKit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="ds-label mb-1 block">Nome do Kit</label>
                                    <input
                                        required
                                        className="ds-input w-full"
                                        value={kitForm.name}
                                        onChange={e => setKitForm({ ...kitForm, name: e.target.value })}
                                        placeholder="Ex: Kit 5kWp - Inversor X + 10 Painéis Y"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="ds-label mb-1 block">Descrição</label>
                                    <textarea
                                        className="ds-input w-full"
                                        rows="2"
                                        value={kitForm.description}
                                        onChange={e => setKitForm({ ...kitForm, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Item Selection */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h3 className="text-sm font-semibold text-petroleum mb-3 flex items-center gap-2">
                                    <Package size={16} /> Adicionar Produtos
                                </h3>
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Produto</label>
                                        <select
                                            className="ds-input w-full text-sm"
                                            value={selectedProduct}
                                            onChange={e => setSelectedProduct(e.target.value)}
                                        >
                                            <option value="">Selecione um produto...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.sku}) - R$ {p.costPrice}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs text-slate-500 mb-1 block">Qtd</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="ds-input w-full text-sm"
                                            value={selectedQty}
                                            onChange={e => setSelectedQty(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        disabled={!selectedProduct}
                                        className="ds-button-primary bg-solar text-white h-[42px] aspect-square flex items-center justify-center disabled:opacity-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Item List */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-600 mb-2">Itens Selecionados ({kitForm.items.length})</h4>
                                {kitForm.items.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">Nenhum item adicionado.</p>
                                ) : (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Produto</th>
                                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Qtd</th>
                                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Subtotal</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {kitForm.items.map((item, idx) => {
                                                    const prod = products.find(p => p.id === item.productId) || item.product;
                                                    const subtotal = (prod?.costPrice || 0) * item.quantity;
                                                    return (
                                                        <tr key={idx}>
                                                            <td className="py-2 px-3 text-slate-700">{prod?.name}</td>
                                                            <td className="py-2 px-3 text-center font-mono">{item.quantity}</td>
                                                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                                                                R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                            <td className="py-2 px-3 text-right">
                                                                <button type="button" onClick={() => handleRemoveItem(idx)} className="text-slate-400 hover:text-red-500">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="bg-slate-50 font-semibold text-slate-700">
                                                <tr>
                                                    <td colSpan="2" className="py-2 px-3 text-right">Total Estimado:</td>
                                                    <td className="py-2 px-3 text-right font-mono text-emerald-700">
                                                        R$ {calculateFormCost().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="ds-button-secondary">Cancelar</button>
                                <button type="submit" className="ds-button-primary bg-solar text-white px-6">Criar Kit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedKit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-sm w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="ds-title-card pr-8">{selectedKit.name}</h2>
                            <button onClick={() => setSelectedKit(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <p className="ds-body text-slate-600 mb-6">{selectedKit.description || 'Sem descrição.'}</p>

                        <h3 className="font-semibold text-petroleum mb-3">Composição</h3>
                        <div className="space-y-3 mb-6">
                            {selectedKit.items && selectedKit.items.length > 0 ? (
                                selectedKit.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-700 text-sm">{item.product?.name}</p>
                                            <p className="text-xs text-slate-500">{item.product?.sku}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm bg-white px-2 py-1 rounded border border-slate-200 font-mono">
                                                {item.quantity} un
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">Este kit não possui itens.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500">Custo Total Componentes</span>
                            <span className="text-lg font-bold text-emerald-600 font-mono">
                                R$ {calculateKitCost(selectedKit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </DashboardShell>
    );
};

function ProductCountBadge({ count }) {
    return (
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-full border border-slate-200">
            {count} {count === 1 ? 'item' : 'itens'}
        </span>
    );
}

export default KitsPage;
