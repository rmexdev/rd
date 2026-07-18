import { Entity, Guard, Result } from "@rd/core";
import { Duration } from "./duration.vo.ts";
import { TimerId, type TimerIdResult } from "./timer-id.ts";
import { Temporal } from "temporal-polyfill";
import { nanoid } from "nanoid";

export type TimerProps = {
    duration: Duration
}

export type TimerResult = Result<Timer>;

export class Timer extends Entity<TimerProps> {
    private static readonly MAXIMUM_DURATION_HOURS = 2;
    
    static create (props: TimerProps, id?: TimerId): TimerResult {
        let timerId: TimerId | undefined = id;
        if (!timerId) {
            const result: TimerIdResult = TimerId.create(nanoid(10));
            if (result.isFailure) {
                return Result.fail('Error generating new id for Timer');
            }

            timerId = result.getValue();
        }

        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: timerId, argumentName: 'id'},
            { argument: props.duration, argumentName: 'duration'}
        ]);
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }
        
        const maximumDurationResult = Duration.create({ 
            value: Temporal.Duration.from({ hours: Timer.MAXIMUM_DURATION_HOURS })
        });
        if (maximumDurationResult.isFailure
            || props.duration.greaterThan(maximumDurationResult.getValue())) {
                return Result.fail(`Duration cannot be more than ${Timer.MAXIMUM_DURATION_HOURS} hours`)
        }
        
        return Result.ok(new Timer(props, timerId));
    }
    
    constructor(props: TimerProps, id: TimerId) {
        super(props, id);
    }

    get id() : TimerId {
        return this._id;
    }

    public get duration() : Duration {
        return this.props.duration;
    }
}
