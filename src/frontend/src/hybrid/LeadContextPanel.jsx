import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { stageLabels } from '../utils/pipeline';
import { QuickChatPanel } from '../modes/SalesMode/QuickChatPanel';
import { useCopilot } from '../context/CopilotContext';

const formatPhone = (text) => {
  if (!text) return '';
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return text;
};

const STATUS_OPTIONS = Object.keys(stageLabels);

function ActionButton({ icon, label, color, primary, onClick }) {
  const baseClass = "h-8 px-4 rounded-full flex items-center gap-2 text-[11px] font-bold transition-all active:scale-95 border";
  const variants = {
    orange: primary ? "bg-solar text-white border-transparent hover:bg-amber-600 shadow-none hover:shadow-sm" : "bg-white border-amber-200 text-amber-700 hover:bg-slate-50",
    emerald: "bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    slate: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
  };

  const activeVariant = variants[color] || variants.slate;

  return (
    <button onClick={onClick} className={`${baseClass} ${activeVariant}`}>
      {typeof icon === 'string' ? (
        <span className="material-symbols-outlined ds-icon-w300 text-[18px]">{icon}</span>
      ) : (
        <span className="flex items-center justify-center text-[16px]">{icon}</span>
      )}
      <span>{label}</span>
    </button>
  );
}

export function LeadContextPanel({ lead, loading, onOpenDetail, onStatusChange }) {
  const navigate = useNavigate();
  const { openSidebar, setContext } = useCopilot();
  const [copiedField, setCopiedField] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white font-sans overflow-hidden animate-pulse">
        {/* Skeleton */}
        <div className="h-16 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-4">
          <div className="size-8 rounded-full bg-slate-200"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-24 bg-slate-50 rounded-lg"></div>
          <div className="h-96 bg-slate-50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!lead) return null; // Should be handled by parent, but safety check

  return (
    <div className="flex flex-col h-full bg-canvas font-sans overflow-hidden relative gap-6">

      {/* 0. COMMAND HEADER (Nexus Style) */}
      <div className="shrink-0 h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[11px]">
            {lead.name?.substring(0, 2).toUpperCase() || 'LE'}
          </div>
          <div className="flex flex-col">
            <h2 className="ds-title-section text-slate-800 leading-tight">{lead.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="ds-meta text-slate-400">
                {lead.city || 'Local desconhecido'}
              </span>
              <span className="text-meta text-slate-300">•</span>
              <span className="ds-meta text-slate-400 font-mono">
                {formatPhone(lead.phone) || 'Sem telefone'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            icon="auto_awesome"
            label="Análise IA"
            color="orange"
            onClick={() => {
              setContext({ type: 'lead', id: lead.id, name: lead.name });
              openSidebar();
            }}
          />
          <ActionButton
            icon="description"
            label="Proposta"
            color="slate"
            onClick={() => navigate('/proposals/new', { state: { leadId: lead.id } })}
          />
          <ActionButton
            icon={<FaWhatsapp />}
            label="WhatsApp"
            color="emerald"
            primary
            onClick={() => window.open(`https://wa.me/55${lead.phone?.replace(/\D/g, '')}`, '_blank')}
          />
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <button
            onClick={onOpenDetail}
            className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-petroleum-600 transition-all border border-transparent hover:border-slate-200"
            title="Ver Detalhes Completos"
          >
            <span className="material-symbols-outlined ds-icon-w300">expand_content</span>
          </button>
        </div>
      </div>

      {/* 1. Metric Grid - Flat */}
      <div className="px-6 z-10 shrink-0">
        <div className="bg-white rounded-lg border border-slate-100 p-3 grid grid-cols-4 gap-3">
          <MetricCard
            icon="bolt"
            label="Consumo"
            value={lead.consumption || '0'}
            unit="kWh"
          />
          <MetricCard
            icon="sunny"
            label="Potencial"
            value={lead.consumption ? (Number(lead.consumption) * 0.012).toFixed(1) : '0.0'}
            unit="kWp"
          />
          <MetricCard
            icon="payments"
            label="Fatura"
            value={lead.consumption ? `R$ ${(Number(lead.consumption) * 0.95).toFixed(0)}` : '0'}
            unit=""
          />
          <div className="flex items-center justify-center bg-slate-50/50 rounded-lg border border-slate-100 hover:bg-white transition-all cursor-pointer group px-3 py-2" onClick={onStatusChange ? () => { } /* TODO: dropdown */ : undefined}>
            <div className="flex flex-col items-center">
              <span className="ds-label text-slate-400 mb-1 uppercase tracking-wider text-[9px]">Fase Atual</span>
              <div className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${lead.status === 'CLOSED_WON' ? 'bg-emerald-500' : 'bg-petroleum'}`}></span>
                <span className="text-sm font-semibold text-slate-700">{stageLabels[lead.status] || lead.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Area - Flat */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative px-6 pb-6 z-10">
        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg border border-slate-100 relative">
          <QuickChatPanel leadId={lead.id} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, trend }) {
  return (
    <div className="p-6 rounded-lg bg-white border border-slate-100 flex flex-col gap-1 transition-all hover:border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <span className="ds-label text-slate-400 uppercase tracking-widest text-[9px]">{label}</span>
        {icon && <span className="material-symbols-outlined text-slate-300 text-[18px] ds-icon-w300">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="ds-display-l text-[26px] text-slate-800 tracking-tight">{value}</span>
        {unit && <span className="text-[12px] font-bold text-slate-400 uppercase">{unit}</span>}
        {trend && <span className="text-[10px] font-semibold text-emerald-600 ml-auto">{trend}</span>}
      </div>
    </div>
  );
}
