import { OrderCancelled, Listener, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import Order, { OrderStatus } from "../../models/order-model";
import { queueGroupName } from "./constants";

export default class OrderCancelledListener extends Listener<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  onMessage = async (data: OrderCancelled["data"], msg: Message) => {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) throw new Error("failed to find order");

    order.set({ status: OrderStatus.CancelledByUser });
    await order.save();

    msg.ack();
  };
}
