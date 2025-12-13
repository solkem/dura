import React from 'react';

const colors: Record<Project, string> = {
    edgechain: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    msingi: 'bg-amber-100 text-amber-800 border border-amber-200',
    ndani: 'bg-cyan-100 text-cyan-800 border border-cyan-200'
};

export function ProjectBadge({ project }: { project: Project }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[project]}`}>
            {project === 'edgechain' ? 'EdgeChain' : project === 'msingi' ? 'Msingi' : 'Ndani'}
        </span>
    );
}
