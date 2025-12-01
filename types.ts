import React from 'react';

export interface PredictionResult {
  text: string;
  outcomeColor: string; // Tailwind class, e.g., 'text-green-400'
  ctaLink: string;
  ctaText: string;
  query?: string;
}

export interface CrystalBallProps {
  isShaking: boolean;
  isLoading: boolean;
  children?: React.ReactNode;
}

export interface QueryBubblesProps {
  queries: string[];
  onSelect: (query: string) => void;
  disabled: boolean;
  vertical?: boolean;
  rightSide?: boolean;
}