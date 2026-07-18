import type { IDomainEvent } from './domain-event.intf.ts';
import { AggregateRoot } from '../aggregate-root.ts';
import type { AnyIdentifier } from '../identifier.ts';

type Callback = (event: IDomainEvent) => void;

export class DomainEvents {
    private static handlersMap = new Map<string, Array<Callback>>();
    private static markedAggregates: AggregateRoot<unknown>[] = [];

    /**
     * @method markAggregateForDispatch
     * @static
     * @desc Called by aggregate root objects that have created domain
     * events to eventually be dispatched when the infrastructure commits
     * the unit of work.
     */

    public static markAggregateForDispatch(
        aggregate: AggregateRoot<unknown>,
    ): void {
        const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

        if (!aggregateFound) {
            this.markedAggregates.push(aggregate);
        }
    }

    private static dispatchAggregateEvents(
        aggregate: AggregateRoot<unknown>,
    ): void {
        aggregate.domainEvents.forEach((event: IDomainEvent) =>
            this.dispatch(event),
        );
    }

    private static removeAggregateFromMarkedDispatchList(
        aggregate: AggregateRoot<unknown>,
    ): void {
        const index = this.markedAggregates.findIndex((a) =>
            a.equals(aggregate),
        );
        this.markedAggregates.splice(index, 1);
    }

    private static findMarkedAggregateByID(
        id: AnyIdentifier,
    ): AggregateRoot<unknown> | null {
        let found: AggregateRoot<unknown> | null = null;
        for (const aggregate of this.markedAggregates) {
            if (aggregate.id.equals(id)) {
                found = aggregate;
            }
        }

        return found;
    }

    public static dispatchEventsForAggregate(id: AnyIdentifier): void {
        const aggregate = this.findMarkedAggregateByID(id);

        if (aggregate) {
            this.dispatchAggregateEvents(aggregate);
            aggregate.clearEvents();
            this.removeAggregateFromMarkedDispatchList(aggregate);
        }
    }

    public static register(callback: Callback, eventClassName: string): void {
        if (!this.handlersMap.has(eventClassName)) {
            this.handlersMap.set(eventClassName, []);
        }

        const handlers = this.handlersMap.get(eventClassName) || [];
        this.handlersMap.set(eventClassName, [...handlers, callback]);
    }

    public static clearHandlers(): void {
        this.handlersMap.clear();
    }

    public static clearMarkedAggregates(): void {
        this.markedAggregates = [];
    }

    private static dispatch(event: IDomainEvent): void {
        const eventClassName: string = event.constructor.name;

        if (this.handlersMap.has(eventClassName)) {
            const handlers: Callback[] =
                this.handlersMap.get(eventClassName) || [];
            for (const handler of handlers) {
                handler(event);
            }
        }
    }
}
