import { atom as jotaiAtom, Provider, useAtom as useJotaiAtom } from "jotai";
import { ReactNode, useCallback } from "react";
import {
  atom as recoilAtom,
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

const recoilCount = recoilAtom<number>({
  key: "recoilCount",
  default: 0,
});

const forceJotaiEval = jotaiAtom(0);

const jotaiCount = jotaiAtom(
  (get) => {
    console.log("get jotai");
    get(forceJotaiEval);
    return recoilStore.get(recoilCount);
  },
  (_get, set, newCount: number) => {
    recoilStore.set(recoilCount, newCount);
    set(forceJotaiEval, (val) => val + 1);
  }
);

const Count = () => {
  const [rCount, setRCount] = useRecoilState(recoilCount);
  const [jCount, setJCount] = useJotaiAtom(jotaiCount);

  const incrementRecoil = useCallback(() => {
    setRCount((count) => count + 1);
  }, [rCount, setRCount]);

  const incrementJotai = useCallback(() => {
    console.log("incrementJotai");
    setJCount(jCount + 1);
  }, [jCount, setJCount]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>Recoil Count: {rCount}</div>
      <div>Jotai Count: {jCount}</div>
      <button onClick={incrementRecoil}>
        increment recoil count state directly
      </button>
      <button onClick={incrementJotai}>
        increment count via jotai to recoil proxy
      </button>
    </div>
  );
};

export const JotaiRecoilBridge = () => {
  return (
    <Provider>
      <RecoilRoot>
        <RecoilStoreProvider>
          <Count />
        </RecoilStoreProvider>
      </RecoilRoot>
    </Provider>
  );
};
