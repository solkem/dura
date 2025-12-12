import React from 'react';

export function Analogy({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 my-6 shadow-sm">
            <span className="text-brand-600 text-xs font-bold uppercase tracking-wider block mb-2">
                Analogy
            </span>
            <p className="text-brand-900 leading-relaxed font-serif text-lg italic">{children}</p>
        </div>
    );
}
