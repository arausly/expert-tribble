import { Listener, PaymentCreatedEvent, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order-model";
import { QUEUE_GROUP_NAME } from "./constants";

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  onMessage = async (data: PaymentCreatedEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Couldn't find completed order");

    order.set({
      status: OrderStatus.Completed,
    });
    await order.save();

    msg.ack();
  };
}
