// A bunch of errors, with a discriminator so typescript knows they're not all the same.
// (you should always have a discriminator like this when dealing with results to benefit from the result type)

const ErrorAId = Symbol();
export class ErrorA {
  public readonly [ErrorAId] = true;
}
const ErrorBId = Symbol();
export class ErrorB {
  public readonly [ErrorBId] = true;
}

const ErrorCId = Symbol();
export class ErrorC {
  public readonly [ErrorCId] = true;
}

const ErrorDId = Symbol();
export class ErrorD {
  public readonly [ErrorDId] = true;
}
