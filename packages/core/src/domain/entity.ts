import type { IdentifierAny } from './identifier.ts';

const isEntity = (v: unknown): v is Entity<unknown> => {
    return v instanceof Entity;
};

export abstract class Entity<T> {
    protected readonly _id: IdentifierAny;
    // public readonly created: Temporal.ZonedDateTime;
    public readonly props: T;

    constructor(props: T, id: IdentifierAny) {
        this._id = id;
        this.props = props;
        // this.created = Temporal.Now.zonedDateTimeISO()
    }

    public equals(object?: Entity<T>): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id.equals(object._id);
    }
}
