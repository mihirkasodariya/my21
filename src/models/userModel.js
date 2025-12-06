import Joi from "joi";
import mongoose, { model } from "mongoose";
const { Schema, Types } = mongoose;
import { dbTableName } from "../utils/constants.js"

const userSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);
export const userModel = model(dbTableName.USER, userSchema);

export const userValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
});

export const idValidation = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
        "string.base": "ID must be a string",
        "string.empty": "ID is required",
        "string.length": "ID must be exactly 24 characters",
        "string.hex": "ID must be a valid hexadecimal string",
        "any.required": "ID is required",
    }),
});

export const userListQueryValidation = Joi.object({
    page: Joi.number().integer().min(1).optional().messages({
        "number.base": "Page must be a number",
        "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).optional().messages({
        "number.base": "Limit must be a number",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit must not exceed 100"
    }),
});

export const updateUserValidation = Joi.object({
    name: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    isActive: Joi.boolean().optional(),
}).or("name", "email", "password", "isActive")
    .messages({
        "object.missing": "At least one field must be provided for update",
    });
