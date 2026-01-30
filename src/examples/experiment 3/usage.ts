import { take } from "rxjs";
import { PropA, PropRoot } from "./implementation.js";

const rewt = new PropRoot();

const propA = rewt.propertyA;

const propB = rewt.propertyB;

propA
  .resolve$()
  .pipe(take(5))
  .subscribe({
    next: (resolvedA) => {
      console.log("resolvedA", resolvedA);
    },
  });

propB
  .resolve$()
  .pipe(take(5))
  .subscribe({
    next: (resolvedB) => {
      console.log("resolvedB", resolvedB);
    },
  });

rewt.propertyA.propertyC
  .resolve$()
  .pipe(take(5))
  .subscribe({
    next: (c) => {
      console.log("resolvedC", c);
    },
  });

rewt
  .resolve$()
  .pipe(take(5))
  .subscribe({
    next: (resolvedRewt) => {
      console.log("rewt", resolvedRewt);
    },
  });
