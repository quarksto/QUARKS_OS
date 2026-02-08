import { useState, useEffect } from 'react';
import api from '../services/api';

export function useDashboardData() {
    const [metrics, setMetrics] = useState({
        activeLeads: 0,
        proposalsSent: 0,
        conversionRate: '0%',
        revenue: 'R$ 0,00',
        automations: '0'
    });

    const [pipeline, setPipeline] = useState({
        'NEW': [],
        'CONTACTED': [],
        'PROPOSAL_SENT': [],
        'NEGOTIATION': []
    });

    const [activity, setActivity] = useState([]);
    const [funnel, setFunnel] = useState([]);
    const [energyBalance, setEnergyBalance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [kpisRes, pipelineRes, activityRes, funnelRes, balanceRes] = await Promise.all([
                    api.get('/analytics/dashboard'),
                    api.get('/leads/pipeline'),
                    api.get('/analytics/activity').catch(() => ({ data: [] })),
                    api.get('/analytics/funnel').catch(() => ({ data: [] })),
                    api.get('/analytics/energy-balance').catch(() => ({ data: [] }))
                ]);

                if (kpisRes.data) setMetrics(kpisRes.data);
                if (pipelineRes.data) setPipeline(pipelineRes.data);
                if (activityRes.data && Array.isArray(activityRes.data)) setActivity(activityRes.data);
                if (funnelRes.data && Array.isArray(funnelRes.data)) setFunnel(funnelRes.data);
                if (balanceRes.data && Array.isArray(balanceRes.data)) setEnergyBalance(balanceRes.data);
            } catch (error) {
                console.error("Dashboard Data Error:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    return { metrics, pipeline, activity, funnel, energyBalance, loading };
}
