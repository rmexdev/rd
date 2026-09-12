import { describe, expect, it } from 'vitest';
import { ItemContent } from './item-content.vo.ts';

export const getItemContent = (content = 'some content'): ItemContent => {
    return ItemContent.create({ value: content });
};

describe('ItemContent.vo', () => {
    it.each(['', 'any content'])(
        'should create for empty and non-empty strings',
        (content: string) => {
            const sut: ItemContent = getItemContent(content);

            expect(sut.value).toBe(content);
        },
    );

    it.each(['', '   '])(
        'should return isEmpty true for empty strings',
        (content: string) => {
            const itemContent: ItemContent = getItemContent(content);

            const sut = itemContent.isEmpty();

            expect(sut).toBe(true);
        },
    );

    it('should return isNotEmpty false for non empty strings', () => {
        const itemContent: ItemContent = getItemContent();

        const sut = itemContent.isNotEmpty();

        expect(sut).toBe(true);
    });
});
