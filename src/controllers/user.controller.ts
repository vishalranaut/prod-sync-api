import * as httpStatus from "http-status";
import { UserService } from "../services";
import TokenHandler from "../services/token.service";
import SetResponse from "../utils/responseHandler";
import MESSAGES from "../constants/response.message";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

export class Controller {
  userRegister = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = req.body;

      const response = await UserService.createUser(data);

      SetResponse.success(res, httpStatus.status.OK, {
        data: response,
        message: MESSAGES.USER.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("User Registration Error:", error);
      next(error);
    }
  };

  userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.USER.LOGIN.WRONG_EMAIL,
          error: true,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.LOGIN.WRONG_DETAILS,
          error: true,
        });
      }

      const tokenResponse: any = await TokenHandler.generateAuthTokens(
        user._id,
      );

      if (!tokenResponse.error) {
        return SetResponse.success(res, httpStatus.status.OK, {
          data: { user, token: tokenResponse.refresh.token },
          message: MESSAGES.USER.LOGIN.SUCCESS,
          error: false,
        });
      } else {
        return SetResponse.error(res, httpStatus.status.INTERNAL_SERVER_ERROR, {
          message: tokenResponse.message,
          error: true,
        });
      }
    } catch (error: any) {
      console.error("User Login Error:", error);
      next(error);
    }
  };

  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req.user._id;
      const user = await UserService.findUserByUserId(userId as string);

      if (!user) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.USER.NOT_FOUND,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: user,
        message: MESSAGES.USER.PROFILE.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Get User Profile Error:", error);
      next(error);
    }
  };

  changeUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req.user._id;
      const { oldPassword, newPassword } = req.body;

      const user = await UserService.findUserByUserId(userId as string);
      if (!user) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.USER.NOT_FOUND,
          error: true,
        });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.LOGIN.WRONG_DETAILS,
          error: true,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const userInfo = await UserService.updateUserByUserId(userId as string, {
        password: hashedPassword,
      });

      if (!userInfo) {
        return SetResponse.error(res, httpStatus.status.NOT_MODIFIED, {
          message: MESSAGES.USER.UPDATE.PASSWORD_UPDATE_FAILURE,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: userInfo,
        message: MESSAGES.USER.UPDATE.PASSWORD_UPDATE_SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Update User Password Error:", error);
      next(error);
    }
  };

  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req.user._id;
      const user = await UserService.findUserByUserId(userId as string);

      if (!user) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.USER.NOT_FOUND,
          error: true,
        });
      }

      SetResponse.success(res, httpStatus.status.OK, {
        data: user,
        message: MESSAGES.USER.PROFILE.SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.error("Get User Error:", error);
      next(error);
    }
  };
  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return SetResponse.error(res, httpStatus.status.UNAUTHORIZED, {
          message: MESSAGES.USER.UNAUTHORIZED,
          error: true,
        });
      }
      const userId = req?.user._id as string;
      const data = req.body;

      // Find user by ID
      const user = await UserService.findUserByUserId(userId);
      if (!user) {
        return SetResponse.error(res, httpStatus.status.NOT_FOUND, {
          message: MESSAGES.USER.NOT_FOUND,
          error: true,
        });
      }

      // Update the user
      const updatedUser = await UserService.updateUserByUserId(userId, data);

      return SetResponse.success(res, httpStatus.status.OK, {
        data: updatedUser,
        message: MESSAGES.USER.UPDATE.SUCCESS,
        error: false,
      });
    } catch (error) {
      console.error("Update User Error:", error);
      next(error);
    }
  };
}

export default new Controller();
