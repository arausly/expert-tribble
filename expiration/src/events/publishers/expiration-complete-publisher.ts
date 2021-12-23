import { ExpirationCompleteEvent, Publisher, Subjects } from "@dtut/common";

export default class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
