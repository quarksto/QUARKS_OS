import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { LeadPipelineFilters } from '../components/dashboard/LeadPipelineFilters';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { LeadDetailModal } from '../components/dashboard/LeadDetailModal';
import { MdSearch, MdAdd, MdViewKanban } from 'react-icons/md';

export default function LeadsPage() {
    const { pipeline, loading, refresh } = useDashboardData();
    const [pipelineState, setPipelineState] = React.useState(pipeline);
    const [pipelineFilters, setPipelineFilters] = React.useState({
        temp: [],
        source: '',
        scoreMin: '',
        scoreMax: '',
    });
    const [pipelineView, setPipelineView] = React.useState('board');
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLeadStage, setCreateLeadStage] = useState('NEW');
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        setPipelineState(pipeline);
    }, [pipeline]);

    const handleLeadClick = (lead) => {
        setSelectedLead(lead);
        setIsDetailOpen(true);
    };

    const handleCreateSuccess = () => {
        refresh();
        window.location.reload();
    };

    // Calculate total leads count and options
    const totalLeads = pipelineState
        ? Object.values(pipelineState).reduce((acc, leads) => acc + (leads?.length || 0), 0)
        : 0;

    const sourceOptions = React.useMemo(() => {
        if (!pipelineState) return [];
        const all = Object.values(pipelineState).flat();
        return [...new Set(all.map(l => l.source).filter(Boolean))];
    }, [pipelineState]);

    const updateFilters = (partial) => {
        setPipelineFilters(prev => ({ ...prev, ...partial }));
    };

    const headerRight = (
        <div className="flex items-center gap-4">
            <div className="relative hidden md:block group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petroleum transition-colors">
                    <MdSearch size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-petroleum/60 transition-all font-sans"
                />
            </div>

            <LeadPipelineFilters
                tempFilter={pipelineFilters.temp}
                onToggleTemp={(id) => {
                    const exists = pipelineFilters.temp.includes(id);
                    updateFilters({
                        temp: exists
                            ? pipelineFilters.temp.filter(t => t !== id)
                            : [...pipelineFilters.temp, id]
                    });
                }}
                onClearTemp={() => updateFilters({ temp: [] })}
                sourceFilter={pipelineFilters.source}
                onSourceChange={(val) => updateFilters({ source: val })}
                sourceOptions={sourceOptions}
                scoreMin={pipelineFilters.scoreMin}
                scoreMax={pipelineFilters.scoreMax}
                onScoreMinChange={(val) => updateFilters({ scoreMin: val })}
                onScoreMaxChange={(val) => updateFilters({ scoreMax: val })}
            />

            <button
                type="button"
                onClick={() => {
                    setCreateLeadStage('NEW');
                    setIsCreateModalOpen(true);
                }}
                className="rounded-lg bg-solar-500 hover:bg-solar-600 text-white px-4 py-2 flex items-center gap-2 font-bold text-[11px] transition-all shadow-sm active:scale-95 uppercase tracking-wider"
            >
                <MdAdd size={18} />
                Novo Lead
            </button>
        </div>
    );

    return (
        <DashboardShell
            title="Gestão de Leads"
            subtitle="Pipeline de Vendas"
            headerIcon={<MdViewKanban size={24} />}
            loading={loading}
            headerRight={headerRight}
            breadcrumbs={[{ label: 'Comercial' }, { label: 'Leads' }]}
        >
            <div className="flex-1 flex flex-col min-h-0 bg-[#F1F5F9]/50">
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <KanbanBoard
                            pipeline={pipelineState || {}}
                            onPipelineChange={setPipelineState}
                            filters={pipelineFilters}
                            onFiltersChange={setPipelineFilters}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            view={pipelineView}
                            onChangeView={setPipelineView}
                            onRequestCreateLead={(stage) => {
                                setCreateLeadStage(stage);
                                setIsCreateModalOpen(true);
                            }}
                            onLeadClick={handleLeadClick}
                        />
                    </div>
                </div>
            </div>

            <CreateLeadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                defaultStatus={createLeadStage}
            />

            <LeadDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                lead={selectedLead}
            />
        </DashboardShell>
    );
}

