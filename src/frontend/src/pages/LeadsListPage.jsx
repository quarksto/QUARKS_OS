import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { LeadListTableRefactored } from '../components/dashboard/LeadListTableRefactored';
import { useLeadsList } from '../hooks/useLeadsList';
import { CreateLeadModal } from '../components/dashboard/CreateLeadModal';
import { LeadDetailModal } from '../components/dashboard/LeadDetailModal';

export default function LeadsListPage() {
    const { leads, loading, refresh } = useLeadsList();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    // Filter State (Lifting state logic could be improved, but keeping simple for now)
    const [filters, setFilters] = useState({
        temp: [],
        source: '',
        scoreMin: '',
        scoreMax: '',
    });

    // Module Actions (Simplified Header for List View)
    const moduleActions = (
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="font-bold text-petroleum">{leads.length}</span> <span className="font-normal text-slate-500">leads totais</span>
            </div>
            <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-lg bg-solar hover:bg-amber-600 text-white px-4 py-2 flex items-center gap-2 font-bold text-[11px] transition-all shadow-sm hover:shadow-md hover:scale-105"
            >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                NOVO CLIENTE
            </button>
        </div>
    );

    return (
        <DashboardShell
            title="Base de Leads"
            subtitle="Gestão Inteligente de Contatos"
            headerIcon="group"
            loading={loading}
            headerRight={moduleActions}
            breadcrumbs={[{ label: 'CRM', href: '/leads' }, { label: 'Lista', active: true }]}
        >
            <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8 flex flex-col h-full">
                <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
                    <LeadListTableRefactored
                        leads={leads}
                        loading={loading}
                        filters={filters}
                        onRefresh={refresh}
                        onLeadClick={setSelectedLead}
                        selectedLeadId={selectedLead?.id}
                    />
                </div>
            </div>

            {/* Modals */}
            <CreateLeadModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    if (refresh) refresh();
                }}
            />

            <LeadDetailModal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                lead={selectedLead}
            />
        </DashboardShell>
    );
}
