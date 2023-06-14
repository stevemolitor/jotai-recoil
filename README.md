# Jotai / Recoil Sync 

Sync from recoil to Jotai via global RecoilStore object that can be accessed via Jotai. The RecoilStore implementation is similar to [recoil-nexus](https://www.npmjs.com/package/recoil-nexus).

To make it work, the jotai to recoil proxy atom needs to force a re-evaluation by incrementting a dummy `forceEval` jotai atom every time it is set, and the jotai proxy atom getter needs to evaluate that dummy `forceEval` atom.

It works going from jotai to recoil, but not vice-versa. We'd have to play similar tricks on the recoil side to make it truly a two way sync.

Overally it feels hacky and brittle.


