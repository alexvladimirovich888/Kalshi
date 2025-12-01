import React, { useEffect, useState } from 'react';
import { PredictionResult } from '../types';
import { Share2, Clock, ExternalLink, X } from 'lucide-react';

interface PredictionOverlayProps {
  prediction: PredictionResult;
  onClose: () => void;
}

export const PredictionOverlay: React.FC<PredictionOverlayProps> = ({ prediction, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShare = () => {
    const text = `🔮 The Kalshi Crystal Ball predicts: "${prediction.text}" \n\nSee your future now:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}&hashtags=Solana,Kalshi,CryptoOracle`;
    window.open(url, '_blank');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4 animate-[fadeIn_0.5s_ease-out]">
        
        {/* Floating Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1 hover:bg-black/50">
          <X size={24} />
        </button>

        {/* Prediction Text - Floating with Heavy Shadow */}
        <div className="flex-1 flex items-center justify-center w-full">
          <p className={`text-2xl md:text-3xl font-black text-center font-orbitron tracking-wide ${prediction.outcomeColor} drop-shadow-[0_4px_4px_rgba(0,0,0,1)] text-shadow-strong leading-normal`}>
            "{prediction.text}"
          </p>
        </div>

        {/* Minimal Bottom Bar for Action */}
        <div className="w-full flex flex-col items-center gap-3 mt-auto mb-4">
          
          {/* Subtle Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-red-500/30 backdrop-blur-sm">
             <Clock size={12} className="text-red-400 animate-pulse" />
             <span className="text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold">Alpha expires: {formatTime(timeLeft)}</span>
          </div>

          <div className="flex gap-3 w-full justify-center">
            <a 
              href={prediction.ctaLink} 
              target="_blank" 
              rel="noreferrer"
              className="bg-solana-green hover:bg-green-400 text-black text-sm font-black px-5 py-2 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_15px_rgba(20,241,149,0.5)] border-2 border-transparent hover:border-white"
            >
              {prediction.ctaText} <ExternalLink size={14} strokeWidth={3} />
            </a>
            
            <button 
              onClick={handleShare}
              className="bg-solana-purple hover:bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_15px_rgba(153,69,255,0.5)] border-2 border-transparent hover:border-white"
            >
              SHARE <Share2 size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
    </div>
  );
};