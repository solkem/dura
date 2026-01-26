import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In production, GOOGLE_AI_API_KEY is passed via Docker -e flag
// Lazy initialize Gemini client to ensure env is loaded
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    // Try multiple sources for the API key
    const apiKey = (import.meta as any).env?.GOOGLE_AI_API_KEY
      || process.env.GOOGLE_AI_API_KEY
      || '';

    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY not found in environment');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generate a JSON response from Gemini
 * @param systemPrompt - The system instructions for the model
 * @param userPrompt - The user's input/question
 * @returns Parsed JSON response
 */
export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<{ result: T; usage: { tokensIn: number; tokensOut: number } }> {
  /*
   * Changing model to gemini-1.5-flash-002 as it seems to be the most stable available model.
   * If this fails with 404, we might need to check if the API key has access to it.
   */
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);

  const response = result.response;
  const text = response.text();

  // Extract token usage from response metadata
  const usageMetadata = response.usageMetadata;
  const usage = {
    tokensIn: usageMetadata?.promptTokenCount || 0,
    tokensOut: usageMetadata?.candidatesTokenCount || 0,
  };

  return {
    result: JSON.parse(text) as T,
    usage,
  };
}

/**
 * Generate a text response from Gemini (for non-JSON outputs)
 */
export async function generateText(
  systemPrompt: string,
  userPrompt: string
): Promise<{ result: string; usage: { tokensIn: number; tokensOut: number } }> {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 0.7,
    },
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);

  const response = result.response;
  const usageMetadata = response.usageMetadata;

  return {
    result: response.text(),
    usage: {
      tokensIn: usageMetadata?.promptTokenCount || 0,
      tokensOut: usageMetadata?.candidatesTokenCount || 0,
    },
  };
}
