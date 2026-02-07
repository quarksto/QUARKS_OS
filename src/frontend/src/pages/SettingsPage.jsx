import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardShell } from '../components/dashboard/DashboardShell';

const ROLE_LABELS = {
    ADMIN: 'Administrador',
    COMERCIAL: 'Comercial',
    INTEGRADOR: 'Integrador',
    VIEWER: 'Visualizador'
};

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <DashboardShell
            title="Configurações"
            subtitle="Perfil e preferências"
            headerIcon="settings"
        >
            <div className="p-8 max-w-[900px] mx-auto h-full overflow-y-auto space-y-8">
                {/* Perfil */}
                <section className="technical-card p-6 border border-slate-200">
                    <h2 className="ds-title-section text-slate-800 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-petroleum">person</span>
                        Perfil
                    </h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 ds-body text-slate-700">
                        <div>
                            <dt className="text-slate-500 text-sm font-medium mb-1">Nome</dt>
                            <dd>{user?.name ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500 text-sm font-medium mb-1">E-mail</dt>
                            <dd>{user?.email ?? '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500 text-sm font-medium mb-1">Função</dt>
                            <dd>{ROLE_LABELS[user?.role] ?? user?.role ?? '—'}</dd>
                        </div>
                    </dl>
                    <p className="mt-4 text-sm text-slate-500">
                        Alteração de senha e dados do perfil em breve.
                    </p>
                </section>

                {/* Seções úteis */}
                <section className="technical-card p-6 border border-slate-200">
                    <h2 className="ds-title-section text-slate-800 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-petroleum">tune</span>
                        Configurações do sistema
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="ds-body text-slate-700">Precificação e regras</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Em breve</span>
                        </li>
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="ds-body text-slate-700">Dados da empresa</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Em breve</span>
                        </li>
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="ds-body text-slate-700">Gestão de usuários</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Em breve</span>
                        </li>
                        <li className="flex items-center justify-between py-2">
                            <span className="ds-body text-slate-700">Notificações e e-mail</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Em breve</span>
                        </li>
                    </ul>
                </section>

                {/* Sobre */}
                <section className="technical-card p-6 border border-slate-200">
                    <h2 className="ds-title-section text-slate-800 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-petroleum">info</span>
                        Sobre
                    </h2>
                    <p className="ds-body text-slate-600">
                        Quarks OS — Solar Edition. Painel comercial para gestão de leads, propostas e catálogo de kits.
                    </p>
                </section>
            </div>
        </DashboardShell>
    );
}
