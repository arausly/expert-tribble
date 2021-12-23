import nats from "node-nats-streaming";
import { TicketPublisher } from "../../common/src/events/TicketPublisher";

console.clear();
const client = nats.connect("ticketing", "world", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher is connected to NATS");

  try {
    await new TicketPublisher(client).publish({
      id: "djdsjhd",
      price: 42,
      title: "tony warp travelers",
    });
  } catch (err) {
    console.error(err);
  }
});
