import { Message } from "node-nats-streaming";
import Listener from "./BaseListener";
import { Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "./typings";

export class TicketListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "";
  onMessage = (data: TicketCreatedEvent["data"], msg: Message) => {
    console.log("Received Event:", data);
  };
}
