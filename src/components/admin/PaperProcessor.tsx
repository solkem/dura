import { useState, useRef } from 'react';

interface ExtractedInfo {
  pageCount?: number;
  wordCount?: number;
  hasAbstract?: boolean;
  hasIntro?: boolean;
  hasConclusion?: boolean;
  hasMethods?: boolean;
}

interface ProcessResult {
  status: 'success' | 'rejected' | 'error';
  title?: string;
  paperId?: string;
  extracted?: ExtractedInfo;
  curator?: {
    relevanceScore: number;
    accessibilityScore: number;
    difficulty: number;
    domainTags: string[];
    ecosystemTags: string[];
    curatorStatus: string;
    curatorNotes: string;
    nyakupfuyaSummary?: string;
  };
  synthesizer?: {
    summaries: {
      oneLiner: string;
      paragraph: string;
      nyakupfuya: string;
    };
    keyConcepts?: Array<{
      term: string;
      simpleDefinition: string;
      analogy: string;
      whyItMatters: string;
    }>;
    practicalImplications?: string[];
    learningPath?: {
      prerequisites: string[];
      nextSteps: string[];
      questions: string[];
    };
    relatedPapers: Array<{
      paperId: string;
      relationship: string;
      strength: number;
    }>;
  };
  error?: string;
}

type InputMode = 'manual' | 'pdf';

