import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoDB: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "peruperu";
  mongoDB = await MongoMemoryServer.create();
  const uri = mongoDB.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});
