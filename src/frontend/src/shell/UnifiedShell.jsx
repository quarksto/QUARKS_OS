import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Transition, Box } from '@mantine/core';
import { useMode, MODES } from '../providers/ModeProvider';
import { useCopilot } from '../context/CopilotContext';

/**
 * UnifiedShell - O orquestrador central de layout do Quarks OS.
 * Decide qual shell apresentar baseado no modo contextual (Vendas, Gestão, Projetos).
 * Inclui transições suaves e atalhos globais.
 */
export const UnifiedShell = ({ children }) => {
    const { mode, setMode } = useMode();
    const { isOpen, closeSidebar } = useCopilot();
    const location = useLocation();
    const navigate = useNavigate();

    // Estado local para gerenciar a transição de modo
    const [activeMode, setActiveMode] = useState(mode);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleModeChange = React.useCallback((newMode) => {
        if (newMode === mode) return;
        setMode(newMode);

        // Navegação inteligente baseada no modo
        if (newMode === MODES.SALES) {
            navigate('/workspace');
        } else if (newMode === MODES.MANAGE) {
            navigate('/');
        } else if (newMode === MODES.PROJECTS) {
            navigate('/projetos');
        }
    }, [mode, setMode, navigate]);

    // Global Keyboard Shortcuts (Fase 3)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt + 1/2/3 para mudar de modo
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                handleModeChange(MODES.SALES);
            }
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                handleModeChange(MODES.MANAGE);
            }
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                handleModeChange(MODES.PROJECTS);
            }
            // Esc para fechar Copilot se aberto
            if (e.key === 'Escape' && isOpen) {
                closeSidebar();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, mode, handleModeChange]);

    useEffect(() => {
        if (mode !== activeMode) {
            // Intentional sync update to trigger transition animation
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setActiveMode(mode);
                setIsTransitioning(false);
            }, 300); // 300ms transition duration matches CSS
            return () => clearTimeout(timer);
        }
    }, [mode, activeMode]);

    const isPublicRoute = ['/login', '/register', '/forgot-password', '/view-proposal'].some(p => location.pathname.startsWith(p));

    if (isPublicRoute) return children;

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-canvas">
            <Transition
                mounted={!isTransitioning}
                transition={{
                    in: { opacity: 1, transform: 'scale(1) translateY(0)' },
                    out: { opacity: 0, transform: 'scale(0.98) translateY(10px)' },
                    common: { transitionProperty: 'opacity, transform' },
                    transitionProperty: 'opacity, transform',
                }}
                duration={400}
                timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
            >
                {(styles) => (
                    <Box style={styles} className="h-full w-full">
                        <div className="h-full w-full overflow-hidden">
                            {children}
                        </div>
                    </Box>
                )}
            </Transition>

            {/* Overlay de transição sutil com Glassmorphism */}
            <Transition mounted={isTransitioning} transition="fade" duration={200}>
                {(styles) => (
                    <Box
                        style={styles}
                        className="absolute inset-0 z-[200] bg-canvas/40 backdrop-blur-md border-t border-white/20 pointer-events-none"
                    />
                )}
            </Transition>
        </div>
    );
};
