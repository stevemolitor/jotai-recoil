import { useCallback } from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { GameHeader } from "../GameHeader";
import { getGameStateLabel } from "../tictactoe";
import {
  gameStateState,
  isDisabledState,
  squareState,
  useMove,
  useResetGame,
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

const ResetButton = () => {
  const resetGame = useResetGame();
  return (
    <button className="button" onClick={resetGame}>
      Reset Game
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
      <ResetButton />
    </div>
  </RecoilRoot>
);
