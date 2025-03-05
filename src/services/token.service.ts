import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import config from "../config/config";
import { User } from "../models";
import { ApiError } from "../utils/apiError";
import { tokenTypes } from "../config/types";
import ResponseHelper from "../utils/responseHandler";
import MESSAGES from "../constants/response.message";
import { Request, Response, NextFunction } from "express";

export class TokenHandler {
  /**
   * Generate token
   * @param {string} _id
   * @param {moment.Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  generateToken(
    _id: string,
    expires: moment.Moment,
    type: string,
    secret: string = config.jwt.secret,
  ): string {
    const payload = {
      _id,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }

  /**
   * Save a token
   * @param {string} token
   * @param {string} userId
   * @param {moment.Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<any>}
   */
  async saveToken(
    token: string,
    userId: string,
    expires: moment.Moment,
    type: string,
    blacklisted = false,
  ): Promise<any> {
    const user = await User.getUserById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Remove old tokens with the same type
    user.tokens = user.tokens.filter((t: any) => t.type !== type);
    user.tokens.push({
      token,
      expires: expires.toDate(),
      type,
      blacklisted,
    });

    await User.updateUserById(userId, {
      tokens: user.tokens,
    });

    return user.tokens[user.tokens.length - 1]; // Return the saved token
  }

  /**
   * Verify token and return user data (or throw an error if it is not valid)
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   */
  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = req.header("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return ResponseHelper.error(res, httpStatus.UNAUTHORIZED, {
          message: MESSAGES.JWT.ERROR,
          error: true,
          status: httpStatus.UNAUTHORIZED,
        });
      }

      const token = authHeader.split(" ")[1];

      if (!config.jwt.secret) {
        throw new Error(MESSAGES.JWT.SECRET_ERROR);
      }

      const user = await User.getUserByToken(token, new Date());

      if (!user) {
        throw new Error(MESSAGES.AUTH.TOKEN.VERIFY.expired_token);
      }

      const aud = jwt.verify(token, config.jwt.secret);
      // @ts-ignore
      req.user = aud;

      next();
    } catch (error) {
      return ResponseHelper.error(res, httpStatus.UNAUTHORIZED, {
        message: MESSAGES.AUTH.TOKEN.VERIFY.expired_token,
        error: true,
        status: httpStatus.UNAUTHORIZED,
      });
    }
  }

  /**
   * Generate auth tokens
   * @param {any} user
   * @returns {Promise<Object>}
   */
  async generateAuthTokens(user: any): Promise<Object> {
    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days",
    );
    const refreshToken = this.generateToken(
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH,
    );
    await this.saveToken(
      refreshToken,
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH,
    );

    return {
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  /**
   * Generate verify email token
   * @param {any} user
   * @returns {Promise<string>}
   */
  async generateVerifyEmailToken(user: any): Promise<string> {
    const expires = moment().add(
      config.jwt.verifyEmailExpirationMinutes,
      "minutes",
    );
    const verifyEmailToken = this.generateToken(
      user._id,
      expires,
      tokenTypes.VERIFY_EMAIL,
    );
    await this.saveToken(
      verifyEmailToken,
      user._id,
      expires,
      tokenTypes.VERIFY_EMAIL,
    );
    return verifyEmailToken;
  }

  /**
   * Remove token by ID
   * @param {string} _id
   * @returns {Promise<any>}
   */
  async removeTokenById(_id: string): Promise<any> {
    return await User.updateUserById(_id, { $pull: { tokens: {} } });
  }
}

export default new TokenHandler();
