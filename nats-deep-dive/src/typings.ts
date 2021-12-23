export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
}

export interface Event {
  subject: Subjects;
  data: any;
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
