import { Temporal } from 'temporal-polyfill';
import { Guard, Result, ValueObject } from "@rd/core";

export type DurationProps = {
    value: Temporal.Duration
}

export type DurationResult = Result<Duration>;

export class Duration extends ValueObject<DurationProps> {
    private static readonly MAXIMUM_DURATION_IN_HOURS = 24;
    
    private static hasCalendarUnits(durationTemporal: Temporal.Duration): boolean {
        return durationTemporal.weeks > 0
            || durationTemporal.months > 0
            || durationTemporal.years > 0;
    }

    static create (props: DurationProps): DurationResult {
        const guardResult = Guard.againstNullOrUndefined(props?.value, 'value');
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }

        if (this.hasCalendarUnits(props.value)
            || props.value.total('hour') > Duration.MAXIMUM_DURATION_IN_HOURS) {
            return Result.fail(Duration.create({ value: Temporal.Duration.from({minutes: 1}) }))
        } 

        return Result.ok(new Duration(props));
    }
    
    private constructor(props: DurationProps) {
        super(props);
    }

    get value() : Temporal.Duration {
        return this.props.value;
    }

    override equals(other: Duration): boolean {
        return this.value.toString() === other.value.toString();
    }

    greaterThan (other: Duration): boolean {
        return Temporal.Duration.compare(this.value, other.value) === 1;
    }
}
