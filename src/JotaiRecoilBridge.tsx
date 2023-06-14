import {
  atom as jotaiAtom,
  createStore,
  Provider,
  useAtom as useJotaiAtom,
} from "jotai";
import { useCallback } from "react";
import { atom as recoilAtom, RecoilRoot, useRecoilState } from "recoil";

const jotaiStore = createStore();

const jotaiCount = jotaiAtom(0);

const recoilCount = recoilAtom<number>({
  key: "recoilProxy",
  effects: [
    ({ onSet, trigger, setSelf }) => {
      // initialize Recoil atom value with Jotai atom value
      if (trigger === "get") {
        setSelf(jotaiStore.get(jotaiCount));
      }

      // update Recoil atom when Jotai atom changes
      const unsub = jotaiStore.sub(jotaiCount, () => {
        setSelf(jotaiStore.get(jotaiCount));
      });

      // set Jotai atom when Recoil atom changes
      onSet((newValue) => {
        jotaiStore.set(jotaiCount, newValue);
      });

      // unsubcribe to Jotai store on cleanup
      return unsub;
    },
  ],
});

const Count = () => {
  const [rCount, setRCount] = useRecoilState(recoilCount);
  const [jCount, setJCount] = useJotaiAtom(jotaiCount);

  // Two renders here when incrementIng the recoil atom, because we're rendering both the
  // recoil and jotai atoms, but there would be just one render if we were just rendering
  // the recoil atom.  Only one render when you increment the jotai atom.
  //
  // When you increment the recoil atom it fires an atom effect that increments the
  // underlying jotai atom.
  console.log("render Count");

  const incrementRecoil = useCallback(() => {
    setRCount((count) => count + 1);
  }, [rCount, setRCount]);

  const incrementJotai = useCallback(() => {
    setJCount((count) => count + 1);
  }, [rCount, setRCount]);

  //  const incrementViaRecoilCallback = useIncrementViaRecoilCallback();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", columnGap: "10px" }}
    >
      <div>Recoil Count: {rCount}</div>
      <div>Jotai Count: {jCount}</div>
      <button onClick={incrementRecoil}>increment Recoil count</button>
      <button onClick={incrementJotai}>increment Jotai count</button>
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
