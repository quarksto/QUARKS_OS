import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePipelineData } from '../hooks/usePipelineData';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { PageContent } from '../components/dashboard/PageContent';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { LeadListTableRefactored } from '../components/dashboard/LeadListTableRefactored';
import { LeadsCommandBar } from '../components/dashboard/LeadsCommandBar';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
// Removed react-icons import as per DS v1.4

export default function LeadsPage() {
    const navigate = useNavigate();
    const { pipeline, loading, refresh } = usePipelineData();
    const [pipelineState, setPipelineState] = React.useState(pipeline);
    const [pipelineFilters, setPipelineFilters] = React.useState({
        temp: [],
        source: '',
        scoreMin: '',
        scoreMax: '',
    });
    const [pipelineView, setPipelineView] = React.useState('list'); // Default to list for premium feel
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLeadStage, setCreateLeadStage] = useState('NEW');
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        setPipelineState(pipeline);
    }, [pipeline]);

    const handleLeadClick = (lead) => {
        navigate(`/leads/${lead.id}`);
    };

    const handleCreateSuccess = () => {
        refresh();
        setIsCreateModalOpen(false);
    };

    const flatLeads = React.useMemo(() => {
        if (!pipelineState) return [];
        return Object.values(pipelineState).flat();
    }, [pipelineState]);

    const sourceOptions = React.useMemo(() => {
        if (!pipelineState) return [];
        return [...new Set(flatLeads.map(l => l.source).filter(Boolean))];
    }, [pipelineState, flatLeads]);

    const updateFilters = (partial) => {
        setPipelineFilters(prev => ({ ...prev, ...partial }));
    };

    const headerRight = (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => {
                    setCreateLeadStage('NEW');
                    setIsCreateModalOpen(true);
                }}
                className="h-8 px-4 rounded-full bg-solar hover:bg-amber-600 text-white flex items-center gap-2 font-bold text-[11px] transition-all shadow-none active:scale-95 uppercase tracking-wider"
            >
                <span className="material-symbols-outlined text-[18px] ds-icon-w300">add</span>
                Novo Lead
            </button>
        </div>
    );

    return (
        <DashboardShell
            title="Gestão de Leads"
            subtitle="Central de Prospecção"
            headerIcon="group"
            loading={loading}
            headerRight={headerRight}
        >
            <div className="flex-1 flex flex-col min-h-0 bg-canvas overflow-hidden p-6 gap-6">
                <div className="shrink-0 max-w-[1600px] mx-auto w-full">
                    <LeadsCommandBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        view={pipelineView}
                        onChangeView={setPipelineView}
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
                </div>

                <PageContent paddingBottomOnly className="flex flex-col min-h-0">
                    <div className="h-full min-h-0 flex flex-col">
                        {pipelineView === 'board' ? (
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
                        ) : (
                            <LeadListTableRefactored
                                leads={flatLeads.filter(l => {
                                    if (!searchTerm) return true;
                                    const q = searchTerm.toLowerCase();
                                    return l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q);
                                })}
                                loading={loading}
                                onLeadClick={handleLeadClick}
                                selectedLeadId={null}
                            />
                        )}
                    </div>
                </PageContent>
            </div>

            <CreateLeadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
                defaultStatus={createLeadStage}
            />
        </DashboardShell>
    );
}

