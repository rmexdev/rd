import type { ErrAny } from "../errors/index.ts";

export type Ok<T> = { isOk: true, isErr: false, value: T };
export type Err<E extends ErrAny> = { isOk: false, isErr: true, err: E };

export type Result<T, E extends ErrAny> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => {
    return {
        isOk: true,
        isErr: false,
        value,
    }
};

export const err = <E extends ErrAny>(err: E): Err<E> => {
    return {
        isOk: false,
        isErr: true,
        err
    };
};

export const combine = (...results: Array<Result<unknown, ErrAny>>): Result<true, ErrAny> => {
    for (const result of results) {
        if (result.isErr) return result;
    }

    return ok(true);
}
