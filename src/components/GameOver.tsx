'use client';

import React from 'react';

interface GameOverProps {
  winnerName: string;
  onPlayAgain: () => void;
  turnCount: number;
}

export default function GameOver({ winnerName, onPlayAgain, turnCount }: GameOverProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="text-6xl mb-6">🏆</div>
      <h2 className="text-4xl sm:text-5xl font-black text-yellow-400 mb-2">
        {winnerName}
      </h2>
      <p className="text-xl text-white/60 mb-2">wins the game!</p>
      <p className="text-sm text-white/30 mb-8">
        Game completed in {turnCount} turns
      </p>

      <button
        onClick={onPlayAgain}
        className="px-8 py-3 rounded-xl font-bold text-lg
          bg-gradient-to-r from-yellow-400 to-amber-500 text-black
          hover:from-yellow-300 hover:to-amber-400
          shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40
          transition-all duration-200 hover:scale-105
          active:scale-95"
      >
        Play Again
      </button>
    </div>
  );
}
