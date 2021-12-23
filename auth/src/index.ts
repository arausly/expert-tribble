import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY not defined");
  if (!process.env.MONGO_URI)
    throw new Error("Database connection url not available");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("\x1b[35m%s\x1b[0m", "connected to auth db successfully");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("\x1b[32m%s\x1b[0m", "App is 🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️ on port 3000");
  });
};

start();
