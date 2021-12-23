import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketListener } from "./TicketListener";

console.clear();

const clientID = randomBytes(4).toString("hex");
const client = nats.connect("ticketing", "random", {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log(`client listener: ${clientID} is shutting down`);
    process.exit();
  });

  new TicketListener(client).listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
