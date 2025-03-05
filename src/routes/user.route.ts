import express from "express";
import Controller from "../controllers/user.controller";
import TokenHandler from "../services/token.service";
import * as UserService from "../services/user.service";
import { validate } from "../middlewares/validation.handler";
import UserValidationHandler from "../middlewares/userValidation.handler";

const router = express.Router();

router.post(
  "/signup",
  validate(UserValidationHandler.register),
  UserService.validateUserByEmail,
  Controller.userRegister,
);

router.post(
  "/login",
  validate(UserValidationHandler.login),
  Controller.userLogin,
);

router.get(
  "/profile",
  TokenHandler.verifyToken,
  UserService.validateUser,
  Controller.getUserProfile,
);

router.patch(
  "/profile",
  TokenHandler.verifyToken,
  UserService.validateUser,
  validate(UserValidationHandler.updateUser),
  Controller.updateUserProfile,
);

export default router;
