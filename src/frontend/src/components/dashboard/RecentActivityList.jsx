import React from 'react';

function relativeTime(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffM = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffM < 1) return 'agora';
    if (diffM < 60) return `${diffM} min atrás`;
    if (diffH < 24) return `${diffH}h atrás`;
    if (diffD === 1) return 'ontem';
    if (diffD < 7) return `${diffD} dias atrás`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

const ActivityItem = ({ title, user, time, type, onClick }) => {
    let icon = 'history';
    let iconColor = 'bg-slate-100 text-slate-500';

    if (type === 'proposal') {
        icon = 'description';
        iconColor = 'bg-solar-100 text-solar';
    } else if (type === 'message') {
        icon = 'chat';
        iconColor = 'bg-blue-50 text-blue-500';
    } else if (type === 'system') {
        icon = 'settings';
        iconColor = 'bg-slate-100 text-slate-500';
    }

    return (
        <div className="flex gap-3 relative pb-6 last:pb-0 group">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-100 last:hidden"></div>

            <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center shrink-0 border border-white z-10 transition-transform group-hover:scale-110`}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
            </div>

            <div
                onClick={onClick}
                className="flex flex-col gap-0.5 p-2 -my-2 rounded-md transition-colors group-hover:bg-slate-50 cursor-pointer w-full flex-1 min-w-0"
            >
                <span className="text-[13px] font-medium text-primary leading-tight">{title}</span>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600">{user}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
                        <span>{time}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-pill text-petroleum hover:bg-petroleum/5 px-2 py-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                        Ver
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RecentActivityList = ({ activity = [], loading, onNavigate }) => {
    const items = activity.length > 0
        ? activity.map((item) => ({
            id: item.id,
            title: item.title,
            user: item.type === 'PROPOSAL' ? item.status : (item.description || '').slice(0, 40),
            time: relativeTime(item.date),
            type: item.type === 'PROPOSAL' ? 'proposal' : 'system'
        }))
        : [];

    return (
        <div className="technical-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="ds-title-section">Atividade recente</h3>
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-custom pr-2">
                {loading ? (
                    <p className="ds-meta text-slate-400">Carregando...</p>
                ) : items.length === 0 ? (
                    <p className="ds-meta text-slate-400">Nenhuma atividade recente.</p>
                ) : (
                    items.map((item, idx) => (
                        <ActivityItem
                            key={item.title + idx}
                            title={item.title}
                            user={item.user}
                            time={item.time}
                            type={item.type}
                            onClick={() => onNavigate && onNavigate(item)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
