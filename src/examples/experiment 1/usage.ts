import { PropA, PropRoot } from "./implementation.js";

const rewt = new PropRoot();

const propA = rewt.propertyA;

const propB = rewt.propertyB;

const resolvedA = await propA.resolve();
console.log("resolvedA", resolvedA);

const resolvedB = await propB.resolve();
console.log("resolvedB", resolvedB);

const c = await rewt.propertyA.propertyC.resolve();
console.log("resolvedC", c);

console.log("rewt", await rewt.resolve());
