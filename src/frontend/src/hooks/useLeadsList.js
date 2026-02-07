import { useState, useEffect } from 'react';
import { useDashboardData } from './useDashboardData';

/**
 * Hook to adapt Pipeline data (Columns) into a flat List for the Data Table.
 * @returns {Object} { leads: Array, loading: Boolean }
 */
export function useLeadsList() {
    // Reuse the existing hook to fetch data.
    // In the future, this should call a dedicated endpoint api.get('/leads?page=1')
    const { pipeline, loading } = useDashboardData();
    const [leadsList, setLeadsList] = useState([]);

    useEffect(() => {
        if (!pipeline) return;

        // Flatten the loop
        let allLeads = [];

        // Define status mapping if needed, or just use column keys
        Object.entries(pipeline).forEach(([statusKey, leadsArray]) => {
            if (Array.isArray(leadsArray)) {
                // Attach the status to each lead
                const leadsWithStatus = leadsArray.map(lead => ({
                    ...lead,
                    status: statusKey, // e.g. "NEW", "CONTACTED"
                    // Mock fields if missing
                    createdAt: lead.createdAt || new Date().toISOString(),
                    avatar_url: lead.avatar_url, // Might be undefined
                    email: lead.email || "noemail@example.com",
                    phone: lead.phone || "(00) 00000-0000"
                }));
                allLeads = [...allLeads, ...leadsWithStatus];
            }
        });

        // Optional: Sort by created date or name
        // allLeads.sort(...)

        setLeadsList(allLeads);
    }, [pipeline]);

    return { leads: leadsList, loading };
}
