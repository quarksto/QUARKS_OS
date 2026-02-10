import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import SalesWizard from '../components/wizard/SalesWizard';

const ProposalPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const leadIdFromQuery = searchParams.get('leadId');
    const leadIdFromState = location.state?.leadId;
    const leadId = leadIdFromQuery || leadIdFromState || undefined;
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [availableKits, setAvailableKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const promises = [api.get('/inventory/kits')];
                if (leadId) {
                    promises.push(api.get(`/leads/${leadId}`));
                }

                const [kitsRes, leadRes] = await Promise.all(promises);

                setAvailableKits(kitsRes.data);
                if (leadRes && leadRes.data) {
                    setLead(leadRes.data);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, leadId]);

    const handleSaveProposal = async (wizardData) => {
        setSaving(true);
        try {
            const { energy, location: loc, kit, customer, proposal: propData, financials } = wizardData;

            let payloadKit;
            if (kit.type === 'PRESET') {
                const selectedKit = availableKits.find(k => k.id === kit.selectedKitId);
                payloadKit = {
                    id: kit.selectedKitId,
                    name: selectedKit?.name,
                    price: selectedKit?.price,
                    powerKwp: selectedKit?.size_kwp
                };
            } else {
                payloadKit = {
                    isCustom: true,
                    ...kit.custom
                };
            }

            const payload = {
                title: propData.title,
                lead_id: leadId,
                status: 'SENT',
                kit: payloadKit,
                system_size: payloadKit.powerKwp || 0,
                total_price: financials?.pricingBreakdown?.total || 0,
                consumption: energy.consumption,
                distributor: energy.distributor,
                location: loc.address,
                introduction: propData.introduction,
                notes: propData.notes,
                paymentTerms: propData.paymentTerms
            };

            if (id) {
                // Edit logic
            } else {
                await api.post(`/leads/${leadId}/proposals`, payload);
            }

            alert('Proposta salva com sucesso!');
            navigate(`/leads/${leadId}`);

        } catch (error) {
            console.error('Erro ao salvar proposta:', error);
            alert('Erro ao salvar proposta.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center h-full min-h-[500px]">
                    <span className="text-slate-500 animate-pulse">Carregando dados...</span>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-petroleum-900">Editor de Proposta</h1>
                    <p className="text-slate-500">Fluxo de venda guiado</p>
                </div>

                <SalesWizard
                    lead={lead}
                    availableKits={availableKits}
                    onSave={handleSaveProposal}
                    loadingResult={saving}
                />
            </div>
        </DashboardShell>
    );
};

export default ProposalPage;
