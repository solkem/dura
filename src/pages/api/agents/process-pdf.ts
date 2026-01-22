import type { APIRoute } from "astro";
import { extractPdfText, prepareForAnalysis } from "../../../agents/utils/pdf-extract";
import { curatePaper } from "../../../agents/curator";
import { synthesizePaper } from "../../../agents/synthesizer";
import { db } from "../../../db";
import { papers } from "../../../db/schema";
import { nanoid } from "nanoid";

export const prerender = false;

export const POST: APIRoute = async (context) => {
    console.log("[process-pdf] Request received");

    // Check authentication
    if (!context.locals.user) {
        console.log("[process-pdf] Unauthorized - no user");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    console.log("[process-pdf] User:", context.locals.user.username);

    try {
        const formData = await context.request.formData();
        const file = formData.get("pdf") as File;
        const titleOverride = formData.get("title") as string | null;

        if (!file || file.type !== "application/pdf") {
            return new Response(JSON.stringify({ error: "Please upload a PDF file" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        console.log(`Processing PDF: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

        // Read PDF buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        console.log("Extracting text from PDF...");
        const extractedPaper = await extractPdfText(buffer);

        console.log(`Extracted: ${extractedPaper.pageCount} pages, ${extractedPaper.wordCount} words`);
        console.log(`Title: ${extractedPaper.title || "(not detected)"}`);
        console.log(`Abstract length: ${extractedPaper.abstract.length} chars`);

        // Use title from form or extracted
        const title = titleOverride || extractedPaper.title || file.name.replace(".pdf", "");

        // Prepare content for analysis
        const analysisContent = prepareForAnalysis(extractedPaper);
        console.log(`Prepared ${analysisContent.length} chars for analysis`);

        // Run Curator with full content
        console.log("Running Curator agent...");
        const curatorResult = await curatePaper({
            title,
            abstract: analysisContent  // Send structured sections instead of just abstract
        });

        // Generate paper ID
        const paperId = nanoid(12);

        if (curatorResult.curatorStatus === "rejected") {
            // Still save rejected papers but with rejected status
            await db.insert(papers).values({
                id: paperId,
                title,
                abstract: extractedPaper.abstract || analysisContent.slice(0, 2000),
                curatorStatus: 'rejected',
                relevanceScore: curatorResult.relevanceScore,
                accessibilityScore: curatorResult.accessibilityScore,
                difficulty: curatorResult.difficulty,
                domainTags: JSON.stringify(curatorResult.domainTags),
                ecosystemTags: JSON.stringify(curatorResult.ecosystemTags),
                curatorNotes: curatorResult.curatorNotes,
                createdAt: new Date().toISOString(),
            });

            return new Response(JSON.stringify({
                status: "rejected",
                paperId,
                title,
                extracted: {
                    pageCount: extractedPaper.pageCount,
                    wordCount: extractedPaper.wordCount,
                    hasAbstract: !!extractedPaper.abstract,
                    hasIntro: !!extractedPaper.introduction,
                    hasConclusion: !!extractedPaper.conclusion
                },
                curator: curatorResult
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Run Synthesizer with full content
        console.log("Running Synthesizer agent...");
        const synthesizerResult = await synthesizePaper({
            paper: {
                id: paperId,
                title,
                abstract: analysisContent,
                domainTags: curatorResult.domainTags
            },
            existingPapers: [] // TODO: fetch from database
        });

        // Save approved paper to database
        console.log("Saving paper to database...");
        await db.insert(papers).values({
            id: paperId,
            title,
            abstract: extractedPaper.abstract || analysisContent.slice(0, 2000),
            curatorStatus: 'approved',
            relevanceScore: curatorResult.relevanceScore,
            accessibilityScore: curatorResult.accessibilityScore,
            difficulty: curatorResult.difficulty,
            domainTags: JSON.stringify(curatorResult.domainTags),
            ecosystemTags: JSON.stringify(curatorResult.ecosystemTags),
            curatorNotes: curatorResult.curatorNotes,
            synthesizerData: JSON.stringify(synthesizerResult),
            createdAt: new Date().toISOString(),
        });
        console.log(`Paper saved with ID: ${paperId}`);

        return new Response(JSON.stringify({
            status: "success",
            paperId,
            title,
            extracted: {
                pageCount: extractedPaper.pageCount,
                wordCount: extractedPaper.wordCount,
                hasAbstract: !!extractedPaper.abstract,
                hasIntro: !!extractedPaper.introduction,
                hasConclusion: !!extractedPaper.conclusion,
                hasMethods: !!extractedPaper.methodology
            },
            curator: curatorResult,
            synthesizer: synthesizerResult
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("PDF processing error:", error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : "Failed to process PDF"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
