# Jotai Atoms that Proxy to Recoil

I started with a copy pasta from Daishi's
[jotai-recoil](https://github.com/jotaijs/jotai-recoil) library, but extended to support
mutable Jotai atom proxies. I removed the `dangerouslySyncInRender` option, 
restructured slightly to avoid a TypeScript error.

Daishi's jotai-recoil library is read-only on the Jotai side. You can create a Jotai atom
that will _read_ from a Recoil state. If you update the Recoil state via Recoil, the Jotai
atom will "see" that update. However, you cannot update the Jotai atom and have it
propagate down to the underlying Recoil atom.

## How Daishi's `jotai-recoil` Library Works:

`useSyncRecoilSnapshot` puts a Recoil snapshot (a snapshot of all the Recoil state) into a
Jotai `recoilSnapshotAtom`.  Every time there is a state change in Recoil, a `useEffect`
hook sets the Recoil snapshot into the Jotai atom. You install `useRecoilSnapshot()`
somewhere at the top of your component tree.  `selectRecoilValue` (renamed) creates an
atom that wraps a Recoil value (atom or selector), delegating to the Recoil snapshot
stored in the Jotai `recoilSnapshotAtom` to get the underlying Recoil value. So it's a
true proxy from Jotai to Recoil. Instead of putting the value in both Recoil and Jotai and
syncing between the two, the data just leaves in one place, in Recoil. That's
good. However, it uses the Jotai `selectAtom` function (which supplies the previous value,
see below), which as the name implieas is read-only.

The implementation of `selectRecoilValue` is synchronous, and returns the previous value
while a new Recoil value is asynchronous loading. It will not suspend. We will want to
consider a variation that supports suspense.

## How I Made It Mutable

_Warning_: this is crazy, dicey, and probably ill advised.

I added a new Jotai atom factory function, `atomWithRecoilValue`. It delegates to a
read-only `selectRecoilValue` for its getter.  For the setter, I updated
`useSyncRecoilSnapshot` to also use `useGotoRecoilSnapshot`, and sync and put the
`gotoSnapshot` function in a Jotai atom. Except that you can't put a function in a Jotai
atom directly, because Jotai think's its an atom setter function and tries to call it. So
I wrapped `gotoSnapshot` in a ref and put that in a Jotai atom.

In the atom setter, I grabbed both the current Recoil snapshot and gotoSnapshot from their
respective Jotai atoms. I produce a new version of the snapshot using `snapshot.map`,
setting the recoil value to the value passes to the Jotai setter.  It works in this
simple, syncronous example. Will it cause everything to re-render, or just the changed
atom in the new snapshot? I'm hoping the latter but haven't verified yet. Another concern
is what happens with async activities? Will we risk missing updates and horrific race
conditions when we replace the old snapshot with the new one?
