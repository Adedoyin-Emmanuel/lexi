import { Types } from "mongoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum USER_TYPE {
  CREATOR = "creator",
  FREELANCER = "freelancer",
  NOT_SPECIFIED = "not_specified",
}

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

  @prop({ required: false, default: "" })
  displayName: string;

  @prop({ required: false, default: USER_TYPE.NOT_SPECIFIED })
  userType: USER_TYPE;

  @prop({ required: false, default: [] })
  specialities: string[]; /** The domain the user works in (e.g. "software development", "design", "marketing", etc.) */

  @prop({ required: false })
  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: false })
  avatar: string;

  @prop({ required: true })
  lastLogin: Date;
}

const UserModel = getModelForClass(User);

export { UserModel, User };
