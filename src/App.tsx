import "./styles.css";

import { TicTacToe as JotaiTicTacToe } from "./jotai/TicTacToe";
import { TicTacToe as RecoilTicTacToe } from "./recoil/TicTacToe";

const App = () => {
  return (
    <div className="App">
      <JotaiTicTacToe />
      <RecoilTicTacToe />
    </div>
  );
};

export default App;
