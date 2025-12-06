import {
    userValidation,
    userModel,
    userListQueryValidation,
    updateUserValidation,
    idValidation
} from "../models/userModel.js";
import response from "../utils/response.js";
import { resStatusCode, resMessage } from "../utils/constants.js";
import { generateJWToken } from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from "bcrypt";

export const signUp = asyncHandler(async (req, res) => {
    // console.log(req.file.filename)
    const { email, password } = req.body;
    const { error } = userValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    console.log(req.body)
    const existingUser = await userModel.findOne({ email, isActive: true })
    if (existingUser) {
        return response.error(res, resStatusCode.CONFLICT, resMessage.USER_ALREADY_EXISTS, {});
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, password: hashedPassword });
    const resData = {
        _id: newUser._id,
        email: newUser.email,
    };
    return response.success(res, resStatusCode.CREATED, resMessage.USER_REGISTER, resData);
});

export const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { error } = userValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    const user = await userModel.findOne({ email, isActive: true })
    if (!user) {
        return response.error(res, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return response.error(res, resStatusCode.UNAUTHORISED, resMessage.INCORRECT_PASSWORD, {});
    };

    const tokenPayload = {
        _id: user._id,
        email: user.email,
    };
    const accessToken = await generateJWToken(tokenPayload);
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, {
        _id: user._id,
        token: accessToken,
    });
});

export const getUsersList = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { error } = userListQueryValidation.validate(req.query);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    const totalUsers = await userModel.countDocuments({ isActive: true });

    const users = await userModel.find({ isActive: true }).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 });
    const resData = {
        records: users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        limit,
    };
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.LIST_FETCHED_SUCCESSFULLY, resData);
});

export const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    const user = await userModel.findById({ _id: userId }).select("-password");
    if (!user) {
        return response.error(res, resStatusCode.FORBIDDEN, resMessage.NO_DATA_FOUND);
    };
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.FETCHED_SUCCESSFULLY, user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    // const userId = req.user._id; // token user
    const { error } = updateUserValidation.validate(req.body);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const { name, email, isActive } = req.body;

    const updateData = {};
    if (email) updateData.email = email;
    if (typeof isActive === "boolean") {
        updateData.isActive = isActive;
    };
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.UPDATED_SUCCESSFULLY, updatedUser);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { error } = idValidation.validate(id);
    if (error) {
        return response.error(res, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    const user = await userModel.findById({ _id: id });

    user.isActive = false;
    await user.save();
    return response.success(res, resStatusCode.ACTION_COMPLETE, resMessage.DELETED_SUCCESSFULLY, { _id: userId });
});
