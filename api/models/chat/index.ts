import { Types } from "mongoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

import { User } from "../user";
import { Document } from "../document";

export interface IMessage {
  id: string;
  createdAt: Date;
  content: string;
  role: "user" | "assistant";
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Chat {
  _id: Types.ObjectId;

  @prop({ required: true, ref: () => User })
  userId: Types.ObjectId;

  @prop({ required: true, ref: Document })
  documentId: Types.ObjectId;

  @prop({ required: true, default: [] })
  messages: IMessage[];
}

const ChatModel = getModelForClass(Chat);

export { ChatModel, Chat };
