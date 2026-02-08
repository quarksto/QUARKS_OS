import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { Plus, Search, Filter, Package, Tag, DollarSign, PenTool, Trash2 } from 'lucide-react';

const PRODUCT_TYPES = {
    MODULE: 'Módulo',
    INVERTER: 'Inversor',
    STRUCTURE: 'Estrutura',
    CABLE: 'Cabos',
    OTHER: 'Outros'
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        type: 'MODULE',
        costPrice: '',
        supplier: '',
        description: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/inventory/products');
            setProducts(res.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory/products', formData);
            setShowModal(false);
            loadProducts();
            setFormData({ name: '', sku: '', type: 'MODULE', costPrice: '', supplier: '', description: '' });
        } catch (error) {
            alert('Erro ao salvar produto: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            await api.delete(`/inventory/products/${id}`);
            loadProducts();
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardShell>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="ds-display-l text-petroleum mb-1">Produtos</h1>
                    <p className="ds-body-m text-slate-500">Catálogo de módulos, inversores e equipamentos.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="ds-button-primary bg-solar hover:bg-solar-600 text-white flex items-center gap-2"
                >
                    <Plus size={18} />
                    Novo Produto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou SKU..."
                            className="ds-input pl-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Nome / SKU</th>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Tipo</th>
                                <th className="text-left py-3 px-4 ds-label text-slate-500">Fornecedor</th>
                                <th className="text-right py-3 px-4 ds-label text-slate-500">Custo (R$)</th>
                                <th className="text-right py-3 px-4 ds-label text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-petroleum">{product.name}</div>
                                        <div className="text-xs text-slate-400 font-mono">{product.sku}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="ds-badge bg-slate-100 text-slate-600">
                                            {PRODUCT_TYPES[product.type] || product.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600 text-sm">
                                        {product.supplier || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                                        R$ {product.costPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-slate-400">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Modal for MVP */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="ds-title-card mb-4">Novo Produto</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="ds-label mb-1 block">Nome</label>
                                <input
                                    required
                                    className="ds-input w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ds-label mb-1 block">SKU</label>
                                    <input
                                        required
                                        className="ds-input w-full"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="ds-label mb-1 block">Tipo</label>
                                    <select
                                        className="ds-input w-full"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        {Object.entries(PRODUCT_TYPES).map(([k, v]) => (
                                            <option key={k} value={k}>{v}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="ds-label mb-1 block">Custo (R$)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="ds-input w-full"
                                        value={formData.costPrice}
                                        onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="ds-label mb-1 block">Fornecedor</label>
                                    <input
                                        className="ds-input w-full"
                                        value={formData.supplier}
                                        onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="ds-button-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="ds-button-primary bg-solar text-white"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardShell>
    );
};

export default ProductsPage;
