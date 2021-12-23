import { Router } from "express";
import { requireAuth, validateRequest } from "@dtut/common";
import { body } from "express-validator";
import { newCharge } from "../controllers/new_charge-controller";

const router = Router();

router
  .route("/payments")
  .post(
    requireAuth,
    [body("token").notEmpty(), body("orderId").notEmpty()],
    validateRequest,
    newCharge
  );

export default router;
