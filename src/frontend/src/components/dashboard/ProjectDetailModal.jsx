import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ModalOverlay, ModalPanel, ModalHeader, ModalContent, ModalFooter } from '../shared/ModalPrimitives';

/**
 * ProjectDetailModal — Refactored for Design System v1.4 (DS v1.4).
 * Displays project details, BOM items, and schedules.
 */
export const ProjectDetailModal = ({ isOpen, onClose, project }) => {
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isOpen || !project?.id) return;
            setLoading(true);
            try {
                const response = await api.get(`/projects/${project.id}`);
                setProjectData(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do projeto:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [isOpen, project]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'border-emerald-200 !text-emerald-600';
            case 'INSTALLING': return 'border-orange-200 !text-orange-600';
            case 'PLANNED': return 'border-cyan-200 !text-cyan-600';
            default: return 'border-slate-200 !text-slate-400';
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <ModalPanel maxWidth="max-w-4xl">
                <ModalHeader
                    title={project?.name || "Detalhes do Projeto"}
                    subtitle={`REF: ${project?.id?.slice(0, 8).toUpperCase() || '---'}`}
                    icon="architecture"
                    onClose={onClose}
                />

                <ModalContent className="bg-slate-50/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <span className="material-symbols-outlined animate-spin text-[36px] text-solar ds-icon-w300">sync</span>
                            <span className="ds-meta !text-slate-400 font-black uppercase tracking-[0.15em]">Sincronizando Dados...</span>
                        </div>
                    ) : projectData ? (
                        <div className="grid grid-cols-12 gap-8">
                            {/* Main Column */}
                            <div className="col-span-8 space-y-8">
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-none">
                                    <h3 className="ds-label !text-slate-300 mb-6 px-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">list_alt</span>
                                        ESCOPO E ITENS (BOM)
                                    </h3>
                                    <div className="space-y-3">
                                        {projectData.items?.length > 0 ? projectData.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 border border-slate-100/60 hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="ds-label !text-petroleum normal-case font-bold">{item.service?.name || 'Item do Sistema'}</span>
                                                    <span className="ds-meta !text-slate-400 font-bold uppercase tracking-tight">{item.service?.code || 'SKU-TECHNICAL'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="ds-label !text-petroleum/70 normal-case font-black">R$ {item.unitPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                    <div className="ds-meta !text-solar font-black uppercase tracking-widest mt-0.5">QTD: {item.quantity}</div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-12 flex flex-col items-center text-slate-200">
                                                <span className="material-symbols-outlined text-[40px] mb-2 ds-icon-w300">inventory_2</span>
                                                <span className="ds-meta !text-slate-300 font-bold uppercase tracking-widest">Lista de itens vazia</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="col-span-4 space-y-8">
                                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-none">
                                    <h3 className="ds-label !text-slate-300 mb-6 px-1 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">flag</span>
                                        Fase da Obra
                                    </h3>
                                    <div className={`px-4 py-2.5 rounded-full border bg-white ds-meta font-black uppercase tracking-[0.1em] text-center ${getStatusColor(projectData.status)}`}>
                                        {projectData.status?.replace('_', ' ')}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50">
                                        <h3 className="ds-label !text-slate-300 mb-6 px-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px] ds-icon-w300">event</span>
                                            Datas Importantes
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="ds-meta !text-slate-400 font-bold uppercase tracking-widest">Início Previsto</span>
                                                <span className="ds-label !text-petroleum/80 normal-case font-bold tabular-nums">
                                                    {projectData.startDate ? new Date(projectData.startDate).toLocaleDateString('pt-BR') : 'A DEFINIR'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="ds-meta !text-slate-400 font-bold uppercase tracking-widest">Prazo Final</span>
                                                <span className="ds-label !text-petroleum normal-case font-black tabular-nums">
                                                    {projectData.deadline ? new Date(projectData.deadline).toLocaleDateString('pt-BR') : 'A DEFINIR'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <span className="material-symbols-outlined text-[48px] text-slate-100 mb-4">error_outline</span>
                            <div className="ds-meta !text-slate-400 font-bold uppercase tracking-widest">Dados não carregados.</div>
                        </div>
                    )}
                </ModalContent>

                <ModalFooter className="bg-white border-t border-slate-100 gap-3">
                    <button
                        onClick={onClose}
                        className="h-9 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 ds-meta font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        FECHAR
                    </button>
                    <button
                        className="h-9 px-8 rounded-full bg-solar hover:bg-amber-600 text-petroleum ds-meta font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-none"
                        onClick={() => window.open(`/projects/${project?.id}/manage`, '_blank')}
                    >
                        <span className="material-symbols-outlined text-[18px] ds-icon-w300">open_in_new</span>
                        GERENCIAR
                    </button>
                </ModalFooter>
            </ModalPanel>
        </ModalOverlay>
    );
};
