import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useDashboardData() {
    const [metrics, setMetrics] = useState({
        activeLeads: 0,
        proposalsSent: 0,
        conversionRate: '0%',
        revenue: 'R$ 0,00',
        automations: '0'
    });

    const [activity, setActivity] = useState([]);
    const [funnel, setFunnel] = useState([]);
    const [energyBalance, setEnergyBalance] = useState([]);
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [kpisRes, activityRes, funnelRes, balanceRes, insightRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/activity').catch(() => ({ data: [] })),
                api.get('/analytics/funnel').catch(() => ({ data: [] })),
                api.get('/analytics/energy-balance').catch(() => ({ data: [] })),
                api.get('/analytics/insight').catch(() => ({ data: {} }))
            ]);

            if (kpisRes.data) setMetrics(kpisRes.data);
            if (activityRes.data && Array.isArray(activityRes.data)) setActivity(activityRes.data);
            if (funnelRes.data && Array.isArray(funnelRes.data)) setFunnel(funnelRes.data);
            if (balanceRes.data && Array.isArray(balanceRes.data)) setEnergyBalance(balanceRes.data);
            if (insightRes.data?.insight) setInsight(insightRes.data.insight);
        } catch (error) {
            console.error("Dashboard Data Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [loadData]);

    return { metrics, activity, funnel, energyBalance, insight, loading, refresh: loadData };
}
