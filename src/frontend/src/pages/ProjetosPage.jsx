import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { ProjectKanbanBoard } from '../components/dashboard/ProjectKanbanBoard';
import { ProjectDetailModal } from '../components/dashboard/ProjectDetailModal';
import { useProjectData } from '../hooks/useProjectData';

export default function ProjetosPage() {
    const { kanban, loading, updateProjectStatus, refresh } = useProjectData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setIsDetailOpen(true);
    };

    const headerRight = (
        <div className="flex items-center gap-3">
            <div className="relative hidden md:block group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petroleum transition-colors text-[18px] ds-icon-w300">search</span>
                <input
                    type="text"
                    placeholder="BUSCAR PROJETOS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-9 pr-4 h-8 bg-white border border-slate-200 rounded-lg ds-meta !text-petroleum placeholder:text-slate-400 focus:outline-none focus:border-petroleum/60 transition-all font-sans font-bold uppercase"
                />
            </div>

            <button
                onClick={refresh}
                disabled={loading}
                className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all disabled:opacity-50"
                title="Recarregar dados"
            >
                <span className={`material-symbols-outlined text-[20px] ds-icon-w300 ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>

            <button
                className="bg-solar hover:bg-amber-600 text-petroleum px-4 h-8 rounded-full ds-meta font-black transition-all flex items-center gap-2 uppercase tracking-widest shadow-none"
            >
                <span className="material-symbols-outlined text-[18px] ds-icon-w300">add_circle</span>
                NOVO PROJETO
            </button>
        </div>
    );

    return (
        <DashboardShell
            title="Engenharia e Projetos"
            subtitle="Gestão Técnica de Instalações"
            headerIcon="engineering"
            loading={loading}
            headerRight={headerRight}
            breadcrumbs={[{ label: 'Engenharia' }, { label: 'Projetos' }]}
        >
            <div className="flex-1 flex flex-col min-h-0 bg-[#F1F5F9]/30 p-6 gap-6">
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h3 className="ds-label !text-petroleum mb-1 flex items-center gap-2 font-black uppercase tracking-widest">
                                    <span className="w-2.5 h-2.5 bg-solar rounded-full border border-solar shadow-[0_0_8px_rgba(255,182,0,0.4)]" />
                                    Fluxo de Execução
                                </h3>
                                <p className="ds-body !text-slate-500 !text-xs font-medium">Gestão de fases e cronograma técnico</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    <span className="ds-meta !text-slate-500 font-bold uppercase">Planejamento</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    <span className="ds-meta !text-slate-500 font-bold uppercase">Execução</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span className="ds-meta !text-slate-500 font-bold uppercase">Concluído</span>
                                </div>
                            </div>
                        </div>

                        <ProjectKanbanBoard
                            kanban={kanban}
                            onProjectClick={handleProjectClick}
                            onStatusChange={updateProjectStatus}
                        />
                    </div>
                </div>
            </div>

            <ProjectDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                project={selectedProject}
                onUpdate={refresh}
            />
        </DashboardShell>
    );
}
