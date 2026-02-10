import React, { useState, useEffect } from 'react';
import { MdTextFormat, MdSearch, MdClose } from 'react-icons/md';
import api from '../../services/api';

const TemplateSelector = ({ onSelect, onClose }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/templates');
                setTemplates(res.data);
            } catch (err) {
                console.error('Failed to fetch templates:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="absolute bottom-full mb-2 right-0 w-80 bg-white border border-slate-200 rounded-lg shadow-sm z-50 overflow-hidden animate-slideUp">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                    <MdTextFormat className="text-petroleum" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Templates</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <MdClose size={18} />
                </button>
            </div>

            <div className="p-2">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-xs focus:border-petroleum/60 focus:ring-0 outline-none"
                    />
                </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-2 flex flex-col gap-1">
                {loading ? (
                    <div className="p-4 text-center text-xs text-slate-400">Carregando...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">Nenhum template encontrado</div>
                ) : (
                    filtered.map(template => (
                        <button
                            key={template.id}
                            onClick={() => {
                                onSelect(template);
                                api.post(`/templates/${template.id}/use`).catch(() => { });
                            }}
                            className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors group border border-transparent hover:border-slate-100"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-semibold text-slate-700">{template.name}</span>
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{template.category}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {template.content}
                            </p>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default TemplateSelector;
