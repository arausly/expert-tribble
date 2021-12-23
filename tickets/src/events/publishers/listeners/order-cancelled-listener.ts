import { Listener, OrderCancelled, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatePublisher } from "../ticket-update-pub";
import { GROUP_QUEUE_NAME } from "./utils";

export default class OrderCancelledListener extends Listener<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = GROUP_QUEUE_NAME;
  onMessage = async (data: OrderCancelled["data"], msg: Message) => {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("could not cancel reservation");

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatePublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
    });

    msg.ack();
  };
}
