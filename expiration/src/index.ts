import OrderCreatedListener from "./events/listeners/order-created-listener";
import natsWrapper from "./nats-wrapper";

const dependencies = [
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

    new OrderCreatedListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

start();
