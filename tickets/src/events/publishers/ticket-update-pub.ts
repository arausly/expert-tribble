import { Publisher, Subjects, TicketUpdatedEvent } from "@dtut/common";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
