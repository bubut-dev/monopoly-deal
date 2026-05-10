'use client';

import React from 'react';
import { PlayerState, COLOR_INFO, PropertyColor, COLOR_ORDER } from '../lib/types';
import { calculateBankValue, getPropertySets, isSetComplete, getSetSize } from '../lib/deck';
import { useTheme } from '../lib/themes/ThemeContext';
import { getThemedColorLabel } from '../lib/themes';
import CardComponent from './Card';

interface PlayerAreaProps {
  player: PlayerState;
  isCurrentPlayer: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

export default function PlayerArea({
  player,
  isCurrentPlayer,
  showDetails = false,
  compact = false,
}: PlayerAreaProps) {
  const bankValue = calculateBankValue(player.bank);
  const propSets = getPropertySets(player.properties);
  const { theme } = useTheme();

  // Count complete sets
  let completeSets = 0;
  propSets.forEach((cards, color) => {
    if (isSetComplete(color, cards)) completeSets++;
  });

  return (
    <div className={`
      rounded-xl border transition-all duration-300
      ${isCurrentPlayer
        ? 'border-yellow-400/50 bg-black/30 shadow-lg shadow-yellow-400/10'
        : 'border-white/10 bg-black/20'
      }
      ${compact ? 'p-2' : 'p-3'}
    `}>
      {/* Player header */}
      <div className={`flex items-center justify-between mb-${compact ? '1' : '2'}`}>
        <div className="flex items-center gap-2">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${isCurrentPlayer ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white/60'}
          `}>
            {player.id + 1}
          </div>
          <span className={`font-semibold ${isCurrentPlayer ? 'text-yellow-300' : 'text-white/70'} ${compact ? 'text-xs' : 'text-sm'}`}>
            {player.name}
          </span>
          {isCurrentPlayer && (
            <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded-full">
              TURN
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Bank value */}
          <div className="flex items-center gap-1">
            <span className="text-emerald-400">💰</span>
            <span className={`font-bold text-emerald-300 ${compact ? 'text-xs' : 'text-sm'}`}>
              ${bankValue}M
            </span>
          </div>

          {/* Sets counter */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className={`font-bold text-yellow-300 ${compact ? 'text-xs' : 'text-sm'}`}>
              {completeSets}/3
            </span>
          </div>
        </div>
      </div>

      {/* Bank cards */}
      {player.bank.length > 0 && showDetails && (
        <div className="mb-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Bank</div>
          <div className="flex gap-0.5 flex-wrap">
            {player.bank.map((card) => (
              <div
                key={card.instanceId}
                className={`
                  rounded border border-emerald-500/30 bg-emerald-900/50 px-1.5 py-0.5
                  ${compact ? 'text-[9px]' : 'text-[10px]'}
                  text-emerald-300 font-bold
                `}
              >
                ${card.value}M
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Property sets */}
      {showDetails && propSets.size > 0 && (
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Properties</div>
          <div className="flex flex-wrap gap-1">
            {COLOR_ORDER.map((color) => {
              const cards = propSets.get(color);
              if (!cards || cards.length === 0) return null;
              const complete = isSetComplete(color, cards);
              const info = COLOR_INFO[color];
              const themedLabel = getThemedColorLabel(color, theme);

              return (
                <div
                  key={color}
                  className={`
                    rounded-lg border p-1 flex flex-col items-center gap-0.5
                    ${complete
                      ? 'border-yellow-400/60 bg-yellow-400/10 shadow-sm shadow-yellow-400/20'
                      : 'border-white/10 bg-white/5'
                    }
                  `}
                >
                  <div className="text-[8px] text-white/50 font-medium">
                    {themedLabel} ({cards.length}/{getSetSize(color)})
                  </div>
                  <div className="flex gap-0.5">
                    {cards.map((card) => (
                      <CardComponent
                        key={card.instanceId}
                        card={card}
                        small
                        highlight={complete}
                      />
                    ))}
                  </div>
                  {complete && (
                    <div className="text-[8px] text-yellow-400 font-bold">✓ COMPLETE</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buildings */}
      {showDetails && (player.buildings.house > 0 || player.buildings.hotel > 0) && (
        <div className="mt-1 flex gap-2">
          {player.buildings.house > 0 && (
            <span className="text-[10px] text-white/50">🏘️ ×{player.buildings.house}</span>
          )}
          {player.buildings.hotel > 0 && (
            <span className="text-[10px] text-white/50">🏨 ×{player.buildings.hotel}</span>
          )}
        </div>
      )}
    </div>
  );
}
