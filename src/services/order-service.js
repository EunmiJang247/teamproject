import { orderModel, userModel } from "../db";


class OrderService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(orderModel, userModel) {
    this.orderModel = orderModel;
    this.userModel = userModel;
  }

  async checkIfYourAreAdmin(userId){
    //쿠키에서 token가져와 관리자인지 판별
    const user = await this.userModel.findById(userId)
    const usersRole = user.role;
    if(usersRole !== "admin"){
      throw new Error("어드민 사용자가 아닙니다")
    }
  }

  async checkIfOrderProcessedBeforeDelivery(orderId){
    const order = await this.orderModel.findByOrderId(orderId)
    const currentdeliverystatus = order.deliverystatus;
    
    if(currentdeliverystatus === "상품발송" || 
    currentdeliverystatus === "배송중" || 
    currentdeliverystatus === "배송완료"
    ){throw new Error("배송이 시작되어 정보를 변경할수없어요")}
  }

  async checkIfOrderMakeUserAndRequestUserIsSame(orderId, userId){
    const result = await this.orderModel.findByOrderId(orderId)
    if(String(result.personwhoordered) !== userId){
      throw new Error("주문한 사람만 order를 삭제할 수 있습니다")
    }
  }

  // 신규주문
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }

  //관리자 배송현황변경
  async setAdminOrder(userId, orderId, toUpdate){
    //관리자가 맞는지 확인
    await this.checkIfYourAreAdmin(userId);

    const changedeliverystatus = await this.orderModel.adminUpdate({
      orderId,
      update : toUpdate,
    });
    return changedeliverystatus;
  }

  //user 주문수정
  async setUserOrder(orderId, toUpdate){
    //배송되기 전단계인지 체크
    await this.checkIfOrderProcessedBeforeDelivery(orderId);

    const changeinfostatus = await this.orderModel.usersUpdate({
      orderId,
      update : toUpdate,
    });
    return changeinfostatus;
  }

  //내가 주문한 상품들 보기
  async chekmyorders(userId){
    const myorders = await this.orderModel.findByUserId(userId);
    return myorders;
  }

  //내가 주문한 상품들 보기
  async chekallorders(userId){
    await this.checkIfYourAreAdmin(userId);
    const allorders = await this.orderModel.findAllOrders();
    return allorders;
  }

  async deleteOrderByUser(orderId, userId){
    await this.checkIfOrderMakeUserAndRequestUserIsSame(orderId, userId);
    const deleteorderbyUser = await this.orderModel.deleteThisOrder(orderId);
    return deleteorderbyUser;
  }
  async deleteOrderByAdmin(orderId, userId){
    await this.checkIfYourAreAdmin(userId);
    const deleteorderbyAdmin = await this.orderModel.deleteThisOrder(orderId);
    return deleteorderbyAdmin;
  }
}

const orderService = new OrderService(orderModel, userModel);
export { orderService };
