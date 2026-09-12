import { type IdentifierAny } from '../identifier.ts';

export interface IDomainEvent {
    dateTimeOccurred: Date;
    getAggregateId(): IdentifierAny;
}
