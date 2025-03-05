import Joi from "joi";
import { password, objectId } from "./customValidation.handler";

export class UserValidationHandler {
  register = {
    body: Joi.object().keys({
      email: Joi.string().email().min(5).max(255).required(),
      password: Joi.string().custom(password).min(8).max(128).required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .custom(password)
        .label("Confirm Password")
        .messages({
          "any.only": "Passwords do not match",
        }),
      name: Joi.string().required(),
    }),
  };

  login = {
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().min(8).max(128).required(),
    }),
  };
  updateUser = {
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
  };

  logout = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  };

  changeUserPassword = {
    body: Joi.object().keys({
      oldPassword: Joi.string().custom(password).min(8).max(128).required(),
      newPassword: Joi.string().custom(password).min(8).max(128).required(),
    }),
  };
}
export default new UserValidationHandler();
