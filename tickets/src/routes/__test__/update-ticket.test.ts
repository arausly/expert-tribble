import request from "supertest";
import { app } from "../../app";
import { createNewTicket, newTestId } from "../../test/setup";
import natsWrapper from "../../nats-wrapper";

describe("Update Ticket", () => {
  it("returns 404 if ticket id doesn't exist", async () => {
    await request(app)
      .put(`/api/tickets/${newTestId()}`)
      .set("Cookie", global.signIn())
      .send({})
      .expect(404);
  });
  it("returns 401 for unauthorized user", async () => {
    const response = await createNewTicket();
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signIn())
      .send({
        title: "sdkds",
        price: 30,
      })
      .expect(401);

    const newResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signIn());

    expect(response.body).toStrictEqual(newResponse.body);
  });
  it("returns 401 for unauthenticated user", async () => {
    await request(app).put(`/api/tickets/${newTestId()}`).send({}).expect(401);
  });
  it("returns 400, when a user provides an invalid title or price", async () => {
    const response = await createNewTicket();
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signIn())
      .send({
        title: "sdkds",
      })
      .expect(401);
  });
  it("updates the ticket successfully", async () => {
    const cookie = global.signIn();
    const response = await request(app)
      .post("/api/tickets")
      .send({
        title: "newTicket",
        price: 20,
      })
      .set("Cookie", cookie);
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title: "sdkdsHJJJH",
        price: 20.0,
      })
      .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
