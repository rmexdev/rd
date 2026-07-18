import { Guard, Identifier, Result } from "@rd/core";

export type TimerIdResult = Result<TimerId>;

export class TimerId extends Identifier<string> {
    static create (id: string): TimerIdResult {
        const guardResult = Guard.againstEmptyString(id, 'id');
        if (!guardResult.succeeded) {
            return Result.fail(guardResult.message);
        }
    
        return Result.ok(new TimerId(id));
    }

    private constructor(id: string) {
        super(id);
    }
}
