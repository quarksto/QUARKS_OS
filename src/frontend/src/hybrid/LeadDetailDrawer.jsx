import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getStageLabel } from '../utils/pipeline';
import { formatCurrencyCompact, getLeadPotential } from '../utils/pipeline';
import { LeadBasicsEditForm } from '../components/dashboard/leadModal/LeadBasicsEditForm';

function CopyButton({ value, onCopy, label, copied }) {
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(value).then(() => onCopy?.())}
      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-petroleum-600"
      title={copied ? 'Copiado!' : `Copiar ${label}`}
      aria-label={copied ? 'Copiado' : `Copiar ${label}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{copied ? 'check' : 'content_copy'}</span>
    </button>
  );
}

export function LeadDetailDrawer({ open, lead, loading, onClose, onUpdate }) {
  const [copiedField, setCopiedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(null);
  const [saving, setSaving] = useState(false);
  const copyTimerRef = useRef(null);

  const handleCopy = (field) => {
    setCopiedField(field);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => { setCopiedField(null); copyTimerRef.current = null; }, 1500);
  };

  useEffect(() => {
    if (open && lead) {
      setEditedLead({ ...lead });
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [open, lead]);

  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isEditing) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, isEditing]);

  const handleSave = async () => {
    if (!onUpdate || !lead?.id) return;
    setSaving(true);
    try {
      await onUpdate(lead.id, editedLead);
      setIsEditing(false);
    } catch (e) {
      alert('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  const potential = lead ? getLeadPotential(lead) : 0;
  const proposals = lead?.proposals ?? [];
  const hasProposals = Array.isArray(proposals) && proposals.length > 0;
  const activities = Array.isArray(lead?.activity) ? lead.activity : [];

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/30 z-40 transition-opacity"
        onClick={isEditing ? undefined : onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col transition-transform duration-200 ease-out"
        aria-modal="true"
        aria-label="Detalhe do lead"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-petroleum-900 truncate pr-4">
              {loading ? 'Carregando...' : (lead?.name || 'Sem nome')}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ficha Técnica do Lead</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && lead && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-petroleum-600 transition-colors"
                title="Editar Lead"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-3xl mb-4">progress_activity</span>
              <p className="text-xs font-bold uppercase tracking-widest">Sincronizando...</p>
            </div>
          ) : lead ? (
            <>
              {isEditing ? (
                <div className="space-y-6">
                  <LeadBasicsEditForm lead={editedLead} onChange={handleInputChange} />
                  <div className="flex gap-3 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 h-11 rounded-xl bg-petroleum text-white font-bold text-xs uppercase tracking-widest hover:bg-petroleum-900 transition-all shadow-lg shadow-petroleum/20 flex items-center justify-center gap-2"
                    >
                      {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-[18px]">check</span>}
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-8">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      {getStageLabel(lead.status)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 ml-auto">
                      ID: {lead.id?.substring(0, 8)}...
                    </span>
                  </div>

                  <section className="mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">contact_page</span>
                      Canais de Contato
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {lead.email && (
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">mail</span>
                            <span className="text-sm font-medium text-slate-700">{lead.email}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CopyButton value={lead.email} label="e-mail" copied={copiedField === 'email'} onCopy={() => handleCopy('email')} />
                          </div>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 group">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">phone</span>
                            <span className="text-sm font-medium text-slate-700">{lead.phone}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyButton value={lead.phone} label="telefone" copied={copiedField === 'phone'} onCopy={() => handleCopy('phone')} />
                            </div>
                            {(() => {
                              const digits = lead.phone.replace(/\D/g, '');
                              return (
                                <a href={`https://wa.me/55${digits}`} target="_blank" rel="noopener noreferrer" className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-sm">
                                  <span className="material-symbols-outlined text-[18px]">chat</span>
                                </a>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="mb-8">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">analytics</span>
                      Diagnóstico Energético
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consumo</p>
                        <p className="text-xl font-bold text-petroleum-900">{lead.consumption || '0'} <span className="text-xs font-medium text-slate-400">kWh</span></p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Potencial</p>
                        <p className="text-xl font-bold text-solar-600">{formatCurrencyCompact(potential)} <span className="text-xs font-medium text-slate-400">/ano</span></p>
                      </div>
                    </div>
                  </section>

                  {activities.length > 0 && (
                    <section className="mb-8">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">history</span>
                        Atividades Recentes
                      </h3>
                      <div className="relative pl-3 space-y-6">
                        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-100" />
                        {activities.slice(0, 5).map((a, i) => (
                          <div key={a.id || i} className="relative pl-6">
                            <div className="absolute left-[-11px] top-1.5 size-4 rounded-full bg-white border-2 border-slate-200 z-10" />
                            <div className="flex flex-col">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-700">{a.title || a.type}</span>
                                <span className="text-[10px] text-slate-400">{format(new Date(a.date), "dd/MM")}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{a.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
                    <Link
                      to={`/leads/${lead.id}`}
                      className="h-12 w-full rounded-xl bg-white border border-slate-200 text-petroleum-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      Ver Perfil Executivo
                    </Link>
                    <p className="text-center text-[10px] font-medium text-slate-400">
                      O Perfil Executivo contém detalhes de qualificação técnica e anexos.
                    </p>
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}
