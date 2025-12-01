import React from 'react';
import { QueryBubblesProps } from '../types';

export const QueryBubbles: React.FC<QueryBubblesProps> = ({ queries, onSelect, disabled, vertical = false, rightSide = false }) => {
  return (
    <div className={`flex ${vertical ? 'flex-col justify-center h-full space-y-4' : 'flex-wrap justify-center gap-3'}`}>
      {queries.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className={`
            relative group overflow-hidden bg-white/5 hover:bg-white/10 
            border border-white/10 hover:border-solana-green/50 
            backdrop-blur-md rounded-full px-4 py-2 text-xs md:text-sm 
            text-gray-300 hover:text-white transition-all duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
            ${vertical ? (rightSide ? 'mr-auto md:ml-0 md:translate-x-0' : 'ml-auto md:mr-0 md:translate-x-0') : ''}
          `}
          style={{
             // Add a slight random offset for the "floating" feel in vertical mode
             transform: vertical ? `translateX(${rightSide ? '-' : ''}${Math.random() * 10}px)` : 'none'
          }}
        >
          <span className="relative z-10">{q}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-solana-purple/20 to-solana-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      ))}
    </div>
  );
};