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
  selectorFamily as recoilSelectorFamily,
} from "recoil";

const jotaiStore = createStore();

const jotaiCount = jotaiAtom(0);

let familyParam = 0;

const recoilCountFamily = recoilSelectorFamily<number, number>({
  key: "recoilFamily",
  get: (_param) => () => jotaiStore.get(jotaiCount),
  set: (_param) => (_, newCount) => {
    jotaiStore.set(jotaiCount, newCount as number);
  },
});

const recoilCount = recoilSelector<number>({
  key: "recoilProxy",
  get: ({ get }) => get(recoilCountFamily(familyParam++)),
  set: ({ set }, newCount) => {
    set(recoilCountFamily(familyParam), newCount);
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
