import { RecoilRoot, atom as recoilAtom, useRecoilState } from "recoil";
import { useAtom } from "jotai/react";
import { useSyncRecoilSnapshot, atomWithRecoilValue } from "./jotaiRecoil";

const countState = recoilAtom({
  key: "count",
  default: 0,
});

const countAtom = atomWithRecoilValue(countState);

const Sync = () => {
  useSyncRecoilSnapshot();
  return null;
};

const RecoilCounter = () => {
  const [count, setCount] = useRecoilState(countState);
  return (
    <div>
      <h1>Recoil Counter</h1>
      Count: {count}{" "}
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  );
};

const JotaiCounter = () => {
  const [count, setCount] = useAtom(countAtom);
  return (
    <div>
      <h1>Jotai Counter</h1>
      Count: {count}{" "}
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

const App = () => (
  <RecoilRoot>
    <Sync />
    <RecoilCounter />
    <JotaiCounter />
  </RecoilRoot>
);

export default App;
