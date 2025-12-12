import React from 'react';

export function ConceptLink({
    slug,
    children
}: {
    slug: string;
    children?: React.ReactNode
}) {
    return (
        <a
            href={`/concepts/${slug}`}
            className="text-purple-400 hover:text-purple-300 underline decoration-purple-500/30 hover:decoration-purple-400 decoration-2 underline-offset-2 transition-colors"
        >
            {children || slug}
        </a>
    );
}

export function CrossProjectLink({
    project,
    concept,
    children
}: {
    project: 'edgechain' | 'msingi';
    concept: string;
    children: React.ReactNode
}) {
    const colors = {
        edgechain: 'text-emerald-400 hover:text-emerald-300 decoration-emerald-500/30 hover:decoration-emerald-400',
        msingi: 'text-amber-400 hover:text-amber-300 decoration-amber-500/30 hover:decoration-amber-400'
    };

    return (
        <a
            href={`/concepts/${concept}`}
            className={`underline decoration-2 underline-offset-2 transition-colors ${colors[project]}`}
        >
            {children}
        </a>
    );
}
