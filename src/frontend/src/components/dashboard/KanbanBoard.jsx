import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadListTableRefactored } from './LeadListTableRefactored';
import api from '../../services/api';
import { StandardAvatar } from '../ui/StandardAvatar';
import { FaWhatsapp, FaGoogle, FaFacebookF, FaInstagram, FaLinkedinIn, FaGlobe, FaBuilding, FaBolt } from 'react-icons/fa6';
import { MdOutlineMoreVert, MdLocationOn, MdFactory, MdBolt, MdHistory, MdCalendarToday, MdArchive, MdVisibility, MdSwapHoriz, MdSolarPower, MdPayments, MdChevronRight, MdCheck, MdAdd, MdSettings, MdClose } from 'react-icons/md';

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

/* DS: bordas sutis slate-100/200; indicador de coluna em outline (sem bg sólido); sem roxo/indigo */
const SALES_FUNNEL = {
    id: 'sales_default',
    name: 'Funil de Vendas',
    icon: MdSolarPower,
    columns: [
        { title: 'Novos Leads', id: 'NEW', borderDot: 'border-slate-300' },
        { title: 'Qualificação', id: 'CONTACTED', borderDot: 'border-amber-200' },
        { title: 'Proposta', id: 'PROPOSAL_SENT', borderDot: 'border-slate-300' },
        { title: 'Negociação', id: 'NEGOTIATION', borderDot: 'border-slate-300' },
        { title: 'Fechados', id: 'CLOSED_WON', borderDot: 'border-emerald-200' },
        { title: 'Perdidos', id: 'CLOSED_LOST', borderDot: 'border-slate-200' },
    ]
};

