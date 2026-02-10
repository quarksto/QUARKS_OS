import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useLeadRealtime } from './useRealtime';

export function usePipelineData() {
    const [pipeline, setPipeline] = useState({
        'NEW': [],
        'CONTACTED': [],
        'PROPOSAL_SENT': [],
        'NEGOTIATION': [],
        'CLOSED_WON': [],
        'CLOSED_LOST': []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPipeline = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const { data } = await api.get('/leads/pipeline');
            if (data) setPipeline(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching pipeline:", err);
            setError(err);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPipeline();
    }, [fetchPipeline]);

    // Realtime subscriptions
    useLeadRealtime(null, (event) => {
        // For now, we reuse the fetch strategy for consistency.
        // In the future, we can implement optimistic updates here.
        console.log('Pipeline Realtime Event:', event);
        fetchPipeline(true); // Silent refresh
    });

    return { pipeline, loading, error, refresh: fetchPipeline };
}
