import React, { useState } from 'react';
import { StandardAvatar } from '../ui/StandardAvatar';
import { MdOutlineMoreVert, MdLocationOn, MdEngineering, MdArchive, MdBusiness, MdChevronRight } from 'react-icons/md';

const columns = [
    { title: 'Planejamento', id: 'PLANNED', color: 'blue', accent: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200' },
    { title: 'Vistoria', id: 'SURVEYING', color: 'amber', accent: 'bg-amber-400', text: 'text-amber-700', border: 'border-amber-200' },
    { title: 'Estudo Técnico', id: 'TECHNICAL_STUDY', color: 'cyan', accent: 'bg-cyan-500', text: 'text-cyan-700', border: 'border-cyan-200' },
    { title: 'Aprovado', id: 'APPROVED', color: 'emerald', accent: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' },
    { title: 'Instalação', id: 'INSTALLING', color: 'orange', accent: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-200' },
    { title: 'Concluído', id: 'COMPLETED', color: 'slate', accent: 'bg-slate-400', text: 'text-slate-700', border: 'border-slate-200' },
];

const ProjectCard = ({ project, onClick, onDragStart }) => {
    // Determine avatar source (Technician or Lead/Client)
    // Priority: Technician (since it's a project task usually assigned to someone) -> Client
    const technician = project.technician;
    const clientName = project.lead?.name || project.clientName || 'Cliente';

    // If technician is assigned, show their avatar. If not, maybe show Client avatar?
    // Actually, Projects are usually "Who is working on this?".
    // Let's show Technician if exists, otherwise "Unassigned" avatar placeholder.
    // Or we can show the Client avatar to identify WHICH project it is.
    // Let's show Client Avatar as the main identifier, and Technician as a small tag/icon.
    // This matches the Leads Kanban where the Card = The Customer/Deal.

    const avatarName = clientName;
    const avatarSrc = project.lead?.avatarUrl || project.lead?.photoUrl;

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, project)}
            onClick={() => onClick(project)}
            className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                    <StandardAvatar
                        name={avatarName}
                        src={avatarSrc}
                        size="md"
                        className="bg-slate-100 text-slate-600"
                    />
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">{project.name}</h4>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            ID: {project.id?.substring(0, 8).toUpperCase() || 'N/A'}
                        </span>
                    </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600 rounded-full p-1 hover:bg-slate-100">
                    <MdOutlineMoreVert size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2 mb-3 px-1">
                <MdLocationOn size={16} className="text-slate-400" />
                <span className="text-slate-600 text-xs font-medium truncate">
                    {project.lead?.location || project.location || 'Localização não definida'}
                </span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                    <MdEngineering size={16} />
                    <span className="text-[11px] font-semibold truncate max-w-[120px]">
                        {technician?.name || 'Sem técnico'}
                    </span>
                </div>
                {project.deadline && (
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
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
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-custom h-full items-start px-1">
            {columns.map((col) => {
                const projects = kanban[col.id] || [];
                const count = projects.length;
                const isDragOver = dragOverColId === col.id;

                return (
                    <div
                        key={col.id}
                        className={`flex flex-col w-[340px] shrink-0 h-full rounded-2xl transition-colors duration-200 ${isDragOver ? 'bg-slate-50 ring-2 ring-indigo-500/20' : ''}`}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={(e) => handleDragLeave(e)}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <div className={`size-3 rounded-full ${col.accent.replace('bg-', 'bg-')} shadow-sm`}></div>
                                <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border ${col.border} ${col.text} shadow-sm`}>
                                    {count}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 px-1 pb-4 overflow-y-auto custom-scrollbar">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={onProjectClick}
                                    onDragStart={(e) => handleDragStart(e, project, col.id)}
                                />
                            ))}
                            {projects.length === 0 && (
                                <div className="h-32 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-2 bg-slate-50/30">
                                    <MdBusiness size={24} className="opacity-50" />
                                    <span className="text-xs font-medium">Sem projetos</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