const PARTNERSHIP_FUNNEL = {
    id: 'partnerships',
    name: 'Funil de Parcerias',
    icon: MdSwapHoriz,
    columns: [
        { title: 'Novos Parceiros', id: 'NEW_PARTNER', borderDot: 'border-slate-300' },
        { title: 'Reunião Agendada', id: 'MEETING_SCHEDULED', borderDot: 'border-slate-300' },
        { title: 'Em Análise', id: 'UNDER_REVIEW', borderDot: 'border-amber-200' },
        { title: 'Contrato Enviado', id: 'CONTRACT_SENT', borderDot: 'border-slate-300' },
        { title: 'Parceria Ativa', id: 'ACTIVE_PARTNER', borderDot: 'border-emerald-200' },
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
        if (action === 'edit') navigate(`/leads/${lead.id}`);
    };

    // Helper for Origin Icon
    /* DS: apenas petroleum, solar, slate, white — ícones de origem em slate */
    const getOriginIcon = (origin) => {
        const o = origin?.toLowerCase() || '';
        const cls = 'text-slate-500 shrink-0';
        if (o.includes('google')) return <FaGoogle size={10} className={cls} aria-hidden="true" />;
        if (o.includes('facebook')) return <FaFacebookF size={10} className={cls} aria-hidden="true" />;
        if (o.includes('instagram')) return <FaInstagram size={10} className={cls} aria-hidden="true" />;
        if (o.includes('linkedin')) return <FaLinkedinIn size={10} className={cls} aria-hidden="true" />;
        return <FaGlobe size={10} className="text-slate-400 shrink-0" aria-hidden="true" />;
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead, lead.status)}
            onClick={() => onClick(lead)}
            className={`flex flex-col gap-4 p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group relative overflow-visible shadow-none active:scale-[0.98] ${isDragError ? 'border-red-400 animate-shake' : ''} ${isMenuOpen ? 'z-40' : ''}`}
        >
            {/* 1. Header: Avatar & Primary Metadata */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <span className="text-slate-600 font-bold text-lg">
                            {(lead.name || 'Lead').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    {/* WhatsApp Badge */}
                    <div className="absolute -bottom-1 -right-1 border border-emerald-200 bg-white size-5 rounded-full flex items-center justify-center text-emerald-600">
                        <FaWhatsapp size={10} />
                    </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-[15px] font-bold text-slate-700 truncate leading-tight group-hover:text-petroleum transition-colors">
                        {lead.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                        <MdLocationOn className="text-slate-400 size-3.5" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            {address}
                        </span>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        onClick={(e) => handleAction(e, 'more')}
                        className={`size-8 rounded-full flex items-center justify-center transition-colors border border-transparent ${isMenuOpen ? 'bg-petroleum text-white' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-500'}`}
                        aria-label="Mais ações"
                    >
                        <MdOutlineMoreVert size={20} aria-hidden="true" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-sm border border-slate-200 py-1.5 z-50 overflow-hidden" role="menu">
                            <button onClick={(e) => handleMenuAction(e, 'edit')} className="w-full text-left px-4 py-3 ds-body hover:bg-slate-50 hover:text-petroleum flex items-center gap-3 transition-colors focus:outline-none">
                                <MdVisibility size={18} className="opacity-40 text-slate-400" aria-hidden="true" />
                                <span className="ds-body font-medium">Detalhes do Lead</span>
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'move')} className="w-full text-left px-4 py-3 ds-body hover:bg-slate-50 hover:text-petroleum flex items-center gap-3 transition-colors focus:outline-none">
                                <MdSwapHoriz size={18} className="opacity-40 text-slate-400" aria-hidden="true" />
                                <span className="ds-body font-medium">Mover Funil</span>
                            </button>
                            <div className="border-t border-slate-50 my-1 mx-2"></div>
                            <button onClick={(e) => handleMenuAction(e, 'archive')} className="w-full text-left px-4 py-3 ds-body text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium">
                                <MdArchive size={18} aria-hidden="true" />
                                <span>Arquivar Lead</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Metrics Grid: Consumption & Distributor */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 rounded-lg border border-slate-100 bg-white group-hover:border-slate-200 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Distribuidora
                    </span>
                    <div className="flex items-center gap-2">
                        <MdFactory className="text-slate-300 size-4" />
                        <span className="text-[13px] font-semibold text-slate-700 truncate">{distributor}</span>
                    </div>
                </div>
                <div className="flex flex-col p-3 rounded-lg border border-slate-100 bg-white group-hover:border-slate-200 transition-colors">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Consumo Médio
                    </span>
                    <div className="flex items-center gap-2">
                        <MdBolt className="text-slate-300 size-4" />
                        <span className="text-[13px] font-semibold text-slate-700">{consumption}</span>
                    </div>
                </div>
            </div>

            {/* 3. Indicators: Badges em outline — altura do menor badge */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-100 bg-white shrink-0 min-h-0">
                    <div className={`size-1.5 rounded-full shrink-0 ${temperature.label === 'Quente' ? 'bg-red-400' : temperature.label === 'Morno' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase leading-none">{temperature.label}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-100 bg-white shrink-0 min-h-0">
                    <span aria-hidden="true" className="flex items-center shrink-0 leading-none">{getOriginIcon(captureMethod)}</span>
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase leading-none">{captureMethod}</span>
                </div>
            </div>

            {/* 4. IA Score & Potencial — DS: Rounded-lg, divide-x */}
            <div className="flex rounded-lg border border-slate-100 bg-slate-50/50 overflow-hidden divide-x divide-slate-100">
                <div className="flex-1 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <MdSolarPower className="text-solar size-3.5" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">IA Score</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-700 tabular-nums">{score}</span>
                        <span className="text-[9px] font-bold text-slate-400">PTS</span>
                    </div>
                </div>
                <div className="flex-1 p-3 flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-1">
                        <MdPayments className="text-slate-400 size-3.5" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Potencial</span>
                    </div>
                    <span className="text-lg font-bold text-slate-700 tabular-nums">
                        {formatCurrencyCompact(potential)}
                    </span>
                </div>
            </div>

            {/* 5. Footer: Próxima ação e tempo na etapa */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 hover:text-petroleum transition-colors min-w-0">
                    <MdCalendarToday size={14} className={`shrink-0 ${nextAction.icon === 'priority_high' ? 'text-red-500' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                        {nextAction.label || 'Nenhuma Agenda'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-0.5 py-0.5 rounded-[93px] border border-slate-100 text-slate-400 bg-white text-xs">
                    <MdHistory size={14} />
                    <span className="text-[10px] font-bold tabular-nums">{daysInStage}D</span>
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
                { title: 'Início', id: `start_${Date.now()}`, borderDot: 'border-slate-300' },
                { title: 'Em Progresso', id: `wip_${Date.now()}`, borderDot: 'border-amber-200' },
                { title: 'Concluído', id: `done_${Date.now()}`, borderDot: 'border-emerald-200' }
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
        setAllFunnels(prev => prev.map(funnel => funnel.id === currentFunnelId ? { ...funnel, columns: [...funnel.columns, { title: 'Nova Coluna', id: `COL_${Date.now()}`, borderDot: 'border-slate-200' }] } : funnel));
    };

    const handleDeleteColumn = (colId) => {
        if (window.confirm('Tem certeza que deseja excluir esta coluna?'))
            setAllFunnels(prev => prev.map(funnel => funnel.id === currentFunnelId ? { ...funnel, columns: funnel.columns.filter(col => col.id !== colId) } : funnel));
    };

    const handleCardClick = (lead) => navigate(`/leads/${lead.id}`);
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
        <div className="flex flex-col gap-2 h-full relative" onClick={e => e.stopPropagation()}>
            <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-1 border-b border-dashed border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={e => { e.stopPropagation(); setIsFunnelSelectOpen(!isFunnelSelectOpen); }} className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm hover:text-petroleum transition-colors px-2 py-1 -ml-2 rounded-md hover:bg-slate-50 focus:outline-none focus-visible:border-petroleum border border-transparent" aria-expanded={isFunnelSelectOpen} aria-haspopup="true">
                            <currentFunnel.icon size={16} className="text-slate-500 shrink-0" aria-hidden="true" />
                            <span className="truncate max-w-[140px]">{currentFunnel.name}</span>
                            <MdChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${isFunnelSelectOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
                        </button>
                        {isFunnelSelectOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-sm border border-slate-200 py-1 z-50 animate-slideDown" role="menu">
                                <div className="px-3 py-2 text-meta border-b border-slate-100">Seus Funis</div>
                                {allFunnels.map(f => (
                                    <button key={f.id} onClick={() => setCurrentFunnelId(f.id)} className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 ${currentFunnel.id === f.id ? 'bg-slate-50 text-petroleum' : 'text-slate-600'}`} role="menuitem">
                                        <f.icon size={18} className={currentFunnel.id === f.id ? 'text-petroleum' : 'text-slate-400'} aria-hidden="true" />
                                        <span className="font-medium text-sm">{f.name}</span>
                                        {currentFunnel.id === f.id && <MdCheck size={18} className="text-petroleum ml-auto" aria-hidden="true" />}
                                    </button>
                                ))}
                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <button onClick={e => { e.stopPropagation(); handleCreateFunnel(); }} className="w-full text-left px-4 py-2 flex items-center gap-3 text-slate-500 hover:text-petroleum hover:bg-slate-50 text-xs font-medium focus:outline-none focus-visible:bg-slate-50" role="menuitem">
                                        <MdAdd size={16} aria-hidden="true" /> Criar Novo Funil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={e => { e.stopPropagation(); setIsEditMode(!isEditMode); }} className={`p-1 rounded-md transition-colors focus:outline-none focus-visible:border-petroleum border border-transparent shrink-0 ${isEditMode ? 'bg-slate-100 text-petroleum' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="Editar Funil" aria-label="Editar funil">
                        <MdSettings size={18} aria-hidden="true" />
                    </button>
                    {isEditMode && <span className="text-[10px] text-petroleum font-semibold uppercase tracking-wide animate-fadeIn">Edição</span>}
                </div>
            </div>

            {view === 'board' ? (
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-custom h-full items-start px-1">
                    {columns.map(col => {
                        const leads = filteredPipeline[col.id] || [];
                        const isDragOver = dragOverColId === col.id;
                        return (
                            <div key={col.id} className={`flex flex-col w-[340px] shrink-0 h-full max-h-full rounded-lg bg-slate-50/50 border border-slate-100 p-2 transition-colors duration-200 ${isDragOver ? 'border-petroleum/40 bg-slate-100/50' : ''}`} onDragOver={e => { e.preventDefault(); setDragOverColId(col.id); }} onDragLeave={() => setDragOverColId(null)} onDrop={e => handleDrop(e, col.id)}>
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`size-3 rounded-full border bg-transparent ${col.borderDot || 'border-slate-200'}`} aria-hidden="true" />
                                        {isEditMode ? <input type="text" value={col.title} onChange={e => handleUpdateColumnTitle(col.id, e.target.value)} className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-0.5 outline-none max-w-[150px] focus:border-petroleum/60" aria-label="Nome da coluna" /> : <h3 className="ds-title-section text-slate-700">{col.title}</h3>}
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">{leads.length}</span>
                                    </div>
                                    {!isEditMode ? <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">{formatCurrencyCompact(getColumnTotal(leads))}</span> : <button onClick={() => handleDeleteColumn(col.id)} className="text-slate-400 hover:text-red-600 p-1 rounded-full focus:outline-none focus-visible:border-petroleum border border-transparent" aria-label="Excluir coluna"><MdClose size={18} aria-hidden="true" /></button>}
                                </div>
                                <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar px-1 pb-1">
                                    {leads.length > 0 ? leads.map(l => <KanbanCard key={l.id} lead={l} onClick={handleCardClick} onDragStart={handleDragStart} isDragError={dragErrorLeadId === l.id} activeMenuId={activeMenuLeadId} onToggleMenu={handleToggleMenu} />) : <div className="h-32 rounded-lg border border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 bg-slate-50/50"><MdArchive size={24} className="text-slate-300" aria-hidden="true" /><span className="text-xs font-medium">Vazio</span></div>}
                                </div>
                                {isEditMode && <button type="button" onClick={handleAddColumn} className="mt-3 p-3 rounded-lg border border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-white text-slate-500 hover:text-petroleum transition-colors duration-200 text-xs font-bold focus:outline-none focus-visible:border-petroleum"><MdAdd size={16} className="mr-1" aria-hidden="true" /> Nova Coluna</button>}
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
