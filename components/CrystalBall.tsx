import React from 'react';
import { CrystalBallProps } from '../types';

export const CrystalBall: React.FC<CrystalBallProps> = ({ isShaking, isLoading, children }) => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
      
      {/* Outer Glow/Aura */}
      <div className={`absolute inset-0 rounded-full bg-solana-purple opacity-20 blur-[60px] transition-all duration-1000 ${isLoading ? 'animate-pulse scale-110' : 'scale-100'}`}></div>
      
      {/* The Ball Container */}
      <div className={`relative w-full h-full rounded-full z-20 transition-transform ${isShaking ? 'animate-shake' : 'animate-float'}`}>
        
        {/* The Ball Visual (CSS Art) */}
        <div className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_-10px_-10px_50px_rgba(20,241,149,0.3),_inset_10px_20px_60px_rgba(153,69,255,0.4),_0_0_50px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-sm bg-gradient-to-br from-white/10 to-black/80">
           
           {/* Inner swirls/fog */}
           <div className={`absolute inset-0 bg-[url('https://assets.codepen.io/13471/nebula.jpg')] bg-cover opacity-30 mix-blend-overlay ${isLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}></div>
           
           {/* Reflection */}
           <div className="absolute top-10 left-10 w-1/4 h-1/4 bg-white opacity-10 rounded-full blur-xl"></div>
           <div className="absolute bottom-10 right-10 w-1/3 h-1/3 bg-solana-purple opacity-20 rounded-full blur-2xl"></div>

           {/* Center Content Area */}
           <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              {children}
              
              {!children && !isLoading && (
                 <div className="text-white/30 font-orbitron tracking-widest text-sm animate-pulse">
                    READY
                 </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center gap-2">
                   <div className="w-12 h-12 border-4 border-t-solana-green border-r-transparent border-b-solana-purple border-l-transparent rounded-full animate-spin"></div>
                   <p className="text-solana-green text-xs font-mono animate-pulse">Consulting the Chain...</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* The Base/Stand */}
      <div className="absolute -bottom-12 w-2/3 h-12 bg-black rounded-[100%] blur-md opacity-60 z-10"></div>
      <div className="absolute -bottom-8 w-1/2 h-4 bg-gradient-to-r from-transparent via-solana-purple to-transparent opacity-50 blur-sm z-10"></div>
      
    </div>
  );
};