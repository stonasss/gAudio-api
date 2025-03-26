import Joi from "joi";

export const reviewSchema = Joi.object({
    description: Joi.string().allow(""),
    relisten: Joi.boolean().required(),
    pickId: Joi.string().required()
});

export const updateReviewSchema = Joi.object({
    description: Joi.string().allow(""),
    relisten: Joi.boolean().required()
});