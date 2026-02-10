import React from 'react';

/**
 * Área principal de conteúdo das páginas do Dashboard (DS).
 * Aplica container (max-w-[1600px]), padding responsivo e overflow para scroll.
 * Uso: dentro de <main> do DashboardShell, após header/command bar.
 *
 * DS: Container max-w-[1600px] mx-auto; Padding Mobile p-4, Desktop p-6/p-8; Zero sombras.
 */
export const PageContent = ({
    children,
    className = '',
    /** Se true, remove padding horizontal (para conteúdo full-bleed). */
    noPadding = false,
    /** Se true, usa apenas padding inferior (quando há barra de comando acima). */
    paddingBottomOnly = false,
}) => {
    const paddingClass = noPadding
        ? ''
        : paddingBottomOnly
            ? 'px-6 pb-6'
            : 'p-6';

    return (
        <div
            className={`flex-1 overflow-hidden max-w-[1600px] mx-auto w-full ${paddingClass} ${className}`.trim()}
            data-page-content
            role="region"
            aria-label="Conteúdo principal"
        >
            {children}
        </div>
    );
};

export default PageContent;
