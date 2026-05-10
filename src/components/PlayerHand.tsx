'use client';

import React from 'react';
import { Card as CardType } from '../lib/types';
import CardComponent from './Card';

interface PlayerHandProps {
  cards: CardType[];
  isCurrentPlayer: boolean;
  onCardClick?: (cardInstanceId: string) => void;
  selectedCardId?: string | null;
  canPlay: boolean;
}

export default function PlayerHand({
  cards,
  isCurrentPlayer,
  onCardClick,
  selectedCardId,
  canPlay,
}: PlayerHandProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center text-white/40 text-sm py-2">
        {isCurrentPlayer ? 'No cards in hand' : 'Empty hand'}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-1 px-1">
      {cards.map((card) => (
        <CardComponent
          key={card.instanceId}
          card={card}
          faceDown={!isCurrentPlayer}
          onClick={isCurrentPlayer && canPlay && onCardClick ? () => onCardClick(card.instanceId) : undefined}
          selected={selectedCardId === card.instanceId}
        />
      ))}
    </div>
  );
}
