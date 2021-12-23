import mongoose from "mongoose";
import { app } from "./app";
import OrderCancelledListener from "./events/listeners/order-cancelled-listener";
import OrderCreatedListener from "./events/listeners/order-created-listener";
import natsWrapper from "./nats-wrapper";

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
  {
    key: "STRIPE_KEY",
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
