import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { ProjectKanbanBoard } from '../components/dashboard/ProjectKanbanBoard';
import { ProjectDetailModal } from '../components/dashboard/ProjectDetailModal';
import { useProjectData } from '../hooks/useProjectData';
import { Text, Badge, Button, Group, ActionIcon, Tooltip } from '@mantine/core';

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
        <Group gap="sm">
            <div className="relative hidden md:block group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petroleum transition-colors text-[20px]">search</span>
                <input
                    type="text"
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-petroleum/60 transition-all font-sans"
                />
            </div>

            <Tooltip label="Recarregar dados">
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={refresh}
                    loading={loading}
                    className="rounded-lg"
                >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                </ActionIcon>
            </Tooltip>

            <Button
                variant="filled"
                color="petroleum"
                leftSection={<span className="material-symbols-outlined text-[18px]">add_circle</span>}
                className="rounded-lg font-bold text-[11px] uppercase tracking-wider h-9"
            >
                Novo Projeto
            </Button>
        </Group>
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
            <div className="flex-1 flex flex-col min-h-0 bg-[#F1F5F9]/50">
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <Text size="sm" fw={700} className="text-petroleum-900 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-solar-500 rounded-full animate-pulse" />
                                    Fluxo de Execução
                                </Text>
                                <Text size="xs" className="text-slate-500 font-medium">Arraste os cards para atualizar a fase da obra</Text>
                            </div>

                            <Group gap="xs">
                                <Badge variant="dot" color="blue" size="sm">Planejamento</Badge>
                                <Badge variant="dot" color="orange" size="sm">Em Execução</Badge>
                                <Badge variant="dot" color="green" size="sm">Finalizado</Badge>
                            </Group>
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
