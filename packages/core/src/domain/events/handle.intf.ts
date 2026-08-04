
import { type IDomainEvent } from "./domain-event.intf.ts";

export interface IHandle<T extends IDomainEvent> {
  setupSubscriptions(): void;
}
