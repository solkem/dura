-- Add memories table for agent learnings
CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 0.5,
    status TEXT NOT NULL DEFAULT 'pending',
    source_agent TEXT,
    evidence TEXT,
    reviewed_by TEXT REFERENCES user(id),
    reviewed_at TEXT,
    review_notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    last_used_at TEXT,
    use_count INTEGER DEFAULT 0
);
