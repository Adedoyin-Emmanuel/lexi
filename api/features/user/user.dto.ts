import Joi from "joi";
import { USER_TYPE } from "../../models/user";

export const onboardUserSchema = Joi.object({
  displayName: Joi.string().max(20).required(),
  userType: Joi.string()
    .valid(USER_TYPE.FREELANCER, USER_TYPE.CREATOR)
    .required(),
  specialities: Joi.array().items(Joi.string()).default([]),
});

export const updateUserDetailsSchema = Joi.object({
  displayName: Joi.string().max(20).required(),
  userType: Joi.string()
    .valid(USER_TYPE.FREELANCER, USER_TYPE.CREATOR)
    .required(),
  specialities: Joi.array().items(Joi.string()).default([]),
});
