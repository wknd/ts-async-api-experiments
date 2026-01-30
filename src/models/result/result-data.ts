import { ensureAtLeastOne, AtLeastOne } from "../lists/index.js";
/**
 * a successful result
 *
 * It can happen that a result has warnings (for example a clamped value during
 * limit validation). It can be useful to provide this info as warnings
 */
export class Ok<Value, Warning = never> {
  /**
   * discriminator to mark a result as ok
   */
  public readonly _tag = "ok" as const;
  /**
   * @param result      the value we're interested in
   * @param warnings    optional list of warnings that occured while creating the value
   */
  constructor(
    public readonly result: Value,
    public readonly warnings?: AtLeastOne<Warning>,
  ) {}
}

/**
 * an unsuccessful result
 *
 * When something fails, there could be multiple issues, this is encoded in this
 * problems type, to ensure all code can handle multiple error returns
 */
export class Err<E, Warning = never> {
  /**
   * discriminator to mark a result as an err
   */
  public readonly _tag = "err" as const;
  /**
   * @param errors      the list of errors (must contain at least one error)
   * @param warnings    optional list of warnings
   */
  constructor(
    public readonly errors: AtLeastOne<E>,
    public readonly warnings?: AtLeastOne<Warning>,
  ) {}
}

/**
 * a generic Result that can manipulate data
 *
 * A result type is either
 * - a good result, and optionally warnings
 * - a bad result (problem list), and optionally warnings
 *
 * This result type enforces good design:
 * - There always can be more than one error, this is enforced in the data type.
 *   The advantage here is to make it easier to merge errors together, or to
 *   provide a more complete set of errors, instead of only returning the first
 *   error in a list. An example is when validating a value against limits, it is
 *   nicer to have a complete set of errors when validation fails, instead of having
 *   to fix them 1 by 1.
 * - It's possible to have warnings, this type also provides an interface for warnings,
 *   while having the option to turn it off with a simple interface in that case. just
 *   don't fill in a warnings type, and this results in all optional warning fields
 *   becoming non-existent.
 */
export type Result<Value, Error, Warning = never> =
  | Ok<Value, Warning>
  | Err<Error, Warning>;

/**
 * Factory function to create an good value
 * @param result    the value we are interested in
 * @param warnings  [optional] warnings list
 */
export function ok<Value, Warning = never>(
  result: Value,
  warnings?: ReadonlyArray<Warning>,
): Result<Value, never, Warning> {
  return new Ok(
    result,
    warnings?.length ? (warnings as AtLeastOne<Warning>) : undefined,
  );
}

/**
 * Factory function to create an error value.
 *
 * Overloads:
 * - pass an array of errors: `err([e1, e2])`
 * - pass a single error: `err(e1)`
 *
 * @param errors error list (must contain at least one error) OR single error (will be wrapped)
 * @param warnings [optional] warnings list
 */
export function err<E, W = never>(
  errors: AtLeastOne<E>,
  warnings?: ReadonlyArray<W>,
): Result<never, E, W>;
export function err<E, W = never>(
  error: E,
  warnings?: ReadonlyArray<W>,
): Result<never, E, W>;
export function err<E, W = never>(
  errorsOrError: E | AtLeastOne<E>,
  warnings?: ReadonlyArray<W>,
): Result<never, E, W> {
  if (Array.isArray(errorsOrError)) {
    return new Err(
      ensureAtLeastOne(errorsOrError, "err requires at least one error"),
      warnings?.length ? (warnings as AtLeastOne<W>) : undefined,
    );
  }
  return new Err(
    [errorsOrError] as const as AtLeastOne<E>,
    warnings?.length ? (warnings as AtLeastOne<W>) : undefined,
  );
}

/**
 * check if a result is successful
 * @returns true    input is a successful result
 * @returns false   input is an unsuccessful result
 */
export function isOk<Value>(
  data: Result<Value, unknown, unknown>,
): data is Ok<Value, unknown> {
  return data._tag === "ok";
}

/**
 * check if a result is successful
 * @returns true    input is an unsuccessful result
 * @returns false   input is a successful result
 */
export function isErr<E>(
  data: Result<unknown, E, unknown>,
): data is Err<E, unknown> {
  return data._tag === "err";
}
