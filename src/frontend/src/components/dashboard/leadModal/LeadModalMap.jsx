import React from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/**
 * Mapa do endereço do lead.
 * Usa Maps Embed API (iframe) quando API key está configurada.
 * Fallback: link para abrir no Google Maps.
 */
export const LeadModalMap = ({ address }) => {
    const hasAddress = Boolean(address && String(address).trim());
    const encodedQuery = hasAddress ? encodeURIComponent(address) : '';
    const mapsUrl = hasAddress
        ? `https://www.google.com/maps?q=${encodedQuery}`
        : 'https://www.google.com/maps';

    if (!hasAddress) {
        return (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[32px]">map</span>
                    <span className="ds-meta">Endereço não informado</span>
                </div>
            </div>
        );
    }

    if (GOOGLE_MAPS_API_KEY) {
        const embedSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedQuery}`;
        return (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 group">
                <iframe
                    title="Localização do lead no mapa"
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="min-h-[128px]"
                />
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                    <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        Ver no Google Maps
                    </span>
                </a>
            </div>
        );
    }

    return (
        <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center group cursor-pointer hover:border-petroleum/40 transition-colors"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1 group-hover:bg-petroleum group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[14px]">map</span>
                    Ver no Google Maps
                </span>
            </div>
            <p className="ds-meta text-slate-500 absolute bottom-2 left-2 right-2 truncate">{address}</p>
        </a>
    );
};
