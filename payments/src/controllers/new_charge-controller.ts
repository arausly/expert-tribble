import {
  BadRequestError,
  NotFoundError,
  OrderIsCancelled,
  NotAuthorizedError,
} from "@dtut/common";
import { Request, Response } from "express";
import PaymentCreatedPublisher from "../events/publishers/payment-creates-publisher";
import Order from "../models/order-model";
import Payment from "../models/payment-model";
import natsWrapper from "../nats-wrapper";
import { stripe } from "../stripe";

export const newCharge = async (req: Request, res: Response) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);

  //order doesn't exist
  if (!order) throw new NotFoundError();

  //order doesn't belong to existing user
  if (req.currentUser!.id !== order.userId) throw new NotAuthorizedError();

  //order has already being cancelled
  if (OrderIsCancelled(order.status))
    throw new BadRequestError("Order has been cancelled");

  const charge = await stripe.charges.create({
    amount: order.price * 100,
    source: token,
    currency: "usd",
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });
  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    orderId: payment.orderId,
    stripeId: payment.stripeId,
    version: payment.version,
  });

  res.send({ success: true });
};
