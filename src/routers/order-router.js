import { Router } from "express";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from "../services";
import { loginRequired } from "../middlewares";
import Utils from "../utils/utils";

const orderRouter = Router();

//신규주문
orderRouter.post("/", loginRequired ,async (req, res, next) => {
  try {
    Utils.isemptyObject(req.body)
    const userId = req.currentUserId;

    const newOrder = await orderService.addOrder({
      personwhoordered : userId,
      cart : req.body.cart,
      address : req.body.address,
      recipientname : req.body.recipientname,
      recipientphonenumber : req.body.recipientphonenumber,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//관리자가 배송정보를 수정
orderRouter.patch("/admin/:orderId", loginRequired, async (req, res, next) => {
  try {
    Utils.isemptyObject(req.body)
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

//일반 user가 정보를 변경
orderRouter.patch("/users/:orderId", loginRequired, async (req, res, next) => {
  try {
    Utils.isemptyObject(req.body)
    const userId = req.currentUserId;
    const {orderId} = req.params;

    const {address, recipientname, recipientphonenumber} = req.body;
    
    const toUpdate = {
      ...(address && { address }),
      ...(recipientname && { recipientname }),
      ...(recipientphonenumber && { recipientphonenumber }),
    };
    
    const updatedOrderInfoByUser = await orderService.setUserOrder(orderId, userId, toUpdate);
    res.status(201).json(updatedOrderInfoByUser);
  } catch (error) {
    next(error);
  }
});

//내주문리스트보기
orderRouter.get("/chekmyorders", loginRequired , async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const chekmyorders = await orderService.chekmyorders(userId);
    res.status(201).json(chekmyorders);
  } catch (error) {
    next(error);
  }
});

//관리자가 모든주문보기
orderRouter.get("/admin/allorders", loginRequired , async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const checkallorders = await orderService.chekallorders(userId);
    res.status(201).json(checkallorders);
  } catch (error) {
    next(error);
  }
});

//일반유저가 주문삭제
orderRouter.delete("/users/:orderId", loginRequired, async (req, res, next) => {
  try {
    const {orderId} = req.params;
    const userId = req.currentUserId;
    const deleteOrderByUser = await orderService.deleteOrderByUser(orderId, userId);
    res.status(201).json(deleteOrderByUser);
  } catch (error) {
    next(error);
  }
});

//관리자가 주문삭제
orderRouter.delete("/admin/:orderId", loginRequired, async (req, res, next) => {
  try {
    const {orderId} = req.params;
    const userId = req.currentUserId;
    const deleteOrderByAdmin = await orderService.deleteOrderByAdmin(orderId, userId);
    res.status(201).json(deleteOrderByAdmin);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
