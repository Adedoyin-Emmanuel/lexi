import { Types } from "mongoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class User {
  _id: Types.ObjectId;

  @prop({ required: true, unique: true })
  googleId: string;

  /**
   * This doesn't change, helps to identify a user internally
   */
  @prop({ required: true })
  googleDisplayName: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: false })
  avatar: string;

  @prop({ required: true })
  lastLogin: Date;
}

const UserModel = getModelForClass(User);

export { UserModel, User };
