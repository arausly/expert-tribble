import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  function signIn(): string;
}

// jest.mock("../nats-wrapper", () =>
//   jest.requireActual("../__mocks__/nats-wrapper")
// );

jest.mock("../nats-wrapper");

let mongoDB: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "peruperu";
  // allow self-signed certificates
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongoDB = await MongoMemoryServer.create();
  const uri = mongoDB.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});

global.signIn = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "absurd.test@gmail.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = JSON.stringify({ token });
  const base64 = Buffer.from(session).toString("base64");

  return `express:sess=${base64}`;
};

export const createNewTicket = () =>
  request(app)
    .post("/api/tickets")
    .send({
      title: "newTicket",
      price: 20,
    })
    .set("Cookie", global.signIn());

export const newTestId = () => new mongoose.Types.ObjectId().toHexString();
