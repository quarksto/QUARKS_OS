import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook para gerenciar dados do módulo de Engenharia/Projetos
 */
export const useProjectData = () => {
    const [projects, setProjects] = useState([]);
    const [kanban, setKanban] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [projectsRes, kanbanRes] = await Promise.all([
                api.get('/projects'),
                api.get('/projects/kanban')
            ]);
            setProjects(projectsRes.data);
            setKanban(kanbanRes.data);
            setError(null);
        } catch (err) {
            console.error('[useProjectData] Error fetching projects:', err);
            setError('Falha ao carregar projetos de engenharia.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateProjectStatus = async (projectId, newStatus) => {
        try {
            await api.patch(`/projects/${projectId}/status`, { status: newStatus });
            await fetchData(); // Refresh data
            return true;
        } catch (err) {
            console.error('[useProjectData] Error updating status:', err);
            return false;
        }
    };

    return {
        projects,
        kanban,
        loading,
        error,
        refresh: fetchData,
        updateProjectStatus
    };
};
