import { Stan } from "node-nats-streaming";
import { Event } from "./typings";

abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  constructor(private client: Stan) {}

  publish = (data: T["data"]): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log(
          "\x1b[32m%s\x1b[0m",
          `Event has been published to ${this.subject}`
        );
        resolve();
      });
    });
  };
}

export default Publisher;
