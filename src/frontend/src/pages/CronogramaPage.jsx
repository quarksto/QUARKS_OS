import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useProjectData } from '../hooks/useProjectData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_LABELS = {
    PLANNED: 'Planejamento',
    SURVEYING: 'Vistoria',
    TECHNICAL_STUDY: 'Estudo Técnico',
    APPROVED: 'Aprovado',
    INSTALLING: 'Em Instalação',
    COMPLETED: 'Concluído',
};

/* DS §2.4: Badges em Outline (border + text), sem fundo sólido */
const STATUS_COLORS = {
    PLANNED: 'border border-slate-200 text-slate-700 bg-white',
    SURVEYING: 'border border-blue-200 text-blue-700 bg-white',
    TECHNICAL_STUDY: 'border border-amber-200 text-amber-700 bg-white',
    APPROVED: 'border border-emerald-200 text-emerald-700 bg-white',
    INSTALLING: 'border border-solar-200 text-solar-700 bg-white',
    COMPLETED: 'border border-petroleum-200 text-petroleum-700 bg-white',
};

export default function CronogramaPage() {
    const { projects, loading, error } = useProjectData();
    const [filterStatus, setFilterStatus] = useState('');

    const filtered = React.useMemo(() => {
        if (!filterStatus) return projects;
        return projects.filter((p) => p.status === filterStatus);
    }, [projects, filterStatus]);

    const headerRight = (
        <div className="flex items-center gap-3">
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-8 px-4 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-700 uppercase tracking-widest focus:outline-none focus:border-petroleum"
            >
                <option value="">Todos os status</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <Link
                to="/projetos"
                className="h-8 px-4 rounded-full bg-petroleum hover:bg-petroleum-700 text-white flex items-center gap-2 font-bold text-[11px] transition-all uppercase tracking-wider"
            >
                <span className="material-symbols-outlined text-[18px] ds-icon-w300" aria-hidden>open_in_new</span>
                Ver Kanban Completo
            </Link>
        </div>
    );

    return (
        <DashboardShell
            title="Cronograma"
            subtitle="Planejamento de Instalações"
            headerIcon="calendar_today"
            loading={loading}
            headerRight={headerRight}
            breadcrumbs={[{ label: 'Engenharia' }, { label: 'Cronograma' }]}
        >
            <div className="p-4 md:p-8 max-w-[1200px] mx-auto h-full overflow-y-auto">
                {error && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                        {error}
                    </div>
                )}

                {filtered.length === 0 && !loading ? (
                    <div className="technical-card p-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block ds-icon-w300" aria-hidden>event_busy</span>
                        <p className="ds-body text-slate-600 mb-4">
                            Nenhum projeto de instalação no momento.
                        </p>
                        <Link
                            to="/projetos"
                            className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-solar hover:bg-amber-600 text-white font-bold text-[11px] uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-[18px] ds-icon-w300" aria-hidden>add_circle</span>
                            Ir para Projetos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="ds-title-section text-slate-800">
                                Instalações agendadas
                            </h2>
                            <span className="ds-label text-slate-500">
                                {filtered.length} {filtered.length === 1 ? 'projeto' : 'projetos'}
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {filtered.map((project) => (
                                <Link
                                    key={project.id}
                                    to="/projetos"
                                    className="technical-card p-4 flex items-center justify-between gap-4 hover:border-petroleum/30 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-lg bg-petroleum/5 flex items-center justify-center shrink-0 group-hover:bg-petroleum/10 transition-colors">
                                            <span className="material-symbols-outlined text-petroleum text-[24px] ds-icon-w300">
                                                solar_power
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {project.name}
                                            </p>
                                            <p className="ds-label text-slate-500">
                                                {project.lead?.name ?? 'Lead sem nome'} • {project.lead?.location ?? 'Local não informado'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[project.status] ?? 'border border-slate-200 text-slate-600 bg-white'}`}>
                                            {STATUS_LABELS[project.status] ?? project.status}
                                        </span>
                                        <span className="ds-label text-slate-400 hidden sm:block">
                                            {format(new Date(project.updatedAt), "d 'de' MMM", { locale: ptBR })}
                                        </span>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-petroleum transition-colors ds-icon-w300" aria-hidden>chevron_right</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}
