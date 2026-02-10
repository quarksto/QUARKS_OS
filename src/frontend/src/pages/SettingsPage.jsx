import React from 'react';
import { Link } from 'react-router-dom';
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
                        <span className="material-symbols-outlined text-petroleum ds-icon-w300" aria-hidden>person</span>
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
                        <span className="material-symbols-outlined text-petroleum ds-icon-w300" aria-hidden>tune</span>
                        Configurações do sistema
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <Link to="/pricing-rules" className="ds-body text-slate-700 hover:text-petroleum-600 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400 ds-icon-w300" aria-hidden>attach_money</span>
                                Tabelas de Preço e Regras
                            </Link>
                            <Link to="/pricing-rules" className="text-xs text-petroleum-600 hover:text-petroleum-700 font-semibold flex items-center gap-1">
                                Configurar <span className="material-symbols-outlined text-[14px] ds-icon-w300" aria-hidden>arrow_forward</span>
                            </Link>
                        </li>
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <Link to="/services" className="ds-body text-slate-700 hover:text-petroleum-600 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400 ds-icon-w300" aria-hidden>miscellaneous_services</span>
                                Serviços e precificação
                            </Link>
                            <Link to="/services" className="text-xs text-petroleum-600 hover:text-petroleum-700 font-semibold flex items-center gap-1">
                                Gerenciar <span className="material-symbols-outlined text-[14px] ds-icon-w300" aria-hidden>arrow_forward</span>
                            </Link>
                        </li>
                        <li className="flex items-center justify-between py-2 border-b border-slate-100">
                            <Link to="/products" className="ds-body text-slate-700 hover:text-petroleum-600 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400 ds-icon-w300" aria-hidden>inventory_2</span>
                                Produtos e Kits
                            </Link>
                            <Link to="/products" className="text-xs text-petroleum-600 hover:text-petroleum-700 font-semibold flex items-center gap-1">
                                Gerenciar <span className="material-symbols-outlined text-[14px] ds-icon-w300" aria-hidden>arrow_forward</span>
                            </Link>
                        </li>
                        <li className="flex items-center justify-between py-2">
                            <span className="ds-body text-slate-700 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-slate-400 ds-icon-w300" aria-hidden>notifications</span>
                                Notificações e e-mail
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200 bg-white">Em breve</span>
                        </li>
                    </ul>
                </section>

                {/* Sobre */}
                <section className="technical-card p-6 border border-slate-200">
                    <h2 className="ds-title-section text-slate-800 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-petroleum ds-icon-w300" aria-hidden>info</span>
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
