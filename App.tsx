import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CrystalBall } from './components/CrystalBall';
import { QueryBubbles } from './components/QueryBubbles';
import { PredictionOverlay } from './components/PredictionOverlay';
import { getGeminiPrediction } from './services/geminiService';
import { getCryptoPrice } from './services/cryptoService';
import { PredictionResult } from './types';
import { Share2, Zap, Trophy, History } from 'lucide-react';

const PRE_MADE_QUERIES = [
  "Will SOL flip ETH by 2026?",
  "Who wins the US Election?",
  "Next 100x meme coin?",
  "Will it rain in London tomorrow?",
  "Is the Bull Run over?",
  "Should I leverage long?",
  "Will AI take my job?",
  "Wen Lambo?",
  "Will Jupiter do another airdrop?",
  "Is my wallet safu?"
];

export default function App() {
  const [isShaking, setIsShaking] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [shakeCount, setShakeCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<PredictionResult[]>([]);

  // Sound effect ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem('solana_ball_shakes');
    if (savedCount) setShakeCount(parseInt(savedCount, 10));
    
    // Initialize audio
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audioRef.current.volume = 0.3;
  }, []);

  const handleShake = useCallback(async (query: string) => {
    if (isLoading || isShaking) return;

    // Reset previous prediction state
    setPrediction(null);
    setIsShaking(true);
    setIsLoading(true);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {}); 
    }

    // Increment counter
    const newCount = shakeCount + 1;
    setShakeCount(newCount);
    localStorage.setItem('solana_ball_shakes', newCount.toString());

    try {
      // Fetch context data (SOL Price)
      const solPrice = await getCryptoPrice('solana');
      
      // Artificial delay for the "Shake" animation to play out nicely
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await getGeminiPrediction(query, solPrice);
      
      setPrediction(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
    } catch (error) {
      console.error(error);
      setPrediction({
        text: "The blockchain is congested. My vision is clouded. Try again, mortal.",
        outcomeColor: 'text-red-400',
        ctaLink: 'https://status.solana.com/',
        ctaText: 'Check Status'
      });
    } finally {
      setIsShaking(false);
      setIsLoading(false);
    }
  }, [isLoading, isShaking, shakeCount]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      handleShake(customQuery);
      setCustomQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden text-white font-sans selection:bg-solana-green selection:text-black">
      
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-solana-purple rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-solana-green rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-4xl p-6 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-orbitron font-black bg-gradient-to-r from-solana-green to-solana-purple bg-clip-text text-transparent drop-shadow-lg mb-2">
          Kalshi Crystal Ball
        </h1>
        <p className="text-gray-300 text-sm md:text-lg font-light tracking-wide">
          Shake the Future. Powered by <span className="text-solana-green font-bold">Kalshi</span> & <span className="text-solana-purple font-bold">Jupiter</span>.
        </p>
        <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
           <span className="flex items-center gap-1"><Trophy size={12} /> {shakeCount.toLocaleString()} Shakes</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => setShowHistory(!showHistory)}>
             <History size={12} /> Recent Visions
           </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl relative z-10 px-4">
        
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-16">
          
          {/* Mobile Queries (Top) */}
          <div className="md:hidden w-full mb-4">
             <QueryBubbles queries={PRE_MADE_QUERIES.slice(0, 4)} onSelect={handleShake} disabled={isLoading} />
          </div>

          {/* Left Queries (Desktop) */}
          <div className="hidden md:block w-64 h-96">
            <QueryBubbles queries={PRE_MADE_QUERIES.slice(0, 5)} onSelect={handleShake} disabled={isLoading} vertical />
          </div>

          {/* The Crystal Ball */}
          <div className="relative flex flex-col items-center">
            <CrystalBall isShaking={isShaking} isLoading={isLoading}>
               {prediction && !isShaking && (
                 <PredictionOverlay prediction={prediction} onClose={() => setPrediction(null)} />
               )}
            </CrystalBall>

            {/* Custom Input */}
            <form onSubmit={handleCustomSubmit} className="mt-8 relative w-full max-w-xs md:max-w-sm group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative flex">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask the Oracle anything..."
                  className="w-full bg-solana-dark border border-gray-700 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-solana-purple placeholder-gray-500"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={!customQuery || isLoading}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-r-lg border-t border-r border-b border-gray-700 font-bold transition-colors flex items-center"
                >
                  <Zap size={18} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Queries (Desktop) */}
          <div className="hidden md:block w-64 h-96">
            <QueryBubbles queries={PRE_MADE_QUERIES.slice(5, 10)} onSelect={handleShake} disabled={isLoading} vertical rightSide />
          </div>
          
           {/* Mobile Queries (Bottom) */}
           <div className="md:hidden w-full mt-4">
             <QueryBubbles queries={PRE_MADE_QUERIES.slice(4, 8)} onSelect={handleShake} disabled={isLoading} />
          </div>

        </div>
      </main>

      {/* History Drawer */}
      {showHistory && (
         <div className="absolute inset-0 bg-black/90 z-50 flex flex-col p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-orbitron text-solana-green">Past Visions</h2>
              <button onClick={() => setShowHistory(false)} className="text-white hover:text-solana-purple">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {history.length === 0 ? <p className="text-gray-500">The mists of time are empty...</p> : 
               history.map((item, idx) => (
                 <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                    <p className="text-lg mb-2">{item.text}</p>
                    <a href={item.ctaLink} target="_blank" rel="noreferrer" className="text-sm text-solana-purple underline">{item.ctaText}</a>
                 </div>
               ))
              }
            </div>
         </div>
      )}

      {/* Footer */}
      <footer className="w-full p-6 text-center z-10 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://solana.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-green transition-colors text-sm">Solana</a>
          <a href="https://kalshi.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-green transition-colors text-sm">Kalshi</a>
          <a href="https://jup.ag" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-purple transition-colors text-sm">Jupiter</a>
          <a href="https://dflow.net" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-purple transition-colors text-sm">DFlow</a>
        </div>
      </footer>
    </div>
  );
}