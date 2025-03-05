/** @format */

import * as httpStatus from "http-status";
import { User } from "../models";
import { ApiError } from "../utils/apiError";
import MESSAGES from "../constants/response.message";
import ResponseHelper from "../utils/responseHandler";
import { logger } from "../config/logger";
import * as Interfaces from "../interfaces";
export const createUser = async (data: Interfaces.SignupUser): Promise<any> => {
  try {
    const user = await User.createUser(data);

    return user;
  } catch (error) {
    logger.error("Error retrieving user :", error);
    throw error;
  }
};
export const findUserByEmail = async (email: string): Promise<any> => {
  try {
    const user = await User.getUserByEmail(email);

    return user;
  } catch (error) {
    logger.error("Error retrieving user by email:", error);
    throw error;
  }
};

export const findUserByUserId = async (userId: string): Promise<any> => {
  try {
    return await User.getUserById(userId);
  } catch (error) {
    logger.error("Error retrieving user by ID:", error);
    throw error;
  }
};

export const validateUser = async (
  req: any,
  res: any,
  next: any,
): Promise<void> => {
  try {
    const userId = req.user._id;
    const userInfo = await User.getUserById(userId);

    if (!userInfo) {
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        MESSAGES.USER.UNAUTHORIZED,
      );
    }
    return next();
  } catch (error) {
    return ResponseHelper.error(res, httpStatus.status.UNAUTHORIZED, {
      message: MESSAGES.USER.FAILURE,
      error: true,
      status: httpStatus.status.UNAUTHORIZED,
    });
  }
};
export const validateUserByEmail = async (
  req: any,
  res: any,
  next: any,
): Promise<void> => {
  try {
    const email = req.body.email;

    const userInfo = await User.getUserByEmail(email);
    if (userInfo) {
      throw new ApiError(
        httpStatus.status.CONFLICT,
        MESSAGES.USER.ALREADY_EXISTS,
      );
    }
    return next();
  } catch (error) {
    return ResponseHelper.error(res, httpStatus.status.UNAUTHORIZED, {
      message: MESSAGES.USER.FAILURE,
      error: true,
      status: httpStatus.status.INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateUserByUserId = async (
  userId: string,
  updateBody: Record<string, unknown>,
): Promise<any> => {
  try {
    const userData = await findUserByUserId(userId);
    if (!userData) {
      throw new ApiError(httpStatus.status.NOT_FOUND, "User not found");
    }

    const updateUser = await User.updateUserById(userId, updateBody);

    return updateUser;
  } catch (error) {
    logger.error("Error updating admin by ID:", error);
    throw error;
  }
};

export const updateUserByEmail = async (
  email: string,
  updateBody: Record<string, unknown>,
): Promise<any> => {
  try {
    const updateUser = await User.updateUserByEmail(email, updateBody);

    return updateUser;
  } catch (error) {
    logger.error("Error updating admin by email:", error);
    throw error;
  }
};

export const changePasswordByUserId = async (
  userId: string,
  newPassword: string,
): Promise<any> => {
  try {
    const updateUser = await User.updateUserById(userId, {
      password: newPassword,
    });

    return updateUser;
  } catch (error) {
    logger.error("Error changing password by user ID:", error);
    throw error;
  }
};

export const updateOtpByEmail = async (
  email: string,
  updateBody: Record<string, unknown>,
): Promise<any> => {
  try {
    const updateUser = await User.updateUserByEmail(email, updateBody);
    if (!updateUser) throw { message: MESSAGES.USER.NOT_FOUND };
    return updateUser;
  } catch (error) {
    logger.error("Error updating admin by email:", error);
    throw error;
  }
};
