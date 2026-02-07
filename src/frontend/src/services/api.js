import axios from 'axios';

// Base URL do backend (usado por api e por useChat/copilot). Para produção, defina VITE_API_BASE no .env.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para injetar o token JWT
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/** Open proposal document in new tab (fetches with auth, then opens as blob URL). */
export async function openProposalDocument(proposalId) {
    const res = await api.get(`/proposals/${proposalId}/document`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    window.open(url);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default api;
export { API_BASE };