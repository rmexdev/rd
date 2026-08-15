import { Identifier } from '@rd/core/domain';
import { type Result, ok, err } from '@rd/core/result';
import { againstEmptyString, type GuardErr } from '@rd/core/guard';

export type ItemIdResult = Result<ItemId, GuardErr>;

export class ItemId extends Identifier<string> {
    static create(id: string): ItemIdResult {
        const guardResult = againstEmptyString(id, 'id');
        if (guardResult.isErr) {
            return err(guardResult.err);
        }

        return ok(new ItemId(id));
    }

    private constructor(id: string) {
        super(id);
    }
}
