# (TypeScript) ddddd alternatives experiment

This repo experiments with a nicer api for dealing with highly async and dependent data (in typescript!).
It was made in response to a recurring discussion regarding shortcomings of domain driven design, as described by some books when dealing with such real world data.

<details>
<summary>(RANT)</summary>

Not having async/observable streams in domain objects is annoying when all the rules do in fact depend on async data.

As is not having the domain object directly able to do actions, but always going through some other service that takes a domain object and persists it.

When our objects are huge, with 10000ds of properties, all of it async, and interdependent, this quickly becomes unusably slow.

Not to mention all the boilerplate that is involved with everything, in our current attempt to implement ddd it feels like there are more files for abstraction and orchestration than there is actual logic code. Not to mention that pretty much all the layers tend to change for almost every change, making every PR huge and impossible to check.

All of those are probably because of our interpretations and implementation of the rules, maybe not the rules themselves. But that doesn't make it any less bad to deal with.

(END OF RANT)

</details>

So the thinking goes, what if we did again have an object on which we directly called methods to do the work.
But do it in a way that took into account the fact that what a specific service or whatever the object represents, changes over time.
And in a way where we didn't have to do a bunch of operations on an observable and chain them infinitely.

### example:

You want to control a specific IoT device `Device-A`, found on a specific network location, that may have a specific feature `volume`. And you want to display the value of the current volume on a little web page. Which is straight forward enough: `device->volume->value`

But some of that data may depend on each other and changes the end result.

- The page may want to switch between `Device-A` and `Device-B`, so you'd have to re-render if that change occurs.
- The configuration for `Device-A` may change to point to a different network location, so you'd have to re-fetch the relevant data in the new place when it changes
- `Device-A` may get a firmware update, that disabled or re-enabled that volume feature. So you'd have to show it isn't available when that changes.
- the value of the volume itself changes (this is why we were here to begin with)

A lot of web technology just doesn't care or need that kind of reactivity. It is generally accepted that a page displays stale out of date information while the user is reading it, even if that user is expected to then fill in a form based on that now invalid information.

But I consider these kinds of real life IoT devices to be a prime example of where that just isn't good enough. When I want to see the volume, I mean the volume it is right now as my eyes are looking at it. I want to see it move as someone grabs the volume knob.

In the real world, my work involves controlling exactly those kinds of devices. Except they have 10000nds of parameters to control, controlled by several impatient people simultaneously, on flaky networks and underpowered hardware.

### current status

This repo now has a few basic examples of what such a nicer api could look like.

It is far from complete. It doesn't yet show an example of how to filter/group/query complex data, how to actually resolve bulk data in efficient ways, how to deal with actual values and not just the dependent properties, etc etc

To use it:

- `npm run build`
- Experiment 1 [basic await](./src//examples/experiment%201//README.md): `node _output/tsc/examples/experiment\ 1/usage.js`
- Experiment 2 [basic await with optional properties](./src//examples/experiment%202//README.md): `node _output/tsc/examples/experiment\ 2/usage.js`
- Experiment 3 [basic observable with optional properties](./src//examples/experiment%203//README.md): `node _output/tsc/examples/experiment\ 3/usage.js`

The general idea is that the interface you use can expose _resolvable_ properties, or be resolved itself to get the whole thing.

Async stuff in these experiments is handled as either a `Promise` or an `Observable` via `resolve()` or `resolve$()` respectively.
No signals, I like my async to be lazy and I haven't played around with those enough to see them as anything but an observable with a different api (and maybe less functionality).

### previous work

It uses a basic `Result` type and namespace I've made previously. I want my errors to be typed, so I don't want any promise/function/observable to ever throw, instead it should just return a Result so I know what can go wrong and how to display the error correctly.

My `Result` type is also based on my belief that in the real world, I often don't have a single cause of failure, but a list of at least one element.
And when it comes to parsing data, or other situations where errors may be corrected, a result should also be able to have a list of warnings.

It doesn't currently include any convenience mapping functions to deal with those results, but those are easy enough to write.
