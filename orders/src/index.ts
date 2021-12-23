import mongoose from "mongoose";
import { app } from "./app";
import natsWrapper from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import PaymentCreatedListener from "./events/listeners/payment-created-listener";

const dependencies = [
  {
    key: "JWT_KEY",
    required: true,
  },
  {
    key: "MONGO_URI",
    required: true,
  },
  {
    key: "CLUSTER_ID",
    required: true,
  },
  {
    key: "NATS_URL",
    required: true,
  },
  {
    key: "CLIENT_ID",
    required: true,
  },
];

const start = async () => {
  dependencies.forEach(({ key }) => {
    if (!process.env[key]) throw new Error(`${key} is not defined`);
  });

  try {
    await natsWrapper.connect(
      process.env.CLUSTER_ID!,
      process.env.CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("\x1b[31m%s\x1b[0m", "Nats connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("\x1b[35m%s\x1b[0m", "connected to orders db successfully");
  } catch (err) {
    console.error(err);
  }
  app.listen(4000, () => {
    console.log("\x1b[32m%s\x1b[0m", "App is 🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️ on port 4000");
  });
};

start();
