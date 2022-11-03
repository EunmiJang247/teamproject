import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    personwhoordered: {
      type: Schema.Types.ObjectId,
      ref: "UserSchema"
    },
    cart: {
        type: Object,
        required: true,
    },
    totalprice: {
      type: Number,
    },
    deliverystatus: {
        type: String,
        required: true,
        default: "입금확인",
        // enum:["입금확인","상품준비","상품발송","배송중","배송완료"]
    },
    address:{
        type: String,
    },
    recipientname:{
        type: String,
    },
    recipientphonenumber:{
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

export { OrderSchema };
