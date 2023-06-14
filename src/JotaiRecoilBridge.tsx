import {
  atom as jotaiAtom,
  createStore,
  Provider,
  useAtomValue as useJotaiAtomValue,
} from "jotai";
import { ReactNode, useCallback, useEffect } from "react";
import {
  atom as recoilAtom,
  selector as recoilSelector,
  RecoilRoot,
  useRecoilState,
  useRecoilCallback,
  RecoilValue,
  RecoilState,
} from "recoil";

type RecoilGet = <T>(state: RecoilValue<T>) => T;

type RecoilUpdater<T> = T | ((val: T) => T);

type RecoilSet = <T>(
  state: RecoilState<T>,
  valOrUpdater: RecoilUpdater<T>
) => void;

interface RecoilStore {
  get: RecoilGet;
  set: RecoilSet;
}

let recoilStore: RecoilStore = {
  get: () => {
    throw new Error("recoilStore not initialized");
  },
  set: () => {
    throw new Error("recoilStore not initialized");
  },
};

const RecoilStoreProvider = () => {
  const get = useRecoilCallback(
    ({ snapshot }) =>
      <T,>(state: RecoilValue<T>) =>
        snapshot.getLoadable(state).contents,
    []
  );

  const set = useRecoilCallback(
    ({ set }) =>
      <T,>(state: RecoilState<T>, valOrUpdater: RecoilUpdater<T>) => {
        set(state, valOrUpdater);
      }
  );

  recoilStore = { get, set };

  return null;
};

const jotaiStore = createStore();

const jotaiCount = jotaiAtom(0);

const alwaysChanging = recoilAtom({
  key: "alwaysChanging",
  default: 0,
});

const recoilCount = recoilSelector<number>({
  key: "recoilProxy",
  get: ({ get }) => {
    const n = get(alwaysChanging);
    recoilStore.set(alwaysChanging, n + 1);
    return jotaiStore.get(jotaiCount);
  },
  set: (_, newCount) => {
    jotaiStore.set(jotaiCount, newCount as number);
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
        <RecoilStoreProvider />
        <Count />
      </RecoilRoot>
    </Provider>
  );
};
