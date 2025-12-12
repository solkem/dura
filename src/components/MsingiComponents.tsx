import React from 'react';

export function ProtocolDiagram({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6 font-mono text-sm shadow-sm">
            <span className="text-amber-700 text-xs font-bold uppercase tracking-wide block mb-3">
                Protocol Flow
            </span>
            <div className="text-amber-900 space-y-1">{children}</div>
        </div>
    );
}

type GuaranteeType = 'privacy' | 'economic';

const guaranteePrefixes: Record<GuaranteeType, string> = {
    privacy: 'PG',
    economic: 'EG'
};

const guaranteeColors: Record<GuaranteeType, string> = {
    privacy: 'bg-brand-50 border-brand-200',
    economic: 'bg-emerald-50 border-emerald-200'
};

interface Guarantee {
    id: number;
    name: string;
    description: string;
}

export function GuaranteeTable({
    type,
    guarantees
}: {
    type: GuaranteeType;
    guarantees: Guarantee[];
}) {
    return (
        <div className={`rounded-lg border p-4 my-4 ${guaranteeColors[type]}`}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-amber-900 border-b border-amber-200">
                        <th className="pb-2 font-bold">Label</th>
                        <th className="pb-2 font-bold">Name</th>
                        <th className="pb-2 font-bold">Meaning</th>
                    </tr>
                </thead>
                <tbody className="text-amber-800">
                    {guarantees.map(g => (
                        <tr key={g.id} className="border-b border-amber-100 last:border-0 hover:bg-white/50">
                            <td className="py-2 font-mono font-medium">{guaranteePrefixes[type]}{g.id}</td>
                            <td className="py-2">{g.name}</td>
                            <td className="py-2 text-amber-700">{g.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface Component {
    name: string;
    function: string;
    cost: string;
}

export function HardwareStack({
    title,
    components
}: {
    title: string;
    components: Component[];
}) {
    const total = components.reduce((sum, c) => sum + parseFloat(c.cost.replace('$', '')), 0);

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4 shadow-sm">
            <h4 className="text-amber-700 font-bold mb-3">{title}</h4>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="pb-2">Component</th>
                        <th className="pb-2">Function</th>
                        <th className="pb-2 text-right">Cost</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {components.map((c, i) => (
                        <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-white">
                            <td className="py-2 font-mono text-amber-700 font-medium">{c.name}</td>
                            <td className="py-2">{c.function}</td>
                            <td className="py-2 text-right font-mono">{c.cost}</td>
                        </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 font-bold bg-slate-100">
                        <td className="py-2 pl-2" colSpan={2}>Total</td>
                        <td className="py-2 text-right pr-2 text-amber-700">${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

type ActorType = 'privacy' | 'economic';

const actorIcons: Record<string, string> = {
    gov: '🏛️',
    corp: '🏢',
    gw: '📡',
    free: '🆓',
    grief: '💣',
    sybil: '👥'
};

export function ThreatActor({
    id,
    name,
    type,
    capabilities,
    objective
}: {
    id: string;
    name: string;
    type: ActorType;
    capabilities: string;
    objective: string;
}) {
    const bgColor = type === 'privacy' ? 'bg-red-900/30 border-red-500/30' : 'bg-orange-900/30 border-orange-500/30';

    return (
        <div className={`rounded-xl border p-5 my-3 ${type === 'privacy' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl p-2 bg-white rounded-full shadow-sm">{actorIcons[id] || '⚠️'}</span>
                <span className={`font-bold text-lg ${type === 'privacy' ? 'text-red-800' : 'text-orange-800'}`}>A_{id} ({name})</span>
            </div>
            <div className="pl-12 space-y-1">
                <p className="text-slate-700 text-sm"><strong>Capabilities:</strong> {capabilities}</p>
                <p className="text-slate-700 text-sm"><strong>Objective:</strong> {objective}</p>
            </div>
        </div>
    );
}
