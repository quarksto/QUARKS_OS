import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadListTableRefactored } from './LeadListTableRefactored';
import api from '../../services/api';
import { StandardAvatar } from '../ui/StandardAvatar';
import { FaWhatsapp, FaGoogle, FaFacebookF, FaInstagram, FaLinkedinIn, FaGlobe, FaBuilding, FaBolt } from 'react-icons/fa6';
import { MdOutlineMoreVert, MdLocationOn, MdFactory, MdBolt, MdHistory, MdCalendarToday, MdArchive, MdVisibility, MdSwapHoriz, MdSolarPower, MdChevronRight, MdCheck, MdAdd, MdSettings, MdViewKanban, MdTableRows } from 'react-icons/md';

import {
    formatCurrencyCompact,
    getLeadPotential,
    getLeadScore,
    getTemperature,
    getSourceLabel,
    getNextAction,
    getDaysInStage,
} from '../../utils/pipeline';

// ----------------------------------------------------------------------
// Configuration & Helpers
// ----------------------------------------------------------------------

const SALES_FUNNEL = {
    id: 'sales_default',
    name: 'Funil de Vendas',
    icon: MdSolarPower,
    columns: [
        { title: 'Novos Leads', id: 'NEW', color: 'blue', accent: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-100' },
        { title: 'Qualificação', id: 'CONTACTED', color: 'yellow', accent: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-100' },
        { title: 'Proposta', id: 'PROPOSAL_SENT', color: 'cyan', accent: 'bg-cyan-500', text: 'text-cyan-700', bg: 'bg-cyan-100' },
        { title: 'Negociação', id: 'NEGOTIATION', color: 'orange', accent: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100' },
        { title: 'Fechados', id: 'CLOSED_WON', color: 'emerald', accent: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100' },
        { title: 'Perdidos', id: 'CLOSED_LOST', color: 'slate', accent: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100' },
    ]
};

const PARTNERSHIP_FUNNEL = {
    id: 'partnerships',
    name: 'Funil de Parcerias',
    icon: MdSwapHoriz,
    columns: [
        { title: 'Novos Parceiros', id: 'NEW_PARTNER', color: 'indigo', accent: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-100' },
        { title: 'Reunião Agendada', id: 'MEETING_SCHEDULED', color: 'blue', accent: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-100' },
        { title: 'Em Análise', id: 'UNDER_REVIEW', color: 'amber', accent: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-100' },
        { title: 'Contrato Enviado', id: 'CONTRACT_SENT', color: 'cyan', accent: 'bg-cyan-500', text: 'text-cyan-700', bg: 'bg-cyan-100' },
        { title: 'Parceria Ativa', id: 'ACTIVE_PARTNER', color: 'emerald', accent: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100' },
    ]
};

const INITIAL_FUNNELS = [SALES_FUNNEL, PARTNERSHIP_FUNNEL];

const getColumnTotal = (leads) => {
    return leads.reduce((sum, lead) => sum + getLeadPotential(lead), 0);
};

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

const KanbanCard = ({ lead, onClick, onDragStart, isDragError, activeMenuId, onToggleMenu }) => {
    const potential = getLeadPotential(lead);
    const score = getLeadScore(lead);
    const temperature = getTemperature(lead);
    const nextAction = getNextAction(lead);
    const isMenuOpen = activeMenuId === lead.id;

    const segment = lead.segment || 'Residencial';
    const consumption = lead.consumption ? `${lead.consumption}kWh` : 'N/A';
    const address = lead.location || lead.city || 'Local não inf.';
    const distributor = lead.distributor || 'Distribuidora N/A';
    const captureMethod = lead.origin || 'Inbound';
    const daysInStage = getDaysInStage(lead);
    const avatarSrc = lead.avatar_url || lead.avatar || null;
    const channel = lead.phone ? 'whatsapp' : (lead.email ? 'email' : null);


    const handleAction = (e, type) => {
        e.stopPropagation();
        if (type === 'whatsapp') window.open(`https://wa.me/?text=Olá ${lead.name}`, '_blank');
        if (type === 'email') window.location.href = `mailto:${lead.email}`;
        if (type === 'more') onToggleMenu(lead.id);
    };

    const handleMenuAction = (e, action) => {
        e.stopPropagation();
        onToggleMenu(null);
        if (action === 'edit') onClick(lead);
    };

    // Helper for Origin Icon
    const getOriginIcon = (origin) => {
        const o = origin?.toLowerCase() || '';
        if (o.includes('google')) return <FaGoogle size={14} className="text-slate-500" />;
        if (o.includes('facebook')) return <FaFacebookF size={14} className="text-blue-600" />;
        if (o.includes('instagram')) return <FaInstagram size={14} className="text-pink-600" />;
        if (o.includes('linkedin')) return <FaLinkedinIn size={14} className="text-blue-700" />;
        return <FaGlobe size={14} className="text-slate-400" />;
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead, lead.status)}
            onClick={() => onClick(lead)}
            className={`technical-card p-3 rounded-xl border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md group relative overflow-visible active:cursor-grabbing transition-all duration-200 ${isDragError ? 'border-red-400 ring-4 ring-red-50 animate-shake' : ''} ${isMenuOpen ? 'z-40 ring-1 ring-slate-200 shadow-xl' : ''}`}
        >
            {/* 1. Header: Avatar & Primary Metadata */}
            <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex gap-3 flex-1 min-w-0">
                    <StandardAvatar
                        name={lead.name}
                        src={avatarSrc}
                        size="md"
                        channel={channel}
                        className="bg-slate-50 border-slate-100 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0 pt-0.5">
                        <h4 className="ds-title text-slate-900 font-bold truncate group-hover:text-amber-600 transition-colors leading-tight mb-0.5">
                            {lead.name}
                        </h4>
                        <div className="flex items-center gap-1.5 ds-meta text-slate-400 truncate font-semibold">
                            <MdLocationOn size={14} className="shrink-0 opacity-40" />
                            <span className="truncate">{address}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Menu */}
                <div className={`flex items-center gap-0.5 shrink-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    <button
                        onClick={(e) => handleAction(e, 'whatsapp')}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                        title="WhatsApp"
                    >
                        <FaWhatsapp size={18} />
                    </button>
                    <div className="relative">
                        <button
                            onClick={(e) => handleAction(e, 'more')}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isMenuOpen ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            <MdOutlineMoreVert size={20} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 z-[100] animate-fadeIn origin-top-right overflow-hidden">
                                <button onClick={(e) => handleMenuAction(e, 'edit')} className="w-full text-left px-4 py-3 ds-body hover:bg-slate-50 hover:text-amber-600 flex items-center gap-3 transition-colors">
                                    <MdVisibility size={18} className="opacity-40 text-slate-400" />
                                    <span className="font-medium">Detalhes do Lead</span>
                                </button>
                                <button onClick={(e) => handleMenuAction(e, 'move')} className="w-full text-left px-4 py-3 ds-body hover:bg-slate-50 hover:text-amber-600 flex items-center gap-3 transition-colors">
                                    <MdSwapHoriz size={18} className="opacity-40 text-slate-400" />
                                    <span className="font-medium">Mover Funil</span>
                                </button>
                                <div className="border-t border-slate-50 my-1 mx-2"></div>
                                <button onClick={(e) => handleMenuAction(e, 'archive')} className="w-full text-left px-4 py-3 ds-body text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors font-bold">
                                    <MdArchive size={18} />
                                    <span>Arquivar Lead</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Secondary Context: Technical Details */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex flex-col gap-1 min-w-0 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                    <span className="ds-label uppercase tracking-[0.1em] text-[8.5px] font-black opacity-40">Distribuidora</span>
                    <div className="flex items-center gap-2 ds-data text-slate-700 truncate font-bold">
                        <MdFactory size={16} className="text-slate-300" />
                        <span className="truncate">{distributor}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1 min-w-0 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                    <span className="ds-label uppercase tracking-[0.1em] text-[8.5px] font-black opacity-40">Consumo Médio</span>
                    <div className="flex items-center gap-2 ds-data text-slate-700 truncate font-bold">
                        <MdBolt size={16} className="text-slate-300" />
                        <span className="truncate">{consumption}</span>
                    </div>
                </div>
            </div>

            {/* 3. Indicators: Badges & Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <div className={`badge-kanban !rounded-full px-3 gap-2 py-1 border transition-colors bg-white ${temperature.label === 'Quente' ? 'border-rose-200 text-rose-600' :
                    temperature.label === 'Morno' ? 'border-amber-200 text-amber-600' :
                        'border-slate-200 text-slate-500'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${temperature.label === 'Quente' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' :
                        temperature.label === 'Morno' ? 'bg-amber-500' :
                            'bg-slate-400'
                        }`} />
                    <span className="font-black tracking-widest">{temperature.label}</span>
                </div>
                <div className="badge-kanban-origin !rounded-full px-3 gap-2 py-1 border border-slate-200 bg-white text-slate-600 flex items-center">
                    {getOriginIcon(captureMethod)}
                    <span className="font-bold tracking-tight">{captureMethod}</span>
                </div>
            </div>

            {/* 4. IA Engine Results: Score & Potential */}
            <div className="bg-slate-50/50 border border-slate-100/50 rounded-xl p-3 flex items-center justify-between gap-4 mb-3">
                <div className="flex flex-col gap-0.5">
                    <span className="ds-label uppercase text-[9px] font-black opacity-40 tracking-wider">IA Score</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className={`ds-title !text-xl font-black tabular-nums transition-colors ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {score}
                        </span>
                        <span className="ds-meta text-[10px] opacity-30 font-bold">PTS</span>
                    </div>
                </div>
                <div className="h-8 w-px bg-slate-200/60"></div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className="ds-label uppercase text-[9px] font-black opacity-40 tracking-wider">Potencial</span>
                    <span className="ds-data !text-[17px] font-black text-slate-900 tracking-tight tabular-nums">
                        {formatCurrencyCompact(potential)}
                    </span>
                </div>
            </div>

            {/* 5. Persistence: Tasks & Aging */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                <div className="flex items-center gap-2 text-slate-400 group/footer min-w-0 max-w-[75%]">
                    <MdCalendarToday size={16} className={`transition-colors ${nextAction.icon === 'priority_high' ? 'text-rose-500' : 'group-hover/footer:text-slate-600'}`} />
                    <span className="ds-meta font-black truncate group-hover/footer:text-slate-600 transition-colors uppercase tracking-widest text-[9.5px]">
                        {nextAction.label || 'Nenhuma Agenda'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 ds-meta font-black text-slate-400 tabular-nums px-2 py-0.5 bg-slate-50/50 rounded border border-slate-100/50" title="Tempo nesta etapa">
                    <MdHistory size={14} className="opacity-40" />
                    <span>{daysInStage}D</span>
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const KanbanBoard = ({
    pipeline = {},
    onPipelineChange,
    filters = {},
    searchTerm = '',
    onSearchChange,
    view = 'board',
    onChangeView,
    onLeadClick,
}) => {
    const navigate = useNavigate();
    const [localPipeline, setLocalPipeline] = useState(pipeline);
    const [allFunnels, setAllFunnels] = useState(INITIAL_FUNNELS);
    const [currentFunnelId, setCurrentFunnelId] = useState(SALES_FUNNEL.id);
    const [isFunnelSelectOpen, setIsFunnelSelectOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeMenuLeadId, setActiveMenuLeadId] = useState(null);
    const [prevPipeline, setPrevPipeline] = useState(pipeline);
    const [dragOverColId, setDragOverColId] = useState(null);
    const [dragErrorLeadId, setDragErrorLeadId] = useState(null);

    const currentFunnel = useMemo(() => allFunnels.find(f => f.id === currentFunnelId) || allFunnels[0], [allFunnels, currentFunnelId]);
    const useExternalPipeline = typeof onPipelineChange === 'function';

    // Sync pipeline from props if changed (Render-time update pattern)
    if (!useExternalPipeline && pipeline !== prevPipeline) {
        setPrevPipeline(pipeline);
        setLocalPipeline(pipeline);
    }

    useEffect(() => {
        const handleClickOutside = () => { setActiveMenuLeadId(null); setIsFunnelSelectOpen(false); };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const pipelineData = useExternalPipeline ? pipeline : localPipeline;
    const columns = currentFunnel.columns;

    const updatePipeline = (next) => {
        const value = typeof next === 'function' ? next(pipelineData) : next;
        if (useExternalPipeline) onPipelineChange(value); else setLocalPipeline(value);
    };

    const handleCreateFunnel = () => {
        const name = prompt('Nome do novo funil:', 'Novo Funil');
        if (!name) return;
        const newFunnel = {
            id: `funnel_${Date.now()}`,
            name,
            icon: 'filter_alt',
            columns: [
                { title: 'Início', id: `start_${Date.now()}`, color: 'blue', accent: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-100' },
                { title: 'Em Progresso', id: `wip_${Date.now()}`, color: 'amber', accent: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-100' },
                { title: 'Concluído', id: `done_${Date.now()}`, color: 'emerald', accent: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100' }
            ]
        };
        setAllFunnels([...allFunnels, newFunnel]);
        setCurrentFunnelId(newFunnel.id);
        setIsEditMode(true);
        setIsFunnelSelectOpen(false);
    };

    const handleUpdateColumnTitle = (colId, newTitle) => {
        setAllFunnels(prev => prev.map(funnel => funnel.id === currentFunnelId ? { ...funnel, columns: funnel.columns.map(col => col.id === colId ? { ...col, title: newTitle } : col) } : funnel));
    };

    const handleAddColumn = () => {
        setAllFunnels(prev => prev.map(funnel => funnel.id === currentFunnelId ? { ...funnel, columns: [...funnel.columns, { title: 'Nova Coluna', id: `COL_${Date.now()}`, color: 'slate', accent: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100' }] } : funnel));
    };

    const handleDeleteColumn = (colId) => {
        if (window.confirm('Tem certeza que deseja excluir esta coluna?'))
            setAllFunnels(prev => prev.map(funnel => funnel.id === currentFunnelId ? { ...funnel, columns: funnel.columns.filter(col => col.id !== colId) } : funnel));
    };

    const handleCardClick = (lead) => onLeadClick ? onLeadClick(lead) : navigate(`/leads/${lead.id}`);
    const handleToggleMenu = (leadId) => setActiveMenuLeadId(prev => prev === leadId ? null : leadId);

    const passesFilters = (lead) => {
        if (searchTerm && !(lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || lead.email?.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
        const tempFilter = filters.temp ?? filters.temperature ?? [];
        if (tempFilter.length > 0 && !tempFilter.includes(getTemperature(lead).label.toLowerCase())) return false;
        if ((filters.source ?? '') !== '' && getSourceLabel(lead) !== filters.source) return false;
        const score = getLeadScore(lead);
        if (filters.scoreMin !== '' && score < Number(filters.scoreMin)) return false;
        if (filters.scoreMax !== '' && score > Number(filters.scoreMax)) return false;
        return true;
    };

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const filteredPipeline = useMemo(() => {
        const next = {};
        columns.forEach(col => next[col.id] = (pipelineData[col.id] || []).filter(passesFilters));
        return next;
    }, [pipelineData, columns, filters, searchTerm]);

    const flattenedRows = useMemo(() => columns.flatMap(col => (filteredPipeline[col.id] || []).map(lead => ({ ...lead, stage: col.id }))), [filteredPipeline, columns]);

    const handleDragStart = (e, lead, sourceColId) => {
        e.dataTransfer.setData('leadId', lead.id);
        e.dataTransfer.setData('sourceCol', sourceColId);
    };

    const handleDrop = (e, targetColId) => {
        e.preventDefault();
        setDragOverColId(null);
        const leadId = e.dataTransfer.getData('leadId');
        const sourceColId = e.dataTransfer.getData('sourceCol');
        if (sourceColId === targetColId) return;
        const sourceList = [...(pipelineData[sourceColId] || [])];
        const targetList = [...(pipelineData[targetColId] || [])];
        const leadIndex = sourceList.findIndex(l => String(l.id) === String(leadId));
        if (leadIndex === -1) return;
        const [lead] = sourceList.splice(leadIndex, 1);
        const nextPipeline = { ...pipelineData, [sourceColId]: sourceList, [targetColId]: [...targetList, { ...lead, status: targetColId }] };
        const prev = pipelineData;
        updatePipeline(nextPipeline);
        api.patch(`/leads/${leadId}/status`, { status: targetColId }).catch(() => { updatePipeline(prev); setDragErrorLeadId(leadId); setTimeout(() => setDragErrorLeadId(null), 1500); });
    };

    return (
        <div className="flex flex-col gap-4 h-full relative" onClick={e => e.stopPropagation()}>
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-1 border-b border-dashed border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setIsFunnelSelectOpen(!isFunnelSelectOpen); }} className="flex items-center gap-2 text-slate-800 font-bold text-lg hover:text-primary transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-slate-50">
                            <currentFunnel.icon size={20} className="text-slate-500" />
                            {currentFunnel.name}
                            <MdChevronRight size={20} className={`text-slate-400 transition-transform ${isFunnelSelectOpen ? 'rotate-90' : ''}`} />
                        </button>
                        {isFunnelSelectOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-slideDown">
                                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Seus Funis</div>
                                {allFunnels.map(f => (
                                    <button key={f.id} onClick={() => setCurrentFunnelId(f.id)} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 ${currentFunnel.id === f.id ? 'bg-slate-50 text-indigo-600' : 'text-slate-600'}`}>
                                        <f.icon size={18} className={currentFunnel.id === f.id ? 'text-indigo-600' : 'text-slate-400'} />
                                        <span className="font-medium text-sm">{f.name}</span>
                                        {currentFunnel.id === f.id && <MdCheck size={18} className="text-indigo-600 ml-auto" />}
                                    </button>
                                ))}
                                <div className="border-t border-slate-50 mt-1 pt-1">
                                    <button onClick={e => { e.stopPropagation(); handleCreateFunnel(); }} className="w-full text-left px-4 py-2 flex items-center gap-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 text-xs font-medium">
                                        <MdAdd size={16} /> Criar Novo Funil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <span className="w-px h-6 bg-slate-200"></span>
                    <button onClick={e => { e.stopPropagation(); setIsEditMode(!isEditMode); }} className={`p-1.5 rounded-lg transition-colors ${isEditMode ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="Editar Funil">
                        <MdSettings size={20} />
                    </button>
                    {isEditMode && <span className="text-xs text-indigo-600 font-medium animate-fadeIn">Modo de Edição</span>}
                </div>
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button onClick={() => onChangeView?.('board')} className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs transition-colors ${view === 'board' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 font-medium hover:bg-white/50'}`}>
                        <MdViewKanban size={18} /> Board
                    </button>
                    <button onClick={() => onChangeView?.('list')} className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs transition-colors ${view === 'list' ? 'bg-white shadow-sm text-slate-800 font-bold' : 'text-slate-500 font-medium hover:bg-white/50'}`}>
                        <MdTableRows size={18} /> Lista
                    </button>
                </div>
            </div>

            {view === 'board' ? (
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-custom h-full items-start px-1">
                    {columns.map(col => {
                        const leads = filteredPipeline[col.id] || [];
                        const isDragOver = dragOverColId === col.id;
                        return (
                            <div key={col.id} className={`flex flex-col w-[340px] shrink-0 h-full max-h-full rounded-xl bg-slate-50 border border-slate-200/60 p-2 transition-all ${isDragOver ? 'ring-2 ring-indigo-500/20 bg-slate-100' : ''}`} onDragOver={e => { e.preventDefault(); setDragOverColId(col.id); }} onDragLeave={() => setDragOverColId(null)} onDrop={e => handleDrop(e, col.id)}>
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full ${col.accent.replace('bg-', 'bg-')} shadow-sm`}></div>
                                        {isEditMode ? <input type="text" value={col.title} onChange={e => handleUpdateColumnTitle(col.id, e.target.value)} className="text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 py-0.5 outline-none max-w-[150px]" /> : <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>}
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-sm">{leads.length}</span>
                                    </div>
                                    {!isEditMode ? <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">{formatCurrencyCompact(getColumnTotal(leads))}</span> : <button onClick={() => handleDeleteColumn(col.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><MdClose size={18} /></button>}
                                </div>
                                <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar px-1 pb-1">
                                    {leads.length > 0 ? leads.map(l => <KanbanCard key={l.id} lead={l} onClick={handleCardClick} onDragStart={handleDragStart} isDragError={dragErrorLeadId === l.id} activeMenuId={activeMenuLeadId} onToggleMenu={handleToggleMenu} />) : <div className="h-32 rounded-xl border-2 border-dashed border-slate-200/50 flex flex-col items-center justify-center text-slate-300 gap-2 hover:bg-slate-100/50 transition-colors bg-slate-50/50"><MdArchive size={24} className="opacity-30" /><span className="text-xs font-medium opacity-50">Vazio</span></div>}
                                </div>
                                {isEditMode && <div onClick={handleAddColumn} className="mt-3 p-3 rounded-xl border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-white text-slate-400 hover:text-indigo-600 transition-all text-xs font-bold"><MdAdd size={16} className="mr-1" /> Nova Coluna</div>}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <LeadListTableRefactored leads={flattenedRows} onLeadClick={handleCardClick} filters={filters} searchTerm={searchTerm} onSearchChange={onSearchChange} />
            )}
        </div>
    );
};
