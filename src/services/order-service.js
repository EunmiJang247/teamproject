// import { orderModel } from "../db";

class OrderService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  // constructor(orderModel) {
  //   this.orderModel = orderModel;
  // }

//   passwordandpasswordconfimSameCheck(password, passwordConfirm){
//     if(password !== passwordConfirm){
//       throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다");
//     }
//   }

  // 신규주문
  async addOrder(orderInfo) {
    console.log("hey")
    // 객체 destructuring
    // const { email, fullName, password, passwordConfirm } = userInfo;

    // // 이메일 중복 확인
    // const user = await this.userModel.findByEmail(email);
    // if (user) {
    //   throw new Error("이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.");
    // }

    // // 이메일 중복은 이제 아니므로, 이메일 형식 확인.
    // this.eamilFormCheck(email)

    // //입력한 비밀번호와 비밀번호 확인 부분이 일치하는지 확인.
    // this.passwordandpasswordconfimSameCheck(password, passwordConfirm)

    // // 회원가입을 진행함 우선 비밀번호 해쉬화(암호화)
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUserInfo = { fullName, email, password: hashedPassword };

    // // db에 저장
    // const createdNewUser = await this.userModel.create(newUserInfo);
    // return createdNewUser;
  }
}

// const OrderService = new OrderService(orderModel);

// export { OrderService };
