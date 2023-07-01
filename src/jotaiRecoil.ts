import { useSetAtom } from "jotai/react";
import { useHydrateAtoms } from "jotai/react/utils";
import { atom } from "jotai/vanilla";
import { selectAtom } from "jotai/vanilla/utils";
import { RefObject, useEffect, useRef } from "react";
import { RecoilState, useRecoilCallback, useRecoilSnapshot } from "recoil";
import type { RecoilValue, Snapshot } from "recoil";

type SetRecoilState = <T>(
  recoilVal: RecoilState<T>,
  valOrUpdater: ((currVal: T) => T) | T
) => void;

const recoilSnapshotAtom = atom<Snapshot | null>(null);
const setRecoilStateAtom = atom<RefObject<SetRecoilState> | null>(null);

// TODO rename this hook, as it also grabs a recoil setter now
export const useSyncRecoilSnapshot = () => {
  const setRecoilSnapshot = useSetAtom(recoilSnapshotAtom);
  const snapshot = useRecoilSnapshot();

  let setRecoilState = null;

  useRecoilCallback(({ set }) => {
    setRecoilState = set;
    return () => {}; // noop, not used
  }, [])();

  const setRecoilStateRef = useRef<SetRecoilState>(setRecoilState);

  useHydrateAtoms([
    [recoilSnapshotAtom, snapshot],
    [setRecoilStateAtom, setRecoilStateRef],
  ]);

  useEffect(() => {
    setRecoilSnapshot(snapshot);
  }, [snapshot, setRecoilSnapshot]);
};

/** Create readonly Jotai atom that selects from underlying Recoil state. */
export const selectRecoilValue = <T>(recoilValue: RecoilValue<T>) =>
  selectAtom(recoilSnapshotAtom, (snapshot, prevValue?: T) => {
    if (snapshot === null) {
      throw new Error("Missing useSyncRecoilSnapshot in the tree");
    }

    const loadable = snapshot.getLoadable(recoilValue);

    if (loadable.state === "loading") {
      return prevValue as T;
    }

    if (loadable.state === "hasError") {
      throw loadable.contents as Error;
    }

    return loadable.contents;
  });

/** Create read-write Jotai atom that reads and writes to underlying Recoil state. */
export const atomWithRecoilValue = <T>(recoilState: RecoilState<T>) => {
  const recoilSelector = selectRecoilValue(recoilState);

  return atom(
    (get) => get(recoilSelector),

    (get, _set, newValue: T) => {
      const setRecoilStateRef = get(setRecoilStateAtom);
      const setRecoilState = setRecoilStateRef?.current;

      if (!setRecoilState) {
        throw new Error("Missing useSyncRecoilSnapshot in the tree");
      }

      setRecoilState(recoilState, newValue);
    }
  );
};
