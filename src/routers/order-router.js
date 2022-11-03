import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from "../services";
import { loginRequired } from "../middlewares";

const orderRouter = Router();

orderRouter.get("/chekmyorders", loginRequired , async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    console.log(userId)

  } catch (error) {
    next(error);
  }
});

orderRouter.post("/", loginRequired ,async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const userId = req.currentUserId;
    const cart = req.body.cart;
    const address = req.body.address;
    const recipientname = req.body.recipientname;
    const recipientphonenumber = req.body.recipientphonenumber;

    console.log(userId)

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      personwhoordered : userId,
      cart,
      address,
      recipientname,
      recipientphonenumber
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch("/admin/:orderId", loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const {orderId} = req.params;
    const deliverystatus = req.body.deliverystatus;
    
    const toUpdate = {
      ...(deliverystatus && { deliverystatus }),
    };
    
    const updatedOrderInfoByAdmin = await orderService.setAdminOrder(userId, orderId, toUpdate);
    res.status(201).json(updatedOrderInfoByAdmin);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch("/users/:orderId", loginRequired, async (req, res, next) => {
  try {
    const {orderId} = req.params;

    const address = req.body.address;
    const recipientname = req.body.recipientname;
    const recipientphonenumber = req.body.recipientphonenumber;
    
    const toUpdate = {
      ...(address && { address }),
      ...(recipientname && { recipientname }),
      ...(recipientphonenumber && { recipientphonenumber }),
    };
    
    const updatedOrderInfoByUser = await orderService.setUserOrder(orderId, toUpdate);
    res.status(201).json(updatedOrderInfoByUser);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
