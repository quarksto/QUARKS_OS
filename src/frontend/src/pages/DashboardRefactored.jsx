import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { DashboardRightSidebar } from '../components/dashboard/DashboardRightSidebar';
import { ConsumptionChartWidget } from '../components/dashboard/ConsumptionChartWidget';
import { RecentActivityList } from '../components/dashboard/RecentActivityList';
import { FunnelWidget } from '../components/dashboard/FunnelWidget';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { LeadDetailModal } from '../components/dashboard/LeadDetailModal';
import { InsightBar } from '../components/dashboard/InsightBar';
import { useCopilot } from '../context/CopilotContext';

/*
 * DashboardRefactored — DS v1, ref. specs/02-dashboard-refactor-stitch, docs/DASHBOARD_STITCH_MCP.md
 */
export default function DashboardRefactored() {
    const { metrics, pipeline, activity, funnel, loading } = useDashboardData();
    const { isOpen, toggleSidebar } = useCopilot();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [createLeadStage, setCreateLeadStage] = useState('NEW');
    const [pipelineState, setPipelineState] = useState(pipeline);
    const [pipelineFilters, setPipelineFilters] = useState({
        temp: [],
        source: '',
        scoreMin: '',
        scoreMax: '',
    });
    const [pipelineView, setPipelineView] = useState('board');

    useEffect(() => {
        setPipelineState(pipeline);
    }, [pipeline]);
    const navigate = useNavigate();

    const handleLeadClick = (lead) => {
        setSelectedLead(lead);
        setIsDetailOpen(true);
    };

    const headerRight = (
        <button
            type="button"
            onClick={() => {
                setCreateLeadStage('NEW');
                setIsCreateModalOpen(true);
            }}
            className="rounded-full bg-[#F59E0B] hover:bg-solar-600 text-[#FFFFFF] px-3 py-1.5 flex items-center gap-2 font-bold text-[10px] transition-colors"
        >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            NOVO NEGÓCIO
        </button>
    );

    return (
        <DashboardShell
            title="Dashboard"
            subtitle="Solar Integrator 4.0"
            loading={loading}
            headerIcon="grid_view"
            headerRight={headerRight}
        >
            <InsightBar onViewDetails={() => toggleSidebar()} />
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-0 relative scroll-smooth">
                    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                        <KpiGrid
                            metrics={metrics}
                            onNavigate={(target) => navigate(`/${target}`)}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <ConsumptionChartWidget />
                            <RecentActivityList
                                activity={activity}
                                loading={loading}
                                onNavigate={(item) => {
                                    if (item.type === 'proposal') {
                                        navigate('/proposals');
                                    } else {
                                        // For others, assume it's lead related
                                        handleLeadClick({ id: item.id, name: item.title });
                                    }
                                }}
                            />
                        </div>

                        <div className="mb-8">
                            <FunnelWidget data={funnel} loading={loading} />
                        </div>

                        <KanbanBoard
                            pipeline={pipelineState || {}}
                            onPipelineChange={setPipelineState}
                            filters={pipelineFilters}
                            onFiltersChange={setPipelineFilters}
                            view={pipelineView}
                            onChangeView={setPipelineView}
                            onRequestCreateLead={(stage) => {
                                setCreateLeadStage(stage);
                                setIsCreateModalOpen(true);
                            }}
                            onLeadClick={handleLeadClick}
                        />
                    </div>
                    <div className="h-20 w-full" />
                </div>
            </div>

            <CreateLeadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => window.location.reload()}
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
