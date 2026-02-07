import React, { useState, useEffect } from 'react';
import { useCopilot } from '../../context/CopilotContext';
import api from '../../services/api';
import { StandardAvatar } from '../ui/StandardAvatar';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdEdit, MdClose, MdEmail, MdBolt, MdAccountBalanceWallet, MdCalendarToday, MdChevronRight, MdDescription, MdPhone } from 'react-icons/md';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa6';

const STATUS_CONFIG = {
    NEW: { label: 'Triagem', color: 'border-blue-200 text-blue-600' },
    CONTACTED: { label: 'Qualificação', color: 'border-amber-200 text-amber-600' },
    PROPOSAL_SENT: { label: 'Proposta', color: 'border-cyan-200 text-cyan-600' },
    NEGOTIATION: { label: 'Negociação', color: 'border-orange-200 text-orange-600' },
    CLOSED_WON: { label: 'Vendido', color: 'border-emerald-200 text-emerald-600' },
    CLOSED_LOST: { label: 'Perdido', color: 'border-slate-200 text-slate-400' },
};

export const LeadDetailModal = ({ isOpen, onClose, lead: initialLead }) => {
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setContext, triggerAction, openSidebar } = useCopilot();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen || !initialLead?.id) return;
        setLoading(true);
        setLead(initialLead);
        // Optimistic load, then fetch detailed
        api.get(`/leads/${initialLead.id}`)
            .then(res => setLead(res.data))
            .finally(() => setLoading(false));
    }, [isOpen, initialLead]);

    if (!isOpen || !lead) return null;

    const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    const handleCreateProposal = () => {
        // Logic to create proposal
        navigate(`/proposals/new?leadId=${lead.id}`);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/60 transition-opacity">
            <div className="bg-white w-full max-w-[1000px] h-[90vh] max-h-[800px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fadeInScale">

                {/* Header (Stitch ID 74b4b... Strict Mode) */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <StandardAvatar
                            name={lead.name}
                            src={lead.avatar_url || lead.avatar || lead.avatarUrl}
                            size="lg"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">{lead.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 border rounded-lg ${statusStyle.color}`}>
                                    {statusStyle.label}
                                </span>
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <MdLocationOn size={14} />
                                    {lead.location || 'Local desconhecido'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                            <MdEdit size={18} />
                        </button>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                            <MdClose size={18} />
                        </button>
                    </div>
                </header>
                {/* Conteúdo - Grid de 2 Colunas */}
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* COLUNA ESQUERDA: Dados */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mb-4">Informações de Contato</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <FaEnvelope size={18} className="text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                                        <p className="text-slate-900 font-medium">{lead.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <FaWhatsapp size={18} className="text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Celular / WhatsApp</p>
                                        <p className="text-slate-900 font-medium">{lead.phone || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mb-4">Dados Solares</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdBolt size={20} className="text-amber-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Consumo</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{lead.consumption || 0} kWh</p>
                                </div>
                                <div className="p-4 rounded-lg border border-slate-200 bg-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MdAccountBalanceWallet size={20} className="text-blue-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Fatura Anual Est.</span>
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{formatCurrency((lead.consumption || 0) * 0.95 * 12)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Histórico */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mb-4">Linha do Tempo</h3>
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
                                {(lead.activity || []).slice(0, 3).map((act, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-white bg-slate-300"></div>
                                        <p className="text-xs text-slate-400 mb-0.5">{new Date(act.timestamp || Date.now()).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-sm font-medium text-slate-800">{act.description || 'Atividade registrada'}</p>
                                    </div>
                                ))}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500 shadow-sm"></div>
                                    <p className="text-xs text-slate-400 mb-0.5">Hoje</p>
                                    <p className="text-sm font-bold text-slate-900">Lead visualizado no Pipeline</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.1em] mb-4">Próximas Tarefas</h3>
                            {/* Placeholder task */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                                <MdCalendarToday size={18} className="text-slate-400" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">Ligação de Follow-up</p>
                                    <p className="text-xs text-slate-500">Amanhã • 10:00</p>
                                </div>
                                <MdChevronRight size={18} className="text-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                    <button onClick={onClose} className="px-6 h-11 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors uppercase tracking-wider">
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreateProposal}
                        className="px-8 h-11 bg-solar-500 hover:bg-solar-600 text-white text-[11px] font-bold rounded-lg shadow-sm hover:shadow flex items-center gap-2 transition-all uppercase tracking-wider"
                    >
                        <MdDescription size={18} />
                        Gerar Proposta
                    </button>
                </footer>
            </div>
        </div>
    );
};
