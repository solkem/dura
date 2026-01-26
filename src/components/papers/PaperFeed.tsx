
import React, { useState, useMemo } from 'react';

// Define the paper type based on the schema and what's passed from Astro
export interface Paper {
    id: string;
    title: string;
    abstract: string | null;
    authors: string | null; // JSON string
    year: number | null;
    relevanceScore: number | null;
    domainTags: string | null; // JSON string
    createdAt: string | null;
}

interface PaperFeedProps {
    papers: Paper[];
}

const CATEGORIES = [
    { id: 'all', label: 'All Papers' },
    { id: 'privacy', label: 'Privacy & Trust', tags: ['blockchain', 'zkp', 'cryptography', 'privacy', 'msingi'] },
    { id: 'ai', label: 'AI & Intelligence', tags: ['ai', 'machine-learning', 'federated-learning'] },
    { id: 'edge', label: 'Edge & IoT', tags: ['edge', 'iot', 'networking', 'offline-first', 'ndani'] },
    { id: 'agriculture', label: 'Agriculture', tags: ['agriculture', 'edgechain'] },
];

export const PaperFeed: React.FC<PaperFeedProps> = ({ papers: initialPapers }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Parse tags helper
    const getPaperTags = (paper: Paper): string[] => {
        try {
            if (!paper.domainTags) return [];
            const domain = JSON.parse(paper.domainTags);
            // We could also mix in ecosystem tags if available, but for now specific domain tags
            return Array.isArray(domain) ? domain.map((t: string) => t.toLowerCase()) : [];
        } catch (e) {
            return [];
        }
    };

    const filteredPapers = useMemo(() => {
        return initialPapers.filter((paper) => {
            // 1. Text Search
            const searchContent = `${paper.title} ${paper.abstract} ${paper.year || ''}`.toLowerCase();
            const matchesSearch = searchQuery === '' || searchContent.includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // 2. Category Filter
            if (activeCategory === 'all') return true;

            const categoryDef = CATEGORIES.find(c => c.id === activeCategory);
            if (!categoryDef || !categoryDef.tags) return true;

            const paperTags = getPaperTags(paper);
            // Check if paper has ANY tag that belongs to the active category
            const hasCategoryTag = paperTags.some(tag => categoryDef.tags?.includes(tag));

            return hasCategoryTag;
        });
    }, [initialPapers, activeCategory, searchQuery]);

    return (
        <div className="w-full space-y-8">
            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-sm">

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${activeCategory === category.id
                                    ? 'bg-stone-900 text-white shadow-md transform scale-105'
                                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'}
              `}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search papers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-stone-700"
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Results Feed */}
            {filteredPapers.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                    <p className="text-stone-500 text-lg font-medium">No papers found matching your criteria.</p>
                    <button
                        onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                        className="mt-4 text-amber-600 hover:text-amber-700 font-semibold underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredPapers.map((paper) => (
                        <div key={paper.id} className="group relative bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-amber-200 hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">

                                    {/* Tags (Small) */}
                                    <div className="flex gap-2 mb-3">
                                        {getPaperTags(paper).slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-500 text-xs font-bold rounded uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-amber-700 transition-colors">
                                        <a href={`/papers/${paper.id}`} className="before:absolute before:inset-0">
                                            {paper.title}
                                        </a>
                                    </h2>

                                    {paper.abstract && (
                                        <p className="text-stone-600 mb-6 leading-relaxed line-clamp-3">
                                            {paper.abstract}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-500">
                                        {/* Metadata row */}
                                        {paper.year && (
                                            <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded">
                                                <span className="text-stone-400">Published:</span>
                                                {paper.year}
                                            </span>
                                        )}

                                        {paper.relevanceScore && (
                                            <div className="flex items-center gap-1">
                                                <span className="text-stone-400">Relevance:</span>
                                                <span className={`
                                px-1.5 py-0.5 rounded text-xs font-bold
                                ${paper.relevanceScore > 0.8 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                            `}>
                                                    {(paper.relevanceScore * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        )}

                                        {paper.authors && (
                                            <span className="flex items-center gap-1 max-w-md truncate">
                                                <span className="text-stone-400">By</span>
                                                {/* Assuming authors is a string representation or simple string for now */}
                                                <span className="truncate">{String(paper.authors).replace(/[\[\]"]/g, '')}</span>
                                            </span>
                                        )}

                                    </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="ml-6 text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300 self-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
