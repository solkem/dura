/**
 * Gemini Context Caching Utility
 * 
 * NOTE: Full context caching requires upgrading to @google/genai package.
 * This module provides a simplified caching approach using in-memory cache
 * references and falls back to the standard approach.
 * 
 * For full Gemini API context caching:
 * 1. npm install @google/genai
 * 2. Update this file to use the GoogleGenAI client
 * 
 * @see https://ai.google.dev/gemini-api/docs/caching
 * @see docs/CONTEXT_CACHING.md
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Get API key from environment
function getApiKey(): string {
    const apiKey = (import.meta as any).env?.GOOGLE_AI_API_KEY
        || process.env.GOOGLE_AI_API_KEY
        || '';

    if (!apiKey) {
        console.error('GOOGLE_AI_API_KEY not found in environment');
    }
    return apiKey;
}

// Lazy initialize client
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(getApiKey());
    }
    return genAI;
}

/**
 * Model cache - reuses model instances with the same system prompt
 * This provides partial caching benefits by reusing the model configuration
 */
const modelCache: Map<string, GenerativeModel> = new Map();

/**
 * Get or create a model with cached system instruction
 * 
 * This is a lightweight caching approach that reuses model instances.
 * For full API-level caching, upgrade to @google/genai package.
 */
function getOrCreateModel(cacheName: string, systemInstruction: string): GenerativeModel {
    const existing = modelCache.get(cacheName);
    if (existing) {
        console.log(`[Cache] Reusing model instance: ${cacheName}`);
        return existing;
    }

    console.log(`[Cache] Creating new model instance: ${cacheName}`);

    const model = getGenAI().getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
        },
        systemInstruction: systemInstruction,
    });

    modelCache.set(cacheName, model);
    return model;
}

/**
 * Generate JSON content using a cached model instance
 * 
 * @param cacheName - Unique identifier for this cache (e.g., 'curator')
 * @param systemInstruction - The system prompt
 * @param userPrompt - The user's request
 * @returns Parsed JSON result and usage metadata
 */
export async function generateJSONWithCache<T>(
    cacheName: string,
    systemInstruction: string,
    userPrompt: string
): Promise<{
    result: T;
    usage: {
        tokensIn: number;
        tokensOut: number;
        cachedTokens: number;
    };
}> {
    const model = getOrCreateModel(cacheName, systemInstruction);

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();

    // Extract usage metadata
    const usageMetadata = response.usageMetadata;

    // Note: cachedContentTokenCount only available with full API caching
    const usage = {
        tokensIn: usageMetadata?.promptTokenCount || 0,
        tokensOut: usageMetadata?.candidatesTokenCount || 0,
        cachedTokens: (usageMetadata as any)?.cachedContentTokenCount || 0,
    };

    return {
        result: JSON.parse(text) as T,
        usage,
    };
}

/**
 * Generate text content using a cached model instance
 */
export async function generateTextWithCache(
    cacheName: string,
    systemInstruction: string,
    userPrompt: string
): Promise<{
    text: string;
    usage: {
        tokensIn: number;
        tokensOut: number;
        cachedTokens: number;
    };
}> {
    const model = getOrCreateModel(cacheName, systemInstruction);

    const result = await model.generateContent(userPrompt);
    const response = result.response;

    const usageMetadata = response.usageMetadata;

    return {
        text: response.text(),
        usage: {
            tokensIn: usageMetadata?.promptTokenCount || 0,
            tokensOut: usageMetadata?.candidatesTokenCount || 0,
            cachedTokens: (usageMetadata as any)?.cachedContentTokenCount || 0,
        },
    };
}

/**
 * Clear a specific model cache
 */
export function clearCache(cacheName: string): void {
    modelCache.delete(cacheName);
    console.log(`[Cache] Cleared cache: ${cacheName}`);
}

/**
 * Clear all model caches
 */
export function clearAllCaches(): void {
    modelCache.clear();
    console.log('[Cache] All caches cleared');
}

/**
 * List all active cache names
 */
export function listCaches(): string[] {
    return Array.from(modelCache.keys());
}
