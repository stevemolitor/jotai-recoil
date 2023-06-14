import {
  atom as jotaiAtom,
  createStore,
  Provider,
  useAtomValue as useJotaiAtomValue,
} from "jotai";
import { useCallback } from "react";
import {
  selector as recoilSelector,
  RecoilRoot,
  useRecoilState,
  DefaultValue,
} from "recoil";

const jotaiStore = createStore();

const jotaiCount = jotaiAtom(0);

const recoilCount = recoilSelector({
  key: "recoilProxy",
  get: () => jotaiStore.get(jotaiCount),
  set: (_, newCount) => {
    jotaiStore.set(jotaiCount, newCount instanceof DefaultValue ? 0 : newCount);
  },
});

const Count = () => {
  const [rCount, setRCount] = useRecoilState(recoilCount);
  const jCount = useJotaiAtomValue(jotaiCount);

  const increment = useCallback(() => {
    setRCount((count) => count + 1);
  }, [rCount, setRCount]);

  return (
    <div>
      <p>This version is too naive. The recoi</p>
      <div>Recoil Count: {rCount}</div>
      <div>Jotai Count: {jCount}</div>
      <button onClick={increment}>increment</button>
    </div>
  );
};

export const JotaiRecoilBridge = () => {
  return (
    <Provider store={jotaiStore}>
      <RecoilRoot>
        <Count />
      </RecoilRoot>
    </Provider>
  );
};
