import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getStageLabel } from '../utils/pipeline';
import { formatCurrencyCompact, getLeadPotential } from '../utils/pipeline';
import { LeadBasicsEditForm } from '../components/dashboard/leadModal/LeadBasicsEditForm';
import { LeadTechnicalSheet } from '../components/dashboard/LeadTechnicalSheet';

function CopyButton({ value, onCopy, label, copied }) {
  if (!value) return null;
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(value).then(() => onCopy?.())}
      className="size-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-petroleum transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer"
      title={copied ? 'Copiado!' : `Copiar ${label}`}
      aria-label={copied ? 'Copiado' : `Copiar ${label}`}
    >
      <span className="material-symbols-outlined ds-icon-w300 text-[16px]">{copied ? 'check' : 'content_copy'}</span>
    </button>
  );
}

/**
 * LeadDetailDrawer — Refatorado para Design System v1.4.
 * Estética "Super Flat", h-8 padrão interativo, backdrop light blur.
 */
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
      console.error('Erro ao salvar lead:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  const potential = lead ? getLeadPotential(lead) : 0;
  const activities = Array.isArray(lead?.activity) ? lead.activity : [];

  return (
    <>
      {/* Backdrop — DS §4: overlay bg-slate-900/20; ui-ux-pro-max: cursor-pointer em clicáveis */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[60] transition-opacity duration-200 cursor-pointer"
        onClick={isEditing ? undefined : onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-200 z-[70] flex flex-col transition-transform duration-200 ease-out shadow-none animate-slide-in-right rounded-l-lg overflow-hidden"
        aria-modal="true"
        aria-label="Detalhe do lead"
      >
        {/* Header — DS §14.1/14.2: ícone rounded-lg bg-slate-50 border-slate-100; título Slate 700; subtítulo Caps; ui-ux: cursor-pointer + transition */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 shrink-0" aria-hidden="true">
              <span className="material-symbols-outlined text-[20px] text-petroleum ds-icon-w300" aria-hidden="true">person</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="ds-title-section text-slate-700 truncate">
                {loading ? 'Carregando...' : (lead?.name || 'Sem nome')}
              </h2>
              <p className="text-meta text-slate-500 mt-0.5">Ficha Técnica</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isEditing && lead && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-100 text-slate-500 hover:text-petroleum transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer"
                title="Editar Lead"
                aria-label="Editar lead"
              >
                <span className="material-symbols-outlined ds-icon-w300 text-[20px]" aria-hidden="true">edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined ds-icon-w300 text-[20px]" aria-hidden="true">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <span className="material-symbols-outlined animate-spin text-3xl mb-4 ds-icon-w300 text-petroleum">progress_activity</span>
              <p className="text-meta">Sincronizando...</p>
            </div>
          ) : lead ? (
            <>
              {isEditing ? (
                <div className="space-y-6">
                  <LeadBasicsEditForm lead={editedLead} onChange={handleInputChange} />
                  <div className="flex gap-3 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 h-8 rounded-full border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 h-8 rounded-full bg-solar text-white text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleum/50 focus-visible:ring-offset-2 shadow-none cursor-pointer"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined ds-icon-w300 text-[18px]">check</span>
                      )}
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <LeadTechnicalSheet
                  lead={lead}
                  hideNameHeader
                  onUpdate={onUpdate}
                  onAIPress={() => {
                    // Feedback visual ou trigger de ação IA
                    console.log('IA Triggered for lead:', lead.id);
                  }}
                />
              )}
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}
