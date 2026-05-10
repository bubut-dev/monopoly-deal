'use client';

import Game from '../components/Game';
import { useGame } from '../hooks/useGame';

export default function Home() {
  const {
    state,
    startGame,
    drawCards,
    playCard,
    endTurn,
    discardCards,
    cancelAction,
  } = useGame();

  return (
    <main className="h-screen w-screen overflow-hidden">
      <Game
        state={state}
        onDrawCards={drawCards}
        onPlayCard={playCard}
        onEndTurn={endTurn}
        onStartGame={startGame}
      />
    </main>
  );
}
