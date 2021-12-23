import request from "supertest";
import { app } from "../../app";
import { createNewTicket } from "../../test/setup";

it("can retrieve all the tickets", async () => {
  await createNewTicket();
  await createNewTicket();
  await createNewTicket();

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", global.signIn())
    .expect(200);

  expect(response.body.length).toBe(3);
});
