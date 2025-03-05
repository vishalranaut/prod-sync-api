/** @format */

import Joi from "joi";
import httpStatus from "http-status";
import pick from "../utils/pick";
import { ApiError } from "../utils/apiError";
import { logger } from "../config/logger";
export const validate = (schema: any) => (req: any, res: any, next: any) => {
  // logger.info("schema",schema)
  // logger.info("schema",req.body)
  const validSchema = pick(schema, ["params", "query", "body"]);
  // logger.info("validSchema",validSchema)
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);
  logger.info("object", object);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  // logger.info("final",value)
  // logger.info("value",value)
  Object.assign(req, value);
  return next();
};
