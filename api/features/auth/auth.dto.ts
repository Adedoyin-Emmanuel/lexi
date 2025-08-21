import Joi from "joi";

export const signInSchema = Joi.object({
  redirectUrl: Joi.string().uri().required(),
});
