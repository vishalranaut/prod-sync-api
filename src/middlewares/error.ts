/** @format */

import * as httpStatus from "http-status";
import config from "../config/config";
import { logger } from "../config/logger";
import { ApiError } from "../utils/apiError";

export const errorConverter = (err: any, req: any, res: any, next: any) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error.name === "ValidationError"
        ? httpStatus.status.BAD_REQUEST
        : httpStatus.status.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus.status[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  let { statusCode, message } = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
    message = httpStatus.status[httpStatus.status.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
