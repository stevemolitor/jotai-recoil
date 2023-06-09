import { Provider, useAtomValue, useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useCallback } from "react";
import { GameHeader } from "../GameHeader";
import { getGameStateLabel, Game } from "../tictactoe";
import {
  canRedoAtom,
  canResetAtom,
  canUndoAtom,
  gameAtom,
  gameStateAtom,
  isDisabledFamily,
  moveAtom,
  redoAtom,
  resetGameAtom,
  squareFamily,
  undoAtom,
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

const UndoButton = () => {
  const canUndo = useAtomValue(canUndoAtom);
  const undo = useSetAtom(undoAtom);

  return (
    <button className="button" disabled={!canUndo} onClick={undo}>
      Undo
    </button>
  );
};

const RedoButton = () => {
  const canRedo = useAtomValue(canRedoAtom);
  const redo = useSetAtom(redoAtom);

  return (
    <button className="button" disabled={!canRedo} onClick={redo}>
      Redo
    </button>
  );
};

const ResetButton = () => {
  const canReset = useAtomValue(canResetAtom);
  const resetGame = useSetAtom(resetGameAtom);

  return (
    <button className="button" disabled={!canReset} onClick={resetGame}>
      Reset
    </button>
  );
};

interface GameProps {
  game: Game;
}

const GameContainer = ({ game }: GameProps) => {
  useHydrateAtoms([[gameAtom, game]]);

  return (
    <>
      <Board />
      <GameState />
      <div className="buttons">
        <UndoButton />
        <RedoButton />
        <ResetButton />
      </div>
    </>
  );
};

export const TicTacToe = ({ game }: GameProps) => (
  <Provider>
    <div className="game">
      <GameHeader imgSrc="https://storage.googleapis.com/candycode/jotai/jotai-mascot.png">
        Jotai Tic Tac Toe
      </GameHeader>
      <GameContainer game={game} />
    </div>
  </Provider>
);
