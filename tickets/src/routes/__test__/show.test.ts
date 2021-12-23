import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

describe("Show Ticket", () => {
  it("returns 404 for tickets not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).expect(404);
  });

  it("returns ticket for valid ticket", async () => {
    const newTicket = {
      price: 32,
      title: "daniel",
    };

    const response: any = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send(newTicket)
      .expect(201);

    const ticket: any = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send({});

    expect(ticket.price).toBe(response.price);
    expect(ticket.title).toBe(response.title);
  });
});
