import { ValueObject } from '@rd/core/domain';

export type ItemContentProps = {
    value: string;
};

export class ItemContent extends ValueObject<ItemContentProps> {
    static create(props: ItemContentProps): ItemContent {
        return new ItemContent(props);
    }

    private constructor(props: ItemContentProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    isEmpty(): boolean {
        return this.value.trim() === '';
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }
}
