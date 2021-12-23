import express, { json } from "express";
import { NotFoundError, errorHandler, currentUser } from "@dtut/common";
import cookieSession from "cookie-session";
import "express-async-errors";

import routes from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use("/api", routes);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
