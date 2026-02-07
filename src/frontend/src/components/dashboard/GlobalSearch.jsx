import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export function GlobalSearch({ open, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ leads: [], proposals: [] });
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const runSearch = useCallback(async (q) => {
        if (!q.trim()) {
            setResults({ leads: [], proposals: [] });
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/search?q=${encodeURIComponent(q.trim())}&limit=8`);
            setResults(res.data || { leads: [], proposals: [] });
            setSelected(0);
        } catch (e) {
            setResults({ leads: [], proposals: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => runSearch(query), 200);
        return () => clearTimeout(t);
    }, [query, runSearch]);

    const items = [
        ...(results.leads || []).map((l) => ({ type: 'lead', id: l.id, title: l.name, subtitle: l.email || l.status })),
        ...(results.proposals || []).map((p) => ({ type: 'proposal', id: p.id, title: p.title || 'Proposta', subtitle: p.lead?.name || `R$ ${(p.totalPrice || 0).toLocaleString('pt-BR')}` }))
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelected((s) => Math.min(s + 1, items.length - 1));
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelected((s) => Math.max(s - 1, 0));
            return;
        }
        if (e.key === 'Enter' && items[selected]) {
            e.preventDefault();
            const it = items[selected];
            if (it.type === 'lead') navigate(`/leads/${it.id}`);
            else navigate(`/proposals/${it.id}`);
            onClose();
        }
    };

    useEffect(() => {
        if (!open) return;
        setQuery('');
        setResults({ leads: [], proposals: [] });
        setSelected(0);
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-label="Busca global"
        >
            <div
                className="technical-card w-full max-w-xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
                    <span className="material-symbols-outlined text-slate-400">search</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar leads e propostas..."
                        className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 ds-body"
                        autoFocus
                    />
                    <span className="ds-meta text-slate-400">⌘K</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                    {loading && (
                        <div className="px-4 py-6 text-center text-slate-500 ds-body">Buscando...</div>
                    )}
                    {!loading && items.length === 0 && query.trim() && (
                        <div className="px-4 py-6 text-center text-slate-500 ds-body">Nenhum resultado.</div>
                    )}
                    {!loading && items.length > 0 && (
                        <ul className="py-2">
                            {items.map((it, i) => (
                                <li key={`${it.type}-${it.id}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (it.type === 'lead') navigate(`/leads/${it.id}`);
                                            else navigate(`/proposals/${it.id}`);
                                            onClose();
                                        }}
                                        onMouseEnter={() => setSelected(i)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selected ? 'bg-petroleum/10 text-petroleum-800' : 'hover:bg-slate-50 text-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>
                                            {it.type === 'lead' ? 'person' : 'description'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{it.title}</div>
                                            <div className="text-xs text-slate-500 truncate">{it.subtitle}</div>
                                        </div>
                                        <span className="text-xs text-slate-400">{it.type === 'lead' ? 'Lead' : 'Proposta'}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export function useGlobalSearchHotkey(onOpen) {
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onOpen();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onOpen]);
}
