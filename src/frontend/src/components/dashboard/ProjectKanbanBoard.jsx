import React, { useState } from 'react';
import { StandardAvatar } from '../ui/StandardAvatar';

/* DS: marcador de coluna em modo outline; bordas slate-200 */
const columns = [
    { title: 'Planejamento', id: 'PLANNED', borderDot: 'border-cyan-400' },
    { title: 'Vistoria', id: 'SURVEYING', borderDot: 'border-amber-400' },
    { title: 'Estudo Técnico', id: 'TECHNICAL_STUDY', borderDot: 'border-slate-300' },
    { title: 'Aprovado', id: 'APPROVED', borderDot: 'border-emerald-400' },
    { title: 'Instalação', id: 'INSTALLING', borderDot: 'border-orange-400' },
    { title: 'Concluído', id: 'COMPLETED', borderDot: 'border-slate-300' },
];

const ProjectCard = ({ project, onClick, onDragStart }) => {
    const technician = project.technician;
    const clientName = project.lead?.name || project.clientName || 'Cliente';
    const avatarName = clientName;
    const avatarSrc = project.lead?.avatarUrl || project.lead?.photoUrl;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, project)}
            onClick={() => onClick(project)}
            className="group bg-white p-4 rounded-lg border border-slate-200 shadow-none hover:border-slate-300 transition-all duration-200 cursor-pointer relative overflow-hidden active:scale-[0.98]"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                    <StandardAvatar
                        name={avatarName}
                        src={avatarSrc}
                        size="md"
                        className="bg-slate-50 text-slate-500 border border-slate-100"
                    />
                    <div className="min-w-0">
                        <h4 className="ds-label !text-petroleum normal-case font-bold leading-tight line-clamp-1 mb-0.5">{project.name}</h4>
                        <span className="ds-meta !text-slate-400 font-bold tracking-tighter uppercase">
                            ID: {project.id?.substring(0, 8).toUpperCase() || 'N/A'}
                        </span>
                    </div>
                </div>
                <button type="button" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-300 hover:text-petroleum rounded-full size-8 flex items-center justify-center hover:bg-slate-50 border border-transparent" aria-label="Mais ações">
                    <span className="material-symbols-outlined text-[18px] ds-icon-w300">more_vert</span>
                </button>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
                <span className="material-symbols-outlined text-[15px] text-slate-300 ds-icon-w300">location_on</span>
                <span className="ds-body !text-slate-500 !text-[12px] truncate">
                    {project.lead?.location || project.location || 'Localização não definida'}
                </span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-petroleum/40 ds-icon-w300">engineering</span>
                    <span className="ds-meta !text-slate-500 font-bold truncate max-w-[110px] uppercase">
                        {technician?.name || 'SEM TÉCNICO'}
                    </span>
                </div>
                {project.deadline && (
                    <span className="ds-meta !text-slate-400 font-bold uppercase tabular-nums bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        {new Date(project.deadline).toLocaleDateString('pt-BR')}
                    </span>
                )}
            </div>
        </div>
    );
};

export const ProjectKanbanBoard = ({ kanban, onProjectClick, onStatusChange }) => {
    const [dragOverColId, setDragOverColId] = useState(null);

    const handleDragStart = (e, project, sourceColId) => {
        e.dataTransfer.setData('projectId', project.id);
        e.dataTransfer.setData('sourceCol', sourceColId);
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        setDragOverColId(colId);
    };

    const handleDragLeave = (e) => {
        setDragOverColId(null);
    };

    const handleDrop = (e, targetColId) => {
        e.preventDefault();
        setDragOverColId(null);
        const projectId = e.dataTransfer.getData('projectId');
        const sourceColId = e.dataTransfer.getData('sourceCol');

        if (sourceColId === targetColId) return;

        if (onStatusChange) {
            onStatusChange(projectId, targetColId);
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide h-full items-start">
            {columns.map((col) => {
                const projects = kanban[col.id] || [];
                const count = projects.length;
                const isDragOver = dragOverColId === col.id;

                return (
                    <div
                        key={col.id}
                        className={`flex flex-col w-[320px] shrink-0 h-full rounded-xl border border-slate-100/60 bg-slate-50/10 p-3 transition-colors duration-200 ${isDragOver ? 'bg-slate-100/50 ring-2 ring-solar/30 border-solar/20' : ''}`}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={(e) => handleDragLeave(e)}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between mb-5 px-1 pt-1">
                            <div className="flex items-center gap-2.5">
                                <div className={`size-2.5 rounded-full border-2 bg-transparent ${col.borderDot || 'border-slate-200'}`} aria-hidden="true" />
                                <h3 className="ds-meta !text-petroleum font-black uppercase tracking-[0.1em]">{col.title}</h3>
                            </div>
                            <span className="ds-meta !text-slate-400 font-black bg-white border border-slate-100 size-6 flex items-center justify-center rounded-full tabular-nums">
                                {count}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 px-0.5 pb-4 overflow-y-auto scrollbar-hide">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={onProjectClick}
                                    onDragStart={(e) => handleDragStart(e, project, col.id)}
                                />
                            ))}
                            {projects.length === 0 && (
                                <div className="h-28 rounded-xl border border-dashed border-slate-200/60 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/20">
                                    <span className="material-symbols-outlined text-[20px] text-slate-200 ds-icon-w300">work_outline</span>
                                    <span className="ds-meta !text-slate-300 font-bold uppercase tracking-widest">Sem projetos</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
