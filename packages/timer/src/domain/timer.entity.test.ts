import { describe, expect, it } from 'vitest';
import { Duration, type DurationResult } from './duration.vo.ts';
import { Temporal } from 'temporal-polyfill';
import { TimerId, type TimerIdResult } from './timer-id.ts';
import { Timer, type TimerResult } from './timer.entity.ts';

describe('timer.entity', () => {
    it('should not accept null or undefined values', () => {
        const timerResult: TimerResult = Timer.create({
            // @ts-ignore
            duration: undefined
        }, undefined);

        expect(timerResult.isSuccess).toBe(false);
        expect(timerResult.error).toBeString();
    });

    it('should not accept duration of more than 2 hours', () => {
        const timerIdResult: TimerIdResult = TimerId.create('some-id');

        const durationTemporal = Temporal.Duration.from({ hours: 2, minutes: 1 });
        const durationResult: DurationResult = Duration.create({ value: durationTemporal });

        const timerResult: TimerResult = Timer.create({
            duration: durationResult.getValue()
        }, timerIdResult.getValue());

        expect(timerResult.isSuccess).toBe(false);
        expect(timerResult.error).toBeString();
    });

    it('should generate id if not provided', () => {
        const durationTemporal = Temporal.Duration.from({ hours: 1 });
        const durationResult: DurationResult = Duration.create({ value: durationTemporal });

        const timerResult: TimerResult = Timer.create({
            duration: durationResult.getValue()
        });

        expect(timerResult.isSuccess).toBe(true);
        expect(timerResult.getValue().id.toString()).toBeString();
    });
});
