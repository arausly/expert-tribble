import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "@dtut/common";
import { TicketDoc } from "./ticket-model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (order: OrderAttrs) => OrderDoc;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (order: OrderAttrs) => new Order(order);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };
