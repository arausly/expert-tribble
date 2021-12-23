import { PaymentCreatedEvent, Publisher, Subjects } from "@dtut/common";

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
