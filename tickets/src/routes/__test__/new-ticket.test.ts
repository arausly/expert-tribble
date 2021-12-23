import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import natsWrapper from "../../nats-wrapper";

describe("New Ticket", () => {
  it("should create new ticket successfully for authenticated users only", async () => {
    await request(app)
      .post("/api/tickets")
      .send({ title: "something", price: 50 })
      .set("cookie", global.signIn())
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it("Should respond with an unauthorize status for unauthenticated users", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("should fail validation check for invalid payload", async () => {
    await request(app)
      .post("/api/tickets")
      .send({
        title: "",
        price: -5,
      })
      .set("cookie", global.signIn())
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .send({
        title: "",
        price: "$40",
      })
      .set("cookie", global.signIn())
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .send({
        title: "Draco",
        price: "",
      })
      .set("cookie", global.signIn())
      .expect(400);
  });

  it("Creates ticket for valid input", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    const newTicket = {
      title: "new ticket",
      price: 20,
    };

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send(newTicket)
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
    expect(tickets[0].price).toBe(newTicket.price);
    expect(tickets[0].title).toBe(newTicket.title);
  });
});
