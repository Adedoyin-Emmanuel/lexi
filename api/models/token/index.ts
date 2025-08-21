import { Types } from "mongoose";
import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

import { User } from "../user";

enum TOKEN_TYPE {
  REFRESH_TOKEN = "REFRESH_TOKEN",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Token {
  _id: Types.ObjectId;

  @prop({ ref: () => User, required: true })
  userId: Types.ObjectId;

  @prop({ required: true })
  token: string;

  @prop({ required: true, enum: TOKEN_TYPE })
  type: TOKEN_TYPE;

  @prop({ required: true })
  expiresAt: Date;
}

const TokenModel = getModelForClass(Token);

export { TokenModel, Token, TOKEN_TYPE };
