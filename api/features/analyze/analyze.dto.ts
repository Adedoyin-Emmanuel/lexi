import Joi from "joi";

export const analyzeSchema = Joi.object({
  key: Joi.string().required(),
  type: Joi.string().required(),
  content: Joi.string().required(),
  name: Joi.string().required().max(200),
});
