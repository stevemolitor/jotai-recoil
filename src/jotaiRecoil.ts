import { useSetAtom } from "jotai/react";
import { useHydrateAtoms } from "jotai/react/utils";
import { atom } from "jotai/vanilla";
import { selectAtom } from "jotai/vanilla/utils";
import { MutableRefObject, useEffect, useRef } from "react";
import { RecoilState, useGotoRecoilSnapshot, useRecoilSnapshot } from "recoil";
import type { RecoilValue, Snapshot } from "recoil";

const recoilSnapshotAtom = atom<Snapshot | null>(null);

type GotoSnapshot = (snapshot: Snapshot) => void;

const gotoRecoilSnapshotRefAtom = atom<MutableRefObject<GotoSnapshot> | null>(
  null
);

export const useSyncRecoilSnapshot = () => {
  const setRecoilSnapshot = useSetAtom(recoilSnapshotAtom);
  const setGotoRecoilSnapshot = useSetAtom(gotoRecoilSnapshotRefAtom);
  const snapshot = useRecoilSnapshot();
  const gotoSnapshot = useGotoRecoilSnapshot();
  const gotoSnapshotRef = useRef(gotoSnapshot);

  useHydrateAtoms([
    [recoilSnapshotAtom, snapshot],
    [gotoRecoilSnapshotRefAtom, gotoSnapshotRef],
  ]);

  useEffect(() => {
    setRecoilSnapshot(snapshot);
  }, [snapshot, setRecoilSnapshot]);

  useEffect(() => {
    setGotoRecoilSnapshot(gotoSnapshotRef);
  }, [gotoSnapshot, setGotoRecoilSnapshot]);
};

const selectRecoilValue = <T>(recoilValue: RecoilValue<T>) =>
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

export const atomWithRecoilValue = <T>(recoilState: RecoilState<T>) => {
  const recoilSelector = selectRecoilValue(recoilState);

  return atom(
    (get) => get(recoilSelector),
    (get, _set, newValue: T) => {
      const snapshot = get(recoilSnapshotAtom);
      if (snapshot === null) {
        throw new Error("Missing useSyncRecoilSnapshot in the tree");
      }

      const newSnapshot = snapshot.map(({ set }) => {
        set(recoilState, newValue);
      });

      const gotoSnapshotRef = get(gotoRecoilSnapshotRefAtom);
      if (gotoSnapshotRef === null) {
        throw new Error("Missing useSyncRecoilSnapshot in the tree");
      }

      gotoSnapshotRef.current(newSnapshot);
    }
  );
};
