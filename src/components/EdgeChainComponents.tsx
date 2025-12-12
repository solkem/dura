import React from 'react';

export function FarmerPersona({
    name = "Nyakupfuya",
    scenario
}: {
    name?: string;
    scenario: string
}) {
    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl p-2 bg-white rounded-full shadow-sm">🌾</span>
                <span className="text-emerald-800 font-bold text-lg">{name}'s Perspective</span>
            </div>
            <p className="text-slate-700 text-lg italic leading-relaxed pl-14">"{scenario}"</p>
        </div>
    );
}

export function SMSPreview({
    incoming,
    outgoing
}: {
    incoming: string;
    outgoing: string;
}) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 font-mono text-sm shadow-inner">
            <div className="bg-white p-3 rounded-lg mb-3 shadow-sm border border-slate-100 text-slate-700">
                <span className="text-slate-400 font-bold select-none">→ </span>{incoming}
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg shadow-sm border border-emerald-100 text-emerald-800 ml-8 text-right">
                <span className="text-emerald-400 font-bold select-none">← </span>{outgoing}
            </div>
        </div>
    );
}
