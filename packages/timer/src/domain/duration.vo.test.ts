import { describe, expect, it } from 'vitest';
import { Temporal } from 'temporal-polyfill';

import { Duration, type DurationResult } from './duration.vo.ts';

describe('duration.vo', () => {
    it.each([
        null,
        undefined,
        { value: undefined }
    ])('should fail for invalid value', (value) => {
        // @ts-ignore
        const durationResult: DurationResult = Duration.create(value);
    
        expect(durationResult.isSuccess).toBe(false);
        expect(durationResult.error).toBeString();
    });
    
    it.each([
        { hours: 25 },
        { weeks: 4 },
        { months: 2 },
        { years: 8 },
        { hours: 24, minutes: 1 }
    ])('should not allow for duration of more than 24 hours', (duration) => {
        const durationTemporal = Temporal.Duration.from(duration);
        const durationResult: DurationResult = Duration.create({ value: durationTemporal });
    
        expect(durationResult.isSuccess).toBe(false);
        expect(durationResult.error).toBeString();
    });

    describe('valid values', () => {
        it('should return a valid duration', () => {
            const durationTemporal = Temporal.Duration.from({ minutes: 40 });
            const durationResult = Duration.create({ value: durationTemporal });
            const duration = durationResult.getValue();

            expect(durationResult.isSuccess).toBe(true);
            expect(duration.value.toString()).toBe(durationTemporal.toString());
        });
    
        it.each([
            [2, 2, true],
            [3, 8, false]
        ])('should have correct equals method', (value1, value2, isEqual) => {
            const durationTemporal1 = Temporal.Duration.from({ seconds: value1 });
            const duration1 = Duration.create({ value: durationTemporal1 });
            const durationTemporal2 = Temporal.Duration.from({ seconds: value2 });
            const duration2 = Duration.create({ value: durationTemporal2 });
        
            expect(duration1.getValue().equals(duration2.getValue())).toBe(isEqual);
        });

        it('should have correct greater than method', () => {
            const durationTemporal = Temporal.Duration.from({ hours: 2 });
            const durationResult1 = Duration.create({ value: durationTemporal });
            const durationResult2 = Duration.create({ value: durationTemporal.add({ minutes: 5 }) });

            expect(durationResult1.getValue().greaterThan(durationResult2.getValue())).toBe(false);
        });
    });
});
