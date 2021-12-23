import request from "supertest";
import { app } from "../../app";

describe("SignUp", () => {
  const SIGNUP_PATH = "/api/users/signup";
  it("creates users successfully", async () => {
    return request(app)
      .post(SIGNUP_PATH)
      .send({
        email: "test@gmail.com",
        password: "newPassword",
      })
      .expect(201);
  });

  it("should return bad request status code for invalid input", async () => {
    await Promise.all([
      request(app)
        .post(SIGNUP_PATH)
        .send({
          email: "invalid_email.com",
          password: "something",
        })
        .expect(400),
      request(app)
        .post(SIGNUP_PATH)
        .send({
          email: "valid@gmail.com",
          password: "!",
        })
        .expect(400),
      request(app).post(SIGNUP_PATH).send({}).expect(400),
    ]);
  });

  it("should disallow same email signups", async () => {
    await request(app)
      .post(SIGNUP_PATH)
      .send({
        email: "test@gmail.com",
        password: "newPassword",
      })
      .expect(201);

    await request(app)
      .post(SIGNUP_PATH)
      .send({
        email: "test@gmail.com",
        password: "newPassword",
      })
      .expect(400);
  });

  it("should set cookie header after successful signup", async () => {
    const response = await request(app).post(SIGNUP_PATH).send({
      email: "test@gmail.com",
      password: "newPassword",
    });
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
