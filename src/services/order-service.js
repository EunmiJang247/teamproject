import { orderModel } from "../db";

class OrderService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  passwordandpasswordconfimSameCheck(password, passwordConfirm){
    if(password !== passwordConfirm){
      throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다");
    }
  }

  // 신규주문
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }
}

const orderService = new OrderService(orderModel);
export { orderService };
