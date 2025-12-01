import { GoogleGenAI } from "@google/genai";
import { PredictionResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
You are the "Kalshi Crystal Ball", a mystical, meme-loving, slightly "degen" crypto oracle.
Your goal is to provide funny, sharp, and confident predictions about the future.
You love the Solana ecosystem (SOL, Bonk, WIF, Jupiter, Kalshi).
Your tone is a mix of ancient mystic and modern crypto trader.
Use emojis. Be concise (max 2 sentences).

If the user asks about:
- Price: Give a bullish or wildly specific prediction. Add a disclaimer.
- Sports/Politics: Pick a winner confidently (randomly or based on common knowledge) and mention betting on Kalshi.
- Weather: Relate it to "cloud computing" or "liquidity".

You must return the response in a specific JSON format structure (but as text, I will parse it, or just use structured text).
Actually, to make it robust, just return the text of the prediction. I will handle links on the frontend based on keywords, OR you can suggest the best link type.

Output Format:
Return a JSON object with:
{
  "text": "The prediction string...",
  "linkType": "JUPITER" | "KALSHI" | "DFLOW" | "PUMP" | "SOLANA"
}
`;

const LINK_MAP = {
  JUPITER: { url: "https://jup.ag/swap/SOL-USDC", text: "Long it on Jupiter" },
  KALSHI: { url: "https://kalshi.com/", text: "Bet on Kalshi" },
  DFLOW: { url: "https://dflow.net/", text: "Hedge on DFlow" },
  PUMP: { url: "https://pump.fun/", text: "Ape in on pump.fun" },
  SOLANA: { url: "https://solana.com/", text: "Learn about Solana" }
};

export async function getGeminiPrediction(query: string, currentSolPrice: string): Promise<PredictionResult> {
  try {
    const prompt = `
      Context: Current Solana (SOL) Price is ${currentSolPrice}.
      User Question: "${query}"
      
      Generate a prediction JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    
    // Fallback if AI hallucinates format
    const text = data.text || "The spirits are mumbling. Try again.";
    const linkType = (data.linkType || "SOLANA").toUpperCase() as keyof typeof LINK_MAP;
    const linkData = LINK_MAP[linkType] || LINK_MAP.SOLANA;

    // Determine color sentiment roughly (simple heuristic)
    const isNegative = text.toLowerCase().includes("no") || text.toLowerCase().includes("drop") || text.toLowerCase().includes("bear");
    const outcomeColor = isNegative ? 'text-red-400' : 'text-solana-green';

    return {
      text,
      outcomeColor,
      ctaLink: linkData.url,
      ctaText: linkData.text,
      query
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback response
    return {
      text: "The Oracle is rebooting... 404 Prophecy Not Found.",
      outcomeColor: "text-gray-400",
      ctaLink: "https://solana.com/status",
      ctaText: "Check Network Status"
    };
  }
}