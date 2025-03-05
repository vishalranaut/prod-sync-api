import Joi from "joi";
import { objectId } from "./customValidation.handler";

export class ProductValidationHandler {
  createProduct = {
    body: Joi.object().keys({
      product_name: Joi.string().min(2).max(255).required().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name cannot be empty",
        "string.min": "Product name must have at least 2 characters",
        "string.max": "Product name cannot exceed 255 characters",
        "any.required": "Product name is required",
      }),
      category: Joi.string().min(2).max(100).required().messages({
        "string.base": "Category must be a string",
        "string.empty": "Category cannot be empty",
        "string.min": "Category must have at least 2 characters",
        "string.max": "Category cannot exceed 100 characters",
        "any.required": "Category is required",
      }),
      price: Joi.number().positive().precision(2).required().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than zero",
        "number.precision": "Price cannot have more than 2 decimal places",
        "any.required": "Price is required",
      }),
      stock: Joi.number().integer().min(0).required().messages({
        "number.base": "Stock must be a number",
        "number.integer": "Stock must be an integer",
        "number.min": "Stock cannot be negative",
        "any.required": "Stock is required",
      }),
      user: Joi.string().custom(objectId).required().messages({
        "any.required": "User ID is required",
      }),
    }),
  };

  updateProduct = {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required().messages({
        "any.required": "Product ID is required",
      }),
    }),
    body: Joi.object()
      .keys({
        product_name: Joi.string().min(2).max(255),
        category: Joi.string().min(2).max(100),
        price: Joi.number().positive().precision(2),
        stock: Joi.number().integer().min(0),
      })
      .or("product_name", "category", "price", "stock")
      .messages({
        "object.missing": "At least one field must be updated",
      }),
  };

  deleteProduct = {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required().messages({
        "any.required": "Product ID is required",
      }),
    }),
  };

  getProduct = {
    params: Joi.object().keys({
      productId: Joi.string().custom(objectId).required().messages({
        "any.required": "Product ID is required",
      }),
    }),
  };

  getProducts = {
    body: Joi.object().keys({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().allow("").optional(),
      category: Joi.string().optional(),
      minPrice: Joi.number().min(0).optional(),
      maxPrice: Joi.number().greater(Joi.ref("minPrice")).optional(),
    }),
  };
}

export default new ProductValidationHandler();
