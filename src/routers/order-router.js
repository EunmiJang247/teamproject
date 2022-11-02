import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from "../services";

const orderRouter = Router();

orderRouter.get("/", async (req, res, next) => {
  try {
    console.log('hello')
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const cart = req.body.cart;
    const address = req.body.address;
    const recipientname = req.body.recipientname;
    const recipientphonenumber = req.body.recipientphonenumber;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
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

export { orderRouter };
