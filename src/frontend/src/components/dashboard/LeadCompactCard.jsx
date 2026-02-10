import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdLocationOn, MdFactory, MdBolt, MdAutoAwesome, MdPayments, MdCall, MdSchedule, MdMoreHoriz } from 'react-icons/md';

/**
 * LeadCompactCard - DS v1.4 'Super Flat'
 * 
 * A high-density card for lead overview following the strict Quarks OS Design System rules:
 * - Rounded-lg (8px) for cards
 * - Rounded-full for buttons/badges/pills
 * - border-slate-100/200 subtle borders
 * - Zero shadows (Super Flat)
 * - Geist font with semibold weights
 */
export function LeadCompactCard({ lead = {}, onClick }) {
    const {
        name = "Lead Sem Nome",
        city = "Local não informado",
        phone = "",
        consumption = 0,
        score = 0,
        potential = "0,0",
        origin = "INBOUND",
        temp = "FRIO",
        days = "1D"
    } = lead;

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div
            onClick={onClick}
            className="w-full max-w-[420px] bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-5 hover:border-slate-300 transition-colors cursor-pointer group"
        >
            {/* HEADER: Avatar, Info & Context */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                        <span className="text-slate-600 font-bold text-lg">{initials}</span>
                    </div>
                    {/* WhatsApp Badge */}
                    <div className="absolute -bottom-1 -right-1 border border-emerald-200 bg-white size-5 rounded-full flex items-center justify-center text-emerald-600">
                        <FaWhatsapp size={10} />
                    </div>
                </div>

                <div className="flex flex-col min-w-0">
                    <h2 className="text-[15px] font-bold text-slate-700 truncate leading-tight">
                        {name}
                    </h2>
                    <div className="flex items-center gap-1 mt-0.5">
                        <MdLocationOn className="text-slate-400 size-3.5" />
                        <span className="text-meta text-slate-400 uppercase tracking-widest leading-none pt-0.5">
                            {city}
                        </span>
                    </div>
                </div>

                <button className="ml-auto size-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-colors">
                    <MdMoreHoriz size={20} />
                </button>
            </div>

            {/* METRICS GRID: Consumption & Distributor */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col p-3 rounded-lg border border-slate-100 bg-white">
                    <span className="ds-label text-slate-400 uppercase tracking-widest text-[9px] mb-1">
                        Distribuidora
                    </span>
                    <div className="flex items-center gap-2">
                        <MdFactory className="text-slate-300 size-4" />
                        <span className="text-[13px] font-semibold text-slate-700 truncate">CEMIG</span>
                    </div>
                </div>
                <div className="flex flex-col p-3 rounded-lg border border-slate-100 bg-white">
                    <span className="ds-label text-slate-400 uppercase tracking-widest text-[9px] mb-1">
                        Consumo Médio
                    </span>
                    <div className="flex items-center gap-2">
                        <MdBolt className="text-slate-300 size-4" />
                        <span className="text-[13px] font-semibold text-slate-700">{consumption}kWh</span>
                    </div>
                </div>
            </div>

            {/* TAGS ROW: Status Pills */}
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-100 bg-white">
                    <div className="size-1.5 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide">{temp}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-100 bg-white">
                    <MdSchedule className="text-slate-400 size-3" />
                    <span className="text-[10px] font-bold text-slate-500 tracking-wide">{origin}</span>
                </div>
            </div>

            {/* ANALYSIS BOX: IA Score & Potential */}
            <div className="flex rounded-lg border border-slate-100 bg-slate-50/50 overflow-hidden divide-x divide-slate-200">
                <div className="flex-1 p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <MdAutoAwesome className="text-solar size-3.5" />
                        <span className="text-meta text-slate-500 uppercase tracking-widest">IA Score</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-700 tabular-nums">{score}</span>
                        <span className="text-[10px] font-bold text-slate-400">PTS</span>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    <div className="flex items-center gap-1.5 mb-1.5 justify-end">
                        <MdPayments className="text-slate-400 size-3.5" />
                        <span className="text-meta text-slate-500 uppercase tracking-widest">Potencial</span>
                    </div>
                    <div className="flex justify-end">
                        <span className="text-xl font-bold text-slate-700 tabular-nums">R$ {potential}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER: Action & Time */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 hover:text-petroleum transition-colors group-hover:text-petroleum">
                    <MdCall className="size-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        Ligue para qualificar
                    </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-100 text-slate-400">
                    <MdSchedule className="size-3" />
                    <span className="text-[10px] font-bold">{days}</span>
                </div>
            </div>
        </div>
    );
}
