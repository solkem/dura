import React from 'react';

interface AnnotationProps {
    author?: string;
    type?: 'note' | 'question' | 'critique';
    children: React.ReactNode;
}

export default function Annotation({ author = 'Anonymous', type = 'note', children }: AnnotationProps) {
    const styles = {
        note: 'bg-yellow-100 border-yellow-300 text-yellow-900',
        question: 'bg-orange-100 border-orange-300 text-orange-900',
        critique: 'bg-red-50 border-red-200 text-red-900'
    };

    const icons = {
        note: '📝',
        question: '❓',
        critique: '⚠️'
    };

    return (
        <span className={`inline-block mx-1 px-2 py-0.5 rounded border ${styles[type]} text-sm align-middle group relative cursor-help`}>
            <span className="font-bold mr-1 select-none">{icons[type]}</span>
            <span className="font-semibold underline decoration-dotted">{children}</span>

            {/* Tooltip for Author */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {author}
            </span>
        </span>
    );
}
