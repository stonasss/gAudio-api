import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
