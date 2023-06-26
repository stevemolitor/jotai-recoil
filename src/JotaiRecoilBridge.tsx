import {
  atom as jotaiAtom,
  createStore,
  Provider,
<<<<<<< HEAD
  useAtomValue,
  useAtomValue as useJotaiAtomValue,
} from "jotai";
import { useCallback } from "react";
import {
  atom as recoilAtom,
  RecoilRoot,
  useRecoilCallback,
  useRecoilState,
} from "recoil";

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
=======
  useAtom as useJotaiAtom,
} from "jotai";
import { useCallback } from "react";
import { atom as recoilAtom, RecoilRoot, useRecoilState } from "recoil";
>>>>>>> 8fec323f6465f8fbbae402392969c62a3fea66f2

const jotaiMagicSeed = jotaiAtom(1);

<<<<<<< HEAD
const useMakeMagicNumber = () =>
  useRecoilCallback(({ snapshot, set }) => async () => {
    const seed = jotaiStore.get(jotaiMagicSeed);

    const jCount1 = jotaiStore.get(jotaiCount);
    console.log("jCount1", jCount1);

    const count = await snapshot.getPromise(recoilCount);
    const newCount = count * 2;
    console.log("newCount (new magic seed)", newCount);

    set(recoilCount, newCount);
    jotaiStore.set(jotaiMagicSeed, newCount);

    const jCount2 = jotaiStore.get(jotaiCount);
    console.log("jCount2", jCount2);
  });

const Count = () => {
  const [rCount, setRCount] = useRecoilState(recoilCount);
  const jCount = useJotaiAtomValue(jotaiCount);
  const magicSeed = useAtomValue(jotaiMagicSeed);
  const makeMagicNumber = useMakeMagicNumber();

  // two renders here because of using recoil & jotai, but just one if we just use the recoil atom
  console.log("render Count");

  const increment = useCallback(() => {
    setRCount((count) => count + 1);
=======
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
>>>>>>> 8fec323f6465f8fbbae402392969c62a3fea66f2
  }, [rCount, setRCount]);

  //  const incrementViaRecoilCallback = useIncrementViaRecoilCallback();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", columnGap: "10px" }}
    >
      <div>Recoil Count: {rCount}</div>
      <div>Jotai Count: {jCount}</div>
<<<<<<< HEAD
      <div>Magic Seed: {magicSeed}</div>
      <button onClick={increment}>increment</button>
      <button onClick={makeMagicNumber}>make magic</button>
=======
      <button onClick={incrementRecoil}>increment Recoil count</button>
      <button onClick={incrementJotai}>increment Jotai count</button>
>>>>>>> 8fec323f6465f8fbbae402392969c62a3fea66f2
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
