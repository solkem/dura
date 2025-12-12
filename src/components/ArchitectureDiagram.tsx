import React from 'react';

export function ArchitectureDiagram({ src }: { src: string }) {
    return (
        <div className="my-6 p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400 mb-2">{src}</span>
            <div className="p-8 bg-slate-900 rounded w-full flex items-center justify-center text-slate-500 italic">
                [Mermaid Diagram Placeholder]
            </div>
        </div>
    );
}
