'use client';

import React, { useState } from 'react';
import { ThemeId } from '../lib/themes/types';
import { themeList } from '../lib/themes';

interface GameSetupProps {
  onStart: (playerCount: number) => void;
  mode?: 'local' | 'online';
  theme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
}

export default function GameSetup({ onStart, mode = 'local', theme = 'classic', onThemeChange }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-5xl sm:text-7xl mb-4">
          {theme === 'bali' ? '🏝️' : '🃏'}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {theme === 'bali' ? 'BALI' : 'MONOPOLY'}
          <span className={`block sm:inline ${theme === 'bali' ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {theme === 'bali' ? ' DEAL' : ' DEAL'}
          </span>
        </h1>
        <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">
          {mode === 'online' ? 'Online Multiplayer' : 'Card Game'}
        </p>
      </div>

      {/* Theme Selector */}
      {onThemeChange && (
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-5 mb-4 max-w-sm w-full">
          <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-3 text-center">
            Choose Theme
          </h2>
          <div className="flex gap-3 justify-center">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id as ThemeId)}
                className={`
                  flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 transition-all duration-200
                  ${theme === t.id
                    ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20 scale-105'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                <span className="text-2xl sm:text-3xl">{t.emoji}</span>
                <span className={`text-xs font-bold ${theme === t.id ? 'text-yellow-300' : 'text-white/60'}`}>
                  {t.name}
                </span>
                <span className="text-[9px] text-white/30 leading-tight text-center max-w-[80px]">
                  {t.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player count selector */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 mb-8 max-w-sm w-full">
        <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4 text-center">
          Number of Players
        </h2>

        <div className="flex gap-3 justify-center mb-6">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => setPlayerCount(count)}
              className={`
                w-16 h-16 rounded-xl font-bold text-lg transition-all duration-200
                ${playerCount === count
                  ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-110'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>

        <button
          onClick={() => onStart(playerCount)}
          className="w-full py-3 rounded-xl font-bold text-lg
            bg-gradient-to-r from-yellow-400 to-amber-500 text-black
            hover:from-yellow-300 hover:to-amber-400
            shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40
            transition-all duration-200 hover:scale-[1.02]
            active:scale-[0.98]"
        >
          Start Game
        </button>
      </div>

      {/* Rules summary */}
      <div className="text-center text-white/30 text-xs max-w-xs space-y-1">
        <p>Draw 2 cards per turn • Play up to 3 cards</p>
        <p>First to complete 3 property sets wins!</p>
        <p className="mt-2 text-white/20">
          {mode === 'online' ? '🌐 Online Multiplayer' : '🎮 Local hot-seat multiplayer'}
        </p>
      </div>
    </div>
  );
}
