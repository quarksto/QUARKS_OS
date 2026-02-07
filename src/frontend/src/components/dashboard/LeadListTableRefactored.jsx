import React, { useState, useMemo } from 'react';
import { getTemperature, getTemperatureClass, getSourceLabel, getStageLabel, getLeadScore } from '../../utils/pipeline';
import { StandardAvatar } from '../ui/StandardAvatar';
import { FaWhatsapp, FaGoogle, FaFacebookF, FaInstagram, FaLinkedinIn, FaGlobe, FaEnvelope } from 'react-icons/fa6';
import { MdOpenInNew, MdSearchOff, MdChevronLeft, MdChevronRight, MdSearch } from 'react-icons/md';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

// Stitch-style Kanban Badge

// Stitch-style Kanban Badge
const StitchBadge = ({ label, colorClass, dotColor }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${colorClass} bg-white shadow-sm`}>
        {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
        {label}
    </span>
);

export const LeadListTableRefactored = ({
    leads,
    loading,
    filters,
    searchTerm,
    onSearchChange,
    onRefresh,
    onLeadClick,
    selectedLeadId
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ----------------------------------------------------------------------
    // Filter Logic (Preserved from original)
    // ----------------------------------------------------------------------
    const filteredLeads = leads || [];

    // Pagination
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const displayedLeads = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ----------------------------------------------------------------------
    // Render Helpers
    // ----------------------------------------------------------------------

    const getStatusStyle = (status) => {
        // Stitch/DS Palette Mapping
        const styles = {
            'NEW': { border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
            'CONTACTED': { border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
            'PROPOSAL_SENT': { border: 'border-cyan-200', text: 'text-cyan-700', dot: 'bg-cyan-500' },
            'NEGOTIATION': { border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
            'CLOSED_WON': { border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
            'CLOSED_LOST': { border: 'border-slate-200', text: 'text-slate-500', dot: 'bg-slate-400' }
        };
        return styles[status] || styles['NEW'];
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
        <div className="flex flex-col h-full gap-5">
            {/* Header / Toolbar - Only show if not in header? Actually search is in header now. */}
            <div className="flex items-center justify-between shrink-0">
                {!onSearchChange && (
                    <div className="relative w-full max-w-sm group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petroleum transition-colors">
                            <MdSearch size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar leads por nome, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-petroleum/60 focus:ring-0 transition-all font-sans shadow-none"
                        />
                    </div>
                )}
                {/* Advanced Filter Toggle / Metadata */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        Exibindo <span className="text-slate-900 font-bold">{displayedLeads.length}</span> de <span className="text-slate-900 font-bold">{filteredLeads.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Table Container - Stitch Style: Clean card, no inner borders, hover states */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Contato</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Pipeline</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Temp.</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Origem</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Valor Potencial</th>
                                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 px-6"><div className="h-10 w-48 bg-slate-100 rounded-lg"></div></td>
                                        <td className="py-4 px-6"><div className="h-6 w-24 bg-slate-100 rounded-lg"></div></td>
                                        <td className="py-4 px-6"><div className="h-6 w-20 bg-slate-100 rounded-lg"></div></td>
                                        <td className="py-4 px-6"><div className="h-5 w-24 bg-slate-100 rounded"></div></td>
                                        <td className="py-4 px-6"><div className="h-5 w-20 bg-slate-100 rounded ml-auto"></div></td>
                                        <td className="py-4 px-6"><div className="h-8 w-8 bg-slate-100 rounded-lg mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : displayedLeads.length > 0 ? (
                                displayedLeads.map((lead) => {
                                    const temp = getTemperature(lead);
                                    const source = getSourceLabel(lead);
                                    const stageLabel = getStageLabel(lead.status);
                                    const statusStyle = getStatusStyle(lead.status);
                                    const isSelected = selectedLeadId === lead.id;

                                    return (
                                        <tr
                                            key={lead.id}
                                            onClick={() => onLeadClick && onLeadClick(lead)}
                                            className={`group transition-all cursor-pointer hover:bg-slate-50/80 ${isSelected ? 'bg-blue-50/40 relative z-0' : ''
                                                }`}
                                        >
                                            {/* Contact */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <StandardAvatar
                                                        name={lead.name}
                                                        src={lead.avatar_url || lead.avatar || lead.avatarUrl}
                                                        size="md"
                                                        channel={lead.phone ? 'whatsapp' : (lead.email ? 'email' : null)}
                                                        className="!w-9 !h-9"
                                                    />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-[13px] font-semibold truncate transition-colors ${isSelected ? 'text-petroleum' : 'text-slate-700 group-hover:text-petroleum'
                                                            }`}>
                                                            {lead.name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                            {lead.company && (
                                                                <>
                                                                    <span className="truncate max-w-[120px] font-medium text-slate-500">{lead.company}</span>
                                                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                                                </>
                                                            )}
                                                            <span className="truncate">{lead.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <StitchBadge
                                                    label={stageLabel}
                                                    colorClass={`${statusStyle.border} ${statusStyle.text}`}
                                                    dotColor={statusStyle.dot}
                                                />
                                            </td>

                                            {/* Temp */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium border bg-white shadow-sm ${temp.label === 'Quente' ? 'border-red-200 text-red-700' :
                                                    temp.label === 'Morno' ? 'border-amber-200 text-amber-700' :
                                                        'border-slate-200 text-slate-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${temp.label === 'Quente' ? 'bg-red-500' :
                                                        temp.label === 'Morno' ? 'bg-amber-500' : 'bg-slate-400'
                                                        }`} />
                                                    {temp.label}
                                                </span>
                                            </td>

                                            {/* Origin */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                                                    {getOriginIcon(lead.origin || source)}
                                                    {source}
                                                </div>
                                            </td>

                                            {/* Value */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[13px] font-bold text-slate-700 tabular-nums tracking-tight">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((lead.consumption || 0) * 0.95 * 12 * 5)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Quick Actions (Hover Only) */}
                                            <td className="py-4 px-6 text-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-1 transform translate-x-2 group-hover:translate-x-0">
                                                    <a
                                                        href={`mailto:${lead.email}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-8 h-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-colors"
                                                        title="Enviar Email"
                                                    >
                                                        <FaEnvelope size={16} />
                                                    </a>

                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onLeadClick && onLeadClick(lead); }}
                                                        className="w-8 h-8 rounded-lg hover:bg-slate-100 hover:text-slate-700 text-slate-400 flex items-center justify-center transition-colors"
                                                        title="Editar / Ver Detalhes"
                                                    >
                                                        <MdOpenInNew size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center animate-fadeInScale">
                                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <MdSearchOff className="text-slate-300 text-[40px]" />
                                            </div>
                                            <p className="text-slate-900 font-medium text-lg">Nenhum resultado encontrado</p>
                                            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                                                Tente ajustar os termos de busca ou filtros para encontrar o que procura.
                                            </p>
                                            <button
                                                onClick={() => { setSearchTerm(''); if (onRefresh) onRefresh(); }}
                                                className="mt-4 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                Limpar Filtros
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination - Stitch Minimalist */}
                <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-500">
                        Mostrando <span className="text-slate-900">{displayedLeads.length}</span> leads
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p > 1 ? p - 1 : 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-30 transition-colors"
                        >
                            <MdChevronLeft size={20} />
                        </button>
                        <span className="text-[12px] font-medium text-slate-700 px-2">
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(p => p < totalPages ? p + 1 : p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-30 transition-colors"
                        >
                            <MdChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
