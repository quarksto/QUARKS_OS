import React from 'react';
import { getStageLabel, stageLabels } from '../utils/pipeline';

const FILTER_PRIORITY = '__PRIORITY__';
const FILTER_UNREAD = '__UNREAD__';

const QUICK_FILTERS = [
  { value: '', label: 'Todos' },
  { value: FILTER_PRIORITY, label: 'Prioritários' },
  { value: FILTER_UNREAD, label: 'Não Lidos' },
];

const SORT_RECENT = 'recent';
const SORT_NAME = 'name';

const HOURS_NEW = 48;

function matchLead(query, lead) {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();
  const name = (lead.name || '').toLowerCase();
  const email = (lead.email || '').toLowerCase();
  const phone = (lead.phone || '').replace(/\D/g, '');
  const qNorm = q.replace(/\D/g, '');
  return name.includes(q) || email.includes(q) || (qNorm && phone.includes(qNorm));
}

function isNewLead(lead) {
  const created = lead?.createdAt;
  if (!created) return false;
  const ageMs = Date.now() - new Date(created).getTime();
  return ageMs < HOURS_NEW * 60 * 60 * 1000;
}

export function ConversationList({ leads, selectedId, onSelectLead, loading, searchQuery = '', onSearchChange, statusFilter = '', onStatusFilterChange, onRequestCreateLead, error = null, onRetry }) {
  const [sortBy, setSortBy] = React.useState(SORT_RECENT);

  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    let list = leads;
    if (statusFilter === FILTER_PRIORITY) {
      list = list.filter((l) => (l.score || 0) > 80);
    } else if (statusFilter === FILTER_UNREAD) {
      list = list.filter((l) => (l.unreadCount || 0) > 0);
    } else if (statusFilter) {
      list = list.filter((l) => l.status === statusFilter);
    }
    if (searchQuery?.trim()) list = list.filter((lead) => matchLead(searchQuery, lead));
    if (sortBy === SORT_NAME) {
      list = [...list].sort((a, b) =>
        (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
      );
    } else {
      list = [...list].sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return tb - ta;
      });
    }
    return list;
  }, [leads, searchQuery, statusFilter, sortBy]);

  return (
    <>
      {/* 1. List Header & Search */}
      <div className="p-6 border-b border-slate-100 shrink-0 space-y-5 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-petroleum-900 tracking-tight">Leads</h2>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onRequestCreateLead}
              className="size-8 rounded-full bg-slate-50 text-slate-500 hover:bg-petroleum-900 hover:text-white transition-all flex items-center justify-center border border-slate-100"
              title="Novo Lead"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>

        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petroleum-600 transition-colors" style={{ fontSize: '18px' }}>search</span>
          <input
            id="workspace-search"
            type="search"
            placeholder="Buscar por nome ou contato..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border border-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-petroleum/10 focus:border-petroleum/40 bg-slate-50/50 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onStatusFilterChange(f.value)}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${statusFilter === f.value
                ? 'bg-petroleum-900 text-white border-petroleum-900 shadow-md transform scale-105'
                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
        <span>Lead</span>
        <span>Status</span>
      </div>

      {/* 2. List Body */}
      {error ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8 text-center bg-white">
          <span className="material-symbols-outlined text-4xl mb-3 text-red-400">cloud_off</span>
          <p className="text-xs font-bold text-petroleum-900 uppercase">Falha na Sincronização</p>
          <button onClick={onRetry} className="mt-4 text-petroleum-600 text-xs font-bold hover:underline">Tentar Novamente</button>
        </div>
      ) : loading ? (
        <div className="divide-y divide-slate-50 overflow-y-auto flex-1 bg-white">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 flex gap-3 animate-pulse">
              <div className="size-10 bg-slate-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-2 bg-slate-50 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredLeads?.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8 text-center bg-white">
          <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
            <span className="material-symbols-outlined text-4xl">inbox_customize</span>
          </div>
          <p className="text-xs font-bold text-petroleum-900 uppercase tracking-widest">Lista Vazia</p>
          <p className="text-[10px] mt-1 text-slate-400">Nenhum lead encontrado com estes filtros.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50 overflow-y-auto flex-1 bg-white custom-scrollbar">
          {filteredLeads.map((lead) => {
            const isSelected = selectedId === lead.id;

            // Priority logic matching Stitch style
            const score = lead.score || 0;
            const isHighPriority = score > 80;

            return (
              <li key={lead.id} className="relative group/item">
                <button
                  type="button"
                  onClick={() => onSelectLead(lead)}
                  className={`w-full flex items-start gap-4 p-5 text-left transition-all border-l-4 ${isSelected
                    ? 'bg-petroleum/10 border-petroleum-600'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                    }`}
                >
                  <div className="shrink-0 relative">
                    <div className={`size-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm ${isSelected ? 'bg-petroleum-900 text-white' : 'bg-slate-100 text-slate-400 group-hover/item:bg-slate-200'
                      }`}>
                      {(lead.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    {lead.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 size-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-[13px] font-bold truncate tracking-tight transition-colors ${isSelected ? 'text-petroleum-900' : 'text-slate-700'
                        }`}>
                        {lead.name || 'Sem nome'}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-700' :
                          lead.status === 'NEW' ? 'bg-slate-100 text-slate-600' :
                            'bg-solar-100 text-solar-700'
                        }`}>
                        {getStageLabel(lead.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {lead.email || 'No email'}
                      </p>
                      <span className="text-[10px] font-bold text-slate-300">
                        {new Date(lead.createdAt).toLocaleDateString([], { month: '2-digit', day: '2-digit' })}
                      </span>
                    </div>

                    {isHighPriority && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="size-1.5 bg-solar-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-solar-600 uppercase tracking-widest">Lead de Alta Performance</span>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
