import React from 'react';
import { stageLabels } from '../utils/pipeline';

const FILTER_PRIORITY = '__PRIORITY__';
const FILTER_UNREAD = '__UNREAD__';
const FILTER_NEW = '__NEW__';

const SORT_RECENT = 'recent';
const SORT_NAME = 'name';

const HOURS_NEW = 48;

// Omnichannel Icons mapping
// Omnichannel Icons mapping - Standardizing to Petroleum/Slate for Super Flat look
const ORIGIN_ICONS = {
  'WHATSAPP': { icon: 'chat', color: 'text-slate-600', bg: 'bg-white border border-slate-100' },
  'INSTAGRAM': { icon: 'camera_alt', color: 'text-slate-600', bg: 'bg-white border border-slate-100' },
  'FACEBOOK': { icon: 'public', color: 'text-slate-600', bg: 'bg-white border border-slate-100' },
  'WEB': { icon: 'language', color: 'text-slate-600', bg: 'bg-white border border-slate-100' },
  'MANUAL': { icon: 'edit', color: 'text-slate-600', bg: 'bg-white border border-slate-100' }
};

function matchLead(query, lead) {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();
  const name = (lead.name || '').toLowerCase();
  const email = (lead.email || '').toLowerCase();
  const phone = (lead.phone || '').replace(/\D/g, '');
  const qNorm = q.replace(/\D/g, '');
  return name.includes(q) || email.includes(q) || (qNorm && phone.includes(qNorm));
}

export function ConversationList({
  leads,
  selectedId,
  onSelectLead,
  loading,
  searchQuery = '',
  onSearchChange,
  statusFilter = '',
  onStatusFilterChange,
  onRequestCreateLead,
  error = null,
  onRetry
}) {
  const [sortBy, setSortBy] = React.useState(SORT_RECENT);

  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    let list = leads;

    // 1. Filtering
    if (statusFilter === FILTER_PRIORITY) {
      list = list.filter((l) => (l.score || 0) > 80);
    } else if (statusFilter === FILTER_UNREAD) {
      list = list.filter((l) => (l.unreadCount || 0) > 0);
    } else if (statusFilter) {
      list = list.filter((l) => l.status === statusFilter);
    }
    if (searchQuery?.trim()) list = list.filter((lead) => matchLead(searchQuery, lead));

    // 2. Sorting (Smart Sort)
    if (sortBy === SORT_NAME) {
      list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // Smart Sort: Unread > New > Recent
      list = [...list].sort((a, b) => {
        // Priority 1: Unread
        const unreadA = (a.unreadCount || 0) > 0 ? 1 : 0;
        const unreadB = (b.unreadCount || 0) > 0 ? 1 : 0;
        if (unreadA !== unreadB) return unreadB - unreadA;

        // Priority 2: Recency
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
    }
    return list;
  }, [leads, searchQuery, statusFilter, sortBy]);

  return (
    <>
      {/* 1. List Header & Search */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3 sticky top-0 bg-white z-10 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="ds-label text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined ds-icon-w300 text-[16px]">inbox</span>
            Caixa de Entrada
          </h3>
          <div className="flex gap-1">
            <button
              onClick={onRequestCreateLead}
              className="size-8 flex items-center justify-center rounded-full bg-solar hover:bg-amber-600 text-white transition-all shadow-none active:scale-95"
              title="Novo Lead"
            >
              <span className="material-symbols-outlined ds-icon-w300 text-[18px]">add</span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1"></div>
            <button
              className={`size-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-all shadow-none active:scale-95 ${statusFilter === FILTER_UNREAD ? 'text-solar border border-solar-100 bg-white' : ''}`}
              onClick={() => onStatusFilterChange(statusFilter === FILTER_UNREAD ? '' : FILTER_UNREAD)}
              title="Filtrar Não Lidos"
            >
              <span className="material-symbols-outlined ds-icon-w300 text-[18px]">mark_chat_unread</span>
            </button>
          </div>
        </div>

        <div className="relative group">
          <span className="material-symbols-outlined ds-icon-w300 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[18px]">search</span>
          <input
            id="workspace-search"
            type="search"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 h-10 bg-slate-50 border-none rounded-full text-sm focus:ring-0 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
          />
        </div>
      </div>

      {/* 2. List Body */}
      {error ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8 text-center bg-white">
          <span className="material-symbols-outlined ds-icon-w300 text-4xl mb-3 text-red-300">cloud_off</span>
          <p className="text-xs font-semibold text-slate-700 uppercase">Falha na Sincronização</p>
          <button onClick={onRetry} className="mt-4 text-petroleum text-xs font-semibold hover:underline">Tentar Novamente</button>
        </div>
      ) : loading ? (
        <div className="overflow-y-auto flex-1 bg-white custom-scrollbar p-2 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 flex gap-3 animate-pulse border border-transparent">
              <div className="size-10 bg-slate-50 rounded-full" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-50 rounded w-1/2" />
                <div className="h-2 bg-slate-50/50 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredLeads?.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8 text-center bg-white">
          <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
            <span className="material-symbols-outlined ds-icon-w300 text-4xl">inbox_customize</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">Nenhum lead encontrado</p>
        </div>
      ) : (
        <ul className="overflow-y-auto flex-1 bg-white custom-scrollbar p-2 space-y-2">
          {filteredLeads.map((lead) => {
            const isSelected = selectedId === lead.id;
            const hasUnread = (lead.unreadCount || 0) > 0;
            const originConfig = ORIGIN_ICONS[lead.origin] || ORIGIN_ICONS['MANUAL'];

            return (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => onSelectLead(lead)}
                  className={`w-full group flex flex-col gap-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative border text-left shadow-none active:scale-[0.98] ${isSelected
                    ? 'bg-slate-50 border-slate-100 z-10'
                    : 'bg-white border-transparent hover:bg-slate-50/50 hover:border-slate-100'
                    }`}
                >
                  {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-solar rounded-r-full" />}

                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar with Status Dot */}
                      <div className="relative">
                        <div className={`size-10 rounded-full flex items-center justify-center ds-label transition-all duration-300 ${isSelected ? 'text-slate-800 bg-slate-100 border border-slate-200 shadow-none' : 'bg-slate-50 text-slate-400 border border-transparent'}`}>
                          {lead.name ? lead.name.substring(0, 2).toUpperCase() : 'L'}
                        </div>
                        {/* Origin Icon Badge */}
                        <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border border-white flex items-center justify-center shadow-none ${originConfig.bg}`}>
                          <span className={`material-symbols-outlined ds-icon-w300 text-[10px] ${originConfig.color}`}>{originConfig.icon}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start min-w-0">
                        <div className="flex items-center gap-2 w-full">
                          <span className={`text-sm font-semibold truncate max-w-[140px] ${isSelected ? 'text-slate-800' : 'text-slate-700'} ${hasUnread ? 'text-slate-800' : ''}`}>
                            {lead.name || 'Sem Nome'}
                          </span>
                          {hasUnread && <span className="size-2 rounded-full bg-solar animate-pulse"></span>}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium truncate">
                          {lead.city || 'Local desconhecido'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-300 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full pl-[52px] mt-1">
                    <span className={`badge-kanban ${stageLabels[lead.status] === 'Novo' ? 'border-amber-100 text-amber-700' : ''}`}>
                      {stageLabels[lead.status] || lead.status}
                    </span>
                    {hasUnread && (
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-solar uppercase tracking-tighter">
                        <span>{lead.unreadCount} nova(s)</span>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul >
      )}
    </>
  );
}
