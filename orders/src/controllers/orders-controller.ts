import { Request, Response } from "express";
import { Ticket } from "../models/ticket-model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@dtut/common";
import { Order, OrderStatus } from "../models/order-model";
import { OrderCreatedPublisher } from "../events/publishers/order-created-pub";
import natsWrapper from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-pub";

const newOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }
  //ticket is reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError("Ticket is reserved");
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + 15 * 60);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  await order.save();

  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(201).send(order);
};

const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");
  res.status(200).send(orders);
};

const showOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  res.send(order);
};

const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) throw new NotFoundError();

  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  order.status = OrderStatus.CancelledByUser;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
};

export default {
  getOrders,
  showOrder,
  deleteOrder,
  newOrder,
};
