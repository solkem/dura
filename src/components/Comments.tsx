import React, { useEffect, useState } from 'react';

export default function Comments() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Discussion</h3>
            <div className="giscus">
                {/* Helper script injection */}
                <script
                    src="https://giscus.app/client.js"
                    data-repo="[ENTER_YOUR_REPO_HERE]"
                    data-repo-id="[ENTER_REPO_ID]"
                    data-category="Announcements"
                    data-category-id="[ENTER_CATEGORY_ID]"
                    data-mapping="pathname"
                    data-strict="0"
                    data-reactions-enabled="1"
                    data-emit-metadata="0"
                    data-input-position="bottom"
                    data-theme="light"
                    data-lang="en"
                    crossOrigin="anonymous"
                    async
                >
                </script>
                {/* Fallback/Placeholder if config is missing */}
                <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500 text-sm">
                    <p>Comments system needs configuration.</p>
                    <p>Please update <code>src/components/Comments.tsx</code> with your Giscus details.</p>
                </div>
            </div>
        </div>
    );
}
