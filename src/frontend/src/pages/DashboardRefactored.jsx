import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { DashboardRightSidebar } from '../components/dashboard/DashboardRightSidebar';
import { SalesDashboardSolar } from '../components/dashboard/SalesDashboardSolar';
import { InsightBar } from '../components/dashboard/InsightBar';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { useCopilot } from '../context/CopilotContext';

/*
 * DashboardRefactored — DS v1.4 Command Center
 */
export default function DashboardRefactored() {
    const { metrics, activity, funnel, energyBalance, insight, loading } = useDashboardData();
    const { openSidebar } = useCopilot();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLeadStage, setCreateLeadStage] = useState('NEW');

    // ... (Handlers remain mostly same if needed for global actions) 

    const headerRight = (
        <button
            type="button"
            onClick={() => {
                setCreateLeadStage('NEW');
                setIsCreateModalOpen(true);
            }}
            className="rounded-full bg-solar hover:bg-amber-600 text-white h-8 px-4 flex items-center gap-2 font-bold text-[11px] transition-colors uppercase tracking-wider"
        >
            <span className="material-symbols-outlined text-[18px]">add</span>
            NOVO NEGÓCIO
        </button>
    );

    return (
        <DashboardShell
            title="Dashboard"
            subtitle="Visão Geral"
            loading={loading}
            headerIcon="grid_view"
            headerRight={headerRight}
        >
            <InsightBar
                insight={insight}
                onViewDetails={openSidebar}
            />
            {/* Render the new Command Center V2 */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <SalesDashboardSolar
                    metrics={metrics}
                    funnel={funnel}
                    activity={activity}
                    loading={loading}
                />
            </div>



            <CreateLeadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => window.location.reload()}
                defaultStatus={createLeadStage}
            />
        </DashboardShell >
    );
}
