import { describe, expect, expectTypeOf, it } from 'vitest';
import { TimerId, type TimerIdResult } from './timer-id.ts';

describe('timer-id', () => {
    it.each([
        1,
        '',
        '  '
    ])('should fail for invalid ids', (id) => {
        // @ts-ignore
        const timerIdResult: TimerIdResult = TimerId.create(id);

        expect(timerIdResult.isSuccess).toBe(false);
        expectTypeOf(timerIdResult.error).toBeString();
    });
    
    it.each([
        'some-id',
        'rnadoirtn',
        'airst-;ypqt-.zhdxd'
    ])('should return same id for valid values', (id) => {
        const timerIdResult: TimerIdResult = TimerId.create(id);

        expect(timerIdResult.isSuccess).toBe(true);
        expect(timerIdResult.getValue().toString()).toBe(id);
    });
});
