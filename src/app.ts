/** @format */

import express, { Express } from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import httpStatus from "http-status";
import config from "./config/config";
import * as morgan from "./config/morgan";
import { errorConverter, errorHandler } from "./middlewares/error";
import { ApiError } from "./utils/apiError";
import connectMongoDB from "./db/connection";
import routes from "./routes";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

// Connect to MongoDB
connectMongoDB();
const app: Express = express();

const swaggerDocument = YAML.load(join(__dirname, "swagger.yml"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors.default());
app.options("*", cors.default());

// Logging Middleware
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Set up Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// View Engine
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Health Check Endpoint
app.use("/_healthcheck", async (_req, res, _next) => {
  const _healthCheck: any = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(_healthCheck);
  } catch (error) {
    _healthCheck.message = error;
    res.status(503).send();
  }
});

// API Routes
routes(app);

// 404 Not Found Handler
const handleNotFound = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  next(new ApiError(httpStatus.NOT_FOUND, "API path not found"));
};
app.use(handleNotFound);

// Error Handler Middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";
    res
      .status(statusCode)
      .json({ message: message, status: statusCode, error: true });
  }
);

// Convert errors to ApiError & Handle errors
app.use(errorConverter);
app.use(errorHandler);

export default app;
