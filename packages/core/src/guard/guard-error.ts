import { type ErrBase } from '../error/index.ts';

export const GuardCodes = {
    ArgumentNullOrUndefined: 'guard.argument-null-or-undefined',
    ArgumentEmptyString: 'guard.argument-empty-string',
    ArgumentNotOneOf: 'guard.argument-not-one-of',
    ArgumentNotInRange: 'guard.argument-not-in-range',
    ArgumentNotGreaterThan: 'guard.argument-greater-than',
    ArgumentNotGreaterThanOrEqualTo:
        'guard.argument-not-greater-than-or-equal-to',
    ArgumentNotLessThan: 'guard.argument-not-less-than',
    ArgumentNotLessThanOrEqualTo: 'guard.argument-not-less-than-or-equal-to',
    ArgumentNotAllInRange: 'guard.argument-not-all-in-range',
} as const;

export type GuardCodes = (typeof GuardCodes)[keyof typeof GuardCodes];
export type GuardErr = ErrBase<GuardCodes>;

const guardErr = (code: GuardCodes, message: string): GuardErr => ({
    code,
    message,
});

export const argumentNullOrUndefinedErr = (argumentName: string): GuardErr =>
    guardErr(
        'guard.argument-null-or-undefined',
        `${argumentName} is null or undefined`,
    );

export const argumentEmptyStringErr = (argumentName: string): GuardErr =>
    guardErr(
        'guard.argument-empty-string',
        `${argumentName} is an empty string`,
    );

export const argumentNotOneOfErr = (
    argumentName: string,
    validValues: unknown[],
    value: unknown,
): GuardErr =>
    guardErr(
        'guard.argument-not-one-of',
        `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
    );

export const argumentNotInRangeErr = (
    argumentName: string,
    min: number,
    max: number,
): GuardErr =>
    guardErr(
        'guard.argument-not-one-of',
        `${argumentName} is not within range ${min} to ${max}.`,
    );

export const argumentNotGreaterThanErr = (
    argumentName: string,
    minValue: number,
): GuardErr =>
    guardErr(
        'guard.argument-greater-than',
        `${argumentName} must be greater than ${minValue}.`,
    );

export const argumentNotGreaterThanOrEqualToErr = (
    argumentName: string,
    minValue: number,
): GuardErr =>
    guardErr(
        'guard.argument-not-greater-than-or-equal-to',
        `${argumentName} must be at least ${minValue}.`,
    );

export const argumentNotLessThanErr = (
    argumentName: string,
    maxValue: number,
): GuardErr =>
    guardErr(
        'guard.argument-not-less-than',
        `${argumentName} must be less than ${maxValue}.`,
    );

export const argumentNotLessThanOrEqualToErr = (
    argumentName: string,
    minValue: number,
): GuardErr =>
    guardErr(
        'guard.argument-not-less-than-or-equal-to',
        `${argumentName} must be at least ${minValue}.`,
    );

export const argumentNotAllInRangeErr = (argumentName: string): GuardErr =>
    guardErr(
        'guard.argument-not-all-in-range',
        `${argumentName} is not within the range.`,
    );
