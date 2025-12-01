import React from 'react';
import { CrystalBallProps } from '../types';

export const CrystalBall: React.FC<CrystalBallProps> = ({ isShaking, isLoading, children }) => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center my-4">
      
      {/* Pepe Wizard Character - Background Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[160%] md:w-[150%] z-0 pointer-events-none opacity-90">
          <img 
            src="https://i.postimg.cc/hGCdt8v1/Untitled-design-(91).png" 
            alt="Pepe Wizard"
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(20,241,149,0.15)]" 
          />
      </div>

      {/* Intense Outer Glow/Aura to separate from background */}
      <div className={`absolute inset-0 rounded-full bg-solana-purple opacity-40 blur-[50px] mix-blend-screen transition-all duration-1000 z-10 ${isLoading ? 'animate-pulse scale-110' : 'scale-105'}`}></div>
      <div className={`absolute inset-4 rounded-full bg-solana-green opacity-20 blur-[30px] mix-blend-overlay z-10`}></div>
      
      {/* The Ball Container */}
      <div className={`relative w-full h-full rounded-full z-20 transition-transform ${isShaking ? 'animate-shake' : 'animate-float'}`}>
        
        {/* The Ball Visual (CSS Art) */}
        <div className="w-full h-full rounded-full relative overflow-hidden shadow-[inset_-10px_-10px_50px_rgba(20,241,149,0.3),_inset_10px_20px_60px_rgba(153,69,255,0.4),_0_0_50px_rgba(0,0,0,0.9)] border-2 border-white/20 backdrop-blur-sm bg-black/40">
           
           {/* Inner swirls/fog */}
           <div className={`absolute inset-0 bg-[url('https://assets.codepen.io/13471/nebula.jpg')] bg-cover opacity-60 mix-blend-screen ${isLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}></div>
           
           {/* Stronger Reflection for realism */}
           <div className="absolute top-8 left-8 w-24 h-16 bg-white opacity-20 rounded-full blur-xl rotate-[-45deg]"></div>
           <div className="absolute bottom-10 right-10 w-32 h-32 bg-solana-purple opacity-30 rounded-full blur-2xl"></div>

           {/* Center Content Area */}
           <div className="absolute inset-0 flex items-center justify-center p-10 text-center z-30">
              {children}
              
              {!children && !isLoading && (
                 <div className="text-white/60 font-orbitron tracking-[0.3em] text-sm animate-pulse font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    TAP TO PREDICT
                 </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 border-4 border-t-solana-green border-r-transparent border-b-solana-purple border-l-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(153,69,255,0.8)]"></div>
                   <p className="text-solana-green text-sm font-orbitron font-bold animate-pulse drop-shadow-[0_0_5px_rgba(20,241,149,0.8)]">Consulting the Chain...</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* The Base/Stand - Darker for contrast */}
      <div className="absolute -bottom-12 w-2/3 h-12 bg-black rounded-[100%] blur-md opacity-80 z-10 shadow-2xl"></div>
      <div className="absolute -bottom-8 w-1/2 h-4 bg-gradient-to-r from-transparent via-solana-purple to-transparent opacity-70 blur-sm z-10"></div>
      
    </div>
  );
};