import { OrderCreated, Listener, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import Order from "../../models/order-model";
import { queueGroupName } from "./constants";

export default class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: OrderCreated["data"], msg: Message) => {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      price: data.ticket.price,
      version: data.version,
      status: data.status,
    });

    await order.save();

    msg.ack();
  };
}
