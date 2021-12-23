import { Listener, Subjects, TicketUpdatedEvent } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket-model";
import { QUEUE_GROUP_NAME } from "./constants";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const { price, title } = data;
    const existingTicket = await Ticket.findByEvent(data);

    if (!existingTicket) {
      throw new Error("Could not find the ticket to update");
    }

    existingTicket.set({ price, title });

    await existingTicket.save();

    msg.ack();
  };
}
