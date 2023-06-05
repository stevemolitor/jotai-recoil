import { useCallback } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { GameHeader } from "../GameHeader";
import { getGameStateLabel } from "../tictactoe";
import {
  canRedoState,
  canResetState,
  canUndoState,
  gameStateState,
  isDisabledState,
  squareState,
  useMove,
  useRedo,
  useResetGame,
  useUndo,
} from "./state";

const Square = ({ index }: { index: number }) => {
  const value = useRecoilValue(squareState(index));
  const isDisabled = useRecoilValue(isDisabledState(index));
  const move = useMove(index);

  const onClick = useCallback(() => {
    move();
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

const GameStateLabel = () => {
  const gameState = useRecoilValue(gameStateState);
  const gameStateLabel = getGameStateLabel(gameState);

  return <div className={`game-state ${gameState}`}>{gameStateLabel}</div>;
};

const UndoButton = () => {
  const canUndo = useRecoilValue(canUndoState);
  const undo = useUndo();

  return (
    <button className="button" disabled={!canUndo} onClick={undo}>
      Undo
    </button>
  );
};

const RedoButton = () => {
  const canRedo = useRecoilValue(canRedoState);
  const redo = useRedo();

  return (
    <button className="button" disabled={!canRedo} onClick={redo}>
      Redo
    </button>
  );
};

const ResetButton = () => {
  const canReset = useRecoilValue(canResetState);
  const resetGame = useResetGame();

  return (
    <button className="button" disabled={!canReset} onClick={resetGame}>
      Reset
    </button>
  );
};

export const TicTacToe = () => (
  <RecoilRoot>
    <div className="game">
      <GameHeader imgSrc="https://bestofjs.org/logos/recoil.svg">
        Recoil Tic Tac Toe
      </GameHeader>
      <Board />
      <GameStateLabel />
      <div className="buttons">
        <UndoButton />
        <RedoButton />
        <ResetButton />
      </div>
    </div>
  </RecoilRoot>
);
