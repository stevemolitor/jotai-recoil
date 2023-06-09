// Fake Tic Tac Toe DB.
// getGame is sync, to simulate getting initial props from SSR.
// saveGame is async, to simulate saving something in the background.

import { EMPTY_GAME, Game } from "./tictactoe";

const STORAGE_KEY = "jotai-tictactoe";

const wait = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getGame = (): Game => {
  const json = localStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : EMPTY_GAME;
};

export const saveGame = async (game: Game) => {
  await wait(500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
};
