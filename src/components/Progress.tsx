import React, { useState, useEffect } from 'react';

interface ProgressProps {
    slug: string;
}

export const Progress: React.FC<ProgressProps> = ({ slug }) => {
    const [status, setStatus] = useState<'unread' | 'read' | 'loading'>('loading');

    useEffect(() => {
        // Fetch initial status
        fetch(`/api/progress?slug=${slug}`)
            .then(res => {
                if (res.status === 401) return null; // Not logged in
                return res.json();
            })
            .then(data => {
                if (data) setStatus(data.status);
                else setStatus('unread'); // Or hide component
            })
            .catch(() => setStatus('unread'));
    }, [slug]);

    const toggleRead = async () => {
        const newStatus = status === 'read' ? 'unread' : 'read';
        setStatus(newStatus); // Optimistic update

        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, status: newStatus })
            });
        } catch (e) {
            console.error("Failed to update progress", e);
            setStatus(status); // Revert
        }
    };

    if (status === 'loading') return <div className="animate-pulse h-8 w-24 bg-slate-100 rounded-full"></div>;

    return (
        <button
            onClick={toggleRead}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${status === 'read'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
        >
            {status === 'read' ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Read</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Mark as Read</span>
                </>
            )}
        </button>
    );
};
