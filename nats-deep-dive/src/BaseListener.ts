import { Message, Stan } from "node-nats-streaming";
import { Event } from "./typings";

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage: (data: T["data"], msg: Message) => void;
  protected ackWait: number = 5 * 1000;

  constructor(private client: Stan) {}

  subscriptionOptions = () =>
    this.client
      .subscriptionOptions()
      .setAckWait(this.ackWait)
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);

  listen = () => {
    const subscription = this.client.subscribe(
      "ticket:updated",
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        "\x1b[35m%s\x1b[0m",
        `Message received: ${this.subject} / ${this.queueGroupName}`
      );
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
      msg.ack();
    });
  };

  parseMessage = (msg: Message) => {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  };
}

export default Listener;
