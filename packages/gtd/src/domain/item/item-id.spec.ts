import { ItemId } from './item-id.ts';
import { describe, expect, it } from 'vitest';

export const getValidItemId = (itemId = 'any-id'): ItemId => {
    const idOrErr = ItemId.create(itemId);

    if (idOrErr.isErr) throw new Error('invalid id');

    return idOrErr.value;
};

describe('ItemId', () => {
    it('should create a valid item id', () => {
        const id = 'any-id';

        const sut = getValidItemId(id);

        expect(sut.toValue()).toBe(id);
    });
});
