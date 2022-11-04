import { userModel } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  #emailFormCheck(email){
    let regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    let checkEmailForm = regex.test(email)
    if (!checkEmailForm) {
      throw new Error("이메일 형식에 맞지 않습니다.");
    }
    return email;
  }
  #passwordandpasswordconfimSameCheck(password, passwordConfirm){
    if(password !== passwordConfirm){
      throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다");
    }
  }

  async #getUserByEmailSafely(email) {
    const user = await this.userModel.findByEmail(email);
    return user;
  }

  async #getUserByEmail(email){
    const user = await this.#getUserByEmailSafely(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return user;
  }

  async #thisEmailIsAlreadyUsedCheck(email){
    const user = await this.#getUserByEmailSafely(email);
    if (user) {
      throw new Error("이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.");
    }
  }

  async #checkEmailRegister({email,password,passwordConfirm}){
    this.#thisEmailIsAlreadyUsedCheck(email)
    this.#emailFormCheck(email)
    this.#passwordandpasswordconfimSameCheck(password, passwordConfirm)
  }

  async #putUserInfoInDB({fullName, email, password}){
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = { fullName, email, password: hashedPassword };
    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  async #isUserHasCorrectPassword({user, password}) {
    const saltedPassword = await bcrypt.hash(password, 10);
    const isPasswordMatch = user.password === saltedPassword;
    return isPasswordMatch;
  }

  async #checkUserHasCorrectPassword({user, password}) {
    const isPasswordMatch = this.#isUserHasCorrectPassword({user, password});
    if (!isPasswordMatch) {
      throw new Error('비밀번호가 일치하지 않습니다');
    }
  }

  async #checkEmailLogin({email, password}) {
    const user = await this.#getUserByEmail(email);
    
    await this.#checkUserHasCorrectPassword({user, password});
  }

  async #generateToken({email}) {
    const user = await this.#getUserByEmail(email); 
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
    return token;
  }

  async #getUserByUseridSafely(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async #getUserByUserId(userId){
    const user = await this.#getUserByUseridSafely(userId);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return user;
  }

  
  async #makeHashedPassword({password}){
    const newPasswordHash = await bcrypt.hash(password, 10);
    return newPasswordHash;
  }

  async #makehashedPasswordToUpdate(toUpdate){
    const hashedPassword = await this.#makeHashedPassword({password : toUpdate.password})
    toUpdate.password = hashedPassword
    return toUpdate;
  }

  async #updateUser({userId, toUpdate}){
    const hashedToUpdate = await this.#makehashedPasswordToUpdate(toUpdate)
    const resultUser = await this.userModel.update({
      userId,
      update: hashedToUpdate,
    });
    return resultUser
  }

  async #checkUserPasswordSame({userId, currentPassword}){
    const user = await this.#getUserByUserId(userId);
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );
    
    if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }
  }

  async addUser(regiInfo) {
    await this.#checkEmailRegister({
      email: regiInfo.email,
      password: regiInfo.password,
      passwordConfirm : regiInfo.passwordConfirm,
    })
    const newUser = await this.#putUserInfoInDB({
      fullName: regiInfo.fullName,
      email: regiInfo.email,
      password: regiInfo.password,
    })
    return newUser;
  }

  async getUserToken(loginInfo) {
    await this.#checkEmailLogin({
      email: loginInfo.email,
      password: loginInfo.password,
    });
    const token = await this.#generateToken({
      email : loginInfo.email
    });
    return {token};
  }

  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  async setUser(userInfoRequired, toUpdate) {
    await this.#checkUserPasswordSame({
      userId : userInfoRequired.userId,
      currentPassword : userInfoRequired.currentPassword,
    });    
    const updatecomplete = await this.#updateUser({userId : userInfoRequired.userId, toUpdate:toUpdate})
    return updatecomplete;
  }

  async getMyinfo(userId) {
    let user = await this.userModel.findById({_id:userId});
    return user;    
  }

  async deleteMyinfo(userId) {
    let user = await this.userModel.delete(userId);
    return user;
  }
}

const userService = new UserService(userModel);
export { userService };
