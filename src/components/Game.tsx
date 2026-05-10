'use client';

import React, { useState } from 'react';
import { GameState, Card as CardType, PropertyColor } from '../lib/types';
import { getPropertySets, isSetComplete, getSetSize, calculateBankValue } from '../lib/deck';
import PlayerHand from './PlayerHand';
import PlayerArea from './PlayerArea';
import GameBoard from './GameBoard';
import GameSetup from './GameSetup';
import GameOver from './GameOver';

interface GameProps {
  state: GameState;
  onDrawCards: (count: number) => void;
  onPlayCard: (cardInstanceId: string, options?: {
    targetPlayerId?: number;
    targetPropertyColor?: PropertyColor;
    targetCardInstanceId?: string;
    ownCardInstanceId?: string;
    chosenColor?: PropertyColor;
  }) => void;
  onEndTurn: () => void;
  onStartGame: (playerCount: number) => void;
}

export default function Game({
  state,
  onDrawCards,
  onPlayCard,
  onEndTurn,
  onStartGame,
}: GameProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [wildcardDialog, setWildcardDialog] = useState<{ cardId: string; open: boolean }>({
    cardId: '',
    open: false,
  });

  // Setup screen
  if (state.turnPhase === 'setup') {
    return <GameSetup onStart={onStartGame} />;
  }

  // Game over screen
  if (state.turnPhase === 'gameover' && state.winner !== null) {
    const winner = state.players[state.winner];
    return (
      <GameOver
        winnerName={winner.name}
        onPlayAgain={() => onStartGame(state.players.length)}
        turnCount={state.turnCount}
      />
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isDrawPhase = state.turnPhase === 'draw';
  const isPlayPhase = state.turnPhase === 'play';
  const canPlay = isPlayPhase && state.cardsPlayedThisTurn < 3;
  const handOverLimit = currentPlayer.hand.length > 7;
  const mustDiscard = handOverLimit && isPlayPhase;

  function handleCardClick(cardInstanceId: string) {
    if (!canPlay && !mustDiscard) return;

    const card = currentPlayer.hand.find((c) => c.instanceId === cardInstanceId);
    if (!card) return;

    // If hand is over 7 and card has no value, discard it
    if (mustDiscard) {
      // For simplicity, clicking a card when over limit discards it
      // In a full implementation we'd have a discard mode
      return;
    }

    if (!canPlay) return;

    // Check if this is a wildcard that needs color selection
    if (
      card.category === 'property' &&
      card.colors.length > 1 &&
      !card.colors.includes('multicolor') === false
    ) {
      // For V1, auto-pick first color
    }

    onPlayCard(cardInstanceId);
    setSelectedCardId(null);
  }

  // Get opponents (players other than current)
  const opponents = state.players.filter(
    (p) => p.id !== state.currentPlayerIndex
  );

  // Layout based on player count
  const topOpponents = opponents.slice(0, Math.ceil(opponents.length / 2));
  const sideOpponents = opponents.slice(Math.ceil(opponents.length / 2));

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Top opponents */}
      <div className={`flex-shrink-0 ${topOpponents.length > 0 ? 'p-2' : ''}`}>
        <div className="flex gap-2 justify-center flex-wrap">
          {topOpponents.map((opp) => (
            <div key={opp.id} className="flex-1 max-w-sm min-w-[200px]">
              <PlayerArea player={opp} isCurrentPlayer={false} showDetails />
            </div>
          ))}
        </div>
        {/* Opponent hands */}
        {topOpponents.length > 0 && (
          <div className="flex justify-center gap-4 mt-2">
            {topOpponents.map((opp) => (
              <div key={opp.id} className="flex items-center gap-1">
                <span className="text-[10px] text-white/30 mr-1">{opp.name}</span>
                {opp.hand.map((card) => (
                  <div
                    key={card.instanceId}
                    className="w-6 h-8 rounded bg-blue-900/80 border border-white/10 -ml-3 first:ml-0"
                  />
                ))}
                <span className="text-[10px] text-white/30 ml-1">({opp.hand.length})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center game board */}
      <div className="flex-1 flex items-center justify-center py-2 min-h-[120px]">
        <GameBoard
          drawPileCount={state.drawPile.length}
          discardPileCount={state.discardPile.length}
          onDrawClick={() => {
            if (isDrawPhase) onDrawCards(2);
          }}
          canDraw={isDrawPhase}
        />
      </div>

      {/* Side opponents (if 4 players) */}
      {sideOpponents.length > 0 && (
        <div className="flex-shrink-0 px-2">
          <div className="flex gap-2 justify-center flex-wrap">
            {sideOpponents.map((opp) => (
              <div key={opp.id} className="flex-1 max-w-sm min-w-[200px]">
                <PlayerArea player={opp} isCurrentPlayer={false} showDetails />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {sideOpponents.map((opp) => (
              <div key={opp.id} className="flex items-center gap-1">
                <span className="text-[10px] text-white/30 mr-1">{opp.name}</span>
                {opp.hand.map((card) => (
                  <div
                    key={card.instanceId}
                    className="w-6 h-8 rounded bg-blue-900/80 border border-white/10 -ml-3 first:ml-0"
                  />
                ))}
                <span className="text-[10px] text-white/30 ml-1">({opp.hand.length})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current player area */}
      <div className="flex-shrink-0 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        {/* Current player info */}
        <PlayerArea
          player={currentPlayer}
          isCurrentPlayer={true}
          showDetails
        />

        {/* Message bar */}
        <div className="px-4 py-1.5 text-center">
          <p className="text-sm text-white/70">{state.message}</p>
        </div>

        {/* Turn controls */}
        <div className="flex items-center justify-center gap-3 px-4 py-1.5">
          {isDrawPhase && (
            <button
              onClick={() => onDrawCards(2)}
              className="px-4 py-1.5 rounded-lg font-semibold text-sm
                bg-blue-500/80 text-white hover:bg-blue-500
                transition-all duration-150 hover:scale-105 active:scale-95
                shadow-md shadow-blue-500/20"
            >
              📥 Draw 2 Cards
            </button>
          )}

          {isPlayPhase && (
            <>
              <span className="text-xs text-white/40">
                Plays: {state.cardsPlayedThisTurn}/3
              </span>

              {mustDiscard && (
                <span className="text-xs text-red-400 animate-pulse">
                  ⚠️ Hand over 7! End turn to auto-discard.
                </span>
              )}

              <button
                onClick={onEndTurn}
                className="px-4 py-1.5 rounded-lg font-semibold text-sm
                  bg-white/10 text-white/70 hover:bg-white/20 hover:text-white
                  transition-all duration-150 hover:scale-105 active:scale-95
                  border border-white/10"
              >
                End Turn →
              </button>
            </>
          )}
        </div>

        {/* Current player hand */}
        <div className="pb-3 pt-1 px-2">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1 text-center">
            Your Hand ({currentPlayer.hand.length} cards)
          </div>
          <PlayerHand
            cards={currentPlayer.hand}
            isCurrentPlayer={true}
            onCardClick={handleCardClick}
            selectedCardId={selectedCardId}
            canPlay={canPlay}
          />
        </div>
      </div>
    </div>
  );
}
