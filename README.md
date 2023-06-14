# Jotai / Recoil Tic Tac Toe

Naively proxy from Recoil to Jotai via a Recoil read / write selector that delegates to the Jotai store.

It doesn't work. The recoil selector does not re-evaluate when something changes in Jotai because Recoil does not think anything (in Recoil) has changed.

The Jotai store has a method to [subscribe](https://github.com/pmndrs/jotai/blob/main/src/vanilla/store.ts#L621) to atom changes, so in theory we could use that to poke at a special "force eval" recoil atom when a jotai atom changes, and then have the recoil proxy selector subscribe to that "force eval" recoil atom to make it re-evaluate when jotai state changes. _However_, the Jotai store subscribe method requires a specific atom to listen to changes to. We'd have to manually subscribe to _every_ Jotai atom change to be safe.

In short this does not seem like a promising approach.
