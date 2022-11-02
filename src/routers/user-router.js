import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { userService } from "../services";

const userRouter = Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    // req (request)의 body 에서 데이터 가져오기
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      passwordConfirm
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.cookie('userToken', userToken.token).status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get("/userlist", loginRequired, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
userRouter.patch("/:userId", loginRequired, async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // params로부터 id를 가져옴
      const {userId} = req.params;

      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const fullName = req.body.fullName;
      const password = req.body.password;
      const email = req.body.email;

      // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
      const currentPassword = req.body.currentPassword;

      // currentPassword 없을 시, 진행 불가
      if (!currentPassword) {
        throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
      }

      const userInfoRequired = { userId, currentPassword };

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(fullName && { fullName }),
        ...(password && { password }),
        ...(email && { email }),
      };

      // 사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUser(
        userInfoRequired,
        toUpdate
      );
      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/logout", async function (req, res, next) {
  try {
    // jwt 토큰을 제거함
    res.clearCookie('user');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", loginRequired, async function (req, res, next) {
  try {
    const {userId} = req.params;
    const myinfo = await userService.getMyinfo(userId);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200);
    res.json(myinfo);
  } catch (error) {
    next(error);
  }
});

// userRouter.delete("/:userId", loginRequired, async function (req, res, next) {
  userRouter.delete("/:userId", async function (req, res, next) {
  try {
    const {userId} = req.params;
    const deletedInfo = await userService.deleteMyinfo(userId);

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    // res.status(200).json(myinfo);
  } catch (error) {
    next(error);
  }
});
export { userRouter };