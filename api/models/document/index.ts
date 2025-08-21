import {
  Ref,
  prop,
  modelOptions,
  getModelForClass,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

import {
  IRisk,
  IClase,
  ISummary,
  IHighlight,
  IObligation,
  ISuggestion,
  DOCUMENT_STATUS,
} from "./interfaces";
import { User } from "../user";
import { Chat } from "../chat";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Document {
  _id: Types.ObjectId;

  @prop({ required: true, ref: () => User })
  userId: Types.ObjectId;

  @prop({ required: true })
  title: string;

  @prop({ required: false, type: () => Object })
  summary: ISummary;

  @prop({ required: false, type: String, enum: DOCUMENT_STATUS })
  status: DOCUMENT_STATUS;

  @prop({ required: false, default: "" })
  failureReason: string;

  @prop({ type: () => [Object], default: [] })
  clauses?: IClase[];

  @prop({ type: () => [Object], default: [] })
  risks?: IRisk[];

  @prop({ type: () => [Object], default: [] })
  obligations?: IObligation[];

  @prop({ required: false, default: [] })
  highlights?: IHighlight[];

  @prop({ required: false, default: [] })
  suggestions?: ISuggestion[];

  @prop({ required: false, default: [] })
  chats?: Ref<Chat>[];

  @prop({ default: false })
  hasAbstainWarnings: boolean;
}
const DocumentModel = getModelForClass(Document);

export { DocumentModel, Document };
