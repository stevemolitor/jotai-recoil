import { Provider, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { GameHeader } from "../GameHeader";
import { getGameStateLabel } from "../tictactoe";
import {
  gameStateAtom,
  isDisabledFamily,
  moveAtom,
  resetGameAtom,
  squareFamily,
} from "./atoms";

const Square = ({ index }: { index: number }) => {
  const value = useAtomValue(squareFamily(index));
  const isDisabled = useAtomValue(isDisabledFamily(index));
  const move = useSetAtom(moveAtom);

  const onClick = useCallback(() => {
    move(index);
  }, [index, move]);

  return (
    <button
      id={`square-${index}`}
      className="square"
      disabled={isDisabled}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

const Board = () => (
  <div className="board">
    {[...Array(9)].map((_, i) => (
      <Square key={i} index={i} />
    ))}
  </div>
);

const GameState = () => {
  const gameState = useAtomValue(gameStateAtom);
  const gameStateLabel = getGameStateLabel(gameState);

  return <div className={`game-state ${gameState}`}>{gameStateLabel}</div>;
};

const ResetButton = () => {
  const resetGame = useSetAtom(resetGameAtom);
  return <button onClick={resetGame}>Reset Game</button>;
};

export const TicTacToe = () => (
  <Provider>
    <div className="game">
      <GameHeader imgSrc="https://storage.googleapis.com/candycode/jotai/jotai-mascot.png">
        Jotai Tic Tac Toe
      </GameHeader>
      <Board />
      <GameState />
      <ResetButton />
    </div>
  </Provider>
);
