import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@dtut/common";
import { Request, Response } from "express";
import { TicketPublisher } from "../events/publishers/ticker-created-publisher";
import { TicketUpdatePublisher } from "../events/publishers/ticket-update-pub";
import { Ticket } from "../models/ticket";
import natsWrapper from "../nats-wrapper";

export const createNewTicket = async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    price,
    title,
    userId: req.currentUser!.id,
  });

  await ticket.save();
  try {
    await new TicketPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
  } catch (err) {
    console.error("CREATE_PUBLISHER ==>", err);
  }

  res.status(201).send(ticket);
};

export const getTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
};

export const getAllTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.status(200).send(tickets);
};

export const updateTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  //has been reserved
  if (ticket.orderId) {
    throw new BadRequestError("Cannot edit a reserved ticket.");
  }

  ticket.set({
    price: req.body.price,
    title: req.body.title,
  });
  await ticket.save();

  try {
    new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
  } catch (err) {
    console.error("UPDATE_PUBLISHER ==>", err);
  }

  res.send(ticket);
};
