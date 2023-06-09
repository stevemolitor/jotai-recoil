import "./styles.css";

import { TicTacToe as JotaiTicTacToe } from "./jotai/TicTacToe";
import { TicTacToe as RecoilTicTacToe } from "./recoil/TicTacToe";
import { getGame } from "./tictacdb";

const App = () => {
  const game = getGame(); // pseudo SSR prop from e.g. getServerSideProps

  return (
    <div className="App">
      <JotaiTicTacToe game={game} />
      <RecoilTicTacToe />
    </div>
  );
};

export default App;
