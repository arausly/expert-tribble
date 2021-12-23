import { Publisher, Subjects, TicketCreatedEvent } from "@dtut/common";

export class TicketPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
