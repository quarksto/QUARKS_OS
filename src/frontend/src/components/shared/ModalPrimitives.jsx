import React from 'react';

/**
 * Primitivos de Modal - Design System v1.4 (DS v1.4)
 * Estética "Super Flat", zero sombras, bordas slate-100/200, icon weights 300.
 */

export const ModalOverlay = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={onClose}
            ></div>
            {children}
        </div>
    );
};

export const ModalPanel = ({ children, maxWidth = 'max-w-lg', className = '' }) => (
    <div className={`relative bg-white rounded-lg shadow-none w-full ${maxWidth} overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] ${className}`}>
        {children}
    </div>
);

export const ModalHeader = ({ title, subtitle, icon, onClose }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
            {icon && (
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                    <span className="material-symbols-outlined text-petroleum ds-icon-w300 text-[22px]">
                        {icon}
                    </span>
                </div>
            )}
            <div className="flex flex-col">
                <h2 className="text-[17px] font-bold text-slate-700 tracking-tight leading-tight">{title}</h2>
                {subtitle && <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{subtitle}</span>}
            </div>
        </div>
        {onClose && (
            <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <span className="material-symbols-outlined text-[20px] ds-icon-w300">close</span>
            </button>
        )}
    </div>
);

export const ModalContent = ({ children, className = '' }) => (
    <div className={`p-6 flex-1 overflow-y-auto ${className}`}>
        {children}
    </div>
);

export const ModalFooter = ({ children, className = '' }) => (
    <div className={`pt-2 flex items-center justify-end gap-3 px-6 pb-6 ${className}`}>
        {children}
    </div>
);
