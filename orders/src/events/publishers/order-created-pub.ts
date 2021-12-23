import { Publisher, OrderCreated, Subjects } from "@dtut/common";

export class OrderCreatedPublisher extends Publisher<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
