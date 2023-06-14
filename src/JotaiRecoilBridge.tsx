import {
  atom as jotaiAtom,
  createStore,
  Provider,
  useAtomValue as useJotaiAtomValue,
} from "jotai";
import { ReactNode, useCallback } from "react";
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

const RecoilStoreProvider = ({ children }: { children: ReactNode }) => {
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

  return <>{children}</>;
};

const jotaiStore = createStore();

const jotaiCount = jotaiAtom(1);

const forceEval = recoilAtom({
  key: "forceEval",
  default: 0,
});

const recoilCount = recoilSelector<number>({
  key: "recoilProxy",
  get: ({ get }) => {
    get(forceEval);
    return jotaiStore.get(jotaiCount);
  },
  set: ({ set }, newCount) => {
    set(forceEval, (val) => val + 1);
    jotaiStore.set(jotaiCount, newCount as number);
  },
});

const Count = () => {
  const [rCount, setRCount] = useRecoilState(recoilCount);
  const jCount = useJotaiAtomValue(jotaiCount);

  const incrementJotai = useCallback(() => {
    setRCount((count) => count + 1);
  }, [rCount, setRCount]);

  return (
    <div>
      <div>Recoil Count: {rCount}</div>
      <div>Jotai Count: {jCount}</div>
      <button onClick={incrementJotai}>
        increment count via recoil to jotai proxy
      </button>
    </div>
  );
};

export const JotaiRecoilBridge = () => {
  return (
    <Provider store={jotaiStore}>
      <RecoilRoot>
        <RecoilStoreProvider>
          <Count />
        </RecoilStoreProvider>
      </RecoilRoot>
    </Provider>
  );
};
