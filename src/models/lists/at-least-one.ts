/**
 * A readonly array with at least 1 value.
 *
 * Readonly so consumers can't accidentally mutate (e.g. pop) and violate the invariant.
 */
export type AtLeastOne<T> = readonly [T, ...T[]];

/**
 * type guard to check if an array has at least one value
 * @param array   the array to check
 * @returns       true if the array has at least one value, false otherwise
 */
export function isAtLeastOne<T>(array: readonly T[]): array is AtLeastOne<T> {
  return array.length >= 1;
}

/**
 * Create an `AtLeastOne<T>` from a head element and optional tail.
 */
export function atLeastOne<T>(head: T, ...tail: T[]): AtLeastOne<T> {
  return [head, ...tail] as const;
}

/**
 * Convert a normal array into an `AtLeastOne<T>` if it contains at least one element.
 * Returns undefined otherwise.
 */
export function toAtLeastOne<T>(arr: readonly T[]): AtLeastOne<T> | undefined {
  return arr.length > 0 ? (arr as unknown as AtLeastOne<T>) : undefined;
}

/**
 * Runtime guard that throws if the provided array is empty, otherwise returns it typed
 * as `AtLeastOne<T>`.
 */
export function ensureAtLeastOne<T>(
  arr: readonly T[],
  message = "Expected at least one element",
): AtLeastOne<T> {
  if (arr.length === 0) {
    throw new Error(message);
  }
  return arr as unknown as AtLeastOne<T>;
}
