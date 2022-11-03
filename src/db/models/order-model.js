import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    console.log(orderInfo)
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }
  async findByOrderId(orderId) {
    const order = await Order.findOne({ _id: orderId });
    return order;
  }
  async adminUpdate({ orderId, update }){
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedeliveryStatus = await Order.findOneAndUpdate(filter, update, option);
    return updatedeliveryStatus;
  }
  async usersUpdate({ orderId, update }){
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedeliveryStatus = await Order.findOneAndUpdate(filter, update, option);
    return updatedeliveryStatus;
  }
}

const orderModel = new OrderModel();

export { orderModel };