export function PaperProcessor() {
  const [mode, setMode] = useState<InputMode>('pdf');
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setResult(null);
    }
  };

  const [status, setStatus] = useState('');

  const handleProcess = async () => {
    setLoading(true);
    setResult(null);
    setStatus('Uploading...');

    try {
      if (mode === 'pdf' && pdfFile) {
        // PDF upload mode
        setStatus('Uploading PDF...');
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        if (title.trim()) {
          formData.append('title', title);
        }

        setStatus('Extracting text from PDF...');
        const response = await fetch('/api/agents/process-pdf', {
          method: 'POST',
          body: formData,
        });

        setStatus('Processing with AI agents...');
        const data = await response.json();
        setResult(data);
      } else {
        // Manual mode (title + abstract)
        if (!title.trim()) return;

        setStatus('Analyzing with AI agents...');
        const response = await fetch('/api/agents/process-paper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, abstract }),
        });

        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const canProcess = mode === 'pdf' ? !!pdfFile : !!title.trim();

  return (
    <div className="paper-processor">
      <h2>🤖 AI Paper Processor</h2>
      <p className="description">
        Upload a PDF or enter paper details to curate and synthesize using AI agents.
      </p>

      {/* Mode Toggle */}
      <div className="mode-section">
        <label className="mode-label">Input Method</label>
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-btn ${mode === 'pdf' ? 'active' : ''}`}
            onClick={() => setMode('pdf')}
          >
            📄 Upload PDF
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
            onClick={() => setMode('manual')}
          >
            ✍️ Manual Entry
          </button>
        </div>
      </div>

      <div className="form">
        {mode === 'pdf' ? (
          <>
            <div className="field">
              <label>PDF File *</label>
              <div
                className="pdf-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfSelect}
                  style={{ display: 'none' }}
                />
                {pdfFile ? (
                  <div className="pdf-selected">
                    <span className="pdf-icon">📄</span>
                    <div>
                      <strong>{pdfFile.name}</strong>
                      <span className="pdf-size">
                        ({(pdfFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="pdf-placeholder">
                    <span className="upload-icon">⬆️</span>
                    <span>Click to upload PDF or drag & drop</span>
                  </div>
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor="title-override">Title Override (optional)</label>
              <input
                id="title-override"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave empty to auto-detect from PDF"
              />
            </div>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="title">Paper Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Kachina: Foundations of Private Smart Contracts"
              />
            </div>
            <div className="field">
              <label htmlFor="abstract">Abstract</label>
              <textarea
                id="abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Paste the paper's abstract here..."
                rows={5}
              />
            </div>
          </>
        )}

        <button
          onClick={handleProcess}
          disabled={loading || !canProcess}
          className="process-btn"
        >
          {loading ? `⏳ ${status || 'Processing...'}` : '🚀 Process Paper'}
        </button>
      </div>

      {result && (
        <div className={`result result-${result.status}`}>
          {result.status === 'error' && (
            <div className="error">
              <h3>❌ Error</h3>
              <p>{result.error}</p>
            </div>
          )}

          {result.status === 'rejected' && (
            <div className="rejected">
              <h3>🚫 Paper Rejected</h3>
              {result.title && <p><strong>Title:</strong> {result.title}</p>}
              <p><strong>Reason:</strong> {result.curator?.curatorNotes}</p>
              <p><strong>Relevance Score:</strong> {result.curator?.relevanceScore}</p>
            </div>
          )}

          {result.status === 'success' && result.curator && result.synthesizer && (
            <div className="success">
              <h3>✅ Paper Processed Successfully</h3>
              {result.title && <p className="result-title"><strong>{result.title}</strong></p>}

              {result.extracted && (
                <div className="extracted-info">
                  <span>📄 {result.extracted.pageCount} pages</span>
                  <span>📝 {result.extracted.wordCount?.toLocaleString()} words</span>
                  {result.extracted.hasAbstract && <span>✓ Abstract</span>}
                  {result.extracted.hasIntro && <span>✓ Intro</span>}
                  {result.extracted.hasConclusion && <span>✓ Conclusion</span>}
                  {result.extracted.hasMethods && <span>✓ Methods</span>}
                </div>
              )}

              <div className="section curator-section">
                <h4>📊 Curator Analysis</h4>
                <div className="stats">
                  <span className="stat">
                    <strong>Relevance:</strong> {(result.curator.relevanceScore * 100).toFixed(0)}%
                  </span>
                  <span className="stat">
                    <strong>Accessibility:</strong> {((result.curator.accessibilityScore || 0) * 100).toFixed(0)}%
                  </span>
                  <span className="stat">
                    <strong>Difficulty:</strong> {result.curator.difficulty}/5
                  </span>
                  <span className="stat">
                    <strong>Status:</strong> {result.curator.curatorStatus}
                  </span>
                </div>
                <div className="tags">
                  {result.curator.domainTags.map((tag) => (
                    <span key={tag} className="tag domain-tag">{tag}</span>
                  ))}
                  {result.curator.ecosystemTags.map((tag) => (
                    <span key={tag} className="tag ecosystem-tag">{tag}</span>
                  ))}
                </div>
                <p className="notes">{result.curator.curatorNotes}</p>

                {/* Nyakupfuya Summary - from Curator (integrated approach) */}
                {result.curator.nyakupfuyaSummary && (
                  <div className="summary nyakupfuya">
                    <strong>🐄 Nyakupfuya (Livestock Keeper Test):</strong>
                    <p>{result.curator.nyakupfuyaSummary}</p>
                  </div>
                )}
              </div>

              <div className="section summaries-section">
                <h4>📝 Summaries</h4>

                <div className="summary">
                  <strong>One-liner:</strong>
                  <p className="one-liner">"{result.synthesizer.summaries.oneLiner}"</p>
                </div>

                <div className="summary">
                  <strong>Paragraph:</strong>
                  <p>{result.synthesizer.summaries.paragraph}</p>
                </div>

                {/* Fallback to Synthesizer's nyakupfuya if Curator didn't provide one */}
                {!result.curator.nyakupfuyaSummary && result.synthesizer.summaries.nyakupfuya && (
                  <div className="summary nyakupfuya">
                    <strong>🐄 Nyakupfuya (Livestock Keeper Explanation):</strong>
                    <div className="nyakupfuya-text">{result.synthesizer.summaries.nyakupfuya}</div>
                  </div>
                )}
              </div>

              {/* Key Concepts - Deep dive into technical terms */}
              {result.synthesizer.keyConcepts && result.synthesizer.keyConcepts.length > 0 && (
                <div className="section concepts-section">
                  <h4>🔑 Key Concepts Explained</h4>
                  {result.synthesizer.keyConcepts.map((concept, idx) => (
                    <div key={idx} className="concept-card">
                      <div className="concept-term">{concept.term}</div>
                      <div className="concept-definition">{concept.simpleDefinition}</div>
                      <div className="concept-analogy">
                        <span className="analogy-icon">🌾</span> {concept.analogy}
                      </div>
                      <div className="concept-importance">
                        <em>Why it matters:</em> {concept.whyItMatters}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Practical Implications */}
              {result.synthesizer.practicalImplications && result.synthesizer.practicalImplications.length > 0 && (
                <div className="section implications-section">
                  <h4>💡 Practical Implications</h4>
                  <ul className="implications-list">
                    {result.synthesizer.practicalImplications.map((impl, idx) => (
                      <li key={idx}>{impl}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Path */}
              {result.synthesizer.learningPath && (
                <div className="section learning-section">
                  <h4>📚 Learning Path</h4>

                  {result.synthesizer.learningPath.prerequisites?.length > 0 && (
                    <div className="learning-block">
                      <strong>📖 Before reading this:</strong>
                      <ul>
                        {result.synthesizer.learningPath.prerequisites.map((prereq, idx) => (
                          <li key={idx}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.synthesizer.learningPath.nextSteps?.length > 0 && (
                    <div className="learning-block">
                      <strong>➡️ After reading this:</strong>
                      <ul>
                        {result.synthesizer.learningPath.nextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.synthesizer.learningPath.questions?.length > 0 && (
                    <div className="learning-block">
                      <strong>❓ Questions to explore:</strong>
                      <ul>
                        {result.synthesizer.learningPath.questions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {result.synthesizer.relatedPapers.length > 0 && (
                <div className="section relations-section">
                  <h4>🔗 Related Papers</h4>
                  <ul>
                    {result.synthesizer.relatedPapers.map((rel) => (
                      <li key={rel.paperId}>
                        <strong>{rel.paperId}</strong>: {rel.relationship}
                        (strength: {(rel.strength * 100).toFixed(0)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .paper-processor {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        .description {
          color: #666;
          margin-bottom: 1.5rem;
        }
        .mode-section {
          margin-bottom: 1.5rem;
        }
        .mode-label {
          display: block;
          font-size: 0.85rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .mode-toggle {
          display: flex;
          gap: 0.5rem;
        }
        .mode-btn {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #333;
          background: #0d0d1a;
          color: #888;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .mode-btn.active {
          border-color: #d97706;
          color: #fff;
          background: #1a1a2e;
        }
        .mode-btn:hover:not(.active) {
          border-color: #555;
          color: #aaa;
        }
        .form {
          background: #1a1a2e;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .field {
          margin-bottom: 1rem;
        }
        .field label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #ccc;
        }
        .field input, .field textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #333;
          border-radius: 4px;
          background: #0d0d1a;
          color: #fff;
          font-size: 1rem;
        }
        .pdf-dropzone {
          border: 2px dashed #444;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pdf-dropzone:hover {
          border-color: #d97706;
          background: rgba(217, 119, 6, 0.1);
        }
        .pdf-placeholder {
          color: #888;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .upload-icon {
          font-size: 2rem;
        }
        .pdf-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #10b981;
        }
        .pdf-icon {
          font-size: 2rem;
        }
         .pdf-size {
          color: #888;
          margin-left: 0.5rem;
        }
        .process-btn {
          background: linear-gradient(135deg, #b45309, #d97706);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: opacity 0.2s;
          width: 100%;
          margin-top: 0.5rem;
        }
        .process-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .result {
          background: #1a1a2e;
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
        }
        .result h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }
        .result h4 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: #e5e5e5;
        }
        .result p {
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.7;
        }
        .result-success { border-color: #10b981; }
        .result-rejected { border-color: #f59e0b; }
        .result-error { border-color: #ef4444; }
        .result-title {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: #fff;
          font-weight: 600;
        }
        .extracted-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          background: #0d0d1a;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          color: #9ca3af;
        }
        .extracted-info span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #374151;
        }
        .section:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin: 1rem 0;
          font-size: 1rem;
          color: #e5e5e5;
        }
        .stats strong {
          color: #9ca3af;
          margin-right: 0.25rem;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .tag {
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .domain-tag { background: #1e3a5f; color: #60a5fa; }
        .ecosystem-tag { background: #3d2e0a; color: #fbbf24; }
        .notes {
          font-style: italic;
          color: #9ca3af;
          font-size: 1rem;
          line-height: 1.6;
        }
        .summary {
          margin-bottom: 1.5rem;
        }
        .summary strong {
          display: block;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        .one-liner {
          font-size: 1.15rem;
          font-style: italic;
          color: #fff;
          line-height: 1.5;
        }
        .nyakupfuya {
          background: #1e2a1e;
          padding: 1.25rem;
          border-radius: 8px;
          border-left: 4px solid #10b981;
          margin-top: 1rem;
        }
        .nyakupfuya strong {
          color: #10b981 !important;
          font-size: 1rem;
        }
        .nyakupfuya p, .nyakupfuya-text {
          margin: 0.75rem 0 0;
          font-size: 1.05rem;
          color: #d1fae5;
          line-height: 1.8;
          white-space: pre-wrap;
        }
        
        /* Key Concepts Section */
        .concepts-section {
          background: #1a1a2e;
          padding: 1.25rem;
          border-radius: 8px;
          margin-top: 1rem;
        }
        .concept-card {
          background: #0d0d1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .concept-card:last-child {
          margin-bottom: 0;
        }
        .concept-term {
          font-size: 1.1rem;
          font-weight: 700;
          color: #d97706;
          margin-bottom: 0.5rem;
        }
        .concept-definition {
          font-size: 1rem;
          color: #ccc;
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .concept-analogy {
          background: #1e2a1e;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.95rem;
          color: #d1fae5;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }
        .analogy-icon {
          margin-right: 0.5rem;
        }
        .concept-importance {
          font-size: 0.9rem;
          color: #888;
          line-height: 1.5;
        }
        .concept-importance em {
          color: #aaa;
        }
        
        /* Practical Implications */
        .implications-section {
          background: #1a1a2e;
          padding: 1.25rem;
          border-radius: 8px;
          margin-top: 1rem;
        }
        .implications-list {
          margin: 0.75rem 0 0;
          padding-left: 1.5rem;
        }
        .implications-list li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #ccc;
        }
        
        /* Learning Path */
        .learning-section {
          background: #1a1a2e;
          padding: 1.25rem;
          border-radius: 8px;
          margin-top: 1rem;
        }
        .learning-block {
          margin-top: 1rem;
        }
        .learning-block:first-of-type {
          margin-top: 0.5rem;
        }
        .learning-block strong {
          color: #d97706;
          font-size: 0.95rem;
        }
        .learning-block ul {
          margin: 0.5rem 0 0;
          padding-left: 1.5rem;
        }
        .learning-block li {
          margin-bottom: 0.4rem;
          color: #bbb;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
