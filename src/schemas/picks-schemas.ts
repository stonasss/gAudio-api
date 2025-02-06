import Joi from "joi";

export const pickSchema = Joi.object({
    image: Joi.string().uri().required(),
    title: Joi.string().allow(""),
    description: Joi.string().required(),
    link: Joi.string().allow(""),
});