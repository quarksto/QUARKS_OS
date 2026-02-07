import React from 'react';
import { AdaptiveHeader } from './AdaptiveHeader';

/**
 * @deprecated Preferir AdaptiveHeader. Wrapper que mapeia prop "right" para "moduleActions".
 * AdaptiveHeader já inclui Copilot e Notificações em todos os módulos.
 */
export const DashboardHeader = ({
    title,
    subtitle,
    loading,
    headerIcon,
    right,
    onMobileMenuToggle,
}) => (
    <AdaptiveHeader
        title={title}
        subtitle={subtitle}
        loading={loading}
        headerIcon={headerIcon}
        moduleActions={right}
        onMobileMenuToggle={onMobileMenuToggle}
    />
);
