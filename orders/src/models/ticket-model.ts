import mongoose, { Schema } from "mongoose";
import { Order, OrderStatus } from "./order-model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: string;
  price: number;
  title: string;
}

export interface TicketDoc extends mongoose.Document {
  price: number;
  title: string;
  version: number;
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attrs: TicketAttrs) => TicketDoc;
  findByEvent: (event: {
    id: string;
    version: number;
  }) => Promise<TicketDoc | null>;
}

const ticketSchema = new Schema(
  {
    price: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event) =>
  Ticket.findOne({ _id: event.id, version: event.version - 1 });

ticketSchema.statics.build = (attrs: TicketAttrs) =>
  new Ticket({
    _id: attrs.id,
    price: attrs.price,
    title: attrs.title,
  });

ticketSchema.methods.isReserved = async function () {
  const reservedOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
        OrderStatus.Created,
      ],
    },
  });

  return !!reservedOrder;
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
