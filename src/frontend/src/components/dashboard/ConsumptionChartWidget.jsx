import React from 'react';

export const ConsumptionChartWidget = () => {
    // Simulated data extracting visual structure from Stitch Proposal
    const data = [
        { month: 'Jan', consumption: 320, generation: 350 },
        { month: 'Fev', consumption: 310, generation: 360 },
        { month: 'Mar', consumption: 290, generation: 380 },
        { month: 'Abr', consumption: 280, generation: 400 },
        { month: 'Mai', consumption: 260, generation: 410 },
        { month: 'Jun', consumption: 250, generation: 390 },
        { month: 'Jul', consumption: 270, generation: 380 },
    ];

    const maxVal = 450;

    return (
        <div className="border border-slate-200 bg-white rounded-lg p-6 flex flex-col gap-4 h-[320px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="section-title text-[16px]">Balanço Energético</h3>
                    <p className="text-[11px] text-slate-400 font-sans">Últimos 7 meses (kWh)</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-300"></div>
                        <span className="text-[11px] text-slate-500 font-bold">Consumo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-solar-500"></div>
                        <span className="text-[11px] text-slate-500 font-bold">Geração</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 pt-4">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-default">
                        {/* Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-36 bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none z-10">
                            Gen: {item.generation} kWh
                        </div>

                        <div className="w-full flex gap-1 items-end h-[80%] max-w-[40px]">
                            {/* Consumption Bar */}
                            <div
                                className="flex-1 bg-slate-300 hover:bg-slate-400 transition-all rounded-t-lg"
                                style={{ height: `${(item.consumption / maxVal) * 100}%` }}
                            ></div>
                            {/* Generation Bar */}
                            <div
                                className="flex-1 bg-solar-500 hover:bg-solar-600 transition-all rounded-t-lg"
                                style={{ height: `${(item.generation / maxVal) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans mt-1">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
