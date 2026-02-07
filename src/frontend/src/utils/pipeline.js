export const formatCurrencyCompact = (value) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value || 0);

export const getLeadPotential = (lead) => {
    if (typeof lead?.potential === 'number') return lead.potential;
    if (typeof lead?.value === 'number') return lead.value;
    const consumption = typeof lead?.consumption === 'number' ? lead.consumption : 0;
    return consumption * 4.5;
};

export const getLeadScore = (lead) => {
    if (typeof lead?.score === 'number') return lead.score;
    const base = typeof lead?.consumption === 'number' ? lead.consumption : 0;
    return Math.min(100, Math.max(45, Math.round((base / 150) + 50)));
};

export const getTemperature = (lead) => {
    if (lead?.temperature && typeof lead.temperature.label === 'string') {
        return { label: lead.temperature.label, color: lead.temperature.color || 'blue' };
    }
    const score = getLeadScore(lead);
    if (score >= 85) return { label: 'Quente', color: 'green' };
    if (score >= 65) return { label: 'Morno', color: 'orange' };
    return { label: 'Frio', color: 'blue' };
};

export const getTemperatureClass = (color) => {
    switch (color) {
        case 'green':
            return 'bg-emerald-500';
        case 'orange':
            return 'bg-orange-500';
        case 'blue':
            return 'bg-blue-500';
        default:
            return 'bg-slate-400';
    }
};

export const getTemperatureOutlineClass = (color) => {
    switch (color) {
        case 'green':
            return 'border-emerald-200 text-emerald-600';
        case 'orange':
            return 'border-orange-200 text-orange-600';
        case 'blue':
            return 'border-blue-200 text-blue-600';
        default:
            return 'border-slate-200 text-slate-500';
    }
};

const ORIGIN_LABELS = {
    INDICACAO: 'Indicação',
    FACEBOOK: 'Facebook',
    GOOGLE: 'Google',
    SITE: 'Site',
    OUTRO: 'Outro',
};

export const getSourceLabel = (lead) => {
    if (lead?.origin) return ORIGIN_LABELS[lead.origin] || lead.origin;
    if (lead?.distributor) return lead.distributor;
    return lead?.status === 'NEW' ? 'Indicação' : 'Inbound';
};

export const getNextAction = (lead) => {
    switch (lead?.status) {
        case 'NEW':
            return { icon: 'phone_in_talk', label: 'Ligue para qualificar' };
        case 'CONTACTED':
            return { icon: 'home_work', label: 'Preencha CEP e tipo de telhado' };
        case 'PROPOSAL_SENT':
            return { icon: 'phone_callback', label: 'Follow-up com o cliente' };
        case 'NEGOTIATION':
            return { icon: 'description', label: 'Envie documentação e acompanhe' };
        case 'CLOSED_WON':
            return { icon: 'emoji_events', label: 'Fechado — iniciar projeto' };
        case 'CLOSED_LOST':
            return { icon: 'mood_bad', label: 'Perdido' };
        default:
            return { icon: 'event_available', label: 'Atualizar etapa' };
    }
};

const QUALIFICATION_FIELDS = ['name', 'phone', 'email', 'consumption', 'location', 'origin', 'cep', 'fullAddress', 'roofType', 'connectionType', 'distributor'];

export const getLeadCompleteness = (lead) => {
    if (!lead) return { percent: 0, filled: 0, total: QUALIFICATION_FIELDS.length };
    let filled = 0;
    for (const f of QUALIFICATION_FIELDS) {
        const v = lead[f];
        if (v != null && String(v).trim() !== '') filled++;
    }
    const total = QUALIFICATION_FIELDS.length;
    const percent = Math.round((filled / total) * 100);
    return { percent, filled, total };
};

export const stageLabels = {
    NEW: 'Triagem',
    CONTACTED: 'Qualificação',
    PROPOSAL_SENT: 'Proposta',
    NEGOTIATION: 'Negociação',
    CLOSED_WON: 'Fechados',
    CLOSED_LOST: 'Perdidos',
};

export const getStageLabel = (status) => stageLabels[status] || status;

export const getDaysInStage = (lead) => {
    if (!lead?.updatedAt && !lead?.updated_at) return 1;
    const dateStr = lead.updatedAt || lead.updated_at;
    const updated = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - updated);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
};
