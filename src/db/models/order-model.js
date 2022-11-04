import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
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
  async findByUserId(userId){
    const filter = { personwhoordered : userId };
    const findByUserIdResult = await Order.find(filter);
    return findByUserIdResult;
  }
  async findAllOrders(){
    const findAllOrderList = await Order.find();
    return findAllOrderList;
  }
  async deleteThisOrder(orderId){
    const filter = { _id : orderId };
    const deleteThisorder = await Order.deleteOne(filter)
    return deleteThisorder;
  }
}

const orderModel = new OrderModel();

export { orderModel };
