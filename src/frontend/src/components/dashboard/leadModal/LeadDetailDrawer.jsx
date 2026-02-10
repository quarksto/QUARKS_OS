import React, { useState } from 'react';
import { ModalOverlay, ModalPanel, ModalHeader, ModalContent, ModalFooter } from '../../shared/ModalPrimitives';
import { LeadBasicsEditForm } from './LeadBasicsEditForm';
import { LeadQualificationForm } from '../LeadQualificationForm';
import { LeadTechnicalSheet } from '../LeadTechnicalSheet';

/**
 * LeadDetailDrawer — DS v1.4 Side Drawer para Edição.
 * Escolhido como o mais adequado para manter contexto de KPIs enquanto edita.
 */
export const LeadDetailDrawer = ({ lead, isOpen, onClose, onSave, loading }) => {
    const [editedLead, setEditedLead] = useState(lead);
    const [activeSection, setActiveSection] = useState('profile'); // 'profile', 'basics' ou 'qualification'

    // Sincroniza estado local quando o lead muda ou abre
    React.useEffect(() => {
        if (isOpen) setEditedLead(lead);
    }, [isOpen, lead]);

    const handleInputChange = (field, value) => {
        setEditedLead(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(editedLead);
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-none border-l border-slate-200 animate-slide-left p-0 flex flex-col z-[101]">
                {/* Header Customizado para o Drawer */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-petroleum ds-icon-w300 text-[22px]">
                                {activeSection === 'basics' ? 'edit_note' : 'home_work'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight">
                                {activeSection === 'profile' ? 'Perfil do Lead' : activeSection === 'basics' ? 'Editar Informações Básicas' : 'Qualificação Técnica'}
                            </h2>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">Lead: {lead?.name}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-[24px] ds-icon-w300">close</span>
                    </button>
                </div>

                {/* Seletor de Seção Compacto */}
                <div className="flex gap-1 p-2 bg-slate-50 mx-8 mt-6 rounded-lg border border-slate-100">
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`flex-1 h-8 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'profile' ? 'bg-white text-petroleum shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Perfil
                    </button>
                    <button
                        onClick={() => setActiveSection('basics')}
                        className={`flex-1 h-8 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'basics' ? 'bg-white text-petroleum shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Básicos
                    </button>
                    <button
                        onClick={() => setActiveSection('qualification')}
                        className={`flex-1 h-8 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeSection === 'qualification' ? 'bg-white text-petroleum shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Qualificação
                    </button>
                </div>

                <ModalContent className="px-8 pb-32">
                    {activeSection === 'profile' && (
                        <div className="py-4">
                            <LeadTechnicalSheet
                                lead={editedLead}
                                hideNameHeader={true}
                                onUpdate={onSave}
                            />
                        </div>
                    )}
                    {activeSection === 'basics' && (
                        <LeadBasicsEditForm lead={editedLead} onChange={handleInputChange} />
                    )}
                    {activeSection === 'qualification' && (
                        <div className="animate-fade-in py-4">
                            <LeadQualificationForm
                                lead={editedLead}
                                onChange={handleInputChange}
                                isDrawer={true}
                            />
                        </div>
                    )}
                </ModalContent>

                <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3 z-[102]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-8 border border-slate-200 text-slate-500 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-[2] h-8 bg-petroleum text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-petroleum/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-none border border-transparent"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px] ds-icon-w300">save</span>
                                Salvar Lead
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ModalOverlay>
    );
};
