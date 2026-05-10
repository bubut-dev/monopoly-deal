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
  onStartGame: (playerCount: number, playerNames?: string[]) => void;
  onBackToHome?: () => void;
  mode?: 'local' | 'online';
  isMyTurn?: boolean;
  myPlayerIndex?: number;
  roomCode?: string;
}

export default function Game({
  state,
  onDrawCards,
  onPlayCard,
  onEndTurn,
  onStartGame,
  onBackToHome,
  mode = 'local',
  isMyTurn = true,
  myPlayerIndex = 0,
  roomCode,
}: GameProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [wildcardDialog, setWildcardDialog] = useState<{ cardId: string; open: boolean }>({
    cardId: '',
    open: false,
  });

  // Setup screen
  if (state.turnPhase === 'setup') {
    return (
      <div>
        {onBackToHome && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/60 border border-white/10 transition-all text-sm"
            >
              ← Back
            </button>
          </div>
        )}
        <GameSetup onStart={(count) => onStartGame(count)} mode={mode} />
      </div>
    );
  }

  // Game over screen
  if (state.turnPhase === 'gameover' && state.winner !== null) {
    const winner = state.players[state.winner];
    return (
      <div>
        {onBackToHome && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/60 border border-white/10 transition-all text-sm"
            >
              ← Back
            </button>
          </div>
        )}
        <GameOver
          winnerName={winner.name}
          onPlayAgain={() => onStartGame(state.players.length)}
          turnCount={state.turnCount}
        />
      </div>
    );
  }

  // Determine the "viewing player" index
  const viewingPlayerIndex = mode === 'online' ? myPlayerIndex : state.currentPlayerIndex;
  const viewingPlayer = state.players[viewingPlayerIndex];
  const currentPlayer = state.players[state.currentPlayerIndex];

  const isDrawPhase = state.turnPhase === 'draw';
  const isPlayPhase = state.turnPhase === 'play';
  const canAct = mode === 'online' ? (isMyTurn && (isDrawPhase || isPlayPhase)) : true;
  const canPlayCards = isPlayPhase && state.cardsPlayedThisTurn < 3 && canAct;
  const handOverLimit = viewingPlayer.hand.length > 7;
  const mustDiscard = handOverLimit && isPlayPhase;

  function handleCardClick(cardInstanceId: string) {
    if (!canPlayCards && !mustDiscard) return;

    const card = viewingPlayer.hand.find((c) => c.instanceId === cardInstanceId);
    if (!card) return;

    if (mustDiscard) {
      return;
    }

    if (!canPlayCards) return;

    onPlayCard(cardInstanceId);
    setSelectedCardId(null);
  }

  // Get opponents (players other than the viewing player)
  const opponents = state.players.filter(
    (p) => p.id !== viewingPlayerIndex
  );

  // Layout based on opponent count
  const topOpponents = opponents.slice(0, Math.ceil(opponents.length / 2));
  const sideOpponents = opponents.slice(Math.ceil(opponents.length / 2));

  // In online mode, determine who can see whose hand
  const isMyTurnIndicator = mode === 'online' ? isMyTurn : true;

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden relative">
      {/* Top bar */}
      <div className="absolute top-2 left-2 z-50 flex items-center gap-2">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/60 border border-white/10 transition-all text-xs"
          >
            ← Leave
          </button>
        )}
        {mode === 'online' && roomCode && (
          <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white/40 text-xs font-mono border border-white/5">
            Room: {roomCode}
          </div>
        )}
      </div>

      {/* Online turn indicator */}
      {mode === 'online' && (
        <div className="absolute top-2 right-2 z-50">
          <div className={`
            px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm border
            ${isMyTurn
              ? 'bg-green-500/20 text-green-300 border-green-500/30 animate-pulse'
              : 'bg-white/5 text-white/40 border-white/5'
            }
          `}>
            {isMyTurn ? '🎯 Your Turn!' : `⏳ ${currentPlayer?.name}'s turn`}
          </div>
        </div>
      )}

      {/* Top opponents */}
      <div className={`flex-shrink-0 ${topOpponents.length > 0 ? 'p-2 pt-8' : 'pt-8'}`}>
        <div className="flex gap-2 justify-center flex-wrap">
          {topOpponents.map((opp) => (
            <div key={opp.id} className="flex-1 max-w-sm min-w-[200px]">
              <PlayerArea
                player={opp}
                isCurrentPlayer={opp.id === state.currentPlayerIndex}
                showDetails
              />
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
            if (isDrawPhase && canAct) onDrawCards(2);
          }}
          canDraw={isDrawPhase && canAct}
        />
      </div>

      {/* Side opponents (if 4 players) */}
      {sideOpponents.length > 0 && (
        <div className="flex-shrink-0 px-2">
          <div className="flex gap-2 justify-center flex-wrap">
            {sideOpponents.map((opp) => (
              <div key={opp.id} className="flex-1 max-w-sm min-w-[200px]">
                <PlayerArea
                  player={opp}
                  isCurrentPlayer={opp.id === state.currentPlayerIndex}
                  showDetails
                />
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

      {/* Current viewing player area */}
      <div className={`flex-shrink-0 border-t backdrop-blur-sm
        ${mode === 'online' && isMyTurn
          ? 'border-yellow-400/30 bg-black/30'
          : 'border-white/10 bg-black/30'
        }
      `}>
        {/* Viewing player info */}
        <PlayerArea
          player={viewingPlayer}
          isCurrentPlayer={viewingPlayerIndex === state.currentPlayerIndex}
          showDetails
        />

        {/* Message bar */}
        <div className="px-4 py-1.5 text-center">
          <p className="text-sm text-white/70">{state.message}</p>
        </div>

        {/* Turn controls */}
        <div className="flex items-center justify-center gap-3 px-4 py-1.5">
          {isDrawPhase && canAct && (
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

          {!canAct && mode === 'online' && (
            <span className="text-xs text-white/30 animate-pulse">
              Waiting for {currentPlayer?.name}...
            </span>
          )}

          {isPlayPhase && canAct && (
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

        {/* Viewing player hand */}
        <div className="pb-3 pt-1 px-2">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1 text-center">
            {mode === 'online' ? 'Your Hand' : `${viewingPlayer.name}'s Hand`} ({viewingPlayer.hand.length} cards)
          </div>
          <PlayerHand
            cards={viewingPlayer.hand}
            isCurrentPlayer={canAct}
            onCardClick={handleCardClick}
            selectedCardId={selectedCardId}
            canPlay={canPlayCards}
          />
        </div>
      </div>
    </div>
  );
}
