import { Listener, OrderCreated, Subjects } from "@dtut/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./constants";

export default class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: OrderCreated["data"], msg: Message) => {
    const delay = new Date(data.expiresAt).getTime() - Date.now();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  };
}
