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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 animate-[fadeIn_0.8s_ease-out]">
        
        {/* Floating Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Prediction Text - No Block, Floating in Space */}
        <div className="flex-1 flex items-center justify-center w-full">
          <p className={`text-xl md:text-2xl font-black text-center font-orbitron tracking-wide ${prediction.outcomeColor} drop-shadow-[0_0_15px_rgba(0,0,0,1)] leading-snug`}>
            "{prediction.text}"
          </p>
        </div>

        {/* Minimal Bottom Bar for Action */}
        <div className="w-full flex flex-col items-center gap-2 mt-auto">
          
          {/* Subtle Timer */}
          <div className="flex items-center gap-1.5 opacity-80 mb-1 drop-shadow-md">
             <Clock size={12} className="text-red-400 animate-pulse" />
             <span className="text-red-400 text-[10px] font-mono tracking-widest uppercase">Alpha expires in {formatTime(timeLeft)}</span>
          </div>

          <div className="flex gap-2 w-full justify-center">
            <a 
              href={prediction.ctaLink} 
              target="_blank" 
              rel="noreferrer"
              className="bg-solana-green/80 hover:bg-solana-green text-black text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105 flex items-center gap-1 backdrop-blur-sm"
            >
              {prediction.ctaText} <ExternalLink size={12} />
            </a>
            
            <button 
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-full transition-colors flex items-center gap-1 backdrop-blur-sm border border-white/10"
            >
              <Share2 size={12} />
            </button>
          </div>
        </div>
    </div>
  );
};