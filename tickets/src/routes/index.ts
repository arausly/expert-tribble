import { requireAuth, validateRequest } from "@dtut/common";
import express from "express";
import { body } from "express-validator";
import {
  createNewTicket,
  getAllTickets,
  getTicket,
  updateTicket,
} from "../controllers/tickers.controller";

const router = express.Router();

const ticketValidation = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price")
    .isFloat({
      gt: 0,
    })
    .withMessage("Price must be greater than zero"),
];

router
  .route("/tickets")
  .get(getAllTickets)
  .post(requireAuth, ticketValidation, validateRequest, createNewTicket);

router
  .route("/tickets/:id")
  .put(requireAuth, ticketValidation, updateTicket)
  .get(getTicket);

export default router;
