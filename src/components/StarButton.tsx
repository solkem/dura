import React, { useState, useEffect } from 'react';

interface StarButtonProps {
    slug: string;
}

export const StarButton: React.FC<StarButtonProps> = ({ slug }) => {
    const [isStarred, setIsStarred] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/star?slug=${slug}`)
            .then(res => {
                if (res.status === 401) return null;
                return res.json();
            })
            .then(data => {
                if (data) setIsStarred(data.starred);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [slug]);

    const toggleStar = async () => {
        const newState = !isStarred;
        setIsStarred(newState); // Optimistic

        try {
            await fetch('/api/star', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
            });
        } catch (e) {
            setIsStarred(!newState); // Revert
        }
    };

    if (isLoading) return <div className="w-8 h-8 rounded-full bg-slate-50 animate-pulse"></div>;

    return (
        <button
            onClick={toggleStar}
            className={`p-2 rounded-full transition-all ${isStarred
                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                }`}
            title={isStarred ? "Remove from Library" : "Add to Library"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isStarred ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                className="w-6 h-6"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.545.044.757.774.358 1.144l-4.162 3.86a.563.563 0 00-.154.553l1.246 5.372c.13.56-.502.997-.96 1.002l-4.706-.554a.563.563 0 00-.518 0l-4.706.554c-.458-.005-1.09-.442-.96-1.002l1.246-5.372a.563.563 0 00-.154-.553L3.11 10.4c-.399-.37-.187-1.1.358-1.144l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        </button>
    );
};
