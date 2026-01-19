/**
 * PDF Text Extraction Utility
 * Extracts and structures key sections from research papers
 * Uses unpdf which works in Node.js environments
 */

import { extractText, getDocumentProxy } from 'unpdf';

export interface ExtractedPaper {
    title: string;
    abstract: string;
    introduction: string;
    methodology: string;
    conclusion: string;
    fullText: string;
    pageCount: number;
    wordCount: number;
}

/**
 * Extract text from a PDF buffer
 */
export async function extractPdfText(pdfBuffer: Buffer): Promise<ExtractedPaper> {
    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer);

    // Extract text using unpdf
    const { text, totalPages } = await extractText(uint8Array, { mergePages: true });

    const fullText = Array.isArray(text) ? text.join('\n') : text;
    const wordCount = fullText.split(/\s+/).length;

    // Extract sections using common patterns in academic papers
    const sections = extractSections(fullText);

    return {
        title: sections.title,
        abstract: sections.abstract,
        introduction: sections.introduction,
        methodology: sections.methodology,
        conclusion: sections.conclusion,
        fullText: fullText,
        pageCount: totalPages,
        wordCount
    };
}

/**
 * Extract key sections from paper text using pattern matching
 */
function extractSections(text: string): {
    title: string;
    abstract: string;
    introduction: string;
    methodology: string;
    conclusion: string;
} {
    // Normalize whitespace
    const normalized = text.replace(/\s+/g, ' ').trim();

    // Try to extract title (usually first meaningful line before abstract)
    const titleMatch = normalized.match(/^(.{10,200}?)(?=\s*(?:Abstract|ABSTRACT))/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract abstract
    const abstractMatch = normalized.match(/(?:Abstract|ABSTRACT)[:\s]*(.{100,3000}?)(?=\s*(?:1\.|1\s|Introduction|INTRODUCTION|Keywords|Key\s*words))/i);
    const abstract = abstractMatch ? abstractMatch[1].trim() : '';

    // Extract introduction
    const introMatch = normalized.match(/(?:1\.?\s*Introduction|INTRODUCTION)[:\s]*(.{100,5000}?)(?=\s*(?:2\.|II\.|Related|Background|Preliminaries|Method|Approach))/i);
    const introduction = introMatch ? introMatch[1].trim() : '';

    // Extract methodology/approach (various names)
    const methodMatch = normalized.match(/(?:Method(?:ology)?|Approach|System\s*Design|Technical\s*Approach|Our\s*Approach|Proposed\s*Method)[:\s]*(.{100,5000}?)(?=\s*(?:\d+\.|Experiment|Evaluation|Results|Implementation))/i);
    const methodology = methodMatch ? methodMatch[1].trim() : '';

    // Extract conclusion
    const conclusionMatch = normalized.match(/(?:Conclusion|CONCLUSION|Summary|Discussion\s*and\s*Conclusion)[:\s]*(.{100,3000}?)(?=\s*(?:References|REFERENCES|Acknowledgment|Appendix|$))/i);
    const conclusion = conclusionMatch ? conclusionMatch[1].trim() : '';

    return {
        title,
        abstract,
        introduction,
        methodology,
        conclusion
    };
}

/**
 * Prepare extracted paper for LLM analysis
 * Keeps content under token limits by prioritizing key sections
 */
export function prepareForAnalysis(paper: ExtractedPaper, maxChars: number = 15000): string {
    const sections: string[] = [];
    let currentLength = 0;

    // Always include title
    if (paper.title) {
        sections.push(`TITLE: ${paper.title}`);
        currentLength += paper.title.length + 10;
    }

    // Priority 1: Abstract (always include if present)
    if (paper.abstract) {
        sections.push(`\nABSTRACT:\n${paper.abstract}`);
        currentLength += paper.abstract.length + 15;
    }

    // Priority 2: Introduction
    if (paper.introduction && currentLength + paper.introduction.length < maxChars * 0.6) {
        sections.push(`\nINTRODUCTION:\n${paper.introduction}`);
        currentLength += paper.introduction.length + 20;
    }

    // Priority 3: Conclusion
    if (paper.conclusion && currentLength + paper.conclusion.length < maxChars * 0.8) {
        sections.push(`\nCONCLUSION:\n${paper.conclusion}`);
        currentLength += paper.conclusion.length + 15;
    }

    // Priority 4: Methodology (if space allows)
    if (paper.methodology && currentLength + paper.methodology.length < maxChars) {
        sections.push(`\nMETHODOLOGY:\n${paper.methodology}`);
    }

    return sections.join('\n');
}
