import { type Result, ok, err } from '@rd/core/result';
import { againstNullOrUndefinedBulk, type GuardErr } from '@rd/core/guard';
import { Entity } from '@rd/core/domain';
import type { ItemId } from './item-id.ts';
import type { ItemContent } from './item-content.vo.ts';
import type { ErrBase } from '@rd/core/error';

export type ItemProps = {
    content: ItemContent;
    clarifiedContent: ItemContent;
};

export const ItemErrCode = {
    ItemContentEmpty: 'item.content-empty',
    ItemAlreadyClarified: 'item.already-clarified',
};

export type ItemErrCode = (typeof ItemErrCode)[keyof typeof ItemErrCode];
export type ItemErr = ErrBase<ItemErrCode>;

const itemContentEmptyErr = (id: ItemId): ItemErr => ({
    code: ItemErrCode.ItemContentEmpty,
    message: `item ${id.toString()} cannot have empty content`,
});

const itemAlreadyClarifiedErr = (id: ItemId): ItemErr => ({
    code: ItemErrCode.ItemAlreadyClarified,
    message: `item ${id.toString()} is already clarified`,
});

export type ItemResult = Result<Item, GuardErr | ItemErr>;

export class Item extends Entity<ItemProps> {
    static create(props: ItemProps, id: ItemId): ItemResult {
        const guardResult = againstNullOrUndefinedBulk([
            { argument: id, argumentName: 'id' },
            { argument: props.content, argumentName: 'content' },
        ]);
        if (guardResult.isErr) {
            return err(guardResult.err);
        }

        if (props.content.isEmpty()) {
            return err(itemContentEmptyErr(id));
        }

        return ok(new Item(props, id));
    }

    private constructor(props: ItemProps, id: ItemId) {
        super(props, id);
    }

    get id(): ItemId {
        return this._id as ItemId;
    }

    get content(): ItemContent {
        return this.props.content;
    }

    get clarifiedContent(): ItemContent {
        return this.props.clarifiedContent;
    }

    isClarified(): boolean {
        return this.clarifiedContent.isNotEmpty();
    }

    clarify(newClarifiedContent: ItemContent): Result<true, ItemErr> {
        if (this.isClarified()) return err(itemAlreadyClarifiedErr(this.id));

        if (newClarifiedContent.isEmpty())
            return err(itemContentEmptyErr(this.id));

        this.props.clarifiedContent = newClarifiedContent;
        return ok(true);
    }
}
