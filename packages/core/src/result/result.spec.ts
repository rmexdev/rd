import { assertType, describe, expect, it } from 'vitest';
import { type Result, type Ok, type Err, ok, err, combine } from './result.ts';
import type { AppErr } from '../errors/err.base.ts';

describe('Result', () => {
    const GenericError: AppErr = { code: "GENERIC_ERROR", message: "generic error message"}

    describe('creation', () => {
        it('should return value on success with Ok type', () => {
            const result: Result<number, never> = ok(22);
            
            expect(result.isOk).toBe(true);
            assertType<Ok<number>>(result);
            expect(result.value).toBe(22);
        });
        
        it('should return error with Err type', () => {

            const result = err(GenericError);

            expect(result.isErr).toBe(true);
            expect(result.err.message).toBe(GenericError.message);
            assertType<Err<AppErr>>(result);
        });
    });

    describe('combine', () => {
        const results: Array<Result<unknown, AppErr>> = [
            ok(22),
            ok("text"),
            ok(true),
        ]

        it('should return Err when even one Result is Err', () => {
            const resultFail = err(GenericError);
            const resultsWithFail = [...results, resultFail];

            const combinedResults = combine(...resultsWithFail);

            expect(combinedResults.isErr).toBe(true);
            expect(combinedResults).toHaveProperty("err");
        });

        it('should return Ok when all Results are Ok', () => {
            const resultsOk = [...results];

            const combinedResults = combine(...resultsOk);

            expect(combinedResults.isOk).toBe(true);
            expect(combinedResults).toHaveProperty("value");
        });
    });
});
