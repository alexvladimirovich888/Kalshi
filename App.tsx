import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CrystalBall } from './components/CrystalBall';
import { QueryBubbles } from './components/QueryBubbles';
import { PredictionOverlay } from './components/PredictionOverlay';
import { getGeminiPrediction } from './services/geminiService';
import { getCryptoPrice } from './services/cryptoService';
import { PredictionResult } from './types';
import { Zap, Trophy, History } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden text-white font-sans selection:bg-solana-green selection:text-black bg-[url('https://i.postimg.cc/xds0ztKq/c45a7c11-86c0-4809-b153-dc96d6e51d65.jpg')] bg-cover bg-center bg-fixed">
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Background Gradients (Enhanced for color) */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-solana-purple rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-solana-green rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="w-full max-w-4xl p-6 text-center z-10 mt-4">
        <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white drop-shadow-[0_0_15px_rgba(153,69,255,0.8)] mb-2 tracking-wider">
          <span className="bg-gradient-to-r from-solana-green via-white to-solana-purple bg-clip-text text-transparent">Kalshi Crystal Ball</span>
        </h1>
        <p className="text-white text-sm md:text-lg font-medium tracking-wide drop-shadow-md">
          Shake the Future. Powered by <span className="text-solana-green font-bold text-shadow-glow">Kalshi</span> & <span className="text-solana-purple font-bold text-shadow-glow">Jupiter</span>.
        </p>
        <div className="mt-3 flex justify-center gap-4 text-xs font-semibold text-gray-300">
           <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Trophy size={12} className="text-yellow-400" /> {shakeCount.toLocaleString()} Shakes</span>
           <span className="flex items-center gap-1 cursor-pointer hover:text-white hover:bg-solana-purple/50 transition-all bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10" onClick={() => setShowHistory(!showHistory)}>
             <History size={12} /> Recent Visions
           </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl relative z-10 px-4 py-8">
        
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-20">
          
          {/* Mobile Queries (Top) */}
          <div className="md:hidden w-full mb-4">
             <QueryBubbles queries={PRE_MADE_QUERIES.slice(0, 4)} onSelect={handleShake} disabled={isLoading} />
          </div>

          {/* Left Queries (Desktop) */}
          <div className="hidden md:flex w-64 h-96 items-center">
            <QueryBubbles queries={PRE_MADE_QUERIES.slice(0, 5)} onSelect={handleShake} disabled={isLoading} vertical />
          </div>

          {/* The Crystal Ball Area */}
          <div className="relative flex flex-col items-center">
            <CrystalBall isShaking={isShaking} isLoading={isLoading}>
               {prediction && !isShaking && (
                 <PredictionOverlay prediction={prediction} onClose={() => setPrediction(null)} />
               )}
            </CrystalBall>

            {/* Custom Input */}
            <form onSubmit={handleCustomSubmit} className="mt-10 relative w-full max-w-xs md:max-w-md group">
              <div className="absolute -inset-1 bg-gradient-to-r from-solana-purple via-solana-green to-solana-purple rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative flex shadow-2xl">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask the Oracle..."
                  className="w-full bg-black/80 backdrop-blur-xl border border-white/20 text-white px-5 py-4 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-solana-green placeholder-gray-400 font-medium text-lg"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={!customQuery || isLoading}
                  className="bg-solana-purple hover:bg-solana-purple/80 text-white px-6 py-4 rounded-r-xl border-l border-white/20 font-bold transition-all flex items-center shadow-[0_0_20px_rgba(153,69,255,0.5)] hover:shadow-[0_0_30px_rgba(153,69,255,0.8)]"
                >
                  <Zap size={24} className={isLoading ? "animate-spin" : "fill-white"} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Queries (Desktop) */}
          <div className="hidden md:flex w-64 h-96 items-center">
            <QueryBubbles queries={PRE_MADE_QUERIES.slice(5, 10)} onSelect={handleShake} disabled={isLoading} vertical rightSide />
          </div>
          
           {/* Mobile Queries (Bottom) */}
           <div className="md:hidden w-full mt-6">
             <QueryBubbles queries={PRE_MADE_QUERIES.slice(4, 8)} onSelect={handleShake} disabled={isLoading} />
          </div>

        </div>
      </main>

      {/* History Drawer */}
      {showHistory && (
         <div className="absolute inset-0 bg-black/95 z-50 flex flex-col p-6 backdrop-blur-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-solana-green to-solana-purple">Past Visions</h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white text-lg font-bold">CLOSE [X]</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {history.length === 0 ? <p className="text-gray-500 italic text-center mt-10">The mists of time are empty...</p> : 
               history.map((item, idx) => (
                 <div key={idx} className="bg-gray-900/80 border border-gray-700 p-5 rounded-xl shadow-lg hover:border-solana-green/50 transition-colors">
                    <p className="text-lg mb-2 font-medium text-gray-200">"{item.query}"</p>
                    <p className="text-solana-green mb-3 font-bold">🔮 {item.text}</p>
                    <a href={item.ctaLink} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-wider bg-solana-purple/20 text-solana-purple px-2 py-1 rounded hover:bg-solana-purple/40">{item.ctaText} &rarr;</a>
                 </div>
               ))
              }
            </div>
         </div>
      )}

      {/* Footer */}
      <footer className="w-full p-4 text-center z-10 bg-black/80 backdrop-blur-md border-t border-white/5 mt-auto">
        <div className="flex justify-center gap-8 mb-2">
          <a href="https://solana.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-green transition-colors font-bold uppercase tracking-wider text-xs">Solana</a>
          <a href="https://kalshi.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-green transition-colors font-bold uppercase tracking-wider text-xs">Kalshi</a>
          <a href="https://jup.ag" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-purple transition-colors font-bold uppercase tracking-wider text-xs">Jupiter</a>
          <a href="https://dflow.net" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-solana-purple transition-colors font-bold uppercase tracking-wider text-xs">DFlow</a>
        </div>
        <p className="text-[10px] text-gray-600">All predictions are satirical AI hallucinations.</p>
      </footer>
    </div>
  );
}