import { Types } from "mongoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum DOCUMENT_STATUS {
  FAILED = "failed",
  UPLOADED = "uploaded",
  PROCESSING = "processing",
  COMPLETED = "completed",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Document {
  _id: Types.ObjectId;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  content: string;
}
