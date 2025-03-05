/** @format */

import morgan from "morgan";
import config from "./config";
import { logger } from "./logger";

morgan.token("message", (_req, res: any) => res.locals.errorMessage || "");

const getIpFormat = () =>
  config.env === "production" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (_req: any, res: any) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: any, res: any) => res.statusCode < 400,
  stream: { write: (message: any) => logger.error(message.trim()) },
});
