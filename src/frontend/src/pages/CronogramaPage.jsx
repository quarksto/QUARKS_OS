import React from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';

export default function CronogramaPage() {
    return (
        <DashboardShell
            title="Cronograma"
            subtitle="Planejamento de Instalações"
            headerIcon="calendar_today"
        >
            <div className="p-8 max-w-[1600px] mx-auto h-full overflow-y-auto">
                <div className="mb-8">
                    <h2 className="section-title">Cronograma</h2>
                    <p className="support-text mt-1">Calendário ou lista em cards. Em breve.</p>
                </div>
                <div className="technical-card p-12 text-center">
                    <p className="support-text">Esta seção está em construção e estará disponível em breve.</p>
                </div>
            </div>
        </DashboardShell>
    );
}
