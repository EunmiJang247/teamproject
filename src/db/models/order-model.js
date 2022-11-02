import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewUser = await Order.create(orderInfo);
    return createdNewUser;
  }
}

const orderModel = new OrderModel();

export { orderModel };
