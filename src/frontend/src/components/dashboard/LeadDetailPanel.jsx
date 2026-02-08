import React, { useState, useEffect } from 'react';
import { useCopilot } from '../../context/CopilotContext';
import api from '../../services/api';
import { LeadModalHeader } from './leadModal/LeadModalHeader';
import { LeadModalProfile } from './leadModal/LeadModalProfile';
import { LeadModalContact } from './leadModal/LeadModalContact';
import { LeadModalSolar } from './leadModal/LeadModalSolar';
import { LeadModalAddress } from './leadModal/LeadModalAddress';
import { LeadModalSolarInsights } from './leadModal/LeadModalSolarInsights';
import { LeadModalProposal } from './leadModal/LeadModalProposal';
import { LeadModalTimeline } from './leadModal/LeadModalTimeline';
import { LeadModalFooter } from './leadModal/LeadModalFooter';
import { LeadModalJourneyBanner } from './leadModal/LeadModalJourneyBanner';

export const LeadDetailPanel = ({ lead: initialLead, onClose, className = '' }) => {
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setContext, triggerAction, openSidebar } = useCopilot();

    useEffect(() => {
        if (!initialLead?.id) return;

        // setLoading(true); // Prevent sync update loop
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(null);
        setLead(initialLead);

        setContext({
            type: 'LEAD',
            summary: `Lead: ${initialLead.name} (${initialLead.consumption} kWh, ${initialLead.status})`,
            data: initialLead,
        });

        api.get(`/leads/${initialLead.id}`)
            .then((res) => setLead(res.data))
            .catch((err) => {
                console.error('Failed to fetch lead detail:', err);
                setError(err?.response?.status === 404 ? 'Lead não encontrado' : 'Erro ao carregar detalhes');
                setLead(initialLead);
            })
            .finally(() => setLoading(false));
    }, [initialLead?.id, setContext]);

    const handleNewProposal = () => {
        triggerAction?.('GENERATE_PROPOSAL', { leadId: lead?.id });
        openSidebar?.();
    };

    if (!initialLead) {
        return (
            <div className={`h-full flex flex-col items-center justify-center bg-slate-50 border-l border-slate-200 text-slate-400 p-8 ${className}`}>
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">person_search</span>
                <p className="text-sm font-medium">Selecione um lead para ver detalhes</p>
            </div>
        );
    }

    const data = lead || initialLead;
    const activeProposal = data?.proposals?.[0] || null;

    return (
        <div className={`h-full flex flex-col bg-white border-l border-slate-200 overflow-hidden ${className}`}>
            {/* Header Sticky */}
            <div className="shrink-0 bg-white border-b border-slate-100 pb-2">
                <LeadModalHeader
                    lead={data}
                    onClose={onClose}
                    onOpenCopilot={openSidebar}
                    onNewProposal={handleNewProposal}
                    isPanel={true}
                />
            </div>

            {error && (
                <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-sm shrink-0">
                    {error}
                </div>
            )}

            <div className="shrink-0">
                <LeadModalJourneyBanner lead={data} onClose={() => { }} />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-custom bg-slate-50/50 p-6">
                {loading && !data ? (
                    <div className="h-full flex items-center justify-center">
                        <span className="w-8 h-8 border-2 border-slate-200 border-t-petroleum rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <LeadModalProfile lead={data} />

                        <div className="flex flex-col gap-6">
                            <LeadModalContact lead={data} />
                            {/* Compact Layout for Panel */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <LeadModalSolar lead={data} />
                                <LeadModalAddress lead={data} />
                            </div>
                            <LeadModalSolarInsights lead={data} onDimensionar={handleNewProposal} />

                            <LeadModalProposal
                                proposal={activeProposal}
                                onViewDetails={handleNewProposal}
                            />
                            <LeadModalTimeline
                                activities={data?.activity || []}
                                loading={loading}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Sticky */}
            <div className="shrink-0 border-t border-slate-100 bg-white">
                <LeadModalFooter
                    lead={data}
                    onNewProposal={handleNewProposal}
                    onTriggerAction={triggerAction}
                />
            </div>
        </div>
    );
};
