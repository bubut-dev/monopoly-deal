'use client';

import React from 'react';

interface GameBoardProps {
  drawPileCount: number;
  discardPileCount: number;
  onDrawClick?: () => void;
  canDraw: boolean;
}

export default function GameBoard({
  drawPileCount,
  discardPileCount,
  onDrawClick,
  canDraw,
}: GameBoardProps) {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10">
      {/* Draw pile */}
      <button
        onClick={canDraw ? onDrawClick : undefined}
        className={`
          relative flex flex-col items-center gap-1 group
          ${canDraw ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        <div className={`
          relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl
          bg-gradient-to-br from-blue-800 to-blue-950
          border-2 ${canDraw ? 'border-yellow-400/60 hover:border-yellow-400' : 'border-white/20'}
          shadow-lg ${canDraw ? 'hover:shadow-yellow-400/30 hover:shadow-xl hover:-translate-y-1' : ''}
          transition-all duration-200
          flex items-center justify-center
        `}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl">🃏</div>
            <div className="text-[8px] text-blue-300/40 font-bold tracking-wider">DRAW</div>
          </div>
          {/* Stack effect */}
          <div className="absolute -bottom-1 -right-1 w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-blue-900/50 -z-10 border border-blue-700/30" />
          <div className="absolute -bottom-2 -right-2 w-16 h-22 sm:w-20 sm:h-28 rounded-xl bg-blue-900/30 -z-20 border border-blue-700/20" />
        </div>
        <span className="text-xs font-bold text-white/60">
          {drawPileCount} cards
        </span>
        {canDraw && (
          <span className="text-[10px] text-yellow-400 animate-pulse">
            Click to draw
          </span>
        )}
      </button>

      {/* Center divider */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-px h-12 bg-white/10" />
        <div className="text-white/20 text-xs font-bold tracking-widest">VS</div>
        <div className="w-px h-12 bg-white/10" />
      </div>

      {/* Discard pile */}
      <div className="flex flex-col items-center gap-1">
        <div className="
          relative w-16 h-22 sm:w-20 sm:h-28 rounded-xl
          bg-gradient-to-br from-gray-700/50 to-gray-900/50
          border-2 border-dashed border-white/15
          flex items-center justify-center
        ">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl opacity-30">🗑️</div>
            <div className="text-[8px] text-white/20 font-bold tracking-wider">DISCARD</div>
          </div>
        </div>
        <span className="text-xs font-bold text-white/40">
          {discardPileCount} cards
        </span>
      </div>
    </div>
  );
}
