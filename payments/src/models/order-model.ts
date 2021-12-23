import { OrderStatus } from "@dtut/common";
import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  userId: string;
  version: number;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  version: number;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
}

const orderSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    status: attrs.status,
    userId: attrs.userId,
    price: attrs.price,
  });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export default Order;
