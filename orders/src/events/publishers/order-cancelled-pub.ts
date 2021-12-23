import { Publisher, OrderCancelled, Subjects } from "@dtut/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
