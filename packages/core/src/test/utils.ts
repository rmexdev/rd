import type { ErrAny } from '../error/err.base.ts';
import type { Err, Ok, Result } from '../result/index.ts';

export function assertIsOk<T, E extends ErrAny>(
    result: Result<T, E>,
): asserts result is Ok<T> {
    if (result.isErr) throw new Error(result.err.message);
}

export function assertIsErr<T, E extends ErrAny>(
    result: Result<T, E>,
): asserts result is Err<E> {
    if (result.isOk) throw new Error('expected Err to be Ok');
}
