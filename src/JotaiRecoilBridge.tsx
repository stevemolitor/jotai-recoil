import {
  atom as jotaiAtom,
  createStore,
  Provider,
  useAtomValue as useJotaiAtomValue,
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
  const jCount = useJotaiAtomValue(jotaiCount);

  // two renders here because of using recoil & jotai, but just one if we just use the recoil atom
  console.log("render Count");

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
