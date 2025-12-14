import * as React from 'react';

interface TraceabilityProps {
    conflictsWith?: string[];
    evolvedFrom?: string[];
    dependsOn?: string[];
}

export function TraceabilityMatrix({ conflictsWith = [], evolvedFrom = [], dependsOn = [] }: TraceabilityProps) {
    if (conflictsWith.length === 0 && evolvedFrom.length === 0 && dependsOn.length === 0) {
        return null;
    }

    const renderSection = (title: string, items: string[], colorClass: string, icon: string) => (
        items.length > 0 && (
            <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    {icon} {title}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                        <a
                            key={item}
                            href={`/concepts/${item}`}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all hover:shadow-md ${colorClass}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        )
    );

    return (
        <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Traceability Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderSection('Evolved From', evolvedFrom, 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300', '⬅️')}
                {renderSection('Depends On', dependsOn, 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300', '🔗')}
                {renderSection('Conflicts With', conflictsWith, 'bg-red-50 text-red-700 border-red-200 hover:border-red-300', '⚔️')}
            </div>
        </div>
    );
}

export default TraceabilityMatrix;
