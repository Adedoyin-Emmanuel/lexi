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
  IValidationMetadata,
} from "./interfaces";
import { User } from "../user";
import { Chat } from "../chat";
import { IStructuredContract } from "../../jobs/analyze/pipeline/structuring/types";

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

  @prop({
    required: false,
    type: String,
    enum: DOCUMENT_STATUS,
    default: DOCUMENT_STATUS.PENDING,
  })
  status: DOCUMENT_STATUS;

  @prop({ required: false, default: {} })
  structuredContract?: IStructuredContract;

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

  @prop({ required: false, default: {} })
  validationMetadata?: IValidationMetadata;

  @prop({ required: false, default: false })
  isFlagged: boolean; /** Whether a document is flagged for not being a valid contract */
}
const DocumentModel = getModelForClass(Document);

export { DocumentModel, Document };
