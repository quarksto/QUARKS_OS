import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrencyCompact, getLeadPotential, stageLabels } from '../utils/pipeline';
import { Tabs, rem, Badge, Stack, Paper, Group, Text } from '@mantine/core';
import { IconMessageCircle, IconInfoCircle, IconFileDescription, IconRobot, IconPlus } from '@tabler/icons-react';
import { QuickChatPanel } from '../modes/SalesMode/QuickChatPanel';

const STATUS_OPTIONS = Object.keys(stageLabels);

function CopyButton({ value, onCopy, label, copied }) {
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => onCopy?.());
      }}
      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-petroleum-600"
      title={copied ? 'Copiado!' : `Copiar ${label}`}
      aria-label={copied ? 'Copiado' : `Copiar ${label}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
}

export function LeadContextPanel({ lead, loading, onOpenDetail, onStatusChange, onOpenCopilot }) {
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const copyFeedbackTimer = React.useRef(null);

  const handleCopy = (field) => {
    setCopiedField(field);
    if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current);
    copyFeedbackTimer.current = setTimeout(() => {
      setCopiedField(null);
      copyFeedbackTimer.current = null;
    }, 1500);
  };

  React.useEffect(() => () => { if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current); }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white font-sans overflow-hidden animate-pulse">
        <div className="p-6 md:p-8 pb-4">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-slate-100 rounded w-24" />
              <div className="h-10 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="size-16 bg-slate-50 rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="h-24 bg-slate-50 rounded-xl" />
            <div className="h-24 bg-slate-50 rounded-xl" />
            <div className="h-24 bg-slate-50 rounded-xl" />
          </div>
          <div className="h-32 bg-slate-900/5 rounded-2xl mb-8" />
          <div className="h-8 bg-slate-50 rounded w-1/2 mb-6" />
          <div className="h-64 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 p-6 text-center bg-white">
        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <span className="material-symbols-outlined text-4xl">person_search</span>
        </div>
        <p className="text-sm font-bold text-petroleum-900 uppercase tracking-tight">Hub de Comando</p>
        <p className="text-xs mt-1 text-slate-400">Selecione um lead para iniciar a inteligência.</p>
      </div>
    );
  }

  const potential = getLeadPotential(lead);

  return (
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
      {/* 1. Header & Quick Actions */}
      <div className="p-6 md:p-8 pb-4">
        <div className="flex justify-between items-start mb-10">
          <div className="min-w-0">
            <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              <Link to="/leads" className="hover:text-petroleum-600 transition-colors">Leads</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-petroleum-600">Comando do Lead</span>
            </nav>
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-petroleum-900 truncate tracking-tighter leading-none">{lead.name || 'Sem nome'}</h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onOpenDetail}
                  className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-petroleum-600 hover:border-petroleum/30 transition-all bg-white"
                  title="Ver Perfil Completo"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </button>
                <button
                  type="button"
                  className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-solar-500 hover:border-solar-500/30 transition-all bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[12px] font-medium">
              <div className="flex items-center gap-1.5 min-w-0 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <span className="material-symbols-outlined text-[16px] text-petroleum-600">location_on</span>
                <span className="truncate">{lead.location || 'Local não informado'}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton value={lead.email} label="e-mail" copied={copiedField === 'email'} onCopy={() => handleCopy('email')} />
                <CopyButton value={lead.phone} label="telefone" copied={copiedField === 'phone'} onCopy={() => handleCopy('phone')} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex bg-white rounded-xl p-3 border border-slate-200 shadow-sm items-center gap-4 group hover:border-petroleum/30 transition-all">
              <div className="relative size-12 flex items-center justify-center">
                <svg className="transform -rotate-90 size-12">
                  <circle className="text-slate-100" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeWidth="4"></circle>
                  <circle className="text-petroleum-600 transition-all duration-1000" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - 0.92)} strokeWidth="4" strokeLinecap="round"></circle>
                </svg>
                <span className="absolute text-[11px] font-bold text-petroleum-900">92</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">IA Scoring</span>
                <span className="text-[11px] font-bold text-petroleum-600 leading-none">Alta Propensão</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                {stageLabels[lead.status] || lead.status}
              </span>
            </div>
          </div>
        </div>

        {/* 2. BANT Scoring & Quick Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              icon="electric_meter"
              label="Consumo Médio"
              value={lead.consumption || '--'}
              unit="kWh/mês"
            />
            <MetricCard
              icon="solar_power"
              label="Painéis Est."
              value={lead.consumption ? Math.ceil(Number(lead.consumption) / 40) : '--'}
              unit="Unidades (550W)"
            />
            <MetricCard
              icon="savings"
              label="Econ. Anual Est."
              value={formatCurrencyCompact(potential)}
              unit="/ ano"
            />
          </div>

          <div className="lg:col-span-1 p-5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <span className="ds-label uppercase tracking-widest text-[9px]">Temperatura</span>
              <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px]">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                QUENTE
              </div>
            </div>
            <div className="space-y-3">
              <BantItem label="Fit" value={92} color="bg-emerald-500" />
              <BantItem label="Interest" value={85} color="bg-solar-500" />
            </div>
          </div>
        </div>

        {/* 3. AI Copilot Strategy Banner (Stitch Inspired) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-petroleum-900 to-[#1b5e6e] text-white p-6 md:p-8 mb-8 shadow-lg shadow-petroleum/10 group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
            <div className="flex gap-5 flex-1 min-w-0">
              <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner backdrop-blur-sm">
                <span className="material-symbols-outlined text-solar-500 text-[24px]">auto_awesome</span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-solar-400 mb-1 tracking-widest uppercase flex items-center gap-1.5 leading-none">
                  <span className="size-1 bg-solar-500 rounded-full animate-pulse"></span>
                  Estratégia Recomendada via IA
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">Agendar Reunião Técnica</h3>
                <p className="text-slate-300 text-[13px] leading-relaxed max-w-2xl font-medium">
                  {lead.name?.split(' ')[0]}, o lead demonstrou alto interesse técnico no Kit de {lead.consumption ? Math.ceil(Number(lead.consumption) / 40) : '8'}kW.
                  A IA detectou que uma reunião visual agora aumenta a chance de fecho em <span className="text-solar-400 font-bold">45%</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/proposals/new"
                state={lead?.id ? { leadId: lead.id } : undefined}
                className="group relative h-12 px-8 rounded-full bg-solar-500 hover:bg-solar-600 text-white font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-solar-500/20 active:scale-95 whitespace-nowrap overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="material-symbols-outlined text-[18px] relative z-10">bolt</span>
                <span className="relative z-10">Action Bridge</span>
              </Link>
              {onOpenCopilot && (
                <button
                  onClick={onOpenCopilot}
                  className="h-12 px-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all backdrop-blur-sm shadow-sm active:scale-95"
                  title="Abrir Chat com IA"
                >
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Content Tabs (Secondary) */}
        <div className="border-t border-slate-100 pt-6">
          <Tabs defaultValue="evolution" styles={{
            root: { border: 'none' },
            list: { borderBottom: 'none', gap: '24px', paddingLeft: 0 },
            tab: {
              padding: '8px 0',
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748b',
              backgroundColor: 'transparent',
              border: 'none',
              '&[data-active]': { color: '#0F4C5C', borderBottom: '2px solid #0F4C5C' },
              '&:hover': { backgroundColor: 'transparent', color: '#0F4C5C' }
            }
          }}>
            <Tabs.List>
              <Tabs.Tab value="evolution">Evolução / Chat</Tabs.Tab>
              <Tabs.Tab value="proposals">Histórico de Propostas</Tabs.Tab>
              <Tabs.Tab value="docs">Documentos</Tabs.Tab>
            </Tabs.List>

            <div className="py-6">
              <Tabs.Panel value="evolution">
                <div className="bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 min-h-[350px]">
                  <QuickChatPanel leadId={lead.id} />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="proposals">
                <div className="space-y-4">
                  {Array.isArray(lead.proposals) && lead.proposals.length > 0 ? (
                    lead.proposals.map(prop => (
                      <div key={prop.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-petroleum/20 transition-all flex justify-between items-center group cursor-pointer shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-petroleum-900 group-hover:text-petroleum-600 transition-colors uppercase tracking-tight leading-none mb-1">{prop.title || 'Proposta Solar'}</p>
                          <p className="text-[11px] text-slate-400 font-medium">Gerada em {new Date(prop.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-solar-600">R$ {prop.totalPrice?.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded uppercase">{prop.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center">
                      <span className="material-symbols-outlined text-slate-200 text-5xl mb-2">description</span>
                      <p className="text-xs text-slate-400">Nenhuma proposta gerada para este lead.</p>
                    </div>
                  )}
                </div>
              </Tabs.Panel>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function BantItem({ label, value, color = "bg-solar-500" }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit }) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-petroleum/30 transition-all shadow-sm group">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <span className="material-symbols-outlined text-solar-500 text-[18px] group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 ml-0.5">
        <span className="text-3xl font-bold text-petroleum-900 tracking-tighter leading-none tabular-nums">{value}</span>
        <span className="text-[11px] font-bold text-slate-400 tracking-wide">{unit}</span>
      </div>
    </div>
  );
}

