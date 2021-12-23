import { Router } from "express";
import orderController from "../controllers/orders-controller";
import { requireAuth, validateRequest } from "@dtut/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = Router();

router
  .route("/orders")
  .post(
    requireAuth,
    [
      body("ticketId")
        .not()
        .isEmpty()
        .withMessage("Please provide ticketId")
        .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId))
        .withMessage("The ticket id provided is an invalid id"),
    ],
    validateRequest,
    orderController.newOrder
  )
  .get(requireAuth, orderController.getOrders);

router
  .route("/orders/:id")
  .get(orderController.showOrder)
  .delete(orderController.deleteOrder);

export default router;
