import { ExpirationCompleteEvent, Listener, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order-model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-pub";
import { QUEUE_GROUP_NAME } from "./constants";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: ExpirationCompleteEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order could not be found");

    order.set({
      status: OrderStatus.CancelledExpired,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  };
}
