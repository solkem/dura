import React from 'react';
import { ProjectBadge } from './ProjectBadge';

type Project = 'edgechain' | 'msingi';

const styles: Record<Project, string> = {
    edgechain: 'bg-emerald-900/40 border-emerald-500/40 text-emerald-200',
    msingi: 'bg-amber-900/40 border-amber-500/40 text-amber-200'
};

export function ProjectExample({
    project,
    children
}: {
    project: Project;
    children: React.ReactNode
}) {
    return (
        <div className={`rounded-lg border p-4 my-3 ${styles[project]}`}>
            <ProjectBadge project={project} />
            <div className="mt-2 text-sm">{children}</div>
        </div>
    );
}
