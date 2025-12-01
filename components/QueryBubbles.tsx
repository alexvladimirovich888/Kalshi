import React from 'react';
import { QueryBubblesProps } from '../types';

export const QueryBubbles: React.FC<QueryBubblesProps> = ({ queries, onSelect, disabled, vertical = false, rightSide = false }) => {
  return (
    <div className={`flex ${vertical ? 'flex-col justify-center h-full space-y-5' : 'flex-wrap justify-center gap-3'}`}>
      {queries.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className={`
            relative group overflow-hidden 
            bg-black/60 hover:bg-solana-purple/90
            border-2 border-solana-purple/30 hover:border-solana-green
            backdrop-blur-md rounded-full px-5 py-3 
            text-sm font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)]
            transition-all duration-300 transform
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(153,69,255,0.6)]'}
            ${vertical ? (rightSide ? 'mr-auto md:ml-0 md:translate-x-0' : 'ml-auto md:mr-0 md:translate-x-0') : ''}
          `}
          style={{
             // Add a slight random offset for the "floating" feel in vertical mode
             transform: vertical ? `translateX(${rightSide ? '-' : ''}${Math.random() * 10}px)` : 'none'
          }}
        >
          <span className="relative z-10 drop-shadow-md">{q}</span>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>
      ))}
    </div>
  );
};