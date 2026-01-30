example 3, observable version of example 2.

Observations:

It is too easy for `resolve()` and `resolve$()` implementations to go out of sync.
And depending on your usecase you can't just naively wrap `resolve$()` in a `firstValueFrom()` to get a `resolve()`.
For instance in places I'd use it, for the observable version I probably want to start off values with default ones, until I can retrieve the actual values from some external source.
But for the promise version, I want it to wait until it had fetched the current value.
And sometimes maybe I do want an observable version to only emit once it has real data.. and I don't know yet how to accurately represent that with a type so its usage and behavior is clear for everyone.

The example implementations had Observables that would end (except for the error one)
this is different from what I'd likely use in real life, which are mostly observables that never end.
changes can keep coming and everything else needs to be able to deal with that.
In this case, the take(5) could have never completed since some of them never emitted 5. But this is just because of the naive usage.
RxJS not offering a type so you can tell the difference between something that ends on its own and something that doesn't is just annoying (but a completely different story)
