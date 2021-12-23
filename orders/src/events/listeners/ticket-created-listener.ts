import { Listener, Subjects, TicketCreatedEvent } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";
import { QUEUE_GROUP_NAME } from "./constants";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: TicketCreatedEvent["data"], msg: Message) => {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  };
}
