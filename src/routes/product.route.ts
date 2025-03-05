import express from "express";
import Controller from "../controllers/product.controller";
import TokenHandler from "../services/token.service";
import * as UserService from "../services/user.service";
import { validate } from "../middlewares/validation.handler";
import ProductValidationHandler from "../middlewares/productValidation.handler";
import * as FileHandler from "../middlewares/file.handler";

const router = express.Router();

router.post(
  "/create",
  TokenHandler.verifyToken,
  UserService.validateUser,
  FileHandler.csvFileValidation,
  Controller.createProduct,
);

router.get(
  "/:productId",
  TokenHandler.verifyToken,
  UserService.validateUser,
  validate(ProductValidationHandler.getProduct),
  Controller.getProductById,
);
router.delete(
  "/:productId",
  TokenHandler.verifyToken,
  UserService.validateUser,
  validate(ProductValidationHandler.getProduct),
  Controller.deleteProductById,
);

router.post(
  "/list",
  TokenHandler.verifyToken,
  UserService.validateUser,
  validate(ProductValidationHandler.getProducts),
  Controller.getProductsByUserId,
);

router.patch(
  "/:productId",
  TokenHandler.verifyToken,
  UserService.validateUser,
  validate(ProductValidationHandler.updateProduct),
  Controller.updateProductById,
);

export default router;
