'use client';

import React from 'react';
import { Card as CardType, COLOR_INFO, PropertyColor } from '../lib/types';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  onClick?: () => void;
  selected?: boolean;
  small?: boolean;
  highlight?: boolean;
}

function getCardStyle(card: CardType): string {
  switch (card.category) {
    case 'money':
      return 'from-emerald-600 to-emerald-800 border-emerald-400';
    case 'property': {
      const color = card.colors[0];
      if (!color) return 'from-gray-500 to-gray-700 border-gray-300';
      if (color === 'multicolor')
        return 'from-pink-500 via-yellow-400 to-green-500 border-white';
      const info = COLOR_INFO[color];
      // Map to gradient
      const gradients: Record<string, string> = {
        brown: 'from-amber-800 to-amber-950 border-amber-600',
        lightblue: 'from-sky-400 to-sky-600 border-sky-300',
        pink: 'from-pink-400 to-pink-600 border-pink-300',
        orange: 'from-orange-500 to-orange-700 border-orange-400',
        red: 'from-red-500 to-red-700 border-red-400',
        yellow: 'from-yellow-400 to-yellow-600 border-yellow-300',
        green: 'from-green-500 to-green-700 border-green-400',
        darkblue: 'from-blue-700 to-blue-900 border-blue-500',
        railroad: 'from-gray-600 to-gray-800 border-gray-400',
        utility: 'from-slate-500 to-slate-700 border-slate-300',
      };
      return gradients[color] || 'from-gray-500 to-gray-700 border-gray-300';
    }
    case 'rent':
      return 'from-violet-600 to-violet-800 border-violet-400';
    case 'action':
      return 'from-rose-500 to-rose-700 border-rose-300';
    default:
      return 'from-gray-500 to-gray-700 border-gray-300';
  }
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'money': return '💰';
    case 'property': return '🏠';
    case 'rent': return '收取';
    case 'action': return '⚡';
    default: return '🃏';
  }
}

function getCategoryBadge(category: string): string {
  switch (category) {
    case 'money': return 'bg-emerald-500/30 text-emerald-200';
    case 'property': return 'bg-amber-500/30 text-amber-200';
    case 'rent': return 'bg-violet-500/30 text-violet-200';
    case 'action': return 'bg-rose-500/30 text-rose-200';
    default: return 'bg-gray-500/30 text-gray-200';
  }
}

export default function Card({
  card,
  faceDown = false,
  onClick,
  selected = false,
  small = false,
  highlight = false,
}: CardProps) {
  if (faceDown) {
    return (
      <div
        className={`
          relative rounded-lg border-2 border-white/20 bg-gradient-to-br from-blue-900 to-blue-950
          flex items-center justify-center shadow-lg
          ${small ? 'w-12 h-16' : 'w-20 h-28 sm:w-24 sm:h-34'}
          transition-transform hover:scale-105
        `}
      >
        <div className="text-center">
          <div className={`${small ? 'text-lg' : 'text-2xl'}`}>🃏</div>
          {!small && <div className="text-[8px] text-blue-300/50 mt-1">MONOPOLY</div>}
        </div>
      </div>
    );
  }

  const gradient = getCardStyle(card);

  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-lg border-2 bg-gradient-to-br ${gradient}
        flex flex-col items-center justify-between p-1
        shadow-lg transition-all duration-200
        ${small ? 'w-12 h-16 min-w-[3rem]' : 'w-20 h-28 min-w-[5rem] sm:w-24 sm:h-34 sm:min-w-[6rem]'}
        ${onClick ? 'cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-xl' : 'cursor-default'}
        ${selected ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent -translate-y-2 shadow-yellow-400/30 shadow-lg' : ''}
        ${highlight ? 'ring-2 ring-white/60 animate-pulse-glow' : ''}
        animate-deal-in
      `}
    >
      {/* Category badge */}
      <div className={`absolute top-0.5 right-0.5 px-1 rounded text-[6px] font-bold uppercase tracking-wider ${getCategoryBadge(card.category)}`}>
        {card.category}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-0.5">
        {/* Card name / label */}
        <div className={`${small ? 'text-[7px]' : 'text-[10px] sm:text-xs'} font-bold text-white leading-tight whitespace-pre-line drop-shadow-md`}>
          {card.label || card.name}
        </div>

        {/* Value display */}
        {card.value > 0 && (
          <div className={`${small ? 'text-sm' : 'text-lg sm:text-xl'} font-black text-white drop-shadow-lg`}>
            ${card.value}M
          </div>
        )}

        {/* Action icon */}
        {card.category === 'action' && !card.value && (
          <div className={`${small ? 'text-sm' : 'text-xl'} drop-shadow-lg`}>
            {card.actionType === 'dealbreaker' && '💥'}
            {card.actionType === 'passgo' && '🚶'}
            {card.actionType === 'forceddeal' && '🔄'}
            {card.actionType === 'slydeal' && '🤏'}
            {card.actionType === 'debtcollector' && '🏦'}
            {card.actionType === 'itsmybirthday' && '🎂'}
            {card.actionType === 'doubletherent' && '✖️'}
            {card.actionType === 'house' && '🏘️'}
            {card.actionType === 'hotel' && '🏨'}
            {card.actionType === 'justsayno' && '🛑'}
          </div>
        )}

        {/* Rent icon */}
        {card.category === 'rent' && (
          <div className={`${small ? 'text-sm' : 'text-xl'} drop-shadow-lg`}>
            💸
          </div>
        )}

        {/* Property icon for standard properties */}
        {card.category === 'property' && card.colors.length === 1 && card.colors[0] !== 'multicolor' && (
          <div className={`${small ? 'text-sm' : 'text-xl'} drop-shadow-lg`}>
            {card.colors[0] === 'railroad' ? '🚂' : card.colors[0] === 'utility' ? '⚡' : '🏠'}
          </div>
        )}

        {/* Wildcard indicator */}
        {card.category === 'property' && (card.colors.length > 1) && (
          <div className={`${small ? 'text-[6px]' : 'text-[8px] sm:text-[10px]'} text-white/80 leading-tight`}>
            {card.colors.length > 2 ? 'ANY' : card.colors.map(c => COLOR_INFO[c]?.label || c).join('/')}
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className={`w-full h-0.5 rounded-full bg-white/20 mt-0.5`} />
    </button>
  );
}
