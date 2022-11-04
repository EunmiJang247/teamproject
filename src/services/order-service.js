import { orderModel, userModel } from "../db";


class OrderService {
  constructor(orderModel, userModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
  }

  async #checkIfYourAreAdmin(userId){
    const user = await this.userModel.findById(userId)
    const usersRole = user.role;
    if(usersRole !== "admin"){
      throw new Error("어드민 사용자가 아닙니다")
    }
  }

  async #checkIfOrderProcessedBeforeDelivery(orderId){
    const order = await this.orderModel.findByOrderId(orderId)
    const currentdeliverystatus = order.deliverystatus;
    
    if(currentdeliverystatus === "상품발송" || 
    currentdeliverystatus === "배송중" || 
    currentdeliverystatus === "배송완료"
    ){throw new Error("배송이 시작되어 정보를 변경할수없어요")}
  }

  async #checkIfOrderMakeUserAndRequestUserIsSame(orderId, userId){
    const result = await this.orderModel.findByOrderId(orderId)
    if(String(result.personwhoordered) !== userId){
      throw new Error("주문한 사람만 order를 삭제 / 변경을 진행할 수 있습니다")
    }
  }

  async #checkBeforeDeliveryAndOrderIdIsSame(userId, orderId){
    await this.#checkIfOrderProcessedBeforeDelivery(orderId);
    await this.#checkIfOrderMakeUserAndRequestUserIsSame(orderId, userId);
  }

//신규주문
  async addOrder(orderInfo) {
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }

//관리자가 배송정보를 수정
  async setAdminOrder(userId, orderId, toUpdate){
    await this.#checkIfYourAreAdmin(userId);

    const changedeliverystatus = await this.orderModel.adminUpdate({
      orderId,
      update : toUpdate,
    });
    return changedeliverystatus;
  }

  //일반 user가 정보를 변경(주소, 받는사람, 받는사람번호)
  async setUserOrder(orderId, userId, toUpdate){
    await this.#checkBeforeDeliveryAndOrderIdIsSame(userId, orderId);

    const changeinfostatus = await this.orderModel.usersUpdate({
      orderId,
      update : toUpdate,
    });
    return changeinfostatus;
  }

  //내주문리스트보기
  async chekmyorders(userId){
    const myorders = await this.orderModel.findByUserId(userId);
    return myorders;
  }

  //관리자가 모든주문보기
  async chekallorders(userId){
    await this.#checkIfYourAreAdmin(userId);
    const allorders = await this.orderModel.findAllOrders();
    return allorders;
  }

  //일반유저가 주문삭제
  async deleteOrderByUser(orderId, userId){
    await this.#checkIfOrderMakeUserAndRequestUserIsSame(orderId, userId);
    const deleteorderbyUser = await this.orderModel.deleteThisOrder(orderId);
    return deleteorderbyUser;
  }

  //관리자가 주문삭제
  async deleteOrderByAdmin(orderId, userId){
    await this.#checkIfYourAreAdmin(userId);
    const deleteorderbyAdmin = await this.orderModel.deleteThisOrder(orderId);
    return deleteorderbyAdmin;
  }
}

const orderService = new OrderService(orderModel, userModel);
export { orderService };
