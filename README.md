# Jotai Atoms that Proxy to Recoil

I started with a copy pasta from Daishi's
[jotai-recoil](https://github.com/jotaijs/jotai-recoil) library, but extended to support
mutable Jotai atom proxies. I removed the `dangerouslySyncInRender` option, 
and restructured slightly to avoid a TypeScript error.

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
while a new Recoil value is asynchronous loading. It will not suspend. 

## How I Made It Mutable

In
[useSyncRecoilSnapshot](https://github.com/stevemolitor/jotai-recoil/blob/jotai-recoil-with-mutate/src/jotaiRecoil.ts#L21-L33)
I captured the `set` function passed to `useRecoilCallback` and put it in a
`setRecoilStateAtom` Jotai atom. Except that you can't put a function in a Jotai atom
directly, because Jotai think's its an atom setter function and tries to call it. So I
wrapped the setter function in a ref and put _that_ in a Jotai atom.

I added a new Jotai atom factory function,
[`atomWithRecoilValue`](https://github.com/stevemolitor/jotai-recoil/blob/jotai-recoil-with-mutate/src/jotaiRecoil.ts#L61-L75). It
delegates to a read-only `selectRecoilValue` atom for its getter. For the setter, it uses
the Recoil setter from the `setRecoilStateAtom` Jotai atom that was hydrated in
`useSyncRecoilSnapshot` (via the ref wrapper).

## Related

The _tiny_ `recoil-nexus` library uses a similar technique, except that curiously it [uses](https://github.com/luisanton-io/recoil-nexus/blob/master/src/RecoilNexus.tsx#L31-L36) the `set` function passed to `useRecoilCallback` to set writable Recoil selectors as I do here, but uses the `set` function passed to `useRecoilTransaction_UNSTABLE` to set Recoil atoms. Maybe there's a reason 🤷? 
Also note that `recoil-nexus` supports getting a promise, and resetting atom values. We could steal those bits.

See this [StackOverflow](https://stackoverflow.com/questions/68945574/how-to-update-atoms-state-in-recoil-js-outside-components-react) discussing these techniques for using Recoil outside of a React component.
