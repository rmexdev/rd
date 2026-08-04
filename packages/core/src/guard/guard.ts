import {
    argumentEmptyStringErr,
    argumentNotGreaterThanErr,
    argumentNotGreaterThanOrEqualToErr,
    argumentNotInRangeErr,
    argumentNotLessThanErr,
    argumentNotLessThanOrEqualToErr,
    argumentNotOneOfErr,
    argumentNullOrUndefinedErr,
    type GuardErr,
} from './guard-error.ts';
import { ok, err, type Result } from '../result/index.ts';

export interface IGuardArgument {
    argument: unknown;
    argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export type GuardResult = Result<true, GuardErr>;

export const combine = (guardResults: GuardResult[]): GuardResult => {
    for (const result of guardResults) {
        if (result.isErr) return result;
    }

    return ok(true);
};

export const againstNullOrUndefined = (
    argument: unknown,
    argumentName: string,
): GuardResult => {
    if (argument === null || argument === undefined) {
        return err(argumentNullOrUndefinedErr(argumentName));
    } else {
        return ok(true);
    }
};

export const againstEmptyString = (
    argument: unknown,
    argumentName: string,
): GuardResult => {
    const nullOrUndefinedGuardOrError = againstNullOrUndefined(
        argument,
        argumentName,
    );
    if (nullOrUndefinedGuardOrError.isErr) {
        return nullOrUndefinedGuardOrError;
    }

    return typeof argument !== 'string' || argument.trim() === ''
        ? err(argumentEmptyStringErr(argumentName))
        : ok(true);
};

export const againstNullOrUndefinedBulk = (
    args: GuardArgumentCollection,
): GuardResult => {
    for (const arg of args) {
        const result = againstNullOrUndefined(arg.argument, arg.argumentName);
        if (result.isErr) return result;
    }

    return ok(true);
};

export const isOneOf = (
    value: unknown,
    validValues: unknown[],
    argumentName: string,
): GuardResult => {
    let isValid = false;
    for (const validValue of validValues) {
        if (value === validValue) {
            isValid = true;
        }
    }

    if (isValid) {
        return ok(true);
    } else {
        return err(argumentNotOneOfErr(argumentName, validValues, value));
    }
};

export const inRange = (
    num: number,
    min: number,
    max: number,
    argumentName: string,
): GuardResult => {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
        return err(argumentNotInRangeErr(argumentName, min, max));
    } else {
        return ok(true);
    }
};

export const greaterThan = (
    minValue: number,
    actualValue: number,
    argumentName: string,
): GuardResult => {
    return actualValue > minValue
        ? ok(true)
        : err(argumentNotGreaterThanErr(argumentName, minValue));
};

export const greaterThanOrEqualTo = (
    minValue: number,
    actualValue: number,
    argumentName: string,
): GuardResult => {
    return actualValue >= minValue
        ? ok(true)
        : err(argumentNotGreaterThanOrEqualToErr(argumentName, minValue));
};

export const lessThan = (
    maxValue: number,
    actualValue: number,
    argumentName: string,
): GuardResult => {
    return actualValue < maxValue
        ? ok(true)
        : err(argumentNotLessThanErr(argumentName, maxValue));
};

export const lessThanOrEqualTo = (
    maxValue: number,
    actualValue: number,
    argumentName: string,
): GuardResult => {
    return actualValue <= maxValue
        ? ok(true)
        : err(argumentNotLessThanOrEqualToErr(argumentName, maxValue));
};

export const allInRange = (
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
): GuardResult => {
    for (const num of numbers) {
        const numIsInRangeResult = inRange(num, min, max, argumentName);
        if (numIsInRangeResult.isErr) return numIsInRangeResult;
    }

    return ok(true);
};
