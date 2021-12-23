import Queue from "bull";
import ExpirationCompletePublisher from "../events/publishers/expiration-complete-publisher";
import natsWrapper from "../nats-wrapper";

interface QueuePayload {
  orderId: string;
}

export const expirationQueue = new Queue<QueuePayload>("order-expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
