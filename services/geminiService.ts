import { PredictionResult } from "../types";

// Static database of predictions to simulate AI without an API Key
const PREDICTIONS = [
  { text: "The charts say YES! It's programmed.", sentiment: "bullish", cta: "JUPITER" },
  { text: "My vision is cloudy... but likely rugpull.", sentiment: "bearish", cta: "DFLOW" },
  { text: "100% Guaranteed! (Not financial advice).", sentiment: "bullish", cta: "KALSHI" },
  { text: "The stars align for a massive pump.", sentiment: "bullish", cta: "PUMP" },
  { text: "Dump incoming. Save your liquidity.", sentiment: "bearish", cta: "JUPITER" },
  { text: "Only if you sacrifice a small goat to the validator.", sentiment: "neutral", cta: "SOLANA" },
  { text: "Yes, but gas fees will eat your soul.", sentiment: "neutral", cta: "SOLANA" },
  { text: "The prophecy is written: WAGMI.", sentiment: "bullish", cta: "KALSHI" },
  { text: "Outlook hazy, ask your mom.", sentiment: "neutral", cta: "SOLANA" },
  { text: "Green candles are in your future.", sentiment: "bullish", cta: "JUPITER" },
  { text: "Short it with 100x leverage. Do it.", sentiment: "bearish", cta: "DFLOW" },
  { text: "The spirits say: HODL.", sentiment: "bullish", cta: "KALSHI" },
  { text: "No. Just no.", sentiment: "bearish", cta: "SOLANA" },
  { text: "Maybe, if Bitcoin behaves.", sentiment: "neutral", cta: "KALSHI" },
  { text: "Confirmed by the Illuminati.", sentiment: "bullish", cta: "PUMP" },
];

const LINK_MAP = {
  JUPITER: { url: "https://jup.ag/swap/SOL-USDC", text: "Long it on Jupiter" },
  KALSHI: { url: "https://kalshi.com/", text: "Bet on Kalshi" },
  DFLOW: { url: "https://dflow.net/", text: "Hedge on DFlow" },
  PUMP: { url: "https://pump.fun/", text: "Ape in on pump.fun" },
  SOLANA: { url: "https://solana.com/", text: "Learn about Solana" }
};

export async function getGeminiPrediction(query: string, currentSolPrice: string): Promise<PredictionResult> {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));

  // If asking about price
  if (query.toLowerCase().includes('price') || query.toLowerCase().includes('cap')) {
     return {
        text: `At $${currentSolPrice.replace('$', '')}, the oracle sees a 10x multiplier incoming. 🚀`,
        outcomeColor: "text-solana-green",
        ctaLink: LINK_MAP.JUPITER.url,
        ctaText: LINK_MAP.JUPITER.text,
        query
     };
  }

  // Handle custom empty query or "think" request
  if (query.length > 50 && Math.random() > 0.8) {
     return {
       text: "Hmm... that's deep. I need more tokens to process that.",
       outcomeColor: "text-gray-400",
       ctaLink: LINK_MAP.SOLANA.url,
       ctaText: "Feed the Oracle",
       query
     };
  }

  // Pick a random prediction based on a simple hash of the query string to keep it consistent-ish
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomIndex = (hash + Date.now()) % PREDICTIONS.length; // Add Date.now() for randomness on repeat clicks
  const p = PREDICTIONS[randomIndex];

  const linkData = LINK_MAP[p.cta as keyof typeof LINK_MAP];
  const outcomeColor = p.sentiment === 'bullish' ? 'text-solana-green' : p.sentiment === 'bearish' ? 'text-red-400' : 'text-blue-300';

  return {
    text: p.text,
    outcomeColor,
    ctaLink: linkData.url,
    ctaText: linkData.text,
    query
  };
}