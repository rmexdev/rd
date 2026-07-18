
import { IDomainEvent } from "./domain-event.intf.ts";

export interface IHandle<IDomainEvent> {
  setupSubscriptions(): void;
}
