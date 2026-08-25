import { describe, expect, it } from 'vitest';
import {
    Item,
    ItemErrCode,
    type ItemErr,
    type ItemProps,
} from './item.entity.ts';
import { getItemContent } from './item-content.vo.spec.ts';
import { getValidItemId } from './item-id.spec.ts';
import type { Result } from '@rd/core/result';
import { assertIsErr, assertIsOk } from '@rd/core/test';

const getValidItem = (props?: ItemProps): Item => {
    const content = getItemContent();
    const itemProps: ItemProps = props || {
        content,
        clarifiedContent: getItemContent(''),
    };
    const itemId = getValidItemId();
    const itemOrErr = Item.create(itemProps, itemId);

    if (itemOrErr.isErr) throw new Error(itemOrErr.err.message);

    return itemOrErr.value;
};

describe('item.entity', () => {
    describe('create', () => {
        it('should not create an item with empty content', () => {
            const sut = Item.create(
                {
                    content: getItemContent(''),
                    clarifiedContent: getItemContent(),
                },
                getValidItemId(),
            );

            assertIsErr(sut);
            expect(sut.err.code).toBe(ItemErrCode.ItemContentEmpty);
        });

        it('should create item for valid props and id', () => {
            const content = getItemContent('Some text to capture');

            const sut = Item.create(
                {
                    content,
                    clarifiedContent: getItemContent(),
                },
                getValidItemId(),
            );

            assertIsOk(sut);
            expect(sut.value.content.equals(content)).toBe(true);
        });
    });

    describe('clarify', () => {
        it('should not clarify an already clarified item ', () => {
            const clarifiedContent = getItemContent('any content');
            const item = getValidItem({
                content: getItemContent(),
                clarifiedContent,
            });

            const sut: Result<true, ItemErr> = item.clarify(clarifiedContent);

            assertIsErr(sut);
            expect(sut.isErr).toBe(true);
            expect(sut.err.code).toBe(ItemErrCode.ItemAlreadyClarified);
        });

        it('should return err for empty clarified content', () => {
            const newClarifiedContent = getItemContent('');

            const itemSut = getValidItem();
            const clarifySut = itemSut.clarify(newClarifiedContent);

            assertIsErr(clarifySut);
            expect(clarifySut.isErr).toBe(true);
            expect(clarifySut.err.code).toBe(ItemErrCode.ItemContentEmpty);
            expect(itemSut.isClarified()).toBe(false);
        });

        it('should clarify an unclarified item', () => {
            const newClarifiedContent = getItemContent();

            const itemSut = getValidItem();
            const clarifySut = itemSut.clarify(newClarifiedContent);

            assertIsOk(clarifySut);
            expect(clarifySut.isOk).toBe(true);
            expect(itemSut.isClarified()).toBe(true);
            expect(itemSut.clarifiedContent.equals(newClarifiedContent)).toBe(
                true,
            );
        });
    });
});
